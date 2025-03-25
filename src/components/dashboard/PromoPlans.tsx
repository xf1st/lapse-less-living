
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BarChart3, Trophy, Calendar } from "lucide-react";

const PromoPlans = () => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Расширенная аналитика привычек</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          <div className="flex items-start space-x-3">
            <BarChart3 className="h-5 w-5 text-brand-blue mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Детальная статистика</p>
              <p className="text-sm text-gray-600">Подробный анализ вашего прогресса</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-brand-blue mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Календарь прогресса</p>
              <p className="text-sm text-gray-600">Наглядное отображение ваших достижений</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Trophy className="h-5 w-5 text-brand-blue mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Достижения и цели</p>
              <p className="text-sm text-gray-600">Мотивирующие достижения и медали</p>
            </div>
          </div>
        </div>
        <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
          Получить расширенные возможности
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromoPlans;
