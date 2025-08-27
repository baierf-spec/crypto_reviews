import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'
import { saveAnalysis } from '@/lib/supabase'
import { saveAnalysisToMemory } from '@/lib/analyses'
import { buildAnalysisFromCoin } from '@/lib/analysisGenerator'

export const dynamic = 'force-dynamic'

function formatMarkdownToHtml(md: string): string {
  try {
    let html = md || ''
    // Add ### and ## headings styling
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold text-teal-300 mb-3">$1</h3>')
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-teal-400 mb-4">$1</h2>')
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    html = html.replace(/^(?:-\s+.+(?:\r?\n|$))+?/gm, (block) => {
      const items = block.trim().split(/\r?\n/).filter(Boolean)
      const lis = items.map(li => li.replace(/^-\s+(.+)/, '<li class="ml-4">$1</li>')).join('')
      return `<ul class="list-disc pl-5 mb-3">${lis}</ul>`
    })
    html = html
      .split(/\n\n+/)
      .map(seg => /<h2|<h3|<ul|<li|<table|<p|<strong|<em|<a|<img/.test(seg) ? seg : `<p class=\"text-gray-300 mb-2\">${seg.replace(/\n/g, ' ')}<\/p>`)
      .join('')
    // Convert markdown tables to styled table
    html = html.replace(/^\|([^\n]+)\|\n\|[-\s|]+\|\n([\s\S]*?)\n(?=\n|$)/gm, (match: string, headerRow: string, bodyRows: string) => {
      const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean)
      const rows = bodyRows.split(/\n/).map((r: string) => r.split('|').map((c: string) => c.trim()).filter(Boolean)).filter((r: string[]) => r.length)
      const thead = `<thead><tr>${headers.map(h => `<th class=\"px-3 py-2 text-left text-gray-300\">${h}</th>`).join('')}</tr></thead>`
      const tbody = `<tbody>${rows.map(cols => `<tr class=\"border-t border-white/10\">${cols.map(c => `<td class=\"px-3 py-2 text-white/90\">${c}</td>`).join('')}</tr>`).join('')}</tbody>`
      return `<div class=\"overflow-x-auto mb-4\"><table class=\"min-w-full text-sm\">${thead}${tbody}</table></div>`
    })
    // Convert single-line pipe metrics into a table
    html = html.replace(/^\|\s*([^\n]+?)\s*\|\s*$/gm, (line: string, inside: string) => {
      const cells = inside.split('|').map((c: string) => c.trim()).filter(Boolean)
      if (cells.length < 4) return line
      const rows: string[] = []
      for (let i = 0; i < cells.length - 1; i += 2) {
        rows.push(`<tr class=\"border-t border-white/10\"><td class=\"px-3 py-2 text-gray-300\">${cells[i]}</td><td class=\"px-3 py-2 text-white/90\">${cells[i+1]}</td></tr>`)
      }
      const thead = `<thead><tr><th class=\"px-3 py-2 text-left text-gray-300\">Metric</th><th class=\"px-3 py-2 text-left text-gray-300\">Value</th></tr></thead>`
      return `<div class=\"overflow-x-auto mb-4\"><table class=\"min-w-full text-sm\">${thead}<tbody>${rows.join('')}</tbody></table></div>`
    })
    // Convert price prediction bullet list to table if present
    html = html.replace(/<ul class=\"list-disc[^>]*\">([\s\S]*?)<\/ul>/g, (m: string, inner: string) => {
      if (!/Bullish:|Neutral:|Bearish:/i.test(inner)) return m
      const items = Array.from(inner.matchAll(/<li class=\"ml-4\">\s*([^<:]+):\s*([^<]+)<\/li>/g)).map((a: RegExpMatchArray) => ({ label: a[1], text: a[2] }))
      if (items.length < 3) return m
      const rows = items.map(it => `<tr class=\"border-t border-white/10\"><td class=\"px-3 py-2 text-white\"><strong>${it.label}</strong></td><td class=\"px-3 py-2 text-white/90\">${it.text}</td></tr>`).join('')
      return `<div class=\"overflow-x-auto mb-4\"><table class=\"min-w-full text-sm\"><thead><tr><th class=\"px-3 py-2 text-left\">Scenario</th><th class=\"px-3 py-2 text-left\">Outlook</th></tr></thead><tbody>${rows}</tbody></table></div>`
    })
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
