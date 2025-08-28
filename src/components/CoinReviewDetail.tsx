'use client'

import { useState } from 'react'
import { Coin, Analysis } from '@/types'
import RatingStars from './RatingStars'
import EcoGauge from './EcoGauge'
import { TrendingUp, TrendingDown, BarChart3, MessageCircle, Target, AlertTriangle } from 'lucide-react'

interface CoinReviewDetailProps {
  coin: Coin
  analysis?: Analysis | null
}

export default function CoinReviewDetail({ coin, analysis }: CoinReviewDetailProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAnalysis, setGeneratedAnalysis] = useState<any>(null)

  const generateNewAnalysis = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          currentPrice: coin.current_price
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setGeneratedAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const displayAnalysis = generatedAnalysis || analysis

  if (!displayAnalysis) {
    return (
      <div className="bg-crypto-secondary/50 rounded-xl p-6 border border-white/5">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
          <p className="text-gray-400 mb-6">No analysis available for this cryptocurrency.</p>
          <button
            onClick={generateNewAnalysis}
            disabled={isGenerating}
            className="bg-crypto-accent hover:bg-crypto-accent/90 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Analysis'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-crypto-secondary/50 rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">AI Analysis</h3>
        <button
          onClick={generateNewAnalysis}
          disabled={isGenerating}
          className="bg-crypto-accent hover:bg-crypto-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      {/* Summary */}
      {displayAnalysis.content?.summary && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-3">Executive Summary</h4>
          <p className="text-gray-300 leading-relaxed">{displayAnalysis.content.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technical Analysis */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-crypto-accent" />
            <h4 className="text-lg font-semibold text-white">Technical Analysis</h4>
          </div>
          
          {displayAnalysis.technicalAnalysis ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-crypto-primary/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">RSI</p>
                  <p className="text-white font-semibold">{displayAnalysis.technicalAnalysis.rsi}</p>
                </div>
                <div className="bg-crypto-primary/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">MACD</p>
                  <p className="text-white font-semibold">{displayAnalysis.technicalAnalysis.macd}</p>
                </div>
              </div>
              
              <div className="bg-crypto-primary/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Trend</p>
                <div className="flex items-center gap-2">
                  {displayAnalysis.technicalAnalysis.trend === 'bullish' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`font-semibold capitalize ${
                    displayAnalysis.technicalAnalysis.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {displayAnalysis.technicalAnalysis.trend}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-crypto-primary/10 rounded-lg p-4">
              <p className="text-gray-400">Technical analysis data not available</p>
            </div>
          )}
        </div>

        {/* Sentiment Analysis */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-crypto-accent" />
            <h4 className="text-lg font-semibold text-white">Sentiment Analysis</h4>
          </div>
          
          {displayAnalysis.sentimentAnalysis ? (
            <div className="space-y-4">
              <div className="bg-crypto-primary/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Overall Sentiment</p>
                <div className="flex items-center gap-2">
                  <RatingStars rating={displayAnalysis.sentimentAnalysis.overall / 20} size="sm" />
                  <span className="text-white font-semibold">{displayAnalysis.sentimentAnalysis.overall}/100</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-400 text-sm">Positive</span>
                  <span className="text-white">{displayAnalysis.sentimentAnalysis.breakdown.positive}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Neutral</span>
                  <span className="text-white">{displayAnalysis.sentimentAnalysis.breakdown.neutral}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400 text-sm">Negative</span>
                  <span className="text-white">{displayAnalysis.sentimentAnalysis.breakdown.negative}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-crypto-primary/10 rounded-lg p-4">
              <p className="text-gray-400">Sentiment analysis data not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Predictions */}
      {displayAnalysis.pricePrediction && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-crypto-accent" />
            <h4 className="text-lg font-semibold text-white">Price Predictions</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(displayAnalysis.pricePrediction.scenarios).map(([scenario, data]: [string, any]) => (
              <div key={scenario} className={`rounded-lg p-4 ${
                scenario === 'bullish' ? 'bg-green-500/10 border border-green-500/20' :
                scenario === 'bearish' ? 'bg-red-500/10 border border-red-500/20' :
                'bg-blue-500/10 border border-blue-500/20'
              }`}>
                <h5 className={`font-semibold capitalize mb-2 ${
                  scenario === 'bullish' ? 'text-green-400' :
                  scenario === 'bearish' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {scenario} Scenario
                </h5>
                <p className="text-white font-bold text-lg">{data.change}</p>
                <p className="text-gray-400 text-sm">{data.probability}% probability</p>
                <p className="text-gray-400 text-sm">{data.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      {displayAnalysis.content?.detailedAnalysis && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h4>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{displayAnalysis.content.detailedAnalysis}</p>
          </div>
        </div>
      )}

      {/* Recommendation */}
      {displayAnalysis.content?.recommendation && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-semibold text-white">Investment Recommendation</h4>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-300">{displayAnalysis.content.recommendation}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <h4 className="text-red-400 font-semibold mb-2">Disclaimer</h4>
        <p className="text-red-300 text-sm">
          This analysis is generated by AI and is for educational purposes only. It does not constitute financial advice. 
          Cryptocurrency investments are highly risky and volatile. Always conduct your own research and consult with 
          financial advisors before making investment decisions.
        </p>
      </div>
    </div>
  )
}
