import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor', 'operator'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data: any = { status: body.status }
    if (body.status === 'pass' || body.status === 'fail' || body.status === 'rework') {
      data.completedAt = new Date()
    }

    const log = await prisma.productionLog.update({
      where: { id: params.id },
      data,
      include: {
        orderItem: {
          include: { order: true, bom: true },
        },
        operator: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    })

    if (body.status === 'pass') {
      await prisma.$transaction(async (tx) => {
        const bomLines = await tx.bomLine.findMany({
          where: { bomId: log.orderItem.bomId },
          include: { component: true },
        })
        for (const line of bomLines) {
          await tx.component.update({
            where: { id: line.componentId },
            data: { stockQty: { decrement: line.qtyPerUnit * log.orderItem.quantity } },
          })
        }
      })
    }

    return NextResponse.json(log)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
