import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { restaurantService } from '@/services/restaurant.service'
import { createdResponse, errorResponse, successResponse, serverErrorResponse } from '@/lib/response'

const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().optional(),
  logo: z.string().url('Logo must be a valid URL').optional(),
})

// POST /api/restaurant — create restaurant (seller only)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = createRestaurantSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 422 }
      )
    }

    const restaurant = await restaurantService.create({
      ...parsed.data,
      ownerId: auth.userId,
    })
    return createdResponse(restaurant, 'Restaurant created successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create restaurant'
    if (message.includes('already have')) return errorResponse(message, 409)
    return serverErrorResponse(message)
  }
}

// GET /api/restaurant — get the authenticated seller's own restaurant
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const restaurant = await restaurantService.getByOwner(auth.userId)
    if (!restaurant) return errorResponse('No restaurant found for this account', 404)
    return successResponse(restaurant, 'Restaurant fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch restaurant'
    return serverErrorResponse(message)
  }
}
