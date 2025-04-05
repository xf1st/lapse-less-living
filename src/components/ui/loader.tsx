
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  gradient?: boolean;
}

export function Loader({ size = "md", className, gradient = false }: LoaderProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (gradient) {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 animate-spin"></div>
        <div className="absolute inset-[20%] rounded-full bg-white"></div>
      </div>
    );
  }

  return (
    <Loader2 
      className={cn(
        "animate-spin text-muted-foreground", 
        sizeClasses[size],
        className
      )} 
    />
  );
}
