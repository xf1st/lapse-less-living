
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileHeader from "./DashboardMobileHeader";
import DashboardMobileActions from "./DashboardMobileActions";
import { Plan } from "@/types/habit";

type DashboardLayoutProps = {
  children: React.ReactNode;
  userPlan: Plan | null;
  createHabit: () => void;
  createFolder: () => void;
};

const DashboardLayout = ({ 
  children, 
  userPlan, 
  createHabit, 
  createFolder 
}: DashboardLayoutProps) => {
  const { user, signOut, loading: authLoading } = useAuth();

  // Check if user is admin for admin panel access
  const isAdmin = user?.email === "admin@admin.com";

  // Show main loader when authenticating
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <DashboardSidebar 
        userPlan={userPlan} 
        isAdmin={isAdmin} 
        signOut={signOut} 
        userEmail={user?.email}
      />

      {/* Mobile header */}
      <DashboardMobileHeader 
        userPlan={userPlan} 
        isAdmin={isAdmin} 
        signOut={signOut} 
        userEmail={user?.email}
      />

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-16">
        {children}
      </main>

      {/* Mobile add buttons */}
      <DashboardMobileActions createHabit={createHabit} createFolder={createFolder} />
    </div>
  );
};

export default DashboardLayout;
