// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Likelihood } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function likelihoodColor(l: Likelihood | undefined) {
  switch (l) {
    case 'High':   return 'bg-green-100 text-green-800 border-green-200'
    case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Low':    return 'bg-red-100 text-red-800 border-red-200'
    default:       return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export function likelihoodDot(l: Likelihood | undefined) {
  switch (l) {
    case 'High':   return 'bg-green-500'
    case 'Medium': return 'bg-amber-500'
    case 'Low':    return 'bg-red-500'
    default:       return 'bg-gray-400'
  }
}

export function spacesColor(spaces: number) {
  if (spaces === 0) return 'text-red-600'
  if (spaces <= 2)  return 'text-amber-600'
  return 'text-green-700'
}

export function spacesLabel(spaces: number, waitlistOpen: boolean) {
  if (spaces === 0 && waitlistOpen) return 'Waitlist open'
  if (spaces === 0) return 'No spaces'
  if (spaces === 1) return '1 space left'
  return `${spaces} spaces`
}

export function nurseryTypeLabel(type: string) {
  const map: Record<string, string> = {
    state:      'State Controlled',
    catholic:   'Catholic Maintained',
    integrated: 'Integrated',
    private:    'Private',
    montessori: 'Montessori',
    waldorf:    'Waldorf / Steiner',
  }
  return map[type] ?? type
}

export function nurseryTypeColor(type: string) {
  const map: Record<string, string> = {
    state:      'bg-blue-50 text-blue-700',
    catholic:   'bg-purple-50 text-purple-700',
    integrated: 'bg-teal-50 text-teal-700',
    private:    'bg-orange-50 text-orange-700',
    montessori: 'bg-pink-50 text-pink-700',
    waldorf:    'bg-emerald-50 text-emerald-700',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}

export function formatDistance(d: number | undefined) {
  if (!d) return ''
  return `${d.toFixed(1)} miles`
}
