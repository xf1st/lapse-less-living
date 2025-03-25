
import React from "react";
import { Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyHabitStateProps = {
  createHabit: () => void;
};

const EmptyHabitState = ({ createHabit }: EmptyHabitStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Calendar className="h-12 w-12 text-brand-blue" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Нет привычек</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Создайте свою первую привычку, от которой хотите избавиться, и начните отслеживать свой прогресс
      </p>
      <Button
        onClick={createHabit}
        className="bg-brand-blue hover:bg-brand-blue/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Создать первую привычку
      </Button>
    </div>
  );
};

export default EmptyHabitState;
