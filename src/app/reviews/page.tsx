import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Latest Crypto Reviews | AI-Powered Coin Analysis & Ratings',
}
import { getLatestAnalyses } from '@/lib/supabase'
import { getAllAnalysesFromMemory } from '@/lib/analyses'
import { getTopCoins } from '@/lib/apis'
import CoinCard from '@/components/CoinCard'
import { Coin, Analysis } from '@/types'

export default async function ReviewsPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Latest Crypto Reviews
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI-powered analysis of the top cryptocurrencies with sentiment analysis, on-chain data, and eco ratings.
          </p>
        </div>

        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsList />
        </Suspense>
      </div>
    </div>
  )
}

async function ReviewsList() {
  console.log('ReviewsList: Starting to fetch data...')
  try {
    // Fetch latest analyses from database
    console.log('ReviewsList: Fetching analyses from database...')
    let analysesRaw = await getLatestAnalyses(80)
    console.log('ReviewsList: Database analyses result:', analysesRaw?.length || 0)

    if (!analysesRaw || analysesRaw.length === 0) {
      console.log('ReviewsList: No analyses from DB, trying memory...')
      analysesRaw = getAllAnalysesFromMemory()
      console.log('ReviewsList: Memory analyses result:', analysesRaw?.length || 0)
      console.log('ReviewsList: Memory analyses raw:', analysesRaw)
    }

    // Ensure analysesRaw is an array
    if (!Array.isArray(analysesRaw)) {
      console.log('ReviewsList: analysesRaw is not an array, setting to empty array')
      analysesRaw = []
    }

    // Deduplicate by coin_id keeping latest
    const analyses: Analysis[] = []
    const seen = new Set<string>()
    for (const a of analysesRaw) {
      if (seen.has(a.coin_id)) continue
      seen.add(a.coin_id)
      analyses.push(a)
      if (analyses.length >= 20) break
    }
    console.log('ReviewsList: Deduplicated analyses:', analyses.length)
    console.log('ReviewsList: Analysis coin IDs:', analyses.map(a => a.coin_id))
    
    if (analyses.length > 0) {
      console.log('ReviewsList: Fetching coin data...')
      // Fetch coin data for each analysis
      const coins = await getTopCoins(1000)
      console.log('ReviewsList: Coins fetched:', coins?.length || 0)
      
      // Match analyses with coin data
      const reviewsWithCoins = analyses
        .map(analysis => {
          const coin = coins.find(c => c.id === analysis.coin_id)
          console.log(`ReviewsList: Looking for coin ${analysis.coin_id}, found:`, coin ? 'yes' : 'no')
          return coin ? { coin, analysis } : null
        })
        .filter((item): item is { coin: Coin; analysis: Analysis } => item !== null)
        .slice(0, 20)

      console.log('ReviewsList: Reviews with coins:', reviewsWithCoins.length)

      if (reviewsWithCoins.length > 0) {
        return (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                ✅ Found {reviewsWithCoins.length} reviews with analysis data
                {reviewsWithCoins.length < analyses.length && (
                  <span className="text-yellow-400 ml-2">
                    ({analyses.length - reviewsWithCoins.length} reviews not shown due to missing coin data)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviewsWithCoins.map(({ coin, analysis }) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  analysis={analysis}
                />
              ))}
            </div>
          </div>
        )
      } else {
        console.log('ReviewsList: No reviews with coins found, falling back to top coins')
        throw new Error('No reviews with coins found')
      }
    } else {
      console.log('ReviewsList: No analyses, trying to fetch top coins...')
      // Fallback: show top coins without analysis
      try {
        const coins = await getTopCoins(20)
        console.log('ReviewsList: Top coins fetched:', coins?.length || 0)
        if (coins && coins.length > 0) {
          return (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  ℹ️ No analyses available. Showing top {coins.length} cryptocurrencies.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {coins.map(coin => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    analysis={undefined}
                  />
                ))}
              </div>
            </div>
          )
        }
      } catch (fallbackError) {
        console.error('Fallback getTopCoins failed:', fallbackError)
      }

      console.log('ReviewsList: Using mock data fallback...')
      // If getTopCoins also fails, show mock data
      const mockCoins = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          current_price: 45000,
          market_cap: 850000000000,
          total_volume: 25000000000,
          price_change_percentage_24h: 2.5,
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          market_cap_rank: 1,
          high_24h: 46000,
          low_24h: 44000,
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          current_price: 3200,
          market_cap: 380000000000,
          total_volume: 15000000000,
          price_change_percentage_24h: 1.8,
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
          market_cap_rank: 2,
          high_24h: 3300,
          low_24h: 3100,
        },
        {
          id: 'binancecoin',
          name: 'BNB',
          symbol: 'BNB',
          current_price: 320,
          market_cap: 52000000000,
          total_volume: 2000000000,
          price_change_percentage_24h: 0.5,
          image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
          market_cap_rank: 3,
          high_24h: 325,
          low_24h: 315,
        }
      ]

      return (
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              ⚠️ No analyses available and API data temporarily unavailable. Showing sample cryptocurrency data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockCoins.map(coin => (
              <CoinCard
                key={coin.id}
                coin={coin}
                analysis={undefined}
              />
            ))}
          </div>
        </div>
      )
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    try {
      const coins = await getTopCoins(20)
      if (coins && coins.length > 0) {
        return (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                ℹ️ API error occurred. Showing top {coins.length} cryptocurrencies.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {coins.map(coin => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  analysis={undefined}
                />
              ))}
            </div>
          </div>
        )
      }
    } catch (fallbackError) {
      console.error('Fallback getTopCoins also failed:', fallbackError)
    }

    console.log('ReviewsList: Final fallback - showing mock data...')
    const mockCoins = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        current_price: 45000,
        market_cap: 850000000000,
        total_volume: 25000000000,
        price_change_percentage_24h: 2.5,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        market_cap_rank: 1,
        high_24h: 46000,
        low_24h: 44000,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        current_price: 3200,
        market_cap: 380000000000,
        total_volume: 15000000000,
        price_change_percentage_24h: 1.8,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        market_cap_rank: 2,
        high_24h: 3300,
        low_24h: 3100,
      },
      {
        id: 'binancecoin',
        name: 'BNB',
        symbol: 'BNB',
        current_price: 320,
        market_cap: 52000000000,
        total_volume: 2000000000,
        price_change_percentage_24h: 0.5,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        market_cap_rank: 3,
        high_24h: 325,
        low_24h: 315,
      }
    ]

    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            ❌ All data sources failed. Showing sample cryptocurrency data.
          </p>
          <p className="text-red-300 text-xs mt-1">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mockCoins.map(coin => (
            <CoinCard
              key={coin.id}
              coin={coin}
              analysis={undefined}
            />
          ))}
        </div>
      </div>
    )
  }
}

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(12)].map((_, i) => (
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
