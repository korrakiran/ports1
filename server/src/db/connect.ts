import mongoose from 'mongoose';
import { env } from '../config/env.js';

/**
 * Connects to MongoDB. Swap MONGODB_URI in .env when the production connection
 * string is available — nothing else in the codebase needs to change.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
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
}
