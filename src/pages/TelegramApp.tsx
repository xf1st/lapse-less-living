
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";
import { useHabits } from "@/hooks/useHabits";
import { useTelegramApp } from "@/hooks/useTelegramApp";
import DashboardContent from "@/components/dashboard/DashboardContent";
import TelegramAuthForm from "@/components/telegram/TelegramAuthForm";
import NonTelegramWarning from "@/components/telegram/NonTelegramWarning";

const TelegramApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isTelegram, telegramUser, loading: telegramLoading } = useTelegramApp();
  
  // Use the useHabits hook for accessing habit functions and data
  const {
    habits,
    folders,
    habitEntries,
    userPlan,
    loading: habitsLoading,
    fetchHabits,
    fetchFolders,
    fetchHabitEntries,
    deleteHabit,
    deleteFolder,
    isHabitCompletedToday,
    getLastRelapseDate
  } = useHabits(user?.id);

  // Show loading state while checking authentication and Telegram initialization
  if (telegramLoading || authLoading || habitsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader gradient size="lg" />
        <p className="mt-4 text-gray-500">Загрузка приложения...</p>
      </div>
    );
  }

  // User is authenticated - show dashboard
  if (user) {
    const createHabit = (folderId?: string) => {
      // Placeholder for habit creation function in telegram mode
      console.log("Создание привычки в telegram app", folderId);
    };
    
    const createFolder = () => {
      // Placeholder for folder creation function in telegram mode
      console.log("Создание папки в telegram app");
    };
    
    const editHabitHandler = (habit: any) => {
      // Placeholder for habit editing function
      console.log("Редактирование привычки", habit);
    };
    
    const editFolderHandler = (folder: any) => {
      // Placeholder for folder editing function
      console.log("Редактирование папки", folder); 
    };
    
    return (
      <div className="p-4">
        <DashboardContent
          habits={habits}
          folders={folders}
          habitEntries={habitEntries}
          userPlan={userPlan}
          loading={habitsLoading}
          createHabit={createHabit}
          createFolder={createFolder}
          isHabitCompletedToday={isHabitCompletedToday}
          getLastRelapseDate={getLastRelapseDate}
          deleteHabit={deleteHabit}
          editHabitHandler={editHabitHandler}
          editFolderHandler={editFolderHandler}
          deleteFolder={deleteFolder}
          fetchHabitEntries={fetchHabitEntries}
          telegramMode={true}
        />
      </div>
    );
  }

  // If not in Telegram WebApp - show message
  if (!isTelegram) {
    return <NonTelegramWarning />;
  }

  // Authorization form for syncing
  return <TelegramAuthForm telegramUser={telegramUser} />;
};

export default TelegramApp;
