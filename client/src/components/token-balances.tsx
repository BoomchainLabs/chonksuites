import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface TokenBalancesProps {
  userId?: string;
  balances?: any[];
}

export default function TokenBalances({ userId, balances: propBalances }: TokenBalancesProps) {
  const { data: queryBalances, isLoading } = useQuery({
    queryKey: ['/api/token-balances', userId],
    enabled: !!userId && !propBalances,
  });

  const balances = propBalances || queryBalances;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 animate-pulse">
          <p className="text-sm text-gray-400">SLERF Balance</p>
          <div className="h-8 bg-gray-600 rounded mt-2"></div>
        </div>
        <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20 animate-pulse">
          <p className="text-sm text-gray-400">CHONK9K Balance</p>
          <div className="h-8 bg-gray-600 rounded mt-2"></div>
        </div>
      </div>
    );
  }

  const slerfBalance = Array.isArray(balances) ? balances.find((b: any) => b.tokenSymbol === 'SLERF')?.balance || 0 : 0;
  const chonkBalance = Array.isArray(balances) ? balances.find((b: any) => b.tokenSymbol === 'CHONK9K')?.balance || 0 : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 interactive-token"
      >
        <p className="text-sm text-gray-400">SLERF Balance</p>
        <p className="text-2xl font-bold text-purple-400 text-glow">
          {slerfBalance.toLocaleString()}
        </p>
      </motion.div>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20 interactive-token"
      >
        <p className="text-sm text-gray-400">CHONK9K Balance</p>
        <p className="text-2xl font-bold text-cyan-400 text-glow">
          {chonkBalance.toLocaleString()}
        </p>
      </motion.div>
    </div>
  );
}