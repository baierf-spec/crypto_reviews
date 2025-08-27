'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Client error in coin review route:', error)
  }, [error])

  const showDebug = process.env.NEXT_PUBLIC_DEBUG_ERRORS === '1'

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-400 mb-4">A client-side error occurred while rendering this page.</p>
      <button
        className="bg-crypto-accent hover:bg-crypto-accent/90 text-white px-4 py-2 rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
      <p className="text-xs text-gray-500 mt-3">Not financial advice. Experimental features may be unstable.</p>
      {showDebug && (
        <div className="mt-4 max-w-3xl text-left">
          <p className="text-xs text-yellow-400 mb-1">Debug (client only):</p>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words bg-black/30 p-3 rounded">
{`message: ${error?.message || 'n/a'}
digest: ${error?.digest || 'n/a'}`}
          </pre>
        </div>
      )}
    </div>
  )
}




