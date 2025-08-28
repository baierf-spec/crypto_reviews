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
    
    console.log('Candles API: Request params:', { base, quote, interval, days, coinId, prefer })
    
    if (!base && !coinId) {
      console.log('Candles API: Missing base or coinId')
      return NextResponse.json({ error: 'Missing base or coinId' }, { status: 400 })
    }

    let resolvedBase = base
    if (!resolvedBase && coinId) {
      console.log('Candles API: Resolving base symbol for coinId:', coinId)
      const resolved = await findExchangeBaseViaCG(coinId)
      if (resolved) {
        resolvedBase = resolved.base
        console.log(`Candles API: Resolved via CG tickers: ${resolved.exchange}:${resolved.base}${quote}`)
      } else {
        console.log('Candles API: Failed to resolve base symbol for coinId:', coinId)
      }
    }

    const order = prefer && PROVIDERS.includes(prefer) ? [prefer, ...PROVIDERS.filter(p => p !== prefer)] : PROVIDERS
    console.log('Candles API: Provider order:', order)

    // Compute approximate bar limit by interval and days window
    const barsPerDay = interval === '1h' ? 24 : interval === '4h' ? 6 : interval === '1d' ? 1 : interval === '1w' ? 1/7 : 24
    const limit = Math.max(30, Math.ceil(days * barsPerDay))
    console.log('Candles API: Calculated limit:', limit, 'bars')

    for (const p of order) {
      try {
        console.log('Candles API: Trying provider:', p)
        const url = providerUrl(p, resolvedBase || base, quote, interval, limit)
        console.log('Candles API: Provider URL:', url)
        
        const res = await fetch(url, { next: { revalidate: 0 } })
        console.log('Candles API: Provider response status:', res.status)
        
        if (!res.ok) {
          console.log('Candles API: Provider failed, trying next...')
          continue
        }
        
        const json = await res.json()
        console.log('Candles API: Provider data received, length:', Array.isArray(json) ? json.length : 'not array')
        
        const normalized = toCandles(p, json, { base: resolvedBase || base, quote })
        console.log('Candles API: Normalized data length:', normalized?.length || 0)
        
        if (normalized?.length) {
          console.log(`Candles API: Success with provider ${p.toUpperCase()}`)
          return NextResponse.json({ ok: true, provider: p, candles: normalized })
        }
      } catch (err) {
        console.error('Candles API: Provider error:', p, err)
      }
    }
    
    // CoinGecko OHLC fallback (30 days, USD)
    if (coinId) {
      console.log('Candles API: Trying CoinGecko fallback for coinId:', coinId)
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
        console.log('Candles API: CoinGecko URL:', url)
        
        const res = await fetch(url, { next: { revalidate: 0 } })
        console.log('Candles API: CoinGecko response status:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('Candles API: CoinGecko data received, length:', Array.isArray(data) ? data.length : 'not array')
          
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
            console.log('Candles API: CoinGecko fallback success')
            return NextResponse.json({ ok: true, provider: 'coingecko', candles: mapped })
          }
        }
      } catch (err) {
        console.error('Candles API: CoinGecko fallback error:', err)
      }
    }
    
    console.log('Candles API: All providers failed, returning empty result')
    return NextResponse.json({ ok: false, candles: [] }, { status: 404 })
  } catch (e) {
    console.error('Candles API: Unexpected error:', e)
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 })
  }
}


