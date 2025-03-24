
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Trophy, Gift, Award, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "./HabitCard";
import { cn } from "@/lib/utils";

type Achievement = {
  id: string;
  user_id: string;
  habit_id: string;
  type: string;
  days: number;
  achieved_at: string;
  viewed: boolean;
};

type AchievementsProps = {
  habits: Habit[];
  canViewAchievements: boolean;
};

const achievementMilestones = [
  { days: 1, type: "first_day", title: "Первый день", description: "Вы отметили свой первый день без привычки!" },
  { days: 7, type: "first_week", title: "Первая неделя", description: "Целая неделя без срывов!" },
  { days: 30, type: "first_month", title: "Первый месяц", description: "Целый месяц стойкости!" },
  { days: 90, type: "three_months", title: "Три месяца", description: "Квартал без вредной привычки!" },
  { days: 180, type: "six_months", title: "Полгода", description: "Полгода успеха!" },
  { days: 365, type: "one_year", title: "Один год", description: "Целый год без привычки! Невероятное достижение!" },
];

const Achievements = ({ habits, canViewAchievements }: AchievementsProps) => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (canViewAchievements) {
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [canViewAchievements]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("achieved_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setAchievements(data);
        
        // Check for unviewed achievements
        const unviewed = data.find(a => !a.viewed);
        if (unviewed) {
          setNewAchievement(unviewed);
          setShowDialog(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки достижений",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAchievementAsViewed = async () => {
    if (!newAchievement) return;
    
    try {
      const { error } = await supabase
        .from("achievements")
        .update({ viewed: true })
        .eq("id", newAchievement.id);

      if (error) throw error;
      
      setShowDialog(false);
      fetchAchievements();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "first_day":
        return <CheckCircle2 className="h-10 w-10 text-green-500" />;
      case "first_week":
        return <Clock className="h-10 w-10 text-blue-500" />;
      case "first_month":
      case "three_months":
        return <Award className="h-10 w-10 text-purple-500" />;
      case "six_months":
        return <Gift className="h-10 w-10 text-pink-500" />;
      case "one_year":
        return <Trophy className="h-10 w-10 text-amber-500" />;
      default:
        return <Award className="h-10 w-10 text-gray-500" />;
    }
  };

  const getAchievementDetails = (type: string, days: number) => {
    return achievementMilestones.find(m => m.type === type) || {
      days,
      type,
      title: `${days} дней`,
      description: `Вы продержались ${days} дней без привычки!`
    };
  };

  const getHabitName = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.name : "Привычка";
  };

  if (!canViewAchievements) {
    return (
      <Card className="bg-gray-50 border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Функция доступна в Премиум-тарифе</h3>
            <p className="text-gray-600">Обновите свой план, чтобы разблокировать систему достижений и отслеживать свой прогресс.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <div className="h-10 w-10 rounded-full border-4 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка достижений...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="bg-white border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Еще нет достижений</h3>
            <p className="text-gray-600">Продолжайте отслеживать свои привычки, и вы получите достижения за свой прогресс.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement) => {
              const achievementDetails = getAchievementDetails(achievement.type, achievement.days);
              
              return (
                <div 
                  key={achievement.id} 
                  className={cn(
                    "p-4 border rounded-lg flex items-center space-x-4 transition-all duration-300 hover:shadow-md",
                    achievement.viewed ? "bg-white" : "bg-amber-50"
                  )}
                >
                  <div className="flex-shrink-0">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {achievementDetails.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {getHabitName(achievement.habit_id)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(achievement.achieved_at), "d MMMM yyyy", { locale: ru })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {achievements.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" className="text-brand-blue">
                Показать все ({achievements.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              🎉 Новое достижение!
            </DialogTitle>
          </DialogHeader>
          
          {newAchievement && (
            <div className="py-4">
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4 animate-pulse">
                  {getAchievementIcon(newAchievement.type)}
                </div>
                
                <h3 className="text-xl font-bold text-center mb-2">
                  {getAchievementDetails(newAchievement.type, newAchievement.days).title}
                </h3>
                
                <p className="text-center text-gray-600 mb-2">
                  {getAchievementDetails(newAchievement.type, newAchievement.days).description}
                </p>
                
                <p className="text-center text-brand-blue font-medium">
                  {getHabitName(newAchievement.habit_id)}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={markAchievementAsViewed} 
              className="w-full bg-brand-blue hover:bg-brand-blue/90"
            >
              Отлично!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Achievements;
