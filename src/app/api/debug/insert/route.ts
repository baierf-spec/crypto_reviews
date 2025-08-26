import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE

  if (!url || !service) {
    return NextResponse.json({ ok: false, error: 'Missing Supabase URL or service role key' }, { status: 500 })
  }

  const client = createClient(url, service)

  const analysis = {
    coin_id: 'debugcoin',
    coin_name: 'Debug Coin',
    coin_symbol: 'DBG',
    content: 'Test insert from /api/debug/insert',
    date: new Date().toISOString(),
    ratings: { sentiment: 3, onChain: 3, eco: 3, overall: 3 },
    price_prediction: null,
    on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 },
    social_sentiment: { twitter_score: 0, reddit_score: 0, overall_score: 0 },
  }

  try {
    const { data, error } = await client
      .from('analyses')
      .insert([analysis])
      .select('id, coin_id')
      .limit(1)

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, inserted: data?.[0] ?? null }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 })
  }
}



