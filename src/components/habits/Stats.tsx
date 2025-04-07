
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
      
      // Count all non-relapse entries for this day
      const completed = habitEntries.filter(
        entry => 
          entry.completed_at.startsWith(dateStr) && 
          !entry.is_relapse
      ).length;
      
      // Count all relapse entries for this day
      const relapses = habitEntries.filter(
        entry => 
          entry.completed_at.startsWith(dateStr) && 
          entry.is_relapse
      ).length;
      
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
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
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
