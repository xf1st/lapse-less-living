
import React from "react";
import HabitCard, { Habit } from "./HabitCard";

type SortableHabitCardProps = {
  habit: Habit;
  isCompleted: boolean;
  onToggleCompletion?: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
  onEdit?: (habit: Habit) => void;
};

export const SortableHabitCard = ({ 
  habit, 
  isCompleted, 
  onToggleCompletion,
  onDelete,
  onEdit
}: SortableHabitCardProps) => {
  return (
    <HabitCard
      habit={habit}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
};
