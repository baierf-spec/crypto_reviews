import { NextRequest, NextResponse } from 'next/server'
import { buildAnalysisFromCoin } from '@/lib/analysisGenerator'

function formatMarkdownToHtml(md: string): string {
  try {
    let html = md || ''
    // Headings ## Title -> h2 styled
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-teal-400 mb-4">$1</h2>')
    // Bold *text* (single-line, non-greedy)
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    // Lists: lines starting with -
    html = html.replace(/^(?:-\s+.+(?:\r?\n|$))+?/gm, (block) => {
      const items = block.trim().split(/\r?\n/).filter(Boolean)
      const lis = items.map(li => li.replace(/^-\s+(.+)/, '<li class="ml-4">$1</li>')).join('')
      return `<ul class="list-disc pl-5 mb-3">${lis}</ul>`
    })
    // Markdown-style table -> responsive table
    html = html.replace(/^\|([^\n]+)\|\n\|[-\s|]+\|\n([\s\S]*?)\n(?=\n|$)/gm, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean)
      const rows = bodyRows.split(/\n/).map((r: string) => r.split('|').map(c => c.trim()).filter(Boolean)).filter(r => r.length)
      const thead = `<thead><tr>${headers.map(h => `<th class=\"px-3 py-2 text-left text-gray-300\">${h}</th>`).join('')}</tr></thead>`
      const tbody = `<tbody>${rows.map(cols => `<tr class=\"border-t border-white/10\">${cols.map(c => `<td class=\"px-3 py-2 text-white/90\">${c}</td>`).join('')}</tr>`).join('')}</tbody>`
      return `<div class=\"overflow-x-auto mb-4\"><table class=\"min-w-full text-sm\">${thead}${tbody}</table></div>`
    })
    // Price Prediction Scenarios: bullets to two-column table if detected
    html = html.replace(/<ul class=\"list-disc[^>]*\">([\s\S]*?)<\/ul>/g, (m, inner) => {
      if (!/Bullish:|Neutral:|Bearish:/i.test(inner)) return m
      const items = Array.from(inner.matchAll(/<li class=\"ml-4\">\s*([^<:]+):\s*([^<]+)<\/li>/g)).map(a => ({ label: a[1], text: a[2] }))
      if (items.length < 3) return m
      const rows = items.map(it => `<tr class=\"border-t border-white/10\"><td class=\"px-3 py-2 text-white\"><strong>${it.label}</strong></td><td class=\"px-3 py-2 text-white/90\">${it.text}</td></tr>`).join('')
      return `<div class=\"overflow-x-auto mb-4\"><table class=\"min-w-full text-sm\"><thead><tr><th class=\"px-3 py-2 text-left\">Scenario</th><th class=\"px-3 py-2 text-left\">Outlook</th></tr></thead><tbody>${rows}</tbody></table></div>`
    })
    // Paragraphs: wrap remaining non-HTML blocks
    html = html
      .split(/\n\n+/)
      .map(seg => /<h2|<ul|<li|<table|<p|<strong|<em|<a|<img/.test(seg) ? seg : `<p class="text-gray-300 mb-2">${seg.replace(/\n/g, ' ')}</p>`)
      .join('')
    return html
  } catch (_) {
    return md
  }
}
import { getCoinData } from '@/lib/apis'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coin_id, coin_name, coin_symbol, current_price, market_cap, price_change_24h } = body

    if (!coin_id || !coin_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure we have the full coin object even if only fields provided
    const coin = coin_id && (!current_price || !market_cap)
      ? await getCoinData(coin_id)
      : {
          id: coin_id,
          name: coin_name,
          symbol: coin_symbol,
          current_price,
          market_cap,
          price_change_percentage_24h: price_change_24h,
        }

    if (!coin) {
      return NextResponse.json({ error: 'Coin not found' }, { status: 404 })
    }

    const analysis = await buildAnalysisFromCoin(coin as any)
    const formatted = formatMarkdownToHtml(analysis.content)

    return NextResponse.json({
      success: true,
      data: { ...analysis, content: formatted, content_format: 'html' }
    })

  } catch (error) {
    console.error('Error generating review:', error)
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    )
  }
}
