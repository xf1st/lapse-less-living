
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@/components/habits/HabitCard";
import { Folder } from "@/components/habits/FolderCard";
import { Plan } from "@/types/habit";
import { calculateDaysSinceStart } from "@/utils/habitUtils";
import { differenceInDays } from "date-fns";

export type HabitEntry = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
};

export const useHabits = (userId: string | undefined) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
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

  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habit_folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setFolders(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки папок",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchHabitEntries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habit_entries")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setHabitEntries(data);
        
        // After loading entries, update streaks
        updateStreaks(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки записей",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchUserPlan = useCallback(async () => {
    try {
      // First, get the user's plan_id from the habits table
      const { data: habitData, error: habitError } = await supabase
        .from("habits")
        .select("plan_id")
        .limit(1);

      let planId = "basic"; // Default plan
      
      if (!habitError && habitData && habitData.length > 0 && habitData[0].plan_id) {
        planId = habitData[0].plan_id;
      }
      
      // Then, get the plan details
      const { data: planData, error: planError } = await supabase
        .from("plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError) {
        throw planError;
      }

      if (planData) {
        setUserPlan(planData);
      }
    } catch (error: any) {
      // If error, set to basic plan
      setUserPlan({
        id: "basic",
        name: "Базовый",
        max_habits: 3,
        has_statistics: false,
        has_achievements: false,
        price: 0
      });
    }
  }, []);

  const updateStreaks = async (entries: HabitEntry[]) => {
    // Group entries by habit_id
    const entriesByHabit: Record<string, HabitEntry[]> = {};
    entries.forEach(entry => {
      if (!entriesByHabit[entry.habit_id]) {
        entriesByHabit[entry.habit_id] = [];
      }
      entriesByHabit[entry.habit_id].push(entry);
    });

    // For each habit, calculate current streak and longest streak
    for (const habit of habits) {
      const habitEntries = entriesByHabit[habit.id] || [];
      
      // Sort entries by date (newest first)
      habitEntries.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );

      // Find the most recent relapse (if any)
      const lastRelapse = habitEntries.find(entry => entry.is_relapse);
      const lastRelapseDate = lastRelapse 
        ? new Date(lastRelapse.completed_at) 
        : new Date(0); // If no relapse, use epoch time
      
      let currentStreak = 0;
      
      if (habit.start_date) {
        const startDate = new Date(habit.start_date);
        const today = new Date();
        
        // Reset time parts for accurate day comparison
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        // If start date is in the future, streak is 0
        if (startDate <= today) {
          // If there was a relapse after the start date
          if (lastRelapseDate > startDate) {
            // Use relapse date as new start
            const daysSinceRelapse = differenceInDays(today, lastRelapseDate);
            currentStreak = Math.max(0, daysSinceRelapse);
          } else {
            // No relapse (or relapse before start date), count from start date
            currentStreak = differenceInDays(today, startDate) + 1;
          }
        }
      }
      
      // Find longest streak
      let longestStreak = habit.longest_streak || 0;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      
      // Update habit with new streak information
      if (habit.current_streak !== currentStreak || habit.longest_streak !== longestStreak) {
        await supabase
          .from("habits")
          .update({
            current_streak: currentStreak,
            longest_streak: longestStreak
          })
          .eq("id", habit.id);
      }
      
      // Check for achievements
      if (currentStreak > 0) {
        checkForAchievements(habit.id, currentStreak);
      }
    }
    
    // Refresh habits to get updated streak info
    fetchHabits();
  };

  const checkForAchievements = async (habitId: string, currentStreak: number) => {
    if (!userPlan?.has_achievements) return;
    
    try {
      // Define milestone days for achievements
      const milestones = [1, 7, 30, 90, 180, 365];
      
      // Find the highest achieved milestone
      const milestone = milestones.find(m => currentStreak >= m && milestones.indexOf(m) === milestones.findIndex(x => currentStreak >= x));
      
      if (milestone) {
        // Define achievement type based on milestone
        let achievementType;
        switch (milestone) {
          case 1: achievementType = "first_day"; break;
          case 7: achievementType = "first_week"; break;
          case 30: achievementType = "first_month"; break;
          case 90: achievementType = "three_months"; break;
          case 180: achievementType = "six_months"; break;
          case 365: achievementType = "one_year"; break;
          default: achievementType = "custom";
        }
        
        // Check if achievement already exists
        const { data: existingAchievements, error: checkError } = await supabase
          .from("achievements")
          .select("*")
          .eq("habit_id", habitId)
          .eq("type", achievementType);
        
        if (checkError) throw checkError;
        
        // If achievement doesn't exist, create it
        if (!existingAchievements || existingAchievements.length === 0) {
          const { error: insertError } = await supabase
            .from("achievements")
            .insert({
              user_id: userId,
              habit_id: habitId,
              type: achievementType,
              days: milestone,
              viewed: false
            });
          
          if (insertError) throw insertError;
        }
      }
    } catch (error: any) {
      console.error("Error checking achievements:", error);
    }
  };

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
      fetchHabitEntries();
    } catch (error: any) {
      toast({
        title: "Ошибка удаления привычки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      // Check if folder has habits
      const folderHabits = habits.filter(habit => habit.folder_id === id);
      
      if (folderHabits.length > 0) {
        // Ask user to confirm deletion
        if (!window.confirm(`Эта папка содержит ${folderHabits.length} привычек. Они будут перемещены в раздел "Без папки". Продолжить?`)) {
          return;
        }
        
        // Move habits to no folder
        for (const habit of folderHabits) {
          const { error: updateError } = await supabase
            .from("habits")
            .update({ folder_id: null })
            .eq("id", habit.id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Delete the folder
      const { error } = await supabase
        .from("habit_folders")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Папка удалена",
        description: "Папка успешно удалена",
      });

      fetchHabits();
      fetchFolders();
    } catch (error: any) {
      toast({
        title: "Ошибка удаления папки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    return habitEntries.some(
      (entry) =>
        entry.habit_id === habitId && 
        entry.completed_at.split("T")[0] === today &&
        !entry.is_relapse
    );
  };

  useEffect(() => {
    if (userId) {
      fetchHabits();
      fetchFolders();
      fetchHabitEntries();
      fetchUserPlan();
    }
  }, [userId, fetchHabits, fetchFolders, fetchHabitEntries, fetchUserPlan]);

  return {
    habits,
    folders,
    habitEntries,
    userPlan,
    loading,
    fetchHabits,
    fetchFolders,
    fetchHabitEntries,
    fetchUserPlan,
    deleteHabit,
    deleteFolder,
    isHabitCompletedToday
  };
};
