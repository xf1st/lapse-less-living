
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import { Loader } from "@/components/ui/loader";

const AdminPanel = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log("Admin check - isAdmin:", isAdmin, "user:", user.email);
      setAdminCheckComplete(true);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (adminCheckComplete && user && isAdmin) {
      console.log("Admin confirmed, fetching data...");
      fetchUsers();
      fetchPlans();
    } else if (adminCheckComplete && user && !isAdmin) {
      console.log("User is not admin, redirecting...");
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для доступа к панели администратора",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [adminCheckComplete, user, isAdmin, toast, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      // Check if user is admin using the is_admin RPC function
      const { data: isAdminCheck, error: adminCheckError } = await supabase.rpc('is_admin');
      
      if (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError);
        throw adminCheckError;
      }
      
      console.log("Admin check result:", isAdminCheck);
      
      if (!isAdminCheck) {
        throw new Error("User not allowed");
      }
      
      // Fetch users with the get_all_users RPC function
      const { data: userData, error: userDataError } = await supabase.rpc('get_all_users');
      
      if (userDataError) {
        console.error("Error fetching users data:", userDataError);
        throw userDataError;
      }
      
      console.log("Fetched user data:", userData);
      
      // Fetch habits data to count habits per user
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("user_id, plan_id")
        .is('deleted_at', null);
        
      if (habitsError) {
        console.error("Error fetching habits data:", habitsError);
        throw habitsError;
      }
      
      console.log("Fetched habits data:", habitsData);
      
      // Count habits per user and get the plan
      const habitsCount: Record<string, number> = {};
      const userPlans: Record<string, string> = {};
      
      if (habitsData) {
        habitsData.forEach(habit => {
          habitsCount[habit.user_id] = (habitsCount[habit.user_id] || 0) + 1;
          if (habit.plan_id) {
            userPlans[habit.user_id] = habit.plan_id;
          }
        });
      }
      
      // Check if users were fetched successfully
      if (userData && Array.isArray(userData)) {
        console.log("Mapping user data to UserProfile objects...");
        
        const combinedUsers: UserProfile[] = userData.map((authUser) => ({
          id: authUser.id,
          email: authUser.email || 'No email',
          last_sign_in_at: authUser.last_sign_in_at || 'Never',
          plan_id: userPlans[authUser.id] || "basic",
          habits_count: habitsCount[authUser.id] || 0
        }));
        
        console.log("Combined users data:", combinedUsers);
        setUsers(combinedUsers);
      } else {
        console.warn("No user data returned, using fallback mock data");
        // Fallback to mock data if no users were returned
        setUsers(getMockUsers());
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Ошибка загрузки пользователей",
        description: error.message || "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
      // Use mock data as fallback
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = (): UserProfile[] => {
    return [
      {
        id: "1",
        email: "user1@example.com",
        last_sign_in_at: new Date().toISOString(),
        plan_id: "basic",
        habits_count: 3
      },
      {
        id: "2",
        email: "user2@example.com", 
        last_sign_in_at: new Date().toISOString(),
        plan_id: "premium",
        habits_count: 8
      }
    ];
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price", { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setPlans(data);
      }
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Ошибка загрузки тарифов",
        description: error.message || "Не удалось загрузить список тарифов",
        variant: "destructive",
      });
      setPlans(getMockPlans());
    }
  };

  const getMockPlans = (): Plan[] => {
    return [
      { id: "basic", name: "Базовый", max_habits: 3, has_statistics: false, has_achievements: false, price: 0 },
      { id: "premium", name: "Премиум", max_habits: 10, has_statistics: true, has_achievements: true, price: 299 },
      { id: "pro", name: "Профессиональный", max_habits: 30, has_statistics: true, has_achievements: true, price: 499 }
    ];
  };

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("admin_users")
        .insert({ id: userId });
        
      if (error) throw error;
      
      toast({
        title: "Права обновлены",
        description: "Пользователь назначен администратором",
      });
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось назначить администратора",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading && !adminCheckComplete) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (adminCheckComplete && (!user || !isAdmin)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader handleSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
            <p className="text-gray-600">Управление пользователями и тарифами</p>
          </div>
        </div>

        <AdminDashboardStats users={users} plans={plans} />

        <AdminUserManagement 
          users={users} 
          plans={plans} 
          loading={loading} 
          makeAdmin={makeAdmin}
        />
      </main>
    </div>
  );
};

export default AdminPanel;
