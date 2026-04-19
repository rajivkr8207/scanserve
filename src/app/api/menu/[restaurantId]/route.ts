import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/response'

// GET /api/menu/[restaurantId] — public, returns all available menu items grouped by category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    await connectDB()
    const { restaurantId } = await params

    const items = await MenuItem.find({
      restaurantId,
      isAvailable: true,
    }).sort({ category: 1, name: 1 })

    if (!items.length) return notFoundResponse('No menu items found for this restaurant')

    // Group by category for convenient frontend consumption
    const grouped = items.reduce<Record<string, typeof items>>(
      (acc, item) => {
        const cat = item.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
      },
      {}
    )

    return successResponse({ items, grouped }, 'Menu fetched successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch menu'
    return serverErrorResponse(message)
  }
}
