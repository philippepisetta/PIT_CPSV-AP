// src/design-system/PITEntityWorkspace.tsx
"use client";

import React from "react";
import PITDetailLayout from "./PITDetailLayout";
import { BaseEntity } from "./BaseEntity";
import PITContextRibbon, { RibbonSegment } from "./PITContextRibbon";

interface PITEntityWorkspaceProps {
  entity: BaseEntity;
  overviewContent: React.ReactNode;
  relationsContent?: React.ReactNode;
  impactContent?: React.ReactNode;
  metadataContent: React.ReactNode;
  historyContent?: React.ReactNode;
  actions?: React.ReactNode;
  ribbonSegments?: RibbonSegment[];
  className?: string;
}

export default function PITEntityWorkspace({
  entity,
  overviewContent,
  relationsContent,
  impactContent,
  metadataContent,
  historyContent,
  actions,
  ribbonSegments,
  className,
}: PITEntityWorkspaceProps) {
  return (
    <div className={className}>
      {/* Context Ribbon showing entity hierarchy */}
      {ribbonSegments && ribbonSegments.length > 0 && (
        <PITContextRibbon segments={ribbonSegments} />
      )}

      {/* Detail Layout for Workspace */}
      <PITDetailLayout
        title={entity.name}
        subtitle={entity.description || `${entity.type} ID: ${entity.id}`}
        badge={
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">
            {entity.type}
          </span>
        }
        overviewTab={overviewContent}
        relationsTab={relationsContent}
        impactTab={impactContent}
        metadataTab={metadataContent}
        historyTab={historyContent}
        actions={actions}
      />
    </div>
  );
}
