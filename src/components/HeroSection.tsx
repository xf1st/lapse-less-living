
import { Button } from "@/components/ui/button";
import { MapPin, BarChart2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="pt-28 pb-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-darkBlue tracking-tight mb-4">
              Создай лучшую<br />версию себя
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg text-base md:text-lg">
              Избавьтесь от своих привычек, держитесь целей и усиливайте свою жизнь с помощью умного трекера привычек.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full px-6 h-12 font-medium btn-hover-effect">
                Начать сейчас
              </Button>
              <Button variant="outline" className="rounded-full px-6 h-12 border-gray-300 font-medium">
                Преимущества
              </Button>
            </div>
          </div>

          <div className={cn(
            "relative",
            !isMobile && "pl-6",
            "animate-fade-in-delayed"
          )}>
            <div className="relative bg-brand-lightBlue rounded-3xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
              
              <div className="relative glass-card rounded-2xl overflow-hidden p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Отчет привычек</h3>
                    <p className="text-sm text-gray-500">Динамика за последние 30 дней</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center animate-pulse-subtle">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Бег</span>
                    <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Медитация</span>
                    <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Курение</span>
                    <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs rounded-full bg-white border-gray-200">
                    Подробнее
                  </Button>
                  <Button size="sm" className="text-xs rounded-full bg-brand-blue hover:bg-brand-blue/90">
                    Показать все
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
