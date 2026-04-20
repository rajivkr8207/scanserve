import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { connectDB } from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import Restaurant from '@/models/Restaurant'
import { createdResponse, successResponse, serverErrorResponse, errorResponse } from '@/lib/response'
import { Types } from 'mongoose'

const createMenuItemSchema = z.object({
  restaurantId: z.string().min(1, 'restaurantId is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url().optional(),
  isAvailable: z.coerce.boolean().default(true),
})

// POST /api/menu — add a menu item (seller only)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const body = await request.json()
    const parsed = createMenuItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 422 }
      )
    }

    // Verify ownership
    const restaurant = await Restaurant.findOne({
      _id: parsed.data.restaurantId,
      ownerId: auth.userId,
    })
    if (!restaurant) return errorResponse('Restaurant not found or access denied', 403)

    const item = await MenuItem.create({
      ...parsed.data,
      restaurantId: new Types.ObjectId(parsed.data.restaurantId),
      userId: auth.userId,
    })
    return createdResponse(item, 'Menu item created')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create menu item'
    return serverErrorResponse(message)
  }
}


// GET /api/menu — get all menu items (seller only)
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const items = await MenuItem.find({
      userId: auth.userId
    }).populate('restaurantId')
    return successResponse(items)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get menu items'
    return serverErrorResponse(message)
  }
}


// DELETE /api/menu/:id
export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const body = await request.json()
    console.log(body, "body")
    if (!body._id) return errorResponse('Menu item ID is required', 400)
    const item = await MenuItem.findById(body._id)
    if (!item) return errorResponse('Menu item not found', 404)
    if (item.userId !== auth.userId) return errorResponse('You are not authorized to delete this menu item', 403)
    await item.deleteOne()
    return successResponse(item, 'Menu item deleted')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete menu item'
    return serverErrorResponse(message)
  }
}
