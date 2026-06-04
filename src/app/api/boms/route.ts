import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const boms = await prisma.bom.findMany({
    select: { id: true, pcbName: true, revision: true },
    orderBy: { pcbName: 'asc' },
  })
  return NextResponse.json(boms)
}
