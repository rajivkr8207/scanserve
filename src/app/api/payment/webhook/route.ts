import { NextRequest } from 'next/server'
import { paymentService } from '@/services/payment.service'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/response'

/**
 * POST /api/payment/webhook
 *
 * Razorpay sends a POST with:
 *   - Header: x-razorpay-signature
 *   - Body: JSON event payload
 *
 * IMPORTANT: This route must be excluded from Next.js body parsing
 * because we need the raw body for signature verification.
 * Add "export const config = { api: { bodyParser: false } }" is not needed
 * in App Router — route handlers receive the raw Request.
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature') ?? ''
    if (!signature) return errorResponse('Missing webhook signature', 400)

    const body = await request.json() as Record<string, unknown>
    const result = await paymentService.handleWebhook(body, signature)

    return successResponse(result, 'Webhook processed')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    if (message.includes('signature') || message.includes('configured')) {
      return errorResponse(message, 400)
    }
    return serverErrorResponse(message)
  }
}
