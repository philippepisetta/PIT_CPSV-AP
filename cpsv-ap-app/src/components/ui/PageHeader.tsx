// src/components/ui/PageHeader.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  category?: string;
  Icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  category = "Plateforme d'Intelligence Territoriale",
  Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-muted/30 pb-5 gap-4 mb-6">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
          {category}
        </span>
        <h1 className="text-2xl font-black tracking-tight text-text flex items-center gap-2 mt-1">
          {Icon && <Icon className="text-teal-600 dark:text-teal-400 w-6 h-6 animate-pulse" />}
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
