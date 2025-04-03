
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  handleSignOut: () => Promise<void>;
}

const AdminHeader = ({ handleSignOut }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
                LapseLess Admin
              </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-brand-blue flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              К приложению
            </a>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
