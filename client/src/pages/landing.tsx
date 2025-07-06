import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chonk9kLogo from "@/components/chonk9k-logo";
import AnimatedBackground from "@/components/animated-background";
import { ArrowRight, Zap, Coins, Trophy, Users, TrendingUp, GamepadIcon } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-3">
            <Chonk9kLogo size="lg" animated />
            <div>
              <h1 className="text-2xl font-orbitron font-bold">Chonk9k Suite</h1>
              <p className="text-sm text-gray-400">Web3 Loyalty Gaming Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 font-mono">
              v3.0 Enterprise
            </Badge>
            <Button onClick={handleLogin} className="btn-primary animate-glow">
              Login to Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </header>

        <div className="text-center mb-16">
          <h2 className="text-6xl font-orbitron font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Earn Real Crypto
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete daily tasks, play games, and earn <span className="text-purple-400 font-bold">$SLERF</span> and <span className="text-cyan-400 font-bold">$CHONK9K</span> tokens.
            Join the ultimate Web3 gaming experience with real blockchain rewards.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Base Chain (SLERF)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Solana (CHONKPUMP)</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Tasks</h3>
              <p className="text-gray-400">
                Complete simple daily challenges and earn tokens. Check-in, share content, and invite friends to maximize rewards.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GamepadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Gaming Experience</h3>
              <p className="text-gray-400">
                Play SLERF mining games, price prediction challenges, and trivia to earn bonus tokens and climb leaderboards.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/30 hover:border-green-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real Blockchain Integration</h3>
              <p className="text-gray-400">
                Connect your wallet and earn real cryptocurrency rewards. Track your portfolio with live token prices and balances.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">$SLERF</div>
            <div className="text-gray-400">Base Chain Token</div>
            <div className="text-sm text-gray-500 mt-1">@slerf00</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">$CHONK9K</div>
            <div className="text-gray-400">Solana Token</div>
            <div className="text-sm text-gray-500 mt-1">@chonkpump9000</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">Live Trading</div>
            <div className="text-gray-400">Real-Time Charts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">Staking</div>
            <div className="text-gray-400">Earn Passive Income</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="glass-card border-gradient-to-r from-purple-500/50 to-cyan-500/50 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Earning?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of users already earning crypto through our gamified loyalty platform.
                Connect your wallet and start your Web3 journey today.
              </p>
              <Button onClick={handleLogin} size="lg" className="btn-primary animate-glow">
                <Coins className="w-5 h-5 mr-2" />
                Start Earning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <span>Powered by Replit</span>
            <span>•</span>
            <span>Built with ❤️ for Web3</span>
            <span>•</span>
            <span>Enterprise Ready</span>
          </div>
          <p>© 2025 Chonk9k Suite. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}