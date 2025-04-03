
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plan } from "@/types/habit";

type DashboardMobileMenuProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  userEmail?: string;
  onClose: () => void;
};

const DashboardMobileMenu = ({
  userPlan,
  isAdmin,
  signOut,
  userEmail,
  onClose
}: DashboardMobileMenuProps) => {
  const location = useLocation();
  const planType = userPlan?.id ?? "basic";

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const navItems = [
    {
      title: "Привычки",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
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
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
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

      <nav className="flex-1 py-6 px-6">
        <div className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-gray-700 rounded-lg",
                {
                  "bg-blue-50 text-brand-blue": location.pathname === item.href,
                  "hover:bg-gray-100": location.pathname !== item.href,
                }
              )}
              onClick={onClose}
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-6 mt-auto border-t">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default DashboardMobileMenu;
