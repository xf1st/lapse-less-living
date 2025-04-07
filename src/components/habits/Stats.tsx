
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitType } from "@/types/habit";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { startOfWeek, eachDayOfInterval, addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTheme } from "@/hooks/useTheme";

type StatsProps = {
  habits: HabitType[];
  habitEntries: any[];
};

const Stats = ({ habits, habitEntries }: StatsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate total metrics
  const totalStats = useMemo(() => {
    const currentStreaks = habits.map(h => h.current_streak || 0);
    const longestStreaks = habits.map(h => h.longest_streak || 0);
    
    const currentStreak = currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0;
    const longestStreak = longestStreaks.length > 0 ? Math.max(...longestStreaks) : 0;
    
    // Count relapse entries
    const relapseCount = habitEntries && Array.isArray(habitEntries) 
      ? habitEntries.filter(entry => entry.is_relapse).length
      : 0;
    
    return {
      currentStreak,
      longestStreak,
      relapseCount
    };
  }, [habits, habitEntries]);
  
  const weeklyData = useMemo(() => {
    // Get start of this week
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Create an array for each day of the week
    const days = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6)
    });
    
    // Count completed habits for each day
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayName = format(day, 'E', { locale: ru });
      
      // Check if habitEntries exists and is an array before using filter
      const completed = habitEntries && Array.isArray(habitEntries) 
        ? habitEntries.filter(
            entry => 
              entry.completed_at.startsWith(dateStr) && 
              !entry.is_relapse
          ).length
        : 0;
      
      // Check if habitEntries exists and is an array before using filter
      const relapses = habitEntries && Array.isArray(habitEntries)
        ? habitEntries.filter(
            entry => 
              entry.completed_at.startsWith(dateStr) && 
              entry.is_relapse
          ).length
        : 0;
      
      return {
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        completed,
        relapses,
        date: dateStr,
        isToday: format(new Date(), 'yyyy-MM-dd') === dateStr
      };
    });
  }, [habitEntries]);

  return (
    <Card className="border dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Активность за неделю</CardTitle>
      </CardHeader>
      
      {/* Streak summary stats */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-y">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{totalStats.currentStreak}</div>
          <div className="text-xs text-gray-500">дней текущий стрик</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{totalStats.longestStreak}</div>
          <div className="text-xs text-gray-500">дней максимальный стрик</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{totalStats.relapseCount}</div>
          <div className="text-xs text-gray-500">дней со срывами</div>
        </div>
      </div>
      
      <CardContent>
        <div className="h-[250px] sm:h-[300px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#444" : "#eee"} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: isDark ? '#ccc' : '#888' }}
                axisLine={{ stroke: isDark ? '#555' : '#ddd' }}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fill: isDark ? '#ccc' : '#888' }}
                axisLine={{ stroke: isDark ? '#555' : '#ddd' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#333',
                  border: `1px solid ${isDark ? '#555' : '#ddd'}`
                }}
              />
              <Bar dataKey="completed" name="Выполнено" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isToday ? '#3b82f6' : isDark ? '#4b6bfb60' : '#93c5fd'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;
