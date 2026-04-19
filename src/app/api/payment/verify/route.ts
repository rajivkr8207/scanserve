import { NextRequest } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/services/payment.service'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/response'

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
})

// POST /api/payment/verify — verify Razorpay signature after client-side payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = verifySchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)

    const payment = await paymentService.verifyPayment(parsed.data)
    return successResponse(payment, 'Payment verified successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment verification failed'
    if (message.includes('signature')) return errorResponse(message, 400)
    return serverErrorResponse(message)
  }
}
