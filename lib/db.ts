// lib/db.ts
// MongoDB Atlas connection — singleton pattern for Next.js serverless
// Run first: npm install mongoose

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// Strict type check for global cache
// Global cache to prevent multiple connections in dev hot-reload
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

export async function connectDB(): Promise<mongoose.Connection> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define MONGODB_URI in your .env.local file.\n" +
        "Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kasilink?retryWrites=true&w=majority",
    );
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m.connection);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default connectDB;
