// src/design-system/PITEntityCard.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PITEntityCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  type: "service" | "filiere" | "parcours" | "ecosystem" | "organisation" | "programme" | "projet" | "activity" | "beneficiary" | "dataset" | "knowledge-asset" | "recommendation" | "strategy";
  tags?: string[];
  status?: string;
  statusColor?: "green" | "yellow" | "red" | "blue" | "gray";
  actions?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  subtitle?: string;
  className?: string;
}

export default function PITEntityCard({
  title,
  description,
  icon: Icon,
  type,
  tags = [],
  status,
  statusColor = "green",
  actions,
  onClick,
  isSelected,
  subtitle,
  className,
}: PITEntityCardProps) {
  const statusColorClasses = {
    green: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
    yellow: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    red: "bg-red-500/10 text-red-605 dark:text-red-400 border border-red-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    gray: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
  };

  const typeBadgeClasses = {
    service: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20",
    filiere: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    parcours: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20",
    ecosystem: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20",
    organisation: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
    programme: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20",
    projet: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/20",
    activity: "bg-slate-500/10 text-slate-705 dark:text-slate-400 border border-slate-500/20",
    beneficiary: "bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/20",
    dataset: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20",
    "knowledge-asset": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20",
    recommendation: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
    strategy: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20",
  };

  const typeLabels = {
    service: "Service CPSV",
    filiere: "Filière S3",
    parcours: "Parcours",
    ecosystem: "Écosystème",
    organisation: "Opérateur",
    programme: "Programme",
    projet: "Projet",
    activity: "Activité / Intervention",
    beneficiary: "Bénéficiaire",
    dataset: "Jeu de données",
    "knowledge-asset": "Actif de connaissances",
    recommendation: "Recommandation",
    strategy: "Stratégie",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 flex items-start gap-4 transition-all duration-200 bg-glass/40 w-full text-left",
        onClick ? "cursor-pointer hover:shadow-xs" : "",
        isSelected
          ? "border-teal-700 bg-teal-700/5 dark:border-teal-400 dark:bg-teal-400/5 shadow-inner"
          : "border-muted/20 hover:border-muted hover:bg-glass/80",
        className
      )}
    >
      {/* Left Side: Icon Container */}
      <div
        className={cn(
          "rounded-xl p-3 shrink-0 flex items-center justify-center bg-teal-500/10 text-teal-650 dark:text-teal-400",
          isSelected ? "bg-teal-500/20 text-teal-700 dark:text-teal-400" : ""
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Center: Info Block */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded",
              typeBadgeClasses[type]
            )}
          >
            {typeLabels[type]}
          </span>
          {subtitle && (
            <span className="text-[10px] text-muted truncate">{subtitle}</span>
          )}
        </div>

        <h4 className="font-extrabold text-sm text-text leading-tight truncate">
          {title}
        </h4>

        {description && (
          <p className="text-xs text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded bg-glass border border-muted/20 text-[9px] font-bold text-text/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Status / Actions */}
      <div className="flex flex-col justify-between items-end gap-3 self-stretch shrink-0">
        {status && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider",
              statusColorClasses[statusColor]
            )}
          >
            {status}
          </span>
        )}
        {actions && (
          <div className="flex items-center gap-1.5 mt-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
