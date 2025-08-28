import { NextResponse } from 'next/server'
import { getAllAnalysesFromMemory } from '@/lib/analyses'

export async function GET() {
  try {
    console.log('Debug API: Testing memory storage analyses...')
    
    const analyses = getAllAnalysesFromMemory()
    console.log('Debug API: Memory analyses count:', analyses.length)
    console.log('Debug API: Memory analyses:', analyses)
    
    return NextResponse.json({
      success: true,
      count: analyses.length,
      analyses: analyses,
      message: `Found ${analyses.length} analyses in memory storage`
    })
  } catch (error) {
    console.error('Debug API: Error testing memory storage:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
      analyses: []
    }, { status: 500 })
  }
}
