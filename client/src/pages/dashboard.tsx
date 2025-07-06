import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, TrendingUp, Users, Award, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import TokenBalances from "@/components/token-balances";
import DailyTasks from "@/components/daily-tasks";
import LoyaltyScore from "@/components/loyalty-score";
import ReferralSystem from "@/components/referral-system";
import ClaimRewards from "@/components/claim-rewards";
import DailyTrivia from "@/components/daily-trivia";
import SlerfMiningGame from "@/components/slerf-mining-game";
import SlerfPredictionGame from "@/components/slerf-prediction-game";
import StakingPlatform from "@/components/staking-platform";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user: authUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  const connectWalletMutation = useMutation({
    mutationFn: async (walletData: { walletAddress: string; chainType: string }) => {
      const response = await apiRequest('POST', '/api/connect-wallet', walletData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Wallet Connected!",
        description: `Successfully connected your ${data.user.chainType} wallet.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleWalletConnect = (walletData: { address: string; chainType: string }) => {
    connectWalletMutation.mutate({
      walletAddress: walletData.address,
      chainType: walletData.chainType,
    });
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Check for unauthorized errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Chonk9kLogo size="xl" animated />
          <p className="text-gray-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Type-safe access to dashboard data
  const user = dashboardData && typeof dashboardData === 'object' ? dashboardData.user : null;
  const tokenBalances = dashboardData && typeof dashboardData === 'object' ? dashboardData.tokenBalances || [] : [];
  const stats = dashboardData && typeof dashboardData === 'object' ? dashboardData.stats || {} : {};
  const tasks = dashboardData && typeof dashboardData === 'object' ? dashboardData.tasks || [] : [];
  const completedTaskIds = dashboardData && typeof dashboardData === 'object' ? dashboardData.completedTaskIds || [] : [];
  const activities = dashboardData && typeof dashboardData === 'object' ? dashboardData.activities || [] : [];

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="glass-card border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Chonk9kLogo size="lg" animated />
              <div>
                <h1 className="text-3xl font-orbitron font-bold">Welcome, {displayName}</h1>
                <p className="text-gray-400">Your Web3 Loyalty Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 font-mono">
                v3.0 Enterprise
              </Badge>
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-purple-500/30"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Award className="w-4 h-4 mr-2 text-purple-400" />
                Total Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.totalRewards || 0}</div>
              <p className="text-xs text-gray-500">Tokens earned</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-cyan-400" />
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{stats.tasksCompleted || 0}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.referralCount || 0}</div>
              <p className="text-xs text-gray-500">Friends invited</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Rocket className="w-4 h-4 mr-2 text-yellow-400" />
                Loyalty Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.loyaltyScore || 0}</div>
              <p className="text-xs text-gray-500">Level progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Token Balances */}
            <TokenBalances balances={tokenBalances} />

            {/* Daily Tasks */}
            <DailyTasks
              tasks={tasks}
              completedTaskIds={completedTaskIds}
              userId={user?.id}
            />

            {/* Gaming Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <DailyTrivia userId={user?.id} />
              <SlerfMiningGame userId={user?.id} />
            </div>

            {/* Prediction Game */}
            <SlerfPredictionGame userId={user?.id} />

            {/* Staking Platform */}
            <StakingPlatform userId={user?.id} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Claim Rewards */}
            <ClaimRewards
              userId={user?.id}
              pendingRewards={stats.pendingRewards || 0}
            />

            {/* Loyalty Score */}
            <LoyaltyScore userId={user?.id} />

            {/* Referral System */}
            <ReferralSystem userId={user?.id} />

            {/* Wallet Connection */}
            <Card className="glass-card border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg">Wallet Connection</CardTitle>
              </CardHeader>
              <CardContent>
                {user?.walletAddress ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Connected Wallet:</div>
                    <div className="font-mono text-sm bg-gray-800/50 p-2 rounded">
                      {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Network: {user.chainType === 'evm' ? 'Base Chain' : 'Solana'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Connect your wallet to earn real crypto rewards and access advanced features.
                    </p>
                    <div className="grid gap-2">
                      <Button
                        onClick={() => handleWalletConnect({ address: `0x${Math.random().toString(16).slice(2, 42)}`, chainType: 'evm' })}
                        className="w-full"
                        disabled={connectWalletMutation.isPending}
                      >
                        Connect Base Wallet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleWalletConnect({ address: `${Math.random().toString(36).slice(2, 45)}`, chainType: 'solana' })}
                        className="w-full"
                        disabled={connectWalletMutation.isPending}
                      >
                        Connect Solana Wallet
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{activity.description}</span>
                      <span className="text-green-400">+{activity.reward}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Complete tasks to see your activity here.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}