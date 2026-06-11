// src/design-system/PITPageHeader.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PITTypography } from "./PITTypography";

interface PITPageHeaderProps {
  title: string;
  description?: string;
  category?: string;
  Icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function PITPageHeader({
  title,
  description,
  category = "PLATEFORME D'INTELLIGENCE TERRITORIALE",
  Icon,
  actions,
}: PITPageHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-gray-100 dark:border-gray-800 pb-5 gap-4 mb-6 w-full">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
          {category}
        </span>
        <h1 className={PITTypography.h1}>
          {Icon && <Icon className="text-teal-605 dark:text-teal-400 w-5 h-5 animate-pulse shrink-0" />}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-xs text-muted dark:text-gray-400 mt-1.5 leading-relaxed max-w-4xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full xl:w-auto justify-start xl:justify-end mt-3 xl:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
