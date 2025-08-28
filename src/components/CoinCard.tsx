'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatMarketCap, formatPercentage, getSentimentColor, calculateOverallRating } from '@/lib/utils'
import { useLivePrice } from '@/hooks/useLivePrice'
import { Coin, Analysis } from '@/types'
import RatingStars from './RatingStars'
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
  // Eco rating removed from card UI

  return (
    <div className="bg-crypto-secondary/50 rounded-xl p-3 sm:p-5 hover:bg-crypto-secondary/70 transition-colors border border-white/5">
      {/* Coin Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Image
          src={coin.image}
          alt={coin.name}
          width={40}
          height={40}
          className="rounded-full ring-1 ring-white/10"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-white truncate">{coin.name}</h3>
          <p className="text-gray-400 text-xs">{coin.symbol.toUpperCase()}</p>
        </div>
        <div className="text-right">
          {(() => {
            const live = useLivePrice(coin.symbol?.toUpperCase?.(), coin.current_price, coin.price_change_percentage_24h)
            const livePrice = live.price ?? coin.current_price
            const livePct = live.pct ?? coin.price_change_percentage_24h
            return (
              <>
                <p className="text-white font-semibold text-sm sm:text-base">{formatPrice(livePrice)}</p>
                <div className="flex items-center justify-end">
                  {(livePct || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mr-1" />
                  )}
                  <p className={`text-xs ${(livePct || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(livePct || 0)}
                  </p>
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="border-t border-white/5 pt-2 sm:pt-3 mb-3 sm:mb-4">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs text-gray-400">
          <div>
            <div className="uppercase tracking-wide flex items-center gap-1">MC</div>
            <div className="text-white font-medium text-xs sm:text-sm">{formatMarketCap(coin.market_cap)}</div>
          </div>
          <div>
            <div className="uppercase tracking-wide flex items-center gap-1">Vol (24h)</div>
            <div className="text-white font-medium text-xs sm:text-sm">{formatMarketCap(coin.total_volume)}</div>
          </div>
          <div>
            <div className="uppercase tracking-wide flex items-center gap-1">Rank</div>
            <div className="text-white font-medium text-xs sm:text-sm">#{coin.market_cap_rank || '—'}</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {hasAnalysis ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-medium text-gray-300">AI Analysis</h4>
            <RatingStars
              rating={calculateOverallRating(analysis.ratings)}
              size="sm"
              compact
              showHelpIcon={false}
              className="shrink-0"
              hint="Overall rating blends available signals."
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs items-start">
            <div className="text-center">
              <RatingStars rating={sentimentStars} size="xs" compact showHelpIcon={false} hint="Sentiment (−100..100) rescaled 0–5 stars. Higher = more bullish." />
              <p className="text-gray-400 mt-1 text-xs">Sentiment</p>
              <p className={`text-[10px] sm:text-[11px] ${getSentimentColor(analysis.ratings.sentiment)}`}>
                {analysis.ratings.sentiment >= 4 ? 'Bullish' : analysis.ratings.sentiment >= 2 ? 'Neutral' : 'Bearish'}
              </p>
            </div>
            <div className="text-center">
              <RatingStars rating={onChainStars} size="xs" compact showHelpIcon={false} hint="On‑Chain score (0..100) rescaled 0–5 stars from activity/growth/flows." />
              <p className="text-gray-400 mt-1 text-xs">On-Chain</p>
            </div>
          </div>

          {/* Analysis Content - Mobile Friendly */}
          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            <p className="overflow-hidden">
              <span className="block sm:inline">
                {analysis.content}
              </span>
            </p>
          </div>

          <Link
            href={`/${coin.id}/price-prediction/`}
            className="block w-full bg-crypto-accent hover:bg-crypto-accent/90 text-white text-center py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm font-medium"
          >
            View Price Prediction
          </Link>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <div className="text-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-crypto-accent mx-auto mb-2" />
            <p className="text-gray-400 text-xs sm:text-sm">No AI analysis yet</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${coin.id}/price-prediction/`}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2"
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Generate Now</span>
            </Link>
            <Link
              href={`/${coin.id}/price-prediction/`}
              className="w-full bg-crypto-primary/20 hover:bg-crypto-primary/30 text-crypto-accent py-2 px-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Join Queue</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
