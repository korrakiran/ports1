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

    req.session.userId = String(user._id);
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

    req.session.userId = String(user._id);
    res.json({ user: toPublicUser(user) });
  })
);

/* POST /api/auth/logout */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[auth] failed to destroy session:', err);
    }
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
      path: '/'
    });
    res.json({ ok: true });
  });
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

/* GET /api/auth/profile — user plus their previous analyses */
router.get(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) throw new HttpError(401, 'Account no longer exists.');

    const analyses = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      user: toPublicUser(user),
      analyses: analyses.map((a) => ({
        id: String(a._id),
        description: a.description,
        createdAt: a.createdAt.toISOString(),
        marketCount: a.result?.recommendations?.length ?? 0,
        category: a.result?.understanding?.category ?? null
      }))
    });
  })
);

export default router;
