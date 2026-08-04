import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment configuration, validated once at boot so a misconfigured deploy
 * fails immediately and loudly rather than at the first request.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  /** MongoDB connection string. */
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/portsai'),

  /** Secret key used to encrypt express-session cookies. */
  SESSION_SECRET: z.string().min(16).optional(),

  /** Origin allowed to send credentialed requests. */
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),

  /** Optional vision model configuration. */
  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_VISION_MODEL: z.string().default('meta/llama-3.2-90b-vision-instruct')
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

if (raw.NODE_ENV === 'production' && !raw.SESSION_SECRET) {
  console.error('SESSION_SECRET must be set in production.');
  process.exit(1);
}

export const env = {
  ...raw,
  SESSION_SECRET: raw.SESSION_SECRET ?? 'dev-only-insecure-session-secret-change-me',
  isProduction: raw.NODE_ENV === 'production'
};
