
import { useEffect, useCallback } from "react";
import { useHabitData } from "@/hooks/useHabitData";
import { useHabitFolders } from "@/hooks/useHabitFolders";
import { useHabitEntries } from "@/hooks/useHabitEntries";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useAchievements } from "@/hooks/useAchievements";

export const useHabits = (userId: string | undefined) => {
  // Initialize all the sub-hooks
  const { 
    habitEntries, 
    fetchHabitEntries, 
    isHabitCompletedToday, 
    getLastRelapseDate,
    loading: entriesLoading 
  } = useHabitEntries();
  
  const { 
    habits, 
    fetchHabits, 
    deleteHabit, 
    updateStreaks,
    loading: habitsLoading 
  } = useHabitData(getLastRelapseDate);
  
  const { 
    folders, 
    fetchFolders, 
    deleteFolder,
    loading: foldersLoading 
  } = useHabitFolders();
  
  const { 
    userPlan, 
    fetchUserPlan,
    loading: planLoading 
  } = useUserPlan();
  
  const { checkForAchievements } = useAchievements(userId);
  
  // Aggregate loading state
  const loading = habitsLoading || foldersLoading || entriesLoading || planLoading;

  // Check for achievements after streaks are updated
  const checkAchievements = useCallback(() => {
    if (!userPlan?.has_achievements) return;
    
    habits.forEach(habit => {
      if (habit.current_streak > 0) {
        checkForAchievements(habit.id, habit.current_streak, !!userPlan?.has_achievements);
      }
    });
  }, [habits, userPlan, checkForAchievements]);

  // Load all data on mount
  useEffect(() => {
    if (userId) {
      fetchHabits();
      fetchFolders();
      fetchHabitEntries();
      fetchUserPlan();
    }
  }, [userId, fetchHabits, fetchFolders, fetchHabitEntries, fetchUserPlan]);

  // Update streaks and check achievements when entries or habits change
  useEffect(() => {
    if (habits.length > 0 && habitEntries.length > 0) {
      updateStreaks().then(() => {
        checkAchievements();
      });
    }
  }, [habitEntries, habits, updateStreaks, checkAchievements]);

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
    isHabitCompletedToday,
    getLastRelapseDate
  };
};
