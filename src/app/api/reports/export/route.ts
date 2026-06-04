import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { type, month } = body

    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { bom: true } },
        statusLogs: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const csvHeader = 'Order ID,Client,Status,Priority,Due Date,Created,Items\n'
    const csvRows = orders
      .map((o) => {
        const items = o.orderItems.map((i) => `${i.bom.pcbName} x${i.quantity}`).join('; ')
        return `${o.id},${o.client},${o.status},${o.priority},${o.dueDate?.toISOString() || ''},${o.createdAt.toISOString()},"${items}"`
      })
      .join('\n')

    const csv = csvHeader + csvRows
    const filename = `voltra-report-${type}-${month || 'all'}.csv`

    return NextResponse.json({
      filename,
      content: csv,
      contentType: 'text/csv',
    })
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
