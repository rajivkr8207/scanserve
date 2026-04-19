import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { orderService } from '@/services/order.service'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/response'

// GET /api/order/[restaurantId] — list orders for a restaurant (seller only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { restaurantId } = await params
    const status = request.nextUrl.searchParams.get('status') ?? undefined

    const orders = await orderService.getByRestaurant(restaurantId, status)
    return successResponse(orders, 'Orders fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders'
    return serverErrorResponse(message)
  }
}
