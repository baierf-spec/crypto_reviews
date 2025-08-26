'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Filler, Legend)

interface PriceChartProps {
  coinId: string
}

export default function PriceChart({ coinId }: PriceChartProps) {
  const [series, setSeries] = useState<number[][] | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/coins/${coinId}`)
        if (!res.ok) return
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

  if (!series) {
    return <div className="h-48 flex items-center justify-center text-gray-400">Loading chart...</div>
  }

  const labels = series.map(([ts]) => new Date(ts).toLocaleDateString())
  const dataPoints = series.map(([, price]) => price)

  return (
    <div className="h-64">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Price (USD) - 7d',
              data: dataPoints,
              borderColor: '#00D4AA',
              backgroundColor: 'rgba(0,212,170,0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          },
        }}
      />
    </div>
  )
}


