import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

/** Thrown by services for expected, user-facing failures. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Wraps an async handler so a rejected promise reaches the error middleware. */
export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found.' });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Please check the highlighted fields.',
      details: err.flatten().fieldErrors as Record<string, string[]>
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  // Duplicate key — almost always a repeated email on signup.
  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'An account with that email already exists.' });
    return;
  }

  console.error('[error]', err);
  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';

  res.status(500).json({
    error: message
  });
}
