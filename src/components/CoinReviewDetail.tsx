'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice, formatMarketCap, formatPercentage, getSentimentColor, getEcoColor, calculateOverallRating } from '@/lib/utils'
import { Coin, Analysis } from '@/types'
import RatingStars from './RatingStars'
import EcoGauge from './EcoGauge'
import LastReviewedInfo from './LastReviewedInfo'
import AnalysisMarkdown from './AnalysisMarkdown'
import dynamic from 'next/dynamic'

const PriceChart = dynamic(() => import('./PriceChart'), { ssr: false })
import { TrendingUp, TrendingDown, ThumbsUp, ThumbsDown, MessageCircle, Share2, BarChart3, Info, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react'

interface CoinReviewDetailProps {
  coin: Coin
  analysis?: Analysis
}

export default function CoinReviewDetail({ coin, analysis }: CoinReviewDetailProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [voteCount, setVoteCount] = useState({ up: 42, down: 8 })
  const [showMetricHelp, setShowMetricHelp] = useState(false)

  // Normalize ratings to 0..5 stars for sub-metrics to ensure stable rendering
  const sentimentStars = analysis
    ? Math.max(0, Math.min(5, (analysis.ratings.sentiment + 100) / 200 * 5))
    : 0
  const onChainStars = analysis
    ? Math.max(0, Math.min(5, (analysis.ratings.onChain || 0) / 20))
    : 0
  const ecoStars = analysis
    ? Math.max(0, Math.min(5, (analysis.ratings.eco || 0) / 2))
    : 0

  const handleVote = async (vote: 'up' | 'down') => {
    if (userVote === vote) {
      // Remove vote
      setUserVote(null)
      setVoteCount(prev => ({
        ...prev,
        [vote]: prev[vote] - 1
      }))
    } else {
      // Add/change vote
      const oldVote = userVote
      setUserVote(vote)
      setVoteCount(prev => ({
        ...prev,
        [vote]: prev[vote] + 1,
        ...(oldVote && { [oldVote]: prev[oldVote] - 1 })
      }))
    }

    // TODO: Send vote to API
    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coin_id: coin.id,
          vote: userVote === vote ? null : vote
        })
      })
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Coin Header */}
      <div className="rounded-lg p-6 bg-gradient-to-r from-crypto-secondary/60 to-crypto-secondary/30 border border-white/5">
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={coin.image}
            alt={coin.name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
            <p className="text-gray-400 text-lg">{coin.symbol.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatPrice(coin.current_price)}</p>
            <div className="flex items-center justify-end">
              {coin.price_change_percentage_24h >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-400 mr-1" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-400 mr-1" />
              )}
              <p className={`text-lg ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
          <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white font-semibold">{formatMarketCap(coin.market_cap)}</p>
          </div>
          <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
            <p className="text-gray-400">Volume (24h)</p>
            <p className="text-white font-semibold">{formatMarketCap(coin.total_volume)}</p>
          </div>
          <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
            <p className="text-gray-400">High (24h)</p>
            <p className="text-white font-semibold">{formatPrice(coin.high_24h)}</p>
          </div>
          <div className="bg-black/20 rounded-md px-4 py-3 border border-white/5">
            <p className="text-gray-400">Low (24h)</p>
            <p className="text-white font-semibold">{formatPrice(coin.low_24h)}</p>
          </div>
        </div>
      </div>

      {/* Last Reviewed Info */}
      <LastReviewedInfo
        coinId={coin.id}
        coinName={coin.name}
        lastReviewed={analysis?.date}
        hasAnalysis={!!analysis}
      />

      {/* Main content + sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="md:col-span-2 space-y-6">
          {/* Price Chart */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">7-Day Price</h3>
            <PriceChart coinId={coin.id} />
          </div>

          {/* AI Analysis */}
          {analysis ? (
            <div className="space-y-6">
          {/* Analysis Header */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-crypto-accent" />
                <h2 className="text-2xl font-bold text-white">AI Analysis</h2>
              </div>
              <div className="flex items-center space-x-2">
                <RatingStars rating={calculateOverallRating(analysis.ratings)} size="lg" showValue />
                <button
                  className="ml-3 inline-flex items-center text-xs text-gray-300 hover:text-white transition-colors"
                  onClick={() => setShowMetricHelp(v => !v)}
                  aria-expanded={showMetricHelp}
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  About these metrics
                </button>
              </div>
            </div>

            {showMetricHelp && (
              <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-gray-300 mb-4">
                <p className="mb-2"><span className="font-semibold text-white">Sentiment (−100..100):</span> derived from social signals (Twitter/Reddit). We map the overall score to stars by rescaling to 0–5. Bearish values are <span className="text-crypto-danger">red</span>, neutral near 0 are <span className="text-crypto-warning">amber</span>, bullish high positives are <span className="text-crypto-success">green</span>.</p>
                <p className="mb-2"><span className="font-semibold text-white">On‑Chain (0..100):</span> heuristic score from network growth, activity and flow. It is normalized to a 0–5 star band by dividing by 20.</p>
                <p className="mb-0"><span className="font-semibold text-white">Eco (1..10):</span> environmental impact rating. We rescale to stars by dividing by 2; values ≥8 are considered <span className="text-crypto-success">excellent</span>.</p>
              </div>
            )}

            {/* Key Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/20 rounded-lg p-4 text-center border border-white/5">
                <p className="text-gray-400 mb-2">Sentiment</p>
                <RatingStars rating={sentimentStars} size="lg" showValue />
                <p className={`text-sm mt-1 ${getSentimentColor(analysis.ratings.sentiment)}`}>
                  {analysis.ratings.sentiment >= 4 ? 'Bullish' : analysis.ratings.sentiment >= 2 ? 'Neutral' : 'Bearish'}
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center border border-white/5">
                <p className="text-gray-400 mb-2">On-Chain</p>
                <RatingStars rating={onChainStars} size="lg" showValue />
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center flex flex-col items-center border border-white/5">
                <p className="text-gray-400 mb-2">Eco</p>
                <EcoGauge rating={analysis.ratings.eco} size="lg" />
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Info className="w-4 h-4 text-crypto-accent" />
              <span>AI-generated content for educational purposes only. Not financial advice.</span>
            </div>
            <AnalysisMarkdown content={analysis.content} />
          </div>

          {/* Price Predictions */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Price Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['short_term','medium_term','long_term'] as const).map((key, idx) => {
                const label = idx === 0 ? 'Short Term (1 Week)' : idx === 1 ? 'Medium Term (1 Month)' : 'Long Term (3 Months)'
                const p: any = (analysis.price_prediction as any)[key]
                return (
                  <div key={key} className="bg-crypto-primary/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">{label}</h4>
                    {p && typeof p === 'object' ? (
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>
                          Target: <span className="text-white font-semibold">{formatPrice(p.target)}</span>
                        </div>
                        <div>
                          Range: <span className="text-white font-semibold">{formatPrice(p.low)}</span> - <span className="text-white font-semibold">{formatPrice(p.high)}</span>
                        </div>
                        <div>
                          Change: <span className={p.pct >= 0 ? 'text-green-400' : 'text-red-400'}>{p.pct.toFixed(2)}%</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300">Prediction unavailable</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* On-Chain Data */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">On-Chain Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{analysis.on_chain_data.transactions_24h.toLocaleString()}</p>
                <p className="text-gray-400">24h Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{analysis.on_chain_data.whale_activity}</p>
                <p className="text-gray-400">Whale Activity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{analysis.on_chain_data.network_growth}%</p>
                <p className="text-gray-400">Network Growth</p>
              </div>
            </div>
          </div>

          {/* Social Sentiment */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Social Sentiment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-white"
                  title="Twitter sentiment score on a −100 to 100 scale. Positive = bullish, negative = bearish."
                >
                  {analysis.social_sentiment.twitter_score}
                </p>
                <p className="text-gray-400">Twitter Score</p>
                <p className="text-xs text-gray-500 mt-1">−100…100 scale; &gt;30 bullish, &lt;−30 bearish</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-white"
                  title="Reddit sentiment score on a −100 to 100 scale. Positive = bullish, negative = bearish."
                >
                  {analysis.social_sentiment.reddit_score}
                </p>
                <p className="text-gray-400">Reddit Score</p>
                <p className="text-xs text-gray-500 mt-1">−100…100 scale; &gt;30 bullish, &lt;−30 bearish</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-white"
                  title="Combined sentiment across sources on a −100 to 100 scale."
                >
                  {analysis.social_sentiment.overall_score}
                </p>
                <p className="text-gray-400">Overall Sentiment</p>
                <p className="text-xs text-gray-500 mt-1">Blend of sources; &gt;30 bullish, &lt;−30 bearish</p>
              </div>
            </div>
          </div>

          {/* User Interaction */}
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote('up')}
                    className={`p-2 rounded-lg transition-colors ${
                      userVote === 'up' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-600/50 text-gray-400 hover:bg-gray-600/70'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className="text-white font-semibold">{voteCount.up}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote('down')}
                    className={`p-2 rounded-lg transition-colors ${
                      userVote === 'down' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-gray-600/50 text-gray-400 hover:bg-gray-600/70'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                  <span className="text-white font-semibold">{voteCount.down}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-gray-600/50 text-gray-400 hover:bg-gray-600/70 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-600/50 text-gray-400 hover:bg-gray-600/70 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
            </div>
          ) : (
            <div className="bg-crypto-secondary/50 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No AI Analysis Available</h3>
                <p className="text-gray-400">
                  We haven't generated an AI analysis for {coin.name} yet. 
                  Use the "Request New Review" button above to get started.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rank</span>
                <span className="text-white font-medium">#{coin.market_cap_rank || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="text-white font-medium">{coin.circulating_supply?.toLocaleString?.() || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="text-white font-medium">{coin.total_supply?.toLocaleString?.() || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Max Supply</span>
                <span className="text-white font-medium">{coin.max_supply?.toLocaleString?.() || '—'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
