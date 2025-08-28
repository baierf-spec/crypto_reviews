'use client'

import { useEffect, useRef } from 'react'

interface TradingViewChartProps {
  coinId: string
  heightClass?: string
}

export default function TradingViewChart({ coinId, heightClass = 'h-64' }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Create TradingView widget
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: getTradingViewSymbol(coinId),
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          studies: [
            'MACD@tv-basicstudies',
            'RSI@tv-basicstudies',
            'BB@tv-basicstudies',
            'Volume@tv-basicstudies'
          ],
          disabled_features: [
            'use_localstorage_for_settings',
            'volume_force_overlay'
          ],
          enabled_features: [
            'study_templates',
            'side_toolbar_in_fullscreen_mode'
          ],
          overrides: {
            'paneProperties.background': '#1e293b',
            'paneProperties.vertGridProperties.color': '#334155',
            'paneProperties.horzGridProperties.color': '#334155',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#94a3b8'
          }
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [coinId])

  return (
    <div className={heightClass}>
      <div 
        ref={containerRef}
        id={`tradingview-${coinId}`}
        className="w-full h-full"
      />
    </div>
  )
}

// TradingView symbol mapping
function getTradingViewSymbol(coinId: string): string {
  const symbolMap: { [key: string]: string } = {
    // Major cryptocurrencies
    'bitcoin': 'BINANCE:BTCUSDT',
    'ethereum': 'BINANCE:ETHUSDT',
    'binancecoin': 'BINANCE:BNBUSDT',
    'solana': 'BINANCE:SOLUSDT',
    'cardano': 'BINANCE:ADAUSDT',
    'ripple': 'BINANCE:XRPUSDT',
    'polkadot': 'BINANCE:DOTUSDT',
    'dogecoin': 'BINANCE:DOGEUSDT',
    'avalanche-2': 'BINANCE:AVAXUSDT',
    'chainlink': 'BINANCE:LINKUSDT',
    'polygon': 'BINANCE:MATICUSDT',
    'uniswap': 'BINANCE:UNIUSDT',
    'litecoin': 'BINANCE:LTCUSDT',
    'stellar': 'BINANCE:XLMUSDT',
    'cosmos': 'BINANCE:ATOMUSDT',
    'monero': 'BINANCE:XMRUSDT',
    'algorand': 'BINANCE:ALGOUSDT',
    'vechain': 'BINANCE:VETUSDT',
    'filecoin': 'BINANCE:FILUSDT',
    'internet-computer': 'BINANCE:ICPUSDT',
    'tron': 'BINANCE:TRXUSDT',
    'eos': 'BINANCE:EOSUSDT',
    
    // DeFi tokens
    'aave': 'BINANCE:AAVEUSDT',
    'synthetix-network-token': 'BINANCE:SNXUSDT',
    'compound': 'BINANCE:COMPUSDT',
    'yearn-finance': 'BINANCE:YFIUSDT',
    'sushi': 'BINANCE:SUSHIUSDT',
    'curve-dao-token': 'BINANCE:CRVUSDT',
    'balancer': 'BINANCE:BALUSDT',
    '1inch': 'BINANCE:1INCHUSDT',
    'pancakeswap-token': 'BINANCE:CAKEUSDT',
    
    // Meme coins
    'safemoon': 'BINANCE:SAFEMOONUSDT',
    'shiba-inu': 'BINANCE:SHIBUSDT',
    
    // Gaming tokens
    'chiliz': 'BINANCE:CHZUSDT',
    'enjincoin': 'BINANCE:ENJUSDT',
    'decentraland': 'BINANCE:MANAUSDT',
    'sandbox': 'BINANCE:SANDUSDT',
    'axie-infinity': 'BINANCE:AXSUSDT',
    'gala': 'BINANCE:GALAUSDT',
    'illuvium': 'BINANCE:ILVUSDT',
    'stepn': 'BINANCE:GMTUSDT',
    
    // Layer 1s
    'aptos': 'BINANCE:APTUSDT',
    'sui': 'BINANCE:SUIUSDT',
    'arbitrum': 'BINANCE:ARBUSDT',
    'optimism': 'BINANCE:OPUSDT',
    'fantom': 'BINANCE:FTMUSDT',
    'near': 'BINANCE:NEARUSDT',
    'tezos': 'BINANCE:XTZUSDT',
    'neo': 'BINANCE:NEOUSDT',
    
    // Other popular coins
    'icon': 'BINANCE:ICXUSDT',
    'ontology': 'BINANCE:ONTUSDT',
    'qtum': 'BINANCE:QTUMUSDT',
    'nano': 'BINANCE:NANOUSDT',
    'raiblocks': 'BINANCE:XRBUSDT',
    'iota': 'BINANCE:IOTAUSDT',
    'omisego': 'BINANCE:OMGUSDT',
    'zilliqa': 'BINANCE:ZILUSDT',
    'waves': 'BINANCE:WAVESUSDT',
    'nxt': 'BINANCE:NXTUSDT',
    'bytecoin-bcn': 'BINANCE:BCNUSDT',
    'verge': 'BINANCE:XVGUSDT',
    'siacoin': 'BINANCE:SCUSDT',
    'digibyte': 'BINANCE:DGBUSDT',
    'pivx': 'BINANCE:PIVXUSDT',
    'zcoin': 'BINANCE:XZCUSDT',
    'komodo': 'BINANCE:KMDUST',
    'ark': 'BINANCE:ARKUSDT',
    'lisk': 'BINANCE:LSKUSDT',
    'stratis': 'BINANCE:STRATUSDT',
    'nubits': 'BINANCE:USNBTUSDT',
    'bitshares': 'BINANCE:BTSUSDT',
    'steem': 'BINANCE:STEEMUSDT',
    'peercoin': 'BINANCE:PPCUSDT',
    'namecoin': 'BINANCE:NMCUSDT',
    'feathercoin': 'BINANCE:FTCUSDT',
    'novacoin': 'BINANCE:NVCUSDT',
    'primecoin': 'BINANCE:XPMUSDT',
    
    // Stablecoins and special cases
    'world-liberty-financial-usd': 'BINANCE:USD1USDT',
    'tether': 'BINANCE:USDTUSDT',
    'usd-coin': 'BINANCE:USDCUSDT',
    'dai': 'BINANCE:DAIUSDT',
    'binance-usd': 'BINANCE:BUSDUSDT',
    
    // Additional mappings for common variations
    'btc': 'BINANCE:BTCUSDT',
    'eth': 'BINANCE:ETHUSDT',
    'bnb': 'BINANCE:BNBUSDT',
    'sol': 'BINANCE:SOLUSDT',
    'ada': 'BINANCE:ADAUSDT',
    'xrp': 'BINANCE:XRPUSDT',
    'dot': 'BINANCE:DOTUSDT',
    'doge': 'BINANCE:DOGEUSDT',
    'avax': 'BINANCE:AVAXUSDT',
    'link': 'BINANCE:LINKUSDT',
    'matic': 'BINANCE:MATICUSDT',
    'uni': 'BINANCE:UNIUSDT',
    'ltc': 'BINANCE:LTCUSDT',
    'xlm': 'BINANCE:XLMUSDT',
    'atom': 'BINANCE:ATOMUSDT',
    'xmr': 'BINANCE:XMRUSDT',
    'algo': 'BINANCE:ALGOUSDT',
    'vet': 'BINANCE:VETUSDT',
    'fil': 'BINANCE:FILUSDT',
    'icp': 'BINANCE:ICPUSDT',
    'trx': 'BINANCE:TRXUSDT'
  }

  console.log(`TradingView: Looking up symbol for coinId: ${coinId}`)

  // Try exact match first
  if (symbolMap[coinId]) {
    console.log(`TradingView: Found exact match: ${symbolMap[coinId]}`)
    return symbolMap[coinId]
  }

  // Try lowercase version
  const lowerCoinId = coinId.toLowerCase()
  if (symbolMap[lowerCoinId]) {
    console.log(`TradingView: Found lowercase match: ${symbolMap[lowerCoinId]}`)
    return symbolMap[lowerCoinId]
  }

  // Try uppercase version
  const upperCoinId = coinId.toUpperCase()
  if (symbolMap[upperCoinId]) {
    console.log(`TradingView: Found uppercase match: ${symbolMap[upperCoinId]}`)
    return symbolMap[upperCoinId]
  }

  // Try with common suffixes
  const suffixes = ['', '-2', '-3', '-4', '-5']
  for (const suffix of suffixes) {
    const key = coinId + suffix
    if (symbolMap[key]) {
      console.log(`TradingView: Found suffix match: ${symbolMap[key]}`)
      return symbolMap[key]
    }
  }

  // Try removing common prefixes/suffixes
  const cleanId = coinId
    .replace(/^coin-/, '')
    .replace(/^token-/, '')
    .replace(/-coin$/, '')
    .replace(/-token$/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
  
  if (symbolMap[cleanId]) {
    console.log(`TradingView: Found cleaned match: ${symbolMap[cleanId]}`)
    return symbolMap[cleanId]
  }

  // Fallback: try to construct symbol from coinId
  const fallbackSymbol = `BINANCE:${coinId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}USDT`
  console.log(`TradingView: Using fallback symbol: ${fallbackSymbol}`)
  return fallbackSymbol
}

// Add TradingView types to window
declare global {
  interface Window {
    TradingView: any
  }
}
