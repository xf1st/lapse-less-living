
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Edit, 
  Trash2, 
  Flame,
  AlertTriangle
} from "lucide-react";
import { Habit } from "@/types/habit";
import { formatFrequency, formatStartDate } from "@/utils/habitUtils";

type HabitDetailsProps = {
  habit: Habit;
  isSubmitting: boolean;
  onEdit: () => void;
  onDelete: (habitId: string) => Promise<void>;
  onRelapse: () => Promise<void>;
};

const HabitDetails = ({ 
  habit, 
  isSubmitting, 
  onEdit, 
  onDelete,
  onRelapse
}: HabitDetailsProps) => {
  return (
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
            onClick={onEdit}
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
        onClick={onRelapse}
        disabled={isSubmitting}
      >
        <AlertTriangle className="mr-1 h-3.5 w-3.5" />
        Я сорвался
      </Button>
    </div>
  );
};

export default HabitDetails;
