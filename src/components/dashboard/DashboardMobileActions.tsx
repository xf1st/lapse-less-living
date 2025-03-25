
import React from "react";
import { PlusCircle, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardMobileActionsProps = {
  createHabit: () => void;
  createFolder: () => void;
};

const DashboardMobileActions = ({ 
  createHabit, 
  createFolder 
}: DashboardMobileActionsProps) => {
  return (
    <div className="md:hidden fixed bottom-6 right-6 flex flex-col space-y-2">
      <Button
        onClick={createFolder}
        className="h-12 w-12 rounded-full shadow-lg bg-white border border-brand-blue text-brand-blue hover:bg-gray-50"
      >
        <FolderPlus className="h-5 w-5" />
      </Button>
      <Button
        onClick={createHabit}
        className="h-14 w-14 rounded-full shadow-lg bg-brand-blue hover:bg-brand-blue/90"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default DashboardMobileActions;
