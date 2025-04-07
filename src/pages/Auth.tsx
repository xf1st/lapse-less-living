
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { authWithTelegram } from "@/services/telegramService";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user, loading, error } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize Telegram login widget
  useEffect(() => {
    // Check if script is already added
    if (document.getElementById('telegram-login-script')) {
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'telegram-login-script';
    script.src = "https://telegram.org/js/telegram-widget.js";
    script.setAttribute('data-telegram-login', "LapseBot"); // Replace with your bot username
    script.setAttribute('data-size', "large");
    script.setAttribute('data-auth-url', `${window.location.origin}/telegram-auth-callback`);
    script.setAttribute('data-request-access', "write");
    script.setAttribute('data-radius', "4");
    
    // Find the container where to insert the script
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }
    
    return () => {
      // Clean up script when component unmounts
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [authMode]); // Re-run if auth mode changes

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Special admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (email === "admin@admin.com" && password === "78SB@N*D6asdt322") {
      setSubmitting(true);
      
      try {
        await signIn(email, password);
        navigate("/admin");
      } catch (error: any) {
        toast({
          title: "Ошибка входа",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }
    
    // Regular login
    setSubmitting(true);
    try {
      if (authMode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error: any) {
      toast({
        title: `Ошибка ${authMode === "signin" ? "входа" : "регистрации"}`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Ошибка входа через Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleTelegramAuth = async () => {
    try {
      const result = await authWithTelegram();
      if (!result.success) {
        toast({
          title: "Информация",
          description: result.message,
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка входа через Telegram",
        description: error.message || "Произошла ошибка при авторизации через Telegram",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="font-semibold text-2xl bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
              LapseLess
            </span>
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Добро пожаловать
          </h1>
          <p className="text-gray-600">
            Войдите или зарегистрируйтесь чтобы начать отслеживать свои привычки
          </p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <Tabs
            defaultValue="signin"
            value={authMode}
            onValueChange={(value) => setAuthMode(value as "signin" | "signup")}
          >
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              <CardTitle className="text-xl">
                {authMode === "signin" ? "Войти в аккаунт" : "Создать аккаунт"}
              </CardTitle>
              <CardDescription>
                {authMode === "signin"
                  ? "Введите данные для входа"
                  : "Зарегистрируйтесь для начала работы"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAdminLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full mt-2" type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader size="sm" className="mr-2" />
                    ) : null}
                    {authMode === "signin" ? "Войти" : "Зарегистрироваться"}
                  </Button>
                </div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Или продолжить с
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 48 48"
                    className="mr-2"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Войти через Google
                </Button>
                
                {/* Telegram Login Button Container */}
                <div className="flex justify-center mt-2" id="telegram-login-container"></div>
              </div>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          Входя или регистрируясь, вы соглашаетесь с{" "}
          <a href="#" className="text-brand-blue hover:underline">
            Условиями использования
          </a>{" "}
          и{" "}
          <a href="#" className="text-brand-blue hover:underline">
            Политикой конфиденциальности
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Auth;
