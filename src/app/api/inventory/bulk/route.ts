import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const results = []

    for (const item of body.items || []) {
      if (item.id) {
        const updated = await prisma.component.update({
          where: { id: item.id },
          data: { stockQty: item.stockQty },
        })
        results.push(updated)
      } else {
        const created = await prisma.component.create({
          data: {
            partNumber: item.partNumber,
            description: item.description,
            stockQty: item.stockQty || 0,
            minStock: item.minStock || 10,
          },
        })
        results.push(created)
      }
    }

    return NextResponse.json({ updated: results.length, items: results })
  } catch {
    return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 })
  }
}
