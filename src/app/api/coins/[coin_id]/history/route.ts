import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { coin_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '7'
    const coinId = params.coin_id
    const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)
    if (!resp.ok) {
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
    }
    const json = await resp.json()
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}


