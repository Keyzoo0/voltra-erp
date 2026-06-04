import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'WebSocket endpoint not available in serverless mode' })
}
