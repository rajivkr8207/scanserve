import { JwtPayload } from '@/lib/auth'

// Augment NextRequest to carry the authenticated user
declare module 'next/server' {
  interface NextRequest {
    user?: JwtPayload
  }
}

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export type ApiResult<T> = {
  success: true
  data: T
  message: string
} | {
  success: false
  data: null
  message: string
}
