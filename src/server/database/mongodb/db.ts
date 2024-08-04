import type mongoose from 'mongoose';

import { env } from '@/env';

import { MongoDBConnection } from './db.connection';

const dbConnection = new MongoDBConnection(env.MONGODB_URI);

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export const mongodbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = new Promise<typeof mongoose>((resolve, reject) => {
      dbConnection.connect(resolve, reject);
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
