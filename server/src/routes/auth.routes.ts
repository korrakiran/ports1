import { Router } from 'express';
import { z } from 'zod';
import type { PublicUser } from '@shared/types';
import { User, hashPassword, type UserDocument } from '../models/User.js';
import { Analysis } from '../models/Analysis.js';
import { SESSION_COOKIE } from '../auth/session.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { HttpError, asyncHandler } from '../middleware/errors.js';
import { env } from '../config/env.js';

const router = Router();

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(200, 'Password is too long.')
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.')
});

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  };
}

/* Helper to safely save session in serverless environment without crashing user requests */
function saveSession(req: any): Promise<void> {
  return new Promise((resolve) => {
    if (!req.session) return resolve();
    req.session.save((err: any) => {
      if (err) {
        console.error('[session] Store save error:', err);
      }
      resolve();
    });
  });
}

/* POST /api/auth/signup */
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, email, password } = signupSchema.parse(req.body);

    if (await User.exists({ email })) {
      throw new HttpError(409, 'An account with that email already exists.');
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password)
    });

    if (req.session) {
      req.session.userId = String(user._id);
      await saveSession(req);
    }

    res.status(201).json({ user: toPublicUser(user) });
  })
);

/* POST /api/auth/login */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpError(401, 'Incorrect email or password.');
    }

    if (req.session) {
      req.session.userId = String(user._id);
      await saveSession(req);
    }

    res.json({ user: toPublicUser(user) });
  })
);

import { OAuth2Client } from 'google-auth-library';
let googleClient: OAuth2Client | null = null;

/* POST /api/auth/google-login */
router.post(
  '/google-login',
  asyncHandler(async (req, res) => {
    const { idToken } = z
      .object({ idToken: z.string().min(1) })
      .parse(req.body);

    if (!env.GOOGLE_CLIENT_ID) {
      throw new HttpError(500, 'Google Client ID is not configured on the server.');
    }

    if (!googleClient) {
      googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID
      });
    } catch (err: any) {
      throw new HttpError(400, `Google login failed: ${err.message}`);
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new HttpError(400, 'Invalid Google ID token payload.');
    }

    const { email, sub: googleId, name } = payload;

    // Find user by Google ID or by email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user (passwordHash is not set since they used OAuth)
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId
      });
    } else {
      // If user exists but googleId is not linked, link it now
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    if (req.session) {
      req.session.userId = String(user._id);
      await saveSession(req);
    }

    res.json({ user: toPublicUser(user) });
  })
);

/* POST /api/auth/logout */
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[auth] failed to destroy session:', err);
      }
      res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        path: '/'
      });
      res.json({ ok: true });
    });
  } else {
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'lax',
      path: '/'
    });
    res.json({ ok: true });
  }
});

/* GET /api/auth/me — drives session persistence on the client */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) throw new HttpError(401, 'Account no longer exists.');
    res.json({ user: toPublicUser(user) });
  })
);

/* GET /api/auth/profile — user info and their previous analyses */
router.get(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [user, analyses] = await Promise.all([
      User.findById(req.userId),
      Analysis.find({ userId: req.userId }).sort({ createdAt: -1 })
    ]);

    if (!user) throw new HttpError(401, 'Account no longer exists.');

    const items = analyses.map((a) => {
      const isLegacy =
        !Array.isArray(a.result?.understanding?.matchedProducts) ||
        a.result?.recommendations?.some((r: any) => typeof r?.tradeValue !== 'number');

      return {
        id: String(a._id),
        description: a.description ?? 'Unnamed product',
        createdAt: a.createdAt.toISOString(),
        category: a.result?.understanding?.matchedProducts?.[0]?.hs4 ?? null,
        marketCount: a.result?.recommendations?.length ?? 0,
        legacy: isLegacy
      };
    });

    res.json({
      user: toPublicUser(user),
      analyses: items
    });
  })
);

export default router;
