
import { supabase } from "@/integrations/supabase/client";
import { AdminUserData, PlanData, UserProfile } from "@/types/admin";

// Функция для получения списка пользователей
export const fetchAdminUsers = async (): Promise<AdminUserData[]> => {
  try {
    console.log("Fetching admin users...");
    const { data, error } = await supabase.rpc("get_all_users");

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchAdminUsers:", error);
    throw error;
  }
};

// Функция для получения всех тарифных планов
export const fetchPlans = async (): Promise<PlanData[]> => {
  try {
    console.log("Fetching plans...");
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price");

    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchPlans:", error);
    throw error;
  }
};

// Функция для получения детальной информации о пользователе
export const fetchUserDetails = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Получаем основную информацию о пользователе
    const { data: userData, error: userError } = await supabase.rpc("get_all_users");
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }
    
    const user = userData.find((u: AdminUserData) => u.id === userId);
    
    if (!user) return null;
    
    // Получаем количество привычек пользователя
    const { count, error: habitsError } = await supabase
      .from("habits")
      .select("id", { count: "exact" })
      .eq("user_id", userId);
    
    if (habitsError) {
      console.error("Error fetching habits count:", habitsError);
      throw habitsError;
    }
    
    // Проверяем, является ли пользователь администратором
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .single();
    
    // Получаем тариф пользователя из его первой привычки
    const { data: habitData } = await supabase
      .from("habits")
      .select("plan_id")
      .eq("user_id", userId)
      .limit(1);
      
    const planId = habitData && habitData.length > 0 ? habitData[0].plan_id : "basic";
    
    return {
      ...user,
      habits_count: count || 0,
      is_admin: !!adminData,
      plan_id: planId || "basic"
    };
  } catch (error) {
    console.error("Error in fetchUserDetails:", error);
    throw error;
  }
};

// Функция для назначения пользователю прав администратора
export const setUserAdmin = async (userId: string, isAdmin: boolean): Promise<void> => {
  try {
    if (isAdmin) {
      // Добавляем пользователя в таблицу администраторов
      const { error } = await supabase
        .from("admin_users")
        .insert({ id: userId })
        .select();
        
      if (error) {
        console.error("Error setting user as admin:", error);
        throw error;
      }
    } else {
      // Удаляем пользователя из таблицы администраторов
      const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", userId);
        
      if (error) {
        console.error("Error removing admin rights:", error);
        throw error;
      }
    }
    
    console.log(`User ${userId} admin status set to ${isAdmin}`);
  } catch (error) {
    console.error("Error in setUserAdmin:", error);
    throw error;
  }
};

// Функция для изменения тарифного плана пользователя
export const changeUserPlan = async (userId: string, planId: string): Promise<void> => {
  try {
    // Обновляем тариф во всех привычках пользователя
    const { error } = await supabase
      .from("habits")
      .update({ plan_id: planId })
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error updating user plan:", error);
      throw error;
    }
    
    console.log(`User ${userId} plan changed to ${planId}`);
  } catch (error) {
    console.error("Error in changeUserPlan:", error);
    throw error;
  }
};
