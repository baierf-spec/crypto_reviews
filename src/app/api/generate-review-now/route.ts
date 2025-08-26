import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'
import { saveAnalysis } from '@/lib/supabase'
import { saveAnalysisToMemory } from '@/lib/analyses'

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

    // Determine base URL from the incoming request (avoids localhost on Vercel)
    const { origin } = new URL(request.url)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin

    // Generate analysis immediately
    const analysisResponse = await fetch(`${baseUrl}/api/generate-review`, {
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
      const errorData = await analysisResponse.json()
      console.error('Analysis generation failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      )
    }

    const analysisData = await analysisResponse.json()
    
    if (!analysisData.success || !analysisData.data) {
      console.error('Invalid analysis response:', analysisData)
      return NextResponse.json(
        { error: 'Analysis generation failed' },
        { status: 500 }
      )
    }

    // Save to database
    try {
      await saveAnalysis(analysisData.data)
      console.log('Analysis saved to Supabase:', analysisData.data.id)
    } catch (supabaseError) {
      console.log('Supabase save failed:', supabaseError)
    }

    // Always save to memory as backup
    saveAnalysisToMemory(analysisData.data)
    console.log('Analysis saved to memory:', analysisData.data.id)

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
      analysis_id: analysisData.data.id,
      generated_at: new Date().toISOString(),
      note: 'Your analysis is now live and ready to view!',
      analysis: analysisData.data // Include the full analysis in response
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
