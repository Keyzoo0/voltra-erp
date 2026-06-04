import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const [completed, rejected, ordersThisMonth] = await Promise.all([
    prisma.productionLog.count({
      where: { completedAt: { gte: firstDay, lte: lastDay }, status: 'pass' },
    }),
    prisma.productionLog.count({
      where: { completedAt: { gte: firstDay, lte: lastDay }, status: 'fail' },
    }),
    prisma.order.count({
      where: { createdAt: { gte: firstDay, lte: lastDay } },
    }),
  ])

  const totalProduced = completed + rejected

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  })

  const dailyData = []
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dayStart = new Date(d)
    const dayEnd = new Date(d)
    dayEnd.setHours(23, 59, 59)

    const dayCompleted = await prisma.productionLog.count({
      where: { completedAt: { gte: dayStart, lte: dayEnd }, status: 'pass' },
    })
    const dayRejected = await prisma.productionLog.count({
      where: { completedAt: { gte: dayStart, lte: dayEnd }, status: 'fail' },
    })

    dailyData.push({
      date: dayStart.toISOString().split('T')[0],
      completed: dayCompleted,
      rejected: dayRejected,
    })
  }

  return NextResponse.json({
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    completed,
    rejected,
    totalProduced,
    yieldRate: totalProduced > 0 ? Math.round((completed / totalProduced) * 10000) / 100 : 100,
    ordersThisMonth,
    ordersByStatus,
    dailyData,
  })
}
