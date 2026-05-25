'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, CheckCircle, XCircle, PlusCircle, AlertTriangle } from 'lucide-react'

interface Stats {
  total: number
  withSpaces: number
  full: number
  funded: number
  totalSpaces: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentNurseries, setRecentNurseries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/nurseries')
      .then(r => r.json())
      .then(({ nurseries }) => {
        if (!nurseries) return
        setStats({
          total: nurseries.length,
          withSpaces: nurseries.filter((n: any) => n.spaces_available > 0).length,
          full: nurseries.filter((n: any) => n.spaces_available === 0).length,
          funded: nurseries.filter((n: any) => n.de_funded).length,
          totalSpaces: nurseries.reduce((a: number, n: any) => a + (n.spaces_available || 0), 0),
        })
        setRecentNurseries(nurseries.slice(0, 5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back. Here's what's happening.</p>
        </div>
        <Link
          href="/admin/nurseries/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add nursery
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total nurseries', value: stats.total, icon: Building2, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Total spaces', value: stats.totalSpaces, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Fully booked', value: stats.full, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'DE funded', value: stats.funded, icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`h-9 w-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ No nurseries in database yet. <Link href="/admin/nurseries/new" className="font-bold underline">Add your first nursery →</Link>
        </div>
      )}

      {/* Recent nurseries */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent nurseries</h2>
          <Link href="/admin/nurseries" className="text-brand-600 text-sm font-semibold hover:text-brand-700">
            View all →
          </Link>
        </div>
        {recentNurseries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No nurseries yet</p>
            <Link href="/admin/nurseries/new" className="text-brand-600 text-sm font-semibold mt-1 inline-block">
              Add your first nursery →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentNurseries.map(n => (
              <div key={n.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: n.color || '#f0fdf4' }}>
                    {n.icon || '🏫'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{n.name}</div>
                    <div className="text-xs text-gray-400">{n.area} · {n.session_type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${n.spaces_available === 0 ? 'text-red-500' : n.spaces_available <= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                    {n.spaces_available === 0 ? 'Full' : `${n.spaces_available} spaces`}
                  </span>
                  <Link
                    href={`/admin/nurseries/${n.id}`}
                    className="text-xs bg-gray-50 hover:bg-brand-50 text-gray-500 hover:text-brand-600 border border-gray-200 rounded-lg px-3 py-1.5 font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
