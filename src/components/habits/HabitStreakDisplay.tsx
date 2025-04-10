import React from "react";
import { getStreakText, getTextColorClass } from "@/utils/habitUtils";

type HabitStreakDisplayProps = {
  currentStreak: number;
  habitColor: string;
};

const HabitStreakDisplay = ({ currentStreak, habitColor }: HabitStreakDisplayProps) => {
  return (
    <div className="flex items-center justify-center py-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center">
        {/* Текст текущего стрика */}
        <div
          className={`text-5xl font-bold ${getTextColorClass(habitColor)} dark:text-gray-100`}
        >
          {currentStreak}
        </div>
        {/* Подпись к стрику */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {getStreakText(currentStreak)}
        </div>
      </div>
    </div>
  );
};

export default HabitStreakDisplay;