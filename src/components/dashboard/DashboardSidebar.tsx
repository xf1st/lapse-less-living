
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  UserCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plan } from "@/types/habit";

type DashboardSidebarProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  userEmail?: string;
};

const DashboardSidebar = ({
  userPlan,
  isAdmin,
  signOut,
  userEmail
}: DashboardSidebarProps) => {
  const location = useLocation();
  const planType = userPlan?.id ?? "basic";

  const navItems = [
    {
      title: "Привычки",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Достижения",
      icon: <Award className="h-5 w-5" />,
      href: "/dashboard/achievements",
    },
    {
      title: "Календарь",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/calendar",
    },
    {
      title: "Профиль",
      icon: <UserCircle className="h-5 w-5" />,
      href: "/dashboard/profile",
    },
    {
      title: "Настройки",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
    }
  ];

  // Add admin page if user is admin
  if (isAdmin) {
    navItems.push({
      title: "Админ панель",
      icon: <ShieldCheck className="h-5 w-5" />,
      href: "/admin",
    });
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200 z-30">
      <div className="p-4 flex items-center border-b">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white"></div>
        </div>
        <span className="ml-2 font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
          LapseLess
        </span>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-col space-y-1">
          <div className="text-sm font-medium">
            {userEmail || "Пользователь"}
          </div>
          <div className="inline-flex items-center">
            <div
              className={cn(
                "w-2 h-2 rounded-full mr-2",
                planType === "basic"
                  ? "bg-gray-400"
                  : planType === "premium"
                  ? "bg-violet-500"
                  : "bg-green-500"
              )}
            ></div>
            <span className="text-xs text-gray-600">
              {userPlan?.name || "Базовый"} тариф
            </span>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-gray-700 rounded-lg",
              {
                "bg-blue-50 text-brand-blue": location.pathname === item.href,
                "hover:bg-gray-100": location.pathname !== item.href,
              }
            )}
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
