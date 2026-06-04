import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const component = await prisma.component.findUnique({
    where: { id: params.id },
    include: { supplier: true },
  })
  if (!component) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(component)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  if (!user || !['admin', 'supervisor'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const component = await prisma.component.update({
      where: { id: params.id },
      data: {
        stockQty: body.stockQty,
        description: body.description,
        location: body.location,
        minStock: body.minStock,
      },
      include: { supplier: true },
    })
    return NextResponse.json(component)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
