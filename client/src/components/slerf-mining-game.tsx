import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pickaxe, Gem, Zap, Clock, TrendingUp, Award } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TokenLogo from "@/components/token-logo";

interface MiningSession {
  id: string;
  startTime: Date;
  duration: number;
  reward: number;
  isActive: boolean;
}

interface SlerfMiningGameProps {
  userId: number;
}

export default function SlerfMiningGame({ userId }: SlerfMiningGameProps) {
  const [clicks, setClicks] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [currentSession, setCurrentSession] = useState<MiningSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get mining status
  const { data: miningStatus } = useQuery({
    queryKey: ['/api/slerf/mining/status', userId],
    enabled: !!userId,
    refetchInterval: 1000,
  });

  // Start mining mutation
  const startMiningMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/slerf/mining/start', { userId });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.session);
      setClicks(0);
      toast({
        title: "SLERF Mining Started! ⛏️",
        description: "Click to mine $LERF tokens! Higher click rate = more rewards!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/slerf/mining/status', userId] });
    },
  });

  // Submit mining result
  const completeMiningMutation = useMutation({
    mutationFn: async (clickCount: number) => {
      const response = await apiRequest('POST', '/api/slerf/mining/complete', {
        userId,
        sessionId: currentSession?.id,
        clickCount,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mining Complete! 💎",
        description: `You mined ${data.reward} $LERF tokens!`,
      });
      setCurrentSession(null);
      setClicks(0);
      queryClient.invalidateQueries({ queryKey: ['/api/slerf/mining/status', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

  // Mining click handler
  const handleMiningClick = () => {
    if (currentSession && timeRemaining > 0) {
      setClicks(prev => prev + miningPower);
      
      // Visual feedback
      const btn = document.getElementById('mining-button');
      if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 100);
      }
    }
  };

  // Timer effect for active session
  useEffect(() => {
    if (currentSession && currentSession.isActive) {
      const endTime = new Date(currentSession.startTime).getTime() + (currentSession.duration * 1000);
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          completeMiningMutation.mutate(clicks);
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentSession, clicks]);

  // Set current session from status
  useEffect(() => {
    if (miningStatus?.activeSession) {
      setCurrentSession(miningStatus.activeSession);
    }
  }, [miningStatus]);

  const canStartMining = !currentSession && !miningStatus?.onCooldown;
  const cooldownRemaining = miningStatus?.cooldownRemaining || 0;

  return (
    <Card className="glass-card border-green-500/30">
      <CardHeader>
        <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
          <Pickaxe className="h-5 w-5 text-green-400" />
          SLERF Token Mining
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mining Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gem className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">Total Mined</span>
              </div>
              <div className="flex items-center gap-2">
                <TokenLogo tokenSymbol="LERF" size="sm" />
                <span className="text-lg font-bold">
                  {miningStatus?.totalMined || 0} $LERF
                </span>
              </div>
            </div>
            
            <div className="stat-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Mining Power</span>
              </div>
              <div className="text-lg font-bold text-blue-400">
                {miningPower}x
              </div>
            </div>
          </div>

          {/* Active Mining Session */}
          {currentSession && timeRemaining > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">Mining Session Active</span>
                  <Badge className="bg-green-500/20 text-green-400 font-mono">
                    {timeRemaining}s
                  </Badge>
                </div>
                <Progress 
                  value={(30 - timeRemaining) / 30 * 100} 
                  className="h-2 bg-green-500/20"
                />
              </div>

              {/* Mining Button */}
              <div className="text-center">
                <Button
                  id="mining-button"
                  onClick={handleMiningClick}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-2xl transform transition-all duration-100 hover:scale-105"
                  style={{
                    boxShadow: '0 0 30px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Pickaxe className="h-8 w-8 mb-1" />
                    <span>MINE</span>
                  </div>
                </Button>
                
                <div className="mt-4 space-y-2">
                  <div className="text-2xl font-bold gradient-text">
                    {clicks} clicks
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estimated reward: {Math.floor(clicks * 0.1)} $LERF
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Start Mining */}
          {canStartMining && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <Gem className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Mine SLERF!</h3>
                <p className="text-muted-foreground mb-4">
                  Start a 30-second mining session to earn $LERF tokens based on your clicking speed!
                </p>
                <Button
                  onClick={() => startMiningMutation.mutate()}
                  disabled={startMiningMutation.isPending}
                  className="btn-primary"
                >
                  {startMiningMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Starting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Pickaxe className="h-4 w-4" />
                      Start Mining
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Cooldown */}
          {cooldownRemaining > 0 && (
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Mining Equipment Cooling Down</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your mining rig needs to cool down before the next session
              </p>
              <Badge className="bg-yellow-500/20 text-yellow-400 font-mono">
                {Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s
              </Badge>
            </div>
          )}

          {/* Mining Tips */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              Mining Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click faster to mine more $LERF tokens</li>
              <li>• Complete daily tasks to increase mining power</li>
              <li>• Refer friends to unlock mining bonuses</li>
              <li>• Mining sessions last 30 seconds with 5-minute cooldowns</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}