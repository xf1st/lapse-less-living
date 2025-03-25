
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calendar, 
  CheckCircle2, 
  X, 
  Trash2, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
};

type HabitCardProps = {
  habit: Habit;
  isCompleted: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
  onReorderStart?: () => void;
};

const HabitCard = ({ 
  habit, 
  isCompleted, 
  onToggleCompletion, 
  onDelete,
  onReorderStart
}: HabitCardProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <Card 
      className="shadow-sm border hover:shadow-md transition-shadow cursor-move"
      onMouseDown={onReorderStart}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className={cn("w-4 h-4 rounded-full", getColorClass(habit.color))}></div>
          <CardTitle className="text-xl">{habit.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>{formatFrequency(habit.frequency)}</span>
          {habit.current_streak > 0 && (
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Flame className="h-4 w-4" />
              <span>{habit.current_streak} {habit.current_streak === 1 ? "день" : "дней"}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {habit.description && <p className="text-gray-600 mb-2">{habit.description}</p>}
        <div className="text-sm text-gray-500">
          Начало отслеживания: {formatStartDate(habit.start_date)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <div className="flex justify-between w-full">
          <Button
            variant={isCompleted ? "destructive" : "outline"}
            size="sm"
            onClick={() => onToggleCompletion(habit.id)}
            disabled={isSubmitting}
          >
            {isCompleted ? (
              <>
                <X className="mr-1 h-4 w-4" />
                Сбросить
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Отметить
              </>
            )}
          </Button>
          
          <div className="flex gap-1">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(habit.id)}
              className="text-gray-500 hover:text-red-500"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Collapsible open={isOpen} className="w-full">
          <CollapsibleContent className="pt-2 w-full">
            <div className="border-t pt-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleRelapse}
                disabled={isSubmitting}
              >
                <AlertTriangle className="mr-1 h-4 w-4" />
                Я сорвался
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
