
import React, { createContext, useContext, useState } from "react";
import { AdminUserData, PlanData, UserProfile } from "@/types/admin";

type AdminContextType = {
  users: AdminUserData[];
  setUsers: React.Dispatch<React.SetStateAction<AdminUserData[]>>;
  plans: PlanData[];
  setPlans: React.Dispatch<React.SetStateAction<PlanData[]>>;
  selectedUser: UserProfile | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        plans,
        setPlans,
        selectedUser,
        setSelectedUser,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
