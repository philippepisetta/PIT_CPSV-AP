// src/components/ui/badge.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary-500 text-white hover:bg-primary-500/80",
        variant === "secondary" && "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-100",
        variant === "destructive" && "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        variant === "outline" && "text-gray-950 border-gray-200 dark:text-gray-50 dark:border-gray-800",
        className
      )}
      {...props}
    />
  );
}
