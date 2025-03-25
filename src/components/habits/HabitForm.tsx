
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder } from "./FolderCard";
import { Habit } from "./HabitCard";

type HabitFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  maxHabits: number;
  currentHabitsCount: number;
  habit?: Habit | null;
  folders?: Folder[];
};

const HabitForm = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  maxHabits, 
  currentHabitsCount,
  habit,
  folders = []
}: HabitFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [color, setColor] = useState("blue");
  const [folderId, setFolderId] = useState<string | null>(null);

  const isEditing = !!habit?.id;

  useEffect(() => {
    if (habit) {
      setName(habit.name || "");
      setDescription(habit.description || "");
      setFrequency(habit.frequency || "daily");
      setColor(habit.color || "blue");
      setFolderId(habit.folder_id || null);
    } else {
      // Reset form
      setName("");
      setDescription("");
      setFrequency("daily");
      setColor("blue");
      setFolderId(null);
    }
  }, [habit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && currentHabitsCount >= maxHabits) {
      toast({
        title: "Лимит привычек",
        description: `Ваш тариф позволяет создать максимум ${maxHabits} привычек. Обновите тариф для добавления большего количества привычек.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название привычки не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing) {
        // Update existing habit
        const { error } = await supabase
          .from("habits")
          .update({
            name,
            description,
            frequency,
            color,
            folder_id: folderId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", habit.id);

        if (error) throw error;

        toast({
          title: "Привычка обновлена",
          description: "Привычка успешно обновлена",
        });
      } else {
        // Create new habit
        const { error } = await supabase.from("habits").insert({
          name,
          description,
          frequency,
          color,
          folder_id: folderId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

        if (error) throw error;

        toast({
          title: "Привычка создана",
          description: "Новая привычка успешно создана",
        });
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редактировать привычку" : "Создать новую привычку"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Измените детали привычки, от которой хотите избавиться"
              : "Создайте новую привычку, от которой хотите избавиться"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Например: Курение"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Дополнительная информация о привычке"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder" className="text-right">
                Папка
              </Label>
              <Select
                value={folderId || "none"}
                onValueChange={(value) => setFolderId(value === "none" ? null : value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Без папки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без папки</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Периодичность
              </Label>
              <RadioGroup
                value={frequency}
                onValueChange={setFrequency}
                className="grid grid-cols-3 col-span-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Ежедневно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Еженедельно</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Ежемесячно</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Цвет</Label>
              <RadioGroup
                value={color}
                onValueChange={setColor}
                className="flex flex-wrap gap-2 col-span-3"
              >
                {["blue", "green", "red", "purple", "yellow", "indigo", "pink"].map(
                  (colorOption) => (
                    <div key={colorOption} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={colorOption}
                        id={`color-${colorOption}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`color-${colorOption}`}
                        className={cn(
                          "h-8 w-8 rounded-full cursor-pointer ring-offset-background transition-all",
                          `bg-${colorOption}-500`,
                          color === colorOption
                            ? "ring-2 ring-ring ring-offset-2"
                            : "hover:ring-2 hover:ring-ring hover:ring-offset-1"
                        )}
                      />
                    </div>
                  )
                )}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
