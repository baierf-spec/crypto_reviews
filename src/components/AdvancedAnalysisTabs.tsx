'use client'

import { useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const Line = dynamic(() => import('react-chartjs-2').then(m => m.Line), { ssr: false })
const Bar = dynamic(() => import('react-chartjs-2').then(m => m.Bar), { ssr: false })
const Pie = dynamic(() => import('react-chartjs-2').then(m => m.Pie), { ssr: false })
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import AnalysisMarkdown from '@/components/AnalysisMarkdown'
import RatingStars from '@/components/RatingStars'
import { Coin, Analysis } from '@/types'
import { calculateOverallRating, formatPrice } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
  BarElement,
)

type TabKey = 'overview' | 'ta' | 'sentiment' | 'prediction'

interface AdvancedAnalysisTabsProps {
  coin: Coin
  analysis: Analysis | null
}

export default function AdvancedAnalysisTabs({ coin, analysis }: AdvancedAnalysisTabsProps) {
  const [tab, setTab] = useState<TabKey>('overview')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // -------- Real market history (TA) --------
  const [history, setHistory] = useState<number[][] | null>(null)
  useEffect(() => {
    if (!mounted) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/coins/${encodeURIComponent(coin.id)}/history?days=90`).catch(() => null)
        if (!res || !res.ok) return
        const json = await res.json()
        if (!cancelled) setHistory(Array.isArray(json.prices) ? json.prices : null)
      } catch (_) {}
    })()
    return () => { cancelled = true }
  }, [mounted, coin.id])

  const closes = useMemo(() => (history ? history.map(([, p]) => p) : []), [history])
  const labelsFromHist = useMemo(() => (history ? history.map(([t]) => new Date(t).toLocaleDateString()) : []), [history])

  // ---- Indicator helpers ----
  const sma = (period: number, values: number[]) => values.map((_, i) => {
    if (i + 1 < period) return NaN
    const slice = values.slice(i + 1 - period, i + 1)
    const sum = slice.reduce((a, b) => a + b, 0)
    return sum / period
  })
  const ema = (period: number, values: number[]) => {
    if (values.length === 0) return []
    const k = 2 / (period + 1)
    const out: number[] = []
    let prev = values[0]
    out.push(prev)
    for (let i = 1; i < values.length; i++) {
      const v = values[i] * k + prev * (1 - k)
      out.push(v)
      prev = v
    }
    return out
  }
  const rsi = (period: number, values: number[]) => {
    if (values.length < period + 1) return []
    const gains: number[] = []
    const losses: number[] = []
    for (let i = 1; i < values.length; i++) {
      const diff = values[i] - values[i - 1]
      gains.push(Math.max(0, diff))
      losses.push(Math.max(0, -diff))
    }
    const avgGain = sma(period, gains)
    const avgLoss = sma(period, losses)
    const rsiArr: number[] = []
    for (let i = 0; i < avgGain.length; i++) {
      const g = avgGain[i]
      const l = avgLoss[i]
      if (!isFinite(g) || !isFinite(l)) { rsiArr.push(NaN); continue }
      const rs = l === 0 ? 100 : g / l
      const val = 100 - 100 / (1 + rs)
      rsiArr.push(val)
    }
    const pad = new Array(values.length - rsiArr.length).fill(NaN)
    return pad.concat(rsiArr)
  }
  const bollinger = (period: number, mult: number, values: number[]) => {
    const ma = sma(period, values)
    const upper: number[] = []
    const lower: number[] = []
    for (let i = 0; i < values.length; i++) {
      if (i + 1 < period) { upper.push(NaN); lower.push(NaN); continue }
      const win = values.slice(i + 1 - period, i + 1)
      const mean = ma[i]
      const variance = win.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / period
      const sd = Math.sqrt(variance)
      upper.push(mean + mult * sd)
      lower.push(mean - mult * sd)
    }
    return { ma, upper, lower }
  }

  // MACD 12,26,9
  const macdCalc = (fast = 12, slow = 26, signal = 9, values: number[]) => {
    if (values.length === 0) return { macd: [], signal: [], hist: [] as number[] }
    const emaFast = ema(fast, values)
    const emaSlow = ema(slow, values)
    const macd = values.map((_, i) => (emaFast[i] ?? NaN) - (emaSlow[i] ?? NaN))
    const signalLine = ema(signal, macd)
    const hist = macd.map((v, i) => v - (signalLine[i] ?? NaN))
    return { macd, signal: signalLine, hist }
  }

  const overallStars = analysis ? calculateOverallRating(analysis.ratings) : 0

  // Build datasets for TA from real history
  const taData = useMemo(() => {
    const labels = labelsFromHist.slice(-60)
    const prices = closes.slice(-60)
    if (prices.length === 0) {
      return { labels: [], datasets: [] as any[] }
    }
    const ma50Arr = sma(50, prices)
    const ma200Arr = sma(200, prices)
    const bb = bollinger(20, 2, prices)
    const macd = macdCalc(12, 26, 9, prices)
    return {
      labels,
      datasets: [
        { label: 'Price', data: prices, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.15)', fill: false, tension: 0.3 },
        { label: 'MA 50', data: ma50Arr, borderColor: '#60a5fa', borderDash: [6, 6], fill: false, tension: 0.2 },
        { label: 'MA 200', data: ma200Arr, borderColor: '#a78bfa', borderDash: [4, 6], fill: false, tension: 0.2 },
        { label: 'BB Upper', data: bb.upper, borderColor: 'rgba(99, 102, 241, 0.6)', borderWidth: 1, fill: '+1' as any },
        { label: 'BB Lower', data: bb.lower, borderColor: 'rgba(99, 102, 241, 0.6)', borderWidth: 1, backgroundColor: 'rgba(99, 102, 241, 0.08)', fill: '-1' as any },
        { label: 'MACD', data: macd.macd, borderColor: '#10b981', hidden: true },
        { label: 'Signal', data: macd.signal, borderColor: '#f59e0b', hidden: true },
      ],
    }
  }, [labelsFromHist, closes])

  // Sentiment chart from analysis (Twitter / Reddit / Overall)
  const sentimentBar = useMemo(() => {
    const tw = analysis?.social_sentiment?.twitter_score ?? 0
    const rd = analysis?.social_sentiment?.reddit_score ?? 0
    const ov = analysis?.social_sentiment?.overall_score ?? 0
    const vals = [tw, rd, ov]
    return {
      labels: ['Twitter', 'Reddit', 'Overall'],
      datasets: [
        { label: 'Sentiment (−100..100)', data: vals, backgroundColor: vals.map(v => (v >= 0 ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)')) },
      ],
    }
  }, [analysis?.social_sentiment])

  // Prediction probabilities derived from sentiment (if no explicit probabilities)
  const probs = useMemo(() => {
    const s = analysis?.ratings?.sentiment ?? 0
    const bull = Math.max(10, Math.min(80, 50 + s * 0.3))
    const bear = Math.max(10, Math.min(80, 50 - s * 0.3))
    const neu = Math.max(0, 100 - bull - bear)
    return { bull, neu, bear }
  }, [analysis?.ratings?.sentiment])
  const predictionPie = useMemo(() => ({
    labels: ['Bullish', 'Neutral', 'Bearish'],
    datasets: [
      { data: [probs.bull, probs.neu, probs.bear], backgroundColor: ['#22c55e', '#38bdf8', '#ef4444'] },
    ],
  }), [probs])

  const projectionLine = useMemo(() => {
    const base = coin.current_price || 100
    const labels = ['Now', '1w', '1m', '3m']
    const p = analysis?.price_prediction as any
    const s = p?.short_term?.target ?? base
    const m = p?.medium_term?.target ?? base
    const l = p?.long_term?.target ?? base
    return {
      labels,
      datasets: [ { label: 'Trajectory', data: [base, s, m, l], borderColor: '#22c55e' } ],
    }
  }, [coin.current_price, analysis?.price_prediction])

  return (
    <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg">
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'ta', label: 'Technical Analysis' },
          { key: 'sentiment', label: 'Sentiment & Social' },
          { key: 'prediction', label: 'Price Prediction' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as TabKey)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              tab === key
                ? 'bg-gray-800 text-teal-400'
                : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Overview</h3>
          <p className="text-gray-300 text-sm">Full AI analysis and key metrics.</p>
          {analysis && (
            <div>
              <div className="flex items-center mb-3">
                <RatingStars rating={overallStars} size="md" />
                <span className="ml-3 text-gray-400 text-sm">Current Price: <span className="text-white font-semibold">{formatPrice(coin.current_price)}</span></span>
              </div>
              <p className="text-gray-300 text-sm">
                {(typeof analysis.content === 'string' ? analysis.content.replace(/\s+/g, ' ').slice(0, 280) : 'AI analysis available below.')}
                {typeof analysis.content === 'string' && analysis.content.length > 280 ? '…' : ''}
              </p>
            </div>
          )}
          {!analysis && (
            <p className="text-gray-400 text-sm">No AI analysis yet. Use Request Review to generate one.</p>
          )}
          <p className="text-xs text-gray-500">Educational content only. Not financial advice.</p>
        </div>
      )}

      {mounted && tab === 'ta' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Technical Analysis</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">RSI (14)</span><div className="text-white font-semibold">{(() => { const rs = rsi(14, closes); const last = rs[rs.length - 1]; return isFinite(last) ? Math.round(last) : '—' })()}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">EMA(50)</span><div className="text-white font-semibold">{(() => { const e = ema(50, closes); const last = e[e.length - 1]; return isFinite(last) ? `${formatPrice(last)}` : '—' })()}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">50/200 Trend</span><div className="text-white font-semibold">{(() => { const s50 = sma(50, closes); const s200 = sma(200, closes); const a = s50[s50.length-1]; const b = s200[s200.length-1]; if (!isFinite(a)||!isFinite(b)) return '—'; return a>b?'Bullish':'Bearish' })()}</div></div>
          </div>
          <div className="h-72">
            <Line
              data={taData}
              options={{
                plugins: {
                  legend: { labels: { color: '#9CA3AF' } },
                  tooltip: {
                    callbacks: {
                      label: (ctx: any) => `${ctx.dataset.label}: ${typeof ctx.parsed.y === 'number' ? ctx.parsed.y.toFixed(4) : ctx.parsed.y}`,
                    },
                  },
                },
                scales: {
                  x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
          <TAInsightBadge closes={closes} />
          <p className="text-xs text-gray-500">Indicators are illustrative (mock). Use professional tools for trading decisions.</p>
        </div>
      )}

      {mounted && tab === 'sentiment' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Sentiment & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Twitter Score</span><div className="text-white font-semibold">{analysis?.social_sentiment?.twitter_score ?? '—'}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Reddit Score</span><div className="text-white font-semibold">{analysis?.social_sentiment?.reddit_score ?? '—'}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Overall</span><div className="text-white font-semibold">{analysis?.social_sentiment?.overall_score ?? '—'}</div></div>
          </div>
          <div className="h-64">
            <Bar
              data={sentimentBar}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' }, suggestedMin: -100, suggestedMax: 100 },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="text-sm text-gray-300">
            <p className="mb-1"><span className="text-white font-semibold">Interpretation:</span> Positive values suggest bullish tone; negative values bearish.</p>
          </div>
          <p className="text-xs text-gray-500">Sentiment is aggregated for illustration only.</p>
        </div>
      )}

      {mounted && tab === 'prediction' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Price Prediction</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Short Term</span><div className="text-white font-semibold">{analysis?.price_prediction?.short_term ? `${(analysis.price_prediction.short_term.pct).toFixed(2)}% → ${formatPrice(analysis.price_prediction.short_term.target)}` : '—'}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Medium Term</span><div className="text-white font-semibold">{analysis?.price_prediction?.medium_term ? `${(analysis.price_prediction.medium_term.pct).toFixed(2)}% → ${formatPrice(analysis.price_prediction.medium_term.target)}` : '—'}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Long Term</span><div className="text-white font-semibold">{analysis?.price_prediction?.long_term ? `${(analysis.price_prediction.long_term.pct).toFixed(2)}% → ${formatPrice(analysis.price_prediction.long_term.target)}` : '—'}</div></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-black/10 rounded">
              <Pie data={predictionPie} options={{ plugins: { legend: { labels: { color: '#9CA3AF' } } }, maintainAspectRatio: false }} />
            </div>
            <div className="h-64 bg-black/10 rounded">
              <Line
                data={projectionLine}
                options={{
                  plugins: { legend: { labels: { color: '#9CA3AF' } } },
                  scales: {
                    x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">Forecasts are scenario-based and not guarantees. Not financial advice.</p>
        </div>
      )}
    </div>
  )
}

function TAInsightBadge({ closes }: { closes: number[] }) {
  const [text, setText] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (!closes || closes.length < 50) return
        const last = closes[closes.length - 1]
        const s50 = closes.slice(-50).reduce((a, b) => a + b, 0) / 50
        const s200 = closes.length >= 200 ? closes.slice(-200).reduce((a,b)=>a+b,0)/200 : s50
        const rsiVal = (() => {
          const gains: number[] = []; const losses: number[] = []
          for (let i = 1; i < closes.length; i++) {
            const d = closes[i]-closes[i-1]; gains.push(Math.max(0,d)); losses.push(Math.max(0,-d))
          }
          const idx = gains.length - 14
          if (idx < 0) return null
          const g = gains.slice(-14).reduce((a,b)=>a+b,0)/14
          const l = losses.slice(-14).reduce((a,b)=>a+b,0)/14
          const rs = l === 0 ? 100 : g/l
          return 100 - 100/(1+rs)
        })()
        const ema50VsPrice = s50 ? ((last - s50) / s50) * 100 : null
        const trend = s50 > s200 ? 'up' : s50 < s200 ? 'down' : 'flat'
        const bbState = 'neutral'
        const res = await fetch(`/api/analyses/dummy`, { // coin id not used; endpoint summarizes generic
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rsi: rsiVal, ema50VsPrice, trend, bbState })
        }).catch(()=>null)
        const json = res && res.ok ? await res.json() : { summary: null }
        if (!cancelled) setText(json.summary || null)
      } catch (_) {}
    })()
    return () => { cancelled = true }
  }, [closes])
  if (!text) return null
  return (
    <div className="mt-2 text-xs text-gray-400 bg-black/20 rounded px-3 py-2 border border-white/5">
      {text}
    </div>
  )
}



