import React, { useState } from 'react';
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
  RefreshCw,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/animated-background';
import MobileNavigation from '@/components/mobile-navigation';
import { useAuth } from '@/hooks/useAuth';

export default function StableDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Fetch user dashboard data with safe defaults
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  // Fetch token balances with safe defaults
  const { data: tokenBalances = [], isLoading: balancesLoading } = useQuery({
    queryKey: ['/api/user/token-balances'],
    enabled: !!user,
  });

  // Fetch active tasks with safe defaults
  const { data: activeTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/active'],
    enabled: !!user,
  });

  const isLoading = statsLoading || balancesLoading || tasksLoading;

  // Safe data extraction with fallbacks
  const userStats = (dashboardData as any)?.user || {};
  const totalValue = (dashboardData as any)?.totalValue || 0;
  const totalEarnings = (dashboardData as any)?.totalEarnings || 0;
  const completedTasks = (dashboardData as any)?.completedTasks || 0;
  const referralCount = (dashboardData as any)?.referralCount || 0;
  const loyaltyScore = (dashboardData as any)?.loyaltyScore || 0;
  const pendingRewards = (dashboardData as any)?.pendingRewards || 0;

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

  const slerfBalance = (tokenBalances as any[]).find((t: any) => t.symbol === 'SLERF') || { balance: 0, balanceUSD: 0 };
  const chonkBalance = (tokenBalances as any[]).find((t: any) => t.symbol === 'CHONK9K') || { balance: 0, balanceUSD: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <AnimatedBackground />
      <MobileNavigation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {(user as any)?.firstName || 'Trader'}!
              </h1>
              <p className="text-gray-300">
                Your Web3 Trading Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="w-4 h-4 mr-1" />
                Live
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Total Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(totalValue)}
                </div>
                <div className="text-sm text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% Today
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(totalEarnings)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Lifetime rewards
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Tasks Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {completedTasks}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {(activeTasks as any[]).length} active tasks
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Loyalty Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loyaltyScore}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {referralCount} referrals
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="tokens" className="text-white">Token Holdings</TabsTrigger>
              <TabsTrigger value="tasks" className="text-white">Active Tasks</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Performance */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Token Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src="/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg" 
                          alt="SLERF" 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-white font-medium">SLERF</div>
                          <div className="text-sm text-gray-400">Base Network</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{formatPrice(slerfBalance.balanceUSD)}</div>
                        <div className="text-sm text-green-400">+8.2%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src="/attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg" 
                          alt="CHONK9K" 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-white font-medium">CHONK9K</div>
                          <div className="text-sm text-gray-400">Solana Network</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{formatPrice(chonkBalance.balanceUSD)}</div>
                        <div className="text-sm text-green-400">+12.5%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Rewards */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Pending Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-4">
                      {formatPrice(pendingRewards)}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Gift className="w-4 h-4 mr-2" />
                      Claim Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Token Holdings Tab */}
            <TabsContent value="tokens" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(tokenBalances as any[]).map((token: any, index: number) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <img 
                          src={token.symbol === 'SLERF' ? '/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg' : '/attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg'}
                          alt={token.symbol}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        {token.symbol}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Balance:</span>
                          <span className="text-white">{formatLargeNumber(token.balance || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Value:</span>
                          <span className="text-white">{formatPrice(token.balanceUSD || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Network:</span>
                          <span className="text-white">{token.symbol === 'SLERF' ? 'Base' : 'Solana'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Active Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeTasks as any[]).map((task: any, index: number) => (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{task.name}</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                          {formatPrice(task.reward || 0)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-4">{task.description}</p>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Complete Task
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Trade SLERF
                </Button>
                <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Trade CHONK9K
                </Button>
                <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
                  <Users className="w-4 h-4 mr-2" />
                  Referrals
                </Button>
                <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}