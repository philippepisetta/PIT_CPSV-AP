// src/components/ui/SplitLayout.tsx
"use client";

import React from "react";

interface SplitLayoutProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  leftColSpan?: number; // e.g. 4 or 5 out of 12
}

export default function SplitLayout({
  leftPane,
  rightPane,
  leftColSpan = 4,
}: SplitLayoutProps) {
  const rightColSpan = 12 - leftColSpan;

  // Map numbers to Tailwind classes to avoid dynamic template string issues
  const leftColClasses: Record<number, string> = {
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
  };

  const rightColClasses: Record<number, string> = {
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
  };

  const leftClass = leftColClasses[leftColSpan] || "lg:col-span-4";
  const rightClass = rightColClasses[rightColSpan] || "lg:col-span-8";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left List Column */}
      <section className={`${leftClass} space-y-4`} aria-label="Panneau de navigation">
        {leftPane}
      </section>

      {/* Right Detail / Workspace Column */}
      <section className={`${rightClass} space-y-6`} aria-label="Panneau de détails">
        {rightPane}
      </section>
    </div>
  );
}
