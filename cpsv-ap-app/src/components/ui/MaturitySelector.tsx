// src/components/ui/MaturitySelector.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface MaturityAxis {
  key: string;
  label: string;
  value: number;
}

interface MaturitySelectorProps {
  axes: MaturityAxis[];
  onChange: (key: string, value: number) => void;
}

export default function MaturitySelector({
  axes,
  onChange,
}: MaturitySelectorProps) {
  return (
    <div className="space-y-4 bg-glass border border-muted/20 p-4 rounded-xl">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5 mb-3">
        Évaluation de Maturité (Scores de 1 à 5)
      </h4>
      <div className="space-y-4">
        {axes.map((axis) => (
          <div key={axis.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-text">{axis.label}</span>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => {
                const isSelected = axis.value >= level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onChange(axis.key, level)}
                    className={cn(
                      "p-1.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-center",
                      isSelected
                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 shadow-sm"
                        : "bg-surface/50 border-muted/20 text-muted hover:text-text hover:border-muted/40"
                    )}
                    aria-label={`Niveau ${level}`}
                  >
                    <Star className={cn("h-4 w-4", isSelected ? "fill-teal-500 text-teal-500 dark:fill-teal-400 dark:text-teal-400" : "text-muted/65")} />
                  </button>
                );
              })}
              <span className="text-xs font-black text-teal-600 dark:text-teal-400 ml-2 min-w-[30px] text-right">
                {axis.value} / 5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
