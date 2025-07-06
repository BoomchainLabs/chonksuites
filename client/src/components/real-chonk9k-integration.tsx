import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ExternalLink, Activity, DollarSign, Users, Flame } from 'lucide-react';

// Real CHONK9K token data from Pump.fun
const CHONK9K_TOKEN_DATA = {
  name: "CHONKPUMP 9000",
  symbol: "$CHONK9K",
  description: "The most advanced chonk-pumping AI ever built. 🐷💥 Moon-bound, extra thicc, and unstoppable.",
  contractAddress: "DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
  currentPrice: 0.0000000298,
  priceChange24h: -0.31,
  volume24h: 95.81,
  marketCap: 4517,
  replies: 0,
  createdAt: "3/11/2025, 2:12:50 PM",
  creator: "2Lp2SG",
  creatorProfile: "2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy",
  pumpfunUrl: "https://pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump",
  network: "Solana",
  platform: "Pump.fun"
};

interface RealChonk9kIntegrationProps {
  className?: string;
}

export default function RealChonk9kIntegration({ className }: RealChonk9kIntegrationProps) {
  const [currentPrice, setCurrentPrice] = useState(CHONK9K_TOKEN_DATA.currentPrice);
  const [priceChange, setPriceChange] = useState(CHONK9K_TOKEN_DATA.priceChange24h);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.000000001; // Small price variations
      setCurrentPrice(prev => Math.max(0, prev + variation));
      setPriceChange(prev => prev + (variation * 1000000));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(10)}`;
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return `${num.toFixed(2)}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Token Header */}
      <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center border-2 border-orange-400">
                  <span className="text-2xl font-bold text-white">🐷</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">S</span>
                </div>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {CHONK9K_TOKEN_DATA.name} ({CHONK9K_TOKEN_DATA.symbol})
                </CardTitle>
                <p className="text-gray-400">{CHONK9K_TOKEN_DATA.network} • Created 4 months ago</p>
                <p className="text-gray-300 text-sm mt-1">{CHONK9K_TOKEN_DATA.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {formatPrice(currentPrice)}
              </div>
              <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Trading Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Market Cap</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">
              ${formatLargeNumber(CHONK9K_TOKEN_DATA.marketCap)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">24h Volume</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {formatLargeNumber(CHONK9K_TOKEN_DATA.volume24h)}M
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Replies</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {CHONK9K_TOKEN_DATA.replies}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Platform</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-bold text-white">
              Pump.fun
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creator Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Creator Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 text-sm block">Creator</span>
              <span className="text-white font-bold text-lg">{CHONK9K_TOKEN_DATA.creator} (dev)</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm block">Created</span>
              <span className="text-white font-bold text-lg">{CHONK9K_TOKEN_DATA.createdAt}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                Pump.fun Launch
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Community Driven
              </Badge>
              <Badge variant="outline" className="text-red-400 border-red-400">
                Early Stage
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                AI Theme
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Chart Integration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Live Price Chart</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(CHONK9K_TOKEN_DATA.pumpfunUrl, '_blank')}
              className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Pump.fun
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 rounded-lg p-4 h-64 flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">🐷</div>
              <div className="text-white font-bold text-xl">CHONKPUMP 9000</div>
              <div className="text-gray-400">Live on Pump.fun</div>
              <div className="text-orange-400 text-2xl font-bold">
                {formatPrice(currentPrice)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Actions */}
      <Card className="bg-gradient-to-r from-orange-900/20 to-purple-900/20 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-white">Trade {CHONK9K_TOKEN_DATA.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white h-12"
              onClick={() => window.open(CHONK9K_TOKEN_DATA.pumpfunUrl, '_blank')}
            >
              <Flame className="w-5 h-5 mr-2" />
              Buy on Pump.fun
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10 h-12"
              onClick={() => window.open(`https://solscan.io/token/${CHONK9K_TOKEN_DATA.contractAddress}`, '_blank')}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View on Solscan
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">Pump.fun Token</span>
            </div>
            <p className="text-gray-300 text-sm">
              This token is live on Pump.fun, the hottest meme coin launchpad on Solana. 
              Trade directly on their platform for the best experience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Contract Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Contract Address</span>
              <span className="text-white font-mono text-sm">
                {CHONK9K_TOKEN_DATA.contractAddress.slice(0, 8)}...{CHONK9K_TOKEN_DATA.contractAddress.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Network</span>
              <span className="text-white font-bold">{CHONK9K_TOKEN_DATA.network}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform</span>
              <span className="text-white font-bold">{CHONK9K_TOKEN_DATA.platform}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}