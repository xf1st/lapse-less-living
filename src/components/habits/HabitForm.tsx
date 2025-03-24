
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type HabitFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  maxHabits: number;
  currentHabitsCount: number;
};

const HabitForm = ({ isOpen, onClose, onSuccess, maxHabits, currentHabitsCount }: HabitFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "daily",
    color: "blue",
    start_date: new Date(),
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название привычки",
        variant: "destructive",
      });
      return;
    }

    if (currentHabitsCount >= maxHabits) {
      toast({
        title: "Ограничение тарифа",
        description: `Ваш тариф позволяет создать максимум ${maxHabits} привычек. Обновите тариф для создания большего количества привычек.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("habits").insert({
        name: formData.name,
        description: formData.description || null,
        frequency: formData.frequency,
        color: formData.color,
        start_date: format(formData.start_date, "yyyy-MM-dd"),
        user_id: user?.id,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Привычка создана",
        description: "Новая привычка успешно добавлена",
      });

      setFormData({
        name: "",
        description: "",
        frequency: "daily",
        color: "blue",
        start_date: new Date(),
      });
      
      onClose();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Ошибка создания привычки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую привычку</DialogTitle>
          <DialogDescription>
            Добавьте привычку, от которой хотите избавиться
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Название привычки</Label>
            <Input
              id="habit-name"
              placeholder="Напр., Курение"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="habit-description">Описание (опционально)</Label>
            <Textarea
              id="habit-description"
              placeholder="Опишите привычку подробнее"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="habit-frequency">Частота</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    frequency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-color">Цвет</Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    color: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите цвет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Синий</SelectItem>
                  <SelectItem value="green">Зеленый</SelectItem>
                  <SelectItem value="red">Красный</SelectItem>
                  <SelectItem value="purple">Фиолетовый</SelectItem>
                  <SelectItem value="yellow">Желтый</SelectItem>
                  <SelectItem value="indigo">Индиго</SelectItem>
                  <SelectItem value="pink">Розовый</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Дата начала</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? (
                    format(formData.start_date, "d MMMM yyyy", { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                  initialFocus
                  className="pointer-events-auto"
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-brand-blue hover:bg-brand-blue/90"
            disabled={isSubmitting}
          >
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
