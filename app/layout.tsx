// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import AIChatWidget from '@/components/ui/AIChatWidget'

const inter = Inter({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NurseryPlaceFinder – Find Nursery Places in Northern Ireland',
  description: 'Search for available nursery and pre-school places near you in Northern Ireland. Understand admissions criteria and improve your chances.',
  keywords: ['nursery', 'preschool', 'Northern Ireland', 'Belfast', 'admissions', 'childcare'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-50 min-h-screen`}>
        <Header />
        <main className="max-w-2xl mx-auto px-4 pb-20">
          {children}
        </main>
        <AIChatWidget />
      </body>
    </html>
  )
}