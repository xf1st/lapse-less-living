
import { Activity, Ban, BarChart } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const Features = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Activity,
      title: "Трекинг привычек",
      description: "Регулярное отслеживание вредных привычек с уведомлениями и поддержкой для устойчивых изменений.",
      progressValue: 85
    },
    {
      icon: Ban,
      title: "Удаление привычек",
      description: "Усовершенствованный метод с использованием психологических техник и мягкой геймификации.",
      progressValue: 92
    },
    {
      icon: BarChart,
      title: "Анализ прогресса",
      description: "Чтобы помочь с мотивацией, подробная аналитика по всем вашим привычкам и прогрессу.",
      progressValue: 78
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in">
          Наши возможности
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-brand-blue transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 feature-card"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-brand-blue" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {feature.description}
                    </p>
                    <div className="mt-4">
                      <div className="h-1 w-20 bg-brand-blue rounded-full"></div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-xs text-gray-400 mb-2">Эффективность</p>
                      <Progress 
                        value={hoverIndex === index ? feature.progressValue : 0} 
                        className="h-2 transition-all duration-1000" 
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Эффективность: {feature.progressValue}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
