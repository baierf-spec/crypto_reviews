import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getCoinData } from '@/lib/apis'
import { getAnalysisByCoinId } from '@/lib/supabase'
import { getAnalysisFromMemory } from '@/lib/analyses'
import CoinReviewDetail from '@/components/CoinReviewDetail'
import TradingViewChart from '@/components/TradingViewChart'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { coin_id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const coin = await getCoinData(params.coin_id)
  if (!coin) return { title: 'Coin Not Found' }

  return {
    title: `${coin.name} (${coin.symbol}) AI Analysis & Price Prediction | Crypto AI Insights`,
    description: `Get comprehensive AI-powered analysis of ${coin.name} including technical indicators, sentiment analysis, price predictions, and investment recommendations.`,
    keywords: `${coin.name}, ${coin.symbol}, cryptocurrency analysis, price prediction, technical analysis, AI analysis`,
  }
}

export default async function CoinReviewPage({ params }: PageProps) {
  const coin = await getCoinData(params.coin_id)
  if (!coin) notFound()

  // Try to get existing analysis
  let analysis = await getAnalysisByCoinId(params.coin_id)
  if (!analysis) {
    analysis = getAnalysisFromMemory(params.coin_id)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* SEO Headings */}
        <h1 className="sr-only">{coin.name} ({coin.symbol}) AI Analysis & Price Prediction</h1>
        
        {/* Disclaimer */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
          <h2 className="text-red-400 font-semibold mb-2">⚠️ Important Disclaimer</h2>
          <p className="text-red-300 text-sm">
            This analysis is for educational purposes only and does not constitute financial advice. 
            Cryptocurrency investments carry significant risk. Always conduct your own research and 
            consult with financial advisors before making investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coin Header */}
            <div className="bg-crypto-secondary/50 rounded-xl p-6 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-16 h-16 rounded-full ring-2 ring-crypto-accent"
                />
                <div>
                  <h2 className="text-3xl font-bold text-white">{coin.name}</h2>
                  <p className="text-gray-400 text-lg">{coin.symbol.toUpperCase()}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-white">${coin.current_price?.toLocaleString()}</p>
                  <p className={`text-sm ${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white font-semibold">${coin.market_cap?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Volume (24h)</p>
                  <p className="text-white font-semibold">${coin.total_volume?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Rank</p>
                  <p className="text-white font-semibold">#{coin.market_cap_rank}</p>
                </div>
                <div>
                  <p className="text-gray-400">High/Low (24h)</p>
                  <p className="text-white font-semibold">
                    ${coin.high_24h?.toLocaleString()} / ${coin.low_24h?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* TradingView Chart */}
            <div className="bg-crypto-secondary/50 rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-xl font-semibold text-white">Price Chart</h3>
              </div>
              <div className="h-96">
                <TradingViewChart coinId={params.coin_id} heightClass="h-full" />
              </div>
            </div>

            {/* AI Analysis */}
            <Suspense fallback={<div className="animate-pulse bg-crypto-secondary/50 rounded-xl h-64"></div>}>
              <CoinReviewDetail coin={coin} analysis={analysis} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-crypto-secondary/50 rounded-xl p-6 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Circulating Supply</span>
                  <span className="text-white">{coin.circulating_supply?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-white">{coin.total_supply?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Supply</span>
                  <span className="text-white">{coin.max_supply?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Risk Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Risk Warning</h3>
              <p className="text-yellow-300 text-sm">
                Cryptocurrency markets are highly volatile. Past performance does not guarantee future results. 
                Only invest what you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


