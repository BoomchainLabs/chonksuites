/**
 * Authentic Token Metadata from DEX and GeckoTerminal
 * Real contract addresses and market data sources
 */

export const AUTHENTIC_TOKENS = {
  SLERF: {
    name: "SLERF",
    symbol: "SLERF",
    contractAddress: "0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    network: "base",
    decimals: 18,
    logoUrl: "/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg",
    geckoTerminalUrl: "https://www.geckoterminal.com/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    uniswapUrl: "https://app.uniswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    dexToolsUrl: "https://www.dextools.io/app/base/pair-explorer/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    poolAddress: "0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    isVerified: true,
    tags: ["meme", "base-chain", "community"]
  },
  CHONK9K: {
    name: "CHONKPUMP 9000",
    symbol: "CHONK9K",
    contractAddress: "DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    network: "solana",
    decimals: 6,
    logoUrl: "/attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg",
    pumpFunUrl: "https://pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    dexScreenerUrl: "https://dexscreener.com/solana/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    birdseyeUrl: "https://birdeye.so/token/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    isVerified: true,
    tags: ["meme", "solana", "pump-fun", "community"]
  }
} as const;

export const MARKET_DATA_SOURCES = {
  SLERF: {
    geckoTerminalApi: "https://api.geckoterminal.com/api/v2/networks/base/tokens/0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    geckoTerminalPool: "https://api.geckoterminal.com/api/v2/networks/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    coingeckoId: "slerf-base"
  },
  CHONK9K: {
    pumpFunApi: "https://frontend-api.pump.fun/coins/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    birdseyeApi: "https://public-api.birdeye.so/defi/token_overview?address=DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    dexScreenerApi: "https://api.dexscreener.com/latest/dex/tokens/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump"
  }
} as const;

export const TRADING_LINKS = {
  SLERF: {
    primary: "https://app.uniswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    secondary: "https://www.dextools.io/app/base/pair-explorer/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    chart: "https://www.geckoterminal.com/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080"
  },
  CHONK9K: {
    primary: "https://pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    secondary: "https://dexscreener.com/solana/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    chart: "https://birdeye.so/token/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump"
  }
} as const;

export type TokenSymbol = keyof typeof AUTHENTIC_TOKENS;
export type TokenMetadata = typeof AUTHENTIC_TOKENS[TokenSymbol];