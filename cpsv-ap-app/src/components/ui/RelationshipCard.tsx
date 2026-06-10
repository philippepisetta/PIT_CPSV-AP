// src/components/ui/RelationshipCard.tsx
"use client";

import React from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelationshipCardProps {
  title: string;
  relationType: string;
  Icon: LucideIcon;
  description?: string;
  onClick?: () => void;
  badge?: string;
}

export default function RelationshipCard({
  title,
  relationType,
  Icon,
  description,
  onClick,
  badge,
}: RelationshipCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-muted/20 bg-glass/40 p-3.5 flex items-start space-x-3.5 transition-all duration-200",
        onClick ? "hover:bg-glass hover:border-teal-500/30 cursor-pointer hover:shadow-sm" : ""
      )}
    >
      <div className="rounded-lg p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/95">
            {relationType}
          </span>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="font-bold text-xs text-text truncate mt-1">{title}</p>
        {description && (
          <p className="text-[10px] text-muted truncate mt-0.5">{description}</p>
        )}
      </div>

      {onClick && (
        <ArrowRight className="h-4 w-4 text-muted/60 self-center shrink-0 group-hover:text-teal-500 transition-colors" />
      )}
    </div>
  );
}
