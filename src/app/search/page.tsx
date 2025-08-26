'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatPercentage } from '@/lib/utils'
import { Coin } from '@/types'

export default function SearchPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch('/api/coins?limit=2000')
        const json = await res.json()
        const data: Coin[] = json.data || []
        setCoins(data)
        setFilteredCoins(data.slice(0, 50))
      } catch (error) {
        console.error('Error fetching coins:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoins()
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        setFilteredCoins(coins.slice(0, 50))
        return
      }

      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=50`)
        const json = await res.json()
        const results: Coin[] = json.data || []
        setFilteredCoins(results)
      } catch (error) {
        console.error('Search error:', error)
        const filtered = coins.filter(coin =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredCoins(filtered.slice(0, 50))
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchTerm, coins])

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Search Cryptocurrencies</h1>
            <p className="text-gray-400 text-lg">Loading coins...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-crypto-secondary/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Search Cryptocurrencies</h1>
          <p className="text-gray-400 text-lg mb-8">
            Find and analyze any cryptocurrency with our AI-powered insights
          </p>
          
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-crypto-secondary/50 border border-crypto-primary/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-crypto-primary/40 transition-colors"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-crypto-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Search Stats */}
          <div className="mt-4 text-sm text-gray-400">
            {searchTerm ? (
              <p>Found {filteredCoins.length} results for "{searchTerm}"</p>
            ) : (
              <p>Showing top 50 cryptocurrencies by market cap</p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoins.map((coin) => {
            const priceChange = coin.price_change_percentage_24h
            const isPositive = priceChange >= 0

            return (
              <div
                key={coin.id}
                className="bg-crypto-secondary/50 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-4 hover:border-crypto-primary/40 transition-all duration-200 cursor-pointer"
                onClick={() => window.location.href = `/reviews/${coin.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/32x32/666666/FFFFFF?text=?'
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-white hover:text-crypto-primary transition-colors">
                        {coin.name}
                      </h3>
                      <p className="text-gray-400 text-sm uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {formatPrice(coin.current_price)}
                    </p>
                    <div className={`flex items-center text-sm ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {formatPercentage(priceChange)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-white font-medium">
                      {coin.market_cap >= 1e12
                        ? `$${(coin.market_cap / 1e12).toFixed(2)}T`
                        : coin.market_cap >= 1e9
                        ? `$${(coin.market_cap / 1e9).toFixed(2)}B`
                        : `$${(coin.market_cap / 1e6).toFixed(2)}M`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="text-white font-medium">
                      {coin.total_volume >= 1e12
                        ? `$${(coin.total_volume / 1e12).toFixed(2)}T`
                        : coin.total_volume >= 1e9
                        ? `$${(coin.total_volume / 1e9).toFixed(2)}B`
                        : `$${(coin.total_volume / 1e6).toFixed(2)}M`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCoins.length === 0 && searchTerm && !searching && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No cryptocurrencies found matching "{searchTerm}"</p>
            <p className="text-gray-500 text-sm mt-2">Try searching with a different term or check the spelling</p>
          </div>
        )}
      </div>
    </div>
  )
}
