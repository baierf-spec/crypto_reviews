import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { calculateOverallRating } from '@/lib/utils'
import { getOnChainData, getEcoData, getSocialSentiment } from '@/lib/apis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Fetch additional data
    const [onChainData, ecoRating, sentimentData] = await Promise.all([
      getOnChainData(coin_id),
      getEcoData(coin_id),
      getSocialSentiment(coin_id)
    ])

    // Calculate overall rating
    const overallRating = calculateOverallRating(
      sentimentData.overall_score,
      onChainData.network_growth,
      ecoRating
    )

    // Generate AI content
    const prompt = `Analyze ${coin_name} (${coin_symbol}) cryptocurrency:

Current Price: $${current_price}
Market Cap: $${market_cap.toLocaleString()}
24h Change: ${price_change_24h}%

On-Chain Data:
- 24h Transactions: ${onChainData.transactions_24h.toLocaleString()}
- Whale Activity: ${onChainData.whale_activity}
- Network Growth: ${onChainData.network_growth}%

Social Sentiment:
- Twitter Score: ${sentimentData.twitter_score}
- Reddit Score: ${sentimentData.reddit_score}
- Overall Sentiment: ${sentimentData.overall_score}

Environmental Rating: ${ecoRating}/10

Please provide a comprehensive 1000-word analysis including:
1. Current market position and recent performance
2. Technical analysis and key support/resistance levels
3. On-chain activity analysis and what it indicates
4. Social sentiment analysis and community sentiment
5. Environmental impact assessment
6. Price predictions for short-term (1 week), medium-term (1 month), and long-term (3 months)
7. Risk assessment and investment considerations
8. Overall rating and recommendation

Make it engaging, informative, and SEO-friendly. Include specific data points and actionable insights.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional cryptocurrency analyst with expertise in blockchain technology, market analysis, and AI-powered insights. Provide comprehensive, accurate, and engaging analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || 'Analysis generation failed.'

    // Create analysis object
    const analysis = {
      id: `analysis_${Date.now()}`,
      coin_id,
      coin_name,
      coin_symbol,
      content,
      date: new Date().toISOString(),
      ratings: {
        sentiment: sentimentData.overall_score,
        onChain: onChainData.network_growth,
        eco: ecoRating,
        overall: overallRating
      },
      price_prediction: {
        short_term: "Analysis includes short-term prediction",
        medium_term: "Analysis includes medium-term prediction", 
        long_term: "Analysis includes long-term prediction"
      },
      on_chain_data: onChainData,
      social_sentiment: sentimentData
    }

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('Error generating review:', error)
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    )
  }
}
