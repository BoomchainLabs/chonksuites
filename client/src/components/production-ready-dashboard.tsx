import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  BarChart3, 
  Target,
  Users,
  Star,
  Gift,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/animated-background';
import MobileNavigation from '@/components/mobile-navigation';
import { useAuth } from '@/hooks/useAuth';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  balance: number;
  balanceUSD: number;
  logo: string;
  contractAddress: string;
  network: string;
}

interface UserStats {
  totalValue: number;
  totalEarnings: number;
  completedTasks: number;
  referralCount: number;
  loyaltyScore: number;
  pendingRewards: number;
}

export default function ProductionReadyDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Fetch user dashboard data
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  // Fetch token balances
  const { data: tokenBalances = [], isLoading: balancesLoading } = useQuery<TokenData[]>({
    queryKey: ['/api/user/token-balances'],
    enabled: !!user,
  });

  // Fetch active tasks
  const { data: activeTasks = [], isLoading: tasksLoading } = useQuery<any[]>({
    queryKey: ['/api/tasks/active'],
    enabled: !!user,
  });

  const isLoading = statsLoading || balancesLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <AnimatedBackground />
      <MobileNavigation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              Trading Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Trader'}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Total Portfolio</p>
                    <p className="text-2xl font-bold text-white">
                      ${formatLargeNumber(userStats?.totalValue || 0)}
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">
                      ${formatLargeNumber(userStats?.totalEarnings || 0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Completed Tasks</p>
                    <p className="text-2xl font-bold text-white">
                      {userStats?.completedTasks || 0}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-400 text-sm font-medium">Loyalty Score</p>
                    <p className="text-2xl font-bold text-white">
                      {userStats?.loyaltyScore || 0}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-purple-600">
                Trading
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600">
                Tasks
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Holdings */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      Token Holdings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tokenBalances.length > 0 ? (
                      tokenBalances.map((token, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={token.logo} 
                              alt={token.symbol} 
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#334155"/><text x="16" y="20" text-anchor="middle" fill="#fff" font-size="12">${token.symbol[0]}</text></svg>`)}`;
                              }}
                            />
                            <div>
                              <p className="font-medium text-white">{token.symbol}</p>
                              <p className="text-sm text-gray-400">{token.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">{token.balance.toFixed(2)}</p>
                            <p className="text-sm text-gray-400">${token.balanceUSD.toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No tokens found</p>
                        <p className="text-sm text-gray-500">Start trading to see your holdings</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Earnings Summary */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Earnings Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-sm text-gray-400">Total Earnings</p>
                        <p className="text-lg font-bold text-green-400">
                          ${formatLargeNumber(userStats?.totalEarnings || 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-sm text-gray-400">Pending Rewards</p>
                        <p className="text-lg font-bold text-yellow-400">
                          ${formatLargeNumber(userStats?.pendingRewards || 0)}
                        </p>
                      </div>
                    </div>
                    
                    {(userStats?.pendingRewards || 0) > 0 && (
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Rewards
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trading Tab */}
            <TabsContent value="trading" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SLERF Trading */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src="/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg" 
                          alt="SLERF" 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        SLERF Trading
                      </div>
                      <Badge className="bg-blue-500 text-white">Base Network</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-white font-bold">Loading...</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Trade SLERF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* CHONK9K Trading */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src="/attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg" 
                          alt="CHONK9K" 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        CHONK9K Trading
                      </div>
                      <Badge className="bg-green-500 text-white">Solana Network</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-white font-bold">Loading...</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Trade CHONK9K
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Available Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTasks.length > 0 ? (
                    <div className="space-y-3">
                      {activeTasks.map((task: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-gray-400">{task.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-400">+{task.rewardAmount} {task.rewardType}</p>
                            <Button size="sm" className="mt-2">
                              Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No active tasks</p>
                      <p className="text-sm text-gray-500">Check back later for new opportunities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}