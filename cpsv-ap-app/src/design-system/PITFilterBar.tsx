// src/design-system/PITFilterBar.tsx
"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectFilter {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}

export interface QuickFilter {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface PITFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  selectFilters?: SelectFilter[];
  quickFilters?: QuickFilter[];
  extraControls?: React.ReactNode;
  className?: string;
}

export default function PITFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  selectFilters,
  quickFilters,
  extraControls,
  className,
}: PITFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 p-4 rounded-2xl shadow-sm w-full mb-6",
        className
      )}
    >
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-teal-700 dark:focus:border-teal-400 text-text placeholder-muted transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-3.5 text-muted hover:text-text bg-transparent border-0 cursor-pointer p-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Select dropdown filters */}
        {selectFilters &&
          selectFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center gap-2 w-full md:w-auto min-w-[200px]"
            >
              <Filter className="h-4 w-4 text-muted shrink-0" />
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-700 dark:focus:border-teal-400 text-text transition-colors"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

        {extraControls && (
          <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-end shrink-0">
            {extraControls}
          </div>
        )}
      </div>

      {/* Quick tag filters */}
      {quickFilters && quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center w-full pt-3.5 border-t border-muted/10">
          <span className="text-[9px] font-extrabold text-muted uppercase tracking-wider mr-2 select-none">
            Filtres rapides :
          </span>
          {quickFilters.map((qf) => (
            <button
              key={qf.id}
              onClick={qf.onClick}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-extrabold border transition cursor-pointer bg-transparent",
                qf.isActive
                  ? "bg-teal-700 border-teal-700 dark:bg-teal-650 dark:border-teal-650 text-white"
                  : "border-gray-200 dark:border-gray-750 text-gray-500 hover:text-text hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              {qf.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
