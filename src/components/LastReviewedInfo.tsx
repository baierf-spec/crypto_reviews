'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import { getTimeAgo } from '@/lib/utils'
import Link from 'next/link'

interface LastReviewedInfoProps {
  coinId: string
  coinName: string
  lastReviewed?: string
  hasAnalysis: boolean
}

export default function LastReviewedInfo({ coinId, coinName, lastReviewed, hasAnalysis }: LastReviewedInfoProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const plansRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const handleRequestNewReview = async () => {
    setIsRequesting(true)
    try {
      // Smooth scroll to the request plans section on the same page
      const el = document.getElementById('request-plans')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Fallback: use Next.js router navigation
        router.push(`/reviews/${coinId}#request-plans`)
      }
    } catch (error) {
      console.error('Error requesting new review:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="bg-crypto-secondary/30 rounded-lg p-4 border border-crypto-accent/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-crypto-accent/20 rounded-lg p-2">
            <Clock className="w-5 h-5 text-crypto-accent" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Reviewed</p>
            <p className="text-white font-semibold">
              {lastReviewed ? getTimeAgo(lastReviewed) : 'Never reviewed'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasAnalysis ? (
            <div className="flex items-center space-x-2">
              <div className="bg-green-500/20 rounded-lg p-2">
                <Sparkles className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">Analysis Available</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="bg-yellow-500/20 rounded-lg p-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-yellow-400 text-sm font-medium">No Analysis</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {hasAnalysis ? (
              <p>Analysis was generated {lastReviewed ? getTimeAgo(lastReviewed) : 'recently'}</p>
            ) : (
              <p>No AI analysis available for {coinName} yet</p>
            )}
          </div>
          
          <button
            onClick={handleRequestNewReview}
            disabled={isRequesting}
            className="bg-crypto-accent hover:bg-crypto-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isRequesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Request New Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {hasAnalysis && (
        <div className="mt-3 p-3 bg-crypto-primary/10 rounded-lg">
          <p className="text-xs text-gray-400">
            💡 <strong>Tip:</strong> Request a new review to get the latest AI analysis with current market data, 
            sentiment analysis, and updated price predictions.
          </p>
        </div>
      )}
    </div>
  )
}
