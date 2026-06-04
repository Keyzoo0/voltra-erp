import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const components = await prisma.component.findMany({
    where: {
      stockQty: { lte: prisma.component.fields.minStock },
    },
    include: { supplier: true },
    orderBy: { stockQty: 'asc' },
  })
  return NextResponse.json(components)
}
