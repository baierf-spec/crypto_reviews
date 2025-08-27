import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'
import { saveAnalysis } from '@/lib/supabase'
import { saveAnalysisToMemory } from '@/lib/analyses'
import { buildAnalysisFromCoin } from '@/lib/analysisGenerator'

export const dynamic = 'force-dynamic'

function formatMarkdownToHtml(md: string): string {
  try {
    let html = md || ''
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-teal-400 mb-4">$1</h2>')
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    html = html.replace(/^(?:-\s+.+(?:\r?\n|$))+?/gm, (block) => {
      const items = block.trim().split(/\r?\n/).filter(Boolean)
      const lis = items.map(li => li.replace(/^-\s+(.+)/, '<li class="ml-4">$1</li>')).join('')
      return `<ul class="list-disc pl-5 mb-3">${lis}</ul>`
    })
    html = html
      .split(/\n\n+/)
      .map(seg => /<h2|<ul|<li|<table|<p|<strong|<em|<a|<img/.test(seg) ? seg : `<p class=\"text-gray-300 mb-2\">${seg.replace(/\n/g, ' ')}</p>`)
      .join('')
    return html
  } catch (_) {
    return md
  }
}
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
    // Format content to styled HTML for consistent rendering client-side
    if (analysis && analysis.content) {
      const formatted = formatMarkdownToHtml(analysis.content as any)
      ;(analysis as any).content = formatted
      ;(analysis as any).content_format = 'html'
    }

    // Save to database (non-blocking, upsert by coin_id)
    try {
      await saveAnalysis(analysis)
      console.log('Analysis upserted to Supabase.')
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
