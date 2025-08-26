export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/apis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '1000')

    const coins = await getTopCoins(limit)

    return NextResponse.json({
      success: true,
      data: coins,
      count: coins.length,
      limit
    })

  } catch (error) {
    console.error('Coins API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coins' },
      { status: 500 }
    )
  }
}
