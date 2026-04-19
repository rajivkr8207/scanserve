import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/middleware/auth'
import { restaurantService } from '@/services/restaurant.service'
import { successResponse, serverErrorResponse, errorResponse } from '@/lib/response'

const workingHourSlotSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  isOpen: z.boolean(),
})

const settingsSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  logo: z.string().url().optional(),
  theme: z.string().optional(),
  storeStatus: z.object({ manualMode: z.enum(['ONLINE', 'OFFLINE']) }).optional(),
  workingHours: z
    .record(
      z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      workingHourSlotSchema
    )
    .optional(),
  temporaryClosure: z
    .object({
      isActive: z.boolean(),
      reason: z.string().optional(),
      until: z.string().datetime({ offset: true }).optional(),
    })
    .optional(),
  orderSettings: z
    .object({
      codEnabled: z.boolean().optional(),
      codMaxAmount: z.number().positive().optional(),
      prepaidOnly: z.boolean().optional(),
    })
    .optional(),
})

// PATCH /api/restaurant/settings — update restaurant settings
export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: parsed.error.flatten().fieldErrors, message: 'Validation failed' },
        { status: 422 }
      )
    }

    const updated = await restaurantService.updateSettings(auth.userId, parsed.data)
    return successResponse(updated, 'Settings updated successfully')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update settings'
    if (message.includes('not found')) return errorResponse(message, 404)
    return serverErrorResponse(message)
  }
}
