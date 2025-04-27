import React from "react";
import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AdminUserData } from "@/types/admin";
import { fetchUserDetails } from "@/services/adminService";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersList: React.FC = () => {
  const { users, loading, error, setSelectedUser, setLoading } = useAdmin();

  const handleViewUser = async (user: AdminUserData) => {
    try {
      setLoading(true);
      const userDetails = await fetchUserDetails(user.user_id);
      setSelectedUser(userDetails);
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Загрузка пользователей...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
        <p className="font-medium">Ошибка загрузки пользователей:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-600 mb-4">
        Пользователи не найдены
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableCaption>Список пользователей системы</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Последний вход</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_email}</TableCell>
              <TableCell>
                {user.last_sign_in_at
                  ? formatDistanceToNow(new Date(user.last_sign_in_at), {
                      addSuffix: true,
                      locale: ru,
                    })
                  : "Никогда"}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewUser(user)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Детали
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
