const isServer = typeof window === 'undefined'

function getEnv(key: string, defaultValue?: string) {
  const value = process.env[key] ?? defaultValue
  if (!value && isServer) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  MONGODB_URI: getEnv('MONGODB_URI'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
  PUSHER_APP_ID: process.env.PUSHER_APP_ID ?? '',
  PUSHER_KEY: process.env.PUSHER_KEY ?? '',
  PUSHER_SECRET: process.env.PUSHER_SECRET ?? '',
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER ?? 'ap2',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
} as const