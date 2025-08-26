import { Suspense } from 'react'
import { getCoinData } from '@/lib/apis'
import { getAnalysisByCoinId } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CoinReviewDetail from '@/components/CoinReviewDetail'
import RequestReviewForm from '@/components/RequestReviewForm'

interface PageProps {
  params: {
    coin_id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const coin = await getCoinData(params.coin_id)
    if (!coin) {
      return {
        title: 'Coin Not Found - Crypto AI Insights',
        description: 'The requested cryptocurrency could not be found.',
      }
    }

    return {
      title: `${coin.name} (${coin.symbol.toUpperCase()}) Review - Crypto AI Insights`,
      description: `AI-powered analysis of ${coin.name} with sentiment analysis, on-chain data, and eco ratings.`,
      openGraph: {
        title: `${coin.name} (${coin.symbol.toUpperCase()}) Review`,
        description: `AI-powered analysis of ${coin.name} with sentiment analysis, on-chain data, and eco ratings.`,
        images: [coin.image],
      },
    }
  } catch (error) {
    return {
      title: 'Coin Review - Crypto AI Insights',
      description: 'AI-powered cryptocurrency analysis and predictions.',
    }
  }
}

export default async function CoinReviewPage({ params }: PageProps) {
  try {
    const coin = await getCoinData(params.coin_id)
    if (!coin) {
      notFound()
    }

    const analysis = await getAnalysisByCoinId(params.coin_id)

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<ReviewDetailSkeleton />}>
            <CoinReviewDetail coin={coin} analysis={analysis} />
          </Suspense>
          
          {!analysis && (
            <div className="mt-12">
              <RequestReviewForm coin={coin} />
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading coin review:', error)
    notFound()
  }
}

function ReviewDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="text-center mb-8">
        <div className="h-12 bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-600 rounded w-1/2 mx-auto"></div>
      </div>
      <div className="bg-crypto-secondary/50 rounded-lg p-6 mb-8">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
      </div>
    </div>
  )
}
