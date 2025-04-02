
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
import { HabitType } from "@/types/habit";
import HabitList from "./HabitList";

export type Folder = {
  id: string;
  name: string;
  color: string;
  user_id: string;
};

type FolderCardProps = {
  folder: Folder;
  habits?: HabitType[];
  onEdit?: (folder: Folder) => void;
  onDelete?: (folderId: string) => Promise<void>;
  onAddHabit?: (folderId?: string) => void;
};

const FolderCard = ({ 
  folder, 
  habits = [],
  onEdit,
  onDelete,
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
                  if (onAddHabit) onAddHabit(folder.id);
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
                  if (onEdit) onEdit(folder);
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
                  if (onDelete) onDelete(folder.id);
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
              <HabitList 
                habits={habits}
                isHabitCompletedToday={(id) => false}
                onDeleteHabit={() => Promise.resolve()}
                getLastRelapseDate={() => null}
              />
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
