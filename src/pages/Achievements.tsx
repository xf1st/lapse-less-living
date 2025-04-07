
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AchievementsList from "@/components/achievements/AchievementsList";
import { useHabits } from "@/hooks/useHabits";

const Achievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const {
    habits,
    folders,
    userPlan,
    loading,
    fetchHabits,
    fetchFolders,
  } = useHabits(user?.id);

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const createHabit = () => {
    setNewHabitOpen(true);
  };

  const createFolder = () => {
    setNewFolderOpen(true);
  };

  return (
    <DashboardLayout
      userPlan={userPlan}
      createHabit={createHabit}
      createFolder={createFolder}
    >
      <div className="container max-w-6xl pb-20 pt-2">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Ваши достижения</h1>
          <p className="text-gray-600">
            Отслеживайте ваши достижения и прогресс на пути к привычкам
          </p>
        </div>
        
        <AchievementsList userId={user?.id} />
      </div>
    </DashboardLayout>
  );
};

export default Achievements;
