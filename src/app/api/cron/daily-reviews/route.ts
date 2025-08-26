import { NextRequest, NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/apis'
import { getCoinQueue, addCoinToQueue, updateCoinAnalysisDate, saveAnalysis } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current coin queue
    const queue = await getCoinQueue()
    
    // Get top coins from CoinGecko
    const topCoins = await getTopCoins(1000)
    
    // Filter coins that haven't been analyzed in the last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const availableCoins = topCoins.filter(coin => {
      const queueItem = queue.find(q => q.coin_id === coin.id)
      if (!queueItem) return true
      if (!queueItem.last_analyzed_date) return true
      return new Date(queueItem.last_analyzed_date) < ninetyDaysAgo
    })

    // Select next 10 coins to analyze
    const coinsToAnalyze = availableCoins.slice(0, 10)
    
    const results = []
    
    for (const coin of coinsToAnalyze) {
      try {
        // Generate analysis
        const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coin_id: coin.id,
            coin_name: coin.name,
            coin_symbol: coin.symbol,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            price_change_24h: coin.price_change_percentage_24h,
          }),
        })

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json()
          
          // Save to database
          await saveAnalysis(analysisData.data)
          
          // Update queue
          await updateCoinAnalysisDate(coin.id)
          
          results.push({
            coin_id: coin.id,
            status: 'success',
            analysis_id: analysisData.data.id
          })
        } else {
          results.push({
            coin_id: coin.id,
            status: 'failed',
            error: 'Analysis generation failed'
          })
        }
      } catch (error) {
        console.error(`Error processing coin ${coin.id}:`, error)
        results.push({
          coin_id: coin.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${coinsToAnalyze.length} coins`,
      results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}

// Also allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Daily reviews cron job endpoint',
    timestamp: new Date().toISOString()
  })
}
