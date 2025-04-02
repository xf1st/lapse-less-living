
import { format, differenceInDays, isFuture, isToday, addDays, isAfter } from "date-fns";
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

// Calculate current streak based on start date and last relapse date
export const calculateCurrentStreak = (startDate: string, lastRelapseDate: string | null): number => {
  if (!startDate) return 0;
  
  try {
    // Parse dates and remove time component
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If start date is in the future, streak is 0
    if (isAfter(startDateObj, today)) {
      return 0;
    }
    
    // If there was a relapse, calculate from the day after the relapse
    if (lastRelapseDate) {
      const relapseDate = new Date(lastRelapseDate);
      relapseDate.setHours(0, 0, 0, 0);
      
      // If relapse is after the start date
      if (isAfter(relapseDate, startDateObj) || relapseDate.getTime() === startDateObj.getTime()) {
        // Add one day to relapse date for streak calculation
        const dayAfterRelapse = addDays(relapseDate, 1);
        
        // If the day after relapse is in the future, streak is 0
        if (isAfter(dayAfterRelapse, today)) {
          return 0;
        }
        
        // Calculate days from day after relapse to today (inclusive)
        return differenceInDays(today, dayAfterRelapse) + 1;
      }
    }
    
    // No relapse or relapse before start date, calculate from start date
    return differenceInDays(today, startDateObj) + 1;
  } catch (error) {
    console.error("Error calculating current streak:", error);
    return 0;
  }
};

// Check if a date is in the future
export const isDateInFuture = (dateString: string): boolean => {
  try {
    const dateObj = new Date(dateString);
    const today = new Date();
    
    // Compare dates without time component
    dateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return isAfter(dateObj, today);
  } catch (error) {
    console.error("Error checking future date:", error);
    return false;
  }
};
