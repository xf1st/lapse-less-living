
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const getColorClass = (color: string) => {
  switch (color) {
    case "blue": return "bg-blue-500";
    case "green": return "bg-green-500";
    case "red": return "bg-red-500";
    case "purple": return "bg-purple-500";
    case "yellow": return "bg-yellow-500";
    case "indigo": return "bg-indigo-500";
    case "pink": return "bg-pink-500";
    default: return "bg-blue-500";
  }
};

export const formatFrequency = (frequency: string) => {
  switch (frequency) {
    case "daily": return "Ежедневно";
    case "weekly": return "Еженедельно";
    case "monthly": return "Ежемесячно";
    default: return frequency;
  }
};

export const formatStartDate = (dateString: string) => {
  if (!dateString) return "Нет данных";
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ru });
  } catch (error) {
    return "Неверная дата";
  }
};

export const getStreakText = (count: number) => {
  if (count === 1) return "день";
  if (count > 1 && count < 5) return "дня";
  return "дней";
};
