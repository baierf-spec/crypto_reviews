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
  const [analysis, setAnalysis] = useState<LocalAnalysis | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`analysis:${coinId}`)
      if (raw) {
        const obj = JSON.parse(raw)
        setAnalysis(obj)
      }
    } catch (_) {}
  }, [coinId])

  if (!analysis) return null

  const isHtml = (analysis as any).content_format === 'html'

  return (
    <div className="bg-crypto-secondary/50 rounded-lg p-6 shadow-lg mt-4">
      <div className="mb-2 text-xs text-yellow-400">This is a freshly generated local preview. It will be saved to the server shortly.</div>
      {isHtml ? (
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: (analysis as any).content }} />
      ) : (
        <AnalysisMarkdown content={analysis.content} />
      )}
    </div>
  )
}


