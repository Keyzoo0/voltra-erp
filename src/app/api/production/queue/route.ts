import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const logs = await prisma.productionLog.findMany({
    where: {
      completedAt: null,
      status: 'in_progress',
    },
    include: {
      orderItem: {
        include: {
          order: true,
          bom: true,
        },
      },
      operator: {
        select: { id: true, name: true, username: true, role: true },
      },
    },
    orderBy: { startedAt: 'asc' },
  })

  const queue: Record<string, any[]> = {
    reflow: [],
    solder: [],
    test: [],
    assembly: [],
  }

  for (const log of logs) {
    if (queue[log.station]) {
      queue[log.station].push(log)
    }
  }

  return NextResponse.json(queue)
}
