import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Coins, Lock, Unlock, TrendingUp, Clock, Gift, Zap } from "lucide-react";
import TokenLogo from "@/components/token-logo";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StakingPool {
  id: string;
  tokenSymbol: "LERF" | "CHONK9K";
  apy: number;
  minStake: number;
  lockPeriod: number; // in days
  totalStaked: number;
  userStaked: number;
  userRewards: number;
  canUnstake: boolean;
  nextUnlockDate?: Date;
}

interface StakingPlatformProps {
  userId: number;
}

export default function StakingPlatform({ userId }: StakingPlatformProps) {
  const [stakeAmounts, setStakeAmounts] = useState<Record<string, string>>({});
  const [unstakeAmounts, setUnstakeAmounts] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get staking pools data
  const { data: stakingPools, isLoading } = useQuery({
    queryKey: ['/api/staking/pools', userId],
    enabled: !!userId,
  });

  // Get user balances
  const { data: userBalances } = useQuery({
    queryKey: ['/api/staking/balances', userId],
    enabled: !!userId,
  });

  // Stake tokens mutation
  const stakeTokensMutation = useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: number }) => {
      const response = await apiRequest('POST', '/api/staking/stake', {
        userId,
        poolId,
        amount,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      const pool = stakingPools?.find((p: any) => p.id === variables.poolId);
      toast({
        title: "Staking Successful!",
        description: `Staked ${variables.amount} ${pool?.tokenSymbol} tokens`,
      });
      setStakeAmounts(prev => ({ ...prev, [variables.poolId]: "" }));
      queryClient.invalidateQueries({ queryKey: ['/api/staking/pools', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/staking/balances', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

  // Unstake tokens mutation
  const unstakeTokensMutation = useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: number }) => {
      const response = await apiRequest('POST', '/api/staking/unstake', {
        userId,
        poolId,
        amount,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      const pool = stakingPools?.find((p: any) => p.id === variables.poolId);
      toast({
        title: "Unstaking Successful!",
        description: `Unstaked ${variables.amount} ${pool?.tokenSymbol} tokens`,
      });
      setUnstakeAmounts(prev => ({ ...prev, [variables.poolId]: "" }));
      queryClient.invalidateQueries({ queryKey: ['/api/staking/pools', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/staking/balances', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

  // Claim rewards mutation
  const claimRewardsMutation = useMutation({
    mutationFn: async (poolId: string) => {
      const response = await apiRequest('POST', '/api/staking/claim', {
        userId,
        poolId,
      });
      return response.json();
    },
    onSuccess: (data, poolId) => {
      const pool = stakingPools?.find((p: any) => p.id === poolId);
      toast({
        title: "Rewards Claimed!",
        description: `Claimed ${data.rewards} ${pool?.tokenSymbol} rewards`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staking/pools', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

  const handleStake = (poolId: string) => {
    const amount = parseFloat(stakeAmounts[poolId] || "0");
    if (amount > 0) {
      stakeTokensMutation.mutate({ poolId, amount });
    }
  };

  const handleUnstake = (poolId: string) => {
    const amount = parseFloat(unstakeAmounts[poolId] || "0");
    if (amount > 0) {
      unstakeTokensMutation.mutate({ poolId, amount });
    }
  };

  const handleClaimRewards = (poolId: string) => {
    claimRewardsMutation.mutate(poolId);
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-8 bg-gray-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
      <Card className="glass-card border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <Coins className="h-5 w-5 text-purple-400" />
            Staking Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">Total Staked</span>
              </div>
              <p className="text-2xl font-bold">
                ${(stakingPools?.reduce((sum: number, pool: any) => sum + (pool.userStaked * 0.002), 0) || 0).toFixed(2)}
              </p>
            </div>
            
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Total Rewards</span>
              </div>
              <p className="text-2xl font-bold">
                ${(stakingPools?.reduce((sum: number, pool: any) => sum + (pool.userRewards * 0.002), 0) || 0).toFixed(2)}
              </p>
            </div>
            
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Avg APY</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {stakingPools?.length ? 
                  (stakingPools.reduce((sum: number, pool: any) => sum + pool.apy, 0) / stakingPools.length).toFixed(1) 
                  : '0.0'
                }%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staking Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stakingPools?.map((pool: any) => (
          <Card key={pool.id} className="glass-card border-green-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TokenLogo tokenSymbol={pool.tokenSymbol} size="md" />
                  <div>
                    <CardTitle className="text-lg font-display">
                      {pool.tokenSymbol} Staking
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pool.lockPeriod} day lock period
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-lg font-bold">
                  {pool.apy}% APY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Your Staked</p>
                    <p className="text-lg font-semibold">{pool.userStaked.toFixed(2)} {pool.tokenSymbol}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Rewards</p>
                    <p className="text-lg font-semibold text-green-400">{pool.userRewards.toFixed(4)} {pool.tokenSymbol}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pool Utilization</span>
                    <span>{((pool.totalStaked / 1000000) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(pool.totalStaked / 1000000) * 100} className="h-2" />
                </div>

                {/* Unlock Timer */}
                {pool.nextUnlockDate && (
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium">Unlock Date</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(pool.nextUnlockDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Staking Interface */}
                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stake">Stake</TabsTrigger>
                    <TabsTrigger value="unstake">Unstake</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stake" className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Available Balance</span>
                      <span className="font-mono">
                        {userBalances?.[pool.tokenSymbol]?.toFixed(4) || '0.0000'} {pool.tokenSymbol}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Min: ${pool.minStake}`}
                        value={stakeAmounts[pool.id] || ""}
                        onChange={(e) => setStakeAmounts(prev => ({ ...prev, [pool.id]: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStakeAmounts(prev => ({ 
                          ...prev, 
                          [pool.id]: userBalances?.[pool.tokenSymbol]?.toFixed(4) || "0" 
                        }))}
                      >
                        Max
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => handleStake(pool.id)}
                      disabled={
                        !stakeAmounts[pool.id] || 
                        parseFloat(stakeAmounts[pool.id]) < pool.minStake ||
                        stakeTokensMutation.isPending
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {stakeTokensMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Staking...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Stake Tokens
                        </div>
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="unstake" className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Staked Amount</span>
                      <span className="font-mono">
                        {pool.userStaked.toFixed(4)} {pool.tokenSymbol}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={unstakeAmounts[pool.id] || ""}
                        onChange={(e) => setUnstakeAmounts(prev => ({ ...prev, [pool.id]: e.target.value }))}
                        className="flex-1"
                        disabled={!pool.canUnstake}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUnstakeAmounts(prev => ({ 
                          ...prev, 
                          [pool.id]: pool.userStaked.toFixed(4) 
                        }))}
                        disabled={!pool.canUnstake}
                      >
                        Max
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => handleUnstake(pool.id)}
                      disabled={
                        !pool.canUnstake ||
                        !unstakeAmounts[pool.id] || 
                        parseFloat(unstakeAmounts[pool.id]) <= 0 ||
                        unstakeTokensMutation.isPending
                      }
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {unstakeTokensMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Unstaking...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Unlock className="h-4 w-4" />
                          {pool.canUnstake ? 'Unstake Tokens' : 'Locked'}
                        </div>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Claim Rewards */}
                {pool.userRewards > 0 && (
                  <Button
                    onClick={() => handleClaimRewards(pool.id)}
                    disabled={claimRewardsMutation.isPending}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    {claimRewardsMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Claiming...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Claim {pool.userRewards.toFixed(4)} {pool.tokenSymbol}
                      </div>
                    )}
                  </Button>
                )}

                {/* Pool Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-white/10">
                  <p>• Minimum stake: {pool.minStake} {pool.tokenSymbol}</p>
                  <p>• Lock period: {pool.lockPeriod} days</p>
                  <p>• Rewards distributed daily</p>
                  <p>• Early withdrawal penalty: 5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staking Benefits */}
      <Card className="glass-card border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Staking Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <Lock className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Passive Income</h3>
              <p className="text-xs text-muted-foreground">Earn rewards automatically</p>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">High APY</h3>
              <p className="text-xs text-muted-foreground">Competitive staking rewards</p>
            </div>
            
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Gift className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Bonus Rewards</h3>
              <p className="text-xs text-muted-foreground">Additional loyalty rewards</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Flexible Terms</h3>
              <p className="text-xs text-muted-foreground">Multiple lock periods</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}