
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const TelegramBot: React.FC = () => {
  const botCommands = [
    { command: "/start", description: "Начало работы с ботом" },
    { command: "/help", description: "Показать список команд" },
    { command: "/app", description: "Открыть Telegram Mini App" },
    { command: "/streak", description: "Показать текущие серии" },
    { command: "/achievements", description: "Показать достижения" },
    { command: "/reminder", description: "Настройка напоминаний" },
    { command: "/stats", description: "Статистика привычек" }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
        LapseLess Telegram Bot
      </h1>

      <Alert className="mb-6">
        <AlertTitle>Бот настроен и работает!</AlertTitle>
        <AlertDescription>
          Ваш бот @LapseLessBot успешно подключен к системе LapseLess. Ниже представлена информация о его функционале.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>О боте</CardTitle>
            <CardDescription>Основная информация о Telegram боте</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Бот @LapseLessBot помогает пользователям отслеживать свои привычки и получать уведомления о прогрессе.
              Он тесно интегрирован с веб-приложением LapseLess, обеспечивая бесшовный пользовательский опыт.
            </p>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">Токен бота:</p>
              <p className="text-sm text-gray-500 break-all mt-1">
                7412272055:AAEWji26UKcDd1jrBP1L03fON6jD_-i_jno
              </p>
              <p className="text-xs text-red-500 mt-2">
                *Храните токен в безопасности! В продакшене рекомендуется использовать переменные окружения.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Команды бота</CardTitle>
            <CardDescription>Список доступных команд</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {botCommands.map((cmd, index) => (
                <React.Fragment key={index}>
                  <div className="flex justify-between">
                    <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-mono">
                      {cmd.command}
                    </code>
                    <span className="text-sm text-gray-600">{cmd.description}</span>
                  </div>
                  {index < botCommands.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Интеграция с Mini App</CardTitle>
          <CardDescription>Информация о Telegram Mini App</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Telegram Mini App - это встроенное веб-приложение, которое работает внутри Telegram. 
            Оно позволяет пользователям управлять своими привычками прямо из мессенджера.
          </p>
          
          <h3 className="font-medium mb-2">Как подключить Mini App к боту:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
            <li>Откройте BotFather в Telegram</li>
            <li>Отправьте команду /mybots и выберите @LapseLessBot</li>
            <li>Нажмите "Bot Settings" → "Menu Button" → "Configure menu button"</li>
            <li>Установите текст кнопки: "Открыть приложение"</li>
            <li>Установите URL для Mini App: https://05a5cf3b-542f-471d-a2fc-4d9fe4e56cdb.lovableproject.com/telegram</li>
          </ol>
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-600">
          <p>
            После настройки пользователи смогут открыть Mini App из меню бота или через команду /app.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TelegramBot;
