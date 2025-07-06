import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Zap, Trophy, Gift } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  reward: number;
}

interface DailyTriviaProps {
  userId: number;
}

export default function DailyTrivia({ userId }: DailyTriviaProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get today's trivia status
  const { data: triviaStatus, isLoading } = useQuery({
    queryKey: ['/api/trivia/status', userId],
    enabled: !!userId,
  });

  // Get current question
  const { data: questionData } = useQuery({
    queryKey: ['/api/trivia/question', userId],
    enabled: !!userId && !triviaStatus?.completedToday,
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: { questionId: number; selectedAnswer: number; timeRemaining: number }) => {
      const response = await apiRequest('POST', '/api/trivia/answer', {
        userId,
        ...answerData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsAnswered(true);
      setIsCorrect(data.correct);
      setStreak(data.streak);
      
      if (data.correct) {
        toast({
          title: "Correct! 🎉",
          description: `You earned ${data.reward} $LERF tokens! Streak: ${data.streak}`,
        });
      } else {
        toast({
          title: "Incorrect",
          description: `The correct answer was: ${questionData?.options[questionData?.correctAnswer]}`,
          variant: "destructive",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/trivia/status', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (currentQuestion && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // Auto-submit when time runs out
      if (selectedAnswer !== null) {
        submitAnswerMutation.mutate({
          questionId: currentQuestion!.id,
          selectedAnswer,
          timeRemaining: 0,
        });
      }
    }
  }, [timeLeft, isAnswered, currentQuestion, selectedAnswer]);

  // Set current question from API
  useEffect(() => {
    if (questionData && !currentQuestion) {
      setCurrentQuestion(questionData);
      setTimeLeft(30);
    }
  }, [questionData, currentQuestion]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null && currentQuestion) {
      submitAnswerMutation.mutate({
        questionId: currentQuestion.id,
        selectedAnswer,
        timeRemaining: timeLeft,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (triviaStatus?.completedToday) {
    return (
      <Card className="glass-card border-green-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Daily Trivia Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Well Done!</h3>
            <p className="text-muted-foreground mb-4">
              You've completed today's trivia challenge
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-400">
                Earned: {triviaStatus.todayReward} $LERF
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400">
                Streak: {triviaStatus.currentStreak} days
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Come back tomorrow for a new challenge!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading today's trivia challenge...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-blue-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            Daily Trivia Challenge
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400">
              +{currentQuestion.reward} $LERF
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer */}
          <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Time Remaining</span>
            </div>
            <div className={`text-lg font-mono font-bold ${
              timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'
            }`}>
              {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !isAnswered && setSelectedAnswer(index)}
                  disabled={isAnswered}
                  className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                    isAnswered
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-green-500/50 text-green-300'
                        : index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                      : selectedAnswer === index
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isAnswered && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {!isAnswered && (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null || submitAnswerMutation.isPending}
                className="w-full btn-primary"
              >
                {submitAnswerMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Submit Answer
                  </div>
                )}
              </Button>
            )}

            {/* Result */}
            {isAnswered && (
              <div className={`p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-2 ${
                    isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isCorrect 
                      ? `Great job! You earned ${currentQuestion.reward} $LERF tokens!`
                      : `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                    }
                  </p>
                  {isCorrect && (
                    <div className="flex items-center justify-center gap-4">
                      <Badge className="bg-green-500/20 text-green-400">
                        +{currentQuestion.reward} $LERF
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        Streak: {streak} days
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}