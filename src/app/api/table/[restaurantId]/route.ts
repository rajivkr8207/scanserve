import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/db'
import Table from '@/models/Table'
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/response'

// GET /api/table/[restaurantId] — list all tables (public, for QR landing)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    await connectDB()
    const { restaurantId } = await params

    const tables = await Table.find({ restaurantId }).sort({ tableNumber: 1 })
    if (!tables.length) return notFoundResponse('No tables found for this restaurant')

    return successResponse(tables, 'Tables fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tables'
    return serverErrorResponse(message)
  }
}
