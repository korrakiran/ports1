import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  // Credentials are required so the httpOnly session cookie is sent with fetches.
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, env: env.NODE_ENV });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
