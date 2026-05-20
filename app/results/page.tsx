// app/results/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useMemo, Suspense } from 'react'
import { SlidersHorizontal, X, MapPin, Baby } from 'lucide-react'
import NurseryCard from '@/components/ui/NurseryCard'
import SearchForm from '@/components/ui/SearchForm'
import { MOCK_NURSERIES } from '@/lib/mockData'
import { rankNurseries, childAge } from '@/lib/eligibility'
import { Likelihood } from '@/types'

function ResultsContent() {
  const params = useSearchParams()
  const postcode = params.get('postcode') ?? ''
  const dob = params.get('dob') ?? ''

  const [filterType, setFilterType] = useState<'all' | 'full-time' | 'part-time'>('all')
  const [filterLikelihood, setFilterLikelihood] = useState<'all' | Likelihood>('all')
  const [filterFunded, setFilterFunded] = useState<'all' | 'funded' | 'private'>('all')
  const [filterSpaces, setFilterSpaces] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const ranked = useMemo(
    () => rankNurseries(MOCK_NURSERIES, dob, postcode),
    [dob, postcode]
  )

  const filtered = useMemo(() => {
    return ranked.filter(n => {
      if (filterType !== 'all' && n.sessionType !== filterType) return false
      if (filterLikelihood !== 'all' && n.likelihood !== filterLikelihood) return false
      if (filterFunded === 'funded' && !n.deFunded) return false
      if (filterFunded === 'private' && n.deFunded) return false
      if (filterSpaces && n.spacesAvailable === 0) return false
      return true
    })
  }, [ranked, filterType, filterLikelihood, filterFunded, filterSpaces])

  const highCount = filtered.filter(n => n.likelihood === 'High').length
  const activeFilterCount = [
    filterType !== 'all',
    filterLikelihood !== 'all',
    filterFunded !== 'all',
    filterSpaces,
  ].filter(Boolean).length

  const age = childAge(dob)

  return (
    <div className="animate-fade-in">
      {/* Search header */}
      <div className="-mx-4 bg-white border-b border-gray-100 px-4 pt-4 pb-3 mb-4">
        <SearchForm initialPostcode={postcode} initialDob={dob} compact />
      </div>

      {/* Context bar */}
      {(postcode || dob) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {postcode && (
            <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-semibold">
              <MapPin className="h-3 w-3" /> {postcode}
            </span>
          )}
          {age && (
            <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-semibold">
              <Baby className="h-3 w-3" /> Child aged {age}
            </span>
          )}
        </div>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-extrabold text-gray-900 text-lg">{filtered.length} nurseries found</h1>
          {highCount > 0 && (
            <p className="text-xs text-green-700 font-semibold mt-0.5">
              ✓ {highCount} with High admissions chance
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-4 shadow-sm animate-slide-up">
          {/* Session type */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Session type</div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'full-time', 'part-time'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setFilterType(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterType === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {v === 'all' ? 'All' : v === 'full-time' ? '⏰ Full-time' : '🕐 Part-time'}
                </button>
              ))}
            </div>
          </div>

          {/* Likelihood */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Admissions likelihood</div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'High', 'Medium', 'Low'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setFilterLikelihood(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterLikelihood === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {v === 'all' ? 'All chances' : `${v === 'High' ? '●' : v === 'Medium' ? '◐' : '○'} ${v}`}
                </button>
              ))}
            </div>
          </div>

          {/* Funding */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Funding</div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'funded', 'private'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setFilterFunded(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterFunded === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {v === 'all' ? 'All' : v === 'funded' ? '✓ DE Funded' : '💳 Private'}
                </button>
              ))}
            </div>
          </div>

          {/* Spaces toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-800">Only show with spaces</div>
              <div className="text-xs text-gray-400">Hide full / waitlist-only nurseries</div>
            </div>
            <button
              role="switch"
              aria-checked={filterSpaces}
              onClick={() => setFilterSpaces(s => !s)}
              className={`relative h-6 w-11 rounded-full transition-colors ${filterSpaces ? 'bg-brand-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${filterSpaces ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {/* Reset */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setFilterType('all'); setFilterLikelihood('all'); setFilterFunded('all'); setFilterSpaces(false) }}
              className="flex items-center gap-1 text-xs text-red-600 font-semibold"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {filtered.map(n => (
          <NurseryCard key={n.id} nursery={n} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-bold text-gray-900 mb-1">No nurseries match</div>
            <div className="text-gray-500 text-sm">Try adjusting or clearing your filters</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-400">Loading results…</div>}>
      <ResultsContent />
    </Suspense>
  )
}
