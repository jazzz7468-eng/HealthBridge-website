import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = (variant: string, size: string) => {
  const base = "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants: Record<string, string> = {
    default: "bg-primary hover:bg-primary-600 text-white shadow-md",
    destructive: "bg-urgent hover:bg-urgent-600 text-white shadow-md",
    outline: "border border-slate-200 hover:bg-slate-100 hover:text-secondary-900",
    secondary: "bg-secondary text-white hover:bg-secondary-800 shadow-md",
    ghost: "hover:bg-slate-100 hover:text-secondary-900",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const sizes: Record<string, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-xl",
    lg: "h-11 px-8 rounded-2xl",
    icon: "h-10 w-10",
  };

  return cn(base, variants[variant] || variants.default, sizes[size] || sizes.default);
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants(variant, size), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
