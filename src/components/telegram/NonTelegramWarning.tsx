
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NonTelegramWarning: React.FC = () => {
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
};

export default NonTelegramWarning;
