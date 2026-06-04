import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [completed, rejected, totalOrders, activeOrders] = await Promise.all([
    prisma.productionLog.count({
      where: { completedAt: { gte: today, lt: tomorrow }, status: 'pass' },
    }),
    prisma.productionLog.count({
      where: { completedAt: { gte: today, lt: tomorrow }, status: 'fail' },
    }),
    prisma.order.count(),
    prisma.order.count({
      where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
    }),
  ])

  const totalProduced = completed + rejected
  const yieldRate = totalProduced > 0 ? (completed / totalProduced) * 100 : 100

  return NextResponse.json({
    date: today.toISOString().split('T')[0],
    completed,
    rejected,
    totalProduced,
    yieldRate: Math.round(yieldRate * 100) / 100,
    totalOrders,
    activeOrders,
  })
}
