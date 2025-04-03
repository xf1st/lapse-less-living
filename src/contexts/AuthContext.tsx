
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Check admin status whenever the session changes
        if (newSession?.user) {
          checkAdminStatus(newSession.user);
        } else {
          setIsAdmin(false);
        }

        if (event === "SIGNED_IN") {
          toast({
            title: "Вход выполнен успешно",
            description: "Добро пожаловать!",
          });
        } else if (event === "SIGNED_OUT") {
          toast({
            title: "Выход выполнен успешно",
            description: "До скорых встреч!",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check admin status for existing session
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const checkAdminStatus = async (user: User) => {
    try {
      // Allow specific admin emails
      if (user.email === "admin@admin.com" || user.email === "sergeifreddy@gmail.com") {
        console.log("Admin access granted for:", user.email);
        setIsAdmin(true);
        return;
      }

      // Check database for admin role
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) throw error;
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Special case for admin login
      if (email === "admin@admin.com" || email === "sergeifreddy@gmail.com") {
        console.log("Admin login attempt");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Ошибка входа",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Ошибка входа",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Ошибка регистрации",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Регистрация успешна",
          description: "Пожалуйста, проверьте вашу почту для подтверждения.",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Ошибка регистрации",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Ошибка входа через Google",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Ошибка входа через Google",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Signing out user:", user?.email);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during signOut:", error);
        throw error;
      }
      
      // Manually clear local state to ensure UI updates
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      console.log("Signout completed successfully");
      
    } catch (err: any) {
      console.error("Logout error:", err);
      toast({
        title: "Ошибка выхода",
        description: err.message || "Не удалось выйти из аккаунта",
        variant: "destructive",
      });
    } finally {
      // Ensure we clear local state even if Supabase logout failed
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        error,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
