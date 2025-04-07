
import { supabase } from "@/integrations/supabase/client";

// Type for the Telegram WebApp object available in the global window object
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

// Check if the app is running as a Telegram Mini App
export const isTelegramWebApp = (): boolean => {
  return !!window.Telegram?.WebApp;
};

// Get user data from Telegram
export const getTelegramUserData = () => {
  if (!isTelegramWebApp()) {
    console.warn("Not running in Telegram WebApp");
    return null;
  }
  
  return window.Telegram.WebApp.initDataUnsafe.user;
};

// Authorize user through Telegram in the system
export const authWithTelegram = async () => {
  try {
    if (!isTelegramWebApp()) {
      throw new Error("Not running in Telegram WebApp");
    }
    
    const telegramUser = getTelegramUserData();
    if (!telegramUser) {
      throw new Error("Telegram user data not available");
    }
    
    // Check if a user with this telegram_id exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("telegram_id", telegramUser.id.toString())
      .single();
    
    // If exists, authorize via magic link
    if (existingProfile) {
      // Use RPC to call our SQL function with a direct call
      const { data, error } = await supabase
        .rpc('get_user_email_by_telegram_id', { 
          telegram_id_param: telegramUser.id.toString() 
        });
      
      if (error || !data || data.length === 0) {
        console.error("Error getting user email:", error);
        return { 
          success: false, 
          message: "Не удалось найти информацию о пользователе" 
        };
      }
      
      const userEmail = data[0]?.email;
      
      if (userEmail) {
        // Send magic link and authorize immediately
        await supabase.auth.signInWithOtp({
          email: userEmail,
          options: {
            shouldCreateUser: false,
          }
        });
        
        return { success: true, message: "Вы успешно авторизованы через Telegram" };
      }
    }
    
    // If the user doesn't exist, show a message about syncing the account
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

// Handle Telegram login widget callback
export const handleTelegramAuthCallback = async (authData: Record<string, string>) => {
  try {
    // Extract user info from auth data
    const {
      id,
      first_name,
      last_name,
      username,
      auth_date,
      hash,
      ...otherData
    } = authData;
    
    if (!id) {
      return { success: false, message: "Отсутствует ID пользователя Telegram" };
    }
    
    // Check if user with this telegram_id already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("telegram_id", id)
      .single();
      
    if (existingProfile) {
      // User exists, sign in with magic link
      const { data: userData, error: emailError } = await supabase
        .rpc('get_user_email_by_telegram_id', { telegram_id_param: id });
      
      if (emailError || !userData || userData.length === 0) {
        return { 
          success: false, 
          message: "Не удалось получить данные пользователя" 
        };
      }
      
      const userEmail = userData[0]?.email;
      
      if (userEmail) {
        // Send OTP login link and sign in
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: userEmail,
          options: {
            shouldCreateUser: false,
          }
        });
        
        if (signInError) {
          return { 
            success: false, 
            message: signInError.message 
          };
        }
        
        return { 
          success: true, 
          message: "Вы успешно вошли через Telegram" 
        };
      }
      
      return {
        success: false,
        message: "Не удалось найти email пользователя"
      };
    } else {
      // First time Telegram login - create new account
      const generatedEmail = `telegram_${id}@lapseless.ru`;
      const randomPassword = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);
      
      // Create new account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: generatedEmail,
        password: randomPassword
      });
      
      if (signUpError) {
        return {
          success: false,
          message: `Ошибка создания аккаунта: ${signUpError.message}`
        };
      }
      
      // Update profile with Telegram data
      if (signUpData?.user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            telegram_id: id,
            username: username || `${first_name}${last_name ? '_' + last_name : ''}`,
            updated_at: new Date().toISOString()
          })
          .eq("id", signUpData.user.id);
        
        if (updateError) {
          return {
            success: false,
            message: `Ошибка обновления профиля: ${updateError.message}`
          };
        }
        
        return {
          success: true,
          message: "Аккаунт успешно создан и привязан к Telegram"
        };
      }
    }
    
    return {
      success: false,
      message: "Не удалось обработать авторизацию Telegram"
    };
    
  } catch (error: any) {
    console.error("Telegram auth callback error:", error);
    return {
      success: false,
      message: error.message || "Произошла ошибка при обработке авторизации Telegram"
    };
  }
};

// Sync Telegram account with existing account
export const syncTelegramWithExistingAccount = async (email: string, password: string) => {
  try {
    if (!isTelegramWebApp()) {
      throw new Error("Not running in Telegram WebApp");
    }
    
    const telegramUser = getTelegramUserData();
    if (!telegramUser) {
      throw new Error("Telegram user data not available");
    }
    
    // Authenticate with email/password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      throw new Error(authError.message);
    }
    
    if (authData?.user) {
      // Update user profile, adding telegram_id
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
