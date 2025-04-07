
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Check } from "lucide-react";
import AchievementCard from "./AchievementCard";
import NextMilestone from "./NextMilestone";

type Achievement = {
  id: string;
  user_id: string;
  habit_id: string;
  type: string;
  days: number;
  achieved_at: string;
  viewed: boolean;
  achievement_number: number;
  habit_name?: string;
};

type AchievementsListProps = {
  userId?: string;
};

const AchievementsList = ({ userId }: AchievementsListProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<{ habitId: string; current: number }[]>([]);
  const [habitsMap, setHabitsMap] = useState<Record<string, string>>({});

  // Fetch achievements
  const { data, isLoading, error } = useQuery({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('achievement_number', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
  
  // Fetch habits to get names
  const { data: habitsData } = useQuery({
    queryKey: ['habits-for-achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('habits')
        .select('id, name, current_streak')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
  
  // Process habits data
  useEffect(() => {
    if (habitsData) {
      // Create map of habit IDs to names
      const habitNamesMap: Record<string, string> = {};
      const currentStreaks: { habitId: string; current: number }[] = [];
      
      habitsData.forEach(habit => {
        habitNamesMap[habit.id] = habit.name;
        currentStreaks.push({
          habitId: habit.id,
          current: habit.current_streak || 0
        });
      });
      
      setHabitsMap(habitNamesMap);
      setStreaks(currentStreaks);
    }
  }, [habitsData]);
  
  // Process achievements data
  useEffect(() => {
    if (data) {
      // Enrich achievements with habit names
      const enrichedAchievements = data.map(achievement => ({
        ...achievement,
        habit_name: habitsMap[achievement.habit_id] || 'Привычка'
      }));
      
      setAchievements(enrichedAchievements);
    }
  }, [data, habitsMap]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Ошибка загрузки достижений
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="grid gap-6">
        <Card className="border">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <Trophy className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium">У вас пока нет достижений</h3>
            <p className="text-gray-500 mt-2">
              Продолжайте придерживаться своих привычек, и вы скоро получите свои первые достижения
            </p>
            
            {streaks.length > 0 && (
              <div className="mt-6 w-full max-w-md">
                <NextMilestone streaks={streaks} habitsMap={habitsMap} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Ваши достижения</CardTitle>
            <Badge variant="outline" className="ml-2">
              Всего: {achievements.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {achievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Show next milestones if there are habits */}
      {streaks.length > 0 && (
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Следующие цели</CardTitle>
          </CardHeader>
          <CardContent>
            <NextMilestone streaks={streaks} habitsMap={habitsMap} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementsList;
