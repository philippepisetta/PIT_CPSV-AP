// src/components/ui/StatCard.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  color?: "teal" | "blue" | "emerald" | "amber" | "rose" | "purple";
  description?: string;
}

export default function StatCard({
  label,
  value,
  Icon,
  color = "teal",
  description,
}: StatCardProps) {
  const colorSchemes = {
    teal: {
      bg: "from-teal-500 to-emerald-500",
      text: "text-teal-600 dark:text-teal-400",
      iconBg: "bg-teal-500/10",
    },
    blue: {
      bg: "from-blue-500 to-indigo-500",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    emerald: {
      bg: "from-emerald-500 to-green-500",
      text: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    amber: {
      bg: "from-amber-500 to-orange-500",
      text: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    rose: {
      bg: "from-rose-500 to-pink-500",
      text: "text-rose-600 dark:text-rose-455",
      iconBg: "bg-rose-500/10",
    },
    purple: {
      bg: "from-purple-500 to-violet-500",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500/10",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.teal;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-glass border border-muted/20 p-5 group shadow-sm">
      {/* Decorative background glow */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.03] blur-xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-[0.06]",
        scheme.bg
      )} />
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            {label}
          </span>
          <p className="text-2xl font-extrabold text-text tracking-tight mt-1">
            {value}
          </p>
        </div>
        <div className={cn("rounded-lg p-2.5 shrink-0", scheme.iconBg, scheme.text)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="text-[9px] text-muted/80 mt-2 italic truncate">
          {description}
        </p>
      )}
    </div>
  );
}
