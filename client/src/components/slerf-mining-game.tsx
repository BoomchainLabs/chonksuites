import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pickaxe, Gem, Zap, Clock, TrendingUp, Award, Flame, Star, Sparkles, Target } from "lucide-react";
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
  const [isAutoMining, setIsAutoMining] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [clickEffects, setClickEffects] = useState<Array<{id: number, x: number, y: number, value: string}>>([]);
  const [miningProgress, setMiningProgress] = useState(0);
  const [powerBoosts, setPowerBoosts] = useState<Array<{id: number, name: string, multiplier: number, duration: number}>>([]);
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [crystalsFound, setCrystalsFound] = useState(0);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const clickCounterRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoMiningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Interactive click handler with animations
  const handleMiningClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSession || !currentSession.isActive) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate click power based on combo and boosts
    const baseReward = miningPower;
    const comboBonus = Math.floor(combo / 10) * 0.5;
    const boostMultiplier = powerBoosts.reduce((total, boost) => total + boost.multiplier, 1);
    const totalReward = baseReward * (1 + comboBonus) * boostMultiplier;
    
    // Update click counter
    setClicks(prev => prev + 1);
    clickCounterRef.current += 1;
    
    // Update combo system
    const now = Date.now();
    if (now - lastClickTimeRef.current < 1000) {
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(current => Math.max(current, newCombo));
        return newCombo;
      });
    } else {
      setCombo(1);
    }
    lastClickTimeRef.current = now;
    
    // Reset combo timeout
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
    }, 2000);
    
    // Add visual effect
    const effectId = Math.random();
    const isCritical = Math.random() < 0.1;
    const isRareFind = Math.random() < 0.05;
    
    let effectValue = `+${totalReward.toFixed(3)}`;
    
    if (isRareFind) {
      effectValue = `💎 +${(totalReward * 3).toFixed(3)}`;
      setCrystalsFound(prev => prev + 1);
    } else if (isCritical) {
      effectValue = `⚡ +${(totalReward * 2).toFixed(3)}`;
    }
    
    setClickEffects(prev => [...prev, { id: effectId, x, y, value: effectValue }]);
    
    // Remove effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 1000);
    
    // Update mining progress
    setMiningProgress(prev => Math.min(prev + (totalReward / 100), 100));
    
    // Update temperature (mining intensity)
    setTemperature(prev => Math.min(prev + 2, 100));
    
    // Calculate clicks per second
    setClicksPerSecond(clicks + 1);
    
  }, [currentSession, miningPower, combo, powerBoosts, clicks]);

  // Auto mining logic
  useEffect(() => {
    if (isAutoMining && currentSession?.isActive) {
      autoMiningIntervalRef.current = setInterval(() => {
        setClicks(prev => prev + 1);
        setMiningProgress(prev => Math.min(prev + 0.5, 100));
      }, 500);
    } else if (autoMiningIntervalRef.current) {
      clearInterval(autoMiningIntervalRef.current);
    }
    
    return () => {
      if (autoMiningIntervalRef.current) {
        clearInterval(autoMiningIntervalRef.current);
      }
    };
  }, [isAutoMining, currentSession]);

  // Temperature cooling system
  useEffect(() => {
    const coolingInterval = setInterval(() => {
      setTemperature(prev => Math.max(prev - 1, 0));
    }, 1000);
    
    return () => clearInterval(coolingInterval);
  }, []);

  // Power boost management
  useEffect(() => {
    const boostInterval = setInterval(() => {
      setPowerBoosts(prev => prev.map(boost => ({
        ...boost,
        duration: boost.duration - 1
      })).filter(boost => boost.duration > 0));
    }, 1000);
    
    return () => clearInterval(boostInterval);
  }, []);

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
      setMiningProgress(0);
      setCombo(0);
      setTemperature(0);
      toast({
        title: "SLERF Mining Started! ⛏️",
        description: "Click to mine $LERF tokens! Higher click rate = more rewards!",
      });
    },
  });

  // Complete mining mutation
  const completeMiningMutation = useMutation({
    mutationFn: async (clickCount: number) => {
      const response = await apiRequest('POST', '/api/slerf/mining/complete', {
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
      setMiningProgress(0);
      setCombo(0);
      setTemperature(0);
      queryClient.invalidateQueries({ queryKey: ['/api/slerf/mining/status', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

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
    <div className="space-y-6">
      <Card className="glass-card border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <Pickaxe className="h-5 w-5 text-green-400" />
            Interactive SLERF Mining
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {isAutoMining ? 'AUTO' : 'MANUAL'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Enhanced Mining Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="h-4 w-4 text-green-400" />
                  <span className="text-xs font-medium">Total Mined</span>
                </div>
                <div className="flex items-center gap-2">
                  <TokenLogo tokenSymbol="LERF" size="sm" />
                  <span className="text-lg font-bold">
                    {(miningStatus?.totalMined || 0) + (clicks * miningPower)} $LERF
                  </span>
                </div>
              </div>
              
              <div className="stat-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium">Combo</span>
                </div>
                <div className="text-lg font-bold text-yellow-400">
                  {combo}x {combo > 0 && <span className="text-xs">(Max: {maxCombo})</span>}
                </div>
              </div>
              
              <div className="stat-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium">CPS</span>
                </div>
                <div className="text-lg font-bold text-blue-400">
                  {clicksPerSecond}
                </div>
              </div>
              
              <div className="stat-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-medium">Crystals</span>
                </div>
                <div className="text-lg font-bold text-purple-400">
                  {crystalsFound} 💎
                </div>
              </div>
            </div>

            {/* Mining Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mining Progress</span>
                <span className="text-sm text-muted-foreground">{miningProgress.toFixed(1)}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={miningProgress} 
                  className="h-4 bg-gray-800/50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${miningProgress > 50 ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
                </div>
              </div>
            </div>

            {/* Temperature System */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium">Mining Temperature</span>
                </div>
                <span className="text-sm text-muted-foreground">{temperature}°C</span>
              </div>
              <Progress 
                value={temperature} 
                className={`h-2 ${temperature > 80 ? 'bg-red-900/50' : temperature > 50 ? 'bg-yellow-900/50' : 'bg-blue-900/50'}`}
              />
              {temperature > 90 && (
                <p className="text-xs text-red-400">⚠️ Overheating! Mining efficiency reduced</p>
              )}
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

                {/* Interactive Mining Area */}
                <div 
                  ref={gameAreaRef}
                  className="relative h-64 bg-gradient-to-br from-gray-900/80 to-green-900/20 rounded-xl border border-green-500/30 cursor-pointer overflow-hidden select-none"
                  onClick={handleMiningClick}
                  style={{ 
                    background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(34,197,94,${temperature/500}) 100%)`,
                    boxShadow: `inset 0 0 20px rgba(34,197,94,${combo/100})`,
                  }}
                >
                  {/* Click Effects */}
                  {clickEffects.map((effect) => (
                    <div
                      key={effect.id}
                      className={`absolute pointer-events-none font-bold text-lg z-10 ${effect.value.includes('💎') ? 'text-purple-400' : effect.value.includes('⚡') ? 'text-yellow-400' : 'text-green-400'}`}
                      style={{
                        left: effect.x,
                        top: effect.y,
                        animation: 'floatUp 1s ease-out forwards',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {effect.value}
                    </div>
                  ))}
                  
                  {/* Mining Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-24 h-24 rounded-full border-4 border-green-400/50 flex items-center justify-center mb-4 transition-all duration-200 ${clicks > 0 ? 'animate-pulse bg-green-400/20 shadow-lg shadow-green-400/30' : 'bg-gray-800/50'}`}>
                        <Pickaxe className={`h-12 w-12 text-green-400 transition-transform duration-100 ${clicks % 2 === 0 ? 'rotate-12' : '-rotate-12'}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-green-400 animate-pulse">
                          {clicks}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Click anywhere to mine!
                        </div>
                        
                        {combo > 5 && (
                          <div className="text-yellow-400 animate-bounce text-sm font-bold">
                            {combo}x COMBO!
                          </div>
                        )}
                        
                        {combo > 20 && (
                          <div className="text-purple-400 animate-pulse text-xs">
                            🔥 LEGENDARY COMBO! 🔥
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mining Session Timer */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/20 text-green-400 font-mono text-lg border border-green-500/50">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </Badge>
                  </div>
                  
                  {/* Power Boosts Display */}
                  {powerBoosts.length > 0 && (
                    <div className="absolute top-4 left-4 space-y-1">
                      {powerBoosts.map((boost) => (
                        <Badge key={boost.id} className="bg-purple-500/20 text-purple-400 text-xs border border-purple-500/50">
                          {boost.name} {boost.multiplier}x ({boost.duration}s)
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Click hint */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-xs text-green-400/80 animate-pulse">
                      💡 Tip: Faster clicks = higher combos = more rewards!
                    </div>
                  </div>
                  
                  {/* Estimated reward */}
                  <div className="absolute bottom-4 right-4">
                    <div className="text-sm font-semibold text-green-400">
                      ~{(clicks * miningPower * (1 + combo * 0.1)).toFixed(2)} $LERF
                    </div>
                  </div>
                </div>
                
                {/* Auto Mining Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setIsAutoMining(!isAutoMining)}
                    variant={isAutoMining ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {isAutoMining ? 'Disable Auto-Mining' : 'Enable Auto-Mining'}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setPowerBoosts(prev => [...prev, {
                        id: Math.random(),
                        name: "Speed Boost",
                        multiplier: 2,
                        duration: 10
                      }]);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Star className="h-4 w-4" />
                    Power Boost (10s)
                  </Button>
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
                Interactive Mining Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click faster to build combos and earn bonus rewards</li>
                <li>• Watch for rare gem discoveries (💎) worth 3x normal rewards</li>
                <li>• Enable auto-mining for passive earnings during sessions</li>
                <li>• Use power boosts to multiply your mining effectiveness</li>
                <li>• Monitor temperature to prevent overheating penalties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}