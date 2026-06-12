// src/components/ui/select.tsx
import React from "react";
import { cn } from "@/lib/utils";

export const Select = ({ onValueChange, children, defaultValue, ...props }: any) => {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-primary-500 text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }: any) => <>{children}</>;
export const SelectValue = ({ placeholder }: any) => null; // ignore placeholder since select has no inner children
export const SelectContent = ({ children }: any) => <>{children}</>;
export const SelectItem = ({ value, children }: any) => (
  <option value={value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {children}
  </option>
);
