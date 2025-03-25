
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DashboardMobileMenu from "./DashboardMobileMenu";
import { Plan } from "@/types/habit";

type DashboardMobileHeaderProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => void;
  userEmail?: string | null;
};

const DashboardMobileHeader = ({ 
  userPlan, 
  isAdmin, 
  signOut,
  userEmail 
}: DashboardMobileHeaderProps) => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
      <a href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
        <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
          LapseLess
        </span>
      </a>

      <Sheet
        open={showMobileMenu}
        onOpenChange={setShowMobileMenu}
      >
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <span className="font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
                  LapseLess
                </span>
              </div>
            </SheetTitle>
            <SheetDescription>
              {userEmail}
            </SheetDescription>
          </SheetHeader>
          <DashboardMobileMenu 
            userPlan={userPlan} 
            isAdmin={isAdmin} 
            signOut={signOut} 
            setShowMobileMenu={setShowMobileMenu} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardMobileHeader;
