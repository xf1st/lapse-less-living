
import React from "react";
import { BarChart3, Calendar, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PremiumBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 shadow-sm">
      <h3 className="text-xl font-bold text-brand-blue mb-2">Обновите до Премиум тарифа</h3>
      <p className="text-gray-700 mb-4">
        Получите доступ к расширенной статистике, календарю прогресса, достижениям и многому другому.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-md p-3 shadow-sm">
          <BarChart3 className="h-6 w-6 text-green-500 mb-2" />
          <p className="font-medium">Детальная статистика</p>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm">
          <Calendar className="h-6 w-6 text-blue-500 mb-2" />
          <p className="font-medium">Календарь прогресса</p>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm">
          <Trophy className="h-6 w-6 text-amber-500 mb-2" />
          <p className="font-medium">Система достижений</p>
        </div>
      </div>
      <Button className="bg-brand-blue hover:bg-brand-blue/90">
        Обновить тариф <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default PremiumBanner;
