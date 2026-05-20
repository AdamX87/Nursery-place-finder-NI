// lib/eligibility.ts
import { Nursery, Likelihood, EligibilityResult } from '@/types'
import { differenceInMonths, differenceInYears, parseISO } from 'date-fns'

/**
 * Determine if a child is age-eligible for a nursery.
 * NI funded places: child must turn 3 between 2 July of the previous year and 1 July of the intake year.
 */
export function isAgeEligible(dob: string, nursery: Nursery): boolean {
  if (!dob) return true
  try {
    const birthDate = parseISO(dob)
    const ageInMonths = differenceInMonths(new Date(), birthDate)
    const ageInYears = differenceInYears(new Date(), birthDate)
    const ageMinMonths = nursery.ageMin * 12
    const ageMaxMonths = nursery.ageMax * 12 + 11
    return ageInMonths >= ageMinMonths && ageInMonths <= ageMaxMonths
  } catch {
    return true
  }
}

/**
 * Estimate likelihood of admission based on available signals.
 * In production this would use actual postcode distance API + Supabase.
 */
export function calculateLikelihood(
  nursery: Nursery,
  dob: string,
  postcode: string
): EligibilityResult {
  let score = 50
  const reasons: string[] = []

  // Age check
  const ageEligible = isAgeEligible(dob, nursery)
  if (!ageEligible) {
    score -= 40
    reasons.push('Child may not yet meet age criteria')
  } else {
    score += 15
    reasons.push('Child meets age eligibility')
  }

  // Spaces available
  if (nursery.spacesAvailable === 0) {
    score -= 35
    reasons.push('No spaces currently available')
  } else if (nursery.spacesAvailable <= 2) {
    score -= 10
    reasons.push('Very limited spaces remaining')
  } else if (nursery.spacesAvailable >= 6) {
    score += 15
    reasons.push('Good number of spaces available')
  }

  // Open enrolment schools (no catchment penalty)
  if (nursery.tags.some(t => t.toLowerCase().includes('open enrolment') || t.toLowerCase().includes('no catchment'))) {
    score += 20
    reasons.push('No catchment area restrictions')
  }

  // Private providers tend to have more flexibility
  if (nursery.type === 'private' || nursery.type === 'montessori' || nursery.type === 'waldorf') {
    score += 10
    reasons.push('Private provider – more flexible admissions')
  }

  // Postcode proximity simulation (mock: same first 3 chars = within area)
  if (postcode && nursery.postcode) {
    const inputPrefix = postcode.replace(/\s/g, '').substring(0, 3).toUpperCase()
    const nurseryPrefix = nursery.postcode.replace(/\s/g, '').substring(0, 3).toUpperCase()
    if (inputPrefix === nurseryPrefix) {
      score += 20
      reasons.push('Within likely catchment area')
    } else if (inputPrefix.substring(0, 2) === nurseryPrefix.substring(0, 2)) {
      score += 8
      reasons.push('Close to catchment area')
    }
  }

  // Oversubscribed penalty
  if (nursery.tags.some(t => t.toLowerCase().includes('oversubscribed'))) {
    score -= 20
    reasons.push('School is oversubscribed')
  }

  score = Math.max(5, Math.min(95, score))

  const likelihood: Likelihood =
    score >= 65 ? 'High' : score >= 40 ? 'Medium' : 'Low'

  return {
    nurseryId: nursery.id,
    likelihood,
    score,
    reasons,
    ageEligible,
    distanceKm: parseFloat((Math.random() * 5 + 0.3).toFixed(1)), // mock distance
  }
}

/**
 * Apply eligibility logic to all nurseries and return enriched results sorted by score.
 */
export function rankNurseries(
  nurseries: Nursery[],
  dob: string,
  postcode: string
): Nursery[] {
  return nurseries
    .map(n => {
      const result = calculateLikelihood(n, dob, postcode)
      return {
        ...n,
        likelihood: result.likelihood,
        distance: result.distanceKm,
      }
    })
    .sort((a, b) => {
      const order: Record<Likelihood, number> = { High: 0, Medium: 1, Low: 2 }
      const la = a.likelihood ?? 'Low'
      const lb = b.likelihood ?? 'Low'
      if (order[la] !== order[lb]) return order[la] - order[lb]
      return (a.distance ?? 99) - (b.distance ?? 99)
    })
}

/** Friendly age description for display */
export function ageDescription(ageMin: number, ageMax: number): string {
  if (ageMin === 1 && ageMax <= 3) return 'Babies & Toddlers'
  if (ageMin <= 2 && ageMax <= 3) return 'Toddlers (2–3)'
  if (ageMin === 3 && ageMax === 4) return 'Pre-school (3–4)'
  return `Ages ${ageMin}–${ageMax}`
}

/** Returns child's age in years and months from a DOB string */
export function childAge(dob: string): string {
  if (!dob) return ''
  try {
    const birth = parseISO(dob)
    const years = differenceInYears(new Date(), birth)
    const months = differenceInMonths(new Date(), birth) % 12
    if (years === 0) return `${months} months`
    return `${years}yr ${months}mo`
  } catch {
    return ''
  }
}
