
import { cn } from "@/lib/utils";
import { Telegram, Facebook, Twitter, Instagram, Tiktok } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="font-semibold text-xl">LapseLess</span>
            </a>
            <p className="text-gray-400 text-sm">
              Помогаем избавиться от плохих привычек и создать здоровый образ жизни
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Продукт</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Возможности</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Как это работает</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Тарифы</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-2">
              <li><a href="#philosophy" className="text-gray-400 hover:text-white transition-colors">Философия</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Условия использования</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Политика cookie</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 LapseLess. Все права защищены.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://t.me/lapseless" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Telegram className="h-5 w-5" />
            </a>
            <a href="https://tiktok.com/@lapseless" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Tiktok className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
