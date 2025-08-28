import { useEffect, useRef } from 'react'

interface Props {
  symbol: string // Accepts full TV symbol e.g., "BINANCE:BTCUSDT" or just pair like "BTCUSDT"
  height?: number
}

export default function TradingViewChart({ symbol, height = 300 }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      // @ts-ignore
      if (window.TradingView) {
        // @ts-ignore
        const fullSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol.toUpperCase()}`
        new window.TradingView.widget({
          autosize: true,
          symbol: fullSymbol,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0b1220',
          hide_top_toolbar: false,
          hide_legend: false,
          allow_symbol_change: false,
          container_id: 'tv_' + fullSymbol.replace(/[^A-Z0-9:]/gi, '_'),
        })
      }
    }
    container.current.appendChild(script)
    return () => {
      if (container.current && script.parentNode === container.current) {
        container.current.removeChild(script)
      }
    }
  }, [symbol])

  return <div id={'tv_' + (symbol.includes(':') ? symbol : `BINANCE:${symbol}`).replace(/[^A-Z0-9:]/gi, '_')} ref={container} style={{ height }} />
}
