
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HabitType } from "@/types/habit";

export const useAchievements = (userId: string | undefined) => {
  const checkForAchievements = useCallback(async (habitId: string, currentStreak: number, hasPremium: boolean) => {
    if (!userId || !hasPremium) return;
    
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
  }, [userId]);

  return {
    checkForAchievements
  };
};
