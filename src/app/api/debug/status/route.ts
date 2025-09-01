import { NextResponse } from 'next/server'

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    environment: {
      hasCoinMarketCapKey: !!process.env.COINMARKETCAP_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
    apis: {
      coinMarketCap: null as any,
      supabase: null as any,
      coinGecko: null as any,
    }
  }

  // Test CoinMarketCap API
  try {
    const cmcResponse = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1&convert=USD',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY || 'demo',
          'Accept': 'application/json',
        },
      }
    )
    status.apis.coinMarketCap = {
      status: cmcResponse.status,
      ok: cmcResponse.ok,
      error: cmcResponse.ok ? null : await cmcResponse.text().catch(() => 'Failed to read error')
    }
  } catch (error) {
    status.apis.coinMarketCap = {
      status: 'error',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Test CoinGecko API
  try {
    const cgResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )
    status.apis.coinGecko = {
      status: cgResponse.status,
      ok: cgResponse.ok,
      error: cgResponse.ok ? null : await cgResponse.text().catch(() => 'Failed to read error')
    }
  } catch (error) {
    status.apis.coinGecko = {
      status: 'error',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Test Supabase connection
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    
    const { data, error } = await supabase
      .from('analyses')
      .select('count')
      .limit(1)
    
    status.apis.supabase = {
      status: error ? 'error' : 'ok',
      ok: !error,
      error: error?.message || null,
      hasData: !!data
    }
  } catch (error) {
    status.apis.supabase = {
      status: 'error',
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return NextResponse.json(status)
}




