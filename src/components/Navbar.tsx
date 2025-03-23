
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className={cn(
              "font-semibold text-xl transition-colors duration-300",
              scrolled ? "text-brand-darkBlue" : "text-brand-blue"
            )}>
              LapseLess
            </span>
          </a>
        </div>

        {!isMobile ? (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">
              Возможности
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">
              Как это работает
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">
              Тарифы
            </a>
            <a href="#philosophy" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">
              Философия
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">
              Контакты
            </a>
          </nav>
        ) : null}

        <div className="flex items-center gap-4">
          {!isMobile ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full font-medium">
                Войти
              </Button>
              <Button size="sm" className="rounded-full bg-brand-blue hover:bg-brand-blue/90 btn-hover-effect">
                Регистрация
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-600 py-2 hover:text-brand-blue transition-colors font-medium">
              Возможности
            </a>
            <a href="#how-it-works" className="text-gray-600 py-2 hover:text-brand-blue transition-colors font-medium">
              Как это работает
            </a>
            <a href="#pricing" className="text-gray-600 py-2 hover:text-brand-blue transition-colors font-medium">
              Тарифы
            </a>
            <a href="#philosophy" className="text-gray-600 py-2 hover:text-brand-blue transition-colors font-medium">
              Философия
            </a>
            <a href="#contact" className="text-gray-600 py-2 hover:text-brand-blue transition-colors font-medium">
              Контакты
            </a>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="justify-center">
                Войти
              </Button>
              <Button size="sm" className="justify-center bg-brand-blue hover:bg-brand-blue/90">
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
