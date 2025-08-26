import { Suspense } from 'react'
import { TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import LatestReviews from '@/components/LatestReviews'
import FeaturesSection from '@/components/FeaturesSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Latest Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest AI-Powered Reviews
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get daily insights on top cryptocurrencies with our advanced AI analysis
            </p>
          </div>
          
          <Suspense fallback={<ReviewsSkeleton />}>
            <LatestReviews />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-crypto-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Ahead with AI Insights
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of crypto enthusiasts who trust our AI-powered analysis for their investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-crypto-primary to-crypto-accent text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-crypto-primary/25 transition-all duration-200">
              Explore All Reviews
            </button>
            <button className="border border-crypto-primary/50 text-crypto-primary px-8 py-3 rounded-lg font-semibold hover:bg-crypto-primary/10 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReviewsSkeleton() {
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
