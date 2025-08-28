'use client'

import { useEffect, useState } from 'react'
import { getLatestAnalyses } from '@/lib/supabase'
import { getTopCoins } from '@/lib/apis'
import { getAllAnalysesFromMemory } from '@/lib/analyses'
import CoinCard from './CoinCard'
import { Coin, Analysis } from '@/types'

export default function LatestReviews() {
  const [reviews, setReviews] = useState<Array<{ coin: Coin; analysis?: Analysis }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestReviews() {
      try {
        console.log('LatestReviews: Fetching latest analyses...')
        
        // Fetch latest analyses from database (get more to ensure we have enough)
        let raw = await getLatestAnalyses(50)
        console.log('LatestReviews: Raw analyses from DB:', raw?.length || 0)
        
        // If no analyses from DB, try memory storage
        if (!raw || raw.length === 0) {
          console.log('LatestReviews: No DB analyses, trying memory...')
          raw = getAllAnalysesFromMemory()
          console.log('LatestReviews: Memory analyses:', raw?.length || 0)
        }
        
        const analyses: Analysis[] = []
        const seen = new Set<string>()
        
        // Deduplicate by coin_id and take the latest analysis for each coin
        for (const a of raw) {
          if (seen.has(a.coin_id)) continue
          seen.add(a.coin_id)
          analyses.push(a)
          if (analyses.length >= 6) break
        }
        
        console.log('LatestReviews: Deduplicated analyses:', analyses.length)
        
        if (analyses.length > 0) {
          // Fetch coin data for each analysis
          const coins = await getTopCoins(1000)
          console.log('LatestReviews: Coins fetched:', coins?.length || 0)
          
          // Match analyses with coin data
          const reviewsWithCoins: Array<{ coin: Coin; analysis?: Analysis }> = analyses
            .map(analysis => {
              const coin = coins.find(c => c.id === analysis.coin_id)
              return coin ? { coin, analysis } : null
            })
            .filter((item): item is { coin: Coin; analysis: Analysis } => item !== null)
            .slice(0, 6)

          console.log('LatestReviews: Reviews with coins:', reviewsWithCoins.length)
          
          // If we have fewer than 6 reviews with analysis, fill with top coins
          if (reviewsWithCoins.length < 6) {
            const remainingCount = 6 - reviewsWithCoins.length
            const usedCoinIds = new Set(reviewsWithCoins.map(r => r.coin.id))
            
            const topCoins = coins
              .filter(coin => !usedCoinIds.has(coin.id))
              .slice(0, remainingCount)
              .map(coin => ({ coin, analysis: undefined }))
            
            reviewsWithCoins.push(...topCoins)
            console.log('LatestReviews: Added top coins to fill:', topCoins.length)
          }

          setReviews(reviewsWithCoins)
        } else {
          console.log('LatestReviews: No analyses found, using top coins')
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
