import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const client = searchParams.get('client')

  const where: any = {}
  if (status) where.status = status
  if (client) where.client = { contains: client }

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: { include: { bom: true } },
      creator: { select: { id: true, name: true, username: true, role: true } },
      statusLogs: { include: { user: { select: { id: true, name: true, username: true, role: true } } }, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const order = await prisma.order.create({
      data: {
        client: body.client,
        priority: body.priority || 'normal',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        notes: body.notes,
        createdBy: user.id,
        status: 'DRAFT',
        orderItems: {
          create: body.items.map((item: any) => ({
            bomId: item.bomId,
            quantity: item.quantity,
            unitCost: item.unitCost || 0,
          })),
        },
        statusLogs: {
          create: {
            fromStatus: null,
            toStatus: 'DRAFT',
            userId: user.id,
            notes: 'Order dibuat',
          },
        },
      },
      include: {
        orderItems: { include: { bom: true } },
        creator: { select: { id: true, name: true, username: true, role: true } },
        statusLogs: { include: { user: { select: { id: true, name: true, username: true, role: true } } } },
      },
    })
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
