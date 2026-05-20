// components/layout/Header.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white text-base shadow-sm">
            🌱
          </div>
          <span className="font-extrabold text-[15px] text-gray-900 tracking-tight">
            Nursery<span className="text-brand-600">Place</span>Finder
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors',
              pathname === '/' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            )}
          >
            Home
          </Link>
          <Link
            href="/results"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors',
              pathname === '/results' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            )}
          >
            Find
          </Link>
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors',
              pathname.startsWith('/admin') ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
