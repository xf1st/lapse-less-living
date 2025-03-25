
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

type DashboardSidebarProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => void;
  userEmail?: string | null;
};

const DashboardSidebar = ({ 
  userPlan, 
  isAdmin, 
  signOut,
  userEmail 
}: DashboardSidebarProps) => {
  return (
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 border-r border-gray-200 bg-white">
      <div className="h-16 flex items-center px-6 border-b">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
            LapseLess
          </span>
        </a>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        <a
          href="/dashboard"
          className="flex items-center px-2 py-2 text-sm font-medium text-brand-blue bg-blue-50 rounded-md"
        >
          <Calendar className="mr-3 h-5 w-5" />
          Привычки
        </a>
        
        {userPlan?.has_statistics && (
          <a
            href="/stats"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Статистика
          </a>
        )}
        
        {userPlan?.has_achievements && (
          <a
            href="/achievements"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <Trophy className="mr-3 h-5 w-5" />
            Достижения
          </a>
        )}
        
        <a
          href="/"
          className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
        >
          <Home className="mr-3 h-5 w-5" />
          На главную
        </a>
        
        {isAdmin && (
          <a
            href="/admin"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
          >
            <ShieldCheck className="mr-3 h-5 w-5" />
            Админ панель
          </a>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
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
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="w-full justify-start text-gray-600 hover:text-red-500 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Выйти
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
