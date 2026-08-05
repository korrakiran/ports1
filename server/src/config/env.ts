import 'dotenv/config';
import { z } from 'zod';

const DEFAULT_ATLAS_URI =
  'mongodb+srv://kiran23911a35a1_db_user:uTXJOSDbM9dV5wn2@cluster0.lkbxp0l.mongodb.net/portsai?retryWrites=true&w=majority&appName=Cluster0';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default(DEFAULT_ATLAS_URI),
  SESSION_SECRET: z.string().optional(),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_VISION_MODEL: z.string().default('meta/llama-3.2-90b-vision-instruct')
});

const parsed = schema.safeParse(process.env);
const raw = parsed.success ? parsed.data : (process.env as any);

export const env = {
  NODE_ENV: raw.NODE_ENV || 'development',
  PORT: Number(raw.PORT) || 4000,
  MONGODB_URI: raw.MONGODB_URI && !raw.MONGODB_URI.includes('127.0.0.1') && !raw.MONGODB_URI.includes('localhost')
    ? raw.MONGODB_URI
    : (process.env.VERCEL || raw.NODE_ENV === 'production')
      ? DEFAULT_ATLAS_URI
      : (raw.MONGODB_URI || DEFAULT_ATLAS_URI),
  SESSION_SECRET: raw.SESSION_SECRET || 'portsai_default_production_session_secret_key_987654321',
  CLIENT_ORIGIN: raw.CLIENT_ORIGIN || 'http://localhost:3000',
  NVIDIA_API_KEY: raw.NVIDIA_API_KEY || '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',
  NVIDIA_VISION_MODEL: raw.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct',
  isProduction: raw.NODE_ENV === 'production' || Boolean(process.env.VERCEL)
};
