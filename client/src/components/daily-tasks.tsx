import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Twitter, Users, HelpCircle } from "lucide-react";
import { Task } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DailyTasksProps {
  tasks: Task[];
  completedTaskIds: number[];
  userId: number;
}

export default function DailyTasks({ tasks, completedTaskIds, userId }: DailyTasksProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest('POST', '/api/tasks/complete', {
        userId,
        taskId
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Task Completed!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard', userId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getTaskIcon = (iconClass: string) => {
    switch (iconClass) {
      case 'fas fa-check':
        return <CheckCircle className="w-5 h-5" />;
      case 'fas fa-question':
        return <HelpCircle className="w-5 h-5" />;
      case 'fab fa-twitter':
        return <Twitter className="w-5 h-5" />;
      case 'fas fa-users':
        return <Users className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getTaskIconColor = (iconClass: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-500';
    
    switch (iconClass) {
      case 'fas fa-check':
        return 'bg-green-500';
      case 'fas fa-question':
        return 'bg-blue-500';
      case 'fab fa-twitter':
        return 'bg-blue-400';
      case 'fas fa-users':
        return 'bg-yellow-500';
      default:
        return 'bg-purple-500';
    }
  };

  const getRewardColor = (iconClass: string) => {
    switch (iconClass) {
      case 'fas fa-check':
        return 'text-green-400';
      case 'fas fa-question':
        return 'text-purple-400';
      case 'fab fa-twitter':
        return 'text-blue-400';
      case 'fas fa-users':
        return 'text-yellow-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <Card className="glass-card border-purple-500/30 animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-orbitron font-bold">Daily Tasks</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Resets in 14h 32m</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const iconColor = getTaskIconColor(task.icon, isCompleted);
            const rewardColor = getRewardColor(task.icon);
            
            return (
              <div key={task.id} className="task-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center text-white`}>
                      {getTaskIcon(task.icon)}
                    </div>
                    <div>
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="text-sm text-gray-400">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${rewardColor}`}>
                      +{task.reward} $SLERF
                    </p>
                    {isCompleted ? (
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="btn-primary text-xs"
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                      >
                        {completeTaskMutation.isPending ? (
                          <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                        ) : (
                          task.buttonText
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
