'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false })
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

  useEffect(() => {
    setMounted(true)
    let cancelled = false
    async function load() {
      try {
        // Load 7-day price history (always available via our API)
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
      {chartData ? (
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


