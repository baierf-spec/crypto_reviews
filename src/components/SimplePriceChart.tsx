'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SimplePriceChartProps {
  coinId: string
  heightClass?: string
}

interface PriceData {
  time: string
  price: number
}

export default function SimplePriceChart({ coinId, heightClass = 'h-64' }: SimplePriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('SimplePriceChart: Loading chart for coinId:', coinId)
    setLoading(true)
    setError(null)

    async function loadPriceData() {
      try {
        // Try to get price history from our API
        const response = await fetch(`/api/coins/${coinId}/history?days=7`)
        console.log('SimplePriceChart: API response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('SimplePriceChart: Received data points:', data?.prices?.length || 0)
          
          if (data?.prices && Array.isArray(data.prices) && data.prices.length > 0) {
            // Transform the data for Recharts
            const transformedData = data.prices.map(([timestamp, price]: [number, number]) => ({
              time: new Date(timestamp).toLocaleDateString(),
              price: price
            }))
            
            console.log('SimplePriceChart: Transformed data points:', transformedData.length)
            setPriceData(transformedData)
          } else {
            console.log('SimplePriceChart: No price data available')
            setError('No price data available')
          }
        } else {
          console.error('SimplePriceChart: API error:', response.status, response.statusText)
          setError('Failed to load price data')
        }
      } catch (err) {
        console.error('SimplePriceChart: Error loading data:', err)
        setError('Failed to load chart data')
      } finally {
        setLoading(false)
      }
    }

    loadPriceData()
  }, [coinId])

  if (loading) {
    return (
      <div className={heightClass}>
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent mx-auto mb-2"></div>
            <p className="text-sm">Loading chart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={heightClass}>
        <div className="h-full flex items-center justify-center text-red-400">
          <div className="text-center">
            <p className="text-sm">Chart Error</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (priceData.length === 0) {
    return (
      <div className={heightClass}>
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-sm">No price data available</p>
            <p className="text-xs text-gray-500">Try refreshing the page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#22d3ee" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22d3ee' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
