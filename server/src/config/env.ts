import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/portsai'),
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
  MONGODB_URI: raw.MONGODB_URI || 'mongodb://127.0.0.1:27017/portsai',
  SESSION_SECRET: raw.SESSION_SECRET || 'portsai_default_production_session_secret_key_987654321',
  CLIENT_ORIGIN: raw.CLIENT_ORIGIN || 'http://localhost:3000',
  NVIDIA_API_KEY: raw.NVIDIA_API_KEY,
  NVIDIA_VISION_MODEL: raw.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct',
  isProduction: raw.NODE_ENV === 'production'
};
