// app/admin/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Search, ShieldCheck, Edit2, Check, X, AlertTriangle } from 'lucide-react'
import { Nursery } from '@/types'
import { MOCK_NURSERIES } from '@/lib/mockData'
import { spacesColor, nurseryTypeLabel } from '@/lib/utils'
import Button from '@/components/ui/Button'

type EditForm = {
  name: string
  spacesAvailable: number
  sessionType: 'full-time' | 'part-time'
  nextIntake: string
  likelihood: 'High' | 'Medium' | 'Low'
  waitlistOpen: boolean
}

export default function AdminPage() {
  const [nurseries, setNurseries] = useState<Nursery[]>(MOCK_NURSERIES)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EditForm | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const filtered = nurseries.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.area.toLowerCase().includes(search.toLowerCase())
  )

  const startEdit = (n: Nursery) => {
    setEditingId(n.id)
    setForm({
      name: n.name,
      spacesAvailable: n.spacesAvailable,
      sessionType: n.sessionType,
      nextIntake: n.nextIntake,
      likelihood: (n.likelihood ?? 'Medium') as 'High' | 'Medium' | 'Low',
      waitlistOpen: n.waitlistOpen,
    })
  }

  const cancelEdit = () => { setEditingId(null); setForm(null) }

  const saveEdit = (id: string) => {
    if (!form) return
    setNurseries(ns => ns.map(n => n.id === id ? { ...n, ...form } : n))
    setEditingId(null)
    setForm(null)
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  const totalSpaces = nurseries.reduce((a, n) => a + n.spacesAvailable, 0)
  const fullCount = nurseries.filter(n => n.spacesAvailable === 0).length
  const lowCount = nurseries.filter(n => n.spacesAvailable > 0 && n.spacesAvailable <= 3).length

  return (
    <div className="animate-fade-in py-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 -mx-4 px-4 pt-4 pb-8 mb-0 rounded-b-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg">Admin Dashboard</h1>
            <p className="text-white/60 text-xs">Manage nursery listings & availability</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total nurseries', value: nurseries.length, color: 'text-white' },
            { label: 'Total spaces', value: totalSpaces, color: 'text-green-400' },
            { label: 'Fully booked', value: fullCount, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className={`font-extrabold text-xl ${s.color}`}>{s.value}</div>
              <div className="text-white/50 text-[10px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="-mx-4 bg-gray-50 rounded-t-3xl px-4 pt-4 -mt-4">

        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium">
            <strong>Prototype mode:</strong> Changes are saved in-memory only for this session. In production, updates would persist to Supabase.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nurseries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Low spaces alert */}
        {lowCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex gap-2">
            <span className="text-orange-500">⚠️</span>
            <p className="text-xs text-orange-800 font-medium">
              {lowCount} {lowCount === 1 ? 'nursery has' : 'nurseries have'} 3 or fewer spaces remaining.
            </p>
          </div>
        )}

        {/* Nursery list */}
        <div className="space-y-2 pb-8">
          {filtered.map(n => (
            <div key={n.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* List row */}
              <div className="flex items-center gap-3 p-3.5">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: n.color }}
                >
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{n.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{n.area} · {nurseryTypeLabel(n.type)} · {n.sessionType}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-extrabold text-sm ${spacesColor(n.spacesAvailable)}`}>
                    {n.spacesAvailable === 0 ? 'Full' : `${n.spacesAvailable} spaces`}
                  </div>
                  <div className="text-xs text-gray-400">{n.nextIntake}</div>
                </div>
                {saved === n.id ? (
                  <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                ) : (
                  <button
                    onClick={() => editingId === n.id ? cancelEdit() : startEdit(n)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      editingId === n.id ? 'bg-red-50 text-red-500' : 'bg-gray-50 hover:bg-brand-50 text-gray-400 hover:text-brand-600'
                    }`}
                  >
                    {editingId === n.id ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </button>
                )}
              </div>

              {/* Edit panel */}
              {editingId === n.id && form && (
                <div className="border-t border-gray-50 px-4 py-4 bg-gray-50 space-y-3 animate-slide-up">
                  <h3 className="font-bold text-gray-800 text-sm">✏️ Edit details</h3>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Nursery name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Spaces available</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={form.spacesAvailable}
                        onChange={e => setForm(f => f ? { ...f, spacesAvailable: parseInt(e.target.value) || 0 } : f)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Session type</label>
                      <select
                        value={form.sessionType}
                        onChange={e => setForm(f => f ? { ...f, sessionType: e.target.value as 'full-time' | 'part-time' } : f)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500 bg-white"
                      >
                        <option value="part-time">Part-time</option>
                        <option value="full-time">Full-time</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Next intake</label>
                    <input
                      value={form.nextIntake}
                      onChange={e => setForm(f => f ? { ...f, nextIntake: e.target.value } : f)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Waitlist open</div>
                      <div className="text-xs text-gray-400">Show waitlist option to parents</div>
                    </div>
                    <button
                      role="switch"
                      aria-checked={form.waitlistOpen}
                      onClick={() => setForm(f => f ? { ...f, waitlistOpen: !f.waitlistOpen } : f)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${form.waitlistOpen ? 'bg-brand-600' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.waitlistOpen ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" onClick={cancelEdit} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={() => saveEdit(n.id)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                      <Check className="h-4 w-4" /> Save changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">No nurseries match your search</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
