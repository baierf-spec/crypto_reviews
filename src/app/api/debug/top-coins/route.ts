import { NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/apis'

export async function GET() {
  try {
    console.log('Debug API: Testing getTopCoins...')
    
    const coins = await getTopCoins(100)
    console.log('Debug API: Top coins count:', coins?.length || 0)
    
    // Show first 10 coins with their IDs
    const sampleCoins = coins?.slice(0, 10).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.current_price
    })) || []
    
    console.log('Debug API: Sample coins:', sampleCoins)
    
    // Check if our analysis coin IDs exist in the coins list
    const analysisCoinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']
    const foundCoins = analysisCoinIds.map(coinId => {
      const found = coins?.find(c => c.id === coinId)
      return {
        coin_id: coinId,
        found: !!found,
        coin_data: found ? {
          id: found.id,
          name: found.name,
          symbol: found.symbol,
          current_price: found.current_price
        } : null
      }
    })
    
    console.log('Debug API: Found analysis coins:', foundCoins)
    
    return NextResponse.json({
      success: true,
      total_coins: coins?.length || 0,
      sample_coins: sampleCoins,
      analysis_coins_check: foundCoins,
      message: `Found ${coins?.length || 0} coins from API`
    })
  } catch (error) {
    console.error('Debug API: Error testing getTopCoins:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total_coins: 0,
      sample_coins: [],
      analysis_coins_check: []
    }, { status: 500 })
  }
}


