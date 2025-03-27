
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
