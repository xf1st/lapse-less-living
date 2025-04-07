
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAchievements = (userId: string | undefined) => {
  const checkForAchievements = useCallback(async (habitId: string, currentStreak: number, hasPremium: boolean) => {
    if (!userId || !hasPremium) return;
    
    try {
      // Define milestone days for achievements - now including 10-day increments
      const standardMilestones = [1, 7, 30, 90, 180, 365];
      const tenDayMilestones = [10, 20, 40, 50, 60, 70, 80, 100, 200, 300];
      const allMilestones = [...standardMilestones, ...tenDayMilestones].sort((a, b) => a - b);
      
      // Find all milestones that have been achieved
      const achievedMilestones = allMilestones.filter(m => currentStreak >= m);
      
      if (achievedMilestones.length > 0) {
        // For each achieved milestone, check if we already have an achievement
        for (const milestone of achievedMilestones) {
          // Define achievement type based on milestone
          let achievementType;
          
          if (milestone === 1) achievementType = "first_day";
          else if (milestone === 7) achievementType = "first_week";
          else if (milestone === 30) achievementType = "first_month";
          else if (milestone === 90) achievementType = "three_months";
          else if (milestone === 180) achievementType = "six_months";
          else if (milestone === 365) achievementType = "one_year";
          else achievementType = `days_${milestone}`;
          
          // Check if achievement already exists
          const { data: existingAchievements, error: checkError } = await supabase
            .from("achievements")
            .select("*")
            .eq("habit_id", habitId)
            .eq("type", achievementType);
          
          if (checkError) {
            console.error("Error checking for existing achievement:", checkError);
            continue;
          }
          
          // If achievement doesn't exist, create it
          if (!existingAchievements || existingAchievements.length === 0) {
            // Get total achievement count for this user
            const { data: totalAchievements, error: countError } = await supabase
              .from("achievements")
              .select("id")
              .eq("user_id", userId);
              
            if (countError) {
              console.error("Error counting achievements:", countError);
              continue;
            }
            
            const achievementCount = totalAchievements?.length || 0;
            
            const { error: insertError } = await supabase
              .from("achievements")
              .insert({
                user_id: userId,
                habit_id: habitId,
                type: achievementType,
                days: milestone,
                viewed: false,
                achievement_number: achievementCount + 1
              });
            
            if (insertError) {
              console.error("Error creating achievement:", insertError);
            }
          }
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
