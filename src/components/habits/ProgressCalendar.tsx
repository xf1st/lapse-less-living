
import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HabitType as Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

type HabitEntry = {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  is_relapse: boolean;
};

type ProgressCalendarProps = {
  habits: Habit[];
  entries: HabitEntry[];
  onEntriesChange: () => void;
  canViewStats: boolean;
};

const ProgressCalendar = ({ habits, entries, onEntriesChange, canViewStats }: ProgressCalendarProps) => {
  const { toast } = useToast();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(habits[0]?.id || null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);

  useEffect(() => {
    if (habits.length > 0 && !selectedHabit) {
      setSelectedHabit(habits[0].id);
    }
  }, [habits, selectedHabit]);

  useEffect(() => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    setDays(daysInMonth);
  }, [currentMonth]);

  useEffect(() => {
    if (selectedHabit) {
      const filteredEntries = entries.filter(entry => entry.habit_id === selectedHabit);
      setHabitEntries(filteredEntries);
    } else {
      setHabitEntries([]);
    }
  }, [selectedHabit, entries]);

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const handleDayClick = async (day: Date) => {
    if (!selectedHabit) return;

    try {
      // Check if there's already an entry for this day
      const dateStr = format(day, "yyyy-MM-dd");
      const existingEntry = habitEntries.find(entry => {
        const entryDate = format(new Date(entry.completed_at), "yyyy-MM-dd");
        return entryDate === dateStr;
      });

      if (existingEntry) {
        // Delete the entry
        const { error } = await supabase
          .from("habit_entries")
          .delete()
          .eq("id", existingEntry.id);

        if (error) throw error;

        toast({
          title: "Отметка удалена",
          description: `Отметка за ${format(day, "d MMMM", { locale: ru })} удалена`,
        });
      } else {
        // Create a new entry
        const { error } = await supabase
          .from("habit_entries")
          .insert({
            habit_id: selectedHabit,
            completed_at: day.toISOString(),
          });

        if (error) throw error;

        toast({
          title: "День отмечен",
          description: `${format(day, "d MMMM", { locale: ru })} отмечен как успешный`,
        });
      }

      // Refresh entries
      onEntriesChange();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDayStatus = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    
    const entry = habitEntries.find(entry => {
      const entryDate = format(new Date(entry.completed_at), "yyyy-MM-dd");
      return entryDate === dateStr;
    });

    if (!entry) return "empty";
    if (entry.is_relapse) return "relapse";
    return "completed";
  };

  if (!canViewStats) {
    return (
      <Card className="bg-gray-50 border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Календарь прогресса</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Функция доступна в Премиум-тарифе</h3>
            <p className="text-gray-600 mb-4">Обновите свой план, чтобы получить доступ к расширенной статистике и календарю прогресса.</p>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              Обновить тариф
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (habits.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Календарь прогресса</CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentMonth, "LLLL yyyy", { locale: ru })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={selectedHabit || "none"}
            onValueChange={(value) => setSelectedHabit(value === "none" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите привычку" />
            </SelectTrigger>
            <SelectContent>
              {habits.map(habit => (
                <SelectItem key={habit.id} value={habit.id}>
                  {habit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, i) => (
            <div key={i} className="text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {days.map((day, i) => {
            const status = getDayStatus(day);
            const dayNum = day.getDate();
            const offset = day.getDay() === 0 ? 6 : day.getDay() - 1; // Adjust for Monday start
            
            // Apply offset only to the first week
            const hasOffset = i < 7 && offset > 0;
            
            return (
              <React.Fragment key={day.toISOString()}>
                {hasOffset && i === 0 && Array.from({ length: offset }).map((_, j) => (
                  <div key={`empty-${j}`} className="h-8"></div>
                ))}
                <button
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "h-8 w-full rounded-md flex items-center justify-center text-xs font-medium transition-colors",
                    {
                      "bg-green-100 text-green-800 hover:bg-green-200": status === "completed",
                      "bg-red-100 text-red-800 hover:bg-red-200": status === "relapse",
                      "hover:bg-gray-100": status === "empty",
                      "bg-blue-50": isSameDay(day, new Date()),
                    }
                  )}
                >
                  {dayNum}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded-sm mr-1"></div>
            <span>Успешно</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-sm mr-1"></div>
            <span>Срыв</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-50 rounded-sm mr-1"></div>
            <span>Сегодня</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCalendar;
