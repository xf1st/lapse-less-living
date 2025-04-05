
import { supabase } from "@/integrations/supabase/client";

// Тип для объекта Telegram WebApp, который будет доступен в глобальном объекте window
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
          };
          auth_date: string;
          hash: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
      };
    };
  }
}

// Проверяем, запущено ли приложение как Telegram Mini App
export const isTelegramWebApp = (): boolean => {
  return !!window.Telegram?.WebApp;
};

// Получаем данные пользователя из Telegram
export const getTelegramUserData = () => {
  if (!isTelegramWebApp()) {
    console.warn("Not running in Telegram WebApp");
    return null;
  }
  
  return window.Telegram.WebApp.initDataUnsafe.user;
};

// Авторизация пользователя через Telegram в системе
export const authWithTelegram = async () => {
  try {
    if (!isTelegramWebApp()) {
      throw new Error("Not running in Telegram WebApp");
    }
    
    const telegramUser = getTelegramUserData();
    if (!telegramUser) {
      throw new Error("Telegram user data not available");
    }
    
    // Проверяем, существует ли пользователь с таким telegram_id
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("telegram_id", telegramUser.id.toString())
      .single();
    
    // Если существует - авторизуем через магическую ссылку
    if (existingProfile) {
      // Используем RPC вызов или другой метод для получения email пользователя
      // Нам нужно получить email для авторизации
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_email_by_telegram_id', { 
          telegram_id_param: telegramUser.id.toString() 
        });
      
      if (userError || !userData) {
        console.error("Error getting user email:", userError);
        return { 
          success: false, 
          message: "Не удалось найти информацию о пользователе" 
        };
      }
      
      if (userData.email) {
        // Отправляем магическую ссылку и авторизуем сразу же
        await supabase.auth.signInWithOtp({
          email: userData.email,
          options: {
            shouldCreateUser: false,
          }
        });
        
        return { success: true, message: "Вы успешно авторизованы через Telegram" };
      }
    }
    
    // Если пользователя нет, показываем сообщение о том, что нужно синхронизировать аккаунт
    return { 
      success: false, 
      isNewUser: true,
      message: "Требуется синхронизация с существующим аккаунтом" 
    };
    
  } catch (error: any) {
    console.error("Telegram auth error:", error);
    return { success: false, message: error.message || "Ошибка авторизации через Telegram" };
  }
};

// Синхронизация аккаунта Telegram с существующим аккаунтом
export const syncTelegramWithExistingAccount = async (email: string, password: string) => {
  try {
    if (!isTelegramWebApp()) {
      throw new Error("Not running in Telegram WebApp");
    }
    
    const telegramUser = getTelegramUserData();
    if (!telegramUser) {
      throw new Error("Telegram user data not available");
    }
    
    // Авторизуемся по email/password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      throw new Error(authError.message);
    }
    
    if (authData?.user) {
      // Обновляем профиль пользователя, добавляя telegram_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          telegram_id: telegramUser.id.toString(),
          username: telegramUser.username || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", authData.user.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      return { success: true, message: "Аккаунт успешно синхронизирован с Telegram" };
    }
    
    return { success: false, message: "Не удалось авторизоваться" };
  } catch (error: any) {
    console.error("Sync error:", error);
    return { success: false, message: error.message || "Ошибка синхронизации" };
  }
};
