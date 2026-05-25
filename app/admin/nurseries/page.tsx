'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, PlusCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react'

export default function AdminNurseriesPage() {
  const [nurseries, setNurseries] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/nurseries')
      .then(r => r.json())
      .then(({ nurseries }) => { setNurseries(nurseries || []); setLoading(false) })
  }, [])

  const filtered = nurseries.filter(n =>
    n.name?.toLowerCase().includes(search.toLowerCase()) ||
    n.area?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/nurseries/${id}`, { method: 'DELETE' })
    setNurseries(ns => ns.filter(n => n.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Nurseries</h1>
          <p className="text-gray-500 text-sm mt-0.5">{nurseries.length} nurseries in database</p>
        </div>
        <Link
          href="/admin/nurseries/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add nursery
        </Link>
      </div>

      {nurseries.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-800 text-sm">No nurseries yet</div>
            <div className="text-amber-700 text-xs mt-0.5">Add your first nursery to get started. The public site will show real data once you've added some.</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search nurseries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-2 bg-gray-50 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No nurseries match your search</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(n => (
              <div key={n.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: n.color || '#f0fdf4' }}
                >
                  {n.icon || '🏫'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{n.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {n.area} · {n.session_type} · {n.type}
                    {n.de_funded && ' · DE Funded'}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-sm font-bold ${n.spaces_available === 0 ? 'text-red-500' : n.spaces_available <= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                      {n.spaces_available === 0 ? 'Full' : `${n.spaces_available} spaces`}
                    </div>
                    <div className="text-xs text-gray-400">{n.next_intake}</div>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/nurseries/${n.id}`}
                      className="h-8 w-8 flex items-center justify-center bg-gray-50 hover:bg-brand-50 text-gray-400 hover:text-brand-600 border border-gray-200 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(n.id, n.name)}
                      disabled={deleting === n.id}
                      className="h-8 w-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
