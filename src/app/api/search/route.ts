import { NextRequest, NextResponse } from 'next/server'
import { searchCoins } from '@/lib/apis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results = await searchCoins(query, limit)

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      query
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search cryptocurrencies' },
      { status: 500 }
    )
  }
}
