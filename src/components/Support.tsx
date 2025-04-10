import { MessageSquare, Users, CircleUser, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Support = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100 animate-fade-in">
          Наша поддержка
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Support Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1">
            <div className="flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-brand-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
              Чат поддержки
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
              Мы всегда на связи, чтобы помочь с любыми вопросами по использованию платформы.
            </p>
            <div className="flex justify-center">
              <Button className="bg-brand-blue dark:bg-blue-600 hover:bg-brand-blue/90 dark:hover:bg-blue-500/80 rounded-full px-6 btn-hover-effect">
                Написать в чат
              </Button>
            </div>
          </div>

          {/* Support Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1 delay-75">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-brand-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
              База знаний
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
              Ответы на часто задаваемые вопросы и подробные руководства.
            </p>
            <div className="mt-6">
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Как начать?
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    5 мин
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Частые вопросы
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    3 мин
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1 delay-150">
            <div className="flex items-center justify-center mb-6">
              <CircleUser className="w-10 h-10 text-brand-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
              Персональный коуч
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
              Получите индивидуальную поддержку специалиста для достижения ваших целей.
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center transform hover:scale-110 transition-transform">
                <span className="text-white text-xs">i</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Доступно в Pro-тарифе
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
            Часто задаваемые вопросы
          </h3>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="text-gray-800 dark:text-gray-100 hover:text-brand-blue dark:hover:text-blue-400">
                Как начать пользоваться приложением?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Скачайте приложение из App Store или Google Play, зарегистрируйтесь и следуйте инструкциям по настройке вашего профиля и отслеживанию привычек.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="text-gray-800 dark:text-gray-100 hover:text-brand-blue dark:hover:text-blue-400">
                Какие методики используются в приложении?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Мы используем научно обоснованные методики когнитивно-поведенческой терапии, формирования привычек и геймификации для максимальной эффективности.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="text-gray-800 dark:text-gray-100 hover:text-brand-blue dark:hover:text-blue-400">
                Как работает система уведомлений?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Вы можете настроить персонализированные уведомления по времени и частоте. Система адаптируется к вашему расписанию и отправляет напоминания в наиболее эффективное время.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="text-gray-800 dark:text-gray-100 hover:text-brand-blue dark:hover:text-blue-400">
                Есть ли ограничения в бесплатной версии?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                В бесплатной версии вы можете отслеживать до 3 привычек одновременно. Pro-версия снимает это ограничение и добавляет расширенную аналитику и персонального коуча.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-gray-800 dark:text-gray-100 hover:text-brand-blue dark:hover:text-blue-400">
                Как обеспечивается конфиденциальность данных?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                Мы используем шифрование данных по стандарту AES-256, не передаем информацию третьим лицам и предоставляем возможность полного удаления всех ваших данных по запросу.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Support;