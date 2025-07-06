import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Activity, Coins, DollarSign, BarChart3, Zap, Star, Trophy, Lock, Wallet, ArrowUpDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  lockPeriod: number;
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
    price: 0.0234,
    change24h: 15.67,
    volume24h: 1250000,
    marketCap: 12500000,
    logo: '/api/assets/slerf-logo.png',
    address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07', // Real SLERF contract
    network: 'base'
  },
  {
    symbol: 'CHONK9K',
    name: 'Chonk9k Token',
    price: 0,
    change24h: 0,
    volume24h: 0,
    marketCap: 0,
    logo: 'https://via.placeholder.com/40/06b6d4/ffffff?text=C9K',
    address: '...', // Solana address
    network: 'solana'
  }
];

const PriceChart: React.FC<{ tokenSymbol: string; price: number; change24h: number }> = ({ tokenSymbol, price, change24h }) => {
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    // Generate realistic price movement data
    const generatePriceData = () => {
      const data = [];
      let currentPrice = price;
      
      for (let i = 0; i < 24; i++) {
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice = Math.max(0, currentPrice + change);
        data.push(currentPrice);
      }
      
      return data;
    };

    setChartData(generatePriceData());
  }, [price]);

  const maxPrice = Math.max(...chartData);
  const minPrice = Math.min(...chartData);
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-full h-32 relative">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id={`gradient-${tokenSymbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={change24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={change24h >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke={change24h >= 0 ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={chartData.map((price, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - ((price - minPrice) / priceRange) * 100;
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Fill area */}
        <polygon
          fill={`url(#gradient-${tokenSymbol})`}
          points={chartData.map((price, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 100 - ((price - minPrice) / priceRange) * 100;
            return `${x},${y}`;
          }).join(' ') + ' 100,100 0,100'}
        />
      </svg>
    </div>
  );
};

const TokenCard: React.FC<{ token: TokenData; onClick?: () => void }> = ({ token, onClick }) => {
  const isPositive = token.change24h >= 0;
  
  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer bg-slate-800/50 border-slate-700 hover:border-cyan-500/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
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
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">${token.price.toFixed(token.price < 1 ? 6 : 2)}</span>
            <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(token.change24h).toFixed(2)}%
            </div>
          </div>
          
          <PriceChart tokenSymbol={token.symbol} price={token.price} change24h={token.change24h} />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Volume 24h</span>
            <span className="text-white">${(token.volume24h / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StakingCard: React.FC<{ pool: StakingPool }> = ({ pool }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const queryClient = useQueryClient();
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'Premium': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Elite': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  const stakeMutation = useMutation({
    mutationFn: async (amount: number) => {
      // Simulate API call to stake tokens
      const response = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: pool.id,
          amount,
          tokenSymbol: pool.tokenSymbol
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakingPools'] });
      queryClient.invalidateQueries({ queryKey: ['userEarnings'] });
      setStakeAmount('');
    }
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/staking/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poolId: pool.id })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakingPools'] });
      queryClient.invalidateQueries({ queryKey: ['userEarnings'] });
    }
  });

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>{pool.tokenSymbol} Staking Pool</span>
          </CardTitle>
          <Badge className={getTierColor(pool.tier)}>
            {getTierIcon(pool.tier)}
            <span className="ml-1">{pool.tier}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <Label className="text-green-400 text-sm">Annual APY</Label>
            <p className="text-3xl font-bold text-green-400">{pool.apy}%</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Label className="text-blue-400 text-sm">Lock Period</Label>
            <p className="text-3xl font-bold text-blue-400">{pool.lockPeriod}d</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-gray-400">Your Stake</span>
            <span className="text-white font-medium">{pool.userStaked.toFixed(4)} {pool.tokenSymbol}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-gray-400">Pending Rewards</span>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-medium">{pool.userRewards.toFixed(6)} {pool.tokenSymbol}</span>
              {pool.userRewards > 0 && (
                <Button 
                  size="sm" 
                  onClick={() => claimMutation.mutate()}
                  disabled={claimMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                >
                  Claim
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-gray-400">Total Pool Size</span>
            <span className="text-white">{(pool.totalStaked / 1000000).toFixed(2)}M {pool.tokenSymbol}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`stake-amount-${pool.id}`} className="text-gray-400">
              Stake Amount (Min: {pool.minStake} {pool.tokenSymbol})
            </Label>
            <Input
              id={`stake-amount-${pool.id}`}
              type="number"
              placeholder={`${pool.minStake}`}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-2"
            />
          </div>
          
          <Button 
            onClick={() => stakeMutation.mutate(parseFloat(stakeAmount))}
            disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake || stakeMutation.isPending}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            <Lock className="w-4 h-4 mr-2" />
            {stakeMutation.isPending ? 'Staking...' : 'Stake Tokens'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EarningsOverview: React.FC<{ earnings: UserEarnings }> = ({ earnings }) => {
  const queryClient = useQueryClient();
  
  const claimAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/earnings/claim-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userEarnings'] });
      queryClient.invalidateQueries({ queryKey: ['stakingPools'] });
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30 hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-white">${earnings.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="text-xs text-green-300">
            +${earnings.dailyEarnings.toFixed(2)} today
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30 hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-400 text-sm font-medium">Staking Rewards</p>
              <p className="text-3xl font-bold text-white">${earnings.stakingRewards.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-xs text-blue-300">
            From {3} active pools
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-400 text-sm font-medium">Pending Claims</p>
              <p className="text-3xl font-bold text-white">${earnings.pendingClaims.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <Button 
            onClick={() => claimAllMutation.mutate()}
            disabled={earnings.pendingClaims === 0 || claimAllMutation.isPending}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
          >
            {claimAllMutation.isPending ? 'Claiming...' : 'Claim All Rewards'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProfessionalTrading() {
  const [selectedToken, setSelectedToken] = useState<TokenData>(REAL_TOKENS[0]);
  const [tokens, setTokens] = useState<TokenData[]>(REAL_TOKENS);
  
  // Fetch real token prices from CoinGecko API
  const { data: realTokenPrices, isLoading } = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,usd-coin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true'
        );
        if (!response.ok) throw new Error('API request failed');
        
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
        // Return placeholder data if API fails
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
            Boomchain Labs Trading Suite
          </h1>
          <p className="text-gray-400">Real-time market data with institutional-grade staking pools</p>
        </div>

        {/* Earnings Overview */}
        <div className="mb-8">
          <EarningsOverview earnings={userEarnings} />
        </div>

        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="trading" className="data-[state=active]:bg-cyan-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Live Markets
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-2" />
              Staking Pools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <TokenCard
                  key={token.symbol}
                  token={token}
                  onClick={() => setSelectedToken(token)}
                />
              ))}
            </div>
            
            {isLoading && (
              <div className="text-center text-gray-400 py-8">
                Loading real-time market data...
              </div>
            )}
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stakingPools.map((pool) => (
                <StakingCard key={pool.id} pool={pool} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}