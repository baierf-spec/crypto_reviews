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

  const prompt = `Write a professional, objective cryptocurrency report in polished Markdown for ${coin.name} (${coin.symbol}).

Tone & style:
- Executive, concise sentences, no hype, avoid repetition.
- Use clear section headings and short paragraphs (2–3 lines each).
- Prefer bullet points for lists; include numbers where relevant.

Structure (use these headings exactly):
1. Executive Summary
   - 2–3 bullets with the key takeaway, directional view (bullish/neutral/bearish), and major risks.
2. Key Metrics
   - A compact table with: Current Price, Market Cap, 24h Change, 24h Tx, Whale Activity, Network Growth, Twitter Score, Reddit Score, Eco Rating.
3. Market Position
4. Technical Overview
5. On‑Chain Activity
6. Social Sentiment
7. Environmental Impact
8. Price Outlook
   - Short, Medium, Long term bullet targets aligned with provided predictions.
9. Risks
10. Bottom Line

Additionally include a short appendix with:
- Technical Analysis snapshot: RSI(14), MACD(12,26,9), 50/200-day MAs, Bollinger Bands context.
- Sentiment & Social: aggregated score (−100..100), breakdown (positive/neutral/negative %), top hashtags and mentions.
- Price Prediction scenarios: Bullish/Neutral/Bearish with percentage change targets and probabilities for 1 week and 1 month.

Facts you must use:
- Current Price: $${coin.current_price}
- Market Cap: $${coin.market_cap.toLocaleString()}
- 24h Change: ${coin.price_change_percentage_24h}%
- On‑chain: ${onChainData.transactions_24h.toLocaleString()} tx (24h), whale activity ${onChainData.whale_activity}, network growth ${onChainData.network_growth}%
- Sentiment: Twitter ${sentimentData.twitter_score}, Reddit ${sentimentData.reddit_score}, Overall ${sentimentData.overall_score}
- Environmental Rating: ${ecoRating}/10

Formatting rules:
- Use h2 (##) for main sections; bold labels for key numbers.
- Use a tidy Markdown table for Key Metrics. Do not wrap numbers in code blocks.
- Avoid speculative claims; tie claims to the numbers given.
`

  let content: string
  if (!hasOpenAIKey) {
    content = `## Executive Summary\n\n` +
      `- ${coin.name} shows ${sentimentData.overall_score >= 10 ? 'a cautiously bullish' : sentimentData.overall_score <= -10 ? 'a cautious bearish' : 'a neutral'} setup with notable ${onChainData.network_growth}% network growth.\n` +
      `- Key risks: sentiment swings (${sentimentData.twitter_score} Twitter), liquidity, and macro.\n` +
      `- Eco rating ${ecoRating}/10.\n\n` +
      `## Key Metrics\n` +
      `| Metric | Value |\n|---|---|\n` +
      `| Current Price | $${coin.current_price} |\n` +
      `| Market Cap | $${coin.market_cap.toLocaleString()} |\n` +
      `| 24h Change | ${coin.price_change_percentage_24h}% |\n` +
      `| 24h Tx | ${onChainData.transactions_24h.toLocaleString()} |\n` +
      `| Whale Activity | ${onChainData.whale_activity} |\n` +
      `| Network Growth | ${onChainData.network_growth}% |\n` +
      `| Twitter | ${sentimentData.twitter_score} |\n` +
      `| Reddit | ${sentimentData.reddit_score} |\n` +
      `| Eco | ${ecoRating}/10 |\n\n` +
      `## Market Position\n` +
      `${coin.name} remains a prominent asset with active volumes and broad recognition.\n\n` +
      `## Technical Overview\n` +
      `Price is in a ${coin.price_change_percentage_24h >= 0 ? 'constructive' : 'corrective'} short‑term phase. \n\n` +
      `## On‑Chain Activity\n` +
      `Transactions and growth suggest steady network usage; whale activity is ${onChainData.whale_activity.toLowerCase()}.\n\n` +
      `## Social Sentiment\n` +
      `Mixed signals: Twitter ${sentimentData.twitter_score}, Reddit ${sentimentData.reddit_score}.\n\n` +
      `## Environmental Impact\n` +
      `Eco rating ${ecoRating}/10 indicates ${ecoRating >= 8 ? 'excellent' : ecoRating >= 5 ? 'moderate' : 'higher'} footprint.\n\n` +
      `## Price Outlook\n` +
      `Short and medium term depend on liquidity and sentiment; long term on adoption.\n\n` +
      `## Risks\n` +
      `Volatility, regulation, liquidity shocks.\n\n` +
      `## Bottom Line\n` +
      `Balanced view with clear catalysts and risks. (Mock content without OpenAI key.)`
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


