import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface LoyaltyScoreProps {
  userId: number;
}

export default function LoyaltyScore({ userId }: LoyaltyScoreProps) {
  const { data: loyaltyData } = useQuery({
    queryKey: ['/api/loyalty-score', userId],
    enabled: !!userId,
  });

  const loyaltyScore = loyaltyData?.loyaltyScore || 0;
  const factors = loyaltyData?.factors || {
    loginStreak: 0,
    walletAge: 0,
    referralCount: 0,
    tasksCompleted: 0
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good Standing";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-purple-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="glass-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-lg font-orbitron font-bold">Loyalty Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent transition-all duration-1000"
              style={{
                transform: `rotate(${(loyaltyScore / 100) * 360}deg)`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(loyaltyScore)}`}>
                {loyaltyScore}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400">{getScoreLabel(loyaltyScore)}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Login Streak</span>
            <span className="text-sm font-medium">{factors.loginStreak} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Wallet Age</span>
            <span className="text-sm font-medium">{factors.walletAge} years</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Referrals</span>
            <span className="text-sm font-medium">{factors.referralCount} users</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Tasks Completed</span>
            <span className="text-sm font-medium">{factors.tasksCompleted}/100</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={loyaltyScore} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
