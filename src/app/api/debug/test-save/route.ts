import { NextResponse } from 'next/server'
import { saveAnalysis, getAnalysisByCoinId } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const testAnalysis = {
      coin_id: 'test-save-' + Date.now(),
      coin_name: 'Test Save Coin',
      coin_symbol: 'TEST',
      content: 'This is a test analysis to verify database save functionality.',
      date: new Date().toISOString(),
      ratings: { sentiment: 3, onChain: 3, eco: 3, overall: 3 },
      price_prediction: null,
      on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 },
      social_sentiment: { twitter_score: 0, reddit_score: 0, overall_score: 0 },
    }

    console.log('Testing save functionality...')
    
    // Test save
    const saveResult = await saveAnalysis(testAnalysis)
    console.log('Save result:', saveResult)
    
    if (!saveResult) {
      return NextResponse.json({ 
        success: false, 
        error: 'Save failed',
        coin_id: testAnalysis.coin_id 
      }, { status: 500 })
    }
    
    // Test retrieve
    const retrieved = await getAnalysisByCoinId(testAnalysis.coin_id)
    console.log('Retrieve result:', retrieved ? 'found' : 'not found')
    
    // Clean up test data
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE!
    const client = createClient(supabaseUrl, serviceRoleKey)
    
    await client
      .from('analyses')
      .delete()
      .eq('coin_id', testAnalysis.coin_id)
    
    return NextResponse.json({
      success: true,
      message: 'Database save and retrieve test successful',
      save_result: saveResult,
      retrieve_result: !!retrieved,
      test_coin_id: testAnalysis.coin_id
    })
    
  } catch (error) {
    console.error('Test save error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


