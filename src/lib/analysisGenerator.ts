import OpenAI from 'openai'
import { Coin } from '@/types'
import { calculateOverallRating } from '@/lib/utils'
import { getOnChainData, getEcoData, getSocialSentiment } from '@/lib/apis'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)

export async function buildAnalysisFromCoin(coin: Coin) {
  const [onChainData, ecoRating, sentimentData] = await Promise.all([
    getOnChainData(coin.id),
    getEcoData(coin.id),
    getSocialSentiment(coin.id),
  ])

  const overallRating = calculateOverallRating(
    sentimentData.overall_score,
    onChainData.network_growth,
    ecoRating
  )

  const prompt = `Analyze ${coin.name} (${coin.symbol}) cryptocurrency:\n\n` +
    `Current Price: $${coin.current_price}\n` +
    `Market Cap: $${coin.market_cap.toLocaleString()}\n` +
    `24h Change: ${coin.price_change_percentage_24h}%\n\n` +
    `On-Chain Data:\n` +
    `- 24h Transactions: ${onChainData.transactions_24h.toLocaleString()}\n` +
    `- Whale Activity: ${onChainData.whale_activity}\n` +
    `- Network Growth: ${onChainData.network_growth}%\n\n` +
    `Social Sentiment:\n` +
    `- Twitter Score: ${sentimentData.twitter_score}\n` +
    `- Reddit Score: ${sentimentData.reddit_score}\n` +
    `- Overall Sentiment: ${sentimentData.overall_score}\n\n` +
    `Environmental Rating: ${ecoRating}/10\n\n` +
    `Please provide a comprehensive 1000-word analysis including sections for market position, technical analysis, on-chain activity, sentiment, environmental impact, price predictions, risk assessment, and overall recommendation. Make it engaging and SEO-friendly.`

  let content: string
  if (!hasOpenAIKey) {
    content = `Mock Analysis for ${coin.name} (${coin.symbol})\n\n` +
      `Price: $${coin.current_price}. Market cap: $${coin.market_cap.toLocaleString()}. 24h change: ${coin.price_change_percentage_24h}%.\n` +
      `On-chain: ${onChainData.network_growth}% growth, whale activity ${onChainData.whale_activity}, ` +
      `${onChainData.transactions_24h.toLocaleString()} tx in 24h.\n` +
      `Sentiment: overall ${sentimentData.overall_score}.\n\n` +
      `Short-term: Consolidation with volatility. Medium-term: Depends on liquidity/macros. Long-term: Adoption-driven.\n` +
      `(Generated without OpenAI key.)`
  } else {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional cryptocurrency analyst.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })
      content = completion.choices[0]?.message?.content || 'Analysis generation failed.'
    } catch (err) {
      console.error('OpenAI generation failed, using mock:', err)
      content = `Mock Analysis for ${coin.name} (${coin.symbol}). OpenAI call failed.\n` +
        `Market context and on-chain/sentiment summaries are provided as placeholders.`
    }
  }

  // --- Heuristic price predictions (lightweight model) ---
  const currentPrice = coin.current_price
  const normalize = (n: number, min: number, max: number) => (n - min) / (max - min)
  const sentimentFactor = (sentimentData.overall_score || 0) / 100 // -1..1
  const onchainFactor = normalize(onChainData.network_growth || 50, 0, 100) - 0.5 // -0.5..0.5
  const ecoFactor = (ecoRating - 5) / 10 // roughly -0.5..0.5

  // base move expectations per horizon
  const baseShort = 0.02 // 2%
  const baseMedium = 0.05 // 5%
  const baseLong = 0.10 // 10%

  // combine signals (bounded)
  const signal = Math.max(-1, Math.min(1, sentimentFactor * 0.6 + onchainFactor * 0.3 + ecoFactor * 0.1))

  const pctShort = baseShort * (1 + signal)
  const pctMedium = baseMedium * (1 + signal)
  const pctLong = baseLong * (1 + signal)

  const pred = (pct: number) => {
    const target = currentPrice * (1 + pct)
    const band = pct * 0.5
    return {
      pct: Math.round(pct * 10000) / 100, // to % with 2 decimals
      target,
      low: currentPrice * (1 + pct - band),
      high: currentPrice * (1 + pct + band),
    }
  }

  const pricePrediction = {
    short_term: pred(pctShort),
    medium_term: pred(pctMedium),
    long_term: pred(pctLong),
    confidence: Math.round((Math.abs(signal) * 0.6 + 0.4) * 100) / 100,
    currency: 'USD',
  }

  return {
    id: `analysis_${Date.now()}`,
    coin_id: coin.id,
    coin_name: coin.name,
    coin_symbol: coin.symbol,
    content,
    date: new Date().toISOString(),
    ratings: {
      sentiment: sentimentData.overall_score,
      onChain: onChainData.network_growth,
      eco: ecoRating,
      overall: overallRating,
    },
    price_prediction: pricePrediction,
    on_chain_data: onChainData,
    social_sentiment: sentimentData,
  }
}


