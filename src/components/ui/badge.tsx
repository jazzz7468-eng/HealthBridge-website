import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

const badgeVariants = (variant: string) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-white hover:bg-primary-600",
    secondary: "border-transparent bg-secondary text-white hover:bg-secondary-800",
    destructive: "border-transparent bg-urgent text-white hover:bg-urgent-600",
    outline: "text-slate-950 border-slate-200",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
  };

  return cn(base, variants[variant] || variants.default);
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants(variant), className)} {...props} />
  );
}

export { Badge, badgeVariants };
