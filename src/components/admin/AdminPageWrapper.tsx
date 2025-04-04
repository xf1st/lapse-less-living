
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

interface AdminPageWrapperProps {
  children: ReactNode;
}

const AdminPageWrapper = ({ children }: AdminPageWrapperProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log("Admin check - isAdmin:", isAdmin, "user:", user.email);
      setAdminCheckComplete(true);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (adminCheckComplete && user && !isAdmin) {
      console.log("User is not admin, redirecting...");
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для доступа к панели администратора",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [adminCheckComplete, user, isAdmin, toast, navigate]);

  if (!adminCheckComplete) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (adminCheckComplete && (!user || !isAdmin)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AdminPageWrapper;
