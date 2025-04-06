
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [telegramNotifications, setTelegramNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // This is just a placeholder - in a real app, you'd update user settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Успех",
        description: "Настройки успешно сохранены",
      });
    }, 1000);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Настройки уведомлений</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email уведомления</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Получать важные обновления на email</p>
            </div>
            <Switch 
              id="emailNotifications" 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dailyReminders">Ежедневные напоминания</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Отправлять напоминания о выполнении привычек</p>
            </div>
            <Switch 
              id="dailyReminders" 
              checked={dailyReminders} 
              onCheckedChange={setDailyReminders}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weeklyReports">Еженедельные отчеты</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Получать сводку за неделю</p>
            </div>
            <Switch 
              id="weeklyReports" 
              checked={weeklyReports} 
              onCheckedChange={setWeeklyReports}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="telegramNotifications">Telegram уведомления</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Получать уведомления в Telegram боте</p>
            </div>
            <Switch 
              id="telegramNotifications" 
              checked={telegramNotifications} 
              onCheckedChange={setTelegramNotifications}
            />
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
