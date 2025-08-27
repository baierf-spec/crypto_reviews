'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const TVChart = dynamic(() => import('./TradingViewChart'), { ssr: false })
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Tooltip, Filler, Legend)

interface PriceChartProps {
  coinId: string
  heightClass?: string
}

export default function PriceChart({ coinId, heightClass = 'h-64' }: PriceChartProps) {
  const [series, setSeries] = useState<number[][] | null>(null)
  const [mounted, setMounted] = useState(false)
  const [symbol, setSymbol] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/coins/${coinId}`)
        if (!res.ok) return
        const coin = await res.json().catch(() => null)
        if (coin && coin.symbol) setSymbol(String(coin.symbol).toUpperCase())
        // We only have /coins for single fetch; use separate endpoint for history
        const hist = await fetch(`/api/coins/${coinId}/history?days=7`).catch(() => null)
        if (hist && hist.ok) {
          const data = await hist.json()
          if (!cancelled) setSeries(data.prices || null)
        }
      } catch (_) {}
    }
    load()
    return () => { cancelled = true }
  }, [coinId])

  if (!mounted) return <div className="h-48 flex items-center justify-center text-gray-400">Loading chart...</div>

  return <TVChart symbol={symbol || coinId} />
}


