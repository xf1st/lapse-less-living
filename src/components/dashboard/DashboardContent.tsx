
import React from "react";
import { Loader } from "@/components/ui/loader";
import Stats from "@/components/habits/Stats";
import ProgressCalendar from "@/components/habits/ProgressCalendar";
import Achievements from "@/components/habits/Achievements";
import EmptyHabitState from "./EmptyHabitState";
import HabitFolderList from "./HabitFolderList";
import DashboardHeader from "./DashboardHeader";
import PremiumBanner from "./PremiumBanner";
import PromoPlans from "./PromoPlans";
import { HabitType, FolderType, Plan } from "@/types/habit";
import { useIsMobile } from "@/hooks/use-mobile";
import { HabitEntryType } from "@/hooks/useHabitEntries";

type DashboardContentProps = {
  habits: HabitType[];
  folders: FolderType[];
  habitEntries: HabitEntryType[];
  userPlan: Plan | null;
  loading: boolean;
  createHabit: (folderId?: string) => void;
  createFolder: () => void;
  isHabitCompletedToday: (habitId: string) => boolean;
  getLastRelapseDate: (habitId: string) => string | null;
  deleteHabit: (habitId: string) => Promise<void>;
  editHabitHandler: (habit: HabitType) => void;
  editFolderHandler: (folder: FolderType) => void;
  deleteFolder: (folderId: string) => Promise<void>;
  fetchHabitEntries: () => Promise<void>;
  telegramMode?: boolean;
};

const DashboardContent = ({
  habits,
  folders,
  habitEntries,
  userPlan,
  loading,
  createHabit,
  createFolder,
  isHabitCompletedToday,
  getLastRelapseDate,
  deleteHabit,
  editHabitHandler,
  editFolderHandler,
  deleteFolder,
  fetchHabitEntries,
  telegramMode = false,
}: DashboardContentProps) => {
  const isMobile = useIsMobile();
  
  // Group habits by folder
  const unfolderedHabits = habits.filter(habit => !habit.folder_id);
  const folderHabits = folders.map(folder => ({
    folder,
    habits: habits.filter(habit => habit.folder_id === folder.id)
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader size="lg" gradient className="mb-4" />
        <p className="text-gray-500">Загрузка привычек...</p>
      </div>
    );
  }

  const containerClass = telegramMode 
    ? "px-2" 
    : (isMobile ? "px-2" : "px-4 sm:px-6 md:px-8");

  return (
    <div className={`max-w-7xl mx-auto py-6 ${containerClass}`}>
      {!telegramMode && (
        <DashboardHeader createHabit={() => createHabit()} createFolder={createFolder} />
      )}

      {/* Stats and Achievements Section - visible to all users now */}
      {habits.length > 0 && !telegramMode && (
        <>
          <Stats 
            habits={habits} 
            entries={habitEntries} 
            canViewStats={true} // Always show stats
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <ProgressCalendar 
              habits={habits} 
              entries={habitEntries} 
              onEntriesChange={fetchHabitEntries}
              canViewStats={true} // Always show calendar
            />
            
            <Achievements 
              habits={habits} 
              canViewAchievements={true} // Always show achievements
            />
          </div>
        </>
      )}

      {habits.length > 0 ? (
        <HabitFolderList
          folderHabits={folderHabits}
          unfolderedHabits={unfolderedHabits}
          isHabitCompletedToday={isHabitCompletedToday}
          getLastRelapseDate={getLastRelapseDate}
          onDeleteHabit={deleteHabit}
          onEditHabit={editHabitHandler}
          onEditFolder={editFolderHandler}
          onDeleteFolder={deleteFolder}
          onAddHabit={createHabit}
          onRelapseComplete={fetchHabitEntries}
        />
      ) : (
        <EmptyHabitState createHabit={() => createHabit()} />
      )}
    </div>
  );
};

export default DashboardContent;
