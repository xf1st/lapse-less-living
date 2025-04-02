
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HabitType as Habit } from "@/types/habit";
import { FolderType as Folder } from "@/types/habit";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useHabits } from "@/hooks/useHabits";
import HabitForm from "@/components/habits/form/HabitForm";
import FolderForm from "@/components/habits/form/FolderForm";

const Dashboard = () => {
  const { user } = useAuth();
  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [editFolder, setEditFolder] = useState<Folder | null>(null);

  const {
    habits,
    folders,
    habitEntries,
    userPlan,
    loading,
    fetchHabits,
    fetchFolders,
    fetchHabitEntries,
    deleteHabit,
    deleteFolder,
    isHabitCompletedToday,
    getLastRelapseDate
  } = useHabits(user?.id);

  const createHabit = useCallback((folderId?: string) => {
    setEditHabit(null);
    if (folderId) {
      setEditHabit({ folder_id: folderId } as any);
    }
    setNewHabitOpen(true);
  }, []);

  const editHabitHandler = useCallback((habit: Habit) => {
    setEditHabit(habit);
    setNewHabitOpen(true);
  }, []);

  const createFolder = useCallback(() => {
    setEditFolder(null);
    setNewFolderOpen(true);
  }, []);

  const editFolderHandler = useCallback((folder: Folder) => {
    setEditFolder(folder);
    setNewFolderOpen(true);
  }, []);

  return (
    <DashboardLayout 
      userPlan={userPlan} 
      createHabit={() => createHabit()} 
      createFolder={createFolder}
    >
      <DashboardContent
        habits={habits}
        folders={folders}
        habitEntries={habitEntries}
        userPlan={userPlan}
        loading={loading}
        createHabit={createHabit}
        createFolder={createFolder}
        isHabitCompletedToday={isHabitCompletedToday}
        getLastRelapseDate={getLastRelapseDate}
        deleteHabit={deleteHabit}
        editHabitHandler={editHabitHandler}
        editFolderHandler={editFolderHandler}
        deleteFolder={deleteFolder}
        fetchHabitEntries={fetchHabitEntries}
      />

      {/* Add Habit Form Dialog */}
      <HabitForm 
        isOpen={newHabitOpen} 
        onClose={() => {
          setNewHabitOpen(false);
          setEditHabit(null);
        }} 
        onSuccess={fetchHabits}
        maxHabits={userPlan?.max_habits || 3}
        currentHabitsCount={habits.length}
        habit={editHabit}
        folders={folders}
      />

      {/* Add Folder Form Dialog */}
      <FolderForm
        isOpen={newFolderOpen}
        onClose={() => {
          setNewFolderOpen(false);
          setEditFolder(null);
        }}
        onSuccess={fetchFolders}
        folder={editFolder}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
