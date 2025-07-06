import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Heart, 
  Zap, 
  Coins, 
  Trophy, 
  Star, 
  Play,
  Gift,
  Target,
  Sparkles
} from 'lucide-react';
import TokenMascot from './token-mascots';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaygroundState {
  selectedMascot: '$SLERF' | '$CHONK9K' | null;
  mascotEnergy: { slerf: number; chonk: number };
  mascotHappiness: { slerf: number; chonk: number };
  gameScore: number;
  gameActive: boolean;
  achievements: string[];
  totalInteractions: number;
}

const SimplePlayground: React.FC = () => {
  const [playground, setPlayground] = useState<PlaygroundState>({
    selectedMascot: null,
    mascotEnergy: { slerf: 75, chonk: 82 },
    mascotHappiness: { slerf: 68, chonk: 91 },
    gameScore: 0,
    gameActive: false,
    achievements: ['First Interaction', 'Energy Boost', 'Happy Mascot'],
    totalInteractions: 456
  });

  const [activeTab, setActiveTab] = useState<'playground' | 'games' | 'achievements'>('playground');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [gameTimer, setGameTimer] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);

  const selectMascot = (mascot: '$SLERF' | '$CHONK9K') => {
    setPlayground(prev => ({ ...prev, selectedMascot: mascot }));
    createCelebrationParticles();
  };

  const createCelebrationParticles = () => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: playground.selectedMascot === '$SLERF' ? '#8B5CF6' : '#06B6D4'
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
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
      totalInteractions: prev.totalInteractions + 1
    }));

    createCelebrationParticles();
  };

  const startMiniGame = (gameType: string) => {
    setPlayground(prev => ({ ...prev, gameActive: true }));
    setGameTimer(15);
    setClickCount(0);

    const interval = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          endMiniGame(gameType);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endMiniGame = (gameType: string) => {
    const baseReward = 10;
    const finalReward = Math.floor(baseReward + (clickCount * 0.5));

    setPlayground(prev => ({
      ...prev,
      gameActive: false,
      gameScore: prev.gameScore + finalReward,
      totalInteractions: prev.totalInteractions + 1
    }));

    createCelebrationParticles();
  };

  const handleGameClick = () => {
    if (!playground.gameActive) return;
    setClickCount(prev => prev + 1);
  };

  const currentMascotStats = playground.selectedMascot
    ? {
        energy: playground.selectedMascot === '$SLERF' ? playground.mascotEnergy.slerf : playground.mascotEnergy.chonk,
        happiness: playground.selectedMascot === '$SLERF' ? playground.mascotHappiness.slerf : playground.mascotHappiness.chonk,
      }
    : null;

  const miniGames = [
    { id: 'energy-boost', name: 'Energy Boost', icon: <Zap className="w-5 h-5" />, difficulty: 'Easy' },
    { id: 'happiness-clicker', name: 'Happiness Clicker', icon: <Heart className="w-5 h-5" />, difficulty: 'Medium' },
    { id: 'token-collector', name: 'Token Collector', icon: <Coins className="w-5 h-5" />, difficulty: 'Hard' },
    { id: 'dance-battle', name: 'Dance Battle', icon: <Sparkles className="w-5 h-5" />, difficulty: 'Medium' }
  ];

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

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-slate-800 rounded-2xl p-2 gap-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 font-medium ${
                activeTab === 'playground' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Playground</span>
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 font-medium ${
                activeTab === 'games' 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>Mini Games</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 font-medium ${
                activeTab === 'achievements' 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Achievements</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'playground' && (
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
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${currentMascotStats?.energy}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Happiness</span>
                      <span className="text-sm text-white">{currentMascotStats?.happiness}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${currentMascotStats?.happiness}%` }}
                      />
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

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button
                        onClick={feedMascot}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Gift className="w-5 h-5 mr-3" />
                        Feed Mascot
                      </Button>
                      <Button
                        onClick={petMascot}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <Heart className="w-5 h-5 mr-3" />
                        Pet Mascot
                      </Button>
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

                  {playground.gameActive && (
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {miniGames.map((game) => (
              <Card key={game.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {game.icon}
                    <span>{game.name}</span>
                    <Badge variant="outline">{game.difficulty}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => startMiniGame(game.id)}
                    disabled={playground.gameActive || !playground.selectedMascot}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
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
        )}
      </div>
    </div>
  );
};

export default SimplePlayground;