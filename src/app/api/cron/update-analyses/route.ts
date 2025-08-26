import { NextRequest, NextResponse } from 'next/server'
import { getAllAnalysesFromMemory } from '@/lib/analyses'
import { getCoinData } from '@/lib/apis'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job request (you can add authentication here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting automatic analysis updates...')

    // Get all existing analyses
    const analyses = getAllAnalysesFromMemory()
    
    if (analyses.length === 0) {
      return NextResponse.json({
        message: 'No analyses to update',
        updated: 0,
        timestamp: new Date().toISOString()
      })
    }

    const results = {
      total: analyses.length,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Update analyses that are older than 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    for (const analysis of analyses) {
      try {
        const analysisDate = new Date(analysis.date)
        
        // Only update if analysis is older than 7 days
        if (analysisDate < sevenDaysAgo) {
          console.log(`Updating analysis for ${analysis.coin_name}...`)
          
          // Get fresh coin data
          const freshCoinData = await getCoinData(analysis.coin_id)
          if (!freshCoinData) {
            results.failed++
            results.errors.push(`Failed to fetch fresh data for ${analysis.coin_name}`)
            continue
          }

          // Generate new analysis
          const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-review`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coin_id: freshCoinData.id,
              coin_name: freshCoinData.name,
              coin_symbol: freshCoinData.symbol,
              current_price: freshCoinData.current_price,
              market_cap: freshCoinData.market_cap,
              price_change_24h: freshCoinData.price_change_percentage_24h,
            }),
          })

          if (analysisResponse.ok) {
            const newAnalysis = await analysisResponse.json()
            if (newAnalysis.success) {
              // Update the analysis in memory
              const { saveAnalysisToMemory } = await import('@/lib/analyses')
              saveAnalysisToMemory(newAnalysis.data)
              results.updated++
              console.log(`Successfully updated analysis for ${analysis.coin_name}`)
            } else {
              results.failed++
              results.errors.push(`Failed to generate new analysis for ${analysis.coin_name}`)
            }
          } else {
            results.failed++
            results.errors.push(`API error updating ${analysis.coin_name}`)
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        results.failed++
        results.errors.push(`Error updating ${analysis.coin_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        console.error(`Error updating analysis for ${analysis.coin_name}:`, error)
      }
    }

    console.log(`Analysis update completed: ${results.updated} updated, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      message: 'Automatic analysis updates completed',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in automatic analysis updates:', error)
    return NextResponse.json(
      { error: 'Failed to update analyses' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Automatic analysis update endpoint',
    timestamp: new Date().toISOString(),
    status: 'ready',
    usage: 'POST with cron job authentication'
  })
}
