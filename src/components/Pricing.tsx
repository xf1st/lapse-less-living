
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const { user } = useAuth();
  
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
            Тарифы
          </h2>
          <p className="text-gray-600 text-lg">
            Выберите подходящий план для достижения ваших целей
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-fade-in flex flex-col",
                plan.popular ? "border-brand-blue shadow-lg shadow-blue-100" : "shadow-md",
                plan.soon ? "opacity-75" : ""
              )}
              style={{animationDelay: `${index * 150}ms`}}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Популярный
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-2">{plan.period}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  className={cn(
                    "w-full",
                    plan.popular ? "bg-brand-blue hover:bg-brand-blue/90" : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                    plan.soon ? "opacity-75 cursor-not-allowed" : ""
                  )}
                  disabled={plan.soon}
                  asChild={!plan.soon}
                >
                  {plan.soon ? (
                    <span>Скоро</span>
                  ) : (
                    <Link to={user ? "/dashboard" : "/auth"}>
                      Выбрать план
                    </Link>
                  )}
                </Button>
              </CardFooter>
              {plan.soon && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <div className="bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Скоро
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Есть вопросы по тарифам или нужна индивидуальная настройка?
          </p>
          <a href="#contact" className="text-brand-blue font-medium hover:underline">
            Связаться с нами
          </a>
        </div>
      </div>
    </section>
  );
};

const plans = [
  {
    name: "Базовый",
    description: "Идеально для начинающих",
    price: "Бесплатно",
    period: "",
    features: [
      "Отслеживание до 3 привычек",
      "Базовая статистика",
      "Ежедневные напоминания",
      "Доступ к сообществу"
    ],
    popular: false,
    soon: false
  },
  {
    name: "Премиум",
    description: "Для серьезных изменений",
    price: "690₽",
    period: "/месяц",
    features: [
      "Неограниченное количество привычек",
      "Расширенная аналитика",
      "Персонализированные советы",
      "Синхронизация между устройствами",
      "Приоритетная поддержка"
    ],
    popular: true,
    soon: false
  },
  {
    name: "Команда",
    description: "Для групп и организаций",
    price: "1290₽",
    period: "/месяц",
    features: [
      "Все функции Премиум",
      "Командные привычки",
      "Групповая аналитика",
      "Административная панель",
      "Интеграция с корпоративными сервисами"
    ],
    popular: false,
    soon: true
  }
];

export default Pricing;
