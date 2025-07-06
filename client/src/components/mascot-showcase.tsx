import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Star, Volume2, VolumeX } from 'lucide-react';
import TokenMascot from './token-mascots';
import { motion } from 'framer-motion';

interface MascotShowcaseProps {
  slerfPrice: number;
  slerfChange: number;
  chonkPrice: number;
  chonkChange: number;
}

const MascotShowcase: React.FC<MascotShowcaseProps> = ({
  slerfPrice,
  slerfChange,
  chonkPrice,
  chonkChange
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMascot, setSelectedMascot] = useState<'$SLERF' | '$CHONK9K' | null>(null);

  const handleMascotInteraction = (tokenSymbol: '$SLERF' | '$CHONK9K') => {
    setSelectedMascot(tokenSymbol);
    
    // Play interaction sound (if audio is implemented)
    if (soundEnabled) {
      // Audio implementation would go here
      console.log(`Playing ${tokenSymbol} interaction sound`);
    }
    
    // Reset selection after 3 seconds
    setTimeout(() => setSelectedMascot(null), 3000);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Token Mascots</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
              Interactive
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SLERF Mascot Section */}
          <motion.div 
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedMascot === '$SLERF' 
                ? 'bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-500/25' 
                : 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400/50'
            }`}
            onClick={() => handleMascotInteraction('$SLERF')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <TokenMascot
                  tokenSymbol="$SLERF"
                  price={slerfPrice}
                  priceChange={slerfChange}
                  size="xl"
                  showEffects={true}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">$SLERF</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl font-bold text-white">
                    ${slerfPrice.toFixed(6)}
                  </span>
                  <div className={`flex items-center ${slerfChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {slerfChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="ml-1">{slerfChange >= 0 ? '+' : ''}{slerfChange.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <div className="text-purple-400">Network</div>
                    <div className="text-white font-medium">Base</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <div className="text-purple-400">Mood</div>
                    <div className="text-white font-medium">
                      {slerfChange > 10 ? '🎉 Celebrating' : 
                       slerfChange > 5 ? '😄 Excited' :
                       slerfChange > 0 ? '😊 Happy' :
                       slerfChange < -5 ? '😢 Sad' : '😐 Neutral'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CHONK9K Mascot Section */}
          <motion.div 
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedMascot === '$CHONK9K' 
                ? 'bg-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/25' 
                : 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-400/50'
            }`}
            onClick={() => handleMascotInteraction('$CHONK9K')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <TokenMascot
                  tokenSymbol="$CHONK9K"
                  price={chonkPrice}
                  priceChange={chonkChange}
                  size="xl"
                  showEffects={true}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">$CHONK9K</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl font-bold text-white">
                    ${chonkPrice.toFixed(6)}
                  </span>
                  <div className={`flex items-center ${chonkChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {chonkChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="ml-1">{chonkChange >= 0 ? '+' : ''}{chonkChange.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-cyan-500/10 rounded-lg p-2">
                    <div className="text-cyan-400">Network</div>
                    <div className="text-white font-medium">Solana</div>
                  </div>
                  <div className="bg-cyan-500/10 rounded-lg p-2">
                    <div className="text-cyan-400">Mood</div>
                    <div className="text-white font-medium">
                      {chonkChange > 10 ? '🚀 Pumping' : 
                       chonkChange > 5 ? '⚡ Energized' :
                       chonkChange > 0 ? '💪 Strong' :
                       chonkChange < -5 ? '😴 Resting' : '🔧 Working'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Interaction Tips */}
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center text-gray-300">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm">
              Click on the mascots to interact! They react to price changes and show different animations based on market performance.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MascotShowcase;