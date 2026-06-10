// src/components/ui/MultiTagSelector.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  id: number;
  name: string;
}

interface MultiTagSelectorProps {
  label: string;
  options: Option[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  color?: "teal" | "blue" | "purple" | "amber";
}

export default function MultiTagSelector({
  label,
  options,
  selectedIds,
  onChange,
  color = "teal",
}: MultiTagSelectorProps) {
  const toggleId = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const colors = {
    teal: {
      active: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
      inactive: "bg-glass border-muted/20 text-muted hover:text-text hover:border-muted/50",
    },
    blue: {
      active: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      inactive: "bg-glass border-muted/20 text-muted hover:text-text hover:border-muted/50",
    },
    purple: {
      active: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      inactive: "bg-glass border-muted/20 text-muted hover:text-text hover:border-muted/50",
    },
    amber: {
      active: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      inactive: "bg-glass border-muted/20 text-muted hover:text-text hover:border-muted/50",
    },
  };

  const activeColor = colors[color]?.active || colors.teal.active;
  const inactiveColor = colors[color]?.inactive || colors.teal.inactive;

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-muted/10 rounded-xl bg-glass/10 scrollbar-thin">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleId(opt.id)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200 cursor-pointer",
                isSelected ? activeColor : inactiveColor
              )}
            >
              {opt.name}
            </button>
          );
        })}
        {options.length === 0 && (
          <span className="text-[10px] text-muted italic p-2">Aucune option disponible.</span>
        )}
      </div>
    </div>
  );
}
