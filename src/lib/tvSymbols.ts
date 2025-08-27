// Map coin ids to reliable TradingView base symbols (without exchange/pair suffix)
// We intentionally keep a small allowlist to avoid "Invalid symbol" errors.

const COIN_ID_TO_SYMBOL: Record<string, string> = {
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
  polygon: 'MATIC',
  theta-token: 'THETA',
  avalanche: 'AVAX',
  uniswap: 'UNI',
  cosmos: 'ATOM',
  stellar: 'XLM',
  vechain: 'VET',
}

export function getTvBaseSymbol(coinId: string, fallbackSymbol?: string): string | null {
  const fromMap = COIN_ID_TO_SYMBOL[coinId]
  if (fromMap) return fromMap
  // Conservative heuristic: only allow A–Z fallback of length 3–6
  if (fallbackSymbol && /^[A-Z]{3,6}$/.test(fallbackSymbol.toUpperCase())) {
    return fallbackSymbol.toUpperCase()
  }
  return null
}


