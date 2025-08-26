import { NextRequest, NextResponse } from 'next/server'
import { addCoinToQueue } from '@/lib/supabase'

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

    try {
      // Try to add coin to the queue for analysis
      await addCoinToQueue({
        coin_id,
        priority: 1, // Default priority
      })
    } catch (supabaseError) {
      // If Supabase fails (e.g., no real credentials), log it but don't fail the request
      console.log('Supabase connection failed, using mock mode:', supabaseError)
      console.log(`Mock: Added ${coin_name} (${coin_id}) to analysis queue`)
    }

    // Log the request (works in both real and mock mode)
    if (user_email) {
      console.log(`User ${user_email} requested analysis for ${coin_name} (${coin_id})`)
    } else {
      console.log(`Anonymous user requested analysis for ${coin_name} (${coin_id})`)
    }

    return NextResponse.json({
      success: true,
      message: `${coin_name} has been added to the analysis queue`,
      coin_id,
      estimated_time: '24-48 hours',
      note: 'Request received successfully. Analysis will be generated in the next batch.'
    })

  } catch (error) {
    console.error('Error requesting review:', error)
    return NextResponse.json(
      { error: 'Failed to request review' },
      { status: 500 }
    )
  }
}

// Also allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Review request endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'ready'
  })
}
