import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, ExternalLink, Zap, Target, DollarSign, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  contractAddress: string;
  network: string;
  logoUrl: string;
  isVerified: boolean;
  lastUpdated: number;
}

interface MarketSummary {
  totalMarketCap: number;
  total24hVolume: number;
  totalLiquidity: number;
  tokens: TokenData[];
}

const TRADING_LINKS = {
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
};

const TokenCard: React.FC<{ token: TokenData }> = ({ token }) => {
  const isPositive = token.change24h > 0;
  const links = TRADING_LINKS[token.symbol as keyof typeof TRADING_LINKS];

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <img 
            src={token.logoUrl} 
            alt={token.symbol}
            className="w-10 h-10 rounded-full border-2 border-slate-600"
          />
          <div>
            <CardTitle className="text-white text-lg">{token.symbol}</CardTitle>
            <p className="text-sm text-gray-400">{token.name}</p>
          </div>
        </div>
        {token.isVerified && (
          <Badge variant="secondary" className="ml-auto bg-green-900/20 text-green-400 border-green-600">
            Verified
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-xl font-bold text-white">
              ${token.price.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Change</p>
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Volume 24h</p>
            <p className="text-sm font-semibold text-white">
              ${token.volume24h.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Market Cap</p>
            <p className="text-sm font-semibold text-white">
              ${token.marketCap.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={() => window.open(links.primary, '_blank')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Trade {token.symbol}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(links.chart, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Chart
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(links.secondary, '_blank')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Target className="w-3 h-3 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {token.network === 'base' ? 'Base Chain' : 'Solana'}
            </span>
            <span className="text-xs text-gray-500">
              Liquidity: ${token.liquidity.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketSummaryCard: React.FC<{ summary: MarketSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${summary.totalMarketCap.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">Combined market value</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">24h Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${summary.total24hVolume.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">Trading activity</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Liquidity</CardTitle>
          <Zap className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${summary.totalLiquidity.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400">Available liquidity</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProductionTradingDashboard() {
  const { data: marketData, isLoading, error } = useQuery<MarketSummary>({
    queryKey: ['/api/tokens/market-data'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-700/30 p-8">
          <CardContent className="text-center">
            <p className="text-red-400 text-lg">Failed to load market data</p>
            <p className="text-gray-400 mt-2">Please check your connection and try again</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Professional Trading Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time market data for SLERF (Base) and CHONK9K (Solana) tokens
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-8 bg-slate-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-slate-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : marketData ? (
          <>
            <MarketSummaryCard summary={marketData} />
            
            <Tabs defaultValue="trading" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700">
                <TabsTrigger value="trading" className="data-[state=active]:bg-purple-600">
                  Live Trading
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
                  Market Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trading" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {marketData.tokens.map((token) => (
                    <TokenCard key={token.symbol} token={token} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {marketData.tokens.map((token) => (
                    <Card key={token.symbol} className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <img 
                            src={token.logoUrl} 
                            alt={token.symbol}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          {token.symbol} Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Contract</p>
                              <p className="text-xs font-mono text-white break-all">
                                {token.contractAddress}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Network</p>
                              <p className="text-sm font-semibold text-white capitalize">
                                {token.network}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              onClick={() => {
                                const links = TRADING_LINKS[token.symbol as keyof typeof TRADING_LINKS];
                                window.open(links.chart, '_blank');
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Advanced Charts
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Data updated in real-time from GeckoTerminal and Pump.fun
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Trading involves risk. Please trade responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}