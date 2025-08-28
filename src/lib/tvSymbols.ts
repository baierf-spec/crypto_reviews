// TradingView/Exchange symbol helpers

// Allowlist of coinId -> base symbol when we know it for sure
const COIN_ID_TO_BASE: Record<string, string> = {
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
}

// Synchronous best‑guess used by the client during initial render
export function getTvBaseSymbol(coinId: string, fallbackSymbol?: string): string | null {
  const fromMap = COIN_ID_TO_BASE[coinId]
  if (fromMap) return fromMap
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


