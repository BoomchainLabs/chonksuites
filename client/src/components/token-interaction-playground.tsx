import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, 
  Heart, 
  Zap, 
  Coins, 
  Trophy, 
  Star, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sparkles,
  Target,
  Timer,
  Gift
} from 'lucide-react';
import TokenMascot from './token-mascots';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaygroundState {
  selectedMascot: '$SLERF' | '$CHONK9K' | null;
  mascotEnergy: { slerf: number; chonk: number };
  mascotHappiness: { slerf: number; chonk: number };
  mascotLevel: { slerf: number; chonk: number };
  gameScore: number;
  gameActive: boolean;
  soundEnabled: boolean;
  achievements: string[];
  dailyInteractions: number;
  totalInteractions: number;
}

interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  duration: number;
}

const TokenInteractionPlayground: React.FC = () => {
  const [playground, setPlayground] = useState<PlaygroundState>({
    selectedMascot: null,
    mascotEnergy: { slerf: 75, chonk: 82 },
    mascotHappiness: { slerf: 68, chonk: 91 },
    mascotLevel: { slerf: 3, chonk: 5 },
    gameScore: 0,
    gameActive: false,
    soundEnabled: true,
    achievements: ['First Interaction', 'Energy Boost', 'Happy Mascot'],
    dailyInteractions: 23,
    totalInteractions: 456
  });

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameTimer, setGameTimer] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const miniGames: MiniGame[] = [
    {
      id: 'energy-boost',
      name: 'Energy Boost',
      description: 'Click rapidly to boost your mascot\'s energy!',
      icon: <Zap className="w-5 h-5" />,
      difficulty: 'easy',
      reward: 10,
      duration: 10
    },
    {
      id: 'happiness-clicker',
      name: 'Happiness Clicker',
      description: 'Make your mascot happy with perfect timing!',
      icon: <Heart className="w-5 h-5" />,
      difficulty: 'medium',
      reward: 15,
      duration: 15
    },
    {
      id: 'token-collector',
      name: 'Token Collector',
      description: 'Collect floating tokens for rewards!',
      icon: <Coins className="w-5 h-5" />,
      difficulty: 'hard',
      reward: 25,
      duration: 20
    },
    {
      id: 'dance-battle',
      name: 'Dance Battle',
      description: 'Match the rhythm to make your mascot dance!',
      icon: <Sparkles className="w-5 h-5" />,
      difficulty: 'medium',
      reward: 20,
      duration: 12
    }
  ];

  const selectMascot = (mascot: '$SLERF' | '$CHONK9K') => {
    setPlayground(prev => ({ ...prev, selectedMascot: mascot }));
    createCelebrationParticles();
  };

  const createCelebrationParticles = () => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: playground.selectedMascot === '$SLERF' ? '#8B5CF6' : '#06B6D4'
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const startMiniGame = (gameId: string) => {
    const game = miniGames.find(g => g.id === gameId);
    if (!game) return;

    setActiveGame(gameId);
    setGameTimer(game.duration);
    setClickCount(0);
    setPlayground(prev => ({ ...prev, gameActive: true }));

    gameIntervalRef.current = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          endMiniGame(gameId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endMiniGame = (gameId: string) => {
    const game = miniGames.find(g => g.id === gameId);
    if (!game) return;

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }

    const scoreMultiplier = clickCount > 30 ? 2 : clickCount > 15 ? 1.5 : 1;
    const finalScore = Math.floor(game.reward * scoreMultiplier);

    setPlayground(prev => ({
      ...prev,
      gameActive: false,
      gameScore: prev.gameScore + finalScore,
      mascotEnergy: playground.selectedMascot === '$SLERF' 
        ? { ...prev.mascotEnergy, slerf: Math.min(100, prev.mascotEnergy.slerf + finalScore) }
        : { ...prev.mascotEnergy, chonk: Math.min(100, prev.mascotEnergy.chonk + finalScore) },
      mascotHappiness: playground.selectedMascot === '$SLERF'
        ? { ...prev.mascotHappiness, slerf: Math.min(100, prev.mascotHappiness.slerf + finalScore / 2) }
        : { ...prev.mascotHappiness, chonk: Math.min(100, prev.mascotHappiness.chonk + finalScore / 2) },
      totalInteractions: prev.totalInteractions + 1
    }));

    setActiveGame(null);
    createCelebrationParticles();
  };

  const handleGameClick = () => {
    if (!playground.gameActive) return;
    setClickCount(prev => prev + 1);
    
    // Create click particles
    const clickParticles = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
      color: '#FFD700'
    }));
    setParticles(prev => [...prev, ...clickParticles]);
  };

  const feedMascot = () => {
    if (!playground.selectedMascot) return;

    setPlayground(prev => ({
      ...prev,
      mascotEnergy: playground.selectedMascot === '$SLERF'
        ? { ...prev.mascotEnergy, slerf: Math.min(100, prev.mascotEnergy.slerf + 15) }
        : { ...prev.mascotEnergy, chonk: Math.min(100, prev.mascotEnergy.chonk + 15) },
      mascotHappiness: playground.selectedMascot === '$SLERF'
        ? { ...prev.mascotHappiness, slerf: Math.min(100, prev.mascotHappiness.slerf + 10) }
        : { ...prev.mascotHappiness, chonk: Math.min(100, prev.mascotHappiness.chonk + 10) },
      dailyInteractions: prev.dailyInteractions + 1,
      totalInteractions: prev.totalInteractions + 1
    }));

    createCelebrationParticles();
  };

  const petMascot = () => {
    if (!playground.selectedMascot) return;

    setPlayground(prev => ({
      ...prev,
      mascotHappiness: playground.selectedMascot === '$SLERF'
        ? { ...prev.mascotHappiness, slerf: Math.min(100, prev.mascotHappiness.slerf + 20) }
        : { ...prev.mascotHappiness, chonk: Math.min(100, prev.mascotHappiness.chonk + 20) },
      dailyInteractions: prev.dailyInteractions + 1,
      totalInteractions: prev.totalInteractions + 1
    }));

    createCelebrationParticles();
  };

  const currentMascotStats = playground.selectedMascot
    ? {
        energy: playground.selectedMascot === '$SLERF' ? playground.mascotEnergy.slerf : playground.mascotEnergy.chonk,
        happiness: playground.selectedMascot === '$SLERF' ? playground.mascotHappiness.slerf : playground.mascotHappiness.chonk,
        level: playground.selectedMascot === '$SLERF' ? playground.mascotLevel.slerf : playground.mascotLevel.chonk
      }
    : null;

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Token Interaction Playground
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Play mini-games, feed your mascots, and level them up through interactive experiences
          </p>
        </div>

        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  backgroundColor: particle.color
                }}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5,
                  y: -100,
                  x: Math.random() * 100 - 50
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              />
            ))}
          </AnimatePresence>
        </div>

        <Tabs defaultValue="playground" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="playground" className="data-[state=active]:bg-purple-600">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Playground
            </TabsTrigger>
            <TabsTrigger value="minigames" className="data-[state=active]:bg-cyan-600">
              <Target className="w-4 h-4 mr-2" />
              Mini Games
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-pink-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mascot Selection */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Select Your Mascot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <motion.button
                      onClick={() => selectMascot('$SLERF')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        playground.selectedMascot === '$SLERF'
                          ? 'bg-purple-500/20 border-purple-400'
                          : 'bg-slate-700/50 border-slate-600 hover:border-purple-400/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TokenMascot
                        tokenSymbol="$SLERF"
                        price={0.0234}
                        priceChange={15.67}
                        size="md"
                        showEffects={true}
                      />
                      <div className="mt-2 text-sm text-purple-400">$SLERF</div>
                    </motion.button>

                    <motion.button
                      onClick={() => selectMascot('$CHONK9K')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        playground.selectedMascot === '$CHONK9K'
                          ? 'bg-cyan-500/20 border-cyan-400'
                          : 'bg-slate-700/50 border-slate-600 hover:border-cyan-400/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TokenMascot
                        tokenSymbol="$CHONK9K"
                        price={0.00156}
                        priceChange={-3.45}
                        size="md"
                        showEffects={true}
                      />
                      <div className="mt-2 text-sm text-cyan-400">$CHONK9K</div>
                    </motion.button>
                  </div>

                  {playground.selectedMascot && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Energy</span>
                        <span className="text-sm text-white">{currentMascotStats?.energy}%</span>
                      </div>
                      <Progress value={currentMascotStats?.energy} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Happiness</span>
                        <span className="text-sm text-white">{currentMascotStats?.happiness}%</span>
                      </div>
                      <Progress value={currentMascotStats?.happiness} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Level</span>
                        <span className="text-sm text-white">{currentMascotStats?.level}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interactive Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span>Interact with Your Mascot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {playground.selectedMascot ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="relative inline-block" onClick={handleGameClick}>
                          <TokenMascot
                            tokenSymbol={playground.selectedMascot}
                            price={playground.selectedMascot === '$SLERF' ? 0.0234 : 0.00156}
                            priceChange={playground.selectedMascot === '$SLERF' ? 15.67 : -3.45}
                            size="xl"
                            showEffects={true}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={feedMascot}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Feed
                        </Button>
                        <Button
                          onClick={petMascot}
                          className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Pet
                        </Button>
                      </div>

                      <div className="text-center text-sm text-gray-400">
                        Daily Interactions: {playground.dailyInteractions}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      Select a mascot to start interacting!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Game Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span>Game Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Score</span>
                      <span className="text-lg font-bold text-yellow-400">{playground.gameScore}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Interactions</span>
                      <span className="text-lg font-bold text-white">{playground.totalInteractions}</span>
                    </div>

                    {activeGame && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-400">Game Active</span>
                          <span className="text-sm text-white">{gameTimer}s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Clicks</span>
                          <span className="text-sm text-white">{clickCount}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Sound</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPlayground(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                      >
                        {playground.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="minigames" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {miniGames.map((game) => (
                <Card key={game.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {game.icon}
                      <span>{game.name}</span>
                      <Badge variant={game.difficulty === 'easy' ? 'default' : game.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {game.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{game.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-400">Duration: {game.duration}s</span>
                      <span className="text-sm text-yellow-400">Reward: {game.reward} points</span>
                    </div>
                    <Button
                      onClick={() => startMiniGame(game.id)}
                      disabled={playground.gameActive || !playground.selectedMascot}
                      className="w-full"
                    >
                      {playground.gameActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Game in Progress
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Game
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playground.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm text-white">{achievement}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TokenInteractionPlayground;