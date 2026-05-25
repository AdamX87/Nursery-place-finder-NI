// app/page.tsx
import Link from 'next/link'
import { ArrowRight, MapPin, CheckCircle, Sparkles, Users, BookOpen, Clock } from 'lucide-react'
import SearchForm from '@/components/ui/SearchForm'
import NurseryCard from '@/components/ui/NurseryCard'
import { MOCK_NURSERIES } from '@/lib/mockData'

const FEATURED = MOCK_NURSERIES.filter(n => n.spacesAvailable > 0).slice(0, 3).map(n => ({
  ...n,
  likelihood: 'High' as const,
  distance: parseFloat((Math.random() * 2 + 0.4).toFixed(1)),
}))

const STATS = [
  { value: '20', label: 'Nurseries listed', icon: '🏫' },
  { value: '89', label: 'Spaces available', icon: '✅' },
  { value: 'Free', label: 'DE funded places', icon: '💚' },
  { value: 'Fast', label: 'Search results', icon: '⚡' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Enter your postcode & child\'s DOB', desc: 'We use your location and child\'s age to find the most relevant nurseries nearby.' },
  { step: '2', title: 'See admissions likelihood', desc: 'Each nursery shows a High / Medium / Low likelihood based on your specific situation.' },
  { step: '3', title: 'Understand the criteria', desc: 'Use our AI helper to explain admissions jargon in plain, parent-friendly English.' },
  { step: '4', title: 'Apply direct to the nursery', desc: 'Click View Details to get contact information, download the admissions PDF, and apply.' },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative -mx-4 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 px-4 pt-10 pb-16 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute top-20 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-16 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-white text-xs font-semibold mb-5">
            🇬🇧 Northern Ireland · Completely free to use
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
            Find Nursery Places<br />
            <span className="text-brand-200">Near You</span>
          </h1>

          <p className="text-white/80 text-[15px] leading-relaxed mb-8 max-w-md">
            See available nursery places, understand admissions rules, and improve your chances — all in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-lg">{s.icon}</div>
                <div className="text-white font-extrabold text-base leading-tight">{s.value}</div>
                <div className="text-white/60 text-[10px] leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search card – overlaps hero */}
      <div className="-mt-4 mb-6">
        <SearchForm />
      </div>

      {/* Info pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-8 -mx-4 px-4">
        {['✓ DE-funded places', '✓ Belfast & surrounds', '✓ AI eligibility check', '✓ Admissions criteria'].map(t => (
          <span key={t} className="flex-shrink-0 bg-white text-brand-700 border border-brand-100 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
            {t}
          </span>
        ))}
      </div>

      {/* Featured nurseries */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-gray-900 text-lg">Featured nurseries</h2>
          <Link href="/results" className="text-brand-600 font-semibold text-sm hover:text-brand-700 flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {FEATURED.map(n => <NurseryCard key={n.id} nursery={n} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="font-extrabold text-gray-900 text-lg mb-4">How it works</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className={`flex gap-4 p-4 ${i < HOW_IT_WORKS.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                {step.step}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{step.title}</div>
                <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explainer section */}
      <section className="mb-10">
        <h2 className="font-extrabold text-gray-900 text-lg mb-4">Understanding NI nursery admissions</h2>
        <div className="grid gap-3">
          {[
            { icon: <Clock className="h-5 w-5 text-brand-600" />, title: 'When can my child start?', body: 'Most DE-funded nursery places are for children who turn 3 between 2 July (previous year) and 1 July of the school year. Your child has a guaranteed entitlement to a free pre-school year.' },
            { icon: <MapPin className="h-5 w-5 text-brand-600" />, title: 'Does catchment matter?', body: 'Yes – for state, Catholic, and integrated schools. Living within the defined catchment area gives your child higher admissions priority. Private nurseries usually have no catchment.' },
            { icon: <Users className="h-5 w-5 text-brand-600" />, title: 'What is sibling priority?', body: 'If you already have a child attending the nursery or primary school, your younger child gets higher priority. This is usually Priority 1 or 2 on the admissions criteria.' },
            { icon: <Sparkles className="h-5 w-5 text-brand-600" />, title: 'What does "integrated" mean?', body: 'Integrated schools bring together children from Protestant, Catholic, and other backgrounds. They have no faith test and aim for an approximate 40/40/20 balance. Great for all families.' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 shadow-sm">
              <div className="h-10 w-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                <div className="text-gray-500 text-xs mt-1 leading-relaxed">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-brand-700 to-brand-600 rounded-2xl p-6 text-white text-center">
          <div className="text-3xl mb-3">🌱</div>
          <h2 className="font-extrabold text-xl mb-2">Ready to find your nursery?</h2>
          <p className="text-white/80 text-sm mb-5">Search all 20 nurseries across Belfast and surrounds</p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold rounded-xl px-6 py-3 text-sm hover:bg-brand-50 transition-colors shadow-sm"
          >
            Browse all nurseries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
