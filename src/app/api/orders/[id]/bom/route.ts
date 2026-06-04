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
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const bomBreakdown = order.orderItems.flatMap((item) =>
    item.bom.bomLines.map((line) => ({
      component: line.component,
      requiredQty: line.qtyPerUnit * item.quantity,
      availableStock: line.component.stockQty,
      sufficient: line.component.stockQty >= line.qtyPerUnit * item.quantity,
      designator: line.designator,
    }))
  )

  return NextResponse.json({
    orderId: order.id,
    items: order.orderItems,
    bomBreakdown,
    allSufficient: bomBreakdown.every((b) => b.sufficient),
  })
}
