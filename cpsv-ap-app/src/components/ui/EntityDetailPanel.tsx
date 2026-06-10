// src/components/ui/EntityDetailPanel.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Info, Share2, Activity, Database } from "lucide-react";

interface EntityDetailPanelProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  overviewTab: React.ReactNode;
  relationsTab?: React.ReactNode;
  activityTab?: React.ReactNode;
  metadataTab: React.ReactNode;
  actions?: React.ReactNode;
}

export default function EntityDetailPanel({
  title,
  subtitle,
  badge,
  overviewTab,
  relationsTab,
  activityTab,
  metadataTab,
  actions,
}: EntityDetailPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "relations" | "activity" | "metadata">("overview");

  return (
    <div className="bg-glass border border-muted/20 rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300">
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-muted/20 pb-4">
        <div className="space-y-1">
          {badge && <div className="inline-block">{badge}</div>}
          <h2 className="text-xl font-black text-text tracking-tight mt-1">{title}</h2>
          {subtitle && <p className="text-xs text-muted leading-relaxed">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Detail Tabs */}
      <div className="flex border-b border-muted/10 pb-2 gap-4 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={cn(
            "pb-1 text-xs font-bold border-b-2 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5 shrink-0",
            activeSubTab === "overview"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text"
          )}
        >
          <Info className="h-3.5 w-3.5" />
          Vue d'ensemble
        </button>

        {relationsTab && (
          <button
            onClick={() => setActiveSubTab("relations")}
            className={cn(
              "pb-1 text-xs font-bold border-b-2 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5 shrink-0",
              activeSubTab === "relations"
                ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            <Share2 className="h-3.5 w-3.5" />
            Relations
          </button>
        )}

        {activityTab && (
          <button
            onClick={() => setActiveSubTab("activity")}
            className={cn(
              "pb-1 text-xs font-bold border-b-2 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5 shrink-0",
              activeSubTab === "activity"
                ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            <Activity className="h-3.5 w-3.5" />
            Activités & Suivi
          </button>
        )}

        <button
          onClick={() => setActiveSubTab("metadata")}
          className={cn(
            "pb-1 text-xs font-bold border-b-2 transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5 shrink-0",
            activeSubTab === "metadata"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text"
          )}
        >
          <Database className="h-3.5 w-3.5" />
          Métadonnées
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2 animate-in fade-in duration-200">
        {activeSubTab === "overview" && overviewTab}
        {activeSubTab === "relations" && relationsTab}
        {activeSubTab === "activity" && activityTab}
        {activeSubTab === "metadata" && metadataTab}
      </div>
    </div>
  );
}
