import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [total, todayProd, byStation] = await Promise.all([
    prisma.productionLog.count(),
    prisma.productionLog.count({
      where: { startedAt: { gte: today } },
    }),
    prisma.productionLog.groupBy({
      by: ['station'],
      _count: true,
      where: { completedAt: null, status: 'in_progress' },
    }),
  ])

  const stationStats = Object.fromEntries(
    byStation.map((s) => [s.station, s._count])
  )

  return NextResponse.json({
    total,
    todayProduction: todayProd,
    stationQueue: stationStats,
  })
}
