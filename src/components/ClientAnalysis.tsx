'use client'

import { useEffect, useState } from 'react'
import AnalysisMarkdown from '@/components/AnalysisMarkdown'

type LocalAnalysis = {
  id: string
  coin_id: string
  coin_name: string
  content: string
  content_format?: 'html' | 'md'
  date?: string
}

export default function ClientAnalysis({ coinId }: { coinId: string }) {
  const [analysis, setAnalysis] = useState<LocalAnalysis | any | null>(null)
  const [isLocalPreview, setIsLocalPreview] = useState(false)
  const [dbAvailable, setDbAvailable] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`analysis:${coinId}`)
      if (raw) {
        const obj = JSON.parse(raw)
        setAnalysis(obj)
        setIsLocalPreview(true)
      }
    } catch (_) {}
  }, [coinId])

  // Poll server for the saved analysis; switch once available
  useEffect(() => {
    let cancelled = false
    if (!isLocalPreview) return
    const start = Date.now()
    let attempts = 0
    const maxAttempts = 10 // Try for 30 seconds total (10 attempts * 3 seconds)
    
    async function poll() {
      try {
        attempts++
        const res = await fetch(`/api/analyses/${encodeURIComponent(coinId)}`)
        if (res && res.ok) {
          const json = await res.json()
          if (!cancelled && json?.data) {
            setAnalysis(json.data)
            setIsLocalPreview(false)
            setDbAvailable(true)
            try { localStorage.removeItem(`analysis:${coinId}`) } catch (_) {}
            return
          }
        } else if (res.status === 404) {
          // Analysis not found in database - might be a save failure
          console.log('Analysis not found in database, keeping local preview')
          setDbAvailable(false)
        }
      } catch (error) {
        console.log('Database polling failed:', error)
        setDbAvailable(false)
      }
      
      // Stop polling after max attempts or if cancelled
      if (!cancelled && attempts < maxAttempts && Date.now() - start < 60000) {
        setTimeout(poll, 3000)
      } else if (attempts >= maxAttempts) {
        console.log('Max polling attempts reached, keeping local preview')
        setDbAvailable(false)
      }
    }
    poll()
    return () => { cancelled = true }
  }, [coinId, isLocalPreview])

  if (!analysis) return null

  const isHtml = (analysis as any).content_format === 'html'

  return (
    <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg mt-4">
      {isLocalPreview && (
        <div className={`mb-2 text-xs ${dbAvailable ? 'text-yellow-400' : 'text-orange-400'}`}>
          {dbAvailable 
            ? "This is a freshly generated local preview. It will be saved to the server shortly."
            : "This is a local preview. Database connection unavailable - analysis saved locally only."
          }
        </div>
      )}
      {isHtml ? (
        (() => {
          const raw = (analysis as any).content as string
          const cleaned = (() => {
            try { return raw.replace(/<h2[^>]*>\s*Key Metrics\s*<\/h2>[\s\S]*?(?=<h2|$)/i, '') } catch { return raw }
          })()
          return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: cleaned }} />
        })()
      ) : (
        <AnalysisMarkdown content={(analysis as any).content} />
      )}
    </div>
  )
}


