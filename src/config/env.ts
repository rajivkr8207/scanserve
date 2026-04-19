/**
 * Runtime environment config with fail-fast validation.
 * Import this instead of process.env directly so missing vars fail at startup,
 * not randomly at request time.
 */
export const env = {
  MONGODB_URI: process.env.MONGODB_URI ?? (() => { throw new Error('MONGODB_URI is required') })(),
  JWT_SECRET: process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET is required') })(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
} as const
