import { NextRequest } from 'next/server'
import { restaurantService } from '@/services/restaurant.service'
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/response'

// GET /api/restaurant/[slug] — public endpoint for the customer store page
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const restaurant = await restaurantService.getBySlug(slug)
    return successResponse(restaurant, 'Restaurant fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch restaurant'
    if (message.includes('not found')) return notFoundResponse(message)
    return serverErrorResponse(message)
  }
}
