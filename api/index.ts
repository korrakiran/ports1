import type { Request, Response } from 'express';
import { createApp } from '../server/src/app.js';
import { connectDatabase } from '../server/src/db/connect.js';

let appInstance: ReturnType<typeof createApp> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    await connectDatabase();
    if (!appInstance) {
      appInstance = createApp();
    }
    return appInstance(req, res);
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[vercel-serverless-error]', msg);
    return res.status(500).json({
      error: `Database connection failed: ${msg}. Please verify your MONGODB_URI in Vercel project environment variables.`
    });
  }
}
