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
}

// Synchronous best‑guess used by the client during initial render
export function getTvBaseSymbol(coinId: string, fallbackSymbol?: string): string | null {
  const fromMap = COIN_ID_TO_BASE[coinId]
  if (fromMap) return fromMap
  
  // Try to extract symbol from coinId if it looks like a symbol
  if (coinId && /^[A-Z]{2,12}$/.test(coinId.toUpperCase())) {
    return coinId.toUpperCase()
  }
  
  // Use fallback symbol if provided and valid
  if (fallbackSymbol && /^[A-Z]{2,12}$/.test(fallbackSymbol.toUpperCase())) {
    return fallbackSymbol.toUpperCase()
  }
  
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
      if (t && t.base) {
        return { exchange: ex, base: String(t.base).toUpperCase() }
      }
    }
    // If no preferred exchange, pick any USDT pair
    const anyUsdt = tickers.find((t) => (t?.target || '').toUpperCase() === 'USDT')
    if (anyUsdt?.market?.name && anyUsdt?.base) {
      return { exchange: normalize(anyUsdt.market.name), base: String(anyUsdt.base).toUpperCase() }
    }
  } catch (_) {
    // ignore
  }
  return null
}


