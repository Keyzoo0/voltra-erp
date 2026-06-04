import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor', 'operator'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { orderItemId, station } = body

    const existing = await prisma.productionLog.findFirst({
      where: {
        orderItemId,
        station,
        completedAt: null,
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already in queue' }, { status: 409 })
    }

    const log = await prisma.productionLog.create({
      data: {
        orderItemId,
        station,
        operatorId: user.id,
        status: 'in_progress',
      },
      include: {
        orderItem: {
          include: { order: true, bom: true },
        },
        operator: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
