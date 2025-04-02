
import React from "react";
import { HabitType } from "@/types/habit";
import HabitCard from "@/components/habits/HabitCard";

type HabitListProps = {
  habits: HabitType[];
  isHabitCompletedToday: (habitId: string) => boolean;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onEditHabit?: (habit: HabitType) => void;
  onRelapseComplete?: () => Promise<void>;
  getLastRelapseDate: (habitId: string) => string | null;
};

const HabitList = ({ 
  habits, 
  isHabitCompletedToday, 
  onDeleteHabit, 
  onEditHabit,
  onRelapseComplete,
  getLastRelapseDate
}: HabitListProps) => {
  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompleted={isHabitCompletedToday(habit.id)}
          lastRelapseDate={getLastRelapseDate(habit.id)}
          onDelete={onDeleteHabit}
          onEdit={onEditHabit}
          onRelapseComplete={onRelapseComplete}
        />
      ))}
    </div>
  );
};

export default HabitList;
