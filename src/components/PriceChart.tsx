'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false })
const Candles = dynamic(() => import('./CandlesChart'), { ssr: false })
import { getTvBaseSymbol } from '@/lib/tvSymbols'
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
  const [baseSymbol, setBaseSymbol] = useState<string | null>(null)
  const [coinName, setCoinName] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Set an immediate best-guess base symbol from our allowlist to avoid flicker
    const immediate = getTvBaseSymbol(coinId)
    if (immediate) setBaseSymbol(immediate)
    let cancelled = false
    async function load() {
      try {
        // Load 7-day price history (always available via our API)
        const hist = await fetch(`/api/coins/${coinId}/history?days=7`).catch(() => null)
        if (hist && hist.ok) {
          const data = await hist.json()
          if (!cancelled) setSeries(data.prices || null)
        }

        // Resolve a base symbol for our lightweight candles (server will fallback across exchanges)
        try {
          const coinRes = await fetch(`/api/coins/${coinId}`).catch(() => null)
          const coinJson = coinRes && coinRes.ok ? await coinRes.json() : null
          const symbol = coinJson?.data?.symbol || coinJson?.symbol
          // Prefer a mapped base symbol when available for better coverage
          const mapped = getTvBaseSymbol(coinId, symbol ? String(symbol).toUpperCase() : undefined)
          if (!cancelled && (mapped || symbol)) setBaseSymbol(String(mapped || symbol).toUpperCase())
          if (!cancelled) setCoinName(coinJson?.data?.id || coinId)
        } catch (_) {}
      } catch (_) {}
    }
    load()
    return () => { cancelled = true }
  }, [coinId])

  const chartData = useMemo(() => {
    if (!series || series.length === 0) return null
    const labels = series.map(([t]) => new Date(t).toLocaleDateString())
    const data = series.map(([, p]) => p)
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.15)',
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }, [series])

  if (!mounted) return <div className="h-48 flex items-center justify-center text-gray-400">Loading chart...</div>

  return (
    <div className={heightClass}>
      {/* Prefer lightweight candles; fallback to internal line chart */}
      {baseSymbol ? (
        <Candles base={baseSymbol} quote="USDT" coinId={coinName || undefined} interval="1h" height={300} />
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
              y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            },
            maintainAspectRatio: false,
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">No price data</div>
      )}
    </div>
  )
}


