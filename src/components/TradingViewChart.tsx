import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    TradingView?: {
      widget: (options: any) => void
    }
  }
}

interface Props {
  symbol: string // Accepts full TV symbol e.g., "BINANCE:BTCUSDT" or just pair like "BTCUSDT"
  height?: number
}

export default function TradingViewChart({ symbol, height = 300 }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    
    script.onload = () => {
      const tv = (window as any).TradingView
      if (tv) {
        const fullSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol.toUpperCase()}`
        const containerId = 'tv_' + fullSymbol.replace(/[^A-Z0-9:]/gi, '_')
        
        try {
          widgetRef.current = new tv.widget({
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
            container_id: containerId,
            // Enhanced functionality
            enable_publishing: false,
            hide_volume: false, // Show volume but only in main chart, not separate table
            volume_overlay: true, // Show volume as overlay on price chart
            hide_side_toolbar: false,
            save_image: false,
            studies_overrides: {
              'volume.volume.color.0': '#ff4444',
              'volume.volume.color.1': '#44ff44',
              'volume.volume.transparency': 70,
            },
            // Remove duplicate volume tables by disabling volume indicators
            disabled_features: [
              'volume_force_overlay',
              'create_volume_indicator_by_default',
              'show_volume_indicators_tab',
            ],
            enabled_features: [
              'study_templates',
              'side_toolbar_in_fullscreen_mode',
            ],
            overrides: {
              'paneProperties.background': '#0b1220',
              'paneProperties.vertGridProperties.color': '#1e293b',
              'paneProperties.horzGridProperties.color': '#1e293b',
              'symbolWatermarkProperties.transparency': 90,
            },
            loading_screen: {
              backgroundColor: '#0b1220',
              foregroundColor: '#22d3ee',
            },
          })
          
          setError(null)
        } catch (err) {
          console.error('TradingView widget creation error:', err)
          setError('Failed to load chart')
        }
      } else {
        setError('TradingView library not available')
      }
    }
    
    script.onerror = () => {
      setError('Failed to load TradingView library')
    }
    
    container.current.appendChild(script)
    
    return () => {
      // Cleanup widget
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove()
        } catch (err) {
          console.error('Error removing TradingView widget:', err)
        }
      }
      
      // Remove script
      if (container.current && script.parentNode === container.current) {
        container.current.removeChild(script)
      }
    }
  }, [symbol])

  if (error) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      id={'tv_' + (symbol.includes(':') ? symbol : `BINANCE:${symbol}`).replace(/[^A-Z0-9:]/gi, '_')} 
      ref={container} 
      style={{ height }} 
    />
  )
}
