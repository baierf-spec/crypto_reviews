// TradingView/Exchange symbol helpers

// Allowlist of coinId -> base symbol when we know it for sure
const COIN_ID_TO_BASE: Record<string, string> = {
  // Major cryptocurrencies
  bitcoin: 'BTC',
  ethereum: 'ETH',
  binancecoin: 'BNB',
  solana: 'SOL',
  ripple: 'XRP',
  cardano: 'ADA',
  tron: 'TRX',
  polkadot: 'DOT',
  litecoin: 'LTC',
  dogecoin: 'DOGE',
  chainlink: 'LINK',
  'polygon-pos': 'MATIC',
  'theta-token': 'THETA',
  'avalanche-2': 'AVAX',
  uniswap: 'UNI',
  cosmos: 'ATOM',
  stellar: 'XLM',
  vechain: 'VET',
  
  // Additional popular coins
  'shiba-inu': 'SHIB',
  'dai': 'DAI',
  'leo-token': 'LEO',
  'wrapped-bitcoin': 'WBTC',
  'monero': 'XMR',
  'ethereum-classic': 'ETC',
  'okb': 'OKB',
  'cronos': 'CRO',
  'filecoin': 'FIL',
  'near': 'NEAR',
  'algorand': 'ALGO',
  'hedera-hashgraph': 'HBAR',
  'aptos': 'APT',
  'arbitrum': 'ARB',
  'optimism': 'OP',
  'manta-network': 'MANTA',
  'sei-network': 'SEI',
  'sui': 'SUI',
  'pepe': 'PEPE',
  'bonk': 'BONK',
  'floki': 'FLOKI',
  'dogwifhat': 'WIF',
  'book-of-meme': 'BOME',
  'wif': 'WIF',
  'bome': 'BOME',
  
  // Common variations
  'bitcoin-cash': 'BCH',
  'bitcoin-sv': 'BSV',
  'eos': 'EOS',
  'tezos': 'XTZ',
  'neo': 'NEO',
  'icon': 'ICX',
  'qtum': 'QTUM',
  'omisego': 'OMG',
  '0x': 'ZRX',
  'augur': 'REP',
  'basic-attention-token': 'BAT',
  'decentraland': 'MANA',
  'enjin-coin': 'ENJ',
  'golem': 'GLM',
  'kyber-network': 'KNC',
  'loopring': 'LRC',
  'numeraire': 'NMR',
  'ocean-protocol': 'OCEAN',
  'orchid': 'OXT',
  'sandbox': 'SAND',
  'skale': 'SKL',
  'synthetix-network-token': 'SNX',
  'uma': 'UMA',
  'yearn-finance': 'YFI',
  'zilliqa': 'ZIL',
  
  // Additional coins that might cause issues
  'internet-computer': 'ICP',
  'internet-computer-protocol': 'ICP',
  'icp': 'ICP',
  'internet-protocol': 'ICP',
  'ip': 'ICP', // Fix for the IP issue
  'link': 'LINK',
  'matic': 'MATIC',
  'polygon': 'MATIC',
  'avalanche': 'AVAX',
  'avax': 'AVAX',
  'binance-coin': 'BNB',
  'bnb': 'BNB',
  'binance': 'BNB',
  'btc': 'BTC',
  'eth': 'ETH',
}

// Valid TradingView symbols that we know work
const VALID_TV_SYMBOLS = new Set([
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'TRX', 'DOT', 'LTC', 'DOGE', 'LINK', 'MATIC', 'THETA', 'AVAX', 'UNI', 'ATOM', 'XLM', 'VET',
  'SHIB', 'DAI', 'LEO', 'WBTC', 'XMR', 'ETC', 'OKB', 'CRO', 'FIL', 'NEAR', 'ALGO', 'HBAR', 'APT', 'ARB', 'OP', 'MANTA', 'SEI', 'SUI', 'PEPE', 'BONK', 'FLOKI', 'WIF', 'BOME',
  'BCH', 'BSV', 'EOS', 'XTZ', 'NEO', 'ICX', 'QTUM', 'OMG', 'ZRX', 'REP', 'BAT', 'MANA', 'ENJ', 'GLM', 'KNC', 'LRC', 'NMR', 'OCEAN', 'OXT', 'SAND', 'SKL', 'SNX', 'UMA', 'YFI', 'ZIL', 'ICP'
])

// Synchronous best‑guess used by the client during initial render
export function getTvBaseSymbol(coinId: string, fallbackSymbol?: string): string | null {
  // First check our direct mapping
  const fromMap = COIN_ID_TO_BASE[coinId.toLowerCase()]
  if (fromMap && VALID_TV_SYMBOLS.has(fromMap)) {
    return fromMap
  }
  
  // Try to extract symbol from coinId if it looks like a valid symbol
  if (coinId && /^[A-Z]{2,12}$/.test(coinId.toUpperCase()) && VALID_TV_SYMBOLS.has(coinId.toUpperCase())) {
    return coinId.toUpperCase()
  }
  
  // Use fallback symbol if provided and valid
  if (fallbackSymbol && /^[A-Z]{2,12}$/.test(fallbackSymbol.toUpperCase()) && VALID_TV_SYMBOLS.has(fallbackSymbol.toUpperCase())) {
    return fallbackSymbol.toUpperCase()
  }
  
  // If we can't resolve a valid symbol, return null instead of an invalid one
  console.warn(`Could not resolve valid TradingView symbol for coinId: ${coinId}`)
  return null
}

// Optional server-side resolver using CoinGecko tickers
// Returns an exchange and base that are likely to work with USDT pairs
export async function findExchangeBaseViaCG(
  coinId: string,
  prefer: string[] = ['BINANCE', 'KUCOIN', 'MEXC']
): Promise<{ exchange: string; base: string } | null> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?include_exchange_logo=false`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = (await res.json()) as any
    const tickers: any[] = Array.isArray(data?.tickers) ? data.tickers : []
    const normalize = (name: string) =>
      name.toUpperCase().includes('BINANCE')
        ? 'BINANCE'
        : name.toUpperCase().includes('KUCOIN')
        ? 'KUCOIN'
        : name.toUpperCase().includes('MEXC')
        ? 'MEXC'
        : name.toUpperCase()

    for (const ex of prefer) {
      const t = tickers.find(
        (t) => normalize(t?.market?.name || '') === ex && (t?.target || '').toUpperCase() === 'USDT'
      )
      if (t && t.base && VALID_TV_SYMBOLS.has(String(t.base).toUpperCase())) {
        return { exchange: ex, base: String(t.base).toUpperCase() }
      }
    }
    // If no preferred exchange, pick any USDT pair with valid symbol
    const anyUsdt = tickers.find((t) => (t?.target || '').toUpperCase() === 'USDT' && VALID_TV_SYMBOLS.has(String(t.base).toUpperCase()))
    if (anyUsdt?.market?.name && anyUsdt?.base) {
      return { exchange: normalize(anyUsdt.market.name), base: String(anyUsdt.base).toUpperCase() }
    }
  } catch (_) {
    // ignore
  }
  return null
}


