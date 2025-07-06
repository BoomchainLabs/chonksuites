import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Star, Trophy, Heart, Coins } from 'lucide-react';

interface TokenMascotProps {
  tokenSymbol: '$SLERF' | '$CHONK9K';
  price: number;
  priceChange: number;
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEffects?: boolean;
}

interface MascotState {
  mood: 'happy' | 'excited' | 'neutral' | 'sad' | 'angry' | 'celebrating';
  action: 'idle' | 'dancing' | 'jumping' | 'sleeping' | 'working' | 'celebrating';
  energy: number;
}

const SlerfMascot: React.FC<{ 
  state: MascotState; 
  size: string; 
  onClick?: () => void;
  showEffects: boolean;
}> = ({ state, size, onClick, showEffects }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizeMap = {
    sm: { container: 'w-16 h-16', mascot: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-24 h-24', mascot: 'w-18 h-18', text: 'text-sm' },
    lg: { container: 'w-32 h-32', mascot: 'w-24 h-24', text: 'text-base' },
    xl: { container: 'w-48 h-48', mascot: 'w-36 h-36', text: 'text-lg' }
  };

  const currentSize = sizeMap[size as keyof typeof sizeMap];

  const createParticles = () => {
    if (!showEffects) return;
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const getMascotAnimation = () => {
    switch (state.action) {
      case 'dancing':
        return {
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1.1, 1],
          y: [0, -10, 0, -5, 0]
        };
      case 'jumping':
        return {
          y: [0, -30, 0, -15, 0],
          scale: [1, 1.2, 1, 1.1, 1]
        };
      case 'celebrating':
        return {
          rotate: [0, 360],
          scale: [1, 1.3, 1],
          y: [0, -20, 0]
        };
      case 'sleeping':
        return {
          scale: [1, 0.95, 1],
          opacity: [1, 0.8, 1]
        };
      default:
        return {
          y: [0, -5, 0],
          scale: [1, 1.05, 1]
        };
    }
  };

  const getMoodColor = () => {
    switch (state.mood) {
      case 'happy': return 'from-green-400 to-emerald-500';
      case 'excited': return 'from-yellow-400 to-orange-500';
      case 'celebrating': return 'from-purple-400 to-pink-500';
      case 'sad': return 'from-blue-400 to-indigo-500';
      case 'angry': return 'from-red-400 to-red-600';
      default: return 'from-purple-400 to-purple-600';
    }
  };

  return (
    <motion.div 
      className={`relative ${currentSize.container} cursor-pointer`}
      onClick={() => {
        onClick?.();
        createParticles();
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              y: -50,
              x: Math.random() * 40 - 20
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        ))}
      </AnimatePresence>

      {/* Mascot Body */}
      <motion.div
        className={`${currentSize.mascot} mx-auto bg-gradient-to-br ${getMoodColor()} rounded-full relative overflow-hidden border-4 border-white/20 shadow-2xl`}
        animate={getMascotAnimation()}
        transition={{ 
          duration: state.action === 'sleeping' ? 3 : 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Mascot Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            {/* Eyes */}
            <div className="flex justify-center space-x-2 mb-1">
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={state.action === 'sleeping' ? { scaleY: 0.1 } : { scaleY: 1 }}
              />
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={state.action === 'sleeping' ? { scaleY: 0.1 } : { scaleY: 1 }}
              />
            </div>
            
            {/* Mouth */}
            <motion.div 
              className={`w-4 h-2 border-2 border-white rounded-b-full ${
                state.mood === 'happy' || state.mood === 'excited' || state.mood === 'celebrating' 
                  ? 'border-t-0' : state.mood === 'sad' ? 'border-b-0 rounded-t-full' : ''
              }`}
              animate={state.action === 'dancing' ? { scale: [1, 1.2, 1] } : {}}
            />
            
            {/* Token Symbol */}
            <div className={`${currentSize.text} font-bold mt-1`}>$SLERF</div>
          </div>
        </div>

        {/* Special Effects Overlay */}
        {state.mood === 'celebrating' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-pink-400/30"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Mood Indicator */}
      <motion.div 
        className="absolute -top-2 -right-2 text-yellow-400"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {state.mood === 'celebrating' && <Trophy className="w-4 h-4" />}
        {state.mood === 'excited' && <Zap className="w-4 h-4" />}
        {state.mood === 'happy' && <Heart className="w-4 h-4" />}
        {state.energy > 80 && <Star className="w-4 h-4" />}
      </motion.div>

      {/* Energy Bar */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${state.energy}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </motion.div>
  );
};

const ChonkMascot: React.FC<{ 
  state: MascotState; 
  size: string; 
  onClick?: () => void;
  showEffects: boolean;
}> = ({ state, size, onClick, showEffects }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizeMap = {
    sm: { container: 'w-16 h-16', mascot: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-24 h-24', mascot: 'w-18 h-18', text: 'text-sm' },
    lg: { container: 'w-32 h-32', mascot: 'w-24 h-24', text: 'text-base' },
    xl: { container: 'w-48 h-48', mascot: 'w-36 h-36', text: 'text-lg' }
  };

  const currentSize = sizeMap[size as keyof typeof sizeMap];

  const createParticles = () => {
    if (!showEffects) return;
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const getMascotAnimation = () => {
    switch (state.action) {
      case 'dancing':
        return {
          rotate: [0, 15, -15, 15, 0],
          scale: [1, 1.15, 0.85, 1.15, 1],
          y: [0, -15, 0, -8, 0]
        };
      case 'jumping':
        return {
          y: [0, -40, 0, -20, 0],
          scale: [1, 1.25, 1, 1.15, 1],
          rotate: [0, 10, -10, 0]
        };
      case 'celebrating':
        return {
          rotate: [0, -360],
          scale: [1, 1.4, 1],
          y: [0, -25, 0]
        };
      case 'working':
        return {
          x: [0, 5, -5, 0],
          scale: [1, 1.02, 0.98, 1]
        };
      default:
        return {
          y: [0, -8, 0],
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0]
        };
    }
  };

  const getMoodColor = () => {
    switch (state.mood) {
      case 'happy': return 'from-cyan-400 to-blue-500';
      case 'excited': return 'from-green-400 to-cyan-500';
      case 'celebrating': return 'from-yellow-400 to-cyan-500';
      case 'sad': return 'from-gray-400 to-blue-600';
      case 'angry': return 'from-red-400 to-orange-600';
      default: return 'from-cyan-400 to-cyan-600';
    }
  };

  return (
    <motion.div 
      className={`relative ${currentSize.container} cursor-pointer`}
      onClick={() => {
        onClick?.();
        createParticles();
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1.5,
              y: -60,
              x: Math.random() * 50 - 25,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          />
        ))}
      </AnimatePresence>

      {/* Mascot Body */}
      <motion.div
        className={`${currentSize.mascot} mx-auto bg-gradient-to-br ${getMoodColor()} rounded-full relative overflow-hidden border-4 border-white/30 shadow-2xl`}
        animate={getMascotAnimation()}
        transition={{ 
          duration: state.action === 'celebrating' ? 1.5 : 2.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Mascot Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            {/* Eyes */}
            <div className="flex justify-center space-x-2 mb-1">
              <motion.div 
                className="w-2.5 h-2.5 bg-white rounded-full"
                animate={state.action === 'working' ? { scale: [1, 0.8, 1] } : { scale: 1 }}
              />
              <motion.div 
                className="w-2.5 h-2.5 bg-white rounded-full"
                animate={state.action === 'working' ? { scale: [1, 0.8, 1] } : { scale: 1 }}
              />
            </div>
            
            {/* Mouth */}
            <motion.div 
              className={`w-5 h-2.5 border-2 border-white rounded-b-full ${
                state.mood === 'happy' || state.mood === 'excited' || state.mood === 'celebrating' 
                  ? 'border-t-0' : state.mood === 'sad' ? 'border-b-0 rounded-t-full' : ''
              }`}
              animate={state.action === 'dancing' ? { scale: [1, 1.3, 1] } : {}}
            />
            
            {/* Token Symbol */}
            <div className={`${currentSize.text} font-bold mt-1`}>C9K</div>
          </div>
        </div>

        {/* Special Effects Overlay */}
        {(state.mood === 'celebrating' || state.energy > 90) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-400/40"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Chonk-specific decoration */}
        {state.action === 'working' && (
          <motion.div
            className="absolute top-2 right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Coins className="w-3 h-3 text-yellow-300" />
          </motion.div>
        )}
      </motion.div>

      {/* Mood Indicator */}
      <motion.div 
        className="absolute -top-2 -right-2 text-cyan-400"
        animate={{ scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        {state.mood === 'celebrating' && <Trophy className="w-4 h-4" />}
        {state.mood === 'excited' && <TrendingUp className="w-4 h-4" />}
        {state.mood === 'happy' && <Star className="w-4 h-4" />}
        {state.energy > 85 && <Zap className="w-4 h-4" />}
      </motion.div>

      {/* Energy Bar */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${state.energy}%` }}
          transition={{ duration: 1.2 }}
        />
      </div>
    </motion.div>
  );
};

const TokenMascot: React.FC<TokenMascotProps> = ({
  tokenSymbol,
  price,
  priceChange,
  isInteractive = true,
  size = 'md',
  showEffects = true
}) => {
  const [mascotState, setMascotState] = useState<MascotState>({
    mood: 'neutral',
    action: 'idle',
    energy: 50
  });
  const [clickCount, setClickCount] = useState(0);

  // Update mascot state based on price changes
  useEffect(() => {
    let newMood: MascotState['mood'] = 'neutral';
    let newAction: MascotState['action'] = 'idle';
    let newEnergy = 50;

    if (priceChange > 10) {
      newMood = 'celebrating';
      newAction = 'celebrating';
      newEnergy = 95;
    } else if (priceChange > 5) {
      newMood = 'excited';
      newAction = 'dancing';
      newEnergy = 80;
    } else if (priceChange > 0) {
      newMood = 'happy';
      newAction = 'jumping';
      newEnergy = 65;
    } else if (priceChange < -10) {
      newMood = 'angry';
      newAction = 'idle';
      newEnergy = 20;
    } else if (priceChange < -5) {
      newMood = 'sad';
      newAction = 'sleeping';
      newEnergy = 30;
    } else {
      newAction = 'working';
      newEnergy = 45;
    }

    // Add random variation for liveliness
    if (Math.random() > 0.7) {
      newAction = newAction === 'idle' ? 'working' : newAction;
      newEnergy += Math.random() * 20 - 10;
    }

    setMascotState({
      mood: newMood,
      action: newAction,
      energy: Math.max(10, Math.min(100, newEnergy))
    });
  }, [priceChange, price]);

  // Handle click interactions
  const handleMascotClick = () => {
    if (!isInteractive) return;

    setClickCount(prev => prev + 1);
    
    // Temporary mood boost on interaction
    setMascotState(prev => ({
      ...prev,
      mood: 'excited',
      action: 'dancing',
      energy: Math.min(100, prev.energy + 10)
    }));

    // Reset after animation
    setTimeout(() => {
      setMascotState(prev => ({
        ...prev,
        mood: priceChange > 0 ? 'happy' : 'neutral',
        action: 'idle'
      }));
    }, 3000);
  };

  if (tokenSymbol === '$SLERF') {
    return (
      <SlerfMascot 
        state={mascotState}
        size={size}
        onClick={handleMascotClick}
        showEffects={showEffects}
      />
    );
  }

  if (tokenSymbol === '$CHONK9K') {
    return (
      <ChonkMascot 
        state={mascotState}
        size={size}
        onClick={handleMascotClick}
        showEffects={showEffects}
      />
    );
  }

  return null;
};

export default TokenMascot;