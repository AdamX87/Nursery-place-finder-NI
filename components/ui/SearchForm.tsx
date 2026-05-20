// components/ui/SearchForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Search } from 'lucide-react'
import Button from './Button'

interface SearchFormProps {
  initialPostcode?: string
  initialDob?: string
  compact?: boolean
}

export default function SearchForm({
  initialPostcode = '',
  initialDob = '',
  compact = false,
}: SearchFormProps) {
  const router = useRouter()
  const [postcode, setPostcode] = useState(initialPostcode)
  const [dob, setDob] = useState(initialDob)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!postcode.trim() && !dob) {
      setError('Please enter a postcode or your child\'s date of birth')
      return
    }
    setError('')
    setLoading(true)
    const params = new URLSearchParams()
    if (postcode) params.set('postcode', postcode.trim().toUpperCase())
    if (dob) params.set('dob', dob)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className={compact ? '' : 'bg-white rounded-2xl p-5 shadow-lg border border-gray-100'}>
      {!compact && (
        <h3 className="font-bold text-gray-800 text-sm mb-4">🔍 Search for nursery places</h3>
      )}

      <div className={compact ? 'flex gap-2 flex-wrap' : 'space-y-3'}>
        {/* Postcode */}
        <div className={compact ? 'flex-1 min-w-[140px]' : ''}>
          {!compact && (
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Your postcode
            </label>
          )}
          <div className="relative">
            {compact && <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            <input
              type="text"
              placeholder="e.g. BT7 1AW"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className={`w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all ${compact ? 'pl-9 pr-3' : 'px-4'}`}
            />
          </div>
        </div>

        {/* DOB */}
        <div className={compact ? 'flex-1 min-w-[160px]' : ''}>
          {!compact && (
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Child's date of birth
            </label>
          )}
          <div className="relative">
            {compact && <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className={`w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all ${compact ? 'pl-9 pr-3' : 'px-4'}`}
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={handleSearch}
          loading={loading}
          size={compact ? 'md' : 'lg'}
          fullWidth={!compact}
          className={compact ? 'flex-shrink-0' : 'mt-1 bg-gradient-to-r from-brand-600 to-brand-700 text-base font-bold shadow-md hover:shadow-lg'}
        >
          <Search className="h-4 w-4" />
          {compact ? 'Search' : 'Find nursery places'}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}
