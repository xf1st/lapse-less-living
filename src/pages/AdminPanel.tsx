
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  LayoutDashboard,
  User,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Crown,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

type UserProfile = {
  id: string;
  email: string;
  last_sign_in_at: string;
  plan_id: string;
  habits_count: number;
};

type Plan = {
  id: string;
  name: string;
  max_habits: number;
  has_statistics: boolean;
  has_achievements: boolean;
  price: number;
};

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Allow admin@admin.com and sergeifreddy@gmail.com as admin
        if (user.email === "admin@admin.com" || user.email === "sergeifreddy@gmail.com") {
          console.log("Admin access granted for:", user.email);
          setIsAdmin(true);
          setLoading(false);
          fetchUsers();
          fetchPlans();
          return;
        }

        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) throw error;
        
        const isUserAdmin = !!data;
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
          fetchUsers();
          fetchPlans();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        toast({
          title: "Ошибка",
          description: "Не удалось проверить статус администратора",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use the Supabase Admin API directly
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching users with admin API:", authError);
        throw authError;
      }
      
      if (!authUsersData || !authUsersData.users) {
        throw new Error("Couldn't fetch users");
      }
      
      // Get habits data to count habits and get plan_id
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
      
      const combinedUsers = authUsersData.users.map(authUser => ({
        id: authUser.id,
        email: authUser.email || 'No email',
        last_sign_in_at: authUser.last_sign_in_at || 'Never',
        plan_id: userPlans[authUser.id] || "basic",
        habits_count: habitsCount[authUser.id] || 0
      }));
      
      setUsers(combinedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Ошибка загрузки пользователей",
        description: error.message || "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
      // Create some mock data for testing
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
      // Add mock plans for testing
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
      
      // First, get all habits for this user
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
      
      // Update plan_id for all habits of this user
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
      // Add user to admin_users table
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

  if (!loading && (!user || (isAdmin === false))) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
                  LapseLess Admin
                </span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-brand-blue flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                К приложению
              </a>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
            <p className="text-gray-600">Управление пользователями и тарифами</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Администратор
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Всего пользователей</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{users.length}</div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-brand-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Тариф {plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">
                    {users.filter(u => u.plan_id === plan.id).length}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    plan.id === "basic" ? "bg-gray-100" : 
                    plan.id === "premium" ? "bg-purple-100" : 
                    "bg-green-100"
                  )}>
                    <ShieldCheck className={cn(
                      "h-5 w-5",
                      plan.id === "basic" ? "text-gray-600" : 
                      plan.id === "premium" ? "text-purple-600" : 
                      "text-green-600"
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedUser ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Редактирование пользователя</CardTitle>
              <CardDescription>
                {selectedUser.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Текущий тариф:</label>
                  <div className="font-medium">{getPlanName(selectedUser.plan_id)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Новый тариф:</label>
                  <Select value={userPlan} onValueChange={setUserPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тариф" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} ({plan.price > 0 ? `${plan.price}₽` : "Бесплатно"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEdit} disabled={updating}>
                Отмена
              </Button>
              <Button 
                className="bg-brand-blue hover:bg-brand-blue/90" 
                onClick={updateUserPlan}
                disabled={updating || userPlan === selectedUser.plan_id}
              >
                {updating ? <Loader size="sm" className="mr-2" /> : null}
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        ) : null}

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
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Тариф</TableHead>
                    <TableHead className="text-right">Привычек</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <ContextMenu key={user.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow className="cursor-context-menu">
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  user.plan_id === "basic" ? "bg-gray-400" :
                                  user.plan_id === "premium" ? "bg-purple-500" :
                                  "bg-green-500"
                                )}></div>
                                {getPlanName(user.plan_id)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{user.habits_count}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => selectUser(user)}
                              >
                                Изменить тариф
                              </Button>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-56">
                          <ContextMenuItem onClick={() => selectUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Изменить тариф
                            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => makeAdmin(user.id)}>
                            <Crown className="mr-2 h-4 w-4" />
                            Назначить администратором
                            <ContextMenuShortcut>⌘A</ContextMenuShortcut>
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить пользователя
                            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        {loading ? (
                          <div className="flex justify-center">
                            <Loader size="sm" />
                          </div>
                        ) : (
                          "Пользователи не найдены"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
