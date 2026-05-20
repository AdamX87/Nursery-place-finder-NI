// components/ui/AIChatWidget.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

const QUICK_QUESTIONS = [
  'What does underage mean?',
  'Can I apply for full-time?',
  'What are my chances?',
  'What is DE funded?',
  'When should I apply?',
]

const FAQ: Record<string, string> = {
  'what does underage mean': `In Northern Ireland, "underage" means your child is younger than the standard intake age. For nursery, most DE-funded schools take children who turn 3 between 2 July (previous year) and 1 July (intake year). If your child is younger than this, they may still apply as an "underage" pupil, subject to available spaces and school policy.`,
  'can i apply for full-time': `DE-funded nursery places cover 12.5 hours per week (usually morning or afternoon sessions). For full-time care, you'll need a private nursery or one offering extended hours on top of the funded session. Full-time private nurseries have their own fees but often offer more flexible hours like 7am–6pm.`,
  'what are my chances': `Your admissions likelihood depends on: 1) your child's age vs the intake date, 2) whether you live within the catchment area, 3) whether a sibling already attends the school, and 4) how many spaces remain. Check the 🎯 likelihood badge on each nursery card – we calculate this based on your postcode and DOB!`,
  'what is de funded': `DE stands for the Department of Education (Northern Ireland). All children in NI are entitled to a FREE pre-school place for the year before they start Primary 1. This is called the "funded pre-school programme" and covers 12.5 hours per week during term time. Look for the purple "DE Funded" badge.`,
  'when should i apply': `For September intake, applications typically open in January. The EA (Education Authority) manages applications for state/catholic/integrated nurseries. Private nurseries accept applications directly, often year-round. Apply as early as possible – popular schools fill up fast!`,
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  for (const [key, val] of Object.entries(FAQ)) {
    if (lower.includes(key.split(' ')[0]) && lower.includes(key.split(' ')[key.split(' ').length - 1])) {
      return val
    }
    if (lower.includes(key)) return val
  }
  if (lower.includes('sibling')) return 'Sibling priority means if you already have a child at the school, your next child gets higher priority. This is one of the strongest admissions advantages you can have in NI – it\'s listed as Priority 1 or 2 in most schools.'
  if (lower.includes('catchment')) return 'A catchment area is the geographic zone a school uses to determine local children. If you live within the catchment, your child gets higher priority. Catchment boundaries vary by school – contact the school directly or ask the EA for their admissions criteria booklet.'
  if (lower.includes('waitlist') || lower.includes('waiting')) return 'If a school is full, you can often join a waiting list. As places become available (e.g. families moving away), they\'re offered down the waiting list in priority order. Keep in touch with the school and apply to multiple nurseries as a backup.'
  if (lower.includes('integrated')) return 'Integrated schools in NI bring together children from Protestant, Catholic, and other backgrounds. They follow a roughly 40/40/20 balance. There\'s no religious test for admission – they welcome all families.'
  return 'Great question! I\'m still learning about all the ins and outs of NI nursery admissions. For specific queries, I\'d recommend contacting the Education Authority Northern Ireland at eani.org.uk or calling the school directly. Is there anything else I can help with?'
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '👋 Hi! I\'m your nursery admissions helper. Ask me anything about NI nursery places, eligibility, or how admissions work!' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  const sendMessage = (text: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(m => [...m, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'bot', text: getBotResponse(msg) }])
    }, 700 + Math.random() * 400)
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-6">
      {/* Chat Panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white font-bold text-sm">Nursery Helper</span>
              <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse-dot" />
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-56 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 border-t border-gray-100 flex gap-1.5 overflow-x-auto">
            {QUICK_QUESTIONS.slice(0, 3).map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2.5 py-1 font-semibold hover:bg-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-1 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask anything..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
            <button
              onClick={() => sendMessage(input)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-2 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI helper"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse-dot" />
        )}
      </button>
    </div>
  )
}
