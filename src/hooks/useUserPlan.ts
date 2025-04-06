
import { useState, useCallback } from "react";
import { Plan } from "@/types/habit";

export const useUserPlan = () => {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPlan = useCallback(async () => {
    try {
      // Give everyone premium features regardless of their actual plan
      setUserPlan({
        id: "premium",
        name: "Премиум",
        max_habits: 999, // Unlimited for practical purposes
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
