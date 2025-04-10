import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HowItWorks = () => {
  const { user } = useAuth();

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-darkBlue to-brand-blue dark:from-blue-300 dark:to-blue-500 bg-clip-text text-transparent"
          >
            Как это работает
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Простой подход к избавлению от привычек в 4 шага
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className="w-12 h-12 rounded-full bg-brand-lightBlue dark:bg-gray-700 flex items-center justify-center mb-4 text-brand-blue dark:text-blue-400 font-bold"
              >
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-x-2">
                  <ArrowRight className="text-brand-blue dark:text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Наше приложение поможет вам ежедневно отслеживать прогресс и построить новые, более здоровые привычки
          </p>
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
            asChild
          >
            <Link to={user ? "/dashboard" : "/auth"}>
              Начать сейчас
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Определите привычку",
    description:
      "Выберите одну привычку, от которой хотите избавиться, и поставьте чёткую цель.",
  },
  {
    title: "Отслеживайте прогресс",
    description:
      "Используйте наше приложение для ежедневного отслеживания вашего прогресса и фиксации результатов.",
  },
  {
    title: "Получайте поддержку",
    description:
      "Используйте систему напоминаний и советов для преодоления трудных моментов.",
  },
  {
    title: "Анализируйте данные",
    description:
      "Изучайте статистику вашего прогресса и корректируйте подход при необходимости.",
  },
];

export default HowItWorks;