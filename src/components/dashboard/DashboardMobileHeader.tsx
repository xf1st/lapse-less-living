import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import DashboardMobileMenu from "./DashboardMobileMenu";
import { Plan } from "@/types/habit";

type DashboardMobileHeaderProps = {
  userPlan: Plan | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  userEmail?: string;
};

const DashboardMobileHeader = ({
  userPlan,
  isAdmin,
  signOut,
  userEmail
}: DashboardMobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-30 md:hidden">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span className="ml-2 font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
            LapseLess
          </span>
        </div>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="sm:max-w-xs p-0 bg-background">
          <div className="flex h-16 items-center border-b border-border px-6">
            <div className="flex items-center flex-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span className="ml-2 font-semibold text-lg bg-gradient-to-r from-brand-darkBlue to-brand-blue bg-clip-text text-transparent">
                LapseLess
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5 text-foreground" />
            </Button>
          </div>
          <DashboardMobileMenu 
            userPlan={userPlan} 
            isAdmin={isAdmin} 
            signOut={signOut} 
            userEmail={userEmail}
            onClose={() => setIsMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default DashboardMobileHeader;