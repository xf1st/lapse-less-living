import { MapPin, Calendar, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureCards = () => {
  return (
    <section className="py-20 bg-blue-50 dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100">
          Почему LapseLess?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden feature-card">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-brand-blue dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Отслеживание привычек
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Легко создавайте и отслеживайте привычки, от которых вы хотите избавиться, в одном удобном месте.
              </p>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 dark:hover:bg-brand-blue/80 rounded-full text-sm text-white dark:text-gray-100">
                Подробнее
              </Button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden feature-card">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-brand-blue dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Календарь прогресса
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Наблюдайте за своим прогрессом в календаре и анализируйте, как вы движетесь к целям.
              </p>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 dark:hover:bg-brand-blue/80 rounded-full text-sm text-white dark:text-gray-100">
                Подробнее
              </Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden feature-card">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                <BarChart2 className="w-6 h-6 text-brand-blue dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Подробная статистика
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Получайте детальную аналитику трендов по привычкам, чтобы лучше понимать свой прогресс.
              </p>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 dark:hover:bg-brand-blue/80 rounded-full text-sm text-white dark:text-gray-100">
                Подробнее
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;