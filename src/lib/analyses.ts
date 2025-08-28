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

// Initialize with sample analyses
const sampleAnalyses: Analysis[] = [
  {
    id: '1',
    coin_id: 'bitcoin',
    coin_name: 'Bitcoin',
    coin_symbol: 'BTC',
    content: 'Bitcoin continues to demonstrate strong fundamentals with increasing institutional adoption. The recent ETF approvals have provided significant market validation, while on-chain metrics show healthy accumulation patterns. Network security remains robust with hash rate at all-time highs. However, environmental concerns persist, though many mining operations are transitioning to renewable energy sources.',
    date: new Date().toISOString(),
    ratings: {
      sentiment: 75,
      onChain: 85,
      eco: 45,
      overall: 78
    },
    price_prediction: {
      short_term: { pct: 5, target: 115000, low: 105000, high: 125000 },
      medium_term: { pct: 15, target: 130000, low: 110000, high: 150000 },
      long_term: { pct: 35, target: 180000, low: 140000, high: 220000 },
      confidence: 0.75,
      currency: 'USD'
    },
    on_chain_data: {
      transactions_24h: 450000,
      whale_activity: 'High',
      network_growth: 12
    },
    social_sentiment: {
      twitter_score: 78,
      reddit_score: 82,
      overall_score: 80
    }
  },
  {
    id: '2',
    coin_id: 'ethereum',
    coin_name: 'Ethereum',
    coin_symbol: 'ETH',
    content: 'Ethereum shows promising developments with the successful transition to Proof of Stake significantly reducing energy consumption. DeFi ecosystem continues to expand with growing TVL and innovative protocols. Layer 2 solutions are gaining traction, improving scalability and reducing gas fees. The upcoming upgrades promise further improvements in performance and user experience.',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    ratings: {
      sentiment: 82,
      onChain: 90,
      eco: 85,
      overall: 84
    },
    price_prediction: {
      short_term: { pct: 8, target: 4800, low: 4400, high: 5200 },
      medium_term: { pct: 20, target: 5500, low: 4800, high: 6200 },
      long_term: { pct: 45, target: 7500, low: 6000, high: 9000 },
      confidence: 0.80,
      currency: 'USD'
    },
    on_chain_data: {
      transactions_24h: 1200000,
      whale_activity: 'Medium',
      network_growth: 18
    },
    social_sentiment: {
      twitter_score: 85,
      reddit_score: 88,
      overall_score: 86
    }
  },
  {
    id: '3',
    coin_id: 'solana',
    coin_name: 'Solana',
    coin_symbol: 'SOL',
    content: 'Solana demonstrates impressive technical performance with high transaction throughput and low fees. The ecosystem is rapidly expanding with numerous DeFi and NFT projects. However, network stability concerns remain, with occasional outages affecting user confidence. The team is actively working on improving reliability while maintaining performance advantages.',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    ratings: {
      sentiment: 65,
      onChain: 70,
      eco: 60,
      overall: 68
    },
    price_prediction: {
      short_term: { pct: 12, target: 110, low: 95, high: 125 },
      medium_term: { pct: 25, target: 130, low: 110, high: 150 },
      long_term: { pct: 50, target: 180, low: 140, high: 220 },
      confidence: 0.65,
      currency: 'USD'
    },
    on_chain_data: {
      transactions_24h: 2500000,
      whale_activity: 'Low',
      network_growth: 25
    },
    social_sentiment: {
      twitter_score: 72,
      reddit_score: 68,
      overall_score: 70
    }
  },
  {
    id: '4',
    coin_id: 'cardano',
    coin_name: 'Cardano',
    coin_symbol: 'ADA',
    content: 'Cardano continues its methodical development approach with peer-reviewed research and academic rigor. The platform emphasizes sustainability and scalability through its Ouroboros consensus mechanism. Recent smart contract capabilities have opened new possibilities for DeFi and NFT development. However, adoption has been slower compared to competitors.',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    ratings: {
      sentiment: 55,
      onChain: 60,
      eco: 80,
      overall: 62
    },
    price_prediction: {
      short_term: { pct: 3, target: 0.48, low: 0.45, high: 0.52 },
      medium_term: { pct: 15, target: 0.55, low: 0.48, high: 0.62 },
      long_term: { pct: 30, target: 0.70, low: 0.55, high: 0.85 },
      confidence: 0.60,
      currency: 'USD'
    },
    on_chain_data: {
      transactions_24h: 180000,
      whale_activity: 'Medium',
      network_growth: 8
    },
    social_sentiment: {
      twitter_score: 65,
      reddit_score: 70,
      overall_score: 67
    }
  },
  {
    id: '5',
    coin_id: 'polkadot',
    coin_name: 'Polkadot',
    coin_symbol: 'DOT',
    content: 'Polkadot\'s innovative parachain architecture enables true interoperability between different blockchains. The ecosystem is growing with active parachain auctions and development. The platform\'s focus on governance and upgradeability provides long-term sustainability. However, complexity may limit mainstream adoption in the short term.',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    ratings: {
      sentiment: 70,
      onChain: 75,
      eco: 70,
      overall: 72
    },
    price_prediction: {
      short_term: { pct: 6, target: 8.5, low: 7.8, high: 9.2 },
      medium_term: { pct: 18, target: 10.0, low: 8.5, high: 11.5 },
      long_term: { pct: 40, target: 14.0, low: 11.0, high: 17.0 },
      confidence: 0.70,
      currency: 'USD'
    },
    on_chain_data: {
      transactions_24h: 95000,
      whale_activity: 'High',
      network_growth: 15
    },
    social_sentiment: {
      twitter_score: 75,
      reddit_score: 78,
      overall_score: 76
    }
  }
]

// Initialize storage with sample data
sampleAnalyses.forEach(analysis => {
  analysesStorage.set(analysis.coin_id, analysis)
})

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
