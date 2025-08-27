import { MetadataRoute } from 'next'
import { getTopCoins } from '@/lib/apis'
import { getAllAnalysesFromMemory } from '@/lib/analyses'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use canonical domain in production to avoid stale env var values
  const canonical = 'https://www.crypto-ai-insights.com'
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  const resolved = isProd ? canonical : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  const baseUrl = resolved.replace(/\/$/, '')
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // Home with trailing slash
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Get all analyses from memory
  const analyses = getAllAnalysesFromMemory()
  
  // Create sitemap entries for each analysis
  const analysisPages = analyses.map((analysis) => ({
    url: `${baseUrl}/${analysis.coin_id}/price-prediction/`,
    lastModified: new Date(analysis.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Get top coins for additional pages (even without analysis)
  let coinPages: MetadataRoute.Sitemap = []
  try {
    const topCoins = await getTopCoins(100) // Get top 100 coins
    coinPages = topCoins.map((coin) => ({
      url: `${baseUrl}/${coin.id}/price-prediction/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching top coins for sitemap:', error)
  }

  return [...staticPages, ...analysisPages, ...coinPages]
}
