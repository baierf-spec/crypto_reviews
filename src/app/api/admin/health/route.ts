import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE

  const env = {
    has_url: Boolean(url),
    has_anon: Boolean(anon),
    has_service: Boolean(service),
  }

  if (!url || !service) {
    return NextResponse.json({ ok: false, env, error: 'Missing URL or service role key' }, { status: 200 })
  }

  const client = createClient(url, service)
  let canRead = false
  let canWrite = false
  let lastWrite: string | null = null
  let error: string | null = null

  try {
    const { count } = await client.from('analyses').select('id', { count: 'exact', head: true })
    canRead = typeof count === 'number'
  } catch (e: any) {
    error = e?.message || 'read_failed'
  }

  try {
    const ping = { coin_id: `health_${Date.now()}`, coin_name: 'Health Check', coin_symbol: 'HLTH', content: 'ok', date: new Date().toISOString(), ratings: { sentiment: 0, onChain: 0, eco: 0, overall: 0 }, price_prediction: null, on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 }, social_sentiment: { twitter_score: 0, reddit_score: 0, overall_score: 0 } }
    const { error: insErr } = await client.from('analyses').insert([ping])
    canWrite = !insErr
    if (!insErr) {
      lastWrite = ping.date
    }
  } catch (e: any) {
    error = error || e?.message || 'write_failed'
  }

  return NextResponse.json({ ok: canRead && canWrite, env, canRead, canWrite, lastWrite, error })
}


