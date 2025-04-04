
import React, { useState } from "react";
import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { setUserAdmin, changeUserPlan } from "@/services/adminService";
import { Check, X, UserCheck, UserX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserDetails: React.FC = () => {
  const { selectedUser, setSelectedUser, plans, setLoading } = useAdmin();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!selectedUser) {
    return null;
  }

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleAdminToggle = async () => {
    try {
      setIsUpdating(true);
      await setUserAdmin(selectedUser.id, !selectedUser.is_admin);
      
      setSelectedUser({
        ...selectedUser,
        is_admin: !selectedUser.is_admin,
      });
      
      toast({
        title: `Статус администратора ${selectedUser.is_admin ? "снят" : "присвоен"}`,
        description: `Пользователь ${selectedUser.email} ${
          selectedUser.is_admin ? "больше не администратор" : "теперь администратор"
        }`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка изменения статуса",
        description: error.message || "Не удалось изменить статус администратора",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setIsUpdating(true);
      await changeUserPlan(selectedUser.id, planId);
      
      setSelectedUser({
        ...selectedUser,
        plan_id: planId,
      });
      
      toast({
        title: "Тариф изменен",
        description: `Тариф пользователя ${selectedUser.email} успешно изменен`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка изменения тарифа",
        description: error.message || "Не удалось изменить тариф пользователя",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Находим название текущего тарифа пользователя
  const currentPlan = plans.find(plan => plan.id === selectedUser.plan_id);

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Информация о пользователе</CardTitle>
            <CardDescription>
              Управление пользователем и его настройками
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="h-4 w-4 mr-1" />
            Закрыть
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Email</h3>
            <p className="text-lg">{selectedUser.email}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">ID пользователя</h3>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedUser.id}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Последний вход</h3>
            <p>{selectedUser.last_sign_in_at ? new Date(selectedUser.last_sign_in_at).toLocaleString('ru-RU') : 'Никогда'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Количество привычек</h3>
            <Badge variant="outline" className="text-sm">
              {selectedUser.habits_count}
            </Badge>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Статус администратора</h3>
            <div className="flex items-center mt-2">
              <Badge 
                variant={selectedUser.is_admin ? "default" : "outline"}
                className="mr-2"
              >
                {selectedUser.is_admin ? "Администратор" : "Обычный пользователь"}
              </Badge>
              <Button 
                size="sm" 
                variant={selectedUser.is_admin ? "destructive" : "outline"}
                onClick={handleAdminToggle}
                disabled={isUpdating}
              >
                {selectedUser.is_admin ? (
                  <>
                    <UserX className="h-4 w-4 mr-1" />
                    Снять права админа
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-1" />
                    Сделать админом
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Текущий тариф</h3>
            <p className="mb-2">
              <Badge 
                variant="outline" 
                className={`
                  ${selectedUser.plan_id === 'basic' ? 'bg-gray-100' : ''} 
                  ${selectedUser.plan_id === 'premium' ? 'bg-violet-100 text-violet-800' : ''} 
                  ${selectedUser.plan_id === 'pro' ? 'bg-green-100 text-green-800' : ''}
                `}
              >
                {currentPlan?.name || "Базовый"}
              </Badge>
            </p>
            
            <div className="flex items-center mt-2">
              <Select 
                defaultValue={selectedUser.plan_id} 
                onValueChange={handlePlanChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите тариф" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} {plan.price ? `(${plan.price} ₽)` : "(Бесплатный)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
