import { Suspense } from 'react'
import { getLatestAnalyses } from '@/lib/supabase'
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
  try {
    // Fetch latest analyses from database
    const analyses = await getLatestAnalyses(20)
    
    if (analyses.length > 0) {
      // Fetch coin data for each analysis
      const coins = await getTopCoins(1000)
      
      // Match analyses with coin data
      const reviewsWithCoins = analyses
        .map(analysis => {
          const coin = coins.find(c => c.id === analysis.coin_id)
          return coin ? { coin, analysis } : null
        })
        .filter((item): item is { coin: Coin; analysis: Analysis } => item !== null)
        .slice(0, 20)

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsWithCoins.map(({ coin, analysis }) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              analysis={analysis}
            />
          ))}
        </div>
      )
    } else {
      // Fallback: show top coins without analysis
      const coins = await getTopCoins(20)
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map(coin => (
            <CoinCard
              key={coin.id}
              coin={coin}
              analysis={undefined}
            />
          ))}
        </div>
      )
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Fallback: show top coins without analysis
    const coins = await getTopCoins(20)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coins.map(coin => (
          <CoinCard
            key={coin.id}
            coin={coin}
            analysis={undefined}
          />
        ))}
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
