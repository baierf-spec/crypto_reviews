'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatMarketCap, formatPercentage, getSentimentColor, getEcoColor, calculateOverallRating } from '@/lib/utils'
import { Coin, Analysis } from '@/types'
import RatingStars from './RatingStars'
import EcoGauge from './EcoGauge'
import { TrendingUp, TrendingDown, Sparkles, Zap, Clock } from 'lucide-react'

interface CoinCardProps {
  coin: Coin
  analysis?: Analysis
}

export default function CoinCard({ coin, analysis }: CoinCardProps) {
  const hasAnalysis = analysis && analysis.content
  const safeRatings = analysis?.ratings ?? { sentiment: 0, onChain: 50, eco: 5 }
  const sentimentStars = Math.max(0, Math.min(5, (safeRatings.sentiment + 100) / 200 * 5))
  const onChainStars = Math.max(0, Math.min(5, (safeRatings.onChain || 0) / 20))
  const ecoStars = Math.max(0, Math.min(5, (safeRatings.eco || 0) / 2))

  return (
    <div className="bg-crypto-secondary/50 rounded-xl p-5 hover:bg-crypto-secondary/70 transition-colors border border-white/5">
      {/* Coin Header */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={coin.image}
          alt={coin.name}
          width={40}
          height={40}
          className="rounded-full ring-1 ring-white/10"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{coin.name}</h3>
          <p className="text-gray-400 text-xs">{coin.symbol.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{formatPrice(coin.current_price)}</p>
          <div className="flex items-center justify-end">
            {coin.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <p className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(coin.price_change_percentage_24h)}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3 mb-4">
        <span>MC: <span className="text-white">{formatMarketCap(coin.market_cap)}</span></span>
        <span>Vol: <span className="text-white">{formatMarketCap(coin.total_volume)}</span></span>
      </div>

      {/* AI Analysis Section */}
      {hasAnalysis ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">AI Analysis</h4>
            <RatingStars rating={calculateOverallRating(analysis.ratings)} size="sm" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <RatingStars rating={sentimentStars} size="sm" />
              <p className="text-gray-400 mt-1">Sentiment</p>
              <p className={`text-[11px] ${getSentimentColor(analysis.ratings.sentiment)}`}>
                {analysis.ratings.sentiment >= 4 ? 'Bullish' : analysis.ratings.sentiment >= 2 ? 'Neutral' : 'Bearish'}
              </p>
            </div>
            <div className="text-center">
              <RatingStars rating={onChainStars} size="sm" />
              <p className="text-gray-400 mt-1">On-Chain</p>
            </div>
            <div className="text-center">
              <EcoGauge rating={analysis.ratings.eco} />
              <p className="text-gray-400 mt-1">Eco</p>
              <p className={`text-[11px] ${getEcoColor(analysis.ratings.eco)}`}>
                {analysis.ratings.eco >= 4 ? 'Green' : analysis.ratings.eco >= 2 ? 'Moderate' : 'High Impact'}
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-2">
            {analysis.content.replace(/\s+/g, ' ').slice(0, 180)}...
          </p>

          <Link
            href={`/reviews/${coin.id}`}
            className="block w-full bg-crypto-accent hover:bg-crypto-accent/90 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            Read Full Analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-crypto-accent mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No AI analysis yet</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/reviews/${coin.id}`}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Now</span>
            </Link>
            <Link
              href={`/reviews/${coin.id}`}
              className="w-full bg-crypto-primary/20 hover:bg-crypto-primary/30 text-crypto-accent py-2 px-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Join Queue</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
