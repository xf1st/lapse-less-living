
import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <HabitCard
        habit={habit}
        isCompleted={isCompleted}
        onToggleCompletion={onToggleCompletion}
        onDelete={onDelete}
        onEdit={onEdit}
        onReorderStart={() => ({ attributes, listeners })}
      />
    </div>
  );
};
