import { NextRequest, NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/apis'
import { saveAnalysis } from '@/lib/supabase'
import { saveAnalysisToMemory } from '@/lib/analyses'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { limit = 100, batch_size = 10 } = body

    console.log(`Starting bulk analysis generation for ${limit} coins`)

    // Get top coins from CoinGecko
    const coins = await getTopCoins(limit)
    
    if (!coins || coins.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch coins from CoinGecko' },
        { status: 500 }
      )
    }

    const results = {
      total_coins: coins.length,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[],
      generated_analyses: [] as any[]
    }

    // Process coins in batches to avoid rate limiting
    for (let i = 0; i < coins.length; i += batch_size) {
      const batch = coins.slice(i, i + batch_size)
      console.log(`Processing batch ${Math.floor(i / batch_size) + 1}/${Math.ceil(coins.length / batch_size)}`)

      // Process batch concurrently
      const batchPromises = batch.map(async (coin) => {
        try {
          // Check if analysis already exists
          const existingAnalysis = await checkExistingAnalysis(coin.id)
          if (existingAnalysis) {
            console.log(`Analysis already exists for ${coin.name}, skipping`)
            return { coin_id: coin.id, status: 'skipped', reason: 'already_exists' }
          }

          // Generate analysis
          const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-review`, {
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

          if (!analysisResponse.ok) {
            throw new Error(`Analysis generation failed for ${coin.name}`)
          }

          const analysisData = await analysisResponse.json()
          
          if (!analysisData.success || !analysisData.data) {
            throw new Error(`Invalid analysis response for ${coin.name}`)
          }

          // Save to database
          try {
            await saveAnalysis(analysisData.data)
          } catch (supabaseError) {
            console.log(`Supabase save failed for ${coin.name}:`, supabaseError)
          }

          // Always save to memory
          saveAnalysisToMemory(analysisData.data)

          console.log(`Successfully generated analysis for ${coin.name}`)
          return { 
            coin_id: coin.id, 
            coin_name: coin.name,
            status: 'success', 
            analysis_id: analysisData.data.id 
          }

        } catch (error) {
          console.error(`Failed to generate analysis for ${coin.name}:`, error)
          return { 
            coin_id: coin.id, 
            coin_name: coin.name,
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      
      // Update results
      batchResults.forEach(result => {
        results.processed++
        if (result.status === 'success') {
          results.successful++
          results.generated_analyses.push(result)
        } else if (result.status === 'failed') {
          results.failed++
          results.errors.push(`${result.coin_name}: ${result.error}`)
        }
      })

      // Add delay between batches to avoid rate limiting
      if (i + batch_size < coins.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
      }
    }

    console.log(`Bulk generation completed: ${results.successful} successful, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Bulk analysis generation completed`,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in bulk generation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk generation' },
      { status: 500 }
    )
  }
}

async function checkExistingAnalysis(coin_id: string) {
  try {
    // Check memory first
    const memoryAnalysis = await import('@/lib/analyses').then(m => m.getAnalysisFromMemory(coin_id))
    if (memoryAnalysis) return memoryAnalysis

    // Check database
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analyses/${coin_id}`)
    if (response.ok) {
      const data = await response.json()
      return data
    }

    return null
  } catch (error) {
    return null
  }
}

// GET endpoint to check bulk generation status
export async function GET() {
  return NextResponse.json({
    message: 'Bulk analysis generation endpoint',
    timestamp: new Date().toISOString(),
    status: 'ready',
    usage: 'POST with { limit: number, batch_size: number }'
  })
}
