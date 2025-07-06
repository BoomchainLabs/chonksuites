import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";
import MobileNavigation from "@/components/mobile-navigation";
import { Coins, Trophy, Users, TrendingUp, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function SimpleDashboard() {
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  const displayName = user && typeof user === 'object' && user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user && typeof user === 'object' && user.email ? user.email.split('@')[0] : 'Welcome';

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
        <AnimatedBackground />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Chonk9kLogo size="xl" animated />
            
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-glow">
                Chonk9k Suite
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-md mx-auto px-4">
                Your Web3 loyalty dashboard for earning $SLERF and $CHONK9K tokens
              </p>
            </div>

            <Button 
              onClick={handleLogin}
              className="btn-primary text-lg px-8 py-3"
            >
              Login to Continue
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-container bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <AnimatedBackground />
      <MobileNavigation />
      
      <div className="relative z-10 full-width-content space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Chonk9kLogo size="md" animated />
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Welcome back, {displayName}!</h1>
              <p className="text-sm sm:text-base text-gray-400">Your Web3 loyalty dashboard</p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 self-start sm:self-auto">
            Online
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="full-width-grid full-width-grid-sm full-width-grid-lg gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="glass-card border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Coins className="w-4 h-4 mr-2 text-purple-400" />
                  SLERF Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-400 text-glow">
                  {stats && typeof stats === 'object' && stats.slerfBalance ? stats.slerfBalance.toLocaleString() : '0'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="glass-card border-cyan-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-cyan-400" />
                  CHONK9K Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cyan-400 text-glow">
                  {stats && typeof stats === 'object' && stats.chonkBalance ? stats.chonkBalance.toLocaleString() : '0'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="glass-card border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-green-400" />
                  Total Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400 text-glow">
                  {stats?.totalRewards?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="glass-card border-yellow-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-yellow-400" />
                  Loyalty Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-400 text-glow">
                  {stats?.loyaltyScore || '0'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Button className="btn-primary h-12 mobile-button">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Start Trading</span>
              </Button>
              <Button variant="outline" className="h-12 mobile-button border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                <Coins className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Complete Tasks</span>
              </Button>
              <Button variant="outline" className="h-12 mobile-button border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 sm:col-span-2 lg:col-span-1">
                <Trophy className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Claim Rewards</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="glass-card border-green-500/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm sm:text-base">All systems operational</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Solana & Base networks connected
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}