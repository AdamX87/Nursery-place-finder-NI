// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal' | 'orange'
  size?: 'sm' | 'md'
  className?: string
}

const variants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  green:   'bg-green-100 text-green-800 border-green-200',
  amber:   'bg-amber-100 text-amber-800 border-amber-200',
  red:     'bg-red-100 text-red-800 border-red-200',
  blue:    'bg-blue-100 text-blue-800 border-blue-200',
  purple:  'bg-purple-100 text-purple-800 border-purple-200',
  teal:    'bg-teal-100 text-teal-800 border-teal-200',
  orange:  'bg-orange-100 text-orange-800 border-orange-200',
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
