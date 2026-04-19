import { NextRequest } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/services/payment.service'
import { createdResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/response'

const createPaymentSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
})

// POST /api/payment/create — create Razorpay order for an existing app order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createPaymentSchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)

    const { rzpOrder, payment } = await paymentService.createOrder(
      parsed.data.orderId,
      parsed.data.amount,
      parsed.data.currency
    )

    return createdResponse(
      {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        paymentId: payment._id,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      'Razorpay order created'
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment'
    if (message.includes('already paid')) return errorResponse(message, 409)
    if (message.includes('not found')) return errorResponse(message, 404)
    return serverErrorResponse(message)
  }
}
