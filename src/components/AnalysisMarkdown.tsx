'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PluggableList } from 'unified'

class MarkdownErrorBoundary extends React.Component<{ fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: any) {
    console.error('Markdown render error:', error)
  }
  render() {
    if (this.state.hasError) return <>{this.props.fallback}</>
    return this.props.children as React.ReactNode
  }
}

export default function AnalysisMarkdown({ content }: { content: string }) {
  const plugins: PluggableList = [remarkGfm as unknown as any]
  const fallback = (
    <div className="text-gray-300 whitespace-pre-wrap break-words">
      {content}
    </div>
  )
  return (
    <div className="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-p:text-gray-200 prose-strong:text-white prose-li:my-1 prose-a:text-crypto-accent hover:prose-a:text-crypto-accent/80 prose-pre:bg-black/40 prose-img:rounded-md">
      <MarkdownErrorBoundary fallback={fallback}>
        <ReactMarkdown remarkPlugins={plugins}>{content}</ReactMarkdown>
      </MarkdownErrorBoundary>
    </div>
  )}


