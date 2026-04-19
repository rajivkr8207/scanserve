import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { createdResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '@/lib/response'
import { authRateLimit } from '@/middleware/rateLimit'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per 15 minutes per IP
  const limited = authRateLimit(request)
  if (limited) return limited

  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors)
    }

    const result = await authService.register(parsed.data)
    
    // Create response
    const response = createdResponse(result, 'Account created successfully')
    
    // Set httpOnly cookie
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
    const message = error instanceof Error ? error.message : 'Registration failed'
    if (message.includes('already exists')) return errorResponse(message, 409)
    return serverErrorResponse(message)
  }
}
