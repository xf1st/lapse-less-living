
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import AdminDataProvider from "@/components/admin/AdminDataProvider";

const AdminPanel = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AdminPageWrapper>
      <AdminDataProvider>
        {({ users, plans, loading, makeAdmin }) => (
          <div className="min-h-screen bg-gray-50">
            <AdminHeader handleSignOut={handleSignOut} />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
                  <p className="text-gray-600">Управление пользователями и тарифами</p>
                </div>
              </div>
              
              <AdminDashboardStats users={users} plans={plans} />
              
              <AdminUserManagement 
                users={users} 
                plans={plans} 
                loading={loading} 
                makeAdmin={makeAdmin}
              />
            </main>
          </div>
        )}
      </AdminDataProvider>
    </AdminPageWrapper>
  );
};

export default AdminPanel;
