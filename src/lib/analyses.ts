// Simple in-memory storage for analyses
// This ensures analyses are available even without Supabase configuration

export interface Analysis {
  id: string
  coin_id: string
  coin_name: string
  coin_symbol: string
  content: string
  date: string
  ratings: {
    sentiment: number
    onChain: number
    eco: number
    overall: number
  }
  price_prediction: {
    short_term: { pct: number; target: number; low: number; high: number }
    medium_term: { pct: number; target: number; low: number; high: number }
    long_term: { pct: number; target: number; low: number; high: number }
    confidence: number
    currency: string
  }
  on_chain_data: {
    transactions_24h: number
    whale_activity: string
    network_growth: number
  }
  social_sentiment: {
    twitter_score: number
    reddit_score: number
    overall_score: number
  }
}

// In-memory storage
const analysesStorage = new Map<string, Analysis>()

export function saveAnalysisToMemory(analysis: Analysis) {
  analysesStorage.set(analysis.coin_id, analysis)
  console.log(`Analysis saved to memory for ${analysis.coin_name} (${analysis.coin_id})`)
}

export function getAnalysisFromMemory(coin_id: string): Analysis | null {
  return analysesStorage.get(coin_id) || null
}

export function getAllAnalysesFromMemory(): Analysis[] {
  return Array.from(analysesStorage.values())
}

export function clearAnalysesFromMemory() {
  analysesStorage.clear()
  console.log('All analyses cleared from memory')
}
