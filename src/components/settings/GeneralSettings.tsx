
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";

const GeneralSettings = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const handleDeleteAccount = () => {
    toast({
      title: "Внимание",
      description: "Эта функция пока не реализована",
      variant: "destructive"
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Основные настройки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Темная тема</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Включить темный режим интерфейса</p>
            </div>
            <Switch id="darkMode" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="language">Язык интерфейса</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Текущий язык: Русский</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                toast({
                  title: "Информация",
                  description: "Смена языка пока недоступна"
                });
              }}
            >
              Изменить
            </Button>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount} 
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Удалить аккаунт
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
