import { NextRequest, NextResponse } from 'next/server'
import { getCoinData } from '@/lib/apis'
import { getAnalysisByCoinId, saveAnalysis } from '@/lib/supabase'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1) Fetch full coin list from CoinGecko
    const listRes = await fetch('https://api.coingecko.com/api/v3/coins/list', { cache: 'no-store' })
    if (!listRes.ok) return NextResponse.json({ error: 'Failed to fetch coins list' }, { status: 500 })
    const allCoins: Array<{ id: string; symbol: string; name: string }> = await listRes.json()

    // Shuffle for randomness
    const shuffled = allCoins.sort(() => Math.random() - 0.5)

    // 2) Pick up to 100 coins without existing reviews
    const selected: string[] = []
    for (const c of shuffled) {
      if (selected.length >= 100) break
      try {
        const exists = await getAnalysisByCoinId(c.id)
        if (!exists) selected.push(c.id)
      } catch (_) {
        // assume not existing when read fails
        selected.push(c.id)
      }
    }
    
    const results = []
    
    // OpenAI client for short review text
    const openaiKey = process.env.OPENAI_API_KEY
    const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null

    for (const coinId of selected) {
      try {
        const coin = await getCoinData(coinId)
        if (!coin) {
          results.push({ coin_id: coinId, status: 'failed', error: 'coin_not_found' })
          continue
        }

        // 3) Short AI-based review
        let review = `Basic review for ${coin.name} (${coin.symbol}).`
        if (openai) {
          try {
            const prompt = `Write a 4-6 sentence objective crypto review with: name, symbol, short description, market sentiment (bullish/neutral/bearish), and risk level (low/medium/high). Coin: ${coin.name} (${coin.symbol}).`
            const resp = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              temperature: 0.5,
              max_tokens: 180,
              messages: [
                { role: 'system', content: 'You write concise, neutral crypto reviews.' },
                { role: 'user', content: prompt },
              ],
            })
            review = resp.choices[0]?.message?.content?.trim() || review
          } catch (_) {}
        }

        const analysis = {
          id: `daily_${Date.now()}_${coin.id}`,
          coin_id: coin.id,
          coin_name: coin.name,
          coin_symbol: coin.symbol,
          content: review,
          date: new Date().toISOString(),
          ratings: { sentiment: 0, onChain: 0, eco: 5, overall: 3 },
          price_prediction: null,
          on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 },
          social_sentiment: { twitter_score: 0, reddit_score: 0, overall_score: 0 },
        }

        await saveAnalysis(analysis as any)

        results.push({ coin_id: coin.id, status: 'success', analysis_id: analysis.id })
      } catch (error) {
        console.error(`Error processing coin ${coinId}:`, error)
        results.push({
          coin_id: coinId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${results.filter(r => r.status==='success').length} reviews, skipped ${selected.length - results.filter(r => r.status==='success').length}`,
      results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}

// Also allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Daily reviews cron job endpoint',
    timestamp: new Date().toISOString()
  })
}
