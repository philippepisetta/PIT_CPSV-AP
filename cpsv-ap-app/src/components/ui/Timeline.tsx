// src/components/ui/Timeline.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string | number;
  title: string;
  subtitle?: string;
  date?: string;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  Icon?: LucideIcon;
  color?: "teal" | "blue" | "emerald" | "amber" | "rose" | "purple";
  extra?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  emptyMessage?: string;
}

export default function Timeline({
  items,
  emptyMessage = "Aucun historique disponible.",
}: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-muted italic bg-glass border border-muted/20 border-dashed rounded-xl p-4">
        {emptyMessage}
      </div>
    );
  }

  const dotColorClasses = {
    teal: "bg-teal-500 ring-teal-500/20 text-teal-600 dark:text-teal-400",
    blue: "bg-blue-500 ring-blue-500/20 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500 ring-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500 ring-amber-500/20 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500 ring-rose-500/20 text-rose-600 dark:text-rose-455",
    purple: "bg-purple-500 ring-purple-500/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="relative pl-6 border-l border-muted/20 space-y-6 ml-2 pt-2 pb-2">
      {items.map((item, idx) => {
        const itemColor = item.color || "teal";
        const dotColor = dotColorClasses[itemColor] || dotColorClasses.teal;
        const Icon = item.Icon;

        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Connector Dot / Icon */}
            <div className={cn(
              "absolute -left-[31px] top-0.5 rounded-full flex items-center justify-center ring-4 transition-transform duration-200 group-hover:scale-110",
              Icon ? "h-6.5 w-6.5 bg-background border border-muted/30" : "h-3 w-3 bg-teal-500 ring-teal-500/20"
            )}>
              {Icon ? (
                <Icon className={cn("h-3.5 w-3.5", item.color ? `text-${itemColor}-600 dark:text-${itemColor}-400` : "text-teal-600 dark:text-teal-400")} />
              ) : (
                <div className={cn("h-1.5 w-1.5 rounded-full", dotColor.split(" ")[0])} />
              )}
            </div>

            <div className="space-y-1 bg-glass/25 border border-muted/10 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <h4 className="font-bold text-xs text-text">{item.title}</h4>
                  {item.subtitle && (
                    <p className="text-[10px] text-muted">{item.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {item.badge && <div className="text-[9px]">{item.badge}</div>}
                  {item.date && (
                    <span className="text-[9px] font-medium text-muted">
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
              
              {item.description && (
                <div className="text-xs text-text/90 leading-relaxed pt-1.5 border-t border-muted/5 mt-1.5">
                  {item.description}
                </div>
              )}

              {item.extra && (
                <div className="pt-2">{item.extra}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
