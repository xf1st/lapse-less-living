
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plan } from "@/types/habit";

export const useUserPlan = () => {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

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
