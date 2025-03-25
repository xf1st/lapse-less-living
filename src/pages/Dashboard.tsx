
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Habit } from "@/components/habits/HabitCard";
import HabitForm from "@/components/habits/HabitForm";
import FolderForm from "@/components/habits/FolderForm";
import { Folder } from "@/components/habits/FolderCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useHabits } from "@/hooks/useHabits";

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
    isHabitCompletedToday
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
