import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Chonk9kLogo from '@/components/chonk9k-logo';
import { 
  Wallet, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Coins,
  Star
} from 'lucide-react';

export default function WorkingLanding() {
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<'solana' | 'base'>('solana');
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
        title: "Welcome to Chonk9k Suite!",
        description: "Your wallet has been connected successfully.",
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
        title: "Address Required",
        description: "Please enter a valid wallet address.",
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
      setWalletAddress(`0x${Math.random().toString(16).slice(2, 42)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Chonk9kLogo size="xl" animated={true} />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-4">
            Chonk9k Suite
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The ultimate Web3 loyalty platform with multi-chain rewards, gaming mechanics, and real token earnings
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Wallet className="w-6 h-6 mr-3 text-purple-400" />
                  Connect Your Wallet
                </CardTitle>
                <p className="text-gray-400">
                  Start earning real crypto rewards by connecting your wallet
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Select Network:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedChain === 'solana' ? 'default' : 'outline'}
                      onClick={() => setSelectedChain('solana')}
                      className="h-12"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                        <span>Solana</span>
                      </div>
                    </Button>
                    <Button
                      variant={selectedChain === 'base' ? 'default' : 'outline'}
                      onClick={() => setSelectedChain('base')}
                      className="h-12"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                        <span>Base</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Wallet Address:</label>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder={selectedChain === 'solana' ? 'Enter Solana wallet address...' : 'Enter EVM wallet address...'}
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-slate-700/50 border-slate-600"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateDemoWallet}
                      className="w-full"
                    >
                      Generate Demo Address
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={!walletAddress || connectWallet.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 h-12"
                >
                  {connectWallet.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Connect Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-400 mb-1">Secure & Private</h4>
                      <p className="text-sm text-gray-400">
                        We never store your private keys. Your wallet connection is encrypted and secure.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Star className="w-5 h-5 mr-2 text-cyan-400" />
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Dual-Chain Rewards</h4>
                      <p className="text-sm text-gray-400">Earn $SLERF (Base) and $CHONK9K (Solana) tokens</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Daily Challenges</h4>
                      <p className="text-sm text-gray-400">Complete tasks and earn crypto rewards</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Live Trading</h4>
                      <p className="text-sm text-gray-400">Professional trading dashboard with real market data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Gamified Experience</h4>
                      <p className="text-sm text-gray-400">Achievements, leaderboards, and interactive mascots</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$2.4M</div>
                    <div className="text-sm text-gray-400">Total Rewards Distributed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">15.2K</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">98.7%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">24/7</div>
                    <div className="text-sm text-gray-400">Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>Powered by blockchain technology • Secured by encryption • Built for the future</p>
        </motion.div>
      </div>
    </div>
  );
}