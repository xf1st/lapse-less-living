
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Flag } from "lucide-react";

type NextMilestoneProps = {
  streaks: { habitId: string; current: number }[];
  habitsMap: Record<string, string>;
};

const NextMilestone = ({ streaks, habitsMap }: NextMilestoneProps) => {
  // Milestones in days
  const milestones = [1, 7, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 180, 200, 300, 365];
  
  const getNextMilestone = (currentStreak: number) => {
    for (const milestone of milestones) {
      if (milestone > currentStreak) {
        return milestone;
      }
    }
    return milestones[milestones.length - 1] + 100; // Next 100 days after last milestone
  };
  
  const getProgressPercentage = (current: number, next: number) => {
    if (next <= 0) return 0;
    const previous = milestones.find(m => m < next) || 0;
    const total = next - previous;
    const progress = current - previous;
    return Math.round((progress / total) * 100);
  };
  
  // Get top 3 habits closest to next milestone
  const getTopHabits = () => {
    return streaks
      .map(streak => {
        const nextMilestone = getNextMilestone(streak.current);
        const progress = getProgressPercentage(streak.current, nextMilestone);
        return {
          habitId: streak.habitId,
          habitName: habitsMap[streak.habitId] || "Привычка",
          current: streak.current,
          next: nextMilestone,
          progress,
          daysLeft: nextMilestone - streak.current
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  };
  
  const topHabits = getTopHabits();

  if (topHabits.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {topHabits.map((habit) => (
        <Card key={habit.habitId} className="p-4 border">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-blue-50">
              {habit.next >= 100 ? (
                <Trophy className="h-5 w-5 text-yellow-500" />
              ) : habit.next >= 30 ? (
                <Star className="h-5 w-5 text-blue-500" />
              ) : (
                <Flag className="h-5 w-5 text-green-500" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-sm truncate max-w-[200px]">{habit.habitName}</h4>
                <span className="text-xs font-medium text-gray-500">
                  {habit.current} / {habit.next} дней
                </span>
              </div>
              
              <Progress value={habit.progress} className="h-2" />
              
              <p className="text-xs text-gray-500 mt-1">
                Осталось {habit.daysLeft} дн. до следующего достижения
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NextMilestone;
