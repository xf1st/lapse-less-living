
import { useState } from "react";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UsersTable from "./UsersTable";
import UserEditForm from "./UserEditForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

interface AdminUserManagementProps {
  users: UserProfile[];
  plans: Plan[];
  loading: boolean;
  makeAdmin: (userId: string) => Promise<void>;
}

const AdminUserManagement = ({
  users,
  plans,
  loading,
  makeAdmin
}: AdminUserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

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
      
      // Update the user in the local state
      const updatedUser = { ...selectedUser, plan_id: userPlan };
      
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

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
    </>
  );
};

export default AdminUserManagement;
