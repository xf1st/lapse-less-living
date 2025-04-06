
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { BotIcon } from "lucide-react";

const TelegramSettings = () => {
  const { toast } = useToast();
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [isSaving, setIsSaving] = useState(false);

  const handleConnectTelegram = () => {
    // Placeholder for Telegram connection
    setTelegramConnected(true);
    toast({
      title: "Telegram подключен",
      description: "Ваш аккаунт успешно подключен к Telegram боту",
    });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Успех",
        description: "Настройки Telegram сохранены",
      });
    }, 1000);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BotIcon className="w-5 h-5" />
          Настройки Telegram бота
        </CardTitle>
        <CardDescription>
          Подключите Telegram для получения уведомлений и удобной работы с привычками
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!telegramConnected ? (
            <div className="text-center py-4">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Подключите ваш аккаунт к Telegram боту для получения уведомлений
              </p>
              <Button onClick={handleConnectTelegram}>
                Подключить Telegram
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="telegramStatus">Статус подключения</Label>
                  <p className="text-sm text-green-500">Подключено</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setTelegramConnected(false);
                    toast({
                      title: "Отключено",
                      description: "Telegram бот отключен от вашего аккаунта",
                    });
                  }}
                >
                  Отключить
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Время напоминаний</Label>
                <Input 
                  id="reminderTime" 
                  type="time" 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  В это время Telegram бот будет отправлять напоминания о привычках
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekendReminders">Напоминания в выходные</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Отправлять напоминания в субботу и воскресенье
                  </p>
                </div>
                <Switch id="weekendReminders" defaultChecked />
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramSettings;
