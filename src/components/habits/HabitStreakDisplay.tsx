
import React from "react";
import { getStreakText, getTextColorClass } from "@/utils/habitUtils";

type HabitStreakDisplayProps = {
  currentStreak: number;
  habitColor: string;
};

const HabitStreakDisplay = ({ currentStreak, habitColor }: HabitStreakDisplayProps) => {
  return (
    <div className="flex items-center justify-center py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className={`text-5xl font-bold ${getTextColorClass(habitColor)}`}>
          {currentStreak}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {getStreakText(currentStreak)}
        </div>
      </div>
    </div>
  );
};

export default HabitStreakDisplay;
