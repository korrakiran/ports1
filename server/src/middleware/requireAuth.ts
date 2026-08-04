import type { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE, verifyToken } from '../auth/tokens.js';
import { User } from '../models/User.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Rejects the request unless it carries a valid session cookie whose subject
 * still resolves to an existing user — a token alone is not enough, since the
 * account may have been deleted since it was issued.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.[AUTH_COOKIE];

  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
    return;
  }

  const exists = await User.exists({ _id: payload.sub });
  if (!exists) {
    res.status(401).json({ error: 'Account no longer exists.' });
    return;
  }

  req.userId = payload.sub;
  next();
}
