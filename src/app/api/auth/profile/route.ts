import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { authService } from '@/services/auth.service'
import { successResponse, serverErrorResponse } from '@/lib/response'

// GET /api/auth/profile
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const user = await authService.getProfile(auth.userId)
    return successResponse(user, 'Profile fetched')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile'
    return serverErrorResponse(message)
  }
}
