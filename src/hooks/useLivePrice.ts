"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

export interface LivePriceState {
  price: number | null
  pct: number | null
  isLive: boolean
}

/**
 * Subscribe to Binance 24h ticker for SYMBOLUSDT to get live price and 24h %.
 * Falls back to the provided initial values if websocket is unavailable.
 */
export function useLivePrice(symbol: string | undefined, initialPrice?: number | null, initialPct?: number | null): LivePriceState {
  const [price, setPrice] = useState<number | null>(initialPrice ?? null)
  const [pct, setPct] = useState<number | null>(initialPct ?? null)
  const [isLive, setIsLive] = useState<boolean>(false)
  const wsRef = useRef<WebSocket | null>(null)

  const stream = useMemo(() => {
    if (!symbol) return null
    const s = `${symbol}`.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!s) return null
    return `wss://stream.binance.com:9443/ws/${s}usdt@ticker`
  }, [symbol])

  useEffect(() => {
    if (!stream) return
    let cancelled = false

    try {
      const ws = new WebSocket(stream)
      wsRef.current = ws
      ws.onopen = () => {
        if (!cancelled) setIsLive(true)
      }
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data)
          // Binance 24hr ticker: c = lastPrice, P = priceChangePercent
          const last = parseFloat(data?.c)
          const percent = parseFloat(data?.P)
          if (!Number.isNaN(last)) setPrice(last)
          if (!Number.isNaN(percent)) setPct(percent)
        } catch (_) {
          // ignore malformed frames
        }
      }
      ws.onerror = () => {
        if (!cancelled) setIsLive(false)
      }
      ws.onclose = () => {
        if (!cancelled) setIsLive(false)
      }
    } catch (_) {
      setIsLive(false)
    }

    return () => {
      cancelled = true
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [stream])

  return { price, pct, isLive }
}


