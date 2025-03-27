
import React from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardHeaderProps = {
  createHabit: () => void;
  createFolder: () => void;
};

const DashboardHeader = ({ createHabit, createFolder }: DashboardHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className={`text-2xl font-bold ${isMobile ? 'mx-auto' : ''}`}>
        Мои привычки
      </h1>
      
      {!isMobile && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={createFolder}
          >
            <FolderPlus className="w-4 h-4 mr-1" />
            Создать папку
          </Button>
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={createHabit}
          >
            <FilePlus className="w-4 h-4 mr-1" />
            Добавить привычку
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
