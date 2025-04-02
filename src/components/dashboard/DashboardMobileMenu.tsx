
import React from "react";
import { 
  Calendar, 
  BarChart3, 
  LogOut,
  Home,
  Trophy,
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plan } from "@/types/habit";
import { Link } from "react-router-dom";

type DashboardMobileMenuProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => void;
  setShowMobileMenu: (show: boolean) => void;
};

const DashboardMobileMenu = ({ 
  userPlan, 
  isAdmin, 
  signOut, 
  setShowMobileMenu 
}: DashboardMobileMenuProps) => {
  return (
    <>
      <div className="mt-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <ShieldCheck className="h-5 w-5 text-brand-blue mr-2" />
          <div>
            <p className="text-xs font-medium text-gray-700">Ваш тариф:</p>
            <p className="text-sm font-semibold text-brand-blue">{userPlan?.name || "Базовый"}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-7">
          Обновить
        </Button>
      </div>
      <nav className="mt-6 flex flex-col space-y-1">
        <a
          href="/dashboard"
          className="flex items-center px-2 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-md"
          onClick={() => setShowMobileMenu(false)}
        >
          <Calendar className="mr-3 h-5 w-5" />
          Привычки
        </a>
        
        {userPlan?.has_statistics && (
          <a
            href="/stats"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
            onClick={() => setShowMobileMenu(false)}
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Статистика
          </a>
        )}
        
        {userPlan?.has_achievements && (
          <a
            href="/achievements"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
            onClick={() => setShowMobileMenu(false)}
          >
            <Trophy className="mr-3 h-5 w-5" />
            Достижения
          </a>
        )}
        
        <a
          href="/"
          className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          onClick={() => setShowMobileMenu(false)}
        >
          <Home className="mr-3 h-5 w-5" />
          На главную
        </a>
        
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
            onClick={() => setShowMobileMenu(false)}
          >
            <ShieldCheck className="mr-3 h-5 w-5" />
            Админ панель
          </Link>
        )}
        
        <Button
          variant="ghost"
          onClick={() => {
            signOut();
            setShowMobileMenu(false);
          }}
          className="justify-start text-gray-600 hover:text-red-500 hover:bg-red-50 mt-4"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Выйти
        </Button>
      </nav>
    </>
  );
};

export default DashboardMobileMenu;
