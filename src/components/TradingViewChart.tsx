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

type TimeInterval = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'

export default function TradingViewChart({ symbol, height = 400 }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1M') // Default to 1 month (30 days)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    
    script.onload = () => {
      const tv = (window as any).TradingView
      if (tv) {
        // Fix symbol construction to ensure proper USDT pairs
        let fullSymbol = symbol
        if (!symbol.includes(':')) {
          // If no exchange prefix, add BINANCE and ensure USDT suffix
          const baseSymbol = symbol.toUpperCase()
          fullSymbol = `BINANCE:${baseSymbol}${baseSymbol.endsWith('USDT') ? '' : 'USDT'}`
        } else if (!symbol.includes('USDT')) {
          // If has exchange prefix but no USDT, add USDT
          const [exchange, base] = symbol.split(':')
          fullSymbol = `${exchange}:${base.toUpperCase()}USDT`
        }
        
        const containerId = 'tv_' + fullSymbol.replace(/[^A-Z0-9:]/gi, '_')
        
        console.log('TradingView: Loading symbol:', fullSymbol, 'with interval:', selectedInterval)
        
        try {
          widgetRef.current = new tv.widget({
            autosize: true,
            symbol: fullSymbol,
            interval: selectedInterval,
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
  }, [symbol, selectedInterval])

  const handleIntervalChange = (interval: TimeInterval) => {
    setSelectedInterval(interval)
  }

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
    <div className="w-full">
      {/* Time Interval Selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Price Chart</h3>
        <div className="flex gap-2">
          {(['1D', '1W', '1M', '3M', '6M', '1Y'] as TimeInterval[]).map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedInterval === interval
                  ? 'bg-crypto-accent text-white'
                  : 'bg-crypto-secondary/50 text-gray-300 hover:bg-crypto-secondary/70'
              }`}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart Container */}
      <div 
        id={'tv_' + (symbol.includes(':') ? symbol : `BINANCE:${symbol}`).replace(/[^A-Z0-9:]/gi, '_')} 
        ref={container} 
        style={{ height, width: '100%' }} 
        className="w-full"
      />
    </div>
  )
}
