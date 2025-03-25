
import React, { useState } from "react";
import { 
  Folder, 
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Habit } from "./HabitCard";
import { SortableHabitCard } from "./SortableHabitCard";

export type Folder = {
  id: string;
  name: string;
  color: string;
};

type FolderCardProps = {
  folder: Folder;
  habits: Habit[];
  isCompleted: (habitId: string) => boolean;
  onToggleCompletion?: (habitId: string) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onEditHabit: (habit: Habit) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => Promise<void>;
  onAddHabit: (folderId: string) => void;
};

const FolderCard = ({ 
  folder, 
  habits,
  isCompleted,
  onToggleCompletion,
  onDeleteHabit,
  onEditHabit,
  onEditFolder,
  onDeleteFolder,
  onAddHabit
}: FolderCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const getFolderColorClass = (color: string) => {
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

  return (
    <Card className="shadow-sm border hover:shadow-md transition-shadow mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 cursor-pointer">
            <div className="flex items-center space-x-2">
              {isOpen ? (
                <FolderOpen className={cn("h-5 w-5", getFolderColorClass(folder.color))} />
              ) : (
                <Folder className={cn("h-5 w-5", getFolderColorClass(folder.color))} />
              )}
              <h3 className="text-lg font-medium">{folder.name}</h3>
              <span className="text-xs text-gray-500 ml-2">
                ({habits.length})
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddHabit(folder.id);
                }}
              >
                <Plus className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFolder(folder);
                }}
              >
                <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </Button>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {habits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map((habit) => (
                  <SortableHabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={isCompleted(habit.id)}
                    onToggleCompletion={onToggleCompletion}
                    onDelete={onDeleteHabit}
                    onEdit={onEditHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                В этой папке еще нет привычек
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FolderCard;
