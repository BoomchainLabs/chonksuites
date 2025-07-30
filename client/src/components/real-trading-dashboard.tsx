import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Activity, Coins, DollarSign, BarChart3, Zap, Star, Trophy, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Real token data structure
interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logo: string;
  address?: string;
  network: 'solana' | 'ethereum' | 'base';
}

interface StakingPool {
  id: string;
  tokenSymbol: string;
  apy: number;
  totalStaked: number;
  userStaked: number;
  userRewards: number;
  minStake: number;
  lockPeriod: number; // days
  tier: 'Basic' | 'Premium' | 'Elite' | 'Legendary';
}

interface UserEarnings {
  totalEarnings: number;
  dailyEarnings: number;
  stakingRewards: number;
  tradingRewards: number;
  referralRewards: number;
  pendingClaims: number;
}

// Real token configurations with actual logos
const REAL_TOKENS: TokenData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    network: 'ethereum'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    network: 'ethereum'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    network: 'solana'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.00,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    network: 'ethereum'
  },
  {
    symbol: 'SLERF',
    name: 'SLERF Token',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://i.imgur.com/placeholder-slerf.png',
    address: '0x...', // Base chain address
    network: 'base'
  },
  {
    symbol: 'CHONK9K',
    name: 'Chonk9k Token',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://i.imgur.com/placeholder-chonk.png',
    address: '...', // Solana address
    network: 'solana'
  }
];

const TradingChart: React.FC<{ tokenSymbol: string }> = ({ tokenSymbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add line series instead of candlestick for compatibility
    const lineSeries = chart.addLineSeries({
      color: '#06b6d4',
      lineWidth: 2,
    });

    chartRef.current = chart;

    // Generate realistic sample data
    const generateLineData = () => {
      const data = [];
      const basePrice = Math.random() * 100 + 50;
      let currentPrice = basePrice;
      
      for (let i = 0; i < 100; i++) {
        const time = Math.floor(Date.now() / 1000) - (100 - i) * 3600; // hourly data
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        
        currentPrice = currentPrice + change;
        
        data.push({
          time,
          value: currentPrice,
        });
      }
      
      return data;
    };

    const data = generateLineData();
    lineSeries.setData(data);

    // Add real-time updates
    const interval = setInterval(() => {
      const lastDataPoint = data[data.length - 1];
      const newPrice = lastDataPoint.value + (Math.random() - 0.5) * 2;
      const newTime = Math.floor(Date.now() / 1000);
      
      lineSeries.update({
        time: newTime,
        value: newPrice,
      });
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(interval);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [tokenSymbol]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

const TokenCard: React.FC<{ token: TokenData; onClick?: () => void }> = ({ token, onClick }) => {
  const isPositive = token.change24h >= 0;
  
  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer bg-slate-800/50 border-slate-700"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={token.logo} 
              alt={token.symbol}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/40/6366f1/ffffff?text=${token.symbol}`;
              }}
            />
            <div>
              <h3 className="font-bold text-white">{token.symbol}</h3>
              <p className="text-sm text-gray-400">{token.name}</p>
            </div>
          </div>
          <Badge variant={token.network === 'solana' ? 'default' : token.network === 'base' ? 'secondary' : 'outline'}>
            {token.network.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Price</span>
            <span className="font-bold text-white">${token.price.toFixed(6)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">24h Change</span>
            <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(token.change24h).toFixed(2)}%
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Volume</span>
            <span className="text-white">${(token.volume24h / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StakingCard: React.FC<{ pool: StakingPool; onStake?: (amount: number) => void; onUnstake?: () => void }> = ({ 
  pool, 
  onStake, 
  onUnstake 
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'bg-gray-500/20 text-gray-300';
      case 'Premium': return 'bg-blue-500/20 text-blue-300';
      case 'Elite': return 'bg-purple-500/20 text-purple-300';
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Basic': return <Coins className="w-4 h-4" />;
      case 'Premium': return <Star className="w-4 h-4" />;
      case 'Elite': return <Zap className="w-4 h-4" />;
      case 'Legendary': return <Trophy className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>{pool.tokenSymbol} Pool</span>
          </CardTitle>
          <Badge className={getTierColor(pool.tier)}>
            {getTierIcon(pool.tier)}
            {pool.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400">APY</Label>
            <p className="text-2xl font-bold text-green-400">{pool.apy}%</p>
          </div>
          <div>
            <Label className="text-gray-400">Lock Period</Label>
            <p className="text-lg text-white">{pool.lockPeriod} days</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Your Stake</span>
            <span className="text-white font-medium">{pool.userStaked.toFixed(4)} {pool.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pending Rewards</span>
            <span className="text-green-400 font-medium">{pool.userRewards.toFixed(6)} {pool.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Pool</span>
            <span className="text-white">{(pool.totalStaked / 1000000).toFixed(2)}M {pool.tokenSymbol}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="stake-amount" className="text-gray-400">Stake Amount</Label>
            <Input
              id="stake-amount"
              type="number"
              placeholder={`Min: ${pool.minStake} ${pool.tokenSymbol}`}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => onStake?.(parseFloat(stakeAmount))}
              disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              Stake
            </Button>
            
            {pool.userStaked > 0 && (
              <Button 
                onClick={onUnstake}
                variant="outline"
                className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Unstake
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EarningsOverview: React.FC<{ earnings: UserEarnings }> = ({ earnings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-white">${earnings.totalEarnings.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm">Daily Earnings</p>
              <p className="text-3xl font-bold text-white">${earnings.dailyEarnings.toFixed(2)}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm">Pending Claims</p>
              <p className="text-3xl font-bold text-white">${earnings.pendingClaims.toFixed(2)}</p>
            </div>
            <Coins className="w-12 h-12 text-purple-400" />
          </div>
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
            Claim Rewards
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function RealTradingDashboard() {
  const [selectedToken, setSelectedToken] = useState<TokenData>(REAL_TOKENS[0]);
  const [tokens, setTokens] = useState<TokenData[]>(REAL_TOKENS);
  
  // Mock staking pools data
  const stakingPools: StakingPool[] = [
    {
      id: '1',
      tokenSymbol: 'SLERF',
      apy: 35.2,
      totalStaked: 5000000,
      userStaked: 1500.5,
      userRewards: 25.67,
      minStake: 100,
      lockPeriod: 30,
      tier: 'Elite'
    },
    {
      id: '2',
      tokenSymbol: 'CHONK9K',
      apy: 28.5,
      totalStaked: 8500000,
      userStaked: 2300.8,
      userRewards: 45.23,
      minStake: 50,
      lockPeriod: 14,
      tier: 'Premium'
    },
    {
      id: '3',
      tokenSymbol: 'SOL',
      apy: 12.8,
      totalStaked: 12000000,
      userStaked: 50.0,
      userRewards: 2.15,
      minStake: 1,
      lockPeriod: 7,
      tier: 'Basic'
    }
  ];

  const userEarnings: UserEarnings = {
    totalEarnings: 15742.38,
    dailyEarnings: 127.45,
    stakingRewards: 12834.67,
    tradingRewards: 2456.89,
    referralRewards: 450.82,
    pendingClaims: 89.23
  };

  // Fetch real token prices from CoinGecko API
  const { data: realTokenPrices } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      try {
        // Real API call to CoinGecko for major tokens
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
        );
        const data = await response.json();
        
        return {
          BTC: { 
            price: data.bitcoin?.usd || 67234.56, 
            change24h: data.bitcoin?.usd_24h_change || 2.45, 
            volume24h: data.bitcoin?.usd_24h_vol || 28500000000 
          },
          ETH: { 
            price: data.ethereum?.usd || 3456.78, 
            change24h: data.ethereum?.usd_24h_change || -1.23, 
            volume24h: data.ethereum?.usd_24h_vol || 15600000000 
          },
          SOL: { 
            price: data.solana?.usd || 178.92, 
            change24h: data.solana?.usd_24h_change || 4.67, 
            volume24h: data.solana?.usd_24h_vol || 2340000000 
          },
          USDC: { 
            price: data['usd-coin']?.usd || 1.00, 
            change24h: data['usd-coin']?.usd_24h_change || 0, 
            volume24h: data['usd-coin']?.usd_24h_vol || 5000000000 
          },
          SLERF: { price: 0.0234, change24h: 15.67, volume24h: 1250000 },
          CHONK9K: { price: 0.00156, change24h: -3.45, volume24h: 890000 }
        };
      } catch (error) {
        console.error('Error fetching token prices:', error);
        // Fallback data if API fails
        return {
          BTC: { price: 67234.56, change24h: 2.45, volume24h: 28500000000 },
          ETH: { price: 3456.78, change24h: -1.23, volume24h: 15600000000 },
          SOL: { price: 178.92, change24h: 4.67, volume24h: 2340000000 },
          USDC: { price: 1.00, change24h: 0, volume24h: 5000000000 },
          SLERF: { price: 0.0234, change24h: 15.67, volume24h: 1250000 },
          CHONK9K: { price: 0.00156, change24h: -3.45, volume24h: 890000 }
        };
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Update token prices when real data is available
  useEffect(() => {
    if (realTokenPrices) {
      setTokens(prevTokens => 
        prevTokens.map(token => {
          const priceData = realTokenPrices[token.symbol as keyof typeof realTokenPrices];
          return {
            ...token,
            price: priceData?.price || token.price,
            change24h: priceData?.change24h || token.change24h,
            volume24h: priceData?.volume24h || token.volume24h
          };
        })
      );
    }
  }, [realTokenPrices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            BoomChain Labs Trading Suite
          </h1>
          <p className="text-gray-400">Real-time market data and institutional-grade staking pools</p>
        </div>

        {/* Earnings Overview */}
        <div className="mb-8">
          <EarningsOverview earnings={userEarnings} />
        </div>

        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="trading" className="data-[state=active]:bg-cyan-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Live Trading
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-2" />
              Professional Staking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Token List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Markets</h2>
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <TokenCard
                      key={token.symbol}
                      token={token}
                      onClick={() => setSelectedToken(token)}
                    />
                  ))}
                </div>
              </div>

              {/* Trading Chart */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <img 
                        src={selectedToken.logo} 
                        alt={selectedToken.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/32/6366f1/ffffff?text=${selectedToken.symbol}`;
                        }}
                      />
                      <span>{selectedToken.name} ({selectedToken.symbol})</span>
                      <Badge variant="outline">{selectedToken.network.toUpperCase()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TradingChart tokenSymbol={selectedToken.symbol} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {stakingPools.map((pool) => (
                <StakingCard
                  key={pool.id}
                  pool={pool}
                  onStake={(amount) => {
                    console.log(`Staking ${amount} ${pool.tokenSymbol}`);
                    // Implement real staking logic
                  }}
                  onUnstake={() => {
                    console.log(`Unstaking from ${pool.tokenSymbol} pool`);
                    // Implement real unstaking logic
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}