// TradingView symbol mappings for various cryptocurrencies
// Maps coin IDs to TradingView base symbols

// Valid TradingView symbols that we know work
const VALID_TV_SYMBOLS = new Set([
  'BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'ATOM', 'LTC', 'ETC', 'XRP', 'BCH', 'FIL', 'ICP', 'NEAR', 'ALGO', 'VET', 'MANA', 'SAND', 'AXS', 'GALA', 'ENJ', 'CHZ', 'HOT', 'BAT', 'ZIL', 'ONE', 'HARMONY', 'FTM', 'CAKE', 'CRV', 'AAVE', 'COMP', 'MKR', 'SNX', 'YFI', 'SUSHI', '1INCH', 'REN', 'BAL', 'KNC', 'ZRX', 'REP', 'NMR', 'MLN', 'STORJ', 'BAND', 'KAVA', 'ROSE', 'IOTA', 'XLM', 'TRX', 'EOS', 'XMR', 'DASH', 'ZEC', 'XTZ', 'NEO', 'WAVES', 'QTUM', 'OMG', 'ZEN', 'RVN', 'BTT', 'WIN', 'ANKR', 'COTI', 'HBAR', 'THETA', 'TFUEL', 'VTHO', 'OCEAN', 'ALPHA', 'AUDIO', 'RLC', 'GRT', 'LPT', 'CLV', 'DYDX', 'IMX', 'OP', 'ARB', 'MASK', 'APT', 'SUI', 'SEI', 'TIA', 'JUP', 'PYTH', 'WIF', 'BONK', 'PEPE', 'SHIB', 'DOGE', 'FLOKI', 'MEME', 'BOOK', 'ORDI', 'RATS', 'MOON', 'CAT', 'WOJAK', 'TURBO', 'POPCAT', 'MYRO', 'BOME', 'SLERF', 'SMOG', 'SLOTH', 'TREMP', 'BODEN', 'MAGA', 'TRUMP', 'BIDEN'
])

// Map coin IDs to TradingView base symbols
export const COIN_ID_TO_BASE: Record<string, string> = {
  // Major cryptocurrencies
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'cardano': 'ADA',
  'solana': 'SOL',
  'polkadot': 'DOT',
  'avalanche-2': 'AVAX',
  'matic-network': 'MATIC',
  'chainlink': 'LINK',
  'uniswap': 'UNI',
  'cosmos': 'ATOM',
  'litecoin': 'LTC',
  'ethereum-classic': 'ETC',
  'ripple': 'XRP',
  'bitcoin-cash': 'BCH',
  'filecoin': 'FIL',
  'internet-computer': 'ICP',
  'internet-computer-protocol': 'ICP',
  'icp': 'ICP',
  'internet-protocol': 'ICP',
  'ip': 'ICP',
  'near': 'NEAR',
  'algorand': 'ALGO',
  'vechain': 'VET',
  'decentraland': 'MANA',
  'the-sandbox': 'SAND',
  'axie-infinity': 'AXS',
  'gala': 'GALA',
  'enjincoin': 'ENJ',
  'chiliz': 'CHZ',
  'holochain': 'HOT',
  'basic-attention-token': 'BAT',
  'zilliqa': 'ZIL',
  'harmony': 'ONE',
  'fantom': 'FTM',
  'pancakeswap-token': 'CAKE',
  'curve-dao-token': 'CRV',
  'aave': 'AAVE',
  'compound-governance-token': 'COMP',
  'maker': 'MKR',
  'havven': 'SNX',
  'yearn-finance': 'YFI',
  'sushi': 'SUSHI',
  '1inch': '1INCH',
  'republic-protocol': 'REN',
  'balancer': 'BAL',
  'kyber-network-crystal': 'KNC',
  '0x': 'ZRX',
  'augur': 'REP',
  'numeraire': 'NMR',
  'melon': 'MLN',
  'storj': 'STORJ',
  'band-protocol': 'BAND',
  'kava': 'KAVA',
  'oasis-network': 'ROSE',
  'iota': 'IOTA',
  'stellar': 'XLM',
  'tron': 'TRX',
  'eos': 'EOS',
  'monero': 'XMR',
  'dash': 'DASH',
  'zcash': 'ZEC',
  'tezos': 'XTZ',
  'neo': 'NEO',
  'waves': 'WAVES',
  'qtum': 'QTUM',
  'omisego': 'OMG',
  'horizen': 'ZEN',
  'ravencoin': 'RVN',
  'bittorrent': 'BTT',
  'wink': 'WIN',
  'ankr': 'ANKR',
  'coti': 'COTI',
  'hedera-hashgraph': 'HBAR',
  'theta-token': 'THETA',
  'theta-fuel': 'TFUEL',
  'vechainthor': 'VTHO',
  'ocean-protocol': 'OCEAN',
  'alpha-finance': 'ALPHA',
  'audius': 'AUDIO',
  'iexec-rlc': 'RLC',
  'the-graph': 'GRT',
  'livepeer': 'LPT',
  'clover-finance': 'CLV',
  'dydx': 'DYDX',
  'immutable-x': 'IMX',
  'optimism': 'OP',
  'arbitrum': 'ARB',
  'mask-network': 'MASK',
  'aptos': 'APT',
  'sui': 'SUI',
  'sei-network': 'SEI',
  'celestia': 'TIA',
  'jupiter': 'JUP',
  'pyth-network': 'PYTH',
  'dogwifhat': 'WIF',
  'bonk': 'BONK',
  'pepe': 'PEPE',
  'shiba-inu': 'SHIB',
  'dogecoin': 'DOGE',
  'floki': 'FLOKI',
  'meme': 'MEME',
  'book-of-meme': 'BOOK',
  'ordi': 'ORDI',
  'rats': 'RATS',
  'moon': 'MOON',
  'cat': 'CAT',
  'wojak': 'WOJAK',
  'turbo': 'TURBO',
  'popcat': 'POPCAT',
  'myro': 'MYRO',
  'bome': 'BOME',
  'slerf': 'SLERF',
  'smog': 'SMOG',
  'sloth': 'SLOTH',
  'tremp': 'TREMP',
  'boden': 'BODEN',
  'maga': 'MAGA',
  'trump': 'TRUMP',
  'biden': 'BIDEN',
  
  // Alternative names and variations
  'btc': 'BTC',
  'eth': 'ETH',
  'bnb': 'BNB',
  'ada': 'ADA',
  'sol': 'SOL',
  'dot': 'DOT',
  'avax': 'AVAX',
  'matic': 'MATIC',
  'link': 'LINK',
  'uni': 'UNI',
  'atom': 'ATOM',
  'ltc': 'LTC',
  'etc': 'ETC',
  'xrp': 'XRP',
  'bch': 'BCH',
  'fil': 'FIL',
  'near': 'NEAR',
  'algo': 'ALGO',
  'vet': 'VET',
  'mana': 'MANA',
  'sand': 'SAND',
  'axs': 'AXS',
  'gala': 'GALA',
  'enj': 'ENJ',
  'chz': 'CHZ',
  'hot': 'HOT',
  'bat': 'BAT',
  'zil': 'ZIL',
  'one': 'ONE',
  'ftm': 'FTM',
  'cake': 'CAKE',
  'crv': 'CRV',
  'aave': 'AAVE',
  'comp': 'COMP',
  'mkr': 'MKR',
  'snx': 'SNX',
  'yfi': 'YFI',
  'sushi': 'SUSHI',
  '1inch': '1INCH',
  'ren': 'REN',
  'bal': 'BAL',
  'knc': 'KNC',
  'zrx': 'ZRX',
  'rep': 'REP',
  'nmr': 'NMR',
  'mln': 'MLN',
  'storj': 'STORJ',
  'band': 'BAND',
  'kava': 'KAVA',
  'rose': 'ROSE',
  'iota': 'IOTA',
  'xlm': 'XLM',
  'trx': 'TRX',
  'eos': 'EOS',
  'xmr': 'XMR',
  'dash': 'DASH',
  'zec': 'ZEC',
  'xtz': 'XTZ',
  'neo': 'NEO',
  'waves': 'WAVES',
  'qtum': 'QTUM',
  'omg': 'OMG',
  'zen': 'ZEN',
  'rvn': 'RVN',
  'btt': 'BTT',
  'win': 'WIN',
  'ankr': 'ANKR',
  'coti': 'COTI',
  'hbar': 'HBAR',
  'theta': 'THETA',
  'tfuel': 'TFUEL',
  'vtho': 'VTHO',
  'ocean': 'OCEAN',
  'alpha': 'ALPHA',
  'audio': 'AUDIO',
  'rlc': 'RLC',
  'grt': 'GRT',
  'lpt': 'LPT',
  'clv': 'CLV',
  'dydx': 'DYDX',
  'imx': 'IMX',
  'op': 'OP',
  'arb': 'ARB',
  'mask': 'MASK',
  'apt': 'APT',
  'sui': 'SUI',
  'sei': 'SEI',
  'tia': 'TIA',
  'jup': 'JUP',
  'pyth': 'PYTH',
  'wif': 'WIF',
  'bonk': 'BONK',
  'shib': 'SHIB',
  'doge': 'DOGE',
  'floki': 'FLOKI',
  'meme': 'MEME',
  'book': 'BOOK',
  'ordi': 'ORDI',
  'rats': 'RATS',
  'moon': 'MOON',
  'cat': 'CAT',
  'wojak': 'WOJAK',
  'turbo': 'TURBO',
  'popcat': 'POPCAT',
  'myro': 'MYRO',
  'bome': 'BOME',
  'slerf': 'SLERF',
  'smog': 'SMOG',
  'sloth': 'SLOTH',
  'tremp': 'TREMP',
  'boden': 'BODEN',
  'maga': 'MAGA',
  'trump': 'TRUMP',
  'biden': 'BIDEN',
}

// Alternative exchanges for cryptocurrencies not on Binance
const ALTERNATIVE_EXCHANGES = [
  'COINBASE',
  'KRAKEN', 
  'KUCOIN',
  'GATE',
  'HUOBI',
  'OKX',
  'BYBIT',
  'BITGET',
  'MEXC',
  'BITFINEX'
]

export function getTvBaseSymbol(coinId: string, coinSymbol?: string): string | null {
  // Convert to lowercase for consistent lookup
  const normalizedCoinId = coinId.toLowerCase()
  
  // First try direct mapping
  let baseSymbol = COIN_ID_TO_BASE[normalizedCoinId]
  
  // If no direct mapping, try using the coin symbol
  if (!baseSymbol && coinSymbol) {
    const normalizedSymbol = coinSymbol.toUpperCase()
    if (VALID_TV_SYMBOLS.has(normalizedSymbol)) {
      baseSymbol = normalizedSymbol
    }
  }
  
  // Validate the resolved symbol
  if (baseSymbol && VALID_TV_SYMBOLS.has(baseSymbol)) {
    return baseSymbol
  }
  
  // If still no valid symbol, try some common patterns
  if (!baseSymbol) {
    // Try uppercase version of coinId
    const upperCoinId = coinId.toUpperCase()
    if (VALID_TV_SYMBOLS.has(upperCoinId)) {
      return upperCoinId
    }
    
    // Try removing common suffixes
    const withoutSuffix = coinId.replace(/-token$/, '').replace(/-coin$/, '').toUpperCase()
    if (VALID_TV_SYMBOLS.has(withoutSuffix)) {
      return withoutSuffix
    }
  }
  
  console.warn(`TradingView: Could not resolve symbol for coinId: ${coinId}`)
  return null
}

export async function findExchangeBaseViaCG(coinId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    if (!response.ok) return null
    
    const data = await response.json()
    const tickers = data.tickers || []
    
    // Look for TradingView compatible symbols
    for (const ticker of tickers) {
      const base = ticker.base?.toUpperCase()
      const target = ticker.target?.toUpperCase()
      
      // Check if it's a USDT pair and the base symbol is valid
      if (target === 'USDT' && base && VALID_TV_SYMBOLS.has(base)) {
        return base
      }
      
      // Check if it's a USD pair and the base symbol is valid
      if (target === 'USD' && base && VALID_TV_SYMBOLS.has(base)) {
        return base
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    return null
  }
}

// Function to get TradingView symbol with exchange fallback
export async function getTvSymbolWithFallback(coinId: string): Promise<string | null> {
  // First try Binance
  const baseSymbol = getTvBaseSymbol(coinId)
  if (baseSymbol) {
    return `BINANCE:${baseSymbol}USDT`
  }
  
  // Try CoinGecko for alternative exchanges
  const cgSymbol = await findExchangeBaseViaCG(coinId)
  if (cgSymbol) {
    // Try different exchanges
    for (const exchange of ALTERNATIVE_EXCHANGES) {
      const symbol = `${exchange}:${cgSymbol}USDT`
      // You could add validation here to check if the symbol exists
      return symbol
    }
  }
  
  return null
}


