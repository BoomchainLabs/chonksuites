import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";
import { ArrowRight, Zap, Coins, Trophy, Users, TrendingUp, GamepadIcon, Sparkles, Star, Rocket, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  // Floating token animation component
  const FloatingToken = ({ delay, duration, children }: { delay: number; duration: number; children: React.ReactNode }) => (
    <motion.div
      className="absolute opacity-20"
      animate={{
        y: [-20, -40, -20],
        x: [-10, 10, -10],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
      <AnimatedBackground />
      
      {/* Floating Token Elements */}
      <FloatingToken delay={0} duration={4}>
        <div className="top-20 left-20">
          <Coins className="w-8 h-8 text-purple-400" />
        </div>
      </FloatingToken>
      <FloatingToken delay={1} duration={5}>
        <div className="top-32 right-32">
          <Star className="w-6 h-6 text-cyan-400" />
        </div>
      </FloatingToken>
      <FloatingToken delay={2} duration={3}>
        <div className="top-64 left-64">
          <Sparkles className="w-10 h-10 text-yellow-400" />
        </div>
      </FloatingToken>
      <FloatingToken delay={0.5} duration={6}>
        <div className="bottom-32 right-20">
          <Rocket className="w-8 h-8 text-green-400" />
        </div>
      </FloatingToken>
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.header 
          className="flex items-center justify-between mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Chonk9kLogo size="xl" animated />
            <div>
              <h1 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Chonk9k Suite
              </h1>
              <p className="text-lg text-gray-300">Web3 Loyalty Gaming Platform</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 font-mono text-base px-4 py-2">
              v3.0 Enterprise
            </Badge>
            <Button 
              onClick={handleLogin} 
              size="lg"
              className="btn-primary animate-glow text-lg px-8 py-4 h-auto"
            >
              Login to Continue
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </motion.div>
        </motion.header>

        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.h2 
            className="text-8xl font-orbitron font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Earn Real Crypto
          </motion.h2>
          <motion.p 
            className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Complete daily tasks, play games, and earn <span className="text-purple-400 font-bold animate-pulse">$SLERF</span> and <span className="text-cyan-400 font-bold animate-pulse">$CHONK9K</span> tokens.
            Join the ultimate Web3 gaming experience with real blockchain rewards.
          </motion.p>
          
          {/* Enhanced Token Indicators */}
          <motion.div 
            className="flex items-center justify-center space-x-16 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="flex items-center space-x-4 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="w-4 h-4 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-lg font-bold text-purple-400">Base Chain (SLERF)</span>
              <Coins className="w-5 h-5 text-purple-400" />
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-6 py-3"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="w-4 h-4 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <span className="text-lg font-bold text-cyan-400">Solana (CHONKPUMP)</span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </motion.div>
          </motion.div>

          {/* Large Call-to-Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleLogin} 
              size="lg"
              className="btn-primary animate-glow text-2xl px-16 py-8 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Rocket className="w-8 h-8 mr-4" />
              Start Your Journey
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 h-full">
              <CardContent className="p-8 text-center">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Zap className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Daily Tasks</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Complete simple daily challenges and earn tokens. Check-in, share content, and invite friends to maximize rewards.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 h-full">
              <CardContent className="p-8 text-center">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <GamepadIcon className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">Gaming Experience</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Play SLERF mining games, price prediction challenges, and trivia to earn bonus tokens and climb leaderboards.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-green-500/30 hover:border-green-500/50 transition-all duration-300 h-full">
              <CardContent className="p-6 text-center">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Professional Staking</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Stake SLERF and CHONK9K tokens in professional pools with up to 35% APY and tier-based rewards.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 h-full">
              <CardContent className="p-6 text-center">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingBag className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">NFT Marketplace</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Trade premium NFTs from Elite Genesis Collection with rarity-based pricing and professional analytics.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 h-full">
              <CardContent className="p-6 text-center">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Rocket className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-cyan-400">Token Creator</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Launch your own SPL tokens with advanced features like staking, governance, and DeFi integration.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.div 
            className="text-center bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-4xl font-bold text-purple-400 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              $SLERF
            </motion.div>
            <div className="text-lg text-gray-300 mb-1">Base Chain Token</div>
            <div className="text-purple-400 font-mono text-sm">@slerf00</div>
          </motion.div>
          
          <motion.div 
            className="text-center bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-4xl font-bold text-cyan-400 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              $CHONK9K
            </motion.div>
            <div className="text-lg text-gray-300 mb-1">Solana Token</div>
            <div className="text-cyan-400 font-mono text-sm">@chonkpump9000</div>
          </motion.div>
          
          <motion.div 
            className="text-center bg-green-500/5 border border-green-500/20 rounded-2xl p-6"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-4xl font-bold text-green-400 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              Live Trading
            </motion.div>
            <div className="text-lg text-gray-300">Real-Time Charts</div>
          </motion.div>
          
          <motion.div 
            className="text-center bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(234, 179, 8, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="text-4xl font-bold text-yellow-400 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              Staking
            </motion.div>
            <div className="text-lg text-gray-300">Earn Passive Income</div>
          </motion.div>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="glass-card border-2 border-gradient-to-r from-purple-500/50 to-cyan-500/50 max-w-4xl mx-auto relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-3xl"></div>
              <CardContent className="relative p-12">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                >
                  <h3 className="text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                    Ready to Start Earning?
                  </h3>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of users already earning crypto through our gamified loyalty platform.
                    Connect your wallet and start your Web3 journey today.
                  </p>
                  
                  {/* Multiple CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleLogin} 
                        size="lg" 
                        className="btn-primary animate-glow text-2xl px-12 py-6 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25"
                      >
                        <Coins className="w-8 h-8 mr-4" />
                        Start Earning Now
                        <ArrowRight className="w-8 h-8 ml-4" />
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      className="flex items-center space-x-6 text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 2 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span>Free to Start</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-green-400" />
                        <span>1000+ Active Users</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.footer 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="flex items-center justify-center space-x-8 mb-6 text-gray-400">
            <motion.span 
              whileHover={{ color: "#a855f7" }}
              className="transition-colors cursor-pointer"
            >
              Powered by Replit
            </motion.span>
            <span className="text-gray-600">•</span>
            <motion.span 
              whileHover={{ color: "#06b6d4" }}
              className="transition-colors cursor-pointer"
            >
              Built with passion for Web3
            </motion.span>
            <span className="text-gray-600">•</span>
            <motion.span 
              whileHover={{ color: "#10b981" }}
              className="transition-colors cursor-pointer"
            >
              Enterprise Ready
            </motion.span>
          </div>
          <p className="text-gray-500 text-lg">© 2025 Chonk9k Suite. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
}