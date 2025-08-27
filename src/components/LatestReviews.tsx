'use client'

import { useEffect, useState } from 'react'
import { getLatestAnalyses } from '@/lib/supabase'
import { getTopCoins } from '@/lib/apis'
import CoinCard from './CoinCard'
import { Coin, Analysis } from '@/types'

export default function LatestReviews() {
  const [reviews, setReviews] = useState<Array<{ coin: Coin; analysis?: Analysis }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestReviews() {
      try {
        // Fetch latest analyses from database
        // Fetch more to allow deduplication by coin
        const raw = await getLatestAnalyses(30)
        const analyses: Analysis[] = []
        const seen = new Set<string>()
        for (const a of raw) {
          if (seen.has(a.coin_id)) continue
          seen.add(a.coin_id)
          analyses.push(a)
          if (analyses.length >= 6) break
        }
        
        if (analyses.length > 0) {
          // Fetch coin data for each analysis
          const coinIds = analyses.map(a => a.coin_id).join(',')
          const coins = await getTopCoins(1000)
          
          // Match analyses with coin data
          const reviewsWithCoins = analyses
            .map(analysis => {
              const coin = coins.find(c => c.id === analysis.coin_id)
              return coin ? { coin, analysis } : null
            })
            .filter((item): item is { coin: Coin; analysis: Analysis } => item !== null)
            .slice(0, 6)

          setReviews(reviewsWithCoins)
        } else {
          // Fallback: show top coins without analysis
          const coins = await getTopCoins(6)
          setReviews(coins.map(coin => ({ coin, analysis: undefined })))
        }
      } catch (error) {
        console.error('Error fetching latest reviews:', error)
        // Fallback: show top coins without analysis
        const coins = await getTopCoins(6)
        setReviews(coins.map(coin => ({ coin, analysis: undefined })))
      } finally {
        setLoading(false)
      }
    }

    fetchLatestReviews()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map(({ coin, analysis }) => (
        <CoinCard
          key={coin.id}
          coin={coin}
          analysis={analysis}
        />
      ))}
    </div>
  )
}
