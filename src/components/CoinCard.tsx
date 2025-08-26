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

  return (
    <div className="bg-crypto-secondary/50 rounded-lg p-6 hover:bg-crypto-secondary/70 transition-colors">
      {/* Coin Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Image
          src={coin.image}
          alt={coin.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{coin.name}</h3>
          <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">${formatPrice(coin.current_price)}</p>
          <div className="flex items-center">
            {coin.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(coin.price_change_percentage_24h)}
            </p>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">${formatMarketCap(coin.market_cap)}</p>
        </div>
        <div>
          <p className="text-gray-400">Volume</p>
          <p className="text-white font-semibold">${formatMarketCap(coin.total_volume)}</p>
        </div>
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
              <RatingStars rating={analysis.ratings.sentiment} size="sm" />
              <p className="text-gray-400 mt-1">Sentiment</p>
              <p className={`text-xs ${getSentimentColor(analysis.ratings.sentiment)}`}>
                {analysis.ratings.sentiment >= 4 ? 'Bullish' : analysis.ratings.sentiment >= 2 ? 'Neutral' : 'Bearish'}
              </p>
            </div>
            <div className="text-center">
              <RatingStars rating={analysis.ratings.onChain} size="sm" />
              <p className="text-gray-400 mt-1">On-Chain</p>
            </div>
            <div className="text-center">
              <EcoGauge rating={analysis.ratings.eco} />
              <p className="text-gray-400 mt-1">Eco</p>
              <p className={`text-xs ${getEcoColor(analysis.ratings.eco)}`}>
                {analysis.ratings.eco >= 4 ? 'Green' : analysis.ratings.eco >= 2 ? 'Moderate' : 'High Impact'}
              </p>
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-3">
            {analysis.content.substring(0, 150)}...
          </p>

          <Link
            href={`/reviews/${coin.id}`}
            className="block w-full bg-crypto-accent hover:bg-crypto-accent/90 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            Read Full Analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-crypto-accent mx-auto mb-2" />
            <p className="text-gray-400 text-sm mb-3">
              No AI analysis available yet
            </p>
          </div>
          
          {/* Analysis Options */}
          <div className="space-y-2">
            <Link
              href={`/reviews/${coin.id}`}
              className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Now ($2.99)</span>
            </Link>
            
            <Link
              href={`/reviews/${coin.id}`}
              className="block w-full bg-crypto-primary/20 hover:bg-crypto-primary/30 text-crypto-accent py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Join Queue (Free)</span>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Choose your preferred option
          </p>
        </div>
      )}
    </div>
  )
}
