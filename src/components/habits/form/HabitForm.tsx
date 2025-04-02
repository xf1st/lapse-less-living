
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Folder } from "@/hooks/useHabitFolders";
import { isDateInFuture } from "@/utils/habitUtils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно содержать не менее 2 символов.",
  }),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  color: z.string(),
  folder_id: z.string().nullable().optional(),
  start_date: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type HabitFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  maxHabits: number;
  currentHabitsCount: number;
  habit?: {
    id?: string;
    name?: string;
    description?: string | null;
    frequency?: string;
    color?: string;
    folder_id?: string | null;
    start_date?: string;
  };
  folders: Folder[];
};

const HabitForm = ({
  isOpen,
  onClose,
  onSuccess,
  maxHabits,
  currentHabitsCount,
  habit,
  folders
}: HabitFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Set default date to either habit start date or today
  const defaultDate = habit?.start_date 
    ? new Date(habit.start_date) 
    : new Date();
    
  const [date, setDate] = useState<Date | undefined>(defaultDate);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      frequency: (habit?.frequency as "daily" | "weekly" | "monthly") || "daily",
      color: habit?.color || "blue",
      folder_id: habit?.folder_id || null,
      start_date: habit?.start_date || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate that start date is not in the future
      if (values.start_date && isDateInFuture(values.start_date)) {
        toast({
          title: "Ошибка",
          description: "Нельзя установить дату начала в будущем",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Continue with form submission
      if (habit?.id) {
        // Update existing habit
        const { error } = await supabase
          .from("habits")
          .update({
            name: values.name,
            description: values.description,
            frequency: values.frequency,
            color: values.color,
            folder_id: values.folder_id || null,
            start_date: values.start_date
          })
          .eq("id", habit.id);

        if (error) throw error;

        toast({
          title: "Привычка обновлена",
          description: "Привычка успешно обновлена",
        });
      } else {
        // Create new habit
        if (currentHabitsCount >= maxHabits) {
          toast({
            title: "Лимит привычек достигнут",
            description: `Максимальное количество привычек для вашего тарифа: ${maxHabits}`,
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.from("habits").insert({
          name: values.name,
          description: values.description,
          frequency: values.frequency,
          color: values.color,
          user_id: user?.id,
          folder_id: values.folder_id || null,
          start_date: values.start_date
        });

        if (error) throw error;

        toast({
          title: "Привычка создана",
          description: "Новая привычка успешно создана",
        });
      }

      // Reset form and close dialog
      form.reset();
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
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
          <DialogTitle>{habit?.id ? "Редактировать привычку" : "Создать привычку"}</DialogTitle>
          <DialogDescription>
            {habit?.id ? "Измените детали вашей привычки." : "Добавьте новую привычку в свою коллекцию."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" placeholder="Название вашей привычки" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Описание</Label>
            <Input id="description" placeholder="Дополнительное описание" {...form.register("description")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Частота</Label>
            <Select 
              defaultValue={form.getValues("frequency")} 
              onValueChange={(value: "daily" | "weekly" | "monthly") => form.setValue("frequency", value)}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Выберите частоту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Ежедневно</SelectItem>
                <SelectItem value="weekly">Еженедельно</SelectItem>
                <SelectItem value="monthly">Ежемесячно</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Цвет</Label>
            <ColorPicker
              value={form.watch("color")}
              onChange={(value) => form.setValue("color", value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="folder_id">Папка</Label>
            <Select
              defaultValue={habit?.folder_id || ""}
              onValueChange={(value) => form.setValue("folder_id", value === "" ? null : value)}
            >
              <SelectTrigger id="folder_id">
                <SelectValue placeholder="Выберите папку" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Без папки</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Дата начала</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : format(new Date(), "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      form.setValue("start_date", newDate.toISOString().split('T')[0]);
                    }
                  }}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
