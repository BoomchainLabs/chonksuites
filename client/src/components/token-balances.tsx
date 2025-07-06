import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/wallet-utils";
import { TokenBalance } from "@shared/schema";
import TokenLogo from "@/components/token-logo";

interface TokenBalancesProps {
  balances: TokenBalance[];
}

export default function TokenBalances({ balances }: TokenBalancesProps) {
  const slerfBalance = balances.find(b => b.tokenSymbol === "SLERF");
  const chonkBalance = balances.find(b => b.tokenSymbol === "CHONKPUMP");

  return (
    <div className="hidden md:flex items-center space-x-6">
      <Card className="glass-card border-purple-500/30 hover:neon-glow-hover transition-all duration-300">
        <CardContent className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <TokenLogo tokenSymbol="SLERF" />
            <div>
              <p className="text-sm font-medium text-green-400">$SLERF</p>
              <p className="text-xs text-gray-400">
                {formatNumber(slerfBalance?.balance || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-purple-500/30 hover:neon-glow-hover transition-all duration-300">
        <CardContent className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <TokenLogo tokenSymbol="CHONKPUMP" />
            <div>
              <p className="text-sm font-medium text-orange-400">$CHONKPUMP</p>
              <p className="text-xs text-gray-400">
                {formatNumber(chonkBalance?.balance || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
