'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false })
const Candles = dynamic(() => import('./CandlesChart'), { ssr: false })
const SimplePriceChart = dynamic(() => import('./SimplePriceChart'), { ssr: false })
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
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setMounted(true)
    console.log('PriceChart: Starting to load chart for coinId:', coinId)
    
    // Set an immediate best-guess base symbol from our allowlist to avoid flicker
    const immediate = getTvBaseSymbol(coinId)
    if (immediate) {
      setBaseSymbol(immediate)
      console.log('PriceChart: Immediate base symbol set:', immediate)
    }
    
    let cancelled = false
    async function load() {
      try {
        // Load 7-day price history (always available via our API)
        console.log('PriceChart: Fetching price history from API...')
        const hist = await fetch(`/api/coins/${coinId}/history?days=7`).catch((err) => {
          console.error('PriceChart: Failed to fetch history:', err)
          return null
        })
        
        if (hist && hist.ok) {
          const data = await hist.json()
          console.log('PriceChart: History data received:', data?.prices?.length || 0, 'data points')
          if (!cancelled) setSeries(data.prices || null)
        } else {
          console.error('PriceChart: History API returned error:', hist?.status, hist?.statusText)
          setError('Failed to load price history')
          setUseFallback(true)
        }

        // Resolve a base symbol for our lightweight candles (server will fallback across exchanges)
        try {
          console.log('PriceChart: Fetching coin data for symbol resolution...')
          const coinRes = await fetch(`/api/coins/${coinId}`).catch((err) => {
            console.error('PriceChart: Failed to fetch coin data:', err)
            return null
          })
          
          const coinJson: any = coinRes && coinRes.ok ? await coinRes.json() : null
          const symbol = coinJson?.data?.symbol || coinJson?.symbol
          console.log('PriceChart: Coin symbol resolved:', symbol)
          
          // Prefer a mapped base symbol when available for better coverage
          const mapped = getTvBaseSymbol(coinId, symbol ? String(symbol).toUpperCase() : undefined)
          if (!cancelled && (mapped || symbol)) {
            const finalSymbol = String(mapped || symbol).toUpperCase()
            setBaseSymbol(finalSymbol)
            console.log('PriceChart: Final base symbol set:', finalSymbol)
            
            // Store debug info
            setDebugInfo({
              coinId,
              originalSymbol: symbol,
              mappedSymbol: mapped,
              finalSymbol,
              hasImmediateMapping: !!getTvBaseSymbol(coinId)
            })
          }
        } catch (err) {
          console.error('PriceChart: Error resolving symbol:', err)
        }
      } catch (err) {
        console.error('PriceChart: Error in load function:', err)
        setError('Failed to load chart data')
        setUseFallback(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [coinId])

  const chartData = useMemo(() => {
    if (!series || series.length === 0) {
      console.log('PriceChart: No series data available for chart')
      return null
    }
    const labels = series.map(([t]) => new Date(t).toLocaleDateString())
    const data = series.map(([, p]) => p)
    console.log('PriceChart: Chart data prepared with', data.length, 'points')
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

  // Use fallback chart if there's an error or no data
  if (useFallback || error || !chartData) {
    console.log('PriceChart: Using fallback SimplePriceChart')
    return <SimplePriceChart coinId={coinId} heightClass={heightClass} />
  }

  return (
    <div className={heightClass}>
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-800 rounded">
          Debug: {JSON.stringify(debugInfo)}
        </div>
      )}
      
      {/* Prefer lightweight candles; fallback to internal line chart */}
      {baseSymbol ? (
        <Candles base={baseSymbol} quote="USDT" coinId={coinId} interval="1h" height={300} />
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
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-sm">No price data available</p>
            <p className="text-xs text-gray-500">Try refreshing the page</p>
          </div>
        </div>
      )}
    </div>
  )
}


