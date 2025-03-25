
import React from "react";
import { PlusCircle, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  createHabit: () => void;
  createFolder: () => void;
};

const DashboardHeader = ({ createHabit, createFolder }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Мои привычки</h1>
      <div className="flex gap-2">
        <Button 
          onClick={createFolder}
          variant="outline"
          className="border-brand-blue text-brand-blue"
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Новая папка
        </Button>
        <Button 
          onClick={createHabit}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Новая привычка
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
