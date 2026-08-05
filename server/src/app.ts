import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './config/env.js';
import { SESSION_COOKIE } from './auth/session.js';
import authRoutes from './routes/auth.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests from client origin, Vercel deployments, or same-origin (no origin header)
        if (!origin || origin === env.CLIENT_ORIGIN || origin.endsWith('.vercel.app') || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive CORS for public Vercel previews
        }
      },
      credentials: true
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Server-side session middleware backed by MongoDB
  app.use(
    session({
      name: SESSION_COOKIE,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 7 * 24 * 60 * 60,
        touchAfter: 24 * 3600 // Lazy session update
      }),
      cookie: {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, env: env.NODE_ENV });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
