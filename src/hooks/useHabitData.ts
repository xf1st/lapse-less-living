
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HabitType } from "@/types/habit";
import { calculateCurrentStreak } from "@/utils/habitUtils";

export type Habit = HabitType;

export const useHabitData = (getLastRelapseDate: (habitId: string) => string | null) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHabits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setHabits(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки привычек",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Привычка удалена",
        description: "Привычка успешно удалена",
      });

      fetchHabits();
    } catch (error: any) {
      toast({
        title: "Ошибка удаления привычки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStreaks = useCallback(async () => {
    for (const habit of habits) {
      if (!habit.start_date) continue;
      
      // Get the last relapse date for this habit
      const lastRelapseDate = getLastRelapseDate(habit.id);
      
      // Calculate current streak
      const currentStreak = calculateCurrentStreak(habit.start_date, lastRelapseDate);
      
      // Find longest streak
      const longestStreak = Math.max(habit.longest_streak || 0, currentStreak);
      
      // Only update if something changed
      if (habit.current_streak !== currentStreak || habit.longest_streak !== longestStreak) {
        await supabase
          .from("habits")
          .update({
            current_streak: currentStreak,
            longest_streak: longestStreak
          })
          .eq("id", habit.id);
      }
    }
    
    // Refresh habits to get updated streak info
    fetchHabits();
  }, [habits, getLastRelapseDate, fetchHabits]);

  return {
    habits,
    fetchHabits,
    deleteHabit,
    updateStreaks,
    loading
  };
};
