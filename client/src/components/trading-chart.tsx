import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, RefreshCw } from "lucide-react";
import TokenLogo from "@/components/token-logo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  tokenSymbol: "LERF" | "CHONK9K";
  userId?: number;
}

export default function TradingChart({ tokenSymbol, userId }: TradingChartProps) {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [timeframe, setTimeframe] = useState("1h");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get live price data
  const { data: priceData } = useQuery({
    queryKey: ['/api/trading/price', tokenSymbol],
    refetchInterval: 1000,
  });

  // Get user balance
  const { data: userBalance } = useQuery({
    queryKey: ['/api/trading/balance', userId, tokenSymbol],
    enabled: !!userId,
  });

  // Buy tokens mutation
  const buyTokensMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/trading/buy', {
        userId,
        tokenSymbol,
        amount,
        price: currentPrice,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful!",
        description: `Bought ${data.amount} ${tokenSymbol} for $${data.totalCost}`,
      });
      setBuyAmount("");
      queryClient.invalidateQueries({ queryKey: ['/api/trading/balance', userId, tokenSymbol] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    },
  });

  // Sell tokens mutation
  const sellTokensMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/trading/sell', {
        userId,
        tokenSymbol,
        amount,
        price: currentPrice,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sale Successful!",
        description: `Sold ${data.amount} ${tokenSymbol} for $${data.totalReceived}`,
      });
      setSellAmount("");
      queryClient.invalidateQueries({ queryKey: ['/api/trading/balance', userId, tokenSymbol] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Sale Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    },
  });

  // Generate mock price data (in a real app, this would come from an API)
  useEffect(() => {
    const generatePriceData = () => {
      const basePrice = tokenSymbol === "LERF" ? 0.002300 : 0.00000045;
      const now = Date.now();
      const data: PriceData[] = [];
      
      let price = basePrice;
      for (let i = 100; i >= 0; i--) {
        const time = now - (i * 60000); // 1-minute intervals
        const volatility = Math.random() * 0.02 - 0.01; // ±1% volatility
        const newPrice = price * (1 + volatility);
        
        data.push({
          time,
          open: price,
          high: Math.max(price, newPrice) * (1 + Math.random() * 0.005),
          low: Math.min(price, newPrice) * (1 - Math.random() * 0.005),
          close: newPrice,
          volume: Math.random() * 1000000,
        });
        
        price = newPrice;
      }
      
      setPriceHistory(data);
      setCurrentPrice(data[data.length - 1].close);
      setPriceChange(((data[data.length - 1].close - data[0].open) / data[0].open) * 100);
    };

    generatePriceData();
    const interval = setInterval(generatePriceData, 2000);
    return () => clearInterval(interval);
  }, [tokenSymbol]);

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (amount > 0) {
      buyTokensMutation.mutate(amount);
    }
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    if (amount > 0) {
      sellTokensMutation.mutate(amount);
    }
  };

  const formatPrice = (price: number) => {
    return tokenSymbol === "LERF" ? price.toFixed(6) : price.toFixed(8);
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card className="glass-card border-blue-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <TokenLogo tokenSymbol={tokenSymbol} size="sm" />
            <BarChart3 className="h-5 w-5 text-blue-400" />
            {tokenSymbol} Trading
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400">Live</Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price Display */}
          <div className="stat-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                <p className="text-3xl font-bold font-mono">
                  ${formatPrice(currentPrice)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                <div className={`text-xl font-semibold ${getPriceChangeColor(priceChange)}`}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  {priceChange > 0 ? (
                    <TrendingUp className="inline h-4 w-4 ml-1" />
                  ) : priceChange < 0 ? (
                    <TrendingDown className="inline h-4 w-4 ml-1" />
                  ) : null}
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                <p className="text-xl font-semibold">
                  ${(currentPrice * 100000000).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="stat-card p-4">
            <div className="h-64 bg-gray-900/50 rounded-lg border border-gray-700/50 relative overflow-hidden">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <linearGradient id={`chartGradient-${tokenSymbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={tokenSymbol === "LERF" ? "#22c55e" : "#f59e0b"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={tokenSymbol === "LERF" ? "#22c55e" : "#f59e0b"} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                {priceHistory.length > 0 && (
                  <>
                    {/* Price line */}
                    <polyline
                      fill="none"
                      stroke={tokenSymbol === "LERF" ? "#22c55e" : "#f59e0b"}
                      strokeWidth="2"
                      points={priceHistory.map((data, index) => {
                        const x = (index / (priceHistory.length - 1)) * 100;
                        const minPrice = Math.min(...priceHistory.map(d => d.close));
                        const maxPrice = Math.max(...priceHistory.map(d => d.close));
                        const y = 90 - ((data.close - minPrice) / (maxPrice - minPrice)) * 80;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                    />
                    
                    {/* Fill area */}
                    <polygon
                      fill={`url(#chartGradient-${tokenSymbol})`}
                      points={`0%,100% ${priceHistory.map((data, index) => {
                        const x = (index / (priceHistory.length - 1)) * 100;
                        const minPrice = Math.min(...priceHistory.map(d => d.close));
                        const maxPrice = Math.max(...priceHistory.map(d => d.close));
                        const y = 90 - ((data.close - minPrice) / (maxPrice - minPrice)) * 80;
                        return `${x}%,${y}%`;
                      }).join(' ')} 100%,100%`}
                    />
                  </>
                )}
              </svg>
              
              {/* Chart overlay info */}
              <div className="absolute top-4 left-4 space-y-1">
                <p className="text-xs text-muted-foreground">Volume: 1.2M</p>
                <p className="text-xs text-muted-foreground">High: ${formatPrice(currentPrice * 1.05)}</p>
                <p className="text-xs text-muted-foreground">Low: ${formatPrice(currentPrice * 0.95)}</p>
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          {userId && (
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="text-green-400">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="text-red-400">Sell</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4">
                <div className="stat-card p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Available Balance</span>
                      <span className="text-sm font-mono">
                        ${userBalance?.usdBalance?.toFixed(2) || '0.00'} USD
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount to Buy</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBuyAmount((userBalance?.usdBalance / currentPrice)?.toFixed(2) || "0")}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Total Cost: ${(parseFloat(buyAmount || "0") * currentPrice).toFixed(2)}
                    </div>
                    
                    <Button
                      onClick={handleBuy}
                      disabled={!buyAmount || parseFloat(buyAmount) <= 0 || buyTokensMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {buyTokensMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Buy {tokenSymbol}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div className="stat-card p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Available {tokenSymbol}</span>
                      <span className="text-sm font-mono">
                        {userBalance?.tokenBalance?.toFixed(4) || '0.0000'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount to Sell</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSellAmount(userBalance?.tokenBalance?.toFixed(4) || "0")}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Total Value: ${(parseFloat(sellAmount || "0") * currentPrice).toFixed(2)}
                    </div>
                    
                    <Button
                      onClick={handleSell}
                      disabled={!sellAmount || parseFloat(sellAmount) <= 0 || sellTokensMutation.isPending}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {sellTokensMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Sell {tokenSymbol}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-muted-foreground">24h Volume</p>
              <p className="font-semibold">$124.5K</p>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-xs text-muted-foreground">Holders</p>
              <p className="font-semibold">2,847</p>
            </div>
            <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-xs text-muted-foreground">Liquidity</p>
              <p className="font-semibold">$89.2K</p>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-xs text-muted-foreground">APY</p>
              <p className="font-semibold">12.4%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}