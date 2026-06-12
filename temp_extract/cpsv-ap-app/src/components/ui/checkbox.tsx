// src/components/ui/checkbox.tsx
import React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = ({ checked, onCheckedChange, className, ...props }: any) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900 cursor-pointer",
        className
      )}
      {...props}
    />
  );
};
Checkbox.displayName = "Checkbox";
