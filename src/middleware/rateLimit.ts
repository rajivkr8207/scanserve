import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store — replace with Redis adapter in production
const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  /** Max requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

/**
 * Simple in-memory rate limiter for App Router route handlers.
 * Key is IP address from x-forwarded-for or x-real-ip.
 *
 * Returns a 429 NextResponse if the limit is exceeded, or null if OK.
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = { limit: 20, windowSeconds: 60 }
): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const key = `${ip}:${request.nextUrl.pathname}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowSeconds * 1000 })
    return null
  }

  entry.count++

  if (entry.count > options.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { success: false, data: null, message: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(options.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  return null
}

/**
 * Strict rate limiter for auth endpoints (5 req / 15 min)
 */
export function authRateLimit(request: NextRequest): NextResponse | null {
  return rateLimit(request, { limit: 5, windowSeconds: 15 * 60 })
}

/**
 * Moderate rate limiter for order creation (10 req / min)
 */
export function orderRateLimit(request: NextRequest): NextResponse | null {
  return rateLimit(request, { limit: 10, windowSeconds: 60 })
}
