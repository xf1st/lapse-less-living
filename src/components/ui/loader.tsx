
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md", ...props }: LoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className={cn("rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center animate-spin", sizeClasses[size])}>
          <div className={cn("w-[35%] h-[35%] rounded-full bg-white")}></div>
        </div>
      </div>
    </div>
  );
}
