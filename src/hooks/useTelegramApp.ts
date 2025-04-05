
import { useState, useEffect } from "react";
import { 
  isTelegramWebApp, 
  getTelegramUserData, 
  authWithTelegram 
} from "@/services/telegramService";
import { useToast } from "@/hooks/use-toast";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
}

export const useTelegramApp = () => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the app is running in Telegram
    const telegramCheck = isTelegramWebApp();
    setIsTelegram(telegramCheck);
    
    if (telegramCheck) {
      // Get Telegram user data
      const userData = getTelegramUserData();
      setTelegramUser(userData);
      
      // Initialize Telegram WebApp if available
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Configure the main button
        window.Telegram.WebApp.MainButton.setText("Мои привычки");
        window.Telegram.WebApp.MainButton.onClick(() => {
          window.Telegram.WebApp.showAlert("Просмотр привычек");
        });
      }
      
      // Try to authenticate with Telegram
      handleTelegramAuth();
    }
    
    setLoading(false);
  }, []);

  // Handle Telegram authentication
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

  return {
    isTelegram,
    telegramUser,
    loading
  };
};
