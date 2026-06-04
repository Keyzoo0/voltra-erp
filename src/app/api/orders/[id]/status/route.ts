import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROD', 'ON_HOLD', 'CANCELLED'],
  IN_PROD: ['QC', 'ON_HOLD'],
  ON_HOLD: ['IN_PROD', 'CONFIRMED', 'CANCELLED'],
  QC: ['QC_FAIL', 'PACKING'],
  QC_FAIL: ['IN_PROD'],
  PACKING: ['SHIPPED'],
  SHIPPED: ['COMPLETED'],
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { status: newStatus, notes } = await request.json()
    const order = await prisma.order.findUnique({ where: { id: params.id } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const allowed = VALID_TRANSITIONS[order.status] || []
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${newStatus}` },
        { status: 400 }
      )
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: { status: newStatus },
      })

      await tx.statusLog.create({
        data: {
          orderId: params.id,
          fromStatus: order.status,
          toStatus: newStatus,
          userId: user.id,
          notes: notes || null,
        },
      })

      if (newStatus === 'CANCELLED' && order.status === 'CONFIRMED') {
        // Release stock reserved logic would go here
      }

      return updatedOrder
    })

    const fullOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        orderItems: { include: { bom: true } },
        creator: { select: { id: true, name: true, username: true, role: true } },
        statusLogs: {
          include: { user: { select: { id: true, name: true, username: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json(fullOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
