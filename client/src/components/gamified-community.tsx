import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import MobileNavigation from '@/components/mobile-navigation';
import { 
  Trophy, 
  Zap, 
  Target, 
  Users, 
  Clock, 
  Award,
  Star,
  Gift,
  Brain,
  Coins,
  Medal,
  Crown,
  Flame,
  CheckCircle,
  XCircle,
  Timer,
  TrendingUp,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'slerf' | 'chonk9k' | 'defi' | 'blockchain';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  tokenReward: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'staking' | 'community' | 'trivia';
  progress: number;
  maxProgress: number;
  reward: number;
  tokenReward: string;
  isCompleted: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CommunityMember {
  id: string;
  username: string;
  level: number;
  xp: number;
  slerfBalance: number;
  chonk9kBalance: number;
  totalEarnings: number;
  achievements: number;
  rank: number;
}

export default function GamifiedCommunity() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [triviaStreak, setTriviaStreak] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trivia questions
  const { data: triviaQuestions, isLoading: triviaLoading } = useQuery({
    queryKey: ['/api/trivia/questions'],
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/community/leaderboard'],
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/community/profile'],
  });

  // Submit trivia answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: number }) => {
      const response = await apiRequest('POST', '/api/trivia/submit', {
        questionId,
        answer
      });
      return response.json();
    },
    onSuccess: (data) => {
      setShowResult(true);
      if (data.correct) {
        setTriviaStreak(prev => prev + 1);
        toast({
          title: "Correct! 🎉",
          description: `You earned ${data.reward} ${data.tokenReward} tokens!`,
        });
      } else {
        setTriviaStreak(0);
        toast({
          title: "Incorrect 😅",
          description: `The correct answer was: ${data.correctAnswer}`,
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/community/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    }
  });

  // Claim achievement mutation
  const claimAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await apiRequest('POST', '/api/achievements/claim', {
        achievementId
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `You earned ${data.reward} ${data.tokenReward} tokens!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/community/profile'] });
    }
  });

  // Timer effect for trivia
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentQuestion && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentQuestion && !showResult) {
      // Auto-submit when time runs out
      submitAnswerMutation.mutate({
        questionId: currentQuestion.id,
        answer: -1 // Invalid answer for timeout
      });
    }
    return () => clearInterval(timer);
  }, [currentQuestion, timeLeft, showResult]);

  const startTrivia = (category: string = 'all') => {
    const filteredQuestions = category === 'all' 
      ? triviaQuestions 
      : triviaQuestions?.filter((q: TriviaQuestion) => q.category === category);
    
    if (filteredQuestions?.length > 0) {
      const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    }
  };

  const submitAnswer = () => {
    if (currentQuestion && selectedAnswer !== null) {
      submitAnswerMutation.mutate({
        questionId: currentQuestion.id,
        answer: selectedAnswer
      });
    }
  };

  const nextQuestion = () => {
    startTrivia(selectedCategory);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'legendary': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (triviaLoading || achievementsLoading || leaderboardLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading community features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Gamified Community Hub
          </h1>
          <p className="text-gray-300 text-lg">
            Earn $SLERF and $CHONK9K tokens through trivia, achievements, and community activities
          </p>
          
          {userProfile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg p-4 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">Lv.{userProfile.level}</div>
                  <div className="text-gray-400">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{userProfile.xp}</div>
                  <div className="text-gray-400">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">#{userProfile.rank}</div>
                  <div className="text-gray-400">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{triviaStreak}</div>
                  <div className="text-gray-400">Streak</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <Tabs defaultValue="trivia" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="trivia" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              Trivia
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              <Crown className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trivia" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Token Trivia Challenge</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!currentQuestion ? (
                    <div className="text-center py-8">
                      <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                      <h3 className="text-xl font-semibold mb-4">Ready for a Challenge?</h3>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {[
                          { id: 'all', label: 'Mixed', icon: '🎯' },
                          { id: 'slerf', label: '$SLERF', icon: '🏄' },
                          { id: 'chonk9k', label: '$CHONK9K', icon: '🐱' },
                          { id: 'defi', label: 'DeFi', icon: '💰' }
                        ].map((cat) => (
                          <Button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              startTrivia(cat.id);
                            }}
                            className="h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                          >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                          </Button>
                        ))}
                      </div>
                      
                      <p className="text-gray-400 text-sm">
                        Answer correctly to earn $SLERF and $CHONK9K tokens!
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                            {currentQuestion.difficulty.toUpperCase()}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-orange-400" />
                            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gray-300'}`}>
                              {timeLeft}s
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                          
                          <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                              <Button
                                key={index}
                                variant={selectedAnswer === index ? "default" : "outline"}
                                className={`w-full text-left justify-start h-auto p-3 ${
                                  showResult
                                    ? index === currentQuestion.correctAnswer
                                      ? 'bg-green-600 border-green-500'
                                      : selectedAnswer === index && index !== currentQuestion.correctAnswer
                                      ? 'bg-red-600 border-red-500'
                                      : 'opacity-50'
                                    : selectedAnswer === index
                                    ? 'bg-purple-600 border-purple-500'
                                    : ''
                                }`}
                                onClick={() => !showResult && setSelectedAnswer(index)}
                                disabled={showResult}
                              >
                                <span className="mr-3 font-bold">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                                {showResult && index === currentQuestion.correctAnswer && (
                                  <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                                )}
                                {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                                  <XCircle className="w-4 h-4 ml-auto text-red-400" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          {!showResult ? (
                            <Button
                              onClick={submitAnswer}
                              disabled={selectedAnswer === null || submitAnswerMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {submitAnswerMutation.isPending ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Submitting...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Submit Answer</span>
                                </div>
                              )}
                            </Button>
                          ) : (
                            <div className="flex space-x-2 w-full">
                              <Button
                                onClick={nextQuestion}
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                Next Question
                              </Button>
                              <Button
                                onClick={() => setCurrentQuestion(null)}
                                variant="outline"
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                End Session
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="text-center text-sm text-gray-400">
                          Reward: {currentQuestion.reward} {currentQuestion.tokenReward} tokens
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-orange-400" />
                    Daily Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Answer 5 Trivia Questions</div>
                          <div className="text-sm text-gray-400">Progress: 3/5</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-400">50 $SLERF</div>
                        <Progress value={60} className="w-20 h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Maintain 3-Day Streak</div>
                          <div className="text-sm text-gray-400">Current streak: {triviaStreak}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-400">100 $CHONK9K</div>
                        <Progress value={Math.min(100, (triviaStreak / 3) * 100)} className="w-20 h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Join Community Event</div>
                          <div className="text-sm text-gray-400">Weekly tournament</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">200 Both</div>
                        <Badge className="bg-green-500/20 text-green-400 text-xs mt-1">
                          Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements?.map((achievement: Achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-700/30 border ${getRarityColor(achievement.rarity)} ${
                    achievement.isCompleted ? 'shadow-lg' : 'opacity-75'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Award className={`w-6 h-6 ${getRarityColor(achievement.rarity).split(' ')[0]}`} />
                          <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        {achievement.isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      
                      <h3 className="font-bold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Reward: </span>
                          <span className="font-semibold text-purple-400">
                            {achievement.reward} {achievement.tokenReward}
                          </span>
                        </div>
                        
                        {achievement.isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => claimAchievementMutation.mutate(achievement.id)}
                            disabled={claimAchievementMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Gift className="w-3 h-3 mr-1" />
                            Claim
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard?.slice(0, 10).map((member: CommunityMember, index: number) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3 
                          ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30' 
                          : 'bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{member.username}</div>
                          <div className="text-sm text-gray-400">Level {member.level} • {member.xp} XP</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold">${member.totalEarnings.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">{member.achievements} achievements</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Weekly Tournament</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-bold mb-2">$SLERF vs $CHONK9K Challenge</h3>
                    <p className="text-gray-400 mb-4">
                      Answer trivia questions about both tokens to win massive rewards!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-purple-600/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">500</div>
                        <div className="text-sm text-gray-400">$SLERF Prize</div>
                      </div>
                      <div className="bg-orange-600/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-400">1000</div>
                        <div className="text-sm text-gray-400">$CHONK9K Prize</div>
                      </div>
                    </div>
                    
                    <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                      <Star className="w-4 h-4 mr-2" />
                      Join Tournament
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">25.4K</div>
                      <div className="text-sm text-gray-400">$SLERF Earned Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">89.7K</div>
                      <div className="text-sm text-gray-400">$CHONK9K Earned Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">1,234</div>
                      <div className="text-sm text-gray-400">Active Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">5,678</div>
                      <div className="text-sm text-gray-400">Questions Answered</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
}