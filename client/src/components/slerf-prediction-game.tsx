import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Timer, Coins, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TokenLogo from "@/components/token-logo";

interface PredictionRound {
  id: string;
  startPrice: number;
  currentPrice: number;
  endTime: Date;
  isActive: boolean;
  minBet: number;
  maxBet: number;
}

interface SlerfPredictionGameProps {
  userId: number;
}

export default function SlerfPredictionGame({ userId }: SlerfPredictionGameProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<'up' | 'down' | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current prediction round
  const { data: currentRound } = useQuery({
    queryKey: ['/api/slerf/prediction/current'],
    refetchInterval: 1000,
  });

  // Get user's prediction status
  const { data: userPrediction } = useQuery({
    queryKey: ['/api/slerf/prediction/user', userId],
    enabled: !!userId,
  });

  // Submit prediction mutation
  const submitPredictionMutation = useMutation({
    mutationFn: async (predictionData: { direction: 'up' | 'down'; amount: number }) => {
      const response = await apiRequest('POST', '/api/slerf/prediction/submit', {
        userId,
        roundId: currentRound?.id,
        ...predictionData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Prediction Submitted! 🎯",
        description: `You predicted ${selectedPrediction?.toUpperCase()} with ${betAmount} $LERF`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/slerf/prediction/user', userId] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (currentRound && currentRound.isActive) {
      const endTime = new Date(currentRound.endTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [currentRound]);

  const handleSubmitPrediction = () => {
    if (selectedPrediction && betAmount >= 5 && betAmount <= 100) {
      submitPredictionMutation.mutate({
        direction: selectedPrediction,
        amount: betAmount,
      });
    }
  };

  const priceChange = currentRound ? 
    ((currentRound.currentPrice - currentRound.startPrice) / currentRound.startPrice * 100) : 0;

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (!currentRound) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading SLERF price prediction game...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-400" />
          SLERF Price Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Price Display */}
          <div className="stat-card p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TokenLogo tokenSymbol="LERF" size="sm" />
              <span className="text-sm font-medium text-muted-foreground">SLERF Token</span>
            </div>
            <div className="text-3xl font-bold font-mono mb-2">
              ${currentRound.currentPrice.toFixed(6)}
            </div>
            <div className={`text-lg font-semibold ${getPriceChangeColor(priceChange)}`}>
              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
              {priceChange > 0 ? (
                <TrendingUp className="inline h-4 w-4 ml-1" />
              ) : priceChange < 0 ? (
                <TrendingDown className="inline h-4 w-4 ml-1" />
              ) : null}
            </div>
          </div>

          {/* Round Timer */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Round Ends In</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 font-mono">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
            <Progress 
              value={(300 - timeRemaining) / 300 * 100} 
              className="h-2"
            />
          </div>

          {/* Prediction Interface */}
          {!userPrediction?.hasPredicted && timeRemaining > 30 ? (
            <div className="space-y-4">
              {/* Prediction Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setSelectedPrediction('up')}
                  variant={selectedPrediction === 'up' ? 'default' : 'outline'}
                  className={`h-20 flex flex-col gap-2 ${
                    selectedPrediction === 'up' 
                      ? 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30' 
                      : 'hover:bg-green-500/10 hover:border-green-500/30'
                  }`}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span className="font-semibold">BULL</span>
                  <span className="text-xs">Price goes UP</span>
                </Button>
                
                <Button
                  onClick={() => setSelectedPrediction('down')}
                  variant={selectedPrediction === 'down' ? 'default' : 'outline'}
                  className={`h-20 flex flex-col gap-2 ${
                    selectedPrediction === 'down' 
                      ? 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30' 
                      : 'hover:bg-red-500/10 hover:border-red-500/30'
                  }`}
                >
                  <TrendingDown className="h-6 w-6" />
                  <span className="font-semibold">BEAR</span>
                  <span className="text-xs">Price goes DOWN</span>
                </Button>
              </div>

              {/* Bet Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Bet Amount</label>
                  <div className="flex items-center gap-2">
                    <TokenLogo tokenSymbol="LERF" size="sm" />
                    <span className="text-sm text-muted-foreground">$LERF</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(Math.max(5, betAmount - 5))}
                    disabled={betAmount <= 5}
                  >
                    -5
                  </Button>
                  <div className="flex-1 text-center p-2 bg-white/5 rounded border border-white/10">
                    <span className="text-lg font-bold">{betAmount}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(Math.min(100, betAmount + 5))}
                    disabled={betAmount >= 100}
                  >
                    +5
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setBetAmount(amount)}
                      className={betAmount === amount ? 'bg-blue-500/20 border-blue-500/50' : ''}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Prediction */}
              <Button
                onClick={handleSubmitPrediction}
                disabled={!selectedPrediction || submitPredictionMutation.isPending}
                className="w-full btn-primary"
              >
                {submitPredictionMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Predict {selectedPrediction?.toUpperCase()} for {betAmount} $LERF
                  </div>
                )}
              </Button>
            </div>
          ) : userPrediction?.hasPredicted ? (
            <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/30">
              <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prediction Submitted!</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  You predicted the price will go{" "}
                  <span className={`font-bold ${
                    userPrediction.direction === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {userPrediction.direction?.toUpperCase()}
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <TokenLogo tokenSymbol="LERF" size="sm" />
                  <span className="font-semibold">Bet: {userPrediction.amount} $LERF</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Potential win: {userPrediction.amount * 1.8} $LERF
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Timer className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Prediction window closing soon! Wait for the next round.
              </p>
            </div>
          )}

          {/* Game Rules */}
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Coins className="h-4 w-4 text-purple-400" />
              How to Play
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Predict if SLERF price will go UP or DOWN</li>
              <li>• Bet between 5-100 $LERF tokens</li>
              <li>• Win 1.8x your bet if correct</li>
              <li>• New rounds every 5 minutes</li>
              <li>• Predictions close 30 seconds before round ends</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}