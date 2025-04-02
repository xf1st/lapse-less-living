
import { cn } from "@/lib/utils";
import { BrandX, Facebook, Instagram, Twitter } from "lucide-react";

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8.5L12.5 13M12.5 13L8 8.5M12.5 13L17 17.5M12.5 13L8 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@lapseless" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
