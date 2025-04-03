
import React from "react";
import { Users, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";

interface AdminDashboardStatsProps {
  users: UserProfile[];
  plans: Plan[];
}

const AdminDashboardStats = ({ users, plans }: AdminDashboardStatsProps) => {
  return (
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
  );
};

export default AdminDashboardStats;
