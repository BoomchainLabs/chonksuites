import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PendingRewardsProps {
  userId?: string;
}

export default function PendingRewards({ userId }: PendingRewardsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/user-stats', userId],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="h-12 bg-gray-600 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  const pendingRewards = stats?.pendingRewards || 0;

  return (
    <div className="text-center py-6">
      <motion.p 
        className="text-4xl font-bold text-yellow-400 mb-2 text-glow interactive-text"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        {pendingRewards.toLocaleString()}
      </motion.p>
      <p className="text-gray-400">Total Claimable Tokens</p>
    </div>
  );
}