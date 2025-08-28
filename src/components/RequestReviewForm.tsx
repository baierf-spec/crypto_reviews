'use client'

import { useState } from 'react'
import { Coin } from '@/types'
import { Sparkles, Clock, Users, CheckCircle, AlertCircle, Zap, DollarSign, Star, TrendingUp, Shield, Gift, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface RequestReviewFormProps {
  coin: Coin
}

export default function RequestReviewForm({ coin }: RequestReviewFormProps) {
  const [isRequested, setIsRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [requestType, setRequestType] = useState<'fast' | 'queue'>('fast')
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  const handleRequestReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = requestType === 'fast' ? '/api/generate-review-now' : '/api/request-review'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin_id: coin.id,
          coin_name: coin.name,
          coin_symbol: coin.symbol,
          user_email: email,
        }),
      })

      let data: any = null
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (_) {
          // ignore JSON parse errors; treat as generic failure
        }
      }

      if (response.ok) {
        setIsRequested(true)
        if (data && data.analysis_id) {
          setAnalysisId(data.analysis_id)
        }
        // Persist analysis locally as fallback when DB is unavailable (serverless cold starts)
        try {
          if (data && data.analysis) {
            localStorage.setItem(`analysis:${coin.id}`, JSON.stringify(data.analysis))
          }
        } catch (_) {}
        console.log('Review request successful:', data)
      } else {
        setError((data && data.error) || 'Failed to request review. Please try again.')
        console.error('Review request failed:', data)
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
      console.error('Error requesting review:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isRequested) {
    return (
      <div className="bg-crypto-secondary/50 rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Review Requested!</h3>
        <p className="text-gray-400 mb-4">
          {requestType === 'fast' 
            ? `AI analysis for ${coin.name} is being generated now!`
            : `We've added ${coin.name} to our AI analysis queue.`
          }
        </p>
        <div className="bg-crypto-primary/20 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>
              {requestType === 'fast' 
                ? 'Expected within 5-10 minutes'
                : 'Expected within 24-48 hours'
              }
            </span>
          </div>
        </div>
        
        {requestType === 'fast' && (
          <div className="mt-6">
            <button
              onClick={() => {
                // Force a reload to fetch the latest analysis
                window.location.href = `/reviews/${coin.id}`
              }}
              className="inline-flex items-center space-x-2 bg-crypto-accent hover:bg-crypto-accent/90 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Analysis Now</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Your analysis should be available immediately
            </p>
          </div>
        )}
        
        <button
          onClick={() => {
            setIsRequested(false)
            setAnalysisId(null)
          }}
          className="mt-4 text-crypto-accent hover:text-crypto-accent/80 text-sm"
        >
          Request another analysis
        </button>
      </div>
    )
  }

  return (
    <div id="request-plans" className="bg-crypto-secondary/50 rounded-lg p-8">
      <div className="text-center mb-8">
        <Sparkles className="w-16 h-16 text-crypto-accent mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">
          Request AI Analysis for {coin.name}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose your preferred analysis option. Both include comprehensive AI analysis with sentiment data, on-chain metrics, and eco ratings.
        </p>
      </div>

      {/* Analysis Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Fast Generation */}
        <div 
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            requestType === 'fast' 
              ? 'border-crypto-accent bg-crypto-accent/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onClick={() => setRequestType('fast')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Premium Fast Track</h3>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">$2.99</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Speed Benefits */}
            <div className="bg-yellow-500/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">Lightning Fast</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">5-10 minutes generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Priority processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Premium AI model</span>
                </div>
              </div>
            </div>

            {/* Exclusive Benefits */}
            <div className="bg-crypto-accent/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-crypto-accent" />
                <span className="text-white font-semibold">Exclusive Perks</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Guaranteed generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Email notification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Enhanced analysis depth</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Perfect for traders who need immediate insights or investors making time-sensitive decisions.
            </p>
          </div>
        </div>

        {/* Queue Option */}
        <div 
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            requestType === 'queue' 
              ? 'border-crypto-accent bg-crypto-accent/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onClick={() => setRequestType('queue')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Community Queue</h3>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-green-400 font-semibold">FREE</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Community Benefits */}
            <div className="bg-blue-500/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">Community Driven</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">24-48 hours wait time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Popular requests prioritized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-crypto-accent" />
                  <span className="text-white">Same quality analysis</span>
                </div>
              </div>
            </div>

            {/* Cost Benefits */}
            <div className="bg-green-500/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold">Cost Effective</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-white">Completely free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-white">No payment required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-white">Access to all analyses</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Great for patient investors and those who want to contribute to the community.
            </p>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-crypto-accent/20 to-yellow-500/20 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 text-center">
          Why Choose Premium Fast Track?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="bg-crypto-accent/20 rounded-lg p-3 mb-2">
              <TrendingUp className="w-6 h-6 text-crypto-accent mx-auto" />
            </div>
            <p className="text-white font-medium">Time is Money</p>
            <p className="text-gray-400">Get insights before the market moves</p>
          </div>
          <div className="text-center">
            <div className="bg-crypto-accent/20 rounded-lg p-3 mb-2">
              <Shield className="w-6 h-6 text-crypto-accent mx-auto" />
            </div>
            <p className="text-white font-medium">Guaranteed Results</p>
            <p className="text-gray-400">No waiting, no uncertainty</p>
          </div>
          <div className="text-center">
            <div className="bg-crypto-accent/20 rounded-lg p-3 mb-2">
              <Star className="w-6 h-6 text-crypto-accent mx-auto" />
            </div>
            <p className="text-white font-medium">Premium Quality</p>
            <p className="text-gray-400">Enhanced analysis depth</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleRequestReview} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address (Optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-crypto-primary/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crypto-accent focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll notify you when the analysis is ready
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-crypto-accent hover:bg-crypto-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {requestType === 'fast' ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              <span>
                {requestType === 'fast' 
                  ? 'Generate Now ($2.99)'
                  : 'Join Queue (Free)'
                }
              </span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          {requestType === 'fast' 
            ? 'Premium service with immediate generation. Payment processing coming soon.'
            : 'Free community service. Analysis requests are processed in order of popularity.'
          }
        </p>
      </form>

      <div className="mt-8 bg-crypto-primary/10 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-3">What's Included in Each Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-crypto-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Market Sentiment Analysis</p>
              <p className="text-gray-400">Social media sentiment and market psychology</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-crypto-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">On-Chain Data</p>
              <p className="text-gray-400">Network health, transaction volume, and adoption metrics</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-crypto-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Eco-Friendliness Rating</p>
              <p className="text-gray-400">Environmental impact assessment and sustainability metrics</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-crypto-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Price Predictions</p>
              <p className="text-gray-400">AI-generated short and medium-term price forecasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
