
import React, { useEffect } from "react";
import { useAdmin } from "./AdminContext";
import { fetchAdminUsers, fetchPlans } from "@/services/adminService";
import { useAuth } from "@/contexts/AuthContext";

const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUsers, setPlans, setLoading, setError } = useAdmin();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const loadAdminData = async () => {
      console.log("Admin check - isAdmin:", isAdmin, "user:", user?.email);
      
      if (!user || !isAdmin) {
        setError("Доступ запрещен. Только администраторы могут просматривать эту страницу.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Admin check result:", isAdmin);
        
        // Загружаем пользователей
        console.log("Fetching users...");
        const usersData = await fetchAdminUsers();
        setUsers(usersData);
        
        // Загружаем тарифы
        console.log("Fetching plans...");
        const plansData = await fetchPlans();
        setPlans(plansData);
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        setError(error.message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user, isAdmin, setUsers, setPlans, setLoading, setError]);

  return <>{children}</>;
};

export default AdminDataProvider;
