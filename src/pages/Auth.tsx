import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";

const Auth = () => {
  const { signIn, signUp, signInWithGoogle, user, loading, error } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Для переключения между входом и регистрацией
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (authMode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      toast({
        title: authMode === "signin" ? "Ошибка входа" : "Ошибка регистрации",
        description: err.message || "Неверные данные",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast({
        title: "Ошибка входа через Google",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col lg:flex-row"
    >
      {/* Left column: sign-in form */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-3xl glass-border flex items-center justify-center bg-blue-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-blue-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m0-14.142l1.414 1.414m11.314 11.314l1.414 1.414" />
              </svg>
            </motion.div>

            {/* Heading with key to reset animation */}
            <motion.h1
              key={authMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-semibold leading-tight"
            >
              <span className="font-light text-black tracking-tighter">
                {authMode === "signin" ? "Здраствуйте" : "Рады вас видеть"}
              </span>
            </motion.h1>
            <motion.p
              key={`${authMode}-desc`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-500"
            >
              {authMode === "signin"
                ? "Войдите в свой аккаунт и продолжите свой путь с нами"
                : "Зарегистрируйте новый аккаунт и начните улучшать свою продуктивность"}
            </motion.p>

            {/* Form */}
            <motion.form
              onSubmit={handleSignIn}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="email">Email</Label>
                <div className="glass-border border border-gray-300 rounded-2xl mt-2 bg-transparent">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Введите ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm p-6 rounded-2xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="password">Пароль</Label>
                <div className="glass-border border border-gray-300 rounded-2xl mt-2 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите ваш пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm p-6 pr-12 rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="custom-checkbox border-gray-300"
                  />
                  <span className="text-black">Запомнить меня</span>
                </label>
                <a href="#" className="hover:underline text-blue-400 transition-colors">
                  Сбросить пароль
                </a>
              </motion.div>

              <motion.button
                type="submit"
                disabled={submitting}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="w-full rounded-2xl text-white bg-black py-4 font-medium hover:bg-zinc-700 transition-colors"
              >
                {submitting && <Loader size="sm" className="mr-2" />}
                {authMode === "signin" ? "Войти" : "Зарегистрироваться"}
              </motion.button>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative flex items-center justify-center my-6"
            >
              <span className="w-24 border-t border-zinc-500"></span>
              <span className="px-4 text-sm text-zinc-500">Или войдите с помощью</span>
              <span className="w-24 border-t border-zinc-500"></span>
            </motion.div>

            {/* Google Sign In */}
            <motion.button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="w-full flex items-center justify-center gap-3 glass-border bg-zinc-200 rounded-2xl py-4 hover:bg-zinc-900/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
              </svg>
              Google
            </motion.button>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-center text-sm text-zinc-500"
            >
              {authMode === "signin"
                ? "Новый на нашем платформе?"
                : "Уже зарегистрированы?"}{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setAuthMode(authMode === "signin" ? "signup" : "signin");
                }}
              >
                {authMode === "signin" ? "Создать аккаунт" : "Войти"}
              </a>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Right column: hero image + testimonials */}
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block flex-1 relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)] bg-cover rounded-3xl m-4"
        />
        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-8 left-1/6 -translate-x-1/2 flex gap-2 px-4 ml-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-start gap-3 rounded-3xl bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64"
          >
            <img
              src="https://randomuser.me/api/portraits/women/57.jpg"
              alt="avatar"
              className="h-10 w-10 object-cover rounded-2xl"
            />
            <div className="text-sm leading-snug">
              <p className="font-medium text-white">Сара Чен</p>
              <p className="text-zinc-400">@sarahdigital</p>
              <p className="mt-1 text-zinc-300">
                Отличная платформа! Пользовательский опыт безупречен.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-start gap-3 rounded-3xl bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64"
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="avatar"
              className="h-10 w-10 object-cover rounded-2xl"
            />
            <div className="text-sm leading-snug">
              <p className="font-medium text-white">Давид Мартинес</p>
              <p className="text-zinc-400">@davidsmart</p>
              <p className="mt-1 text-zinc-300">
              Эта служба преобразовала, как я работаю. Чистый дизайн, мощные функции и отличная поддержка.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-start gap-3 rounded-3xl bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64"
          >
            <img
              src="https://randomuser.me/api/portraits/men/64.jpg"
              alt="avatar"
              className="h-10 w-10 object-cover rounded-2xl"
            />
            <div className="text-sm leading-snug">
              <p className="font-medium text-white">Маркус Джонсон</p>
              <p className="text-zinc-400">@marcustech</p>
              <p className="mt-1 text-zinc-300">
              Я попробовал многие платформы, но эта одна выделяется.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Auth;