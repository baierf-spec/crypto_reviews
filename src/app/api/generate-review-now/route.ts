import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'
import { saveAnalysis } from '@/lib/supabase'
import { saveAnalysisToMemory } from '@/lib/analyses'
import { buildAnalysisFromCoin } from '@/lib/analysisGenerator'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coin_id, coin_name, coin_symbol, user_email } = body

    // Validate required fields
    if (!coin_id || !coin_name || !coin_symbol) {
      return NextResponse.json(
        { error: 'Missing required fields: coin_id, coin_name, coin_symbol' },
        { status: 400 }
      )
    }

    // Get fresh coin data
    const coin = await getCoinData(coin_id)
    if (!coin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      )
    }

    // Generate analysis directly (no internal HTTP)
    const analysis = await buildAnalysisFromCoin(coin)

    // Save to database
    try {
      await saveAnalysis(analysis)
      console.log('Analysis saved to Supabase:', analysis.id)
    } catch (supabaseError) {
      console.log('Supabase save failed:', supabaseError)
    }

    // Always save to memory as backup
    saveAnalysisToMemory(analysis)
    console.log('Analysis saved to memory:', analysis.id)

    // Log the request
    if (user_email) {
      console.log(`User ${user_email} requested immediate analysis for ${coin_name} (${coin_id})`)
    } else {
      console.log(`Anonymous user requested immediate analysis for ${coin_name} (${coin_id})`)
    }

    return NextResponse.json({
      success: true,
      message: `AI analysis for ${coin_name} generated successfully!`,
      coin_id,
      analysis_id: analysis.id,
      generated_at: new Date().toISOString(),
      note: 'Your analysis is now live and ready to view!',
      analysis // Include the full analysis in response
    })

  } catch (error) {
    console.error('Error generating immediate review:', error)
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    )
  }
}

// Also allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Immediate review generation endpoint',
    timestamp: new Date().toISOString(),
    status: 'ready'
  })
}
