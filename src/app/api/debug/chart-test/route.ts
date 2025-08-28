import { NextResponse, NextRequest } from 'next/server'
import { getTvBaseSymbol } from '@/lib/tvSymbols'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get('coinId')
  
  if (!coinId) {
    return NextResponse.json({ error: 'Missing coinId parameter' }, { status: 400 })
  }
  
  try {
    // Test symbol resolution
    const immediateSymbol = getTvBaseSymbol(coinId)
    
    // Test coin data fetch
    let coinData = null
    try {
      const coinRes = await fetch(`/api/coins/${coinId}`)
      if (coinRes.ok) {
        coinData = await coinRes.json()
      }
    } catch (e) {
      console.error('Failed to fetch coin data:', e)
    }
    
    // Test history fetch
    let historyData = null
    try {
      const histRes = await fetch(`/api/coins/${coinId}/history?days=7`)
      if (histRes.ok) {
        historyData = await histRes.json()
      }
    } catch (e) {
      console.error('Failed to fetch history:', e)
    }
    
    const result = {
      coinId,
      symbolResolution: {
        immediateSymbol,
        hasMapping: !!immediateSymbol,
        coinDataSymbol: coinData?.data?.symbol || coinData?.symbol,
        finalSymbol: immediateSymbol || (coinData?.data?.symbol || coinData?.symbol)?.toUpperCase()
      },
      dataAvailability: {
        hasCoinData: !!coinData,
        hasHistoryData: !!historyData,
        historyPoints: historyData?.prices?.length || 0
      },
      coinData: coinData ? {
        id: coinData.data?.id || coinData.id,
        name: coinData.data?.name || coinData.name,
        symbol: coinData.data?.symbol || coinData.symbol
      } : null
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      coinId
    }, { status: 500 })
  }
}
