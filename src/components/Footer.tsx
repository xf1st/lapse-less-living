
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="font-semibold text-xl">LapseLess</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Удобное приложение, которое помогает избавиться от вредных привычек и стать лучше.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors transform hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Навигация</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">Главная</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">Возможности</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">Тарифы</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">Блог</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block">Поддержка</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">support@lapseless.com</li>
              <li className="text-gray-400 text-sm">+7 (999) 123-45-67</li>
              <li className="text-gray-400 text-sm">Москва</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Мы в соцсетях</h4>
            <div className="grid grid-cols-3 gap-2">
              <a href="#" className="flex items-center justify-center h-12 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors hover:scale-105 transform">
                <Facebook size={20} className="text-blue-400" />
              </a>
              <a href="#" className="flex items-center justify-center h-12 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors hover:scale-105 transform">
                <Twitter size={20} className="text-blue-400" />
              </a>
              <a href="#" className="flex items-center justify-center h-12 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors hover:scale-105 transform">
                <Instagram size={20} className="text-pink-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 LapseLess. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Политика конфиденциальности</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
