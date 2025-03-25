
import React from "react";
import FolderCard, { Folder } from "@/components/habits/FolderCard";
import { Habit } from "@/components/habits/HabitCard";
import { SortableHabitCard } from "@/components/habits/SortableHabitCard";

type HabitFolderListProps = {
  folderHabits: Array<{
    folder: Folder;
    habits: Habit[];
  }>;
  unfolderedHabits: Habit[];
  isHabitCompletedToday: (habitId: string) => boolean;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onEditHabit: (habit: Habit) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => Promise<void>;
  onAddHabit: (folderId: string) => void;
};

const HabitFolderList = ({
  folderHabits,
  unfolderedHabits,
  isHabitCompletedToday,
  onDeleteHabit,
  onEditHabit,
  onEditFolder,
  onDeleteFolder,
  onAddHabit,
}: HabitFolderListProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Отслеживаемые привычки</h2>
      
      {/* Folders */}
      {folderHabits.map(({ folder, habits }) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          habits={habits}
          isCompleted={isHabitCompletedToday}
          onDeleteHabit={onDeleteHabit}
          onEditHabit={onEditHabit}
          onEditFolder={onEditFolder}
          onDeleteFolder={onDeleteFolder}
          onAddHabit={onAddHabit}
        />
      ))}
      
      {/* Unfiled habits */}
      {unfolderedHabits.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Без папки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unfolderedHabits.map((habit) => (
              <SortableHabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isHabitCompletedToday(habit.id)}
                onDelete={onDeleteHabit}
                onEdit={onEditHabit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitFolderList;
