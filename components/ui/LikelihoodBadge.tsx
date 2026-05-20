// components/ui/LikelihoodBadge.tsx
import { Likelihood } from '@/types'
import { cn, likelihoodColor, likelihoodDot } from '@/lib/utils'

export default function LikelihoodBadge({ likelihood }: { likelihood?: Likelihood }) {
  if (!likelihood) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold',
        likelihoodColor(likelihood)
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', likelihoodDot(likelihood))} />
      {likelihood} chance
    </span>
  )
}
