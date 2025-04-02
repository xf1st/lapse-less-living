
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type HabitEntryType = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
};

export const useHabitEntries = () => {
  const [habitEntries, setHabitEntries] = useState<HabitEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        setHabitEntries(data as HabitEntryType[]);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки записей",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const isHabitCompletedToday = useCallback(
    (habitId: string) => {
      const today = new Date().toISOString().split("T")[0];
      return habitEntries.some(
        (entry) =>
          entry.habit_id === habitId && 
          entry.completed_at.split("T")[0] === today &&
          !entry.is_relapse
      );
    },
    [habitEntries]
  );

  const getLastRelapseDate = useCallback(
    (habitId: string): string | null => {
      // Find entries for this habit that are relapses
      const relapseEntries = habitEntries.filter(
        entry => entry.habit_id === habitId && entry.is_relapse
      );
      
      // Sort by date (newest first)
      relapseEntries.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
      
      return relapseEntries.length > 0 ? relapseEntries[0].completed_at : null;
    },
    [habitEntries]
  );

  return {
    habitEntries,
    fetchHabitEntries,
    isHabitCompletedToday,
    getLastRelapseDate,
    loading
  };
};
