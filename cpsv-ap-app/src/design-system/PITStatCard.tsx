// src/design-system/PITStatCard.tsx
"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PITStatCardProps {
  label: string;
  value: string | number;
  Icon?: LucideIcon;
  icon?: LucideIcon;
  color?: "teal" | "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo" | "slate" | "gray";
  themeColor?: "teal" | "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo" | "slate" | "gray";
  variation?: {
    value: string | number;
    type: "positive" | "negative" | "neutral";
  };
  tooltip?: string;
  description?: string;
  className?: string;
}

export default function PITStatCard({
  label,
  value,
  Icon,
  icon,
  color,
  themeColor,
  variation,
  tooltip,
  description,
  className,
}: PITStatCardProps) {
  const ActiveIcon = Icon || icon || HelpCircle;
  const activeColor = themeColor || color || "teal";

  const colorSchemes = {
    teal: {
      bg: "from-teal-500 to-emerald-500",
      text: "text-teal-650 dark:text-teal-400",
      iconBg: "bg-teal-500/10",
    },
    blue: {
      bg: "from-blue-500 to-indigo-500",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    emerald: {
      bg: "from-emerald-500 to-green-500",
      text: "text-emerald-650 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    amber: {
      bg: "from-amber-500 to-orange-500",
      text: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    rose: {
      bg: "from-rose-500 to-pink-500",
      text: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10",
    },
    purple: {
      bg: "from-purple-500 to-violet-500",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500/10",
    },
    indigo: {
      bg: "from-indigo-500 to-purple-500",
      text: "text-indigo-650 dark:text-indigo-400",
      iconBg: "bg-indigo-500/10",
    },
    slate: {
      bg: "from-slate-500 to-gray-500",
      text: "text-slate-655 dark:text-slate-400",
      iconBg: "bg-slate-500/10",
    },
    gray: {
      bg: "from-gray-500 to-slate-500",
      text: "text-gray-655 dark:text-gray-400",
      iconBg: "bg-gray-500/10",
    },
  };

  const scheme = colorSchemes[activeColor] || colorSchemes.teal;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-glass border border-muted/20 p-5 group shadow-xs w-full transition-all duration-300",
        className
      )}
    >
      {/* Decorative background glow */}
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.03] blur-xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-[0.06]",
          scheme.bg
        )}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
              {label}
            </span>
            {tooltip && (
              <div className="relative group/tooltip">
                <HelpCircle className="h-3 w-3 text-muted/60 hover:text-text cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-lg w-40 text-center z-10 font-normal normal-case">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          <p className="text-2xl font-black text-text tracking-tight mt-1">
            {value}
          </p>
          {description && (
            <p className="text-[10px] text-muted dark:text-gray-400 mt-1 select-none">
              {description}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5 shrink-0", scheme.iconBg, scheme.text)}>
          <ActiveIcon className="h-5 w-5" />
        </div>
      </div>

      {variation && (
        <div className="flex items-center gap-1 mt-2.5 text-[10px]">
          {variation.type === "positive" && (
            <span className="flex items-center font-bold text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              <span>{variation.value}</span>
            </span>
          )}
          {variation.type === "negative" && (
            <span className="flex items-center font-bold text-red-600 dark:text-red-400">
              <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
              <span>{variation.value}</span>
            </span>
          )}
          {variation.type === "neutral" && (
            <span className="font-semibold text-muted">
              {variation.value}
            </span>
          )}
          <span className="text-muted/65 italic select-none">vs mois dernier</span>
        </div>
      )}
    </div>
  );
}
