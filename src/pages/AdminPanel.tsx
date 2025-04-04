
import React from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import UsersList from "@/components/admin/UsersList";
import UserDetails from "@/components/admin/UserDetails";
import PlansList from "@/components/admin/PlansList";
import { useAdmin } from "@/components/admin/AdminContext";
import { Users, ShieldCheck } from "lucide-react";

const AdminPanel: React.FC = () => {
  const { selectedUser, error } = useAdmin();

  return (
    <AdminPageWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Панель администратора</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-6">
            <p className="font-medium">Ошибка:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-medium">Управление пользователями</h2>
          </div>
          <UsersList />
          {selectedUser && <UserDetails />}
        </div>

        <PlansList />
      </div>
    </AdminPageWrapper>
  );
};

export default AdminPanel;
