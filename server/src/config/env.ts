import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment configuration, validated once at boot so a misconfigured deploy
 * fails immediately and loudly rather than at the first request.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  /** Replace with the production connection string when it is provided. */
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/portsai'),

  /**
   * Must be set explicitly in production — a default secret would make every
   * issued token forgeable by anyone who has read the source.
   */
  JWT_SECRET: z.string().min(16).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),

  /** Origin allowed to send credentialed requests. */
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),

  /** Optional. Without it, image analysis is skipped and matching uses the
   *  written description only. */
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

if (raw.NODE_ENV === 'production' && !raw.JWT_SECRET) {
  console.error('JWT_SECRET must be set in production. Refusing to start with a generated secret.');
  process.exit(1);
}

if (!raw.JWT_SECRET) {
  console.warn(
    '[config] JWT_SECRET is not set — using an insecure development-only secret. ' +
      'Set JWT_SECRET in .env before deploying.'
  );
}

export const env = {
  ...raw,
  JWT_SECRET: raw.JWT_SECRET ?? 'dev-only-insecure-secret-change-me',
  isProduction: raw.NODE_ENV === 'production'
};
