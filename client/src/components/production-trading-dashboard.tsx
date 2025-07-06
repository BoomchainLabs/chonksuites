import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Target,
  Zap,
  Shield,
  Coins
} from 'lucide-react';

interface TokenData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

const ProductionTradingDashboard: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenData[]>([
    {
      symbol: '$SLERF',
      price: 0.0234,
      change24h: 15.67,
      volume: 2340000,
      marketCap: 45600000
    },
    {
      symbol: '$CHONK9K',
      price: 0.00156,
      change24h: -3.45,
      volume: 890000,
      marketCap: 12300000
    }
  ]);

  const [userStats] = useState({
    totalValue: 12450.67,
    dayChange: 234.56,
    dayChangePercent: 1.92,
    totalRewards: 1850.23
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenData(prev => prev.map(token => ({
        ...token,
        price: token.price * (1 + (Math.random() - 0.5) * 0.02),
        change24h: token.change24h + (Math.random() - 0.5) * 2
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-2">
            Professional Trading Dashboard
          </h1>
          <p className="text-gray-400">Real-time Web3 token trading and analytics</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Portfolio</p>
                  <p className="text-2xl font-bold text-white">
                    ${userStats.totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className={`flex items-center mt-2 ${userStats.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {userStats.dayChangePercent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="text-sm">
                  ${Math.abs(userStats.dayChange).toFixed(2)} ({Math.abs(userStats.dayChangePercent)}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-white">
                    ${(tokenData.reduce((sum, token) => sum + token.volume, 0) / 1000000).toFixed(2)}M
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Rewards</p>
                  <p className="text-2xl font-bold text-white">
                    ${userStats.totalRewards.toFixed(2)}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Trades</p>
                  <p className="text-2xl font-bold text-white">7</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Token List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {tokenData.map((token) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${token.symbol === '$SLERF' ? 'bg-purple-500' : 'bg-cyan-500'} animate-pulse`}></div>
                      <span className="text-xl font-bold">{token.symbol}</span>
                      <Badge variant={token.change24h >= 0 ? 'default' : 'destructive'}>
                        {token.change24h >= 0 ? 'UP' : 'DOWN'}
                      </Badge>
                    </div>
                    <div className={`text-right ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-2xl font-bold text-white">
                        ${token.price.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">24h Change:</span>
                      <span className={`font-semibold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-white">
                        ${(token.volume / 1000000).toFixed(2)}M
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-white">
                        ${(token.marketCap / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => console.log(`Buy ${token.symbol}`)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Buy
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => console.log(`Sell ${token.symbol}`)}
                      >
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Sell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Portfolio Analytics</h3>
              <p className="text-gray-400 mb-4">Deep dive into your trading performance</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Auto Trading</h3>
              <p className="text-gray-400 mb-4">Set up automated trading strategies</p>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Configure Bots
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
              <p className="text-gray-400 mb-4">Monitor and control your trading risks</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Risk Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductionTradingDashboard;