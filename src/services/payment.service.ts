import { env } from '@/config/env'
import crypto from 'crypto'
import { connectDB } from '@/lib/db'
import { razorpay } from '@/lib/razorpay'
import Payment from '@/models/Payment'
import Order from '@/models/Order'
import { Types } from 'mongoose'

export const paymentService = {
  async createOrder(orderId: string, amount: number, currency = 'INR') {
    await connectDB()

    const order = await Order.findById(orderId)
    if (!order) throw new Error('Order not found')
    if (order.paymentStatus === 'PAID') throw new Error('Order is already paid')

    // Amount in paise (Razorpay expects smallest currency unit)
    const amountInPaise = Math.round(amount * 100)

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: orderId,
      notes: { orderId },
    })

    // Persist payment record
    const payment = await Payment.create({
      orderId: new Types.ObjectId(orderId),
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency,
      status: 'CREATED',
    })

    return { rzpOrder, payment }
  },

  async verifyPayment(params: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }) {
    await connectDB()

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params

    // HMAC-SHA256 verification
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      throw new Error('Payment signature verification failed')
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: 'PAID' },
      { new: true }
    )
    if (!payment) throw new Error('Payment record not found')

    // Update order payment status
    await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'PAID' })

    return payment
  },

  async handleWebhook(body: Record<string, unknown>, signature: string) {
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) throw new Error('Webhook secret not configured')

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex')

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature')
    }

    const event = body.event as string
    const paymentEntity = (body.payload as Record<string, unknown>)
    const paymentItem = (paymentEntity?.payment as Record<string, unknown>)?.entity as Record<string, unknown>

    if (event === 'payment.captured' && paymentItem) {
      const razorpayOrderId = paymentItem.order_id as string
      const razorpayPaymentId = paymentItem.id as string

      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, status: 'PAID' },
        { new: true }
      )
      if (payment) {
        await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'PAID' })
      }
    }

    if (event === 'payment.failed' && paymentItem) {
      const razorpayOrderId = paymentItem.order_id as string
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'FAILED' },
        { new: true }
      )
      if (payment) {
        await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'FAILED' })
      }
    }

    return { received: true }
  },
}
