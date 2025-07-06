import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Coins, Gamepad2, ChartBar, Target, Pickaxe } from "lucide-react";
import TradingChart from "@/components/trading-chart";
import StakingPlatform from "@/components/staking-platform";
import DailyTrivia from "@/components/daily-trivia";
import SlerfMiningGame from "@/components/slerf-mining-game";
import SlerfPredictionGame from "@/components/slerf-prediction-game";
import TokenBalances from "@/components/token-balances";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";

interface TradingDashboardProps {
  user: any;
  tokenBalances: any[];
  stats: any;
}

export default function TradingDashboard({ user, tokenBalances, stats }: TradingDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      <div className="relative z-10 container-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Chonk9kLogo size="lg" animated={true} />
              <div>
                <h1 className="text-3xl font-display font-bold gradient-text">
                  Boomchainlab Trading Suite
                </h1>
                <p className="text-muted-foreground">
                  Professional DeFi trading, staking, and gaming platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Total Portfolio: ${(
                  tokenBalances?.reduce((sum, token) => sum + (token.balance * 0.002), 0) || 0
                ).toFixed(2)}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                24h P&L: +$47.82
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Trades</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Staked Value</p>
                  <p className="text-2xl font-bold">${stats?.totalRewards || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-2xl font-bold">{stats?.tasksCompleted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">73%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="staking" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="mining" className="flex items-center gap-2">
              <Pickaxe className="h-4 w-4" />
              Mining
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Predictions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Overview */}
              <Card className="glass-card border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-lg font-display font-bold">
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenBalances balances={tokenBalances} />
                </CardContent>
              </Card>

              {/* Quick Trading Actions */}
              <Card className="glass-card border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-lg font-display font-bold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setActiveTab("trading")}
                      className="h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <TrendingUp className="h-6 w-6" />
                      <span>Trade SLERF</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab("staking")}
                      className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Coins className="h-6 w-6" />
                      <span>Stake Tokens</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab("mining")}
                      className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Pickaxe className="h-6 w-6" />
                      <span>Mine SLERF</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab("games")}
                      className="h-20 flex flex-col gap-2 bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Gamepad2 className="h-6 w-6" />
                      <span>Play Games</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Charts Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingChart tokenSymbol="LERF" userId={user?.id} />
              <TradingChart tokenSymbol="CHONK9K" userId={user?.id} />
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TradingChart tokenSymbol="LERF" userId={user?.id} />
              <TradingChart tokenSymbol="CHONK9K" userId={user?.id} />
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking">
            <StakingPlatform userId={user?.id} />
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyTrivia userId={user?.id} />
              
              <Card className="glass-card border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-purple-400" />
                    Gaming Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => setActiveTab("mining")}
                        className="h-16 flex flex-col gap-1 bg-green-600/20 border border-green-500/30 hover:bg-green-600/30"
                      >
                        <Pickaxe className="h-5 w-5" />
                        <span className="text-xs">Mining Game</span>
                      </Button>
                      
                      <Button 
                        onClick={() => setActiveTab("predictions")}
                        className="h-16 flex flex-col gap-1 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30"
                      >
                        <Target className="h-5 w-5" />
                        <span className="text-xs">Predictions</span>
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <h4 className="font-semibold mb-2 text-yellow-400">Daily Rewards</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete daily challenges to earn $LERF tokens!
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Trivia Challenge: +15-50 $LERF</li>
                        <li>• Mining Session: +5-25 $LERF</li>
                        <li>• Price Prediction: +10-40 $LERF</li>
                        <li>• Login Streak: +5 $LERF/day</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mining Tab */}
          <TabsContent value="mining">
            <SlerfMiningGame userId={user?.id} />
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions">
            <SlerfPredictionGame userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}