import mongoose from 'mongoose';
import { env } from '../config/env.js';

let connectionPromise: Promise<mongoose.Mongoose> | null = null;

/**
 * Connects to MongoDB with robust connection reuse for Vercel serverless functions.
 */
export function connectDatabase(): Promise<mongoose.Mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set('strictQuery', true);
  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10
    })
    .then((m) => {
      console.log(`[db] connected to ${m.connection.host}/${m.connection.name}`);
      return m;
    })
    .catch((err) => {
      connectionPromise = null;
      console.error(`[db] failed to connect to MONGODB_URI:`, err instanceof Error ? err.message : err);
      throw err;
    });

  return connectionPromise;
}

export function getMongoClientPromise(): Promise<any> {
  return connectDatabase().then((m) => m.connection.getClient());
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
}
