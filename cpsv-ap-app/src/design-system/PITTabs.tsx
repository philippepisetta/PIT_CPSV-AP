// src/design-system/PITTabs.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface PITTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pills" | "underlined";
  className?: string;
}

export default function PITTabs({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  className,
}: PITTabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={cn(
          "flex bg-gray-105 dark:bg-gray-800/85 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner w-fit max-w-full overflow-x-auto scrollbar-none",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 bg-transparent shrink-0",
                isActive
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Underlined style
  return (
    <div
      className={cn(
        "flex border-b border-gray-150 dark:border-gray-800/80 pb-2 gap-6 overflow-x-auto scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-1 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer border-0 bg-transparent flex items-center gap-1.5 shrink-0",
              isActive
                ? "border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400 font-extrabold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
