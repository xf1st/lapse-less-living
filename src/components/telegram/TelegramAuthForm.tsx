
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { syncTelegramWithExistingAccount } from "@/services/telegramService";
import { useToast } from "@/hooks/use-toast";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramAuthFormProps {
  telegramUser: TelegramUser | null;
}

const TelegramAuthForm: React.FC<TelegramAuthFormProps> = ({ telegramUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const { toast } = useToast();

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
              {syncLoading ? <Loader size="sm" className="mr-2" gradient /> : null}
              Синхронизировать аккаунт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthForm;
