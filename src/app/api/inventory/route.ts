import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const lowStock = searchParams.get('lowStock')

  const where: any = {}
  if (search) {
    where.OR = [
      { partNumber: { contains: search } },
      { description: { contains: search } },
    ]
  }
  if (lowStock === 'true') {
    where.stockQty = { lte: prisma.component.fields.minStock }
  }

  const components = await prisma.component.findMany({
    where,
    include: { supplier: true },
    orderBy: { partNumber: 'asc' },
  })
  return NextResponse.json(components)
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const component = await prisma.component.create({
      data: {
        partNumber: body.partNumber,
        description: body.description,
        stockQty: body.stockQty || 0,
        minStock: body.minStock || 10,
        location: body.location,
        supplierId: body.supplierId || null,
      },
      include: { supplier: true },
    })
    return NextResponse.json(component, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 })
  }
}
