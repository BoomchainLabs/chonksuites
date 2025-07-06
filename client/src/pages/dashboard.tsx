import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, Users, Award, CheckCircle, Plus, Share, Zap } from "lucide-react";
import WalletConnect from "@/components/wallet-connect";
import TokenBalances from "@/components/token-balances";
import DailyTasks from "@/components/daily-tasks";
import LoyaltyScore from "@/components/loyalty-score";
import ReferralSystem from "@/components/referral-system";
import ClaimRewards from "@/components/claim-rewards";
import TokenLogo from "@/components/token-logo";
import Web3Status from "@/components/web3-status";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";
import { apiRequest } from "@/lib/queryClient";
import { formatTime } from "@/lib/wallet-utils";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard', user?.id],
    enabled: !!user?.id,
  });

  // Type-safe access to dashboard data
  const tokenBalances = (dashboardData as any)?.tokenBalances || [];
  const stats = (dashboardData as any)?.stats || {};
  const tasks = (dashboardData as any)?.tasks || [];
  const completedTaskIds = (dashboardData as any)?.completedTaskIds || [];
  const activities = (dashboardData as any)?.activities || [];

  const connectWalletMutation = useMutation({
    mutationFn: async (walletData: { address: string; chainType: string }) => {
      const response = await apiRequest('POST', '/api/connect-wallet', {
        walletAddress: walletData.address,
        chainType: walletData.chainType,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsConnected(true);
      toast({
        title: "Wallet Connected!",
        description: `Welcome ${data.user.username}! Your dashboard is ready.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleWalletConnect = (walletData: { address: string; chainType: string }) => {
    connectWalletMutation.mutate(walletData);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'referral_earned':
        return <Users className="w-4 h-4" />;
      case 'tokens_claimed':
        return <Zap className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'bg-green-500';
      case 'referral_earned':
        return 'bg-yellow-500';
      case 'tokens_claimed':
        return 'bg-blue-500';
      default:
        return 'bg-purple-500';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background relative">
        <AnimatedBackground />
        
        {/* Professional Boomchainlab Header */}
        <header className="glass-card border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg">
          <div className="container-padding py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center glow-primary">
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-display font-bold gradient-text">
                      Boomchainlab
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Enterprise Web3 Platform
                    </p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center space-x-4">
                  <Chonk9kLogo size="md" animated={true} />
                  <div className="flex items-center space-x-2">
                    <TokenLogo tokenSymbol="LERF" size="sm" />
                    <TokenLogo tokenSymbol="CHONK9K" size="sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 font-mono">
                  v3.0 Enterprise
                </Badge>
                <WalletConnect
                  onConnect={handleWalletConnect}
                  isConnected={isConnected}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-orbitron font-bold mb-6 gradient-text">
              Welcome to the Future of Loyalty
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect your wallet to start earning $SLERF and $CHONKPUMP rewards through daily tasks, referrals, and loyalty engagement.
            </p>
            <div className="glass-card p-8 border-purple-500/30 animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-orbitron font-bold text-lg mb-2">Daily Tasks</h3>
                  <p className="text-gray-400">Complete simple tasks and earn $SLERF rewards</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-orbitron font-bold text-lg mb-2">Referrals</h3>
                  <p className="text-gray-400">Invite friends and earn 30 $SLERF per referral</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-orbitron font-bold text-lg mb-2">Loyalty Score</h3>
                  <p className="text-gray-400">Build your reputation and unlock better rewards</p>
                </div>
              </div>
              <WalletConnect
                onConnect={handleWalletConnect}
                isConnected={isConnected}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-gray-800 to-blue-900 border-b border-purple-500/30 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-float">
                <Rocket className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-orbitron font-bold gradient-text">
                  CHONK9K SUITE
                </h1>
                <p className="text-sm text-gray-400">Web3 Loyalty & Rewards</p>
              </div>
              <div className="hidden lg:flex items-center space-x-2 ml-6">
                <TokenLogo tokenSymbol="SLERF" size="sm" />
                <TokenLogo tokenSymbol="CHONKPUMP" size="sm" />
              </div>
            </div>

            <TokenBalances balances={tokenBalances} />

            <WalletConnect
              onConnect={handleWalletConnect}
              isConnected={isConnected}
              walletAddress={user?.walletAddress}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card className="glass-card border-purple-500/30 animate-slide-in">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-orbitron font-bold mb-2">
                      Welcome Back, {user?.username}!
                    </h2>
                    <p className="text-gray-400">Complete daily tasks and earn rewards</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Current Streak</p>
                    <p className="text-3xl font-bold text-green-400">
                      {stats.loginStreak || 0}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="stat-card">
                    <p className="text-2xl font-bold text-purple-400">
                      {stats.totalRewards || 0}
                    </p>
                    <p className="text-sm text-gray-400">Total Rewards</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-2xl font-bold text-green-400">
                      {stats.referralCount || 0}
                    </p>
                    <p className="text-sm text-gray-400">Referrals</p>
                  </div>
                  <div className="stat-card">
                    <p className="text-2xl font-bold text-blue-400">
                      {stats.tasksCompleted || 0}
                    </p>
                    <p className="text-sm text-gray-400">Tasks Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Tasks */}
            <DailyTasks
              tasks={tasks}
              completedTaskIds={completedTaskIds}
              userId={user?.id}
            />

            {/* Claim Rewards */}
            <ClaimRewards
              userId={user?.id}
              pendingRewards={stats.pendingRewards || 0}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loyalty Score */}
            <LoyaltyScore userId={user?.id} />

            {/* Referral System */}
            <ReferralSystem userId={user?.id} />

            {/* Web3 Status */}
            <Web3Status />

            {/* Recent Activity */}
            <Card className="glass-card border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron font-bold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities?.map((activity: any) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${getActivityIconColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {activity.reward > 0 && `+${activity.reward} $SLERF`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTime(new Date(activity.createdAt))}
                      </span>
                    </div>
                  ))}
                  {(!activities || activities.length === 0) && (
                    <p className="text-center text-gray-400 py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
