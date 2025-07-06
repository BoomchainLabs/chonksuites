import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, TrendingUp, DollarSign } from "lucide-react";
import TokenLogo from "@/components/token-logo";

interface NetworkStatus {
  base: boolean;
  solana: boolean;
}

interface TokenPrices {
  LERF: number;
  CHONK9K: number;
}

export default function Web3Status() {
  const { data: networkStatus, isLoading: statusLoading } = useQuery<NetworkStatus>({
    queryKey: ['/api/web3/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: tokenPrices, isLoading: pricesLoading } = useQuery<TokenPrices>({
    queryKey: ['/api/web3/prices'],
    refetchInterval: 60000, // Refresh every minute
  });

  if (statusLoading || pricesLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-orange-400 font-medium">Base Network</span>
          </div>
          <Badge 
            variant={networkStatus?.base ? "default" : "destructive"}
            className={networkStatus?.base ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
          >
            {networkStatus?.base ? (
              <><Wifi className="h-3 w-3 mr-1" />Online</>
            ) : (
              <><WifiOff className="h-3 w-3 mr-1" />Offline</>
            )}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-purple-400 font-medium">Solana Network</span>
          </div>
          <Badge 
            variant={networkStatus?.solana ? "default" : "destructive"}
            className={networkStatus?.solana ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
          >
            {networkStatus?.solana ? (
              <><Wifi className="h-3 w-3 mr-1" />Online</>
            ) : (
              <><WifiOff className="h-3 w-3 mr-1" />Offline</>
            )}
          </Badge>
        </div>

        {/* Token Prices */}
        {tokenPrices && (
          <div className="pt-2 border-t border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Token Prices</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TokenLogo tokenSymbol="LERF" size="sm" />
                  <span className="text-white text-sm">$LERF</span>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-3 w-3" />
                  <span className="text-sm font-mono">
                    {tokenPrices.LERF?.toFixed(6) || '0.000000'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TokenLogo tokenSymbol="CHONK9K" size="sm" />
                  <span className="text-white text-sm">$CHONK9K</span>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-3 w-3" />
                  <span className="text-sm font-mono">
                    {tokenPrices.CHONK9K?.toFixed(8) || '0.00000000'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Footer */}
        <div className="text-xs text-gray-400 pt-2 border-t border-purple-500/30">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}