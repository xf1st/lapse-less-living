
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { 
  isTelegramWebApp, 
  getTelegramUserData, 
  authWithTelegram,
  syncTelegramWithExistingAccount
} from "@/services/telegramService";
import { useToast } from "@/hooks/use-toast";
import DashboardContent from "@/components/dashboard/DashboardContent";

const TelegramApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    const telegramCheck = isTelegramWebApp();
    setIsTelegram(telegramCheck);
    
    if (telegramCheck) {
      // Получаем данные пользователя Telegram
      const userData = getTelegramUserData();
      setTelegramUser(userData);
      
      // Если Telegram WebApp доступен, инициализируем его
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Настраиваем основную кнопку
        window.Telegram.WebApp.MainButton.setText("Мои привычки");
        window.Telegram.WebApp.MainButton.onClick(() => {
          window.Telegram.WebApp.showAlert("Просмотр привычек");
        });
      }
      
      // Пытаемся авторизоваться через Telegram
      handleTelegramAuth();
    }
    
    setLoading(false);
  }, []);

  // Обработка авторизации через Telegram
  const handleTelegramAuth = async () => {
    setLoading(true);
    const result = await authWithTelegram();
    
    if (!result.success && result.isNewUser) {
      toast({
        title: "Требуется синхронизация",
        description: "Необходимо синхронизировать ваш аккаунт Telegram с существующим аккаунтом.",
        variant: "default",
      });
    }
    
    setLoading(false);
  };

  // Синхронизация с существующим аккаунтом
  const handleSync = async () => {
    if (!email || !password) {
      toast({
        title: "Ошибка",
        description: "Введите email и пароль",
        variant: "destructive",
      });
      return;
    }
    
    setSyncLoading(true);
    const result = await syncTelegramWithExistingAccount(email, password);
    
    if (result.success) {
      toast({
        title: "Успешно",
        description: result.message,
      });
    } else {
      toast({
        title: "Ошибка",
        description: result.message,
        variant: "destructive",
      });
    }
    
    setSyncLoading(false);
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader gradient size="lg" />
        <p className="mt-4 text-gray-500">Загрузка приложения...</p>
      </div>
    );
  }

  // Если не в Telegram WebApp - показываем сообщение
  if (!isTelegram) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Telegram Mini App</CardTitle>
            <CardDescription>
              Это приложение предназначено для запуска через Telegram. 
              Пожалуйста, откройте его через официальный бот @LapseLessBot.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Если пользователь авторизован - показываем дашборд
  if (user) {
    return (
      <div className="p-4">
        <DashboardContent telegramMode={true} />
      </div>
    );
  }

  // Авторизационная форма для синхронизации
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>LapseLess в Telegram</CardTitle>
          <CardDescription>
            Синхронизируйте ваш существующий аккаунт с Telegram для бесшовной авторизации
          </CardDescription>
        </CardHeader>
        <CardContent>
          {telegramUser && (
            <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex flex-col">
                <p className="font-medium">
                  {telegramUser.first_name} {telegramUser.last_name || ""}
                </p>
                {telegramUser.username && (
                  <p className="text-sm text-gray-500">@{telegramUser.username}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email от существующего аккаунта"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </div>
            
            <Button 
              onClick={handleSync} 
              disabled={syncLoading || !email || !password}
              className="w-full"
            >
              {syncLoading ? <Loader size="sm" className="mr-2" /> : null}
              Синхронизировать аккаунт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramApp;
