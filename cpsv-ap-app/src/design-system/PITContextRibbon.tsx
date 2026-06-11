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
  segments?: RibbonSegment[];
  entity?: any;
  perspective?: "s3" | "transformation" | "impact";
  className?: string;
}

function resolveSemanticSegments(entity: any, perspective: "s3" | "transformation" | "impact" = "s3") {
  const segments: RibbonSegment[] = [];
  if (!entity) return segments;

  if (perspective === "s3") {
    segments.push({ label: "S3 Régional", href: "/value-chains" });
    
    if (entity.strategicDomain) {
      segments.push({ 
        label: entity.strategicDomain.name, 
        href: `/strategic-domains?id=${entity.strategicDomain.id}` 
      });
    }
    if (entity.filieresS3 && entity.filieresS3.length > 0) {
      segments.push({ 
        label: entity.filieresS3[0].name, 
        href: `/value-chains?id=${entity.filieresS3[0].id}` 
      });
    } else if (entity.valueChain) {
      segments.push({ 
        label: entity.valueChain.name, 
        href: `/value-chains?id=${entity.valueChain.id}` 
      });
    }
    
    if (entity.organization) {
      segments.push({ 
        label: entity.organization.name, 
        href: `/organizations?id=${entity.organization.id}` 
      });
    }
    
    if (entity.program) {
      segments.push({ 
        label: entity.program.name, 
        href: `/strategies?id=${entity.program.id}` 
      });
    }
    
    if (entity.project) {
      segments.push({ 
        label: entity.project.name, 
        href: `/projects?id=${entity.project.id}` 
      });
    }
  } else if (perspective === "transformation") {
    segments.push({ label: "Transformation DR-BEST", href: "/graph?mode=transformation" });
    
    if (entity.transformationDimensions && entity.transformationDimensions.length > 0) {
      segments.push({ 
        label: entity.transformationDimensions[0].name, 
        href: `/transformation-dimensions?id=${entity.transformationDimensions[0].id}` 
      });
    }
    
    if (entity.capabilities && entity.capabilities.length > 0) {
      segments.push({ 
        label: entity.capabilities[0].name, 
        href: `/capabilities?id=${entity.capabilities[0].id}` 
      });
    }
  } else if (perspective === "impact") {
    segments.push({ label: "Impact & Objectifs", href: "/pilotage" });
    
    if (entity.impactDimensions && entity.impactDimensions.length > 0) {
      segments.push({ 
        label: entity.impactDimensions[0].name, 
        href: `/impact-dimensions?id=${entity.impactDimensions[0].id}` 
      });
    }
    if (entity.objectives && entity.objectives.length > 0) {
      segments.push({ 
        label: entity.objectives[0].name, 
        href: `/objectives?id=${entity.objectives[0].id}` 
      });
    }
  }

  // Final leaf node segment
  segments.push({ label: entity.name || entity.title || `ID: ${entity.id}` });
  return segments;
}

export default function PITContextRibbon({
  segments,
  entity,
  perspective = "s3",
  className,
}: PITContextRibbonProps) {
  const activeSegments = React.useMemo(() => {
    if (segments && segments.length > 0) return segments;
    return resolveSemanticSegments(entity, perspective);
  }, [segments, entity, perspective]);

  if (!activeSegments || activeSegments.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold text-muted uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-150 dark:border-gray-800 w-fit max-w-full mb-4",
        className
      )}
    >
      {activeSegments.map((seg, idx) => {
        const isLast = idx === activeSegments.length - 1;
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
