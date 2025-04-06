
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { userPlan, loading } = useHabits(user?.id);
  
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // This is just a placeholder - in a real app, you'd update the user profile
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Профиль успешно обновлен");
    }, 1000);
  };

  if (loading) {
    return (
      <DashboardLayout 
        userPlan={userPlan} 
        createHabit={() => {}} 
        createFolder={() => {}}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="lg" gradient className="mb-4" />
          <p className="text-gray-500">Загрузка профиля...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      userPlan={userPlan} 
      createHabit={() => {}} 
      createFolder={() => {}}
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Профиль пользователя</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4 py-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium">{user?.email}</h3>
                    <p className="text-sm text-gray-500 mt-1">{userPlan?.name || "Базовый"} тариф</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Личные данные</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Имя</Label>
                    <Input 
                      id="displayName" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ваше имя"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ваш email"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email нельзя изменить</p>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
                    {isSaving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
