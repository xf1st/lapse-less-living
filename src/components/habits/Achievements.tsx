
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitType } from "@/types/habit";
import AchievementBadge from "@/components/achievements/AchievementBadge";
import { Skeleton } from "@/components/ui/skeleton";

type AchievementData = {
  id: string;
  user_id: string;
  habit_id: string;
  type: string;
  days: number;
  achieved_at: string;
  achievement_number: number;
};

type AchievementsProps = {
  habits: HabitType[];
  canViewAchievements: boolean;
};

const Achievements = ({ habits, canViewAchievements }: AchievementsProps) => {
  const userId = habits.length > 0 ? habits[0].user_id : null;
  const [achievements, setAchievements] = useState<AchievementData[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      if (!userId || !canViewAchievements) return [];
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('achievement_number', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId && canViewAchievements
  });

  useEffect(() => {
    if (data) {
      setAchievements(data);
    }
  }, [data]);

  if (!canViewAchievements) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Достижения</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Доступно в премиум плане
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Достижения</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-sm text-red-500">
            Ошибка загрузки достижений
          </div>
        ) : achievements.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} habit={habits.find(h => h.id === achievement.habit_id)} />
              ))}
            </div>
            <div className="pt-2">
              <Link to="/dashboard/achievements">
                <Button variant="outline" size="sm" className="w-full">
                  <span>Показать все</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                У вас пока нет достижений
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Продолжайте придерживаться своих привычек
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Achievements;
