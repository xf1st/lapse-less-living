
import React from "react";
import { useAdmin } from "./AdminContext";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, CheckCircle2 } from "lucide-react";

const PlansList: React.FC = () => {
  const { plans, loading, error } = useAdmin();

  if (loading) {
    return <div className="text-center py-4">Загрузка тарифных планов...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
        <p className="font-medium">Ошибка загрузки тарифных планов:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-600 mb-4">
        Тарифные планы не найдены
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-medium flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            Тарифные планы
          </CardTitle>
          <CardDescription>
            Просмотр доступных тарифных планов (только чтение)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableCaption>Доступные тарифные планы системы</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Макс. привычек</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статистика</TableHead>
                <TableHead>Достижения</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${plan.id === 'basic' ? 'bg-gray-100' : ''} 
                        ${plan.id === 'premium' ? 'bg-violet-100 text-violet-800' : ''} 
                        ${plan.id === 'pro' ? 'bg-green-100 text-green-800' : ''}
                      `}
                    >
                      {plan.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.max_habits}</TableCell>
                  <TableCell>{formatPrice(plan.price)}</TableCell>
                  <TableCell>
                    {plan.has_statistics ? 
                      <Check className="h-5 w-5 text-green-500" /> : 
                      <X className="h-5 w-5 text-gray-400" />
                    }
                  </TableCell>
                  <TableCell>
                    {plan.has_achievements ? 
                      <Check className="h-5 w-5 text-green-500" /> : 
                      <X className="h-5 w-5 text-gray-400" />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlansList;
