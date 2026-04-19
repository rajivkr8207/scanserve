import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { connectDB } from '@/lib/db'
import Table from '@/models/Table'
import Restaurant from '@/models/Restaurant'
import { generateQRCode, buildStoreUrl } from '@/utils/qrGenerator'
import { createdResponse, errorResponse, serverErrorResponse } from '@/lib/response'
import { Types } from 'mongoose'

const createTableSchema = z.object({
  restaurantId: z.string().min(1, 'restaurantId is required'),
  tableNumber: z.number().int().positive('Table number must be a positive integer'),
})

// POST /api/table — create a table and generate its QR code (seller only)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    await connectDB()
    const body = await request.json()
    const parsed = createTableSchema.safeParse(body)
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

    // Check for duplicate table number
    const existing = await Table.findOne({
      restaurantId: parsed.data.restaurantId,
      tableNumber: parsed.data.tableNumber,
    })
    if (existing) return errorResponse(`Table ${parsed.data.tableNumber} already exists`, 409)

    // Create the table first (need the _id for QR URL)
    const table = await Table.create({
      restaurantId: new Types.ObjectId(parsed.data.restaurantId),
      tableNumber: parsed.data.tableNumber,
      qrCodeUrl: '',
    })

    // Build the store URL and generate QR
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const storeUrl = buildStoreUrl(baseUrl, restaurant.slug, String(table._id))
    const qrCodeUrl = await generateQRCode(storeUrl)

    table.qrCodeUrl = qrCodeUrl
    await table.save()

    return createdResponse(table, 'Table created with QR code')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create table'
    return serverErrorResponse(message)
  }
}
