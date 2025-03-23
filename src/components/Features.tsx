
import { Activity, Ban, BarChart } from "lucide-react";

const Features = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Наши возможности
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-brand-blue transition-all duration-300">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                <Activity className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Трекинг привычек</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Регулярное отслеживание вредных привычек с уведомлениями и поддержкой для устойчивых изменений.
            </p>
            <div className="mt-4">
              <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-brand-blue transition-all duration-300">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                <Ban className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Удаление привычек</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Усовершенствованный метод с использованием психологических техник и мягкой геймификации.
            </p>
            <div className="mt-4">
              <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-brand-blue transition-all duration-300">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                <BarChart className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Анализ прогресса</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Чтобы помочь с мотивацией, подробная аналитика по всем вашим привычкам и прогрессу.
            </p>
            <div className="mt-4">
              <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
