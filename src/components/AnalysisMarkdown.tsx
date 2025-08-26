'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PluggableList } from 'unified'

export default function AnalysisMarkdown({ content }: { content: string }) {
  // Cast to PluggableList to avoid type conflicts between transitive vfile versions on Vercel
  const plugins: PluggableList = [remarkGfm as unknown as any]
  return (
    <div className="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-p:text-gray-200 prose-strong:text-white prose-li:my-1">
      <ReactMarkdown remarkPlugins={plugins}>{content}</ReactMarkdown>
    </div>
  )}


