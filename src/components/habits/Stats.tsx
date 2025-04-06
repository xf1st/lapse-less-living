
import { useMemo } from "react";
import { format, differenceInDays, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  BarChart3, 
  Calendar, 
  Flame,
  Trophy,
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { HabitType as Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

type HabitEntry = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
};

type StatsProps = {
  habits: Habit[];
  entries: HabitEntry[];
  canViewStats: boolean;
};

const Stats = ({ habits, entries, canViewStats }: StatsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const statsData = useMemo(() => {
    if (!canViewStats) return null;
    
    // Count total habits
    const totalHabits = habits.length;
    
    // Count successful days (days with at least one completed habit and no relapses)
    const successfulDays = new Set();
    const relapseDays = new Set();
    
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.completed_at), "yyyy-MM-dd");
      if (entry.is_relapse) {
        relapseDays.add(dateStr);
      } else {
        successfulDays.add(dateStr);
      }
    });
    
    // Get longest streak from habits
    const longestStreak = Math.max(...habits.map(h => h.longest_streak), 0);
    
    // Get current streak from habits
    const currentStreak = Math.max(...habits.map(h => h.current_streak), 0);
    
    // Prepare weekly data
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfCurrentWeek);
      date.setDate(startOfCurrentWeek.getDate() + i);
      const dateStr = format(date, "yyyy-MM-dd");
      
      const dayEntries = entries.filter(entry => {
        const entryDateStr = format(new Date(entry.completed_at), "yyyy-MM-dd");
        return entryDateStr === dateStr && !entry.is_relapse;
      });
      
      const relapseEntries = entries.filter(entry => {
        const entryDateStr = format(new Date(entry.completed_at), "yyyy-MM-dd");
        return entryDateStr === dateStr && entry.is_relapse;
      });
      
      return {
        day: format(date, "EEE", { locale: ru }),
        completed: dayEntries.length,
        relapses: relapseEntries.length,
        date: dateStr,
      };
    });
    
    return {
      totalHabits,
      successfulDays: successfulDays.size,
      relapseDays: relapseDays.size,
      longestStreak,
      currentStreak,
      weekData,
    };
  }, [habits, entries, canViewStats]);

  if (!canViewStats) {
    return (
      <Card className="bg-gray-50 border dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Функция доступна в Премиум-тарифе</h3>
            <p className="text-gray-600 dark:text-gray-400">Обновите свой план, чтобы получить доступ к расширенной статистике и аналитике вашего прогресса.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statsData || habits.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white border dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Текущий стрик</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-brand-blue dark:text-blue-400">
                {statsData.currentStreak} {statsData.currentStreak === 1 ? "день" : "дней"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">без срывов</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Flame className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Лучший результат</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {statsData.longestStreak} {statsData.longestStreak === 1 ? "день" : "дней"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">максимальный стрик</div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Всего срывов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-500 dark:text-red-400">
                {statsData.relapseDays}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">дней со срывами</div>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border dark:bg-gray-800 dark:border-gray-700 md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Активность за неделю</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full md:h-80">
            <ChartContainer
              config={{
                completed: {
                  label: "Выполнено",
                  color: isDark ? "#818cf8" : "#4F46E5"
                },
                relapses: {
                  label: "Срывы",
                  color: isDark ? "#f87171" : "#EF4444"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={statsData.weekData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false}
                    fontSize={12}
                    stroke={isDark ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    width={30}
                    fontSize={12}
                    stroke={isDark ? "#9ca3af" : "#6b7280"}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      
                      const data = payload[0]?.payload;
                      const dateStr = data?.date;
                      const date = dateStr ? parseISO(dateStr) : null;
                      
                      return (
                        <ChartTooltipContent
                          className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}
                          label={date ? format(date, "d MMMM", { locale: ru }) : ""}
                        />
                      );
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    name="Выполнено" 
                    fill="var(--color-completed)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="relapses" 
                    name="Срывы" 
                    fill="var(--color-relapses)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
