import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      orderItems: {
        include: {
          bom: {
            include: {
              bomLines: {
                include: { component: { include: { supplier: true } } },
              },
            },
          },
        },
      },
      creator: { select: { id: true, name: true, username: true, role: true } },
      statusLogs: {
        include: { user: { select: { id: true, name: true, username: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}
