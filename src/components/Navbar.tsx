import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-gray-700/20 animate-pulse-subtle">
              <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-100"></div>
            </div>
            <span className={cn(
              "font-semibold text-xl transition-colors duration-300 bg-gradient-to-r from-blue-700 to-blue-500 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent",
              scrolled ? "from-brand-darkBlue to-brand-blue" : "from-blue-700 to-blue-500"
            )}>
              LapseLess
            </span>
          </Link>
        </div>

        {!isMobile ? (
          <TooltipProvider>
            <nav className="hidden md:flex items-center gap-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-brand-blue after:transition-all after:duration-300">
                    Возможности
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Узнайте о наших функциях</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-brand-blue after:transition-all after:duration-300">
                    Как это работает
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Подробное объяснение процесса</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-brand-blue after:transition-all after:duration-300">
                    Тарифы
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Наши доступные планы</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#philosophy" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-brand-blue after:transition-all after:duration-300">
                    Философия
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Наш подход к избавлению от привычек</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#contact" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-brand-blue after:transition-all after:duration-300">
                    Контакты
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Свяжитесь с нами</p>
                </TooltipContent>
              </Tooltip>
            </nav>
          </TooltipProvider>
        ) : null}

        <div className="flex items-center gap-4">
          {!isMobile ? (
            <>
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button size="sm" className="rounded-full bg-brand-blue hover:bg-brand-blue/90 dark:bg-blue-600 dark:hover:bg-blue-500 btn-hover-effect animate-pulse-subtle">
                      Мои привычки
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    onClick={handleSignOut}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="rounded-full font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      Войти
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register">
                    <Button size="sm" className="rounded-full bg-brand-blue hover:bg-brand-blue/90 dark:bg-blue-600 dark:hover:bg-blue-500 btn-hover-effect animate-pulse-subtle">
                      Регистрация
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {mobileMenuOpen ? <X size={24} className="text-gray-600 dark:text-gray-400" /> : <Menu size={24} className="text-gray-600 dark:text-gray-400" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors font-medium">
              Возможности
            </a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors font-medium">
              Как это работает
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors font-medium">
              Тарифы
            </a>
            <a href="#philosophy" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors font-medium">
              Философия
            </a>
            <a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors font-medium">
              Контакты
            </a>
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="justify-center w-full bg-brand-blue hover:bg-brand-blue/90 dark:bg-blue-600 dark:hover:bg-blue-500">
                      Мои привычки
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-center w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="justify-center w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Войти
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="justify-center w-full bg-brand-blue hover:bg-brand-blue/90 dark:bg-blue-600 dark:hover:bg-blue-500">
                      Регистрация
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;