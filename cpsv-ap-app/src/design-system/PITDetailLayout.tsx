// src/design-system/PITDetailLayout.tsx
"use client";

import React, { useState } from "react";
import { Info, Share2, TrendingUp, Database, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import PITTabs, { TabOption } from "./PITTabs";

interface PITDetailLayoutProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  overviewTab: React.ReactNode;
  relationsTab?: React.ReactNode;
  impactTab?: React.ReactNode;
  contributionsTab?: React.ReactNode;
  metadataTab: React.ReactNode;
  historyTab?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  overviewLabel?: string;
  relationsLabel?: string;
  impactLabel?: string;
  contributionsLabel?: string;
  metadataLabel?: string;
}

export default function PITDetailLayout({
  title,
  subtitle,
  badge,
  overviewTab,
  relationsTab,
  impactTab,
  contributionsTab,
  metadataTab,
  historyTab,
  actions,
  className,
  overviewLabel,
  relationsLabel,
  impactLabel,
  contributionsLabel,
  metadataLabel,
}: PITDetailLayoutProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("overview");

  // Build active tabs array dynamically
  const detailTabs = React.useMemo(() => {
    const list: TabOption[] = [
      { id: "overview", label: overviewLabel || "Vue d'ensemble", icon: Info },
    ];
    if (relationsTab) list.push({ id: "relations", label: relationsLabel || "Relations", icon: Share2 });
    if (impactTab) list.push({ id: "impact", label: impactLabel || "Parcours actifs", icon: TrendingUp });
    if (contributionsTab) list.push({ id: "contributions", label: contributionsLabel || "Contributions", icon: TrendingUp });
    list.push({ id: "metadata", label: metadataLabel || "Métadonnées", icon: Database });
    if (historyTab) list.push({ id: "history", label: "Historique", icon: Clock });
    return list;
  }, [relationsTab, impactTab, contributionsTab, historyTab, overviewLabel, relationsLabel, impactLabel, contributionsLabel, metadataLabel]);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-6 transition-all duration-300 w-full",
        className
      )}
    >
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 dark:border-gray-850 pb-4">
        <div className="space-y-1">
          {badge && <div className="inline-block">{badge}</div>}
          <h2 className="text-xl font-black text-text tracking-tight mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Detail Tabs */}
      <PITTabs
        tabs={detailTabs}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
        variant="underlined"
      />

      {/* Tab Contents */}
      <div className="pt-2 animate-in fade-in duration-200">
        <div className={cn(activeSubTab !== "overview" && "hidden")}>
          {overviewTab}
        </div>
        {relationsTab && (
          <div className={cn(activeSubTab !== "relations" && "hidden")}>
            {relationsTab}
          </div>
        )}
        {impactTab && (
          <div className={cn(activeSubTab !== "impact" && "hidden")}>
            {impactTab}
          </div>
        )}
        {contributionsTab && (
          <div className={cn(activeSubTab !== "contributions" && "hidden")}>
            {contributionsTab}
          </div>
        )}
        <div className={cn(activeSubTab !== "metadata" && "hidden")}>
          {metadataTab}
        </div>
        {historyTab && (
          <div className={cn(activeSubTab !== "history" && "hidden")}>
            {historyTab}
          </div>
        )}
      </div>
    </div>
  );
}
