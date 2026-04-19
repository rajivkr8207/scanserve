import { NextResponse } from 'next/server'
import { successResponse } from '@/lib/response'

export async function POST() {
  const response = successResponse(null, 'Logged out successfully')

  // Clear the token cookie by setting an expired date
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return response
}
