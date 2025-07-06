import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chonk9kLogo from "@/components/chonk9k-logo";
import NFTMarketplace from "@/components/nft-marketplace";
import TokenCreator from "@/components/token-creator";
import ProfessionalStaking from "@/components/professional-staking";
import DailyTasks from "@/components/daily-tasks";
import LoyaltyScore from "@/components/loyalty-score";
import ClaimRewards from "@/components/claim-rewards";
import ReferralSystem from "@/components/referral-system";
import WalletConnect from "@/components/wallet-connect";
import TokenBalances from "@/components/token-balances";
import PendingRewards from "@/components/pending-rewards";
import { 
  LogOut, 
  User, 
  Coins, 
  TrendingUp, 
  ShoppingBag,
  Rocket,
  Lock,
  Trophy,
  Star,
  Zap,
  Wallet,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [walletConnected, setWalletConnected] = useState(false);
  const [autoConnecting, setAutoConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-detect and connect wallets on load
  useEffect(() => {
    const autoConnectWallet = async () => {
      if (autoConnecting || walletConnected) return;
      
      setAutoConnecting(true);
      
      // Try Phantom first (Solana)
      if (typeof window !== 'undefined' && 'solana' in window) {
        try {
          const solana = (window as any).solana;
          if (solana.isPhantom && solana.isConnected) {
            const response = await solana.connect({ onlyIfTrusted: true });
            await connectWallet.mutateAsync({
              address: response.publicKey.toString(),
              chainType: 'solana'
            });
            setWalletConnected(true);
            toast({
              title: "Auto-connected to Phantom",
              description: "Your Solana wallet is ready for staking and trading.",
            });
            setAutoConnecting(false);
            return;
          }
        } catch (error) {
          // Silent fail for auto-connection
        }
      }
      
      // Try MetaMask (Base/Ethereum)
      if (typeof window !== 'undefined' && 'ethereum' in window) {
        try {
          const ethereum = (window as any).ethereum;
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet.mutateAsync({
              address: accounts[0],
              chainType: 'base'
            });
            setWalletConnected(true);
            toast({
              title: "Auto-connected to MetaMask",
              description: "Your Base wallet is ready for DeFi operations.",
            });
          }
        } catch (error) {
          // Silent fail for auto-connection
        }
      }
      
      setAutoConnecting(false);
    };

    if (user && !walletConnected) {
      autoConnectWallet();
    }
  }, [user]);

  // Wallet connection mutation
  const connectWallet = useMutation({
    mutationFn: async ({ address, chainType }: { address: string; chainType: string }) => {
      const response = await apiRequest('POST', '/api/connect-wallet', {
        walletAddress: address,
        chainType,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setWalletConnected(true);
    }
  });

  // One-click claim all rewards
  const claimAllRewards = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/rewards/claim-all', {
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user'] });
      toast({
        title: "All Rewards Claimed!",
        description: `Successfully claimed ${data.totalClaimed} tokens across all pools.`,
      });
    }
  });

  // Quick stake mutation
  const quickStake = useMutation({
    mutationFn: async ({ amount, token }: { amount: number; token: string }) => {
      const poolId = token === 'SLERF' ? 'slerf-premium' : 'chonk9k-premium';
      const response = await apiRequest('POST', '/api/staking/stake', {
        userId: user?.id,
        poolId,
        amount,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staking/user'] });
      toast({
        title: "Staking Successful!",
        description: "Your tokens are now earning rewards.",
      });
    }
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Chonk9kLogo size="xl" animated />
          <p className="text-gray-400 mt-4">Loading your Web3 dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Chonk9kLogo size="md" animated />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Chonk9k Suite
                </h1>
                <p className="text-gray-400 text-sm">Professional Web3 Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">{user?.firstName || 'User'}</span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-500/20 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-green-500/20 flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Staking</span>
            </TabsTrigger>
            <TabsTrigger value="creator" className="data-[state=active]:bg-cyan-500/20 flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Creator</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-yellow-500/20 flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-blue-500/20 flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Loyalty</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-pink-500/20 flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Referral</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Wallet Status & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wallet Status */}
                <Card className="glass-card border-cyan-500/30 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2 text-cyan-400" />
                      Wallet Status
                      {walletConnected && (
                        <Badge className="ml-3 bg-green-500/10 text-green-400 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {autoConnecting ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-cyan-400">Auto-detecting wallets...</p>
                      </div>
                    ) : walletConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div>
                            <p className="font-semibold text-green-400">Wallet Connected</p>
                            <p className="text-sm text-gray-400">Ready for staking and trading</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        
                        {/* Token Balances */}
                        <TokenBalances userId={user?.id} />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <WalletConnect onConnect={() => setWalletConnected(true)} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="glass-card border-green-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-green-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => claimAllRewards.mutate()}
                      disabled={!walletConnected || claimAllRewards.isPending}
                      className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                    >
                      {claimAllRewards.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Claiming...</span>
                        </div>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Claim All Rewards
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => quickStake.mutate({ amount: 10000, token: 'SLERF' })}
                      disabled={!walletConnected || quickStake.isPending}
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Quick Stake SLERF
                    </Button>
                    
                    <Button
                      onClick={() => quickStake.mutate({ amount: 15000, token: 'CHONK9K' })}
                      disabled={!walletConnected || quickStake.isPending}
                      className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Quick Stake CHONK9K
                    </Button>
                    
                    <Button
                      onClick={() => setActiveTab('marketplace')}
                      variant="outline"
                      className="w-full"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Browse NFTs
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Active Rewards & Staking Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                      Pending Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PendingRewards userId={user?.id} />
                    <Button
                      onClick={() => claimAllRewards.mutate()}
                      disabled={!walletConnected || claimAllRewards.isPending}
                      className="mt-4 w-full btn-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Claim Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Staking Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Staked</span>
                        <span className="font-semibold">52,500 Tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average APY</span>
                        <span className="font-semibold text-green-400">28.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Earnings</span>
                        <span className="font-semibold text-purple-400">~41 Tokens</span>
                      </div>
                      <Button
                        onClick={() => setActiveTab('staking')}
                        variant="outline"
                        className="w-full mt-4"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Manage Stakes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NFTMarketplace userId={user?.id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfessionalStaking userId={user?.id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="creator" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TokenCreator userId={user?.id || ''} />
            </motion.div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <DailyTasks
                tasks={[]}
                completedTaskIds={[]}
                userId={Number(user?.id) || 0}
              />
              <ClaimRewards
                userId={Number(user?.id) || 0}
                pendingRewards={0}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoyaltyScore userId={Number(user?.id) || 0} />
            </motion.div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReferralSystem userId={Number(user?.id) || 0} />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats Footer */}
        <motion.div 
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass-card border-purple-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">35%</p>
              <p className="text-sm text-gray-400">Max APY</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-cyan-500/30">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-cyan-400">89</p>
              <p className="text-sm text-gray-400">NFTs Available</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-green-500/30">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">$2.8M</p>
              <p className="text-sm text-gray-400">Total Staked</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">1,247</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}