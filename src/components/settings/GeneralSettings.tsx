
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GeneralSettings = () => {
  const { toast } = useToast();
  
  const handleDeleteAccount = () => {
    toast({
      title: "Внимание",
      description: "Эта функция пока не реализована",
      variant: "destructive"
    });
  };

  return (
    <Card className="bg-white border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Основные настройки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="language">Язык интерфейса</Label>
              <p className="text-sm text-gray-500">Текущий язык: Русский</p>
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
