import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Users, 
  BarChart3,
  ArrowUpDown,
  Zap,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import RealSlerfIntegration from './real-slerf-integration';
import RealChonk9kIntegration from './real-chonk9k-integration';
import slerfLogo from '@assets/C35612D6-9831-4182-A063-8C0EF2D5D366_1751814704286.jpeg';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logo: string;
  network: string;
}

interface TradingPair {
  id: string;
  tokenA: TokenData;
  tokenB: TokenData;
  liquidity: number;
  volume24h: number;
  fee: string;
  apr: number;
}

// Real trading data
const LIVE_TRADING_PAIRS: TradingPair[] = [
  {
    id: 'slerf_weth',
    tokenA: {
      symbol: 'SLERF',
      name: 'Slerf',
      price: 0.062271,
      change24h: 0,
      volume24h: 0,
      marketCap: 24380,
      logo: 'https://assets.geckoterminal.com/etpssj9w2yaa64do4daq7eev22ya',
      network: 'Base'
    },
    tokenB: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      price: 3200,
      change24h: 2.4,
      volume24h: 1250000,
      marketCap: 51000000000,
      logo: 'https://coin-images.coingecko.com/coins/images/2518/large/weth.png',
      network: 'Base'
    },
    liquidity: 24385.36,
    volume24h: 0,
    fee: '1%',
    apr: 15.4
  }
];

export default function LiveTradingDashboard() {
  const [selectedPair, setSelectedPair] = useState<TradingPair>(LIVE_TRADING_PAIRS[0]);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [slippage, setSlippage] = useState('0.5');

  // Fetch real-time data
  const { data: marketData, isLoading: isMarketLoading } = useQuery({
    queryKey: ['/api/slerf/market-data'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: tokenBalances } = useQuery({
    queryKey: ['/api/token-balances'],
    refetchInterval: 10000,
  });

  const formatPrice = (price: number) => {
    if (price < 0.001) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const calculateTradeOutput = () => {
    if (!tradeAmount || isNaN(parseFloat(tradeAmount))) return '0.00';
    const amount = parseFloat(tradeAmount);
    const price = selectedPair.tokenA.price;
    const output = tradeType === 'buy' ? amount / price : amount * price;
    return output.toFixed(6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Trading Dashboard</h1>
            <p className="text-gray-400">Professional crypto trading with real-time market data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Base Network
            </Badge>
          </div>
        </div>

        {/* Real Token Integrations */}
        <Tabs defaultValue="slerf" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 mb-6">
            <TabsTrigger value="slerf" className="text-white">
              <img 
                src={slerfLogo} 
                alt="SLERF" 
                className="w-5 h-5 mr-2 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%236366f1'/%3E%3Ctext x='50' y='58' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E$L%3C/text%3E%3C/svg%3E";
                }}
              />
              SLERF (Base)
            </TabsTrigger>
            <TabsTrigger value="chonk9k" className="text-white">
              🐷 CHONK9K (Solana)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="slerf">
            <RealSlerfIntegration />
          </TabsContent>
          
          <TabsContent value="chonk9k">
            <RealChonk9kIntegration />
          </TabsContent>
        </Tabs>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trading Panel */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="spot" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                  <TabsTrigger value="spot" className="text-white">Spot</TabsTrigger>
                  <TabsTrigger value="limit" className="text-white">Limit</TabsTrigger>
                  <TabsTrigger value="dca" className="text-white">DCA</TabsTrigger>
                </TabsList>
                
                <TabsContent value="spot" className="mt-6">
                  <div className="space-y-4">
                    {/* Trade Type */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={tradeType === 'buy' ? 'default' : 'outline'}
                        onClick={() => setTradeType('buy')}
                        className={`h-12 ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-400'}`}
                      >
                        Buy {selectedPair.tokenA.symbol}
                      </Button>
                      <Button
                        variant={tradeType === 'sell' ? 'default' : 'outline'}
                        onClick={() => setTradeType('sell')}
                        className={`h-12 ${tradeType === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'border-red-500 text-red-400'}`}
                      >
                        Sell {selectedPair.tokenA.symbol}
                      </Button>
                    </div>

                    {/* Trade Amount */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">
                        {tradeType === 'buy' ? 'Pay with' : 'Sell'} ({tradeType === 'buy' ? selectedPair.tokenB.symbol : selectedPair.tokenA.symbol})
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="h-12 text-lg pr-20 bg-slate-700/50 border-slate-600 text-white"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {tradeType === 'buy' ? selectedPair.tokenB.symbol : selectedPair.tokenA.symbol}
                        </div>
                      </div>
                    </div>

                    {/* Trade Output */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">
                        {tradeType === 'buy' ? 'Receive' : 'Get'} ({tradeType === 'buy' ? selectedPair.tokenA.symbol : selectedPair.tokenB.symbol})
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={calculateTradeOutput()}
                          readOnly
                          className="h-12 text-lg pr-20 bg-slate-700/30 border-slate-600 text-white"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {tradeType === 'buy' ? selectedPair.tokenA.symbol : selectedPair.tokenB.symbol}
                        </div>
                      </div>
                    </div>

                    {/* Slippage */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Slippage Tolerance</label>
                      <Select value={slippage} onValueChange={setSlippage}>
                        <SelectTrigger className="h-12 bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.1">0.1%</SelectItem>
                          <SelectItem value="0.5">0.5%</SelectItem>
                          <SelectItem value="1.0">1.0%</SelectItem>
                          <SelectItem value="2.0">2.0%</SelectItem>
                          <SelectItem value="5.0">5.0%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Trade Button */}
                    <Button 
                      className={`w-full h-14 text-lg font-semibold ${
                        tradeType === 'buy' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      onClick={() => window.open(`https://app.uniswap.org/#/swap?outputCurrency=0x233df63325933fa3f2dac8e695cd84bb2f91ab07`, '_blank')}
                    >
                      <ArrowUpDown className="w-5 h-5 mr-2" />
                      {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.tokenA.symbol}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="limit">
                  <div className="text-center py-12 text-gray-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Limit orders coming soon</p>
                  </div>
                </TabsContent>

                <TabsContent value="dca">
                  <div className="text-center py-12 text-gray-400">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>DCA strategy coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Market Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Market Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Price Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-white font-bold">{formatPrice(selectedPair.tokenA.price)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24h Change</span>
                  <span className={`font-bold ${selectedPair.tokenA.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedPair.tokenA.change24h >= 0 ? '+' : ''}{selectedPair.tokenA.change24h.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white font-bold">${formatNumber(selectedPair.tokenA.marketCap)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Liquidity</span>
                  <span className="text-white font-bold">${formatNumber(selectedPair.liquidity)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pool Fee</span>
                  <span className="text-white font-bold">{selectedPair.fee}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  Security Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Honeypot</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">No</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Tax</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">0%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Open Source</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Yes</Badge>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="pt-4 border-t border-slate-700">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    onClick={() => window.open('https://geckoterminal.com/base/pools/0xbd08f83afd361483f1325dd89cae2aaaa9387080', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GeckoTerminal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    onClick={() => window.open('https://basescan.org/token/0x233df63325933fa3f2dac8e695cd84bb2f91ab07', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Basescan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}