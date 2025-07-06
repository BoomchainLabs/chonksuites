import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chonk9kLogo from "@/components/chonk9k-logo";
import TokenMascot from "@/components/token-mascots";
import MascotShowcase from "@/components/mascot-showcase";
import { ArrowRight, Shield, TrendingUp, Zap, Globe, Users, Award, Rocket, CheckCircle, Star, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chonk9kLogo size="md" animated />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Boomchain Labs
                </h1>
                <p className="text-sm text-gray-400">Professional Web3 Platform</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a href="#platform" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Platform</a>
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Features</a>
              <a href="#security" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Security</a>
              <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
                Enterprise Ready
              </Badge>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-8">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-medium">Next-Generation Web3 Infrastructure</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Enterprise
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Web3 Suite
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Professional-grade blockchain platform combining institutional-level security, 
                real-time DeFi operations, and comprehensive token management for modern enterprises.
              </p>
            </motion.div>
            
            {/* CTA Buttons with Proper Spacing */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  onClick={handleLogin}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl border-0 transition-all duration-300 w-full sm:w-auto min-w-[280px]"
                >
                  <Shield className="w-6 h-6 mr-3" />
                  Access Platform
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto min-w-[280px] font-mono"
                  onClick={() => window.location.href = '/terminal'}
                >
                  <Terminal className="w-6 h-6 mr-3" />
                  Hacker Terminal
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto min-w-[280px]"
                  onClick={() => window.location.href = '/trading'}
                >
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Live Trading
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform" className="py-20 bg-black/20">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Professional Infrastructure
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Built for enterprises requiring institutional-grade security, scalability, and performance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Enterprise Security</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Multi-signature wallets, hardware security modules, and institutional-grade custody solutions.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-cyan-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Multi-sig Wallets</span>
                      </li>
                      <li className="flex items-center text-cyan-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Hardware Security</span>
                      </li>
                      <li className="flex items-center text-cyan-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Audit Compliance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Multi-Chain Operations</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Seamless integration across Base, Solana, and Ethereum networks with unified management.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-purple-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Base Chain Integration</span>
                      </li>
                      <li className="flex items-center text-purple-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Solana Network</span>
                      </li>
                      <li className="flex items-center text-purple-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Cross-Chain Swaps</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Real-Time Analytics</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Advanced trading tools, portfolio management, and comprehensive reporting dashboard.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Live Market Data</span>
                      </li>
                      <li className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Portfolio Analytics</span>
                      </li>
                      <li className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <span>Risk Management</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Ecosystem */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Token Ecosystem
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional token management with institutional-grade staking and DeFi integration
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-purple-400 mb-2">$SLERF</h3>
                        <p className="text-gray-300">Base Chain Token</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Network</span>
                        <span className="text-white font-medium">Base Chain</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Max APY</span>
                        <span className="text-purple-400 font-bold">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Staking Pools</span>
                        <span className="text-white font-medium">4 Tiers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-800/30 border-cyan-500/30 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-cyan-400 mb-2">$CHONK9K</h3>
                        <p className="text-gray-300">Solana Token</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Network</span>
                        <span className="text-white font-medium">Solana</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Max APY</span>
                        <span className="text-cyan-400 font-bold">28%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Gaming Rewards</span>
                        <span className="text-white font-medium">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">99.9%</div>
                <div className="text-gray-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">$10M+</div>
                <div className="text-gray-300">Assets Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">50K+</div>
                <div className="text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join institutional investors and professional traders on the most advanced Web3 platform
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-16 py-8 text-2xl font-semibold rounded-2xl shadow-2xl border-0 transition-all duration-300"
              >
                <Shield className="w-8 h-8 mr-4" />
                Access Platform Now
                <ArrowRight className="w-8 h-8 ml-4" />
              </Button>
            </motion.div>
            
            <p className="text-gray-400 mt-8 text-lg">
              🔐 Enterprise Security • 🚀 Institutional Grade • ⚡ Real-Time Operations
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}