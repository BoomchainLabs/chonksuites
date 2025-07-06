import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import MobileNavigation from '@/components/mobile-navigation';
import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  Zap, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Timer,
  Shield,
  Activity
} from 'lucide-react';

interface SwapPair {
  id: string;
  tokenA: {
    symbol: string;
    name: string;
    logo: string;
  };
  tokenB: {
    symbol: string;
    name: string;
    logo: string;
  };
  rate: number;
  liquidity: number;
  volume24h: number;
  fee: number;
}

interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}

export default function TokenSwapDApp() {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [selectedPair, setSelectedPair] = useState<SwapPair | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch swap pairs
  const { data: swapPairs, isLoading: pairsLoading } = useQuery({
    queryKey: ['/api/swap/pairs'],
  });

  // Fetch user token balances
  const { data: tokenBalances, isLoading: balancesLoading } = useQuery({
    queryKey: ['/api/token-balances'],
  });

  // Execute swap mutation
  const swapMutation = useMutation({
    mutationFn: async ({ pairId, amountIn, tokenIn, amountOut, tokenOut }: {
      pairId: string;
      amountIn: number;
      tokenIn: string;
      amountOut: number;
      tokenOut: string;
    }) => {
      const response = await apiRequest('POST', '/api/swap/execute', {
        pairId,
        amountIn,
        tokenIn,
        amountOut,
        tokenOut
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/token-balances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Swap Successful!",
        description: `Successfully swapped ${data.amountIn} ${data.tokenIn} for ${data.amountOut} ${data.tokenOut}`,
      });
      setAmountIn('');
      setAmountOut('');
    },
    onError: (error: any) => {
      toast({
        title: "Swap Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate output amount when input changes
  useEffect(() => {
    if (selectedPair && amountIn) {
      const inputAmount = parseFloat(amountIn);
      if (!isNaN(inputAmount) && inputAmount > 0) {
        const rate = isReversed ? (1 / selectedPair.rate) : selectedPair.rate;
        const outputAmount = inputAmount * rate;
        const slippageAdjusted = outputAmount * (1 - slippage / 100);
        setAmountOut(slippageAdjusted.toFixed(6));
      } else {
        setAmountOut('');
      }
    }
  }, [amountIn, selectedPair, isReversed, slippage]);

  const handleSwapTokens = () => {
    setIsReversed(!isReversed);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const executeSwap = () => {
    if (!selectedPair || !amountIn || !amountOut) return;

    const tokenIn = isReversed ? selectedPair.tokenB.symbol : selectedPair.tokenA.symbol;
    const tokenOut = isReversed ? selectedPair.tokenA.symbol : selectedPair.tokenB.symbol;

    swapMutation.mutate({
      pairId: selectedPair.id,
      amountIn: parseFloat(amountIn),
      tokenIn,
      amountOut: parseFloat(amountOut),
      tokenOut
    });
  };

  const getTokenBalance = (symbol: string): number => {
    const balance = tokenBalances?.find((t: any) => t.tokenSymbol === symbol)?.balance;
    return balance || 0;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const getCurrentTokenA = () => isReversed ? selectedPair?.tokenB : selectedPair?.tokenA;
  const getCurrentTokenB = () => isReversed ? selectedPair?.tokenA : selectedPair?.tokenB;

  if (pairsLoading || balancesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading swap interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Token Swap DApp
          </h1>
          <p className="text-gray-300 text-lg">
            Swap $SLERF and $CHONK9K tokens with real-time rates and low fees
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Pair Selection */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Trading Pair</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {swapPairs?.map((pair: SwapPair) => (
                  <motion.div
                    key={pair.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPair?.id === pair.id
                        ? 'bg-purple-600/20 border-purple-500'
                        : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedPair(pair)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{pair.tokenA.logo}</span>
                          <span className="font-bold">{pair.tokenA.symbol}</span>
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          <span className="text-2xl">{pair.tokenB.logo}</span>
                          <span className="font-bold">{pair.tokenB.symbol}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          1 {pair.tokenA.symbol} = {pair.rate.toFixed(6)} {pair.tokenB.symbol}
                        </div>
                        <div className="text-sm text-gray-400">
                          24h Vol: ${formatNumber(pair.volume24h)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-400" />
                    Swap Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Slippage Tolerance
                    </label>
                    <div className="flex space-x-2">
                      {[0.1, 0.5, 1.0, 2.0].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                          className="flex-1"
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        type="number"
                        value={slippage}
                        onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                        className="w-20 bg-slate-700/50 border-slate-600"
                        step="0.1"
                        min="0.1"
                        max="10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Swap Interface */}
          {selectedPair && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Swap Tokens</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <Activity className="w-3 h-3 mr-1" />
                      Live Rates
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Input Token */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">You Pay</span>
                      <span className="text-sm text-gray-400">
                        Balance: {getTokenBalance(getCurrentTokenA()?.symbol || '').toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCurrentTokenA()?.logo}</span>
                        <span className="font-bold text-lg">{getCurrentTokenA()?.symbol}</span>
                      </div>
                      <Input
                        type="number"
                        value={amountIn}
                        onChange={(e) => setAmountIn(e.target.value)}
                        placeholder="0.0"
                        className="flex-1 bg-transparent border-none text-right text-xl font-bold"
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSwapTokens}
                      variant="outline"
                      size="sm"
                      className="rounded-full p-2 border-purple-500 hover:bg-purple-500/20"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Output Token */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">You Receive</span>
                      <span className="text-sm text-gray-400">
                        Balance: {getTokenBalance(getCurrentTokenB()?.symbol || '').toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCurrentTokenB()?.logo}</span>
                        <span className="font-bold text-lg">{getCurrentTokenB()?.symbol}</span>
                      </div>
                      <Input
                        type="number"
                        value={amountOut}
                        readOnly
                        placeholder="0.0"
                        className="flex-1 bg-transparent border-none text-right text-xl font-bold text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Swap Details */}
                  {amountIn && amountOut && (
                    <div className="bg-slate-700/20 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Rate</span>
                        <span>
                          1 {getCurrentTokenA()?.symbol} ≈{' '}
                          {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)}{' '}
                          {getCurrentTokenB()?.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fee ({selectedPair.fee}%)</span>
                        <span>${(parseFloat(amountIn) * selectedPair.fee / 100 * 0.02).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Slippage Tolerance</span>
                        <span>{slippage}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Minimum Received</span>
                        <span>
                          {(parseFloat(amountOut) * (1 - slippage / 100)).toFixed(6)}{' '}
                          {getCurrentTokenB()?.symbol}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Swap Button */}
                  <Button
                    onClick={executeSwap}
                    disabled={
                      !amountIn || 
                      !amountOut || 
                      parseFloat(amountIn) <= 0 || 
                      parseFloat(amountIn) > getTokenBalance(getCurrentTokenA()?.symbol || '') ||
                      swapMutation.isPending
                    }
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg font-bold"
                  >
                    {swapMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Swapping...</span>
                      </div>
                    ) : !amountIn || parseFloat(amountIn) <= 0 ? (
                      'Enter Amount'
                    ) : parseFloat(amountIn) > getTokenBalance(getCurrentTokenA()?.symbol || '') ? (
                      'Insufficient Balance'
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Swap Tokens</span>
                      </div>
                    )}
                  </Button>

                  {/* Warning/Info */}
                  <div className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div className="text-sm text-yellow-300">
                      <p className="font-medium mb-1">Important Information</p>
                      <p>
                        This is a simulated swap interface. In production, this would interact with real DEX smart contracts 
                        like Uniswap (for $SLERF) and Jupiter (for $CHONK9K).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        ${formatNumber(selectedPair.liquidity)}
                      </div>
                      <div className="text-sm text-gray-400">Total Liquidity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        ${formatNumber(selectedPair.volume24h)}
                      </div>
                      <div className="text-sm text-gray-400">24h Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {selectedPair.fee}%
                      </div>
                      <div className="text-sm text-gray-400">Trading Fee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {selectedPair.rate.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-400">Current Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}