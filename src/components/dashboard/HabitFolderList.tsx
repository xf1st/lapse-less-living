
import React from "react";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import HabitList from "@/components/habits/HabitList";
import FolderCard from "@/components/habits/FolderCard";
import { HabitType, FolderType } from "@/types/habit";

type FolderWithHabits = {
  folder: FolderType;
  habits: HabitType[];
};

type HabitFolderListProps = {
  folderHabits: FolderWithHabits[];
  unfolderedHabits: HabitType[];
  isHabitCompletedToday: (habitId: string) => boolean;
  getLastRelapseDate: (habitId: string) => string | null;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onEditHabit?: (habit: HabitType) => void;
  onEditFolder?: (folder: FolderType) => void;
  onDeleteFolder?: (folderId: string) => Promise<void>;
  onAddHabit: (folderId?: string) => void;
  onRelapseComplete?: () => Promise<void>;
};

const HabitFolderList = ({
  folderHabits,
  unfolderedHabits,
  isHabitCompletedToday,
  getLastRelapseDate,
  onDeleteHabit,
  onEditHabit,
  onEditFolder,
  onDeleteFolder,
  onAddHabit,
  onRelapseComplete
}: HabitFolderListProps) => {
  return (
    <div className="space-y-8">
      {/* Habits without folders */}
      {unfolderedHabits.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Общие привычки</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onAddHabit()}
            >
              <FilePlus className="w-3.5 h-3.5 mr-1" />
              Добавить
            </Button>
          </div>
          
          <HabitList
            habits={unfolderedHabits}
            isHabitCompletedToday={isHabitCompletedToday}
            onDeleteHabit={onDeleteHabit}
            onEditHabit={onEditHabit}
            onRelapseComplete={onRelapseComplete}
            getLastRelapseDate={getLastRelapseDate}
          />
        </div>
      )}
      
      {/* Folder sections */}
      {folderHabits.map((folderWithHabits) => (
        folderWithHabits.habits.length > 0 && (
          <div key={folderWithHabits.folder.id}>
            <FolderCard
              folder={folderWithHabits.folder}
              onEdit={onEditFolder}
              onDelete={onDeleteFolder}
              onAddHabit={() => onAddHabit(folderWithHabits.folder.id)}
            />
            
            <div className="mt-4 pl-4 border-l-2 border-gray-100">
              <HabitList
                habits={folderWithHabits.habits}
                isHabitCompletedToday={isHabitCompletedToday}
                onDeleteHabit={onDeleteHabit}
                onEditHabit={onEditHabit}
                onRelapseComplete={onRelapseComplete}
                getLastRelapseDate={getLastRelapseDate}
              />
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default HabitFolderList;
