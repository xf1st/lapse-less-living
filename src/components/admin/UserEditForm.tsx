
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";

interface UserEditFormProps {
  selectedUser: UserProfile | null;
  userPlan: string;
  setUserPlan: (value: string) => void;
  plans: Plan[];
  updating: boolean;
  updateUserPlan: () => Promise<void>;
  cancelEdit: () => void;
  getPlanName: (planId: string) => string;
}

const UserEditForm = ({
  selectedUser,
  userPlan,
  setUserPlan,
  plans,
  updating,
  updateUserPlan,
  cancelEdit,
  getPlanName
}: UserEditFormProps) => {
  if (!selectedUser) return null;

  return (
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
  );
};

export default UserEditForm;
