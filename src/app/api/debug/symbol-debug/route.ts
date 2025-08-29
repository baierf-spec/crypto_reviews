import { NextResponse, NextRequest } from 'next/server'
import { getTvBaseSymbol, findExchangeBaseViaCG } from '@/lib/tvSymbols'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId') || 'ethereum'
    
    console.log('Symbol debug: Testing coinId:', coinId)
    
    // Test all resolution methods
    const results = {
      coinId,
      directMapping: {
        result: getTvBaseSymbol(coinId),
        method: 'Direct mapping from COIN_ID_TO_BASE'
      },
      variations: {
        noHyphen: getTvBaseSymbol(coinId.replace('-', '')),
        noHyphenUnderscore: getTvBaseSymbol(coinId.replace('-', '_')),
        firstPart: getTvBaseSymbol(coinId.split('-')[0]),
        uppercase: getTvBaseSymbol(coinId.toUpperCase()),
        lowercase: getTvBaseSymbol(coinId.toLowerCase())
      },
      coinGeckoResolution: null as any,
      finalSymbol: null as string | null,
      tradingViewSymbol: null as string | null
    }
    
    // Test CoinGecko resolution
    try {
      const cgResult = await findExchangeBaseViaCG(coinId)
      results.coinGeckoResolution = cgResult
      if (cgResult) {
        results.finalSymbol = `BINANCE:${cgResult}USDT`
      }
    } catch (e) {
      results.coinGeckoResolution = { error: e instanceof Error ? e.message : 'Unknown error' }
    }
    
    // Determine final symbol
    if (!results.finalSymbol) {
      const directSymbol = results.directMapping.result
      if (directSymbol) {
        results.finalSymbol = `BINANCE:${directSymbol}USDT`
      } else {
        // Try variations
        for (const [key, value] of Object.entries(results.variations)) {
          if (value) {
            results.finalSymbol = `BINANCE:${value}USDT`
            console.log(`Symbol debug: Found via variation ${key}: ${value}`)
            break
          }
        }
      }
    }
    
    // Test TradingView symbol format
    if (results.finalSymbol) {
      results.tradingViewSymbol = results.finalSymbol
    }
    
    return NextResponse.json({
      success: true,
      message: 'Symbol resolution debug completed',
      results,
      recommendations: {
        useSymbol: results.finalSymbol,
        isValid: !!results.finalSymbol,
        fallback: results.finalSymbol ? null : 'BTCUSDT' // Fallback to Bitcoin if all else fails
      }
    })
    
  } catch (error) {
    console.error('Symbol debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
