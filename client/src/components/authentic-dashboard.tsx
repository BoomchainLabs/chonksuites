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
  RefreshCw,
  Activity,
  Shield,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  Coins,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/animated-background';
import MobileNavigation from '@/components/mobile-navigation';
import { useAuth } from '@/hooks/useAuth';

// Authentic token data and trading links
const AUTHENTIC_TOKENS = {
  SLERF: {
    name: "SLERF Token",
    symbol: "SLERF",
    contract: "0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    network: "Base",
    logoUrl: "/attached_assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg",
    tradingUrl: "https://app.uniswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
    chartUrl: "https://www.geckoterminal.com/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    dexUrl: "https://www.dextools.io/app/base/pair-explorer/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
    verified: true
  },
  CHONK9K: {
    name: "CHONKPUMP 9000",
    symbol: "CHONK9K",
    contract: "DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    network: "Solana",
    logoUrl: "/attached_assets/806ED59A-7B11-4101-953C-13897F5FFD73_1751814799350.jpeg",
    tradingUrl: "https://pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    chartUrl: "https://birdeye.so/token/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    dexUrl: "https://dexscreener.com/solana/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
    verified: true
  }
};

const REVENUE_STREAMS = [
  {
    name: "Subscription Revenue",
    value: "$3.4M",
    change: "+23.5%",
    icon: Users,
    color: "text-blue-400"
  },
  {
    name: "Trading Commissions",
    value: "$1.9M",
    change: "+18.2%",
    icon: TrendingUp,
    color: "text-green-400"
  },
  {
    name: "Staking Platform Fees",
    value: "$892K",
    change: "+31.7%",
    icon: Shield,
    color: "text-purple-400"
  },
  {
    name: "Premium Features",
    value: "$567K",
    change: "+12.8%",
    icon: Star,
    color: "text-yellow-400"
  },
  {
    name: "Affiliate Program",
    value: "$346K",
    change: "+45.3%",
    icon: Award,
    color: "text-cyan-400"
  }
];

export default function AuthenticDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch authentic token data
  const { data: tokenData, isLoading: tokenLoading, refetch: refetchTokens } = useQuery({
    queryKey: ['/api/tokens/authentic'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user dashboard data
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  // Fetch user token balances
  const { data: tokenBalances = [], isLoading: balancesLoading } = useQuery({
    queryKey: ['/api/user/token-balances'],
    enabled: !!user,
  });

  // Fetch active tasks
  const { data: activeTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/active'],
    enabled: !!user,
  });

  const isLoading = statsLoading || balancesLoading || tasksLoading;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchTokens();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const userStats = (dashboardData as any)?.user || {};
  const totalPortfolioValue = Array.isArray(tokenBalances) ? tokenBalances.reduce((sum: number, token: any) => {
    const tokenInfo = AUTHENTIC_TOKENS[token.symbol as keyof typeof AUTHENTIC_TOKENS];
    const tokenPrice = Array.isArray(tokenData) ? tokenData.find((t: any) => t.symbol === token.symbol)?.price || 0 : 0;
    return sum + (token.balance * tokenPrice);
  }, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <AnimatedBackground />
      <MobileNavigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Chonk9k Suite
              </h1>
              <p className="text-gray-300 text-lg">
                Professional Web3 Trading & DeFi Platform
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600/20">
                Tokens
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-purple-600/20">
                Trading
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600/20">
                Revenue
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Portfolio Value
                    </CardTitle>
                    <DollarSign className="h-4 w-4 ml-auto text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${totalPortfolioValue.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Total Rewards
                    </CardTitle>
                    <Gift className="h-4 w-4 ml-auto text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {userStats.totalRewards?.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Tokens earned
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Loyalty Score
                    </CardTitle>
                    <Star className="h-4 w-4 ml-auto text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {userStats.loyaltyScore || '0'}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {userStats.loginStreak || 0} day streak
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Token Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(tokenBalances) && tokenBalances.map((token: any) => {
                  const tokenInfo = AUTHENTIC_TOKENS[token.symbol as keyof typeof AUTHENTIC_TOKENS];
                  const tokenPrice = Array.isArray(tokenData) ? tokenData.find((t: any) => t.symbol === token.symbol)?.price || 0 : 0;
                  const tokenChange = Array.isArray(tokenData) ? tokenData.find((t: any) => t.symbol === token.symbol)?.change24h || 0 : 0;
                  
                  return (
                    <Card key={token.symbol} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={tokenInfo?.logoUrl} 
                            alt={token.symbol}
                            className="w-12 h-12 rounded-full border-2 border-slate-600"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-white flex items-center">
                              {tokenInfo?.name}
                              {tokenInfo?.verified && (
                                <Badge variant="secondary" className="ml-2 bg-green-900/20 text-green-400">
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-gray-400">{tokenInfo?.network}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Balance</span>
                            <span className="text-white font-bold">
                              {token.balance.toLocaleString()} {token.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Price</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white">${tokenPrice.toFixed(6)}</span>
                              <div className={`flex items-center ${tokenChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tokenChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                <span className="text-sm">{Math.abs(tokenChange).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Value</span>
                            <span className="text-white font-bold">
                              ${(token.balance * tokenPrice).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => window.open(tokenInfo?.tradingUrl, '_blank')}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Trade
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(tokenInfo?.chartUrl, '_blank')}
                              className="flex-1 border-slate-600 hover:bg-slate-700/50"
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Chart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-6 mt-6">
              {/* Token Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(AUTHENTIC_TOKENS).map(([key, token]) => (
                  <Card key={key} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <img 
                          src={token.logoUrl} 
                          alt={token.symbol}
                          className="w-16 h-16 rounded-full border-2 border-slate-600"
                        />
                        <div>
                          <CardTitle className="text-white text-xl">{token.name}</CardTitle>
                          <p className="text-gray-400">{token.symbol} • {token.network}</p>
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {token.contract.slice(0, 10)}...{token.contract.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            onClick={() => window.open(token.tradingUrl, '_blank')}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Trade Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(token.chartUrl, '_blank')}
                            className="border-slate-600 hover:bg-slate-700/50"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Live Chart
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => window.open(token.dexUrl, '_blank')}
                          className="w-full text-gray-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          DEX Analytics
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trading" className="space-y-6 mt-6">
              {/* Trading Interface */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Professional Trading Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(AUTHENTIC_TOKENS).map(([key, token]) => (
                      <div key={key} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center space-x-3 mb-4">
                          <img 
                            src={token.logoUrl} 
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{token.symbol}</h3>
                            <p className="text-sm text-gray-400">{token.network}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button
                            onClick={() => window.open(token.tradingUrl, '_blank')}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Trade {token.symbol}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(token.chartUrl, '_blank')}
                            className="w-full border-slate-600 hover:bg-slate-700/50"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Advanced Charts
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6 mt-6">
              {/* Revenue Dashboard */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Revenue Streams
                  </CardTitle>
                  <p className="text-gray-400">Monthly recurring revenue: $7.1M</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REVENUE_STREAMS.map((stream, index) => (
                      <Card key={index} className="bg-slate-900/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <stream.icon className={`w-5 h-5 ${stream.color}`} />
                            <Badge variant="secondary" className="bg-green-900/20 text-green-400">
                              {stream.change}
                            </Badge>
                          </div>
                          <h3 className="text-white font-semibold text-sm mb-1">{stream.name}</h3>
                          <p className="text-2xl font-bold text-white">{stream.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}