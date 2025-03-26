
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calendar, 
  AlertTriangle,
  Edit,
  Trash2,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  color: string;
  created_at: string;
  start_date: string;
  current_streak: number;
  longest_streak: number;
  folder_id?: string | null;
};

type HabitCardProps = {
  habit: Habit;
  isCompleted: boolean;
  onToggleCompletion?: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
  onEdit?: (habit: Habit) => void;
};

const HabitCard = ({ 
  habit, 
  isCompleted, 
  onToggleCompletion,
  onDelete,
  onEdit,
}: HabitCardProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500";
      case "green": return "bg-green-500";
      case "red": return "bg-red-500";
      case "purple": return "bg-purple-500";
      case "yellow": return "bg-yellow-500";
      case "indigo": return "bg-indigo-500";
      case "pink": return "bg-pink-500";
      default: return "bg-blue-500";
    }
  };

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Ежедневно";
      case "weekly": return "Еженедельно";
      case "monthly": return "Ежемесячно";
      default: return frequency;
    }
  };

  const formatStartDate = (dateString: string) => {
    if (!dateString) return "Нет данных";
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: ru });
    } catch (error) {
      return "Неверная дата";
    }
  };

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

      // Force refresh
      window.location.reload();
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

  const getStreakText = (count: number) => {
    if (count === 1) return "день";
    if (count > 1 && count < 5) return "дня";
    return "дней";
  };

  return (
    <div className="mb-4">
      {/* Main streak card */}
      <Card className="shadow-sm border hover:shadow-md transition-shadow overflow-hidden mb-2">
        <div className="flex items-center p-4">
          <div className={cn("w-2 h-full rounded-sm self-stretch mr-3", getColorClass(habit.color))}></div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{habit.name}</h3>
          </div>
        </div>
        
        {/* Big bold streak count */}
        <div className="flex items-center justify-center py-5 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-blue">{habit.current_streak}</div>
            <div className="text-sm text-gray-500 mt-1">
              {getStreakText(habit.current_streak)}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Details and controls card */}
      <Card className="shadow-sm border p-3">
        <div className="text-sm space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs font-normal">
              {formatFrequency(habit.frequency)}
            </Badge>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => onDelete(habit.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
              </Button>
            </div>
          </div>
          
          {habit.description && (
            <p className="text-xs text-gray-600">{habit.description}</p>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Начало: {formatStartDate(habit.start_date)}</span>
          </div>
          
          {habit.longest_streak > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <Flame className="h-3 w-3 mr-1 text-amber-500" />
              <span>Рекорд: {habit.longest_streak} {getStreakText(habit.longest_streak)}</span>
            </div>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-2"
            onClick={handleRelapse}
            disabled={isSubmitting}
          >
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Я сорвался
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HabitCard;
