
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import UserEditForm from "@/components/admin/UserEditForm";
import UsersTable from "@/components/admin/UsersTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Search } from "lucide-react";

const AdminPanel = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<string>("");
  const [updating, setUpdating] = useState(false);
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
      
      // Check if user is admin with RPC
      const { data: adminCheck, error: adminCheckError } = await supabase.rpc('is_admin');
      
      if (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError);
      }
      
      console.log("Admin check result:", adminCheck);
      
      // Fetch users with the get_all_users RPC function
      const { data: userData, error: userDataError } = await supabase.rpc('get_all_users');
      
      if (userDataError) {
        throw userDataError;
      }
      
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("user_id, plan_id")
        .is('deleted_at', null);
        
      if (habitsError) throw habitsError;
      
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
      
      if (userData) {
        // Since userData is now an array of objects with the correct type from the function
        const combinedUsers: UserProfile[] = userData.map((authUser: any) => ({
          id: authUser.id,
          email: authUser.email || 'No email',
          last_sign_in_at: authUser.last_sign_in_at || 'Never',
          plan_id: userPlans[authUser.id] || "basic",
          habits_count: habitsCount[authUser.id] || 0
        }));
        
        setUsers(combinedUsers);
      } else {
        // Fallback to mock data if no users were returned
        const mockUsers: UserProfile[] = [
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
        setUsers(mockUsers);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Ошибка загрузки пользователей",
        description: error.message || "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
      // Use mock data as fallback
      const mockUsers: UserProfile[] = [
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
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
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
      const mockPlans: Plan[] = [
        { id: "basic", name: "Базовый", max_habits: 3, has_statistics: false, has_achievements: false, price: 0 },
        { id: "premium", name: "Премиум", max_habits: 10, has_statistics: true, has_achievements: true, price: 299 },
        { id: "pro", name: "Профессиональный", max_habits: 30, has_statistics: true, has_achievements: true, price: 499 }
      ];
      setPlans(mockPlans);
    }
  };

  const selectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setUserPlan(user.plan_id);
  };

  const updateUserPlan = async () => {
    if (!selectedUser) return;
    
    try {
      setUpdating(true);
      
      const { data: userHabits, error: habitsError } = await supabase
        .from("habits")
        .select("id")
        .eq("user_id", selectedUser.id);
        
      if (habitsError) throw habitsError;
      
      if (!userHabits || userHabits.length === 0) {
        toast({
          title: "Информация",
          description: "У пользователя нет привычек для обновления",
        });
        setUpdating(false);
        setSelectedUser(null);
        return;
      }
      
      const { error } = await supabase
        .from("habits")
        .update({ plan_id: userPlan })
        .eq("user_id", selectedUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Тариф обновлен",
        description: `Тариф для пользователя ${selectedUser.email} обновлен успешно`,
      });
      
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, plan_id: userPlan } : u
      ));
      
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error updating user plan:", error);
      toast({
        title: "Ошибка обновления тарифа",
        description: error.message || "Не удалось обновить тариф пользователя",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setSelectedUser(null);
    setUserPlan("");
  };

  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : planId;
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

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {selectedUser && (
          <UserEditForm
            selectedUser={selectedUser}
            userPlan={userPlan}
            setUserPlan={setUserPlan}
            plans={plans}
            updating={updating}
            updateUserPlan={updateUserPlan}
            cancelEdit={cancelEdit}
            getPlanName={getPlanName}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Управление пользователями</CardTitle>
            <CardDescription>
              Просмотр и редактирование информации о пользователях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Поиск по email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <UsersTable 
              filteredUsers={filteredUsers}
              loading={loading}
              getPlanName={getPlanName}
              selectUser={selectUser}
              makeAdmin={makeAdmin}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
