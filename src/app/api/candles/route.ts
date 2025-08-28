import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { findExchangeBaseViaCG } from '@/lib/tvSymbols'

type Provider = 'binance' | 'mexc' | 'kucoin'

const PROVIDERS: Provider[] = ['binance', 'kucoin', 'mexc']

function providerUrl(p: Provider, base: string, quote: string, interval: string, limit = 500) {
  const pair = `${base}${quote}`.toUpperCase()
  switch (p) {
    case 'binance':
      return `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`
    case 'mexc':
      // MEXC uses kline endpoint with ONE_MINUTE, ONE_HOUR, ONE_DAY, etc.
      const map: Record<string, string> = { '1m': 'Min1', '5m': 'Min5', '15m': 'Min15', '1h': 'Hour1', '4h': 'Hour4', '1d': 'Day1' }
      const res = map[interval] || 'Hour1'
      return `https://contract.mexc.com/api/v1/contract/kline/${pair}_SWAP?interval=${res}&limit=${limit}`
    case 'kucoin':
      const km: Record<string, string> = { '1m': '1min', '5m': '5min', '15m': '15min', '1h': '1hour', '4h': '4hour', '1d': '1day' }
      const kint = km[interval] || '1hour'
      return `https://api.kucoin.com/api/v1/market/candles?type=${kint}&symbol=${base}-${quote}`
  }
}

function toCandles(provider: Provider, raw: any[], p: { base: string; quote: string }) {
  // Normalize to { time, open, high, low, close, volume }
  if (provider === 'binance') {
    return raw.map((r: any[]) => ({
      time: Number(r[0]) / 1000,
      open: Number(r[1]),
      high: Number(r[2]),
      low: Number(r[3]),
      close: Number(r[4]),
      volume: Number(r[5]),
      base: p.base,
      quote: p.quote,
    }))
  }
  if (provider === 'mexc') {
    const list = (raw as any)?.data || []
    return list.map((r: any) => ({
      time: Number(r.t) / 1000,
      open: Number(r.o),
      high: Number(r.h),
      low: Number(r.l),
      close: Number(r.c),
      volume: Number(r.v),
      base: p.base,
      quote: p.quote,
    }))
  }
  // kucoin
  const data = (raw as any)?.data || []
  return data.map((r: any[]) => ({
    time: Number(r[0]),
    open: Number(r[1]),
    high: Number(r[3]),
    low: Number(r[4]),
    close: Number(r[2]),
    volume: Number(r[5]),
    base: p.base,
    quote: p.quote,
  }))
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const base = (searchParams.get('base') || '').toUpperCase()
    const quote = (searchParams.get('quote') || 'USDT').toUpperCase()
    const interval = searchParams.get('interval') || '1h'
    const days = Math.max(1, Math.min(365, Number(searchParams.get('days') || 30)))
    const coinId = searchParams.get('coinId') || ''
    const prefer = (searchParams.get('exchange') || '').toLowerCase() as Provider
    if (!base && !coinId) return NextResponse.json({ error: 'Missing base or coinId' }, { status: 400 })

    let resolvedBase = base
    if (!resolvedBase && coinId) {
      const resolved = await findExchangeBaseViaCG(coinId)
      if (resolved) {
        resolvedBase = resolved.base
        console.log(`Candles resolve via CG tickers: ${resolved.exchange}:${resolved.base}${quote}`)
      }
    }

    const order = prefer && PROVIDERS.includes(prefer) ? [prefer, ...PROVIDERS.filter(p => p !== prefer)] : PROVIDERS

    // Compute approximate bar limit by interval and days window
    const barsPerDay = interval === '1h' ? 24 : interval === '4h' ? 6 : interval === '1d' ? 1 : interval === '1w' ? 1/7 : 24
    const limit = Math.max(30, Math.ceil(days * barsPerDay))

    for (const p of order) {
      try {
        const url = providerUrl(p, resolvedBase || base, quote, interval, limit)
        const res = await fetch(url, { next: { revalidate: 0 } })
        if (!res.ok) continue
        const json = await res.json()
        const normalized = toCandles(p, json, { base: resolvedBase || base, quote })
        if (normalized?.length) {
          console.log(`Chart source: ${p.toUpperCase()}`)
          return NextResponse.json({ ok: true, provider: p, candles: normalized })
        }
      } catch (_) {}
    }
    // CoinGecko OHLC fallback (30 days, USD)
    if (coinId) {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
        const res = await fetch(url, { next: { revalidate: 0 } })
        if (res.ok) {
          const data = await res.json()
          // CG format: [timestamp, open, high, low, close]
          const mapped = (Array.isArray(data) ? data : []).map((r: any[]) => ({
            time: Math.floor(Number(r[0]) / 1000),
            open: Number(r[1]),
            high: Number(r[2]),
            low: Number(r[3]),
            close: Number(r[4]),
            volume: 0,
            base: resolvedBase || base || 'USD',
            quote: 'USD',
          }))
          if (mapped.length) {
            console.log('Fallback: CoinGecko OHLC')
            return NextResponse.json({ ok: true, provider: 'coingecko', candles: mapped })
          }
        }
      } catch (_) {}
    }
    return NextResponse.json({ ok: false, candles: [] }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 })
  }
}


