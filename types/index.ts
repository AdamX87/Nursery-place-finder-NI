// types/index.ts

export type SessionType = 'full-time' | 'part-time'
export type Likelihood = 'High' | 'Medium' | 'Low'
export type NurseryType = 'state' | 'catholic' | 'integrated' | 'private' | 'montessori' | 'waldorf'

export interface Nursery {
  id: string
  name: string
  area: string
  postcode: string
  address: string
  phone: string
  email: string
  website?: string
  type: NurseryType
  sessionType: SessionType
  sessions: string
  ageMin: number
  ageMax: number
  spacesAvailable: number
  waitlistOpen: boolean
  nextIntake: string
  deFunded: boolean
  rating: number
  lat: number
  lng: number
  distance?: number
  likelihood?: Likelihood
  tags: string[]
  admissionsCriteria: AdmissionCriterion[]
  icon: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface AdmissionCriterion {
  priority: number
  title: string
  description: string
}

export interface SearchParams {
  postcode: string
  dob: string
}

export interface EligibilityResult {
  nurseryId: string
  likelihood: Likelihood
  score: number
  reasons: string[]
  ageEligible: boolean
  distanceKm: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AdminEditPayload {
  name?: string
  spacesAvailable?: number
  sessionType?: SessionType
  nextIntake?: string
  likelihood?: Likelihood
  waitlistOpen?: boolean
  tags?: string[]
}
