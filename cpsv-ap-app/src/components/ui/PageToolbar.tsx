// src/components/ui/PageToolbar.tsx
"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface PageToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  extraControls?: React.ReactNode;
}

export default function PageToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filtrer",
  extraControls,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-glass border border-muted/20 p-4 rounded-2xl shadow-sm mb-6 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-glass border border-muted/30 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-text placeholder-muted transition-colors"
        />
      </div>

      {onFilterChange && filterOptions && (
        <div className="flex items-center gap-2 w-full md:w-auto min-w-[200px]">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-text transition-colors"
          >
            <option value="">{filterLabel}</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {extraControls && (
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {extraControls}
        </div>
      )}
    </div>
  );
}
