import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProgressCalendar from "@/components/habits/ProgressCalendar";
import { useHabits } from "@/hooks/useHabits";
import { Loader } from "@/components/ui/loader";

const Calendar = () => {
  const { user } = useAuth();
  const {
    habits,
    habitEntries,
    userPlan,
    loading,
    fetchHabitEntries,
  } = useHabits(user?.id);

  if (loading) {
    return (
      <DashboardLayout
        userPlan={userPlan}
        createHabit={() => {}}
        createFolder={() => {}}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="lg" gradient className="mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Загрузка календаря...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userPlan={userPlan}
      createHabit={() => {}}
      createFolder={() => {}}
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Календарь привычек
        </h1>

        {habits.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <ProgressCalendar
              habits={habits}
              entries={habitEntries}
              onEntriesChange={fetchHabitEntries}
              canViewStats={true}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              У вас пока нет привычек для отображения в календаре.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;