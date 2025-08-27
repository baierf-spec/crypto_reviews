import { useEffect, useRef } from 'react'

interface Props {
  symbol: string // coin symbol like BTC, ETH, THETA
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
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0b1220',
          hide_top_toolbar: false,
          hide_legend: false,
          allow_symbol_change: false,
          container_id: 'tv_' + symbol,
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

  return <div id={'tv_' + symbol} ref={container} style={{ height }} />
}
