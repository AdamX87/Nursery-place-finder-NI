// components/ui/NurseryCard.tsx
'use client'
import Link from 'next/link'
import { MapPin, Clock, Users, Star } from 'lucide-react'
import { Nursery } from '@/types'
import LikelihoodBadge from './LikelihoodBadge'
import Badge from './Badge'
import { spacesColor, spacesLabel, nurseryTypeLabel, nurseryTypeColor, formatDistance } from '@/lib/utils'

interface NurseryCardProps {
  nursery: Nursery
  showDistance?: boolean
}

export default function NurseryCard({ nursery, showDistance = true }: NurseryCardProps) {
  const {
    id, name, area, icon, color, sessionType, sessions, ageMin, ageMax,
    spacesAvailable, waitlistOpen, nextIntake, deFunded, likelihood,
    distance, rating, type, tags,
  } = nursery

  return (
    <Link href={`/nursery/${id}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 group-hover:-translate-y-0.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
              style={{ background: color }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{name}</h3>
              <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs">
                <MapPin className="h-3 w-3" />
                <span>{area}</span>
                {showDistance && distance && (
                  <><span>·</span><span>{formatDistance(distance)}</span></>
                )}
              </div>
            </div>
          </div>
          <LikelihoodBadge likelihood={likelihood} />
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={sessionType === 'full-time' ? 'blue' : 'teal'}>
            {sessionType === 'full-time' ? '⏰ Full-time' : '🕐 Part-time'}
          </Badge>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${nurseryTypeColor(type)}`}>
            {nurseryTypeLabel(type)}
          </span>
          {deFunded && <Badge variant="purple">✓ DE Funded</Badge>}
          {tags.slice(0, 2).map(t => (
            <Badge key={t} variant="default">{t}</Badge>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">Ages</div>
            <div className="font-bold text-sm text-gray-800">{ageMin}–{ageMax} yrs</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">Intake</div>
            <div className="font-bold text-sm text-gray-800 truncate">{nextIntake}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-0.5">Rating</div>
            <div className="font-bold text-sm text-gray-800 flex items-center justify-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpacesPips spaces={spacesAvailable} />
            <span className={`text-xs font-semibold ${spacesColor(spacesAvailable)}`}>
              {spacesLabel(spacesAvailable, waitlistOpen)}
            </span>
          </div>
          <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
            View details →
          </span>
        </div>
      </article>
    </Link>
  )
}

function SpacesPips({ spaces }: { spaces: number }) {
  const max = 5
  const filled = Math.min(spaces, max)
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i < filled ? 'bg-brand-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}
