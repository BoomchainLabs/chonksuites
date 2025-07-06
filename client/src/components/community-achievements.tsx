import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Target, 
  Users, 
  TrendingUp,
  Gift,
  Flame,
  Diamond,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'social' | 'loyalty' | 'gaming' | 'governance';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
  maxProgress: number;
  completed: boolean;
  unlockedAt?: Date;
  reward: {
    type: 'tokens' | 'nft' | 'badge' | 'multiplier';
    value: number;
    description: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  achievements: number;
  totalPoints: number;
  avatar: string;
  tier: string;
  recentAchievement?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    category: 'trading',
    tier: 'bronze',
    progress: 1,
    maxProgress: 1,
    completed: true,
    unlockedAt: new Date('2025-01-01'),
    reward: { type: 'tokens', value: 100, description: '100 SLERF tokens' },
    rarity: 'common',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'whale-trader',
    title: 'Whale Trader',
    description: 'Trade over $10,000 in volume',
    category: 'trading',
    tier: 'gold',
    progress: 7500,
    maxProgress: 10000,
    completed: false,
    reward: { type: 'multiplier', value: 2, description: '2x rewards multiplier' },
    rarity: 'epic',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Refer 10 new members',
    category: 'social',
    tier: 'silver',
    progress: 6,
    maxProgress: 10,
    completed: false,
    reward: { type: 'nft', value: 1, description: 'Exclusive Community NFT' },
    rarity: 'rare',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'dao-pioneer',
    title: 'DAO Pioneer',
    description: 'Participate in 5 governance votes',
    category: 'governance',
    tier: 'gold',
    progress: 3,
    maxProgress: 5,
    completed: false,
    reward: { type: 'badge', value: 1, description: 'Governance Pioneer Badge' },
    rarity: 'epic',
    icon: <Crown className="w-5 h-5" />
  },
  {
    id: 'loyal-member',
    title: 'Loyal Member',
    description: 'Maintain 30-day login streak',
    category: 'loyalty',
    tier: 'platinum',
    progress: 23,
    maxProgress: 30,
    completed: false,
    reward: { type: 'tokens', value: 1000, description: '1000 SLERF + Special Title' },
    rarity: 'legendary',
    icon: <Flame className="w-5 h-5" />
  },
  {
    id: 'game-master',
    title: 'Game Master',
    description: 'Complete all mini-games',
    category: 'gaming',
    tier: 'diamond',
    progress: 3,
    maxProgress: 4,
    completed: false,
    reward: { type: 'nft', value: 1, description: 'Legendary Game Master NFT' },
    rarity: 'legendary',
    icon: <Sparkles className="w-5 h-5" />
  }
];

const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'CryptoWhale',
    achievements: 24,
    totalPoints: 15600,
    avatar: 'CW',
    tier: 'Diamond',
    recentAchievement: 'Whale Trader'
  },
  {
    rank: 2,
    username: 'TokenMaster',
    achievements: 21,
    totalPoints: 12800,
    avatar: 'TM',
    tier: 'Platinum',
    recentAchievement: 'DAO Pioneer'
  },
  {
    rank: 3,
    username: 'SlerfLegend',
    achievements: 19,
    totalPoints: 11200,
    avatar: 'SL',
    tier: 'Gold',
    recentAchievement: 'Community Builder'
  },
  {
    rank: 4,
    username: 'ChonkChamp',
    achievements: 17,
    totalPoints: 9800,
    avatar: 'CC',
    tier: 'Gold',
    recentAchievement: 'Loyal Member'
  },
  {
    rank: 5,
    username: 'DeFiNinja',
    achievements: 15,
    totalPoints: 8400,
    avatar: 'DN',
    tier: 'Silver',
    recentAchievement: 'Game Master'
  }
];

const communityStats = {
  totalAchievements: 48,
  totalMembers: 2847,
  topPerformers: 156,
  weeklyUnlocks: 324,
  rarityDistribution: {
    common: 45,
    rare: 30,
    epic: 20,
    legendary: 5
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'bronze': return 'text-amber-600';
    case 'silver': return 'text-gray-400';
    case 'gold': return 'text-yellow-400';
    case 'platinum': return 'text-purple-400';
    case 'diamond': return 'text-cyan-400';
    default: return 'text-gray-400';
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-gray-500 bg-gray-500/10';
    case 'rare': return 'border-blue-500 bg-blue-500/10';
    case 'epic': return 'border-purple-500 bg-purple-500/10';
    case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
    default: return 'border-gray-500 bg-gray-500/10';
  }
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${getRarityColor(achievement.rarity)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${achievement.completed ? 'from-green-500 to-emerald-600' : 'from-gray-600 to-gray-700'}`}>
                {achievement.icon}
              </div>
              <div>
                <CardTitle className="text-white text-lg">{achievement.title}</CardTitle>
                <CardDescription className="text-gray-400">{achievement.description}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge variant="outline" className={`${getTierColor(achievement.tier)} border-current`}>
                {achievement.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {achievement.rarity}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-white font-medium">
                {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
              </span>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Reward:</span>
                <span className="text-sm text-purple-300">{achievement.reward.description}</span>
              </div>
              
              {achievement.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1 text-green-400"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs">Completed</span>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
        
        {achievement.completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

const LeaderboardEntry: React.FC<{ entry: LeaderboardEntry; index: number }> = ({ entry, index }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-xl font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12">
          {getRankIcon(entry.rank)}
        </div>
        
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
            {entry.avatar}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{entry.username}</span>
            <Badge variant="outline" className={`${getTierColor(entry.tier.toLowerCase())} border-current text-xs`}>
              {entry.tier}
            </Badge>
          </div>
          <div className="text-sm text-gray-400">
            {entry.achievements} achievements • {entry.totalPoints.toLocaleString()} points
          </div>
          {entry.recentAchievement && (
            <div className="text-xs text-purple-400 mt-1">
              Latest: {entry.recentAchievement}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{entry.totalPoints.toLocaleString()}</div>
        <div className="text-xs text-gray-400">Total Points</div>
      </div>
    </motion.div>
  );
};

export default function CommunityAchievements() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalProgress = achievements.reduce((sum, a) => sum + (a.progress / a.maxProgress), 0);
  const overallProgress = (totalProgress / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-4"
          >
            Community Achievements
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Unlock rewards, climb the leaderboard, and showcase your Web3 journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {completedAchievements}/{achievements.length}
                </div>
                <div className="text-sm text-gray-400">Your Progress</div>
                <Progress value={overallProgress} className="mt-3 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {communityStats.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Community Members</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {communityStats.weeklyUnlocks}
                </div>
                <div className="text-sm text-gray-400">Weekly Unlocks</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {communityStats.totalAchievements}
                </div>
                <div className="text-sm text-gray-400">Total Achievements</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="achievements" className="text-white">My Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white">Leaderboard</TabsTrigger>
            <TabsTrigger value="community" className="text-white">Community Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['all', 'trading', 'social', 'loyalty', 'gaming', 'governance'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntry key={entry.rank} entry={entry} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Diamond className="w-5 h-5 mr-2 text-cyan-400" />
                    Rarity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(communityStats.rarityDistribution).map(([rarity, percentage]) => (
                      <div key={rarity} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getRarityColor(rarity).split(' ')[0].replace('border-', 'bg-')}`} />
                          <span className="capitalize text-gray-300">{rarity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getRarityColor(rarity).split(' ')[0].replace('border-', 'bg-')}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-8">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-yellow-400">
                      {communityStats.topPerformers}
                    </div>
                    <p className="text-gray-400">
                      Members with 10+ achievements
                    </p>
                    <div className="flex justify-center space-x-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">85%</div>
                        <div className="text-xs text-gray-400">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">12.5</div>
                        <div className="text-xs text-gray-400">Avg. Achievements</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}