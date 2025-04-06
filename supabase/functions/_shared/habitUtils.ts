
import { isAfter, addDays, differenceInDays } from 'https://esm.sh/date-fns@2'

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
