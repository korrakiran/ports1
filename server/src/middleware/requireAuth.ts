import type { NextFunction, Request, Response } from 'express';
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
 * Middleware that guards routes requiring authentication. Reads the user's ID
 * from the active server session and verifies that the account exists in MongoDB.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const exists = await User.exists({ _id: userId });
  if (!exists) {
    res.status(401).json({ error: 'Account no longer exists.' });
    return;
  }

  req.userId = userId;
  next();
}
