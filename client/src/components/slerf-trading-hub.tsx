import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Activity, Coins, DollarSign, BarChart3, Zap, Star, Trophy, Lock, ArrowUpDown, Target, Flame } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface SlerfData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  circulating: number;
  holders: number;
  network: 'base';
  contractAddress: string;
}

interface SlerfStakingPool {
  id: string;
  name: string;
  apy: number;
  totalStaked: number;
  userStaked: number;
  userRewards: number;
  minStake: number;
  lockPeriod: number;
  tier: 'Basic' | 'Premium' | 'Elite' | 'Legendary';
  multiplier: number;
  isActive: boolean;
}

interface TradingPair {
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
}

const SlerfLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; animated?: boolean }> = ({ size = 'md', animated = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div 
      className={`${sizeClasses[size]} bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center border-2 border-purple-400/30`}
      animate={animated ? { 
        scale: [1, 1.05, 1], 
        boxShadow: [
          '0 0 0 0 rgba(168, 85, 247, 0.4)',
          '0 0 0 10px rgba(168, 85, 247, 0)',
          '0 0 0 0 rgba(168, 85, 247, 0)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className={`font-bold text-white ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'}`}>
        SLERF
      </span>
    </motion.div>
  );
};

const SlerfPriceChart: React.FC<{ data: SlerfData }> = ({ data }) => {
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    // Generate realistic SLERF price movement data
    const generateSlerfData = () => {
      const dataPoints = [];
      let currentPrice = data.price;
      
      for (let i = 0; i < 24; i++) {
        const volatility = 0.15; // Higher volatility for meme tokens
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice = Math.max(0.001, currentPrice + change);
        dataPoints.push(currentPrice);
      }
      
      return dataPoints;
    };

    setChartData(generateSlerfData());
  }, [data.price]);

  const maxPrice = Math.max(...chartData);
  const minPrice = Math.min(...chartData);
  const priceRange = maxPrice - minPrice;
  const isPositive = data.change24h >= 0;

  return (
    <div className="w-full h-48 relative">
      <div className="absolute top-0 left-0 z-10 flex items-center space-x-2">
        <SlerfLogo size="sm" animated />
        <div>
          <div className="text-2xl font-bold text-white">${data.price.toFixed(6)}</div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="slerf-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Price line with glow effect */}
        <polyline
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          filter="drop-shadow(0 0 4px #8b5cf6)"
          points={chartData.map((price, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 30 + ((maxPrice - price) / priceRange) * 70;
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Fill area */}
        <polygon
          fill="url(#slerf-gradient)"
          points={chartData.map((price, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = 30 + ((maxPrice - price) / priceRange) * 70;
            return `${x},${y}`;
          }).join(' ') + ' 100,100 0,100'}
        />
      </svg>
    </div>
  );
};

const SlerfStakingCard: React.FC<{ pool: SlerfStakingPool }> = ({ pool }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const queryClient = useQueryClient();
  
  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'from-gray-600 to-gray-700';
      case 'Premium': return 'from-blue-600 to-blue-700';
      case 'Elite': return 'from-purple-600 to-purple-700';
      case 'Legendary': return 'from-yellow-600 to-yellow-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Basic': return <Coins className="w-5 h-5" />;
      case 'Premium': return <Star className="w-5 h-5" />;
      case 'Elite': return <Zap className="w-5 h-5" />;
      case 'Legendary': return <Trophy className="w-5 h-5" />;
      default: return <Coins className="w-5 h-5" />;
    }
  };

  const stakeMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/slerf/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: pool.id,
          amount,
          tokenSymbol: 'SLERF'
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slerfPools'] });
      setStakeAmount('');
    }
  });

  const dailyRewards = (pool.userStaked * (pool.apy / 100) * pool.multiplier) / 365;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 hover:border-purple-400/50 transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SlerfLogo size="sm" />
              <div>
                <CardTitle className="text-white text-lg">{pool.name}</CardTitle>
                <p className="text-sm text-purple-300">SLERF Staking Pool</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${getTierGradient(pool.tier)} text-white border-0`}>
              {getTierIcon(pool.tier)}
              <span className="ml-1">{pool.tier}</span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Label className="text-purple-400 text-xs">APY</Label>
              <p className="text-2xl font-bold text-purple-300">{pool.apy}%</p>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Label className="text-purple-400 text-xs">Multiplier</Label>
              <p className="text-2xl font-bold text-purple-300">{pool.multiplier}x</p>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Label className="text-purple-400 text-xs">Lock Days</Label>
              <p className="text-2xl font-bold text-purple-300">{pool.lockPeriod}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <span className="text-gray-400">Your Stake</span>
              <span className="text-purple-300 font-medium">{pool.userStaked.toLocaleString()} SLERF</span>
            </div>
            <div className="flex justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <span className="text-gray-400">Pending Rewards</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 font-medium">{pool.userRewards.toFixed(6)} SLERF</span>
                <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-1">
                  ${(pool.userRewards * 0.0234).toFixed(2)}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <span className="text-gray-400">Daily Rewards</span>
              <span className="text-yellow-400 font-medium">{dailyRewards.toFixed(6)} SLERF</span>
            </div>
            <div className="flex justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <span className="text-gray-400">Pool TVL</span>
              <span className="text-white">{(pool.totalStaked / 1000000).toFixed(2)}M SLERF</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor={`slerf-stake-${pool.id}`} className="text-purple-400">
                Stake Amount (Min: {pool.minStake.toLocaleString()} SLERF)
              </Label>
              <Input
                id={`slerf-stake-${pool.id}`}
                type="number"
                placeholder={pool.minStake.toString()}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-purple-900/20 border-purple-600/30 text-white mt-2"
              />
            </div>
            
            <Button 
              onClick={() => stakeMutation.mutate(parseFloat(stakeAmount))}
              disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake || stakeMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Lock className="w-4 h-4 mr-2" />
              {stakeMutation.isPending ? 'Staking...' : 'Stake SLERF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SlerfTradingPairs: React.FC = () => {
  const tradingPairs: TradingPair[] = [
    { pair: 'SLERF/USDC', price: 0.0234, change24h: 15.67, volume24h: 1250000, liquidity: 450000 },
    { pair: 'SLERF/ETH', price: 0.0000068, change24h: 12.34, volume24h: 890000, liquidity: 320000 },
    { pair: 'SLERF/SOL', price: 0.000131, change24h: 18.92, volume24h: 670000, liquidity: 280000 },
    { pair: 'SLERF/WBTC', price: 0.00000035, change24h: 8.45, volume24h: 340000, liquidity: 150000 }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
        <ArrowUpDown className="w-5 h-5 text-purple-400" />
        <span>SLERF Trading Pairs</span>
      </h3>
      
      <div className="grid gap-3">
        {tradingPairs.map((pair) => (
          <Card key={pair.pair} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SlerfLogo size="sm" />
                  <div>
                    <h4 className="font-bold text-white">{pair.pair}</h4>
                    <p className="text-sm text-gray-400">${pair.price.toFixed(8)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{pair.change24h.toFixed(2)}%
                  </div>
                  <p className="text-xs text-gray-400">Vol: ${(pair.volume24h / 1000).toFixed(0)}k</p>
                </div>
                
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Trade
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function SlerfTradingHub() {
  const slerfData: SlerfData = {
    price: 0.0234,
    change24h: 15.67,
    volume24h: 1250000,
    marketCap: 12500000,
    circulating: 534000000,
    holders: 15420,
    network: 'base',
    contractAddress: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07'
  };

  const stakingPools: SlerfStakingPool[] = [
    {
      id: 'slerf-elite',
      name: 'Elite SLERF Pool',
      apy: 35.2,
      totalStaked: 5000000,
      userStaked: 15000,
      userRewards: 125.67,
      minStake: 1000,
      lockPeriod: 30,
      tier: 'Elite',
      multiplier: 2.5,
      isActive: true
    },
    {
      id: 'slerf-premium',
      name: 'Premium SLERF Pool',
      apy: 28.5,
      totalStaked: 8500000,
      userStaked: 8500,
      userRewards: 68.23,
      minStake: 500,
      lockPeriod: 14,
      tier: 'Premium',
      multiplier: 1.8,
      isActive: true
    },
    {
      id: 'slerf-legendary',
      name: 'Legendary SLERF Pool',
      apy: 45.8,
      totalStaked: 2000000,
      userStaked: 25000,
      userRewards: 234.56,
      minStake: 5000,
      lockPeriod: 90,
      tier: 'Legendary',
      multiplier: 3.5,
      isActive: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <SlerfLogo size="lg" animated />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                SLERF Trading Hub
              </h1>
              <p className="text-gray-400">Advanced SLERF token ecosystem on Base Chain</p>
            </div>
          </div>
          
          {/* SLERF Price Display */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 mb-6">
            <CardContent className="p-6">
              <SlerfPriceChart data={slerfData} />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-purple-400">Market Cap</p>
                  <p className="text-lg font-bold text-white">${(slerfData.marketCap / 1000000).toFixed(2)}M</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-400">24h Volume</p>
                  <p className="text-lg font-bold text-white">${(slerfData.volume24h / 1000).toFixed(0)}k</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-400">Holders</p>
                  <p className="text-lg font-bold text-white">{slerfData.holders.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-purple-400">Network</p>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Base Chain
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="staking" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-2" />
              SLERF Staking
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Trading Pairs
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-green-600">
              <Target className="w-4 h-4 mr-2" />
              Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stakingPools.map((pool) => (
                <SlerfStakingCard key={pool.id} pool={pool} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <SlerfTradingPairs />
              </div>
              <div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span>Quick Trade</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-400">You Pay</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input placeholder="0.00" className="bg-slate-700 border-slate-600 text-white" />
                        <Button variant="outline" className="border-slate-600 text-white">USDC</Button>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-gray-400">You Receive</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input placeholder="0.00" className="bg-slate-700 border-slate-600 text-white" />
                        <Button variant="outline" className="border-purple-600 text-purple-300">SLERF</Button>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Swap Tokens
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>SLERF Governance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Stake SLERF tokens to participate in governance decisions and earn voting power in the Boomchain Labs DAO.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm">Your Voting Power</p>
                    <p className="text-2xl font-bold text-white">48,500</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm">Active Proposals</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm">Total Rewards</p>
                    <p className="text-2xl font-bold text-white">428 SLERF</p>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  View Governance Portal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}