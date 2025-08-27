import { Suspense } from 'react'
import Image from 'next/image'
import { useLivePrice } from '@/hooks/useLivePrice'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCoinData, getTopCoins } from '@/lib/apis'
import { getAnalysisByCoinId } from '@/lib/supabase'
import PriceChart from '@/components/PriceChart'
import RatingStars from '@/components/RatingStars'
import RequestReviewForm from '@/components/RequestReviewForm'
import AnalysisMarkdown from '@/components/AnalysisMarkdown'
import AdvancedAnalysisTabs from '@/components/AdvancedAnalysisTabs'
import { calculateOverallRating, formatPercentage, formatPrice, truncateText } from '@/lib/utils'
import nextDynamic from 'next/dynamic'
const ClientAnalysis = nextDynamic(() => import('@/components/ClientAnalysis'), { ssr: false })

interface PageProps {
  params: {
    coin_id: string
  }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const coin = await getCoinData(params.coin_id)
    if (!coin) {
      return {
        title: 'Coin Not Found - Crypto AI Insights',
        description: 'The requested cryptocurrency could not be found.',
      }
    }

    return {
      title: `${coin.name} AI Analysis & Review | Price Prediction`,
      description: `Concise AI analysis, price, sentiment, on‑chain, and eco insights for ${coin.name}.`,
      openGraph: {
        title: `${coin.name} AI Analysis & Review | Price Prediction`,
        description: `Concise AI analysis, price, sentiment, on‑chain, and eco insights for ${coin.name}.`,
        images: [coin.image],
      },
    }
  } catch (error) {
    return {
      title: 'Coin Review - Crypto AI Insights',
      description: 'AI-powered cryptocurrency analysis and predictions.',
    }
  }
}

export default async function CoinReviewPage({ params }: PageProps) {
  try {
    console.log('[reviews/[coin_id]] start', { coin_id: params.coin_id })
    let coin = await getCoinData(params.coin_id)
    if (!coin) {
      console.warn('[reviews/[coin_id]] coin not found; trying fallback pool', { coin_id: params.coin_id })
      try {
        const pool = await getTopCoins(2000)
        const found = pool.find(c => c.id === params.coin_id)
        if (found) {
          coin = found as any
        }
      } catch (_) {}
    }
    if (!coin) {
      // As a last resort, create a minimal placeholder so the page still renders
      const prettyName = params.coin_id.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
      coin = {
        id: params.coin_id,
        name: prettyName,
        symbol: params.coin_id.slice(0, 3).toUpperCase(),
        image: '/favicon.ico',
        current_price: 0,
        market_cap: 0,
        total_volume: 0,
        price_change_percentage_24h: 0,
      } as any
    }

    let analysis = null as Awaited<ReturnType<typeof getAnalysisByCoinId>> | null
    try {
      analysis = await getAnalysisByCoinId(params.coin_id)
    } catch (e) {
      console.error('[reviews/[coin_id]] getAnalysisByCoinId failed', e)
      analysis = null
    }
    if (!analysis) {
      // server-side attempt to read client fallback if present via headers cookie (not available). Leave null.
      console.log('[reviews/[coin_id]] no DB analysis; will rely on client fallback if any')
    }
    console.log('[reviews/[coin_id]] fetched', {
      coin: {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
      },
      hasAnalysis: !!analysis,
    })

    // Mock fallbacks if data missing
    const mock = {
      price: 120289.0,
      changePct: -2.07,
      marketCap: '—',
      volume: '—',
      supply: '—',
      stars: 4.5,
      sentiment: -15,
      onChainTen: 7.6,
      ecoText: 'Moderate',
    }

    const price = coin.current_price ?? mock.price
    const change24 = coin.price_change_percentage_24h ?? mock.changePct
    const marketCapText = coin.market_cap ? `${formatPrice(coin.market_cap)}`.replace('$', '$') : mock.marketCap
    const volumeText = coin.total_volume ? `${formatPrice(coin.total_volume)}`.replace('$', '$') : mock.volume
    const supplyText = coin.circulating_supply?.toLocaleString?.() || mock.supply

    const summary = truncateText(
      (analysis?.content || 'Our AI summarizes key trends, risks, and opportunities based on price action, sentiment, activity and eco impact.').replace(/\n/g, ' '),
      150
    )
    const stars = analysis ? calculateOverallRating(analysis.ratings) : mock.stars
    const sentiment = analysis ? analysis.ratings.sentiment : mock.sentiment
    const onChainPercent = analysis ? analysis.ratings.onChain : mock.onChainTen * 10 // convert 0..10 to 0..100
    const ecoValue = analysis ? analysis.ratings.eco : (mock.ecoText === 'Excellent' ? 9 : mock.ecoText === 'Good' ? 7 : mock.ecoText === 'Moderate' ? 5 : 3)

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${coin.name} AI Analysis & Review | Price Prediction`,
            about: coin.name,
            datePublished: analysis?.date || new Date().toISOString(),
            author: { '@type': 'Organization', name: 'Crypto AI Insights' },
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.crypto-ai-insights.com'}/${coin.id}/price-prediction/`,
            image: coin.image,
          }) }} />
          <div className="rounded-lg p-6 bg-gradient-to-r from-crypto-secondary/60 to-crypto-secondary/30 border border-white/5 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image src={coin.image || '/favicon.ico'} alt={coin.name || params.coin_id} width={40} height={40} className="rounded-full" />
                <h1 className="text-2xl font-bold text-white">{coin.name} ({coin.symbol?.toUpperCase?.() || coin.id?.toUpperCase?.()})</h1>
              </div>
              <div className="text-right">
                {/* Live price (client) with fallback to server value */}
                {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                {(() => {
                  const live = useLivePrice(coin.symbol?.toUpperCase?.(), price, change24)
                  const livePrice = live.price ?? price
                  const livePct = live.pct ?? change24
                  return (
                    <div>
                      <p className="text-xl font-semibold text-white">{formatPrice(livePrice)}</p>
                      <p className={`${(livePct || 0) >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                        {formatPercentage(livePct || 0)}
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content 2/3 */}
            <div className="md:col-span-2 space-y-6">
              {/* Last reviewed + CTA */}
              <div className="bg-black/20 rounded-lg p-4 border border-white/5 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Last Reviewed: <span className="text-white font-semibold">{analysis?.date ? new Date(analysis.date).toLocaleString() : 'Never'}</span>
                </div>
                <a href="#request-review" className="text-sm text-crypto-accent hover:underline">Request fresh review</a>
              </div>
              {/* Price Chart */}
              <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">7-Day Price</h3>
                <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-gray-400">Loading chart...</div>}>
                  <PriceChart coinId={coin.id} heightClass="h-[300px]" />
                </Suspense>
              </div>

              {/* Advanced tabs section */}
              <AdvancedAnalysisTabs coin={coin} analysis={analysis || null} />

              {/* Full content placed AFTER indicators (below tabs), replaces summary */}
              <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Full Analysis</h3>
                {analysis ? (
                  (analysis as any).content_format === 'html' ? (
                    <FormattedText html={(analysis as any).content} />
                  ) : (
                    <AnalysisMarkdown content={analysis?.content || 'Analysis content is not available yet.'} />
                  )
                ) : (
                  <ClientAnalysis coinId={coin.id} />
                )}
              </div>

              {/* Inline Request form anchor */}
              <div id="request-review" className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Request a New Review</h3>
                <RequestReviewForm coin={coin} />
              </div>
            </div>

            {/* Sidebar 1/3 */}
            <aside className="space-y-6">
              <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Quick Facts</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Market Cap: <span className="text-white font-medium">{marketCapText}</span></li>
                  <li>Volume (24h): <span className="text-white font-medium">{volumeText}</span></li>
                  <li>Circulating Supply: <span className="text-white font-medium">{supplyText}</span></li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Fixed Request button (desktop), full-width on mobile */}
          <div className="mt-6 md:mt-0">
            <a href="#request-review" className="block w-full md:w-auto md:fixed md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-5 rounded-md shadow-lg transform transition hover:scale-105 text-center">
              Request New Review
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading coin review:', error)
    notFound()
  }
}

function ReviewDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="text-center mb-8">
        <div className="h-12 bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-600 rounded w-1/2 mx-auto"></div>
      </div>
      <div className="bg-crypto-secondary/50 rounded-lg p-6 mb-8">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
      </div>
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

function FormattedText({ html }: { html: string }) {
  if (!html) {
    return <div className="text-gray-400">Loading formatted content...</div>
  }
  return (
    <div
      className="prose prose-invert max-w-none prose-h2:text-2xl prose-p:text-gray-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
