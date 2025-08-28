import { NextRequest, NextResponse } from 'next/server'
import { getTvBaseSymbol } from '@/lib/tvSymbols'

// Exchanges to try in order of preference
const EXCHANGES = [
  'BINANCE',
  'MEXC',
  'BYBIT',
  'KUCOIN',
  'BITGET',
  'GATEIO',
  'OKX',
  'COINBASE',
  'KRAKEN',
]

const QUOTES = ['USDT', 'USDC', 'USD']

type TvSearchItem = {
  symbol: string
  exchange: string
  type: string
  description?: string
}

async function searchTradingView(text: string, exchange?: string): Promise<TvSearchItem[]> {
  const url = new URL('https://symbol-search.tradingview.com/symbol_search/')
  url.searchParams.set('text', text)
  url.searchParams.set('type', 'crypto')
  if (exchange) url.searchParams.set('exchange', exchange)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) return []
  try {
    const json = await res.json()
    return Array.isArray(json) ? (json as TvSearchItem[]) : []
  } catch {
    return []
  }
}

function sanitizeBaseSymbol(sym?: string | null): string | null {
  if (!sym) return null
  const up = sym.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (up.length < 2 || up.length > 12) return null
  return up
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const coinId = searchParams.get('coinId') || ''
    const rawSymbol = searchParams.get('symbol') || ''
    const preferredExchange = searchParams.get('exchange') || undefined

    const fromMap = getTvBaseSymbol(coinId, rawSymbol || undefined)
    const base = sanitizeBaseSymbol(fromMap || rawSymbol)
    if (!base) {
      return NextResponse.json({ ok: false, reason: 'invalid_base' }, { status: 400 })
    }

    const exchanges = preferredExchange
      ? [preferredExchange.toUpperCase(), ...EXCHANGES.filter(e => e !== preferredExchange.toUpperCase())]
      : EXCHANGES

    // Try exact symbol match per exchange and quote
    for (const ex of exchanges) {
      for (const q of QUOTES) {
        const pair = `${base}${q}`
        const list = await searchTradingView(pair, ex)
        const exact = list.find(item => item.symbol.toUpperCase() === pair && item.exchange.toUpperCase() === ex)
        if (exact) {
          return NextResponse.json({ ok: true, symbol: `${ex}:${exact.symbol}` })
        }
        // Some exchanges use separators like "-" or ":"; try loose contains
        const loose = list.find(item => item.symbol.toUpperCase().includes(base) && item.exchange.toUpperCase() === ex)
        if (loose) {
          return NextResponse.json({ ok: true, symbol: `${ex}:${loose.symbol}` })
        }
      }
    }

    // Fallback: global search without exchange and pick first crypto result that includes base
    for (const q of QUOTES) {
      const pair = `${base}${q}`
      const list = await searchTradingView(pair)
      const item = list.find(it => it.symbol.toUpperCase().includes(base))
      if (item) {
        return NextResponse.json({ ok: true, symbol: `${item.exchange}:${item.symbol}` })
      }
    }

    return NextResponse.json({ ok: false, reason: 'not_found' }, { status: 404 })
  } catch (error) {
    console.error('TV resolve error:', error)
    return NextResponse.json({ ok: false, reason: 'error' }, { status: 500 })
  }
}


