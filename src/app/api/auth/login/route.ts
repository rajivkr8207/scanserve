import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '@/lib/response'
import { authRateLimit } from '@/middleware/rateLimit'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  const limited = authRateLimit(request)
  if (limited) return limited

  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors)
    }
    const result = await authService.login(parsed.data)

    const response = successResponse(result, 'Login successful')
    response.cookies.set({
      name: 'token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    if (message.includes('Invalid email or password')) return errorResponse(message, 401)
    return serverErrorResponse(message)
  }
}
