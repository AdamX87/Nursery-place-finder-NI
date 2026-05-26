export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/nurseries?order=name`, {
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  const data = await res.json()
  return NextResponse.json({ nurseries: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const nursery = {
    id: `npf-${Date.now()}`,
    name: body.name,
    area: body.area,
    postcode: body.postcode?.toUpperCase(),
    address: body.address,
    phone: body.phone,
    email: body.email,
    website: body.website || null,
    type: body.type || 'state',
    session_type: body.session_type || 'part-time',
    sessions: body.sessions,
    age_min: parseInt(body.age_min) || 3,
    age_max: parseInt(body.age_max) || 4,
    spaces_available: parseInt(body.spaces_available) || 0,
    waitlist_open: body.waitlist_open || false,
    next_intake: body.next_intake,
    de_funded: body.de_funded || false,
    rating: parseFloat(body.rating) || 4.5,
    tags: body.tags || [],
    admissions_criteria: body.admissions_criteria || [],
    icon: body.icon || '🏫',
    color: body.color || '#F0FDF4',
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/nurseries`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(nursery),
  })
  const data = await res.json()
  return NextResponse.json({ nursery: data[0] })
}