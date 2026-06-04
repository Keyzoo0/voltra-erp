import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }
    const accessToken = signToken({ userId: user.id, role: user.role, username: user.username })
    return NextResponse.json({
      accessToken,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
