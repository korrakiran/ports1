import type { Request, Response } from 'express';
import { createApp } from '../server/src/app.js';
import { connectDatabase } from '../server/src/db/connect.js';

const app = createApp();

export default async function handler(req: Request, res: Response) {
  await connectDatabase();
  return app(req, res);
}
