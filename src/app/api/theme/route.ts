import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { connectDB } from '@/lib/db'
import Theme from '@/models/Theme'
import Restaurant from '@/models/Restaurant'
import { successResponse, createdResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/response'
import { Types } from 'mongoose'

const themeSchema = z.object({
  restaurantId: z.string().min(1),
  themeName: z.enum(['chai', 'burger', 'fine_dine', 'default']),
  colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      text: z.string(),
      accent: z.string().optional(),
    })
    .optional(),
  fonts: z
    .object({ heading: z.string(), body: z.string() })
    .optional(),
  layout: z.string().optional(),
})

// POST /api/theme — create or upsert theme (seller only)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const body = await request.json()
    const parsed = themeSchema.safeParse(body)
    if (!parsed.success) return validationErrorResponse(parsed.error.flatten().fieldErrors)

    const restaurant = await Restaurant.findOne({
      _id: parsed.data.restaurantId,
      ownerId: auth.userId,
    })
    if (!restaurant) return errorResponse('Restaurant not found or access denied', 403)

    const theme = await Theme.findOneAndUpdate(
      { restaurantId: new Types.ObjectId(parsed.data.restaurantId) },
      { $set: parsed.data },
      { upsert: true, new: true }
    )

    return createdResponse(theme, 'Theme saved')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save theme'
    return serverErrorResponse(message)
  }
}

// GET /api/theme/[restaurantId] — public, for customer store to render correct theme
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const restaurantId = request.nextUrl.searchParams.get('restaurantId')
    if (!restaurantId) return errorResponse('restaurantId query param required', 400)

    const theme = await Theme.findOne({ restaurantId })
    if (!theme) return errorResponse('Theme not found', 404)

    return successResponse(theme, 'Theme fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch theme'
    return serverErrorResponse(message)
  }
}
