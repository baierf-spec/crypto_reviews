import { NextRequest, NextResponse } from 'next/server'
import { getAllAnalysesFromMemory } from '@/lib/analyses'

export async function GET(request: NextRequest) {
  try {
    const analyses = getAllAnalysesFromMemory()
    
    return NextResponse.json({
      success: true,
      count: analyses.length,
      analyses: analyses.map(analysis => ({
        coin_id: analysis.coin_id,
        coin_name: analysis.coin_name,
        coin_symbol: analysis.coin_symbol,
        date: analysis.date,
        id: analysis.id
      }))
    })

  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}
