
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-darkBlue to-brand-blue animate-spin blur-sm"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-3 rounded-full bg-gradient-to-r from-brand-darkBlue to-brand-blue"></div>
        </div>
        <p className="mt-4 text-gray-500">Проверка прав доступа...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Перенаправляем обычных пользователей на дашборд
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminPageWrapper;
