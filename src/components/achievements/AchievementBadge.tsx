import React from "react";
import { Award, Star, Trophy, Flag, Check } from "lucide-react";

type AchievementBadgeProps = {
  achievement: {
    id: string;
    type: string;
    days: number;
    achieved_at: string;
  };
  habit: {
    id: string;
    name: string;
  };
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, habit }) => {
  const getIcon = () => {
    switch (achievement.type) {
      case "first_day":
        return <Check className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case "first_week":
        return <Star className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      case "first_month":
        return <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "three_months":
        return <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case "six_months":
        return <Trophy className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "one_year":
        return <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      default:
        if (achievement.type.startsWith("days_")) {
          return <Flag className="h-5 w-5 text-teal-500 dark:text-teal-400" />;
        }
        return <Award className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getBadgeStyle = () => {
    switch (achievement.type) {
      case "first_day":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "first_week":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "first_month":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "three_months":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "six_months":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "one_year":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`rounded-full p-2 ${getBadgeStyle()}`}>{getIcon()}</div>
      <div>
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {habit?.name || "Привычка"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {achievement.days} дней подряд
        </p>
      </div>
    </div>
  );
};

export default AchievementBadge;