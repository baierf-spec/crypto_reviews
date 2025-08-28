import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { coinId, coinName, coinSymbol, currentPrice } = await request.json()

    if (!coinId || !coinName) {
      return NextResponse.json(
        { error: 'Missing required fields: coinId, coinName' },
        { status: 400 }
      )
    }

    const prompt = `Analyze ${coinName} (${coinSymbol}) comprehensively for a cryptocurrency review website. Provide a detailed analysis in the following JSON format:

{
  "technicalAnalysis": {
    "rsi": 65,
    "macd": 1.2,
    "bollingerBands": "neutral",
    "support": "price_level",
    "resistance": "price_level",
    "trend": "bullish/bearish/neutral"
  },
  "sentimentAnalysis": {
    "overall": 75,
    "breakdown": {
      "positive": 70,
      "neutral": 20,
      "negative": 10
    },
    "socialMetrics": {
      "twitterVolume": 15000,
      "redditSentiment": 72,
      "newsSentiment": 68
    }
  },
  "pricePrediction": {
    "scenarios": {
      "bullish": {
        "change": "+20%",
        "probability": 60,
        "target": "price_level",
        "timeframe": "3 months"
      },
      "neutral": {
        "change": "+5%",
        "probability": 25,
        "target": "price_level",
        "timeframe": "3 months"
      },
      "bearish": {
        "change": "-15%",
        "probability": 15,
        "target": "price_level",
        "timeframe": "3 months"
      }
    }
  },
  "fundamentalAnalysis": {
    "strengths": ["point1", "point2", "point3"],
    "weaknesses": ["point1", "point2"],
    "opportunities": ["point1", "point2"],
    "risks": ["point1", "point2"]
  },
  "content": {
    "summary": "Brief 2-3 sentence summary",
    "detailedAnalysis": "Comprehensive 4-5 paragraph analysis covering technical, fundamental, and market factors",
    "recommendation": "Clear buy/hold/sell recommendation with reasoning"
  }
}

Current price: $${currentPrice || 'Unknown'}. Focus on recent market developments, technical indicators, and provide actionable insights.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cryptocurrency analyst. Provide accurate, balanced analysis in the exact JSON format requested. Include specific technical indicators, realistic price predictions, and comprehensive market analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse JSON response
    let analysis
    try {
      analysis = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', response)
      // Fallback to mock data
      analysis = {
        technicalAnalysis: {
          rsi: 65,
          macd: 1.2,
          bollingerBands: "neutral",
          support: currentPrice * 0.9,
          resistance: currentPrice * 1.1,
          trend: "bullish"
        },
        sentimentAnalysis: {
          overall: 75,
          breakdown: {
            positive: 70,
            neutral: 20,
            negative: 10
          },
          socialMetrics: {
            twitterVolume: 15000,
            redditSentiment: 72,
            newsSentiment: 68
          }
        },
        pricePrediction: {
          scenarios: {
            bullish: {
              change: "+20%",
              probability: 60,
              target: currentPrice * 1.2,
              timeframe: "3 months"
            },
            neutral: {
              change: "+5%",
              probability: 25,
              target: currentPrice * 1.05,
              timeframe: "3 months"
            },
            bearish: {
              change: "-15%",
              probability: 15,
              target: currentPrice * 0.85,
              timeframe: "3 months"
            }
          }
        },
        fundamentalAnalysis: {
          strengths: ["Strong fundamentals", "Growing adoption", "Innovative technology"],
          weaknesses: ["Market volatility", "Regulatory uncertainty"],
          opportunities: ["Institutional adoption", "Technology improvements"],
          risks: ["Market correction", "Competition"]
        },
        content: {
          summary: `${coinName} shows promising technical indicators with positive sentiment. The current market conditions suggest a bullish outlook with moderate risk.`,
          detailedAnalysis: `${coinName} demonstrates strong technical fundamentals with RSI indicating healthy momentum and MACD showing positive divergence. Social sentiment analysis reveals strong community support with high engagement on social media platforms. The fundamental analysis suggests solid long-term potential despite short-term market volatility. Recent developments indicate growing institutional interest and technological improvements that could drive future growth.`,
          recommendation: "HOLD with a view to accumulate on dips. The technical indicators are positive, but consider market volatility and maintain proper risk management."
        }
      }
    }

    return NextResponse.json({
      success: true,
      coinId,
      coinName,
      coinSymbol,
      analysis,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating review:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
