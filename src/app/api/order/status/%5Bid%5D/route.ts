import { NextRequest } from 'next/server'
import { orderService } from '@/services/order.service'
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/response'

// GET /api/order/status/[id] — Public tracking route for customers
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await orderService.getById(id)
    
    if (!order) return notFoundResponse('Order not found')
    
    return successResponse(order, 'Order status fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch order status'
    return serverErrorResponse(message)
  }
}
