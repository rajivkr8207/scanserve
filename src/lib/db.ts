import { env } from '@/config/env'
import mongoose from 'mongoose'

const MONGODB_URI = env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

/**
 * Cached connection object — prevents redundant connections in Next.js dev HMR.
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching#reusing-connections
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cached = global._mongooseCache ?? { conn: null, promise: null }
global._mongooseCache = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
