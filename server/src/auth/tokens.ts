import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { env } from '../config/env.js';

export const AUTH_COOKIE = 'portsai_token';

export interface TokenPayload {
  sub: string;
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies TokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string' || !decoded.sub) return null;
    return { sub: String(decoded.sub) };
  } catch {
    return null;
  }
}

/**
 * The token lives in an httpOnly cookie rather than localStorage so that a
 * cross-site scripting bug cannot read it. `sameSite: lax` still permits the
 * Next dev server (localhost:3000) to call the API (localhost:4000), since
 * differing ports are same-site.
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    path: '/'
  });
}
