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

  if (isAdmin) {
    navItems.push({
      title: "Админ панель",
      icon: <ShieldCheck className="h-5 w-5" />,
      href: "/admin",
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col space-y-1">
          <div className="text-sm font-medium text-foreground">
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
            <span className="text-xs text-muted-foreground">
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
                "flex items-center px-3 py-2 rounded-lg",
                location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
              )}
              onClick={onClose}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-6 mt-auto border-t border-border">
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