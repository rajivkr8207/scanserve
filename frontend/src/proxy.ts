import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/restaurants', '/profile'];

// Paths that should redirect authenticated users away (but NOT verify-otp/reset-password)
const authOnlyPaths = ['/', '/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected → redirect to login if no token
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth-only → redirect to dashboard if already logged in
  const isAuthOnlyPath = authOnlyPaths.some((path) => 
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );
  if (isAuthOnlyPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/restaurants/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
  ],
};
