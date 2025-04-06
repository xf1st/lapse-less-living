
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/components/admin/AdminContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import TelegramApp from "./pages/TelegramApp";
import TelegramBot from "./pages/TelegramBot";
import { Loader } from "./components/ui/loader";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    // Set initial theme class on document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Loader size="lg" gradient />
        <h1 className="mt-4 text-xl font-semibold bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
          LapseLess
        </h1>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AdminProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/calendar" element={<Calendar />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  {/* Новые маршруты для Telegram */}
                  <Route path="/telegram" element={<TelegramApp />} />
                  <Route path="/telegram-bot" element={<TelegramBot />} />
                  {/* Redirect for any undefined dashboard routes */}
                  <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
                  {/* Catch all route - Must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
