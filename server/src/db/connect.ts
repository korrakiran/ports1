import mongoose from 'mongoose';
import { env } from '../config/env.js';

let isConnected = false;

/**
 * Connects to MongoDB with connection caching for serverless deployments (Vercel).
 */
export async function connectDatabase(): Promise<void> {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    const { host, name } = mongoose.connection;
    console.log(`[db] connected to ${host}/${name}`);
  } catch (err) {
    console.error(`[db] failed to connect to ${env.MONGODB_URI}`);
    console.error(err instanceof Error ? err.message : err);
    throw err;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  isConnected = false;
}
