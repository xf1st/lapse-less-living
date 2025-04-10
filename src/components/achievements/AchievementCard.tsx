import React from "react";
import { Card } from "@/components/ui/card";
import { Award, Star, Trophy, Flag, Calendar, Check } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";

type Achievement = {
  id: string;
  user_id: string;
  habit_id: string;
  type: string;
  days: number;
  achieved_at: string;
  viewed: boolean;
  achievement_number: number;
  habit_name?: string;
};

type AchievementCardProps = {
  achievement: Achievement;
};

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const getAchievementIcon = () => {
    switch (achievement.type) {
      case "first_day":
        return <Check className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case "first_week":
        return <Star className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case "first_month":
        return <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case "three_months":
        return <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
      case "six_months":
        return <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
      case "one_year":
        return <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />;
      default:
        if (achievement.type.startsWith("days_")) {
          return <Flag className="h-6 w-6 text-green-500 dark:text-green-400" />;
        }
        return <Award className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getAchievementTitle = () => {
    switch (achievement.type) {
      case "first_day":
        return "Первый день";
      case "first_week":
        return "Первая неделя";
      case "first_month":
        return "Первый месяц";
      case "three_months":
        return "3 месяца";
      case "six_months":
        return "6 месяцев";
      case "one_year":
        return "1 год";
      default:
        if (achievement.type.startsWith("days_")) {
          const days = achievement.days;
          return `${days} дней`;
        }
        return "Достижение";
    }
  };

  const getAchievementDescription = () => {
    const habitName = achievement.habit_name || "привычки";
    return `Вы соблюдали "${habitName}" в течение ${achievement.days} дней.`;
  };

  const achievedDate = new Date(achievement.achieved_at);
  const achievedTimeAgo = formatDistanceToNow(achievedDate, {
    addSuffix: true,
    locale: ru,
  });

  return (
    <Card className="flex items-center p-4 bg-white dark:bg-gray-800 border hover:shadow-md transition-shadow">
      <div className="mr-4 flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center">
        {getAchievementIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base truncate text-gray-900 dark:text-gray-100">
          {getAchievementTitle()}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {getAchievementDescription()}
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-400 dark:text-gray-500">
          <Calendar className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
          <span title={format(achievedDate, "PPP", { locale: ru })}>
            {achievedTimeAgo}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AchievementCard;