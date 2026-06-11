// src/design-system/PITContextRibbon.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RibbonSegment {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface PITContextRibbonProps {
  segments: RibbonSegment[];
  className?: string;
}

export default function PITContextRibbon({
  segments,
  className,
}: PITContextRibbonProps) {
  if (!segments || segments.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold text-muted uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-150 dark:border-gray-800 w-fit max-w-full mb-4",
        className
      )}
    >
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const SegmentContent = () => (
          <span
            className={cn(
              "flex items-center gap-1 transition-colors",
              isLast
                ? "text-teal-650 dark:text-teal-400 font-black"
                : "hover:text-text cursor-pointer"
            )}
          >
            {seg.icon && <seg.icon className="h-3.5 w-3.5 shrink-0" />}
            <span>{seg.label}</span>
          </span>
        );

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted/50 shrink-0" />}
            {seg.href && !isLast ? (
              <Link href={seg.href} className="no-underline text-inherit">
                <SegmentContent />
              </Link>
            ) : (
              <SegmentContent />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
