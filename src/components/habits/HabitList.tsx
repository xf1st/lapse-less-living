
import React from "react";
import HabitCard, { Habit } from "./HabitCard";

type HabitListProps = {
  habits: Habit[];
  isHabitCompleted: (habitId: string) => boolean;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onEditHabit: (habit: Habit) => void;
};

const HabitList = ({ 
  habits, 
  isHabitCompleted, 
  onDeleteHabit,
  onEditHabit,
}: HabitListProps) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Нет привычек для отображения
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompleted={isHabitCompleted(habit.id)}
          onDelete={onDeleteHabit}
          onEdit={onEditHabit}
        />
      ))}
    </div>
  );
};

export default HabitList;
