
import React from "react";
import { getStreakText } from "@/utils/habitUtils";

type HabitStreakDisplayProps = {
  currentStreak: number;
};

const HabitStreakDisplay = ({ currentStreak }: HabitStreakDisplayProps) => {
  return (
    <div className="flex items-center justify-center py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="text-5xl font-bold text-brand-blue">{currentStreak}</div>
        <div className="text-sm text-gray-500 mt-1">
          {getStreakText(currentStreak)}
        </div>
      </div>
    </div>
  );
};

export default HabitStreakDisplay;
