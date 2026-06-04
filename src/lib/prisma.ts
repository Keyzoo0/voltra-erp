import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function getDbUrl(): string {
  const url = process.env.DATABASE_URL
  if (url && url.startsWith('postgres')) return url
  if (url === 'file:./dev.db') {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    return `file:${dbPath}`
  }
  return url || 'file:./dev.db'
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: getDbUrl(),
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
