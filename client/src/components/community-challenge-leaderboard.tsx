import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Medal, Star, Target, Clock, Users, Zap, TrendingUp, Gift } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  timeRemaining: string;
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

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  profileImageUrl: string;
  points: number;
  rank: number;
  rewardsClaimed: number;
  category: string;
  weeklyRank?: number;
  monthlyRank?: number;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
  legendary: 'bg-purple-500'
};

const challengeTypeIcons = {
  trading_volume: TrendingUp,
  referrals: Users,
  social_share: Star,
  login_streak: Zap,
  staking: Target
};

export default function CommunityChallenge() {
  const [selectedTab, setSelectedTab] = useState('active');
  const queryClient = useQueryClient();

  // Fetch active challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['/api/challenges/active'],
  });

  // Fetch user's challenge participations
  const { data: userParticipations = [], isLoading: participationsLoading } = useQuery({
    queryKey: ['/api/challenges/participations'],
  });

  // Fetch leaderboard data
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/leaderboard', selectedTab],
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
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
    },
  });

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const formatTokenAmount = (amount: number, type: 'SLERF' | 'CHONK9K') => {
    if (type === 'SLERF') {
      return `${amount.toLocaleString()} $SLERF`;
    } else {
      return `${amount.toLocaleString()} $CHONK9K`;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
  };

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
                  <Badge variant="outline" className="text-xs">
                    {challenge.rewardType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Pool</div>
              <div className="text-lg font-bold text-white">
                {formatTokenAmount(challenge.rewardPool, challenge.rewardType)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
          
          {participation && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white">
                  {participation.currentProgress} / {challenge.targetValue}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400">Participants</div>
              <div className="text-sm font-bold text-white">
                {challenge.participantCount} / {challenge.maxParticipants || '∞'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Time Left</div>
              <div className="text-sm font-bold text-white">
                {formatTimeRemaining(challenge.endDate)}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {!participation ? (
              <Button 
                onClick={() => joinChallengeMutation.mutate(challenge.id)}
                disabled={joinChallengeMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {joinChallengeMutation.isPending ? 'Joining...' : 'Join Challenge'}
              </Button>
            ) : participation.isCompleted && !participation.rewardEarned ? (
              <Button 
                onClick={() => claimRewardMutation.mutate(challenge.id)}
                disabled={claimRewardMutation.isPending}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Gift className="w-4 h-4 mr-2" />
                {claimRewardMutation.isPending ? 'Claiming...' : 'Claim Reward'}
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                {participation.isCompleted ? 'Completed' : 'In Progress'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Card key={entry.id} className={`
          ${index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30' : 'bg-slate-800/50 border-slate-700'}
          hover:border-slate-600 transition-all duration-200
        `}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {entry.profileImageUrl ? (
                      <img 
                        src={entry.profileImageUrl} 
                        alt={entry.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {entry.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{entry.username || 'Anonymous'}</div>
                    <div className="text-sm text-gray-400">
                      {entry.rewardsClaimed} rewards claimed
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{entry.points.toLocaleString()}</div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (challengesLoading || participationsLoading || leaderboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4">Loading challenges...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Community Challenge Leaderboard
          </h1>
          <p className="text-gray-400">
            Compete with the community and earn real $SLERF and $CHONK9K rewards
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="active" className="text-white">
              Active Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-white">
              My Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(challenges) && challenges.map((challenge: Challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Weekly Leaders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable entries={Array.isArray(leaderboard) ? leaderboard.filter((entry: LeaderboardEntry) => entry.category === 'weekly') : []} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Medal className="w-5 h-5 text-blue-500" />
                    <span>Monthly Leaders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable entries={Array.isArray(leaderboard) ? leaderboard.filter((entry: LeaderboardEntry) => entry.category === 'monthly') : []} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    <span>All-Time Leaders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeaderboardTable entries={Array.isArray(leaderboard) ? leaderboard.filter((entry: LeaderboardEntry) => entry.category === 'all_time') : []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(userParticipations) && userParticipations.map((participation: ChallengeParticipation) => {
                const challenge = Array.isArray(challenges) ? challenges.find((c: Challenge) => c.id === participation.challengeId) : null;
                if (!challenge) return null;
                
                return (
                  <Card key={participation.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">{challenge.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={participation.isCompleted ? 'bg-green-500' : 'bg-yellow-500'}>
                          {participation.isCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                        {participation.rank && (
                          <Badge variant="outline">
                            Rank #{participation.rank}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm text-white">
                              {participation.currentProgress} / {challenge.targetValue}
                            </span>
                          </div>
                          <Progress value={(participation.currentProgress / challenge.targetValue) * 100} className="h-2" />
                        </div>
                        
                        {participation.rewardEarned > 0 && (
                          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <div className="text-green-400 font-medium">
                              Reward Earned: {formatTokenAmount(participation.rewardEarned, challenge.rewardType)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}