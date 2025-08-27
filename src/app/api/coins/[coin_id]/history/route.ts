import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'

export const dynamic = 'force-dynamic'

async function fetchHistoryByGeckoId(geckoId: string, days: string) {
  const url = `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`
  return fetch(url)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { coin_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '7'
    const coinId = params.coin_id

    // Try direct CoinGecko id == slug
    let resp = await fetchHistoryByGeckoId(coinId, days)
    if (!resp.ok) {
      // Resolve mapping using search by name/symbol
      let mappedId: string | null = null
      try {
        const coin = await getCoinData(coinId)
        if (coin) {
          const q = encodeURIComponent(coin.name)
          const s = await fetch(`https://api.coingecko.com/api/v3/search?query=${q}`)
          if (s.ok) {
            const js = await s.json()
            const symbol = (coin.symbol || '').toLowerCase()
            const match = (js.coins || []).find((c: any) => c.symbol?.toLowerCase() === symbol) || (js.coins || [])[0]
            mappedId = match?.id || null
          }
        }
      } catch (_) {}

      if (mappedId) {
        resp = await fetchHistoryByGeckoId(mappedId, days)
      }
    }

    if (!resp.ok) {
      return NextResponse.json({ prices: [] })
    }
    const json = await resp.json()
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ prices: [] })
  }
}


