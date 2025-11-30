export type SymbolCode =
  | "ETH" | "BTC" | "SOL" | "ONDO"
  | "GOLD"
  | "TESLA" | "NVIDIA" | "APPLE" | "GOOGLE"
  | "META" | "AMAZON" | "MICROSOFT";

export type PriceResult = Record<SymbolCode, number | null>;

// Crypto map dùng CoinGecko
const cryptoMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ONDO: "ondo-finance",
  GOLD: "tether-gold"
};

// Stock map dùng Finnhub
const stockMap: Partial<Record<SymbolCode, string>> = {
  TESLA: "TSLA",
  NVIDIA: "NVDA",
  APPLE: "AAPL",
  GOOGLE: "GOOGL",
  META: "META",
  AMAZON: "AMZN",
  MICROSOFT: "MSFT"
};

// Key Finnhub
const FINNHUB_API = "d4m4cd1r01qjidhtfuf0d4m4cd1r01qjidhtfufg";

// Fetch 1 mã stock từ Finnhub
export async function fetchStock(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API}`;
  const res = await fetch(url);
  return await res.json();
}

function convertPricesToArray(
    prices: Partial<Record<string, number | null>>
  ) {
    return Object.entries(prices).map(([code, price]) => ({
      code,
      price
    }));
  }
  

export async function fetchPrices(symbols: SymbolCode[]): Promise<any> {
  // Crypto gồm cả GOLD
  const cryptoSymbols = symbols.filter(s => cryptoMap[s]);
  const stockSymbols = symbols.filter(s => stockMap[s]);

  const results: Partial<PriceResult> = {};

  // Fetch crypto từ CoinGecko (ETH, BTC, SOL, ONDO, GOLD)
  if (cryptoSymbols.length > 0) {
    const ids = cryptoSymbols.map(s => cryptoMap[s]).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    const res = await fetch(url);
    const data: Record<string, { usd: number }> = await res.json();

    cryptoSymbols.forEach(sym => {
      const id = cryptoMap[sym];
      results[sym] = data[id]?.usd ?? null;
    });
  }

  // Fetch stock từ Finnhub
  if (stockSymbols.length > 0) {
    await Promise.all(
      stockSymbols.map(async sym => {
        const finnSymbol = stockMap[sym]!;
        const quote = await fetchStock(finnSymbol);
        results[sym] = quote.c ?? null;
      })
    );
  }

  return convertPricesToArray(results);
}
