
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Settings as SettingsIcon, Bell, Shield, Trash } from "lucide-react";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { userPlan, loading } = useHabits(user?.id);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // This is just a placeholder - in a real app, you'd update user settings
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Настройки успешно сохранены");
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error("Эта функция пока не реализована");
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
          <p className="text-gray-500">Загрузка настроек...</p>
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Настройки</h1>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="general" className="flex gap-2">
              <SettingsIcon className="w-4 h-4" /> Основные
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2">
              <Bell className="w-4 h-4" /> Уведомления
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex gap-2">
              <Shield className="w-4 h-4" /> Приватность
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Основные настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode">Темная тема</Label>
                      <p className="text-sm text-gray-500">Включить темный режим интерфейса</p>
                    </div>
                    <Switch id="darkMode" onCheckedChange={() => toast.info("Темная тема пока недоступна")} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="language">Язык интерфейса</Label>
                      <p className="text-sm text-gray-500">Текущий язык: Русский</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Смена языка пока недоступна")}>
                      Изменить
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount} 
                    className="flex items-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Удалить аккаунт
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Настройки уведомлений</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email уведомления</Label>
                      <p className="text-sm text-gray-500">Получать важные обновления на email</p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dailyReminders">Ежедневные напоминания</Label>
                      <p className="text-sm text-gray-500">Отправлять напоминания о выполнении привычек</p>
                    </div>
                    <Switch 
                      id="dailyReminders" 
                      checked={dailyReminders} 
                      onCheckedChange={setDailyReminders}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Еженедельные отчеты</Label>
                      <p className="text-sm text-gray-500">Получать сводку за неделю</p>
                    </div>
                    <Switch 
                      id="weeklyReports" 
                      checked={weeklyReports} 
                      onCheckedChange={setWeeklyReports}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? "Сохранение..." : "Сохранить настройки"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card className="bg-white border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Настройки приватности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataCollection">Сбор данных</Label>
                      <p className="text-sm text-gray-500">Разрешить анонимную аналитику использования</p>
                    </div>
                    <Switch id="dataCollection" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="privacyMode">Режим приватности</Label>
                      <p className="text-sm text-gray-500">Скрыть личные данные от других пользователей</p>
                    </div>
                    <Switch id="privacyMode" />
                  </div>
                  
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? "Сохранение..." : "Сохранить настройки"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
