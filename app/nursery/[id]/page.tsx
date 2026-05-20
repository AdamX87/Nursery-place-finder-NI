// app/nursery/[id]/page.tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowLeft, Phone, Mail, Globe, MapPin, Download, Sparkles,
  Clock, CalendarCheck, Star, ExternalLink, CheckCircle, Users
} from 'lucide-react'
import { MOCK_NURSERIES } from '@/lib/mockData'
import { calculateLikelihood } from '@/lib/eligibility'
import LikelihoodBadge from '@/components/ui/LikelihoodBadge'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { nurseryTypeLabel, nurseryTypeColor, spacesColor, spacesLabel } from '@/lib/utils'

export default function NurseryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const nursery = MOCK_NURSERIES.find(n => n.id === id)

  const [aiExplained, setAiExplained] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  if (!nursery) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">😕</div>
        <p className="text-gray-500">Nursery not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">Go back</Button>
      </div>
    )
  }

  const eligibility = calculateLikelihood(nursery, '', '')

  const handleAiExplain = () => {
    setAiLoading(true)
    setTimeout(() => { setAiLoading(false); setAiExplained(true) }, 1200)
  }

  const aiExplanation = `In plain English: this nursery gives places to children based on a priority list. ${
    nursery.admissionsCriteria[0]?.title.toLowerCase().includes('sibling')
      ? '**Siblings come first** — if you already have a child here, your chances are much higher.'
      : '**Children with special educational needs** are given priority first.'
  } Next, ${
    nursery.admissionsCriteria[1]?.title ?? 'children within the local area'
  }. If spaces remain, they go to children living closest to the school. ${
    nursery.spacesAvailable === 0
      ? '⚠️ Right now there are no spaces — consider joining the waitlist or applying for January intake.'
      : `✅ There ${nursery.spacesAvailable === 1 ? 'is 1 space' : `are ${nursery.spacesAvailable} spaces`} currently available — act quickly!`
  }`

  return (
    <div className="animate-fade-in">
      {/* Hero header */}
      <div className="relative -mx-4 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-4 pt-4 pb-10 overflow-hidden mb-0">
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-white/5" />

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-5 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to results
        </button>

        <div className="flex items-start gap-4">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/20 shadow-lg"
            style={{ background: nursery.color }}
          >
            {nursery.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-extrabold text-xl leading-tight">{nursery.name}</h1>
            <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {nursery.area}, Belfast
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span className="text-white font-semibold text-sm">{nursery.rating}</span>
              <span className="text-white/50 text-xs">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Type badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-white/20 text-white border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
            {nurseryTypeLabel(nursery.type)}
          </span>
          <span className="bg-white/20 text-white border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
            {nursery.sessionType === 'full-time' ? '⏰ Full-time' : '🕐 Part-time'}
          </span>
          {nursery.deFunded && (
            <span className="bg-white/20 text-white border border-white/20 rounded-full px-3 py-1 text-xs font-semibold">
              ✓ DE Funded
            </span>
          )}
        </div>
      </div>

      {/* Lifted card content */}
      <div className="-mx-4 bg-gray-50 rounded-t-3xl px-4 pt-5 -mt-4">

        {/* Likelihood card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm">Your admissions likelihood</h2>
            <LikelihoodBadge likelihood={eligibility.likelihood} />
          </div>
          {/* Progress bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                eligibility.likelihood === 'High'
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : eligibility.likelihood === 'Medium'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${eligibility.score}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {nursery.tags.map(t => (
              <span key={t} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 rounded-full px-2.5 py-0.5 font-medium">
                📌 {t}
              </span>
            ))}
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-brand-600" /> Nursery details
          </h2>
          <div className="divide-y divide-gray-50">
            {[
              ['Sessions', nursery.sessions],
              ['Next intake', nursery.nextIntake],
              ['Ages', `${nursery.ageMin}–${nursery.ageMax} years`],
              ['Spaces available', spacesLabel(nursery.spacesAvailable, nursery.waitlistOpen)],
              ['DE funded', nursery.deFunded ? 'Yes – 12.5 hrs/week free' : 'No – private fees apply'],
              ['School type', nurseryTypeLabel(nursery.type)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start py-2.5 gap-4">
                <span className="text-xs text-gray-400 flex-shrink-0">{k}</span>
                <span className={`text-xs font-semibold text-right ${k === 'Spaces available' ? spacesColor(nursery.spacesAvailable) : 'text-gray-700'}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-gradient-to-br from-brand-50 to-green-50 border border-brand-100 rounded-2xl h-40 flex flex-col items-center justify-center gap-2 mb-4 cursor-pointer hover:border-brand-300 transition-colors shadow-sm group">
          <MapPin className="h-8 w-8 text-brand-500 group-hover:scale-110 transition-transform" />
          <div className="text-brand-700 font-semibold text-sm">{nursery.address}</div>
          <div className="text-brand-500 text-xs flex items-center gap-1">
            <ExternalLink className="h-3 w-3" /> Tap to open in Maps
          </div>
        </div>

        {/* Admissions criteria */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-600" /> Admissions criteria
          </h2>
          <div className="space-y-3">
            {nursery.admissionsCriteria.map(c => (
              <div key={c.priority} className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {c.priority}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-700">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Explainer */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse-dot" />
            <h2 className="font-bold text-indigo-800 text-sm flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> AI Admissions Explainer
            </h2>
          </div>
          {!aiExplained ? (
            <Button
              onClick={handleAiExplain}
              loading={aiLoading}
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Explain this in plain English
            </Button>
          ) : (
            <div className="bg-white rounded-xl p-3 text-xs text-gray-700 leading-relaxed border border-indigo-100 animate-fade-in">
              {aiExplanation}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Contact details</h2>
          <div className="space-y-2.5">
            <a href={`tel:${nursery.phone}`} className="flex items-center gap-3 text-sm group">
              <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-brand-600 font-semibold group-hover:text-brand-700">{nursery.phone}</span>
            </a>
            <a href={`mailto:${nursery.email}`} className="flex items-center gap-3 text-sm group">
              <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-brand-600 font-semibold group-hover:text-brand-700 text-xs">{nursery.email}</span>
            </a>
            {nursery.website && (
              <a href={nursery.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm group">
                <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-brand-600 font-semibold group-hover:text-brand-700 text-xs flex items-center gap-1">
                  {nursery.website.replace('https://', '')} <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            )}
          </div>
        </div>

        {/* PDF download */}
        <button className="w-full bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 mb-4 hover:border-brand-300 transition-all shadow-sm group">
          <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-gray-900 text-sm">{nursery.name} – Admissions Policy 2025</div>
            <div className="text-xs text-gray-400 mt-0.5">PDF · Official document · Click to download</div>
          </div>
          <Download className="h-4 w-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
        </button>

        {/* CTA buttons */}
        <div className="space-y-2 pb-6">
          <Button fullWidth size="lg" className="bg-gradient-to-r from-brand-600 to-brand-700 text-base font-bold shadow-md">
            <Mail className="h-5 w-5" /> Contact this nursery
          </Button>
          <Button fullWidth size="md" variant="outline" onClick={() => router.back()}>
            ← Back to results
          </Button>
        </div>
      </div>
    </div>
  )
}
