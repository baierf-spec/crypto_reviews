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

    console.log('Coin History API: Request for coinId:', coinId, 'days:', days)

    // Try direct CoinGecko id == slug
    let resp = await fetchHistoryByGeckoId(coinId, days)
    console.log('Coin History API: Direct CoinGecko response status:', resp.status)
    
    if (!resp.ok) {
      console.log('Coin History API: Direct lookup failed, trying to resolve mapping...')
      // Resolve mapping using search by name/symbol
      let mappedId: string | null = null
      try {
        const coin = await getCoinData(coinId)
        console.log('Coin History API: Coin data resolved:', coin?.name, coin?.symbol)
        
        if (coin) {
          const q = encodeURIComponent(coin.name)
          const s = await fetch(`https://api.coingecko.com/api/v3/search?query=${q}`)
          console.log('Coin History API: Search response status:', s.status)
          
          if (s.ok) {
            const js = await s.json()
            const symbol = (coin.symbol || '').toLowerCase()
            const match = (js.coins || []).find((c: any) => c.symbol?.toLowerCase() === symbol) || (js.coins || [])[0]
            mappedId = match?.id || null
            console.log('Coin History API: Mapped ID found:', mappedId)
          }
        }
      } catch (err) {
        console.error('Coin History API: Error in mapping resolution:', err)
      }

      if (mappedId) {
        console.log('Coin History API: Retrying with mapped ID:', mappedId)
        resp = await fetchHistoryByGeckoId(mappedId, days)
        console.log('Coin History API: Mapped lookup response status:', resp.status)
      }
    }

    if (!resp.ok) {
      console.log('Coin History API: All attempts failed, returning empty prices')
      return NextResponse.json({ prices: [] })
    }
    
    const json = await resp.json()
    console.log('Coin History API: Success, returning', json?.prices?.length || 0, 'price points')
    return NextResponse.json(json)
  } catch (e) {
    console.error('Coin History API: Unexpected error:', e)
    return NextResponse.json({ prices: [] })
  }
}


