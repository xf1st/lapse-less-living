import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Philosophy = () => {
  return (
    <section className="py-20 bg-brand-cream dark:bg-gray-800">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100">
          Наша философия
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left column */}
          <div className="bg-white dark:bg-gray-700 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-brand-blue dark:text-blue-400">
              Почему мы создали LapseLess?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              Мы верим, что каждый человек может избавиться от любых вредных привычек, если получит правильную поддержку и инструменты. Наша миссия — помочь в этом.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-brand-blue dark:text-blue-400" />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Создайте свои привычки
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-brand-blue dark:text-blue-400" />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Получайте детальную статистику изменений
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-brand-blue dark:text-blue-400" />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Станьте счастливее и здоровее
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-brand-blue dark:text-blue-400" />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Отслеживайте прогресс
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 mt-8">
              <div>
                <p className="text-4xl font-bold text-brand-blue dark:text-blue-400">
                  600K+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">пользователей</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-brand-blue dark:text-blue-400">
                  100%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  безопасность данных
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="relative h-64 overflow-hidden rounded-3xl shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-white dark:bg-gray-200 opacity-20 rounded"></div>
                  <div className="absolute bottom-0 w-full h-1/2 bg-white dark:bg-gray-300 opacity-30 rounded-t"></div>
                  <div className="absolute bottom-5 w-full h-1/3 bg-white dark:bg-gray-400 opacity-40 rounded-t"></div>
                  <div className="absolute bottom-10 w-full h-1/4 bg-white dark:bg-gray-500 opacity-50 rounded-t"></div>
                  <div className="absolute bottom-14 w-full h-1/6 bg-white dark:bg-gray-600 opacity-60 rounded-t"></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-3xl p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4">
                "Только когда начинаешь отслеживать свои привычки, понимаешь, насколько они влияют на твою жизнь. LapseLess помог мне избавиться от курения"
              </p>
              <p className="text-right text-brand-blue dark:text-blue-400 font-medium text-sm">
                — Александр, пользователь
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;