
import { MessageSquare, Users, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Наша поддержка
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support Card 1 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Чат поддержки
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Мы всегда на связи, чтобы помочь с любыми вопросами по использованию платформы.
            </p>
            <div className="flex justify-center">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 rounded-full px-6">
                Написать в чат
              </Button>
            </div>
          </div>

          {/* Support Card 2 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
              База знаний
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Ответы на часто задаваемые вопросы и подробные руководства.
            </p>
            <div className="mt-6">
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Как начать?</span>
                  <span className="text-xs text-gray-400">5 мин</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Частые вопросы</span>
                  <span className="text-xs text-gray-400">3 мин</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Card 3 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center mb-6">
              <CircleUser className="w-10 h-10 text-brand-blue" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Персональный коуч
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Получите индивидуальную поддержку специалиста для достижения ваших целей.
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center transform hover:scale-110 transition-transform">
                <span className="text-white text-xs">i</span>
              </div>
              <span className="text-sm text-gray-600">Доступно в Pro-тарифе</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
