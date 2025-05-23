
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ColorPicker from "./ColorPicker";
import { Folder } from "../FolderCard";

type FolderFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  folder?: Folder;
};

const FolderForm = ({ isOpen, onClose, onSuccess, folder }: FolderFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setColor(folder.color);
    } else {
      setName("");
      setColor("blue");
    }
  }, [folder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название папки не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (folder) {
        // Update existing folder
        const { error } = await supabase
          .from("habit_folders")
          .update({
            name,
            color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", folder.id);

        if (error) throw error;

        toast({
          title: "Папка обновлена",
          description: "Папка успешно обновлена",
        });
      } else {
        // Create new folder
        const { error } = await supabase.from("habit_folders").insert({
          name,
          color,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

        if (error) throw error;

        toast({
          title: "Папка создана",
          description: "Новая папка успешно создана",
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
            {folder ? "Редактировать папку" : "Создать новую папку"}
          </DialogTitle>
          <DialogDescription>
            {folder
              ? "Измените детали папки привычек"
              : "Создайте новую папку для организации привычек"}
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
                placeholder="Например: Здоровье"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Цвет</Label>
              <div className="col-span-3">
                <ColorPicker
                  value={color}
                  onValueChange={setColor}
                />
              </div>
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
              {folder ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FolderForm;
