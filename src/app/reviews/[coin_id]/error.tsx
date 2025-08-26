'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Client error in coin review route:', error)
  }, [error])

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
    </div>
  )
}


