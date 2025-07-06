import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ClaimRewardsProps {
  userId: number;
  pendingRewards: number;
}

export default function ClaimRewards({ userId, pendingRewards }: ClaimRewardsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/claim', { userId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Rewards Claimed!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron font-bold text-center">
          Claim Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="glass-card p-6 border border-gray-700 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-yellow-400 mr-2 animate-spin-slow" />
                <p className="text-3xl font-bold text-green-400">
                  {pendingRewards.toFixed(1)}
                </p>
                <Sparkles className="w-6 h-6 text-yellow-400 ml-2 animate-spin-slow" />
              </div>
              <p className="text-gray-400">$SLERF Available to Claim</p>
            </div>
          </div>
          
          <Button
            className="btn-success text-lg py-3 px-8 animate-pulse-slow neon-glow"
            onClick={() => claimMutation.mutate()}
            disabled={claimMutation.isPending || pendingRewards <= 0}
          >
            {claimMutation.isPending ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Coins className="w-5 h-5 mr-2" />
            )}
            {claimMutation.isPending ? "CLAIMING..." : "CLAIM REWARDS"}
          </Button>
          
          {pendingRewards <= 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Complete tasks to earn rewards
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
