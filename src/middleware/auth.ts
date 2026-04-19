import { NextRequest, NextResponse } from 'next/server'
import { extractBearerToken, verifyToken, JwtPayload } from '@/lib/auth'
import { unauthorizedResponse } from '@/lib/response'

/**
 * Validates the JWT from the Authorization header.
 * Returns the decoded payload on success, or a 401 NextResponse on failure.
 *
 * Usage in a route handler:
 *   const authResult = await requireAuth(request)
 *   if (authResult instanceof NextResponse) return authResult
 *   const { userId, role } = authResult
 */
export async function requireAuth(
  request: NextRequest
): Promise<JwtPayload | NextResponse> {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return unauthorizedResponse('No token provided')
  }

  try {
    const payload = verifyToken(token)
    return payload
  } catch {
    return unauthorizedResponse('Invalid or expired token')
  }
}

/**
 * Requires the authenticated user to have a specific role.
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: JwtPayload['role'][]
): Promise<JwtPayload | NextResponse> {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  if (!allowedRoles.includes(authResult.role)) {
    return NextResponse.json(
      { success: false, data: null, message: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return authResult
}
