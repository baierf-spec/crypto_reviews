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

  // -------- Mock/derived data (replace with real API integrations) --------
  const mock = useMemo(() => ({
    rsi: 65,
    macd: 1.2,
    ma50: 0.98 * (coin.current_price || 100),
    ma200: 0.92 * (coin.current_price || 100),
    bbUpper: 1.05 * (coin.current_price || 100),
    bbLower: 0.95 * (coin.current_price || 100),
    tweetVolume: 15000,
    redditUpvotes: 5000,
    sentimentBreakdown: { pos: 70, neu: 20, neg: 10 },
    sentiment7d: [-10, 5, 15, -5, 8, 12, 20],
    predictions: {
      bullish: { changePct: 0.20, prob: 60 },
      neutral: { changePct: 0.00, prob: 20 },
      bearish: { changePct: -0.10, prob: 20 },
    },
    hashtags: ['#bitcoin', '#altcoins', '#XRP', '#crypto', '#trading'],
    mentions: ['@binance', '@coinbase', '@cz_binance'],
  }), [coin.current_price])

  const overallStars = analysis ? calculateOverallRating(analysis.ratings) : 0

  // Build simple line datasets for TA (price with MAs and Bollinger bands)
  const taData = useMemo(() => {
    const labels = Array.from({ length: 30 }, (_, i) => `D-${30 - i}`)
    const base = coin.current_price || 100
    const prices = labels.map((_, i) => base * (1 + Math.sin(i / 6) * 0.05))
    const ma50 = labels.map(() => mock.ma50)
    const ma200 = labels.map(() => mock.ma200)
    const bbUpper = labels.map(() => mock.bbUpper)
    const bbLower = labels.map(() => mock.bbLower)
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.15)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'MA 50',
          data: ma50,
          borderColor: '#60a5fa',
          borderDash: [6, 6],
          fill: false,
          tension: 0.2,
        },
        {
          label: 'MA 200',
          data: ma200,
          borderColor: '#a78bfa',
          borderDash: [4, 6],
          fill: false,
          tension: 0.2,
        },
        {
          label: 'BB Upper',
          data: bbUpper,
          borderColor: 'rgba(99, 102, 241, 0.6)',
          borderWidth: 1,
          fill: '+1',
        },
        {
          label: 'BB Lower',
          data: bbLower,
          borderColor: 'rgba(99, 102, 241, 0.6)',
          borderWidth: 1,
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          fill: '-1',
        },
      ],
    }
  }, [coin.current_price, mock.bbLower, mock.bbUpper, mock.ma200, mock.ma50])

  // Sentiment bar over 7 days
  const sentimentBar = useMemo(() => ({
    labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'],
    datasets: [
      {
        label: 'Sentiment (−100..100)',
        data: mock.sentiment7d,
        backgroundColor: mock.sentiment7d.map(v => (v >= 0 ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)')),
      },
    ],
  }), [mock.sentiment7d])

  // Prediction charts
  const predictionPie = useMemo(() => ({
    labels: ['Bullish', 'Neutral', 'Bearish'],
    datasets: [
      {
        data: [mock.predictions.bullish.prob, mock.predictions.neutral.prob, mock.predictions.bearish.prob],
        backgroundColor: ['#22c55e', '#38bdf8', '#ef4444'],
      },
    ],
  }), [mock.predictions])

  const projectionLine = useMemo(() => {
    const base = coin.current_price || 100
    const labels = ['Now', '1w', '1m', '1y']
    const path = (pct: number) => [base, base * (1 + pct), base * (1 + pct * 2), base * (1 + pct * 4)]
    return {
      labels,
      datasets: [
        { label: 'Bullish', data: path(mock.predictions.bullish.changePct), borderColor: '#22c55e' },
        { label: 'Neutral', data: path(mock.predictions.neutral.changePct), borderColor: '#38bdf8' },
        { label: 'Bearish', data: path(mock.predictions.bearish.changePct), borderColor: '#ef4444' },
      ],
    }
  }, [coin.current_price, mock.predictions])

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
              <AnalysisMarkdown content={analysis.content} />
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">RSI (14)</span><div className="text-white font-semibold">{mock.rsi}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">MACD (12,26,9)</span><div className="text-white font-semibold">{mock.macd}</div></div>
          </div>
          <div className="h-64">
            <Line
              data={taData}
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
          <p className="text-xs text-gray-500">Indicators are illustrative (mock). Use professional tools for trading decisions.</p>
        </div>
      )}

      {mounted && tab === 'sentiment' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Sentiment & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Tweet Volume</span><div className="text-white font-semibold">{mock.tweetVolume.toLocaleString()}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Reddit Upvotes</span><div className="text-white font-semibold">{mock.redditUpvotes.toLocaleString()}</div></div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5"><span className="text-gray-400">Breakdown</span><div className="text-white font-semibold">+{mock.sentimentBreakdown.pos}% / {mock.sentimentBreakdown.neu}% / −{mock.sentimentBreakdown.neg}%</div></div>
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
            <p className="mb-1"><span className="text-white font-semibold">Top Hashtags:</span> {mock.hashtags.join(', ')}</p>
            <p><span className="text-white font-semibold">Top Mentions:</span> {mock.mentions.join(', ')}</p>
          </div>
          <p className="text-xs text-gray-500">Sentiment is aggregated for illustration only.</p>
        </div>
      )}

      {mounted && tab === 'prediction' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Price Prediction</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
              <span className="text-gray-400">Bullish (1w)</span>
              <div className="text-white font-semibold">+{Math.round(mock.predictions.bullish.changePct * 100)}% • {mock.predictions.bullish.prob}%</div>
            </div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
              <span className="text-gray-400">Neutral (1w)</span>
              <div className="text-white font-semibold">0% • {mock.predictions.neutral.prob}%</div>
            </div>
            <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
              <span className="text-gray-400">Bearish (1w)</span>
              <div className="text-white font-semibold">{Math.round(mock.predictions.bearish.changePct * 100)}% • {mock.predictions.bearish.prob}%</div>
            </div>
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



