import { NextRequest, NextResponse } from 'next/server'
import { buildAnalysisFromCoin } from '@/lib/analysisGenerator'
import { getCoinData } from '@/lib/apis'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coin_id, coin_name, coin_symbol, current_price, market_cap, price_change_24h } = body

    if (!coin_id || !coin_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure we have the full coin object even if only fields provided
    const coin = coin_id && (!current_price || !market_cap)
      ? await getCoinData(coin_id)
      : {
          id: coin_id,
          name: coin_name,
          symbol: coin_symbol,
          current_price,
          market_cap,
          price_change_percentage_24h,
        }

    if (!coin) {
      return NextResponse.json({ error: 'Coin not found' }, { status: 404 })
    }

    const analysis = await buildAnalysisFromCoin(coin as any)

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error generating review:', error)
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    )
  }
}
