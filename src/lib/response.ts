import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}

export function successResponse<T>(data: T, message = 'Success', status = 200): NextResponse {
  return NextResponse.json({ success: true, data, message } satisfies ApiResponse<T>, { status })
}

export function createdResponse<T>(data: T, message = 'Created'): NextResponse {
  return successResponse(data, message, 201)
}

export function errorResponse(message: string, status = 400, data: unknown = null): NextResponse {
  return NextResponse.json({ success: false, data, message } satisfies ApiResponse, { status })
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401)
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return errorResponse(message, 403)
}

export function notFoundResponse(message = 'Not found'): NextResponse {
  return errorResponse(message, 404)
}

export function serverErrorResponse(message = 'Internal server error'): NextResponse {
  return errorResponse(message, 500)
}

export function validationErrorResponse(errors: unknown): NextResponse {
  return NextResponse.json(
    { success: false, data: errors, message: 'Validation failed' },
    { status: 422 }
  )
}
