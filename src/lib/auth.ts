import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_EXPIRE = parseInt(process.env.JWT_EXPIRE_MINUTES || '480')

export interface JWTPayload {
  userId: string
  role: string
  username: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${JWT_EXPIRE}m` })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  try {
    const payload = verifyToken(token)
    return await prisma.user.findUnique({ where: { id: payload.userId } })
  } catch {
    return null
  }
}

export function getCurrentUserOrThrow(request: NextRequest) {
  const user = getCurrentUser(request)
  if (!user) throw new Error('Unauthorized')
  return user
}

export function requireRole(...roles: string[]) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request)
    if (!user || !roles.includes(user.role)) {
      throw new Error('Forbidden')
    }
    return user
  }
}
