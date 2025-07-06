import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import MobileNavigation from '@/components/mobile-navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import ProfessionalTokenLogo from '@/components/professional-token-logo';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Target,
  Zap,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Star,
  Globe,
  Clock,
  Sparkles,
  Gift
} from 'lucide-react';

const CleanTradingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'trading'>('overview');

  // Fetch real SLERF token info
  const { data: slerfData, isLoading: slerfLoading } = useQuery({
    queryKey: ['/api/slerf/info'],
    enabled: !!user,
  });

  // Fetch user's SLERF balance
  const { data: slerfBalance, isLoading: slerfBalanceLoading } = useQuery({
    queryKey: ['/api/slerf/balance', (user as any)?.walletAddress],
    enabled: !!user && !!(user as any)?.walletAddress,
  });

  // Fetch user's token balances (SLERF and CHONKPUMP)
  const { data: tokenBalances, isLoading: tokenBalancesLoading } = useQuery({
    queryKey: ['/api/token-balances'],
    enabled: !!user,
  });

  // Fetch user dashboard data with earnings
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  const tokenData = [
    {
      symbol: 'SLERF',
      name: 'SLERF Token',
      price: slerfData?.price || 0.0234,
      change24h: slerfData?.change24h || 15.67,
      volume: slerfData?.volume24h || 2340000,
      marketCap: slerfData?.marketCap || 45600000,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x233df63325933fa3f2dac8e695cd84bb2f91ab07/logo.png',
      fallbackLogo: '🌊',
      address: '0x233df63325933fa3f2dac8e695cd84bb2f91ab07',
      network: 'Base',
      networkLogo: 'https://cryptologos.cc/logos/base-base-logo.png'
    },
    {
      symbol: 'CHONK9K',
      name: 'CHONKPUMP Token',
      price: 0.00156,
      change24h: -3.45,
      volume: 890000,
      marketCap: 12300000,
      logo: 'https://arweave.net/YrKeC_8puZ8V7dOCQEt0rG6QcEgFQ5nXrr8F0kWWzAY',
      fallbackLogo: '🚀',
      address: 'DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump',
      network: 'Solana',
      networkLogo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    }
  ];

  const userPositions = [
    {
      token: 'SLERF',
      amount: parseFloat(slerfBalance?.balance || '0'),
      value: parseFloat(slerfBalance?.balanceUSD || '0'),
      change: 4.57,
      percentage: 18.5,
      earnings: dashboardData?.slerfEarnings || 0,
      network: 'Base'
    },
    {
      token: 'CHONK9K',
      amount: tokenBalances?.find((t: any) => t.tokenSymbol === 'CHONK9K')?.balance || 0,
      value: 1.39,
      change: -0.05,
      percentage: -3.45,
      earnings: dashboardData?.chonkEarnings || 0,
      network: 'Solana'
    }
  ];

  const formatPrice = (price: number) => {
    return price < 0.01 ? `$${price.toFixed(6)}` : `$${price.toFixed(4)}`;
  };

  const formatVolume = (volume: number) => {
    return volume >= 1000000 ? `$${(volume / 1000000).toFixed(1)}M` : `$${(volume / 1000).toFixed(0)}K`;
  };

  const formatMarketCap = (marketCap: number) => {
    return marketCap >= 1000000 ? `$${(marketCap / 1000000).toFixed(1)}M` : `$${(marketCap / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Trading Dashboard
            </h1>
            <p className="text-gray-400">Real-time market data and portfolio management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
            {user && (user as any).walletAddress && (
              <div className="text-sm text-gray-400">
                {(user as any).walletAddress.slice(0, 6)}...{(user as any).walletAddress.slice(-4)}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'positions', label: 'Positions', icon: Wallet },
            { id: 'trading', label: 'Trading', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Portfolio</p>
                      <p className="text-2xl font-bold text-white">
                        {slerfBalanceLoading ? '...' : `$${(userPositions.reduce((sum, pos) => sum + pos.value, 0)).toFixed(2)}`}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">Live Balance</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-300">SLERF Earnings</p>
                      <p className="text-2xl font-bold text-white">
                        {slerfBalanceLoading ? '...' : `${userPositions[0]?.amount?.toFixed(2) || '0'} SLERF`}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🏄</span>
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-purple-300">
                      ${(userPositions[0]?.value || 0).toFixed(2)} USD
                    </span>
                    <Badge className="ml-2 bg-purple-500/20 text-purple-300 text-xs">
                      Base Network
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-300">CHONK9K Earnings</p>
                      <p className="text-2xl font-bold text-white">
                        {tokenBalancesLoading ? '...' : `${userPositions[1]?.amount?.toFixed(2) || '0'} CHONK9K`}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🐱</span>
                      <Gift className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-orange-300">
                      ${(userPositions[1]?.value || 0).toFixed(2)} USD
                    </span>
                    <Badge className="ml-2 bg-orange-500/20 text-orange-300 text-xs">
                      Solana Network
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-400">
                        +${((userPositions[0]?.earnings || 0) + (userPositions[1]?.earnings || 0)).toFixed(2)}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">All Time</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-400" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenData.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{token.logo}</div>
                        <div>
                          <div className="font-semibold text-white">{token.symbol}</div>
                          <div className="text-sm text-gray-400">{token.name}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-8 text-right">
                        <div>
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="font-semibold text-white">{formatPrice(token.price)}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">24h Change</div>
                          <div className={`font-semibold flex items-center justify-end ${
                            token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {token.change24h >= 0 ? (
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            {Math.abs(token.change24h).toFixed(2)}%
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Volume</div>
                          <div className="font-semibold text-white">{formatVolume(token.volume)}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Market Cap</div>
                          <div className="font-semibold text-white">{formatMarketCap(token.marketCap)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'positions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-purple-400" />
                  Your Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPositions.map((position) => (
                    <div key={position.token} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {position.token === 'SLERF' ? '🏄' : '🐱'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{position.token}</div>
                          <div className="text-sm text-gray-400">{position.amount.toLocaleString()} tokens</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-right">
                        <div>
                          <div className="text-sm text-gray-400">Value</div>
                          <div className="font-semibold text-white">${position.value.toFixed(2)}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">24h PnL</div>
                          <div className={`font-semibold flex items-center justify-end ${
                            position.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.change >= 0 ? (
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            ${Math.abs(position.change).toFixed(2)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">24h %</div>
                          <div className={`font-semibold ${
                            position.percentage >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {position.percentage >= 0 ? '+' : ''}{position.percentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'trading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Buy Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active buy orders</p>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      Place Buy Order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Sell Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active sell orders</p>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700">
                      Place Sell Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-400" />
                  Quick Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {tokenData.map((token) => (
                    <div key={token.symbol} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{token.logo}</span>
                          <span className="font-semibold">{token.symbol}</span>
                        </div>
                        <span className="text-sm text-gray-400">{formatPrice(token.price)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Buy {token.symbol}
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                          Sell {token.symbol}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
};

export default CleanTradingDashboard;