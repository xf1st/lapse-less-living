
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
        <Loader size="lg" gradient />
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
