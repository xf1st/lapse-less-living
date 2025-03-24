
import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Calendar,
  LogOut,
  BarChart3,
  Menu,
  Home,
  Trophy,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader } from "@/components/ui/loader";
import HabitCard, { Habit } from "@/components/habits/HabitCard";
import HabitForm from "@/components/habits/HabitForm";
import ProgressCalendar from "@/components/habits/ProgressCalendar";
import Stats from "@/components/habits/Stats";
import Achievements from "@/components/habits/Achievements";
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type HabitEntry = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
};

type Plan = {
  id: string;
  name: string;
  max_habits: number;
  has_statistics: boolean;
  has_achievements: boolean;
  price: number;
};

const SortableHabitCard = ({ habit, isCompleted, onToggleCompletion, onDelete }) => {
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
        onReorderStart={() => listeners && attributes}
      />
    </div>
  );
};

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" />;
  }

  const fetchHabits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setHabits(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки привычек",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchHabitEntries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habit_entries")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setHabitEntries(data);
        
        // After loading entries, update streaks
        updateStreaks(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки записей",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchUserPlan = useCallback(async () => {
    try {
      // First, get the user's plan_id from the habits table
      const { data: habitData, error: habitError } = await supabase
        .from("habits")
        .select("plan_id")
        .limit(1);

      let planId = "basic"; // Default plan
      
      if (!habitError && habitData && habitData.length > 0 && habitData[0].plan_id) {
        planId = habitData[0].plan_id;
      }
      
      // Then, get the plan details
      const { data: planData, error: planError } = await supabase
        .from("plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError) {
        throw planError;
      }

      if (planData) {
        setUserPlan(planData);
      }
    } catch (error: any) {
      // If error, set to basic plan
      setUserPlan({
        id: "basic",
        name: "Базовый",
        max_habits: 3,
        has_statistics: false,
        has_achievements: false,
        price: 0
      });
    }
  }, []);

  const updateStreaks = async (entries: HabitEntry[]) => {
    try {
      // Group entries by habit_id
      const entriesByHabit = {};
      entries.forEach(entry => {
        if (!entriesByHabit[entry.habit_id]) {
          entriesByHabit[entry.habit_id] = [];
        }
        entriesByHabit[entry.habit_id].push(entry);
      });

      // For each habit, calculate current streak and longest streak
      for (const habit of habits) {
        const habitEntries = entriesByHabit[habit.id] || [];
        
        // Sort entries by date (newest first)
        habitEntries.sort((a, b) => 
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        );

        // Find the most recent relapse (if any)
        const lastRelapse = habitEntries.find(entry => entry.is_relapse);
        const lastRelapseDate = lastRelapse 
          ? new Date(lastRelapse.completed_at) 
          : new Date(0); // If no relapse, use epoch time
        
        // Count current streak (days since last relapse)
        const entriesAfterRelapse = habitEntries.filter(entry => 
          !entry.is_relapse && new Date(entry.completed_at) > lastRelapseDate
        );
        
        const currentStreak = entriesAfterRelapse.length;
        
        // Find longest streak
        let longestStreak = habit.longest_streak || 0;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        
        // Update habit with new streak information
        if (habit.current_streak !== currentStreak || habit.longest_streak !== longestStreak) {
          await supabase
            .from("habits")
            .update({
              current_streak: currentStreak,
              longest_streak: longestStreak
            })
            .eq("id", habit.id);
        }
        
        // Check for achievements
        if (currentStreak > 0) {
          checkForAchievements(habit.id, currentStreak);
        }
      }
      
      // Refresh habits to get updated streak info
      fetchHabits();
    } catch (error: any) {
      console.error("Error updating streaks:", error);
    }
  };

  const checkForAchievements = async (habitId: string, currentStreak: number) => {
    if (!userPlan?.has_achievements) return;
    
    try {
      // Define milestone days for achievements
      const milestones = [1, 7, 30, 90, 180, 365];
      
      // Find the highest achieved milestone
      const milestone = milestones.find(m => currentStreak >= m && milestones.indexOf(m) === milestones.findIndex(x => currentStreak >= x));
      
      if (milestone) {
        // Define achievement type based on milestone
        let achievementType;
        switch (milestone) {
          case 1: achievementType = "first_day"; break;
          case 7: achievementType = "first_week"; break;
          case 30: achievementType = "first_month"; break;
          case 90: achievementType = "three_months"; break;
          case 180: achievementType = "six_months"; break;
          case 365: achievementType = "one_year"; break;
          default: achievementType = "custom";
        }
        
        // Check if achievement already exists
        const { data: existingAchievements, error: checkError } = await supabase
          .from("achievements")
          .select("*")
          .eq("habit_id", habitId)
          .eq("type", achievementType);
        
        if (checkError) throw checkError;
        
        // If achievement doesn't exist, create it
        if (!existingAchievements || existingAchievements.length === 0) {
          const { error: insertError } = await supabase
            .from("achievements")
            .insert({
              user_id: user?.id,
              habit_id: habitId,
              type: achievementType,
              days: milestone,
              viewed: false
            });
          
          if (insertError) throw insertError;
        }
      }
    } catch (error: any) {
      console.error("Error checking achievements:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitEntries();
      fetchUserPlan();
    }
  }, [user, fetchHabits, fetchHabitEntries, fetchUserPlan]);

  const createHabit = () => {
    setNewHabitOpen(true);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      // Check if the habit was already completed today
      const today = new Date().toISOString().split("T")[0];
      const existingEntry = habitEntries.find(
        (entry) =>
          entry.habit_id === habitId &&
          entry.completed_at.split("T")[0] === today &&
          !entry.is_relapse
      );

      if (existingEntry) {
        // Delete the entry if it exists
        const { error } = await supabase
          .from("habit_entries")
          .delete()
          .eq("id", existingEntry.id);

        if (error) throw error;

        toast({
          title: "Отметка удалена",
          description: "Отметка о выполнении привычки удалена",
        });
      } else {
        // Create a new entry if it doesn't exist
        const { error } = await supabase.from("habit_entries").insert({
          habit_id: habitId,
          completed_at: new Date().toISOString(),
          is_relapse: false
        });

        if (error) throw error;

        toast({
          title: "Привычка отмечена",
          description: "Привычка отмечена как выполненная",
        });
      }

      fetchHabitEntries();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Привычка удалена",
        description: "Привычка успешно удалена",
      });

      fetchHabits();
      fetchHabitEntries();
    } catch (error: any) {
      toast({
        title: "Ошибка удаления привычки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    return habitEntries.some(
      (entry) =>
        entry.habit_id === habitId && 
        entry.completed_at.split("T")[0] === today &&
        !entry.is_relapse
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits((habits) => {
        const oldIndex = habits.findIndex((h) => h.id === active.id);
        const newIndex = habits.findIndex((h) => h.id === over?.id);
        
        return arrayMove(habits, oldIndex, newIndex);
      });
      
      // You can also update the order in the database here if needed
    }
  };

  // Show main loader when authenticating
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center px-6 border-b">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
              LapseLess
            </span>
          </a>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <a
            href="/dashboard"
            className="flex items-center px-2 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-md"
          >
            <Calendar className="mr-3 h-5 w-5" />
            Привычки
          </a>
          <a
            href="/dashboard"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Статистика
          </a>
          <a
            href="/dashboard"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <Trophy className="mr-3 h-5 w-5" />
            Достижения
          </a>
          <a
            href="/"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <Home className="mr-3 h-5 w-5" />
            На главную
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-brand-blue mr-2" />
              <div>
                <p className="text-xs font-medium text-gray-700">Ваш тариф:</p>
                <p className="text-sm font-semibold text-brand-blue">{userPlan?.name || "Базовый"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7">
              Обновить
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="w-full justify-start text-gray-600 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
            LapseLess
          </span>
        </a>

        <Sheet
          open={showMobileMenu}
          onOpenChange={setShowMobileMenu}
        >
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  </div>
                  <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
                    LapseLess
                  </span>
                </div>
              </SheetTitle>
              <SheetDescription>
                {user?.email}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-brand-blue mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Ваш тариф:</p>
                  <p className="text-sm font-semibold text-brand-blue">{userPlan?.name || "Базовый"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Обновить
              </Button>
            </div>
            <nav className="mt-6 flex flex-col space-y-1">
              <a
                href="/dashboard"
                className="flex items-center px-2 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Привычки
              </a>
              <a
                href="/dashboard"
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Статистика
              </a>
              <a
                href="/dashboard"
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <Trophy className="mr-3 h-5 w-5" />
                Достижения
              </a>
              <a
                href="/"
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="mr-3 h-5 w-5" />
                На главную
              </a>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut();
                  setShowMobileMenu(false);
                }}
                className="justify-start text-gray-600 hover:text-red-500 hover:bg-red-50 mt-4"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Выйти
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Мои привычки</h1>
            <Button 
              onClick={createHabit}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Новая привычка
            </Button>
          </div>

          {/* Stats and Achievements Section */}
          {habits.length > 0 && (
            <>
              <Stats 
                habits={habits} 
                entries={habitEntries} 
                canViewStats={!!userPlan?.has_statistics} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ProgressCalendar 
                  habits={habits} 
                  entries={habitEntries} 
                  onEntriesChange={fetchHabitEntries}
                  canViewStats={!!userPlan?.has_statistics}
                />
                
                <Achievements 
                  habits={habits} 
                  canViewAchievements={!!userPlan?.has_achievements} 
                />
              </div>
            </>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" className="mb-4" />
              <p className="text-gray-500">Загрузка привычек...</p>
            </div>
          ) : habits.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Отслеживаемые привычки</h2>
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={habits.map(habit => habit.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habits.map((habit) => (
                      <SortableHabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={isHabitCompletedToday(habit.id)}
                        onToggleCompletion={toggleHabitCompletion}
                        onDelete={deleteHabit}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-brand-blue" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет привычек</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Создайте свою первую привычку, от которой хотите избавиться, и начните отслеживать свой прогресс
              </p>
              <Button
                onClick={createHabit}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Создать первую привычку
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile add button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button
          onClick={createHabit}
          className="h-14 w-14 rounded-full shadow-lg bg-brand-blue hover:bg-brand-blue/90"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Add Habit Form Dialog */}
      <HabitForm 
        isOpen={newHabitOpen} 
        onClose={() => setNewHabitOpen(false)} 
        onSuccess={fetchHabits}
        maxHabits={userPlan?.max_habits || 3}
        currentHabitsCount={habits.length}
      />
    </div>
  );
};

export default Dashboard;
