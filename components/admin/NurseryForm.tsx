'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react'

const NURSERY_TYPES = ['state', 'catholic', 'integrated', 'private', 'montessori', 'waldorf']
const ICONS = ['🏫','🌻','🔭','🌈','😊','⭐','⚡','🐑','🔍','🌿','🌟','🌲','👑','🪨','🔔','🧠','🍀','☀️','🔤','🐼','🌼','🎨','🦋','🌸']
const COLORS = ['#FEF3C7','#EFF6FF','#F5F3FF','#F0FDF4','#FFF7ED','#FFFBEB','#FEE2E2','#E0F2FE','#F0FFF4','#FAF5FF']

interface Criterion {
  priority: number
  title: string
  description: string
}

interface NurseryFormProps {
  initialData?: any
  mode: 'create' | 'edit'
}

export default function NurseryForm({ initialData, mode }: NurseryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: initialData?.name || '',
    area: initialData?.area || '',
    postcode: initialData?.postcode || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    type: initialData?.type || 'state',
    session_type: initialData?.session_type || 'part-time',
    sessions: initialData?.sessions || '',
    age_min: initialData?.age_min || 3,
    age_max: initialData?.age_max || 4,
    spaces_available: initialData?.spaces_available ?? 0,
    waitlist_open: initialData?.waitlist_open || false,
    next_intake: initialData?.next_intake || '',
    de_funded: initialData?.de_funded || false,
    rating: initialData?.rating || 4.5,
    icon: initialData?.icon || '🏫',
    color: initialData?.color || '#F0FDF4',
    tags: (initialData?.tags || []).join(', '),
  })

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialData?.admissions_criteria || [
      { priority: 1, title: '', description: '' },
    ]
  )

  const update = (field: string, value: any) =>
    setForm(f => ({ ...f, [field]: value }))

  const addCriterion = () =>
    setCriteria(c => [...c, { priority: c.length + 1, title: '', description: '' }])

  const removeCriterion = (i: number) =>
    setCriteria(c => c.filter((_, idx) => idx !== i).map((cr, idx) => ({ ...cr, priority: idx + 1 })))

  const updateCriterion = (i: number, field: string, value: string) =>
    setCriteria(c => c.map((cr, idx) => idx === i ? { ...cr, [field]: value } : cr))

  const handleSubmit = async () => {
    if (!form.name || !form.area) {
      setError('Name and area are required')
      return
    }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      admissions_criteria: criteria.filter(c => c.title),
    }

    const url = mode === 'create' ? '/api/admin/nurseries' : `/api/admin/nurseries/${initialData.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/admin/nurseries'), 1000)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
      setSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === 'create' ? 'Add new nursery' : `Edit: ${initialData?.name}`}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {mode === 'create' ? 'Fill in the details below to add a nursery to the directory.' : 'Update the nursery details below.'}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
            Basic information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Nursery name *</label>
              <input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Sunflower Nursery School" />
            </div>
            <div>
              <label className={labelClass}>Area *</label>
              <input className={inputClass} value={form.area} onChange={e => update('area', e.target.value)} placeholder="e.g. Andersonstown" />
            </div>
            <div>
              <label className={labelClass}>Postcode</label>
              <input className={inputClass} value={form.postcode} onChange={e => update('postcode', e.target.value.toUpperCase())} placeholder="e.g. BT11 8AJ" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Full address</label>
              <input className={inputClass} value={form.address} onChange={e => update('address', e.target.value)} placeholder="e.g. 14 Andersonstown Road, Belfast BT11 8AJ" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="028 9062 1234" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="info@nursery.co.uk" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Website (optional)</label>
              <input className={inputClass} value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://nursery.co.uk" />
            </div>
          </div>
        </div>

        {/* Type & sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
            Type & sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>School type</label>
              <select className={inputClass} value={form.type} onChange={e => update('type', e.target.value)}>
                {NURSERY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Session type</label>
              <select className={inputClass} value={form.session_type} onChange={e => update('session_type', e.target.value)}>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Sessions description</label>
              <input className={inputClass} value={form.sessions} onChange={e => update('sessions', e.target.value)} placeholder="e.g. Morning (9am–12pm) & Afternoon (12:30pm–3:30pm)" />
            </div>
            <div>
              <label className={labelClass}>Min age (years)</label>
              <input className={inputClass} type="number" min={1} max={5} value={form.age_min} onChange={e => update('age_min', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Max age (years)</label>
              <input className={inputClass} type="number" min={1} max={6} value={form.age_max} onChange={e => update('age_max', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
            Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Spaces available</label>
              <input className={inputClass} type="number" min={0} value={form.spaces_available} onChange={e => update('spaces_available', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Next intake</label>
              <input className={inputClass} value={form.next_intake} onChange={e => update('next_intake', e.target.value)} placeholder="e.g. September 2025" />
            </div>
            <div>
              <label className={labelClass}>Rating (1–5)</label>
              <input className={inputClass} type="number" min={1} max={5} step={0.1} value={form.rating} onChange={e => update('rating', e.target.value)} />
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  role="switch"
                  aria-checked={form.de_funded}
                  onClick={() => update('de_funded', !form.de_funded)}
                  className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.de_funded ? 'bg-brand-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.de_funded ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">DE Funded</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  role="switch"
                  aria-checked={form.waitlist_open}
                  onClick={() => update('waitlist_open', !form.waitlist_open)}
                  className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.waitlist_open ? 'bg-brand-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.waitlist_open ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Waitlist open</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
            Tags
          </h2>
          <label className={labelClass}>Tags (comma separated)</label>
          <input
            className={inputClass}
            value={form.tags}
            onChange={e => update('tags', e.target.value)}
            placeholder="e.g. Sibling priority, Within catchment, DE funded"
          />
          <p className="text-xs text-gray-400 mt-1.5">These appear as badges on the nursery card</p>
        </div>

        {/* Admissions criteria */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">5</span>
            Admissions criteria
          </h2>
          <div className="space-y-3">
            {criteria.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-5 w-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.priority}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">Priority {c.priority}</span>
                  {criteria.length > 1 && (
                    <button onClick={() => removeCriterion(i)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    className={inputClass}
                    value={c.title}
                    onChange={e => updateCriterion(i, 'title', e.target.value)}
                    placeholder="e.g. Siblings of current pupils"
                  />
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={2}
                    value={c.description}
                    onChange={e => updateCriterion(i, 'description', e.target.value)}
                    placeholder="Description..."
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addCriterion}
            className="mt-3 flex items-center gap-2 text-sm text-brand-600 font-semibold hover:text-brand-700"
          >
            <Plus className="h-4 w-4" /> Add criterion
          </button>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-6 w-6 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center text-xs font-bold">6</span>
            Appearance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => update('icon', icon)}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center text-xl border-2 transition-all ${form.icon === icon ? 'border-brand-500 bg-brand-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Card colour</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => update('color', color)}
                    className={`h-9 w-9 rounded-lg border-2 transition-all ${form.color === color ? 'border-brand-500 scale-110' : 'border-transparent hover:border-gray-300'}`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4">
            <label className={labelClass}>Preview</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: form.color }}>
                {form.icon}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{form.name || 'Nursery name'}</div>
                <div className="text-xs text-gray-400">{form.area || 'Area'} · {form.session_type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
            ✅ Saved successfully! Redirecting...
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <button onClick={() => router.back()} className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-xl py-3 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-3 font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : mode === 'create' ? 'Add nursery' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
