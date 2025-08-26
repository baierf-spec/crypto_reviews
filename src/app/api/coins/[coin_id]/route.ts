export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'

export async function GET(
  request: NextRequest,
  { params }: { params: { coin_id: string } }
) {
  try {
    const coin_id = params.coin_id

    if (!coin_id) {
      return NextResponse.json(
        { error: 'Coin ID is required' },
        { status: 400 }
      )
    }

    const coin = await getCoinData(coin_id)

    if (!coin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: coin
    })

  } catch (error) {
    console.error('Coin API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coin data' },
      { status: 500 }
    )
  }
}
