// src/design-system/PITLayout.tsx
"use client";

import React from "react";
import PITPageHeader from "./PITPageHeader";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PITLayoutProps {
  category?: string;
  title: string;
  description?: string;
  pageIcon?: any;
  breadcrumb?: BreadcrumbItem[];
  contextRibbon?: React.ReactNode;
  kpis?: React.ReactNode;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contextPanel?: React.ReactNode;
  className?: string;
}

export default function PITLayout({
  category,
  title,
  description,
  pageIcon,
  breadcrumb,
  contextRibbon,
  kpis,
  tabs,
  actions,
  children,
  contextPanel,
  className,
}: PITLayoutProps) {
  return (
    <div className={cn("space-y-6 w-full max-w-full", className)}>
      {/* 1. Breadcrumbs */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-wider select-none mb-1">
          {breadcrumb.map((item, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-muted/50 shrink-0" />}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-text no-underline text-inherit transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-text font-black" : "text-muted"}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* 2. Page Header */}
      <PITPageHeader
        title={title}
        description={description}
        category={category}
        Icon={pageIcon}
        actions={actions}
      />

      {/* 3. Context Ribbon */}
      {contextRibbon && <div className="w-full">{contextRibbon}</div>}

      {/* 4. KPI Strip */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {kpis}
        </div>
      )}

      {/* 5. Tabs switcher */}
      {tabs && <div className="w-full">{tabs}</div>}

      {/* 6. Main Content Area & Optional Context Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        <div className={cn("w-full", contextPanel ? "xl:col-span-8" : "xl:col-span-12")}>
          {children}
        </div>
        {contextPanel && (
          <div className="xl:col-span-4 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-850 p-5 rounded-2xl shadow-sm space-y-4">
            {contextPanel}
          </div>
        )}
      </div>
    </div>
  );
}
