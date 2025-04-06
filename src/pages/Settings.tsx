
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Shield, Bot } from "lucide-react";

// Компоненты настроек
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import TelegramSettings from "@/components/settings/TelegramSettings";

const Settings = () => {
  const { user } = useAuth();
  const { userPlan, loading } = useHabits(user?.id);

  if (loading) {
    return (
      <DashboardLayout 
        userPlan={userPlan} 
        createHabit={() => {}} 
        createFolder={() => {}}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="lg" gradient className="mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Загрузка настроек...</p>
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Настройки</h1>
        
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
            <TabsTrigger value="telegram" className="flex gap-2">
              <Bot className="w-4 h-4" /> Telegram
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>
          
          <TabsContent value="telegram">
            <TelegramSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
