
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
import { Link, useNavigate } from "react-router-dom";

type DashboardSidebarProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => void;
  userEmail?: string;
};

const DashboardSidebar = ({
  userPlan,
  isAdmin,
  signOut,
  userEmail
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">LapseLess</span>
            </Link>
          </div>
          <div className="mt-5 flex-1 px-2 space-y-4">
            <div className="p-2 bg-blue-50 rounded-md">
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-brand-blue mr-2" />
                <div>
                  <p className="text-xs font-medium text-gray-700">Ваш тариф:</p>
                  <p className="text-sm font-semibold text-brand-blue">{userPlan?.name || "Базовый"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                Обновить
              </Button>
            </div>
            {userEmail && (
              <div className="px-2 py-1 text-sm text-gray-600">
                {userEmail}
              </div>
            )}
          </div>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1 mb-6">
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
            <Link
              to="/admin"
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-md"
            >
              <ShieldCheck className="mr-3 h-5 w-5" />
              Админ панель
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-600 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
