import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { connectDB } from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Restaurant from '@/models/Restaurant'
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/response'

const updateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  image: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
})

// PATCH /api/menu/[id] — update a menu item (seller only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const { id } = await params

    const item = await MenuItem.findById(id)
    if (!item) return notFoundResponse('Menu item not found')

    // Verify seller owns this restaurant
    const restaurant = await Restaurant.findOne({
      _id: item.restaurantId,
      ownerId: auth.userId,
    })
    if (!restaurant) return errorResponse('Access denied', 403)

    const body = await request.json()
    const parsed = updateMenuItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 422 }
      )
    }

    Object.assign(item, parsed.data)
    await item.save()

    return successResponse(item, 'Menu item updated')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update menu item'
    return serverErrorResponse(message)
  }
}

// DELETE /api/menu/[id] — delete a menu item (seller only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const { id } = await params

    const item = await MenuItem.findById(id)
    if (!item) return notFoundResponse('Menu item not found')

    const restaurant = await Restaurant.findOne({
      _id: item.restaurantId,
      ownerId: auth.userId,
    })
    if (!restaurant) return errorResponse('Access denied', 403)

    await item.deleteOne()
    return successResponse(null, 'Menu item deleted')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete menu item'
    return serverErrorResponse(message)
  }
}
