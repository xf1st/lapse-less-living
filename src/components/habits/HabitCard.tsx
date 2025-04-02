
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getColorClass, getStreakText, calculateCurrentStreak } from "@/utils/habitUtils";
import HabitStreakDisplay from "./HabitStreakDisplay";
import HabitDetails from "./HabitDetails";
import { HabitType } from "@/types/habit";

type HabitCardProps = {
  habit: HabitType;
  isCompleted: boolean;
  lastRelapseDate: string | null;
  onToggleCompletion?: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
  onEdit?: (habit: HabitType) => void;
  onRelapseComplete?: () => Promise<void>;
};

const HabitCard = ({ 
  habit, 
  isCompleted, 
  lastRelapseDate,
  onToggleCompletion,
  onDelete,
  onEdit,
  onRelapseComplete
}: HabitCardProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate current streak based on start date and last relapse
  const currentStreak = calculateCurrentStreak(habit.start_date, lastRelapseDate);

  const handleRelapse = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.from("habit_entries").insert({
        habit_id: habit.id,
        completed_at: new Date().toISOString(),
        is_relapse: true
      });

      if (error) throw error;

      toast({
        title: "Сожалеем о срыве",
        description: "Не отчаивайтесь, продолжайте трекинг привычки",
      });

      // Reset streak in the habits table
      const { error: updateError } = await supabase
        .from("habits")
        .update({ current_streak: 0 })
        .eq("id", habit.id);

      if (updateError) throw updateError;
      
      // Call the callback if provided
      if (onRelapseComplete) {
        await onRelapseComplete();
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(habit);
    }
  };

  return (
    <div className="mb-4">
      {/* Main streak card */}
      <Card className="shadow-sm border hover:shadow-md transition-shadow overflow-hidden mb-2">
        <div className="flex items-center p-4">
          <div className={cn("w-2 h-14 rounded-sm self-stretch mr-3", getColorClass(habit.color || "blue"))}></div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{habit.name}</h3>
          </div>
        </div>
        
        {/* Streak display component with calculated streak and habit color */}
        <HabitStreakDisplay 
          currentStreak={currentStreak} 
          habitColor={habit.color || "blue"} 
        />
      </Card>
      
      {/* Details and controls card */}
      <Card className="shadow-sm border p-3">
        <HabitDetails 
          habit={{...habit, current_streak: currentStreak}} 
          isSubmitting={isSubmitting} 
          onEdit={handleEdit} 
          onDelete={onDelete}
          onRelapse={handleRelapse}
        />
      </Card>
    </div>
  );
};

export default HabitCard;
