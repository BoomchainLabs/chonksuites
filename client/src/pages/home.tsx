import { useAuth } from "@/hooks/useAuth";
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
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isLoading } = useAuth();

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
        <Tabs defaultValue="marketplace" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 p-1">
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-500/20 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
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
              <span className="hidden sm:inline">Referrals</span>
            </TabsTrigger>
          </TabsList>

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