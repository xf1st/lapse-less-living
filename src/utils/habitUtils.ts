
import { format, differenceInDays, isFuture, isToday, parseISO } from "date-fns";
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

export const getTextColorClass = (color: string) => {
  switch (color) {
    case "blue": return "text-blue-500";
    case "green": return "text-green-500";
    case "red": return "text-red-500";
    case "purple": return "text-purple-500";
    case "yellow": return "text-yellow-500";
    case "indigo": return "text-indigo-500";
    case "pink": return "text-pink-500";
    default: return "text-blue-500";
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

export const calculateDaysSinceStart = (startDate: string) => {
  if (!startDate) return 0;
  
  try {
    const start = new Date(startDate);
    const today = new Date();
    
    // If the start date is in the future, return 0
    if (isFuture(start)) {
      return 0;
    }
    
    // Reset time parts for accurate comparison
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // For today's date, count as 1 day
    if (isToday(start)) {
      return 1;
    }
    
    // Calculate days between dates (add 1 to include today)
    const daysDifference = differenceInDays(today, start) + 1;
    
    return daysDifference > 0 ? daysDifference : 0;
  } catch (error) {
    console.error("Error calculating days since start:", error);
    return 0;
  }
};

export const isDateInFuture = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return isFuture(date);
  } catch (error) {
    console.error("Error checking future date:", error);
    return false;
  }
};

export const getCurrentStreak = (
  startDate: string,
  lastRelapseDate: string | null
): number => {
  if (!startDate) return 0;
  
  try {
    const start = new Date(startDate);
    const today = new Date();
    
    // Reset time parts for accurate comparison
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // If the start date is in the future, streak is 0
    if (isFuture(start)) {
      return 0;
    }
    
    if (lastRelapseDate) {
      const relapseDate = new Date(lastRelapseDate);
      relapseDate.setHours(0, 0, 0, 0);
      
      // If relapse is after the start date
      if (relapseDate >= start) {
        // Calculate streak from the day after the relapse
        const dayAfterRelapse = new Date(relapseDate);
        dayAfterRelapse.setDate(dayAfterRelapse.getDate() + 1);
        
        if (dayAfterRelapse <= today) {
          return differenceInDays(today, dayAfterRelapse) + 1;
        }
        return 0;
      }
    }
    
    // No relapse or relapse before start date, calculate from start date
    if (isToday(start)) {
      return 1;
    }
    
    return differenceInDays(today, start) + 1;
  } catch (error) {
    console.error("Error calculating current streak:", error);
    return 0;
  }
};
