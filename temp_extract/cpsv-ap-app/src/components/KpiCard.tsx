// src/components/KpiCard.tsx

"use client";

import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  IconName: string;
}

export default function KpiCard({ label, value, IconName }: KpiCardProps) {
  const Icon = (LucideIcons as any)[IconName] || 
               (LucideIcons as any)[IconName.replace("Icon", "")] || 
               LucideIcons.HelpCircle;

  return (
    <div
      className={cn(
        "flex items-center rounded-xl bg-surface p-4 shadow-card backdrop-blur-sm",
        "hover:shadow-glass transition-shadow",
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-xl font-semibold text-text">{value}</span>
      </div>
    </div>
  );
}
