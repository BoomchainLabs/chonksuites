import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  Coins,
  Star,
  Zap,
  Gift,
  Medal
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/animated-background';
import MobileNavigation from '@/components/mobile-navigation';

interface Challenge {
  id: string;
  title: string;
  description: string;
  challengeType: 'trading_volume' | 'referrals' | 'social_share' | 'login_streak' | 'staking';
  targetValue: number;
  rewardPool: number;
  rewardType: 'SLERF' | 'CHONK9K';
  startDate: string;
  endDate: string;
  maxParticipants: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  icon: string;
  isActive: boolean;
  participantCount: number;
}

interface ChallengeParticipation {
  id: string;
  challengeId: string;
  currentProgress: number;
  isCompleted: boolean;
  completedAt: string | null;
  rewardEarned: number;
  rank: number | null;
}

const challengeTypeIcons = {
  trading_volume: TrendingUp,
  referrals: Users,
  social_share: Star,
  login_streak: Zap,
  staking: Coins,
};

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-orange-500',
  legendary: 'bg-purple-500',
};

export default function SimpleChallenges() {
  const [selectedTab, setSelectedTab] = useState('active');

  // Fetch active challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['/api/challenges/active'],
  });

  // Fetch user participations
  const { data: userParticipations = [], isLoading: participationsLoading } = useQuery({
    queryKey: ['/api/challenges/participations'],
  });

  // Join challenge mutation
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest(`/api/challenges/${challengeId}/join`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/participations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/active'] });
    },
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest(`/api/challenges/${challengeId}/claim`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/participations'] });
    },
  });

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const participation = Array.isArray(userParticipations) ? userParticipations.find((p: any) => p.challengeId === challenge.id) : null;
    const Icon = challengeTypeIcons[challenge.challengeType];
    const progressPercentage = participation ? (participation.currentProgress / challenge.targetValue) * 100 : 0;

    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">{challenge.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`${difficultyColors[challenge.difficulty]} text-white text-xs`}>
                    {challenge.difficulty.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                    {challenge.rewardType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {challenge.rewardPool.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Reward Pool</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">{challenge.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">
                {participation ? participation.currentProgress.toLocaleString() : 0} / {challenge.targetValue.toLocaleString()}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Participants</div>
              <div className="text-white font-medium">{challenge.participantCount || 0}</div>
            </div>
            <div>
              <div className="text-gray-400">Max Participants</div>
              <div className="text-white font-medium">{challenge.maxParticipants || 'Unlimited'}</div>
            </div>
          </div>

          <div className="pt-2">
            {!participation ? (
              <Button
                onClick={() => joinChallengeMutation.mutate(challenge.id)}
                disabled={joinChallengeMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Target className="w-4 h-4 mr-2" />
                {joinChallengeMutation.isPending ? 'Joining...' : 'Join Challenge'}
              </Button>
            ) : participation.isCompleted ? (
              <Button
                onClick={() => claimRewardMutation.mutate(challenge.id)}
                disabled={claimRewardMutation.isPending}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Gift className="w-4 h-4 mr-2" />
                {claimRewardMutation.isPending ? 'Claiming...' : 'Claim Reward'}
              </Button>
            ) : (
              <Button disabled className="w-full bg-slate-600">
                <Clock className="w-4 h-4 mr-2" />
                In Progress
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (challengesLoading || participationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <AnimatedBackground />
      <MobileNavigation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              Community Challenges
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Complete challenges and earn $SLERF and $CHONK9K token rewards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{Array.isArray(challenges) ? challenges.length : 0}</div>
                <div className="text-gray-400">Active Challenges</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{Array.isArray(userParticipations) ? userParticipations.length : 0}</div>
                <div className="text-gray-400">Your Participations</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Array.isArray(userParticipations) ? userParticipations.filter((p: any) => p.isCompleted).length : 0}
                </div>
                <div className="text-gray-400">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Challenges Grid */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
                Active Challenges
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
                Your Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(challenges) && challenges.map((challenge: Challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
              {Array.isArray(challenges) && challenges.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Challenges</h3>
                    <p className="text-gray-400">Check back soon for new challenges!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(userParticipations) && userParticipations.map((participation: ChallengeParticipation) => {
                  const challenge = Array.isArray(challenges) ? challenges.find((c: Challenge) => c.id === participation.challengeId) : null;
                  if (!challenge) return null;
                  
                  return (
                    <Card key={participation.id} className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span>{challenge.title}</span>
                          {participation.isCompleted && (
                            <Badge className="bg-green-500 text-white">
                              <Trophy className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {participation.currentProgress} / {challenge.targetValue}
                            </span>
                          </div>
                          <Progress 
                            value={(participation.currentProgress / challenge.targetValue) * 100} 
                            className="h-2" 
                          />
                          {participation.isCompleted && (
                            <div className="text-center pt-2">
                              <div className="text-green-400 font-medium">
                                Reward: {participation.rewardEarned} {challenge.rewardType}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {Array.isArray(userParticipations) && userParticipations.length === 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Participations Yet</h3>
                    <p className="text-gray-400">Join some challenges to track your progress here!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}