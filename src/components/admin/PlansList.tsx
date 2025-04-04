
import React from "react";
import { useAdmin } from "./AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PlansList: React.FC = () => {
  const { plans, loading, error } = useAdmin();

  if (loading) {
    return <div className="text-center py-4">Загрузка тарифов...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
        <p className="font-medium">Ошибка загрузки тарифов:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-600 mb-4">
        Тарифы не найдены
      </div>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Тарифные планы</CardTitle>
        <CardDescription>
          Информация о доступных тарифных планах
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Список доступных тарифов системы</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Макс. привычек</TableHead>
              <TableHead className="text-center">Статистика</TableHead>
              <TableHead className="text-center">Достижения</TableHead>
              <TableHead className="text-right">Цена</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell className="font-mono text-xs">{plan.id}</TableCell>
                <TableCell className="text-right">{plan.max_habits}</TableCell>
                <TableCell className="text-center">
                  {plan.has_statistics ? (
                    <Check className="h-4 w-4 mx-auto text-green-500" />
                  ) : (
                    <X className="h-4 w-4 mx-auto text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {plan.has_achievements ? (
                    <Check className="h-4 w-4 mx-auto text-green-500" />
                  ) : (
                    <X className="h-4 w-4 mx-auto text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {plan.price ? `${plan.price} ₽` : "Бесплатно"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlansList;
