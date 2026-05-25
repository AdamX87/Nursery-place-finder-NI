'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🌱
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">NurseryPlaceFinder CMS</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-medium mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl py-3 font-bold text-sm disabled:opacity-60 hover:shadow-md transition-all"
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Default password: <code className="bg-gray-100 px-1 rounded">nursery2025</code>
        </p>
      </div>
    </div>
  )
}
