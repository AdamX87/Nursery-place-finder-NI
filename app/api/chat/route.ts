export const dynamic = "force-dynamic"

// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

const FAQ: Record<string, string> = {
  underage: `In Northern Ireland, "underage" means your child is younger than the standard intake age. For nursery, most DE-funded schools take children who turn 3 between 2 July (previous year) and 1 July of the intake year. If your child is younger, they may still apply as an "underage" pupil subject to spaces.`,
  sibling: `Sibling priority means if you already have a child attending the school, your next child is given higher admissions priority. This is usually listed as Priority 1 or 2 and is one of the strongest advantages in NI admissions.`,
  catchment: `A catchment area is the geographic zone a school uses to determine local children. Living within catchment gives your child higher priority. Catchment boundaries vary by school.`,
  funded: `DE-funded places are free pre-school places provided by the Department of Education (NI). All children are entitled to one funded year before Primary 1, typically 12.5 hours per week. Private nurseries may charge additional fees for full-day places.`,
  apply: `For September intake, EA-managed nurseries open applications in January. The Education Authority (EA) coordinates applications for state, Catholic, and integrated nurseries at eani.org.uk. Private nurseries accept direct applications year-round.`,
  integrated: `Integrated schools in NI bring together children from Protestant, Catholic, and other backgrounds. They aim for a roughly 40/40/20 balance and welcome all families regardless of religion.`,
  chances: `Your chances depend on: your child's age relative to the intake date, whether you live within the catchment area, whether a sibling already attends, and spaces available. Use the likelihood badges in search results for a quick guide.`,
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('underage') || lower.includes('under age') || lower.includes('too young')) return FAQ.underage
  if (lower.includes('sibling') || lower.includes('brother') || lower.includes('sister')) return FAQ.sibling
  if (lower.includes('catchment') || lower.includes('area') || lower.includes('zone')) return FAQ.catchment
  if (lower.includes('funded') || lower.includes('free') || lower.includes('cost') || lower.includes('fee')) return FAQ.funded
  if (lower.includes('apply') || lower.includes('application') || lower.includes('when')) return FAQ.apply
  if (lower.includes('integrated') || lower.includes('religion') || lower.includes('faith')) return FAQ.integrated
  if (lower.includes('chance') || lower.includes('likelihood') || lower.includes('probability')) return FAQ.chances
  return `Thanks for your question! For specific NI nursery admissions queries, I recommend contacting the Education Authority Northern Ireland at eani.org.uk or calling 028 9056 4000. You can also click "View Details" on any nursery to see their specific admissions criteria.`
}

/**
 * POST /api/chat
 * Body: { message: string }
 *
 * In production: replace getResponse() with a call to Anthropic Claude API:
 *
 * import Anthropic from '@anthropic-ai/sdk'
 * const client = new Anthropic()
 * const response = await client.messages.create({
 *   model: 'claude-opus-4-6',
 *   max_tokens: 1024,
 *   system: 'You are a helpful assistant for parents in Northern Ireland navigating nursery admissions...',
 *   messages: [{ role: 'user', content: message }],
 * })
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }

    // Simulate slight delay for realism
    await new Promise(r => setTimeout(r, 400))

    const response = getResponse(message)
    return NextResponse.json({ response })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
