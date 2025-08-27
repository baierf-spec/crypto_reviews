import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import RatingStars from '@/components/RatingStars'
import { getLatestAnalyses } from '@/lib/supabase'
import { getTopCoins } from '@/lib/apis'
import { calculateOverallRating, formatPercentage, formatPrice, truncateText, formatMarketCap } from '@/lib/utils'
import { Analysis, Coin } from '@/types'

export const metadata: Metadata = {
  description: 'Discover the latest 10 AI-powered crypto reviews with price, ratings, sentiment, on‑chain and eco insights. Read concise analysis summaries and dive deeper into full reports.'
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Latest Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest AI-Powered Reviews
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get daily insights on top cryptocurrencies with our advanced AI analysis
            </p>
          </div>
          <Suspense fallback={<ReviewsSkeleton />}>
            {/* Server component list for latest professional reviews */}
            <LatestProfessionalReviews />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-crypto-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Ahead with AI Insights
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of crypto enthusiasts who trust our AI-powered analysis for their investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-crypto-primary to-crypto-accent text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-crypto-primary/25 transition-all duration-200">
              Explore All Reviews
            </button>
            <button className="border border-crypto-primary/50 text-crypto-primary px-8 py-3 rounded-lg font-semibold hover:bg-crypto-primary/10 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-crypto-secondary/50 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-600 rounded w-5/6"></div>
            <div className="h-3 bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function LatestProfessionalReviews() {
  let analyses: Analysis[] = []
  let coins: Coin[] = []

  try {
    analyses = await getLatestAnalyses(10)
  } catch (_) {
    analyses = []
  }

  try {
    coins = await getTopCoins(1000)
  } catch (_) {
    coins = []
  }

  // If we have analyses, match them with coin market data
  let items: Array<{ coin: Coin; analysis: Analysis | null }> = []
  if (analyses.length > 0 && coins.length > 0) {
    items = analyses
      .map(a => {
        const coin = coins.find(c => c.id === a.coin_id)
        return coin ? { coin, analysis: a } : null
      })
      .filter((v): v is { coin: Coin; analysis: Analysis } => v !== null)
      .slice(0, 10)
  }

  // Mock when needed (either no analyses or no matching coins)
  if (items.length === 0) {
    const mockCoins = coins.slice(0, 10)
    const fallback = mockCoins.length ? mockCoins : [
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        current_price: 0.216074,
        market_cap: 0,
        market_cap_rank: 0,
        price_change_percentage_24h: -1.11,
        total_volume: 0,
        high_24h: 0.22,
        low_24h: 0.21,
      } as Coin,
    ]

    items = fallback.map((coin): { coin: Coin; analysis: Analysis | null } => ({
      coin,
      analysis: {
        id: 'mock',
        coin_id: coin.id,
        coin_name: coin.name,
        coin_symbol: coin.symbol,
        content: 'AI summary unavailable. This is a mock preview for layout and testing.',
        date: new Date().toISOString(),
        ratings: {
          sentiment: -20,
          onChain: 60,
          eco: 8,
          overall: 0,
        },
        price_prediction: {
          short_term: { pct: 1, target: coin.current_price, low: coin.low_24h, high: coin.high_24h },
          medium_term: { pct: 1, target: coin.current_price, low: coin.low_24h, high: coin.high_24h },
          long_term: { pct: 1, target: coin.current_price, low: coin.low_24h, high: coin.high_24h },
          confidence: 0.5,
          currency: 'USD',
        },
        on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 },
        social_sentiment: { twitter_score: -20, reddit_score: -10, overall_score: -15 },
      } as Analysis,
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(({ coin, analysis }) => (
        <article key={coin.id} className="rounded-lg bg-crypto-secondary/50 p-4 shadow-md hover:shadow-lg transition transform hover:scale-105">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src={coin.image} alt={coin.name} width={40} height={40} className="rounded-full" />
              <div>
                <h3 className="text-white font-semibold leading-tight text-base">{coin.name} ({coin.symbol})</h3>
                <p className="text-gray-400 text-sm">{/* Placeholder for extra info if needed */}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-base">{formatPrice(coin.current_price)}</p>
              <p className={`${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold text-sm`}>
                {formatPercentage(coin.price_change_percentage_24h || 0)}
              </p>
            </div>
          </div>

          {/* Middle row (stats + overall rating) */}
          <div className="mt-3 space-y-3">
            {/* Compact metrics instead of description */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-400">
              <div>
                <div className="uppercase tracking-wide">MC</div>
                <div className="text-white font-medium">{formatMarketCap(coin.market_cap)}</div>
              </div>
              <div>
                <div className="uppercase tracking-wide">Vol (24h)</div>
                <div className="text-white font-medium">{formatMarketCap(coin.total_volume)}</div>
              </div>
              <div>
                <div className="uppercase tracking-wide">Rank</div>
                <div className="text-white font-medium">#{coin.market_cap_rank || '—'}</div>
              </div>
            </div>
            <div className="flex items-center">
              <RatingStars rating={calculateOverallRating(analysis ? analysis.ratings : { sentiment: 0, onChain: 50, eco: 5 })} size="sm" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-4 space-y-3">
            {/* Sentiment */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Sentiment</span>
                <span>{analysis ? analysis.ratings.sentiment : 0}</span>
              </div>
              <div className="h-2 rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  style={{ width: `${Math.max(0, Math.min(100, ((analysis ? analysis.ratings.sentiment : 0) + 100) / 2))}%` }}
                />
              </div>
            </div>

            {/* On-Chain */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>On-Chain</span>
                <span>{Math.round(((analysis ? analysis.ratings.onChain : 60) / 10) * 10) / 10}/10</span>
              </div>
              <div className="h-2 rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  style={{ width: `${Math.max(0, Math.min(100, ((analysis ? analysis.ratings.onChain : 60) / 10) * 10))}%` }}
                />
              </div>
            </div>

            {/* Eco */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Eco Rating</span>
              <EcoBadge value={analysis ? analysis.ratings.eco : 8} />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5">
            <Link href={`/${coin.id}/price-prediction/`} className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition">
              Read Full Analysis
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

function EcoBadge({ value }: { value: number }) {
  let label = 'Moderate'
  let cls = 'text-yellow-400'
  if (value >= 8) { label = 'Excellent'; cls = 'text-green-400' }
  else if (value >= 6) { label = 'Good'; cls = 'text-green-300' }
  else if (value < 4) { label = 'Poor'; cls = 'text-red-400' }
  return <span className={`font-semibold ${cls}`}>{label}</span>
}
