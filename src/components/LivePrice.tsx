"use client"

import { useLivePrice } from '@/hooks/useLivePrice'
import { formatPercentage, formatPrice } from '@/lib/utils'

interface Props {
  symbol?: string
  initialPrice?: number | null
  initialPct?: number | null
  className?: string
}

export default function LivePrice({ symbol, initialPrice, initialPct, className }: Props) {
  const live = useLivePrice(symbol?.toUpperCase(), initialPrice, initialPct)
  const price = live.price ?? initialPrice ?? 0
  const pct = live.pct ?? initialPct ?? 0
  const pctClass = (pct || 0) >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className={className}>
      <p className="text-xl font-semibold text-white">{formatPrice(price)}</p>
      <p className={`${pctClass} font-semibold`}>{formatPercentage(pct)}</p>
    </div>
  )
}


