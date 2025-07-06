import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ProfessionalTokenLogo from '@/components/professional-token-logo';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Trophy,
  DollarSign,
  Lock,
  Activity,
  Globe,
  Coins,
  Star,
  ChevronRight,
  BarChart3,
  Briefcase,
  Award
} from 'lucide-react';

export default function ProfessionalLanding() {
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<'solana' | 'base'>('base');
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      toast({
        title: "Welcome to the Financial Revolution",
        description: "Your professional trading account is now active.",
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

  const handleConnect = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please enter your wallet address to begin earning.",
        variant: "destructive",
      });
      return;
    }

    await connectWallet.mutateAsync({ 
      address: walletAddress, 
      chainType: selectedChain 
    });
  };

  const generateDemoWallet = () => {
    if (selectedChain === 'solana') {
      setWalletAddress('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM');
    } else {
      setWalletAddress('0x742d35Cc6635C0532925a3b8D4c8ebb4ebF3d4e8');
    }
  };

  const stats = [
    { label: 'Total Volume Traded', value: '$127.5M', icon: BarChart3, color: 'text-green-400' },
    { label: 'Active Traders', value: '45,823', icon: Users, color: 'text-blue-400' },
    { label: 'Total Rewards Paid', value: '$8.9M', icon: DollarSign, color: 'text-purple-400' },
    { label: 'Platform Uptime', value: '99.97%', icon: Shield, color: 'text-cyan-400' }
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Earn Real Crypto Daily',
      description: 'Earn $SLERF and $CHONK9K tokens through trading, staking, and community participation',
      highlight: 'Up to 24.7% APY'
    },
    {
      icon: TrendingUp,
      title: 'Professional Trading Suite',
      description: 'Advanced charting, real-time market data, and institutional-grade trading tools',
      highlight: 'Real-time prices'
    },
    {
      icon: Lock,
      title: 'Secure Staking Pools',
      description: 'Stake your tokens in audited smart contracts with flexible withdrawal options',
      highlight: 'Audited contracts'
    },
    {
      icon: Trophy,
      title: 'Competitive Rewards',
      description: 'Daily challenges, leaderboards, and achievement-based token rewards',
      highlight: 'Daily rewards'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.02)_50%,transparent_65%)] bg-[length:20px_20px]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Institutional-Grade DeFi Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Professional
            </span>
            <br />
            <span className="text-white">Crypto Trading</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Access institutional-grade trading tools, earn up to <span className="text-green-400 font-bold">24.7% APY</span> on staked assets, 
            and participate in the future of decentralized finance with real $SLERF and $CHONK9K token rewards.
          </p>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur border-purple-500/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Briefcase className="w-6 h-6 mr-3 text-purple-400" />
                  Start Professional Trading
                </CardTitle>
                <p className="text-gray-400">
                  Connect your wallet to access institutional-grade trading tools and start earning real crypto rewards
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Network Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Select Network:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      variant={selectedChain === 'base' ? 'default' : 'outline'}
                      onClick={() => setSelectedChain('base')}
                      className="h-20 flex flex-col items-center space-y-3 p-6 text-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <ProfessionalTokenLogo symbol="BASE" size="md" />
                        <span className="font-bold">Base Network</span>
                      </div>
                      <span className="text-sm text-gray-400">$SLERF Trading Hub</span>
                    </Button>
                    <Button
                      variant={selectedChain === 'solana' ? 'default' : 'outline'}
                      onClick={() => setSelectedChain('solana')}
                      className="h-20 flex flex-col items-center space-y-3 p-6 text-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <ProfessionalTokenLogo symbol="SOL" size="md" />
                        <span className="font-bold">Solana Network</span>
                      </div>
                      <span className="text-sm text-gray-400">$CHONK9K Trading Hub</span>
                    </Button>
                  </div>
                </div>

                {/* Wallet Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Professional Wallet Address:</label>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder={selectedChain === 'solana' ? 'Solana wallet address...' : 'EVM wallet address...'}
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 h-16 text-base px-6 py-4 rounded-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={generateDemoWallet}
                      className="w-full h-14 text-base font-semibold rounded-lg"
                    >
                      Use Demo Wallet for Testing
                    </Button>
                  </div>
                </div>

                {/* Connect Button */}
                <Button
                  onClick={handleConnect}
                  disabled={!walletAddress || connectWallet.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 h-20 text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {connectWallet.isPending ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting Professional Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Wallet className="w-6 h-6" />
                      <span>Access Professional Platform</span>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-400 mb-1">Bank-Grade Security</h4>
                      <p className="text-sm text-gray-400">
                        Your private keys remain secure. We use read-only wallet connections and audited smart contracts.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Premium Features</h2>
              <p className="text-gray-400">
                Access the same tools used by professional traders and institutional investors
              </p>
            </div>

            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            {feature.highlight}
                          </Badge>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        <div className="flex items-center mt-3 text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                          <span>Learn More</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Token Information */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-purple-400" />
                  Featured Trading Pairs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <ProfessionalTokenLogo symbol="SLERF" size="md" />
                      <div>
                        <div className="font-bold text-white">$SLERF</div>
                        <div className="text-xs text-gray-400">Base Network</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div>Price: <span className="text-green-400">$0.0234</span></div>
                      <div>24h: <span className="text-green-400">+15.67%</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <ProfessionalTokenLogo symbol="CHONK9K" size="md" />
                      <div>
                        <div className="font-bold text-white">$CHONK9K</div>
                        <div className="text-xs text-gray-400">Solana Network</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div>Price: <span className="text-red-400">$0.00156</span></div>
                      <div>24h: <span className="text-red-400">-3.45%</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-gray-500"
        >
          <p className="mb-2">
            Trusted by professional traders • Audited smart contracts • Institutional security
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              SOC 2 Compliant
            </span>
            <span className="flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              Multi-sig Security
            </span>
            <span className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              99.97% Uptime
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}