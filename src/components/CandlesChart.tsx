"use client"

import { useEffect, useRef } from 'react'
import { createChart, ISeriesApi, UTCTimestamp } from 'lightweight-charts'

interface Props {
  base: string
  quote?: string
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  height?: number
}

export default function CandlesChart({ base, quote = 'USDT', interval = '1h', height = 300 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      layout: { background: { type: 'solid', color: 'transparent' }, textColor: '#9CA3AF' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.06)' }, horzLines: { color: 'rgba(255,255,255,0.06)' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)' },
      height,
    })
    const candles = chart.addCandlestickSeries({ upColor: '#22d3ee', downColor: '#ef4444', wickUpColor: '#22d3ee', wickDownColor: '#ef4444', borderVisible: false })

    let cancelled = false
    async function load() {
      try {
        const params = new URLSearchParams({ base, quote, interval })
        const res = await fetch(`/api/candles?${params.toString()}`)
        const json = await res.json()
        if (!json?.candles || cancelled) return
        const data = (json.candles as any[]).map(c => ({
          time: c.time as UTCTimestamp,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }))
        candles.setData(data)
      } catch {}
    }
    load()
    const handle = setInterval(load, 60_000)
    return () => { cancelled = true; clearInterval(handle); chart.remove() }
  }, [base, quote, interval, height])

  return <div ref={containerRef} style={{ height }} />
}


