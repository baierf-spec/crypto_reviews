import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(price)
  }
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`
  } else {
    return `$${marketCap.toLocaleString()}`
  }
}

export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}

export function getSentimentColor(sentiment: number): string {
  if (sentiment >= 50) return 'text-crypto-success'
  if (sentiment >= 0) return 'text-crypto-warning'
  return 'text-crypto-danger'
}

export function getEcoColor(eco: number): string {
  if (eco >= 8) return 'text-crypto-success'
  if (eco >= 5) return 'text-crypto-warning'
  return 'text-crypto-danger'
}

export function calculateOverallRating(sentiment: number, onChain: number, eco: number): number
export function calculateOverallRating(ratings: { sentiment: number; onChain: number; eco: number }): number
export function calculateOverallRating(sentimentOrRatings: number | { sentiment: number; onChain: number; eco: number }, onChain?: number, eco?: number): number {
  let sentiment: number
  let onChainScore: number
  let ecoScore: number

  if (typeof sentimentOrRatings === 'object') {
    sentiment = sentimentOrRatings.sentiment
    onChainScore = sentimentOrRatings.onChain
    ecoScore = sentimentOrRatings.eco
  } else {
    sentiment = sentimentOrRatings
    onChainScore = onChain!
    ecoScore = eco!
  }

  const sentimentScore = (sentiment + 100) / 200 * 5 // Convert -100 to 100 to 0 to 5
  const onChainRating = onChainScore / 20 // Convert 0 to 100 to 0 to 5
  const ecoRating = ecoScore / 2 // Convert 1 to 10 to 0.5 to 5
  
  const average = (sentimentScore + onChainRating + ecoRating) / 3
  return Math.round(average * 2) / 2 // Round to nearest 0.5
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`
}
