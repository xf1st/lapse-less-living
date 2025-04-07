
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { handleTelegramAuthCallback } from "@/services/telegramService";

const TelegramAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const processAuthData = async () => {
      try {
        // Get Telegram auth data from URL
        const queryParams = new URLSearchParams(window.location.search);
        const authData: Record<string, string> = {};
        
        // Extract all query parameters
        queryParams.forEach((value, key) => {
          authData[key] = value;
        });
        
        if (Object.keys(authData).length === 0) {
          toast({
            title: "Ошибка",
            description: "Не получены данные авторизации от Telegram",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        // Process Telegram auth data
        const result = await handleTelegramAuthCallback(authData);
        
        if (result.success) {
          toast({
            title: "Успех",
            description: "Вы успешно авторизовались через Telegram",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Информация",
            description: result.message,
            variant: "default",
          });
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Telegram auth callback error:", error);
        toast({
          title: "Ошибка авторизации",
          description: error.message || "Произошла ошибка при обработке данных Telegram",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    processAuthData();
  }, [navigate, toast]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader size="lg" gradient />
      <p className="mt-4 text-gray-600">Обработка данных авторизации Telegram...</p>
    </div>
  );
};

export default TelegramAuthCallback;
