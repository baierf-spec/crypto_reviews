'use client'

import React, { type PropsWithChildren, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import type { PluggableList } from 'unified'

class MarkdownErrorBoundary extends React.Component<PropsWithChildren<{ fallback: React.ReactNode }>, { hasError: boolean }> {
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

  // Convert compact single-line pipe metrics into a proper Markdown table
  function normalizeInlineMetrics(md: string): string {
    try {
      return md.replace(/^[|]\s*([^\n]+?)\s*[|]\s*$/gm, (line: string, inside: string) => {
        const cells = inside
          .split('|')
          .map((c: string) => c.trim())
          .filter(Boolean)
        if (cells.length < 4) return line
        const rows: string[] = []
        for (let i = 0; i < cells.length - 1; i += 2) {
          rows.push(`| ${cells[i]} | ${cells[i + 1]} |`)
        }
        return ['| Metric | Value |', '| --- | --- |', ...rows].join('\n')
      })
    } catch {
      return md
    }
  }

  const normalizedContent = useMemo(() => normalizeInlineMetrics(content), [content])

  // Apply Tailwind styles to markdown tables
  const components: Partial<Components> = {
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border-separate border-spacing-0" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-transparent" {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr className="border-t border-white/10" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="px-3 py-2 text-left text-gray-300" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="px-3 py-2 text-white/90" {...props} />
    ),
  }
  const fallback = (
    <div className="text-gray-300 whitespace-pre-wrap break-words">
      {content}
    </div>
  )
  return (
    <div className="prose prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-p:text-gray-200 prose-strong:text-white prose-li:my-1 prose-a:text-crypto-accent hover:prose-a:text-crypto-accent/80 prose-pre:bg-black/40 prose-img:rounded-md">
      <MarkdownErrorBoundary fallback={fallback}>
        <ReactMarkdown remarkPlugins={plugins} components={components}>
          {normalizedContent}
        </ReactMarkdown>
      </MarkdownErrorBoundary>
    </div>
  )}


