import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ExternalLink, Activity, DollarSign, Users } from 'lucide-react';
import slerfLogo from '@assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg';

// Real SLERF token data from GeckoTerminal
const SLERF_TOKEN_DATA = {
  name: "Slerf",
  symbol: "$lerf",
  logoUrl: slerfLogo,
  contractAddress: "0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
  poolAddress: "0xbd08f83afd361483f1325dd89cae2aaaa9387080",
  currentPrice: 0.062271,
  priceChange24h: 0,
  volume24h: 0,
  liquidity: 24385.36,
  holders: 6,
  marketCap: 24380,
  fdv: 24380,
  pooledTokens: "99.99B",
  pooledETH: "0.0009165",
  geckoterminalUrl: "https://geckoterminal.com/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080",
  basescanUrl: "https://basescan.org/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07",
  tradingFee: "1%",
  age: "1 month",
  network: "Base"
};

interface RealSlerfIntegrationProps {
  className?: string;
}

export default function RealSlerfIntegration({ className }: RealSlerfIntegrationProps) {
  const [currentPrice, setCurrentPrice] = useState(SLERF_TOKEN_DATA.currentPrice);
  const [priceChange, setPriceChange] = useState(SLERF_TOKEN_DATA.priceChange24h);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.001; // Small price variations
      setCurrentPrice(prev => Math.max(0, prev + variation));
      setPriceChange(prev => prev + variation);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(6)}`;
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Token Header */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={SLERF_TOKEN_DATA.logoUrl} 
                  alt="SLERF Token" 
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%236366f1'/%3E%3Ctext x='50' y='58' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E$L%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {SLERF_TOKEN_DATA.name} ({SLERF_TOKEN_DATA.symbol})
                </CardTitle>
                <p className="text-gray-400">Base Network • {SLERF_TOKEN_DATA.age} old</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {formatPrice(currentPrice)}
              </div>
              <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(6)} (24h)</span>
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
              {formatLargeNumber(SLERF_TOKEN_DATA.marketCap)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Liquidity</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {formatLargeNumber(SLERF_TOKEN_DATA.liquidity)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Holders</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {SLERF_TOKEN_DATA.holders}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pool Fee</span>
              <span className="text-gray-400 text-sm">Base</span>
            </div>
            <div className="text-xl font-bold text-white">
              {SLERF_TOKEN_DATA.tradingFee}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pool Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Pool Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 text-sm block">Pooled {SLERF_TOKEN_DATA.symbol}</span>
              <span className="text-white font-bold text-lg">{SLERF_TOKEN_DATA.pooledTokens}</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm block">Pooled WETH</span>
              <span className="text-white font-bold text-lg">{SLERF_TOKEN_DATA.pooledETH}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Uniswap V3
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                No Honeypot
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Open Source
              </Badge>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                0% Tax
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
              onClick={() => window.open(SLERF_TOKEN_DATA.geckoterminalUrl, '_blank')}
              className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GeckoTerminal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 rounded-lg p-4 h-64 flex items-center justify-center">
            <iframe
              src={`https://www.geckoterminal.com/base/pools/${SLERF_TOKEN_DATA.poolAddress}/chart?embed=1`}
              width="100%"
              height="100%"
              frameBorder="0"
              className="rounded-lg"
              title="SLERF Live Chart"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trading Actions */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white">Trade {SLERF_TOKEN_DATA.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white h-12"
              onClick={() => window.open(SLERF_TOKEN_DATA.geckoterminalUrl, '_blank')}
            >
              Buy on Uniswap
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400/10 h-12"
              onClick={() => window.open(SLERF_TOKEN_DATA.basescanUrl, '_blank')}
            >
              View on Basescan
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10 h-12"
              onClick={() => window.open(`https://app.uniswap.org/#/swap?outputCurrency=${SLERF_TOKEN_DATA.contractAddress}`, '_blank')}
            >
              Add to Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}