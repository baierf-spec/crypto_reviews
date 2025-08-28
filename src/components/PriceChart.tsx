'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const TradingViewChart = dynamic(() => import('./TradingViewChart'), { ssr: false })

interface PriceChartProps {
  coinId: string
  heightClass?: string
}

export default function PriceChart({ coinId, heightClass = 'h-64' }: PriceChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('PriceChart: Starting to load TradingView chart for coinId:', coinId)
  }, [coinId])

  if (!mounted) {
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

  return <TradingViewChart coinId={coinId} heightClass={heightClass} />
}


