import mongoose from 'mongoose';
import { env } from '../config/env.js';

let connectionPromise: Promise<mongoose.Mongoose> | null = null;

/**
 * Connects to MongoDB with robust connection reuse and stale-promise eviction for Vercel serverless.
 */
export async function connectDatabase(): Promise<mongoose.Mongoose> {
  // If connection is already open and active, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If a connection attempt is in-flight, await it safely
  if (connectionPromise) {
    try {
      const m = await connectionPromise;
      if (m.connection.readyState === 1) return m;
    } catch {
      connectionPromise = null;
    }
  }

  mongoose.set('strictQuery', true);

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000
    })
    .then((m) => {
      console.log(`[db] connected to ${m.connection.host}/${m.connection.name}`);
      return m;
    })
    .catch((err) => {
      connectionPromise = null;
      console.error(`[db] connection failed:`, err instanceof Error ? err.message : err);
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
