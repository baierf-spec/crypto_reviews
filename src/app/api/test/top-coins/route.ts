import { NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/apis'

export async function GET() {
  try {
    console.log('Test Top Coins API: Starting test...')
    
    const coins = await getTopCoins(5)
    console.log('Test Top Coins API: Fetched coins:', coins?.length || 0)
    
    return NextResponse.json({
      success: true,
      count: coins?.length || 0,
      coins: coins?.slice(0, 3) || [], // Return first 3 for debugging
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test Top Coins API: Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}


