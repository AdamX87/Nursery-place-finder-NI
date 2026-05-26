export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/nurseries?id=eq.${params.id}`, {
    headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  const data = await res.json()
  return NextResponse.json({ nursery: data[0] })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/nurseries?id=eq.${params.id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
  })
  const data = await res.json()
  return NextResponse.json({ nursery: data[0] })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await fetch(`${SUPABASE_URL}/rest/v1/nurseries?id=eq.${params.id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  return NextResponse.json({ success: true })
}