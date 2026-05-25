// app/api/admin/nurseries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('nurseries')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ nursery: data })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  const fields = [
    'name', 'area', 'postcode', 'address', 'phone', 'email', 'website',
    'type', 'session_type', 'sessions', 'age_min', 'age_max',
    'spaces_available', 'waitlist_open', 'next_intake', 'de_funded',
    'rating', 'tags', 'admissions_criteria', 'icon', 'color',
  ]

  for (const field of fields) {
    if (body[field] !== undefined) {
      if (['age_min', 'age_max', 'spaces_available'].includes(field)) {
        updates[field] = parseInt(body[field])
      } else if (field === 'rating') {
        updates[field] = parseFloat(body[field])
      } else {
        updates[field] = body[field]
      }
    }
  }

  const { data, error } = await supabase
    .from('nurseries')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ nursery: data })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase
    .from('nurseries')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
