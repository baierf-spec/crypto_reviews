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
    price_prediction: {
      short_term: 'Analysis includes short-term prediction',
      medium_term: 'Analysis includes medium-term prediction',
      long_term: 'Analysis includes long-term prediction',
    },
    on_chain_data: onChainData,
    social_sentiment: sentimentData,
  }
}


