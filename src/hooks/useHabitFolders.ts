
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FolderType } from "@/types/habit";

export type Folder = FolderType;

export const useHabitFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("habit_folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setFolders(data);
      }
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки папок",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteFolder = async (id: string) => {
    try {
      // We'll need the habits to check if folder has any
      const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("id, folder_id")
        .eq("folder_id", id);
      
      if (habitsError) throw habitsError;
      
      const folderHabits = habits || [];
      
      if (folderHabits.length > 0) {
        // Ask user to confirm deletion
        if (!window.confirm(`Эта папка содержит ${folderHabits.length} привычек. Они будут перемещены в раздел "Без папки". Продолжить?`)) {
          return;
        }
        
        // Move habits to no folder
        for (const habit of folderHabits) {
          const { error: updateError } = await supabase
            .from("habits")
            .update({ folder_id: null })
            .eq("id", habit.id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Delete the folder
      const { error } = await supabase
        .from("habit_folders")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Папка удалена",
        description: "Папка успешно удалена",
      });

      // Refresh folders
      fetchFolders();
    } catch (error: any) {
      toast({
        title: "Ошибка удаления папки",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    folders,
    fetchFolders,
    deleteFolder,
    loading
  };
};
