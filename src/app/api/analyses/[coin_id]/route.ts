import { NextRequest, NextResponse } from 'next/server'
import { getAnalysisByCoinId } from '@/lib/supabase'

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

    const analysis = await getAnalysisByCoinId(coin_id)

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}
