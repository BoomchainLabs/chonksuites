import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  TrendingUp, 
  Lock, 
  Unlock, 
  Timer, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Shield,
  Percent,
  Clock,
  Gift
} from 'lucide-react';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockPeriod: number;
  rewards: string;
  network: string;
  address: string;
}

interface UserStake {
  poolId: string;
  token: string;
  amount: number;
  stakedAt: Date;
  estimatedRewards: number;
  apy: number;
}

export default function StakingPlatform() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staking pools
  const { data: stakingPools, isLoading: poolsLoading } = useQuery({
    queryKey: ['/api/staking/pools'],
  });

  // Fetch user stakes
  const { data: userStakes, isLoading: stakesLoading } = useQuery({
    queryKey: ['/api/staking/user-stakes'],
  });

  // Stake tokens mutation
  const stakeMutation = useMutation({
    mutationFn: async ({ poolId, amount, token }: { poolId: string; amount: number; token: string }) => {
      const response = await apiRequest('POST', '/api/staking/stake', {
        poolId,
        amount,
        token
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user-stakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Staking Successful!",
        description: `Successfully staked ${data.amount} ${data.token} tokens`,
      });
      setStakeAmount('');
    },
    onError: (error: any) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Unstake tokens mutation
  const unstakeMutation = useMutation({
    mutationFn: async ({ poolId, amount, token }: { poolId: string; amount: number; token: string }) => {
      const response = await apiRequest('POST', '/api/staking/unstake', {
        poolId,
        amount,
        token
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user-stakes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Unstaking Successful!",
        description: `Successfully unstaked ${data.amount} ${data.token} tokens and earned ${data.rewardsEarned.toFixed(4)} rewards`,
      });
      setUnstakeAmount('');
    },
    onError: (error: any) => {
      toast({
        title: "Unstaking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleStake = (pool: StakingPool) => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }

    if (amount < pool.minStake) {
      toast({
        title: "Minimum Stake Required",
        description: `Minimum stake for ${pool.token} is ${pool.minStake} tokens`,
        variant: "destructive",
      });
      return;
    }

    stakeMutation.mutate({
      poolId: pool.id,
      amount,
      token: pool.token
    });
  };

  const handleUnstake = (stake: UserStake) => {
    const amount = parseFloat(unstakeAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid unstaking amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > stake.amount) {
      toast({
        title: "Insufficient Stake",
        description: `You can only unstake up to ${stake.amount} ${stake.token} tokens`,
        variant: "destructive",
      });
      return;
    }

    unstakeMutation.mutate({
      poolId: stake.poolId,
      amount,
      token: stake.token
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const calculateDaysStaked = (stakedAt: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(stakedAt).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (poolsLoading || stakesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading staking platform...</p>
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
            Token Staking Platform
          </h1>
          <p className="text-gray-300 text-lg">
            Stake your $SLERF and $CHONK9K tokens to earn passive rewards
          </p>
        </motion.div>

        <Tabs defaultValue="pools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="pools" className="data-[state=active]:bg-purple-600">
              Staking Pools
            </TabsTrigger>
            <TabsTrigger value="my-stakes" className="data-[state=active]:bg-purple-600">
              My Stakes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {stakingPools?.map((pool: StakingPool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pool.token === 'SLERF' ? 0.1 : 0.2 }}
                >
                  <Card className={`bg-gradient-to-br ${
                    pool.token === 'SLERF' 
                      ? 'from-purple-600/20 to-cyan-600/20 border-purple-500/30' 
                      : 'from-orange-600/20 to-yellow-600/20 border-orange-500/30'
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {pool.token === 'SLERF' ? '🏄' : '🐱'}
                          </span>
                          <div>
                            <h3 className="text-xl font-bold">{pool.name}</h3>
                            <Badge className={`${
                              pool.token === 'SLERF' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-orange-500/20 text-orange-300'
                            }`}>
                              {pool.network}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-2xl font-bold">{pool.apy}%</span>
                          </div>
                          <span className="text-sm text-gray-400">APY</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Total Staked:</span>
                          <div className="font-semibold">{formatNumber(pool.totalStaked)} {pool.token}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Min Stake:</span>
                          <div className="font-semibold">{pool.minStake} {pool.token}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <Shield className="w-4 h-4" />
                        <span>{pool.rewards}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder={`Amount to stake (min ${pool.minStake})`}
                            value={selectedPool === pool.id ? stakeAmount : ''}
                            onChange={(e) => {
                              setSelectedPool(pool.id);
                              setStakeAmount(e.target.value);
                            }}
                            className="bg-slate-700/50 border-slate-600"
                          />
                          <Button
                            onClick={() => handleStake(pool)}
                            disabled={stakeMutation.isPending}
                            className={`${
                              pool.token === 'SLERF' 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                          >
                            {stakeMutation.isPending ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Staking...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Lock className="w-4 h-4" />
                                <span>Stake</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-stakes" className="space-y-6">
            {userStakes?.length > 0 ? (
              <div className="space-y-4">
                {userStakes.map((stake: UserStake, index: number) => (
                  <motion.div
                    key={`${stake.poolId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`bg-gradient-to-r ${
                      stake.token === 'SLERF' 
                        ? 'from-purple-600/10 to-cyan-600/10 border-purple-500/30' 
                        : 'from-orange-600/10 to-yellow-600/10 border-orange-500/30'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl">
                              {stake.token === 'SLERF' ? '🏄' : '🐱'}
                            </span>
                            <div>
                              <h3 className="text-xl font-bold">{stake.token} Stake</h3>
                              <div className="flex items-center space-x-3 text-sm text-gray-400">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{calculateDaysStaked(stake.stakedAt)} days</span>
                                </div>
                                <div className="flex items-center">
                                  <Percent className="w-4 h-4 mr-1" />
                                  <span>{stake.apy}% APY</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold">{stake.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-400">{stake.token} staked</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-center text-green-400 mb-1">
                              <Gift className="w-4 h-4 mr-1" />
                              <span className="text-sm">Pending Rewards</span>
                            </div>
                            <div className="font-bold">{stake.estimatedRewards.toFixed(4)} {stake.token}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Amount to unstake"
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                                className="bg-slate-700/50 border-slate-600"
                                max={stake.amount}
                              />
                              <Button
                                onClick={() => handleUnstake(stake)}
                                disabled={unstakeMutation.isPending}
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                              >
                                {unstakeMutation.isPending ? (
                                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <Unlock className="w-4 h-4" />
                                    <span>Unstake</span>
                                  </div>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <Coins className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Active Stakes</h3>
                  <p className="text-gray-400 mb-6">
                    Start staking your tokens to earn passive rewards
                  </p>
                  <Button
                    onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]');
                      const poolsTab = tabsList?.querySelector('[value="pools"]') as HTMLElement;
                      poolsTab?.click();
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explore Staking Pools
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-500"
        >
          <p>Flexible staking • No lock periods • Compound rewards automatically</p>
        </motion.div>
      </div>
    </div>
  );
}