
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Calendar,
  CheckCircle2,
  X,
  Trash2,
  Edit,
  LogOut,
  BarChart3,
  Menu,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  color: string;
  created_at: string;
};

type HabitEntry = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
};

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabitOpen, setNewHabitOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "daily",
    color: "blue",
  });
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" />;
  }

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitEntries();
    }
  }, [user]);

  const fetchHabits = async () => {
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
  };

  const fetchHabitEntries = async () => {
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
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки записей",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createHabit = async () => {
    try {
      const { error } = await supabase.from("habits").insert({
        name: formData.name,
        description: formData.description || null,
        frequency: formData.frequency,
        color: formData.color,
        user_id: user?.id,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Привычка создана",
        description: "Новая привычка успешно добавлена",
      });

      setFormData({
        name: "",
        description: "",
        frequency: "daily",
        color: "blue",
      });
      setNewHabitOpen(false);
      fetchHabits();
    } catch (error: any) {
      toast({
        title: "Ошибка создания привычки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      // Check if the habit was already completed today
      const today = new Date().toISOString().split("T")[0];
      const existingEntry = habitEntries.find(
        (entry) =>
          entry.habit_id === habitId &&
          entry.completed_at.split("T")[0] === today
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
        entry.habit_id === habitId && entry.completed_at.split("T")[0] === today
    );
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      case "purple":
        return "bg-purple-500";
      case "yellow":
        return "bg-yellow-500";
      case "indigo":
        return "bg-indigo-500";
      case "pink":
        return "bg-pink-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Ежедневно";
      case "weekly":
        return "Еженедельно";
      case "monthly":
        return "Ежемесячно";
      default:
        return frequency;
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
            href="/"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <Home className="mr-3 h-5 w-5" />
            На главную
          </a>
        </nav>
        <div className="border-t border-gray-200 p-4">
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
            <Dialog open={newHabitOpen} onOpenChange={setNewHabitOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-blue hover:bg-brand-blue/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Новая привычка
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новую привычку</DialogTitle>
                  <DialogDescription>
                    Добавьте привычку, от которой хотите избавиться
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="habit-name">Название привычки</Label>
                    <Input
                      id="habit-name"
                      placeholder="Напр., Курение"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-description">Описание (опционально)</Label>
                    <Textarea
                      id="habit-description"
                      placeholder="Опишите привычку подробнее"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="habit-frequency">Частота</Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            frequency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите частоту" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Ежедневно</SelectItem>
                          <SelectItem value="weekly">Еженедельно</SelectItem>
                          <SelectItem value="monthly">Ежемесячно</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="habit-color">Цвет</Label>
                      <Select
                        value={formData.color}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            color: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите цвет" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Синий</SelectItem>
                          <SelectItem value="green">Зеленый</SelectItem>
                          <SelectItem value="red">Красный</SelectItem>
                          <SelectItem value="purple">Фиолетовый</SelectItem>
                          <SelectItem value="yellow">Желтый</SelectItem>
                          <SelectItem value="indigo">Индиго</SelectItem>
                          <SelectItem value="pink">Розовый</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setNewHabitOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button onClick={createHabit} className="bg-brand-blue hover:bg-brand-blue/90">
                    Создать
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" className="mb-4" />
              <p className="text-gray-500">Загрузка привычек...</p>
            </div>
          ) : habits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => (
                <Card key={habit.id} className="shadow-sm border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-4 h-4 rounded-full", getColorClass(habit.color))}></div>
                      <CardTitle className="text-xl">{habit.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {formatFrequency(habit.frequency)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {habit.description && <p className="text-gray-600">{habit.description}</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant={isHabitCompletedToday(habit.id) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleHabitCompletion(habit.id)}
                    >
                      {isHabitCompletedToday(habit.id) ? (
                        <>
                          <X className="mr-1 h-4 w-4" />
                          Сбросить
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Отметить
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
                onClick={() => setNewHabitOpen(true)}
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
          onClick={() => setNewHabitOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-brand-blue hover:bg-brand-blue/90"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
