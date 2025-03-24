
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
            Как это работает
          </h2>
          <p className="text-gray-600 text-lg">
            Простой подход к избавлению от привычек в 4 шага
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
              style={{animationDelay: `${index * 150}ms`}}
            >
              <div className="w-12 h-12 rounded-full bg-brand-lightBlue flex items-center justify-center mb-4 text-brand-blue font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full">
                  <ArrowRight className="text-brand-blue" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Наше приложение поможет вам ежедневно отслеживать прогресс и построить новые, более здоровые привычки
          </p>
          <button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg">
            Начать сейчас
          </button>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Определите привычку",
    description: "Выберите одну привычку, от которой хотите избавиться, и поставьте чёткую цель."
  },
  {
    title: "Отслеживайте прогресс",
    description: "Используйте наше приложение для ежедневного отслеживания вашего прогресса и фиксации результатов."
  },
  {
    title: "Получайте поддержку",
    description: "Используйте систему напоминаний и советов для преодоления трудных моментов."
  },
  {
    title: "Анализируйте данные",
    description: "Изучайте статистику вашего прогресса и корректируйте подход при необходимости."
  }
];

export default HowItWorks;
