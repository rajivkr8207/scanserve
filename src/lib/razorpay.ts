import { env } from '@/config/env'
import Razorpay from 'razorpay'

if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  console.warn('[Razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Payment features will fail.')
}

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID ?? '',
  key_secret: env.RAZORPAY_KEY_SECRET ?? '',
})
