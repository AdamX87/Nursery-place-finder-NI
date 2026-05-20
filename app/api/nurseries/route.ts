// app/api/nurseries/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MOCK_NURSERIES } from '@/lib/mockData'
import { rankNurseries } from '@/lib/eligibility'

/**
 * GET /api/nurseries
 * Query params:
 *   postcode - optional
 *   dob      - optional (YYYY-MM-DD)
 *   type     - optional: 'full-time' | 'part-time'
 *   funded   - optional: 'true'
 *   spaces   - optional: 'true' (only show with spaces)
 *
 * In production: replace MOCK_NURSERIES with Supabase query
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postcode = searchParams.get('postcode') ?? ''
  const dob = searchParams.get('dob') ?? ''
  const sessionType = searchParams.get('type')
  const fundedOnly = searchParams.get('funded') === 'true'
  const spacesOnly = searchParams.get('spaces') === 'true'

  // TODO: Replace with Supabase query
  // const { data } = await supabase
  //   .from('nurseries')
  //   .select('*')
  //   .order('created_at', { ascending: false })

  let results = rankNurseries(MOCK_NURSERIES, dob, postcode)

  if (sessionType) {
    results = results.filter(n => n.sessionType === sessionType)
  }
  if (fundedOnly) {
    results = results.filter(n => n.deFunded)
  }
  if (spacesOnly) {
    results = results.filter(n => n.spacesAvailable > 0)
  }

  return NextResponse.json({
    count: results.length,
    nurseries: results,
    meta: {
      postcode: postcode || null,
      dob: dob || null,
      filters: { sessionType, fundedOnly, spacesOnly },
    },
  })
}
