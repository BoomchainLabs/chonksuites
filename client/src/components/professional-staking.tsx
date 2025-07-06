import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  Calendar,
  Coins,
  Crown,
  Star,
  Zap,
  Timer,
  Trophy,
  Target,
  Flame
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface StakingPool {
  id: string;
  tokenSymbol: "SLERF" | "CHONK9K";
  name: string;
  apy: number;
  minStakeAmount: number;
  maxStakeAmount?: number;
  lockPeriodDays: number;
  totalStaked: number;
  userStaked: number;
  userRewards: number;
  tier: "Basic" | "Premium" | "Elite" | "Legendary";
  isActive: boolean;
  nextUnlockDate?: Date;
  multiplier: number;
  earlyUnstakePenalty: number;
}

interface ProfessionalStakingProps {
  userId: string;
}

export default function ProfessionalStaking({ userId }: ProfessionalStakingProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedTab, setSelectedTab] = useState("pools");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Professional staking pools with tier system
  const stakingPools: StakingPool[] = [
    {
      id: "slerf-basic",
      tokenSymbol: "SLERF",
      name: "SLERF Basic Pool",
      apy: 12,
      minStakeAmount: 1000,
      maxStakeAmount: 50000,
      lockPeriodDays: 30,
      totalStaked: 2847392,
      userStaked: 0,
      userRewards: 0,
      tier: "Basic",
      isActive: true,
      multiplier: 1,
      earlyUnstakePenalty: 5,
    },
    {
      id: "slerf-premium",
      tokenSymbol: "SLERF", 
      name: "SLERF Premium Pool",
      apy: 18,
      minStakeAmount: 10000,
      maxStakeAmount: 200000,
      lockPeriodDays: 90,
      totalStaked: 1203847,
      userStaked: 0,
      userRewards: 0,
      tier: "Premium",
      isActive: true,
      multiplier: 1.5,
      earlyUnstakePenalty: 10,
    },
    {
      id: "slerf-elite",
      tokenSymbol: "SLERF",
      name: "SLERF Elite Pool",
      apy: 25,
      minStakeAmount: 50000,
      maxStakeAmount: 1000000,
      lockPeriodDays: 180,
      totalStaked: 584739,
      userStaked: 0,
      userRewards: 0,
      tier: "Elite",
      isActive: true,
      multiplier: 2,
      earlyUnstakePenalty: 15,
    },
    {
      id: "chonk9k-basic",
      tokenSymbol: "CHONK9K",
      name: "CHONK9K Basic Pool",
      apy: 15,
      minStakeAmount: 5000,
      maxStakeAmount: 100000,
      lockPeriodDays: 30,
      totalStaked: 4583920,
      userStaked: 0,
      userRewards: 0,
      tier: "Basic",
      isActive: true,
      multiplier: 1,
      earlyUnstakePenalty: 5,
    },
    {
      id: "chonk9k-premium",
      tokenSymbol: "CHONK9K",
      name: "CHONK9K Premium Pool",
      apy: 22,
      minStakeAmount: 25000,
      maxStakeAmount: 500000,
      lockPeriodDays: 90,
      totalStaked: 2847583,
      userStaked: 0,
      userRewards: 0,
      tier: "Premium",
      isActive: true,
      multiplier: 1.5,
      earlyUnstakePenalty: 10,
    },
    {
      id: "chonk9k-legendary",
      tokenSymbol: "CHONK9K",
      name: "CHONK9K Legendary Pool",
      apy: 35,
      minStakeAmount: 100000,
      lockPeriodDays: 365,
      totalStaked: 1048576,
      userStaked: 0,
      userRewards: 0,
      tier: "Legendary",
      isActive: true,
      multiplier: 3,
      earlyUnstakePenalty: 25,
    }
  ];

  const { data: userStakingData, isLoading } = useQuery({
    queryKey: ['/api/staking/user', userId],
    staleTime: 30000,
  });

  // Stake tokens mutation
  const stakeTokens = useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: number }) => {
      const response = await apiRequest('POST', '/api/staking/stake', {
        userId,
        poolId,
        amount,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user'] });
      toast({
        title: "Tokens Staked Successfully!",
        description: "Your tokens are now earning rewards.",
      });
      setStakeAmount("");
      setSelectedPool(null);
    },
    onError: (error) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Unstake tokens mutation
  const unstakeTokens = useMutation({
    mutationFn: async ({ poolId }: { poolId: string }) => {
      const response = await apiRequest('POST', '/api/staking/unstake', {
        userId,
        poolId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user'] });
      toast({
        title: "Tokens Unstaked!",
        description: "Your tokens and rewards have been returned.",
      });
    },
    onError: (error) => {
      toast({
        title: "Unstaking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Claim rewards mutation
  const claimRewards = useMutation({
    mutationFn: async ({ poolId }: { poolId: string }) => {
      const response = await apiRequest('POST', '/api/staking/claim', {
        userId,
        poolId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user'] });
      toast({
        title: "Rewards Claimed!",
        description: "Your staking rewards have been added to your balance.",
      });
    }
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Legendary": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Elite": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "Premium": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-green-400 bg-green-500/10 border-green-500/20";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Legendary": return <Crown className="w-4 h-4" />;
      case "Elite": return <Trophy className="w-4 h-4" />;
      case "Premium": return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getTokenColor = (symbol: string) => {
    return symbol === "SLERF" ? "text-purple-400" : "text-cyan-400";
  };

  const calculateDailyRewards = (pool: StakingPool, amount: number) => {
    return (amount * (pool.apy / 100) * pool.multiplier) / 365;
  };

  const totalStakedValue = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
  const totalRewardsValue = stakingPools.reduce((sum, pool) => sum + pool.userRewards, 0);

  return (
    <Card className="glass-card border-green-500/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Lock className="w-6 h-6 mr-3 text-green-400" />
          Professional Staking Platform
          <Badge className="ml-3 bg-green-500/10 text-green-400 border-green-500/20">
            Enterprise
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="pools" className="data-[state=active]:bg-green-500/20">
              Staking Pools
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-500/20">
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="bg-green-500/5 border border-green-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Staked</p>
                    <p className="text-xl font-bold text-green-400">
                      {totalStakedValue.toLocaleString()} Tokens
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Rewards</p>
                    <p className="text-xl font-bold text-purple-400">
                      {totalRewardsValue.toLocaleString()} Tokens
                    </p>
                  </div>
                  <Coins className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Pools</p>
                    <p className="text-xl font-bold text-cyan-400">
                      {stakingPools.filter(p => p.userStaked > 0).length}
                    </p>
                  </div>
                  <Flame className="w-8 h-8 text-cyan-400" />
                </div>
              </motion.div>
            </div>

            {/* Staking Pools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map((pool) => (
                <motion.div
                  key={pool.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="glass-card border-gray-600/30 hover:border-green-500/50 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                            pool.tokenSymbol === "SLERF" 
                              ? "from-purple-500 to-pink-500" 
                              : "from-cyan-500 to-blue-500"
                          } flex items-center justify-center`}>
                            <Coins className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{pool.name}</h3>
                            <p className={`text-sm ${getTokenColor(pool.tokenSymbol)}`}>
                              {pool.tokenSymbol} Token
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getTierColor(pool.tier)} flex items-center space-x-1`}>
                          {getTierIcon(pool.tier)}
                          <span>{pool.tier}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">APY</p>
                          <p className="text-2xl font-bold text-green-400">{pool.apy}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Lock Period</p>
                          <p className="text-lg font-semibold">{pool.lockPeriodDays} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Multiplier</p>
                          <p className="text-lg font-semibold text-yellow-400">{pool.multiplier}x</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Min Stake</p>
                          <p className="text-lg font-semibold">{pool.minStakeAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Pool Utilization</span>
                          <span>{((pool.totalStaked / (pool.maxStakeAmount || pool.totalStaked)) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(pool.totalStaked / (pool.maxStakeAmount || pool.totalStaked)) * 100} 
                          className="h-2"
                        />
                      </div>

                      {pool.userStaked > 0 ? (
                        <div className="space-y-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Your Stake</span>
                            <span className="font-semibold">{pool.userStaked.toLocaleString()} {pool.tokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Pending Rewards</span>
                            <span className="font-semibold text-green-400">{pool.userRewards.toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => claimRewards.mutate({ poolId: pool.id })}
                              disabled={pool.userRewards === 0 || claimRewards.isPending}
                              className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                            >
                              <Coins className="w-4 h-4 mr-2" />
                              Claim
                            </Button>
                            <Button
                              onClick={() => unstakeTokens.mutate({ poolId: pool.id })}
                              disabled={unstakeTokens.isPending}
                              variant="outline"
                              className="flex-1"
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              Unstake
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder={`Min ${pool.minStakeAmount.toLocaleString()}`}
                              value={selectedPool === pool.id ? stakeAmount : ""}
                              onChange={(e) => {
                                setSelectedPool(pool.id);
                                setStakeAmount(e.target.value);
                              }}
                              className="flex-1 bg-gray-800/50 border-gray-600"
                            />
                            <Button
                              onClick={() => stakeTokens.mutate({ 
                                poolId: pool.id, 
                                amount: Number(stakeAmount) 
                              })}
                              disabled={
                                !stakeAmount || 
                                Number(stakeAmount) < pool.minStakeAmount ||
                                stakeTokens.isPending
                              }
                              className="px-6 btn-primary"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Stake
                            </Button>
                          </div>
                          {selectedPool === pool.id && stakeAmount && Number(stakeAmount) >= pool.minStakeAmount && (
                            <div className="text-sm text-gray-400 p-2 bg-gray-800/30 rounded">
                              Daily rewards: ~{calculateDailyRewards(pool, Number(stakeAmount)).toFixed(2)} {pool.tokenSymbol}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="text-center py-12">
              <Timer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Your Staking Portfolio</h3>
              <p className="text-gray-400 mb-6">
                Stake tokens to see your portfolio and rewards here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Pool Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average APY</span>
                      <span className="text-green-400">19.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value Locked</span>
                      <span className="text-green-400">$2.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Stakers</span>
                      <span className="text-cyan-400">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rewards Distributed</span>
                      <span className="text-purple-400">$458K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-purple-500/5 rounded-lg">
                      <Crown className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-semibold">New Legendary Pool</p>
                        <p className="text-sm text-gray-400">Launch in 3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-500/5 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-semibold">APY Boost Event</p>
                        <p className="text-sm text-gray-400">Starting tomorrow</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}