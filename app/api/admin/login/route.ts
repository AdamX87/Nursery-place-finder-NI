export const dynamic = "force-dynamic"

// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const validPassword = process.env.ADMIN_PASSWORD ?? 'nursery2025'
  const adminToken = process.env.ADMIN_SECRET ?? 'nursery-admin-2025'

  if (password !== validPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
