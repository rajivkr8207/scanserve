import { NextRequest } from 'next/server'
import { z } from 'zod'
import { orderService } from '@/services/order.service'
import { orderRateLimit } from '@/middleware/rateLimit'
import { createdResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/response'

const orderItemSchema = z.object({
  itemId: z.string().min(1, 'itemId is required'),
  qty: z.number().int().positive('Quantity must be a positive integer'),
})

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
})

const createOrderSchema = z.object({
  restaurantId: z.string().min(1, 'restaurantId is required'),
  tableId: z.string().min(1, 'tableId is required'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  paymentMethod: z.enum(['COD', 'ONLINE']),
  customer: customerSchema,
})

// POST /api/order — place an order (public, customer-facing)
export async function POST(request: NextRequest) {
  // Prevent order spam
  const limited = orderRateLimit(request)
  if (limited) return limited

  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors)
    }

    // Capture risk metadata from request
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const userAgent = request.headers.get('user-agent') ?? ''
    const deviceId = request.headers.get('x-device-id') ?? ''

    const order = await orderService.create({
      ...parsed.data,
      riskMeta: { ip, userAgent, deviceId },
    })

    return createdResponse(order, 'Order placed successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order'

    // Map business logic errors to appropriate status codes
    if (message.includes('store') || message.includes('closed') || message.includes('offline')) {
      return errorResponse(message, 503)
    }
    if (message.includes('COD') || message.includes('payment')) {
      return errorResponse(message, 400)
    }
    if (
      message.includes('unavailable') ||
      message.includes('not found') ||
      message.includes('invalid table')
    ) {
      return errorResponse(message, 422)
    }

    return serverErrorResponse(message)
  }
}
