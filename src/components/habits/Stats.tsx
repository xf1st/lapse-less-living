import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { startOfWeek, eachDayOfInterval, addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTheme } from "@/hooks/useTheme";
import { HabitType } from "@/types/habit";

type StatsProps = {
  habits: HabitType[];
  habitEntries: any[];
};

const Stats = ({ habits, habitEntries }: StatsProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate total metrics
  const totalStats = useMemo(() => {
    const currentStreaks = habits.map((h) => h.current_streak || 0);
    const longestStreaks = habits.map((h) => h.longest_streak || 0);

    const currentStreak =
      currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0;
    const longestStreak =
      longestStreaks.length > 0 ? Math.max(...longestStreaks) : 0;

    const relapseCount = habitEntries.filter((entry) => entry.is_relapse).length;

    return { currentStreak, longestStreak, relapseCount };
  }, [habits, habitEntries]);

  // Weekly data for the bar chart
  const weeklyData = useMemo(() => {
    const startOfWeekDate = startOfWeek(new Date(), { locale: ru });
    return Array.from({ length: 7 }).map((_, index) => {
      const day = addDays(startOfWeekDate, index);
      const dateStr = format(day, "yyyy-MM-dd");
      const dayName = format(day, "EEEE", { locale: ru });

      const completed = habitEntries.filter(
        (entry) => entry.completed_at.startsWith(dateStr) && !entry.is_relapse
      ).length;

      const relapses = habitEntries.filter(
        (entry) => entry.completed_at.startsWith(dateStr) && entry.is_relapse
      ).length;

      return {
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        completed,
        relapses,
        date: dateStr,
        isToday: format(new Date(), "yyyy-MM-dd") === dateStr,
      };
    });
  }, [habitEntries]);

  return (
    <Card className="border dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          Активность за неделю
        </CardTitle>
      </CardHeader>

      {/* Streak summary stats */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-y dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {totalStats.currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            дней текущий стрик
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {totalStats.longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            дней максимальный стрик
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {totalStats.relapseCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            дней со срывами
          </div>
        </div>
      </div>

      <CardContent>
        <div className="h-[250px] sm:h-[300px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 0, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#555" : "#ddd"} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#fff" : "#333" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#fff" : "#333" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  borderColor: isDark ? "#555" : "#ddd",
                }}
                itemStyle={{ color: isDark ? "#fff" : "#333" }}
              />
              <Bar
                dataKey="completed"
                name="Выполнено"
                radius={[4, 4, 0, 0]}
              >
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isToday
                        ? "#3b82f6"
                        : isDark
                        ? "#4b6bfb60"
                        : "#93c5fd"
                    }
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