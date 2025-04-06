
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/types/habit";

export const useUserPlan = () => {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPlan = useCallback(async () => {
    try {
      // Temporarily give everyone premium features
      // In the future, we'll restore real plan functionality
      setUserPlan({
        id: "premium",
        name: "Премиум",
        max_habits: 999, // Unlimited for practical purposes
        has_statistics: true,
        has_achievements: true,
        price: 0
      });
    } catch (error: any) {
      console.error("Error fetching user plan:", error);
      // Fallback to premium plan in case of error
      setUserPlan({
        id: "premium",
        name: "Премиум",
        max_habits: 999,
        has_statistics: true,
        has_achievements: true,
        price: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userPlan,
    fetchUserPlan,
    loading
  };
};
