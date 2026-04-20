import { env } from '@/config/env'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const JWT_SECRET = env.JWT_SECRET as string
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '7d'

export interface JwtPayload {
  userId: string
  email: string
  role: 'SELLER' | 'ADMIN'
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id)
}
