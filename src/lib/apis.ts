import { Coin } from '@/types'

// CoinMarketCap API functions (better than CoinGecko)
const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY || 'demo'
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1'

// Get top coins from CoinMarketCap (up to 5000)
export async function getTopCoins(limit: number = 5000): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/listings/latest?limit=${limit}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform CoinMarketCap data to our format
    return data.data.map((coin: any) => ({
      id: coin.slug, // Use slug as ID for better URLs
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      total_volume: coin.quote.USD.volume_24h,
      price_change_percentage_24h: coin.quote.USD.percent_change_24h,
      high_24h: coin.quote.USD.high_24h,
      low_24h: coin.quote.USD.low_24h,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      market_cap_rank: coin.cmc_rank,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
    }))
  } catch (error) {
    console.error('Error fetching top coins from CoinMarketCap:', error)
    // Fallback to CoinGecko if CoinMarketCap fails
    return await getTopCoinsFallback(limit)
  }
}

// Fallback to CoinGecko API
async function getTopCoinsFallback(limit: number = 1000): Promise<Coin[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&locale=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top coins from CoinGecko:', error)
    return []
  }
}

// Search coins by name or symbol
export async function searchCoins(query: string, limit: number = 100): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/map?search=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinMarketCap search API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Get detailed data for found coins
    const coinIds = data.data.map((coin: any) => coin.id).join(',')
    const detailedResponse = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/quotes/latest?id=${coinIds}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    )

    if (!detailedResponse.ok) {
      throw new Error(`CoinMarketCap quotes API error: ${detailedResponse.status}`)
    }

    const detailedData = await detailedResponse.json()
    
    return Object.values(detailedData.data).map((coin: any) => ({
      id: coin.slug,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      total_volume: coin.quote.USD.volume_24h,
      price_change_percentage_24h: coin.quote.USD.percent_change_24h,
      high_24h: coin.quote.USD.high_24h,
      low_24h: coin.quote.USD.low_24h,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      market_cap_rank: coin.cmc_rank,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
    }))
  } catch (error) {
    console.error('Error searching coins:', error)
    // Fallback to local search
    const allCoins = await getTopCoins(1000)
    return allCoins.filter(coin =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }
}

export async function getCoinData(coinId: string): Promise<Coin | null> {
  try {
    // Try CoinMarketCap first
    const response = await fetch(
      `${CMC_BASE_URL}/cryptocurrency/quotes/latest?slug=${coinId}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      const coin = Object.values(data.data)[0] as any
      
      return {
        id: coin.slug,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.quote.USD.price,
        market_cap: coin.quote.USD.market_cap,
        total_volume: coin.quote.USD.volume_24h,
        price_change_percentage_24h: coin.quote.USD.percent_change_24h,
        high_24h: coin.quote.USD.high_24h,
        low_24h: coin.quote.USD.low_24h,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        market_cap_rank: coin.cmc_rank,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
      }
    }
  } catch (error) {
    console.error('Error fetching coin data from CoinMarketCap:', error)
  }

  // Fallback to CoinGecko
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&locale=en`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0] || null
  } catch (error) {
    console.error('Error fetching coin data from CoinGecko:', error)
    return null
  }
}

export async function getCoinPriceHistory(coinId: string, days: number = 7): Promise<any> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching price history:', error)
    return null
  }
}

// Mock on-chain data (replace with actual Dune Analytics API)
export async function getOnChainData(coinId: string): Promise<any> {
  // Mock data - replace with actual Dune Analytics API call
  return {
    transactions_24h: Math.floor(Math.random() * 1000000) + 100000,
    whale_activity: Math.random() > 0.5 ? 'High' : 'Low',
    network_growth: Math.floor(Math.random() * 100) + 1,
  }
}

// Mock eco data (replace with actual Cambridge Index API)
export async function getEcoData(coinId: string): Promise<number> {
  // Mock eco rating 1-10 - replace with actual Cambridge Index API call
  return Math.floor(Math.random() * 10) + 1
}

// Mock sentiment data (replace with actual social media APIs)
export async function getSocialSentiment(coinId: string): Promise<any> {
  // Mock sentiment scores - replace with actual social media API calls
  return {
    twitter_score: Math.floor(Math.random() * 200) - 100, // -100 to 100
    reddit_score: Math.floor(Math.random() * 200) - 100, // -100 to 100
    overall_score: Math.floor(Math.random() * 200) - 100, // -100 to 100
  }
}

// OpenAI API for content generation
export async function generateAnalysis(coinData: Coin): Promise<string> {
  try {
    const response = await fetch('/api/generate-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coin_id: coinData.id,
        coin_name: coinData.name,
        coin_symbol: coinData.symbol,
        current_price: coinData.current_price,
        market_cap: coinData.market_cap,
        price_change_24h: coinData.price_change_percentage_24h,
      }),
    })

    if (!response.ok) {
      throw new Error(`Analysis generation error: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  } catch (error) {
    console.error('Error generating analysis:', error)
    return 'Analysis generation failed. Please try again later.'
  }
}

// Cache management
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

// Rate limiting
const rateLimitMap = new Map()

export function isRateLimited(key: string, limit: number = 100, window: number = 60000): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(key) || []
  
  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp: number) => now - timestamp < window)
  
  if (validRequests.length >= limit) {
    return true
  }
  
  validRequests.push(now)
  rateLimitMap.set(key, validRequests)
  return false
}
