
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PrivacySettings = () => {
  const { toast } = useToast();
  const [dataCollection, setDataCollection] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // This is just a placeholder - in a real app, you'd update user settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Успех",
        description: "Настройки приватности сохранены",
      });
    }, 1000);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Настройки приватности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dataCollection">Сбор данных</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Разрешить анонимную аналитику использования</p>
            </div>
            <Switch 
              id="dataCollection" 
              checked={dataCollection} 
              onCheckedChange={setDataCollection} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacyMode">Режим приватности</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Скрыть личные данные от других пользователей</p>
            </div>
            <Switch 
              id="privacyMode" 
              checked={privacyMode}
              onCheckedChange={setPrivacyMode} 
            />
          </div>
          
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
