'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getTvBaseSymbol } from '@/lib/tvSymbols'

const TradingViewChart = dynamic(() => import('./TradingViewChart'), { ssr: false })

interface PriceChartProps {
  coinId: string
  heightClass?: string
}

export default function PriceChart({ coinId, heightClass = 'h-64' }: PriceChartProps) {
  const [mounted, setMounted] = useState(false)
  const [symbol, setSymbol] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    console.log('PriceChart: Starting to load TradingView chart for coinId:', coinId)
    
    async function resolveSymbol() {
      setLoading(true)
      setError(null)
      
      try {
        // First try immediate symbol resolution
        let resolvedSymbol = getTvBaseSymbol(coinId)
        
        if (!resolvedSymbol) {
          // Try to get coin data to extract symbol
          const response = await fetch(`/api/coins/${coinId}`)
          if (response.ok) {
            const coinData = await response.json()
            const coinSymbol = coinData?.data?.symbol || coinData?.symbol
            if (coinSymbol) {
              resolvedSymbol = getTvBaseSymbol(coinId, coinSymbol)
            }
          }
        }
        
        if (!resolvedSymbol) {
          // Try TradingView symbol resolution API
          const tvResponse = await fetch(`/api/tv/resolve?coinId=${encodeURIComponent(coinId)}`)
          if (tvResponse.ok) {
            const tvData = await tvResponse.json()
            if (tvData.ok && tvData.symbol) {
              resolvedSymbol = tvData.symbol
            }
          }
        }
        
        // If still no symbol, try some common fallbacks
        if (!resolvedSymbol) {
          // Try common variations of the coinId
          const variations = [
            coinId.replace('-', ''),
            coinId.replace('-', '_'),
            coinId.split('-')[0], // Take first part if hyphenated
            coinId.toUpperCase()
          ]
          
          for (const variation of variations) {
            const testSymbol = getTvBaseSymbol(variation)
            if (testSymbol) {
              resolvedSymbol = testSymbol
              console.log(`PriceChart: Found symbol via variation: ${variation} -> ${resolvedSymbol}`)
              break
            }
          }
        }
        
        if (resolvedSymbol) {
          // Ensure the symbol is in the correct format for TradingView
          // If it's just a base symbol (like "ETH"), convert to "ETHUSDT"
          if (!resolvedSymbol.includes(':') && !resolvedSymbol.includes('USDT')) {
            resolvedSymbol = `${resolvedSymbol}USDT`
          }
          
          console.log('PriceChart: Resolved symbol:', resolvedSymbol)
          setSymbol(resolvedSymbol)
        } else {
          console.error('PriceChart: Could not resolve symbol for coinId:', coinId)
          setError(`Chart not available for ${coinId}`)
        }
      } catch (err) {
        console.error('PriceChart: Error resolving symbol:', err)
        setError('Failed to load chart')
      } finally {
        setLoading(false)
      }
    }
    
    resolveSymbol()
  }, [coinId])

  if (!mounted || loading) {
    return (
      <div className={heightClass}>
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent mx-auto mb-2"></div>
            <p className="text-sm">Loading TradingView chart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !symbol) {
    return (
      <div className={heightClass}>
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-sm">{error || 'Chart not available'}</p>
            <p className="text-xs mt-2">TradingView data not available for this coin</p>
          </div>
        </div>
      </div>
    )
  }

  // Convert heightClass to numeric height for TradingViewChart
  const height = heightClass === 'h-64' ? 256 : 
                 heightClass === 'h-96' ? 384 : 
                 heightClass === 'h-[300px]' ? 300 : 300

  return <TradingViewChart symbol={symbol} height={height} />
}


