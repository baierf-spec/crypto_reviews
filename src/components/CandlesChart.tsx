"use client"

import { useEffect, useRef, useState } from 'react'
import { createChart, UTCTimestamp } from 'lightweight-charts'

interface Props {
  base: string
  quote?: string
  coinId?: string
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  height?: number
}

export default function CandlesChart({ base, quote = 'USDT', coinId, interval = '1h', height = 300 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState<number>(30)
  const [selectedInterval, setSelectedInterval] = useState<'1h' | '4h' | '1d'>(interval as any)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      layout: { background: { color: 'rgba(0,0,0,0)' }, textColor: '#9CA3AF' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.06)' }, horzLines: { color: 'rgba(255,255,255,0.06)' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)' },
      height,
    })
    const candles = chart.addCandlestickSeries({ upColor: '#22d3ee', downColor: '#ef4444', wickUpColor: '#22d3ee', wickDownColor: '#ef4444', borderVisible: false })
    const ma20 = chart.addLineSeries({ color: '#60a5fa', lineWidth: 2 })
    const ma50 = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2 })

    let cancelled = false
    async function load() {
      try {
        const params = new URLSearchParams({ base, quote, interval: selectedInterval, days: String(range) })
        if (coinId) params.set('coinId', coinId)
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
        const moving = (len: number) => {
          const out: { time: UTCTimestamp; value: number }[] = []
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            sum += data[i].close
            if (i >= len) sum -= data[i - len].close
            if (i >= len - 1) out.push({ time: data[i].time, value: sum / len })
          }
          return out
        }
        ma20.setData(moving(20))
        ma50.setData(moving(50))
      } catch {}
    }
    load()
    const handle = setInterval(load, 60_000)
    return () => { cancelled = true; clearInterval(handle); chart.remove() }
  }, [base, quote, selectedInterval, height, range, coinId])

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
        <div className="flex gap-2">
          {(['1h','4h','1d'] as const).map(iv => (
            <button key={iv} onClick={() => setSelectedInterval(iv)} className={`px-2 py-1 rounded ${selectedInterval===iv?'bg-crypto-primary/40 text-white':'bg-black/20'}`}>{iv}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {[7,30,90,180].map(d => (
            <button key={d} onClick={() => setRange(d)} className={`px-2 py-1 rounded ${range===d?'bg-crypto-primary/40 text-white':'bg-black/20'}`}>{d}d</button>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ height }} />
    </div>
  )
}


