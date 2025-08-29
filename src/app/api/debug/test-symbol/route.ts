import { NextResponse, NextRequest } from 'next/server'
import { getTvBaseSymbol } from '@/lib/tvSymbols'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId') || 'ethereum'
    
    console.log('Testing symbol resolution for coinId:', coinId)
    
    // Test different symbol resolution methods
    const results = {
      coinId,
      symbolResolution: {
        directMapping: getTvBaseSymbol(coinId),
        withUSDT: getTvBaseSymbol(coinId) ? `${getTvBaseSymbol(coinId)}USDT` : null,
        fullSymbol: getTvBaseSymbol(coinId) ? `BINANCE:${getTvBaseSymbol(coinId)}USDT` : null,
      },
      testSymbols: [
        'ETH',
        'ETHUSDT', 
        'BINANCE:ETH',
        'BINANCE:ETHUSDT',
        'BTC',
        'BTCUSDT',
        'BINANCE:BTCUSDT'
      ]
    }
    
    return NextResponse.json({
      success: true,
      message: 'Symbol resolution test completed',
      results
    })
    
  } catch (error) {
    console.error('Test symbol error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
