import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { orderService } from '@/services/order.service'
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/response'

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'SERVED', 'CANCELLED']),
})

// PATCH /api/order/status/[orderId] — update order status (seller only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { orderId } = await params
    const body = await request.json()
    const parsed = updateStatusSchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)

    const order = await orderService.updateStatus(orderId, parsed.data.status, auth.userId)
    return successResponse(order, `Order status updated to ${parsed.data.status}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order'
    if (message.includes('not found')) return errorResponse(message, 404)
    if (message.includes('authorized')) return errorResponse(message, 403)
    return serverErrorResponse(message)
  }
}
