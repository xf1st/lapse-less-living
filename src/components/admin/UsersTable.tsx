
import React from "react";
import { UserProfile } from "@/types/admin";
import { Plan } from "@/types/habit";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { Edit, Crown, Trash2 } from "lucide-react";

interface UsersTableProps {
  filteredUsers: UserProfile[];
  loading: boolean;
  getPlanName: (planId: string) => string;
  selectUser: (user: UserProfile) => void;
  makeAdmin: (userId: string) => Promise<void>;
}

const UsersTable = ({
  filteredUsers,
  loading,
  getPlanName,
  selectUser,
  makeAdmin
}: UsersTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Тариф</TableHead>
            <TableHead className="text-right">Привычек</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ContextMenu key={user.id}>
                <ContextMenuTrigger asChild>
                  <TableRow className="cursor-context-menu">
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          user.plan_id === "basic" ? "bg-gray-400" :
                          user.plan_id === "premium" ? "bg-purple-500" :
                          "bg-green-500"
                        )}></div>
                        {getPlanName(user.plan_id)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{user.habits_count}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectUser(user)}
                      >
                        Изменить тариф
                      </Button>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                  <ContextMenuItem onClick={() => selectUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Изменить тариф
                    <ContextMenuShortcut>⌘E</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => makeAdmin(user.id)}>
                    <Crown className="mr-2 h-4 w-4" />
                    Назначить администратором
                    <ContextMenuShortcut>⌘A</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить пользователя
                    <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader size="sm" />
                  </div>
                ) : (
                  "Пользователи не найдены"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
