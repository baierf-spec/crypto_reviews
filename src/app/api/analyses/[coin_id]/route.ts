import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

function summarizeIndicators({ rsi, ema50VsPrice, trend, bbState }: { rsi: number | null; ema50VsPrice: number | null; trend: 'up' | 'down' | 'flat'; bbState: 'expanding' | 'contracting' | 'neutral' }) {
  const parts: string[] = []
  if (rsi != null) parts.push(`RSI(14) ${Math.round(rsi)}${rsi >= 70 ? ' (overbought)' : rsi <= 30 ? ' (oversold)' : ''}`)
  if (ema50VsPrice != null) parts.push(`Price ${ema50VsPrice >= 0 ? 'above' : 'below'} EMA(50) by ${Math.abs(ema50VsPrice).toFixed(2)}%`)
  parts.push(`Trend ${trend}`)
  parts.push(`Bands ${bbState}`)
  return parts.join('; ') + '.'
}

export async function POST(req: NextRequest, { params }: { params: { coin_id: string } }) {
  try {
    const body = await req.json()
    const { rsi, ema50VsPrice, trend, bbState } = body || {}
    const base = summarizeIndicators({ rsi, ema50VsPrice, trend, bbState })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ summary: base })
    }

    const openai = new OpenAI({ apiKey })
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional trading assistant. Write 2 concise sentences.' },
        { role: 'user', content: `Summarize technical state as guidance only: ${base}` },
      ],
      temperature: 0.4,
      max_tokens: 120,
    })

    const text = resp.choices[0]?.message?.content?.trim() || base
    return NextResponse.json({ summary: text })
  } catch (e) {
    return NextResponse.json({ summary: 'Technical snapshot unavailable.' }, { status: 200 })
  }
}

// removed duplicate import
import { getAnalysisByCoinId } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { coin_id: string } }
) {
  try {
    const coin_id = params.coin_id

    if (!coin_id) {
      return NextResponse.json(
        { error: 'Coin ID is required' },
        { status: 400 }
      )
    }

    const analysis = await getAnalysisByCoinId(coin_id)

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}
