// src/design-system/PITRelationsPanel.tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import RelationshipCard from "@/components/ui/RelationshipCard";

export interface RelationItem {
  id: string | number;
  title: string;
  relationType: string;
  Icon: LucideIcon;
  description?: string;
  onClick?: () => void;
  badge?: string;
}

interface PITRelationsPanelProps {
  incomingRelations?: RelationItem[];
  outgoingRelations?: RelationItem[];
  sections?: {
    title: string;
    items: RelationItem[];
  }[];
  emptyMessage?: string;
}

export default function PITRelationsPanel({
  incomingRelations = [],
  outgoingRelations = [],
  sections,
  emptyMessage = "Aucune relation sémantique n'est configurée pour cet objet.",
}: PITRelationsPanelProps) {
  const hasRelations =
    (sections && sections.some((s) => s.items.length > 0)) ||
    incomingRelations.length > 0 ||
    outgoingRelations.length > 0;

  if (!hasRelations) {
    return (
      <div className="text-center py-8 text-xs text-muted italic border border-muted/10 border-dashed rounded-xl p-4">
        {emptyMessage}
      </div>
    );
  }

  if (sections) {
    return (
      <div className="space-y-6">
        {sections
          .filter((s) => s.items.length > 0)
          .map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1">
                {sec.title} ({sec.items.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sec.items.map((item) => (
                  <RelationshipCard
                    key={item.id}
                    title={item.title}
                    relationType={item.relationType}
                    Icon={item.Icon}
                    description={item.description}
                    onClick={item.onClick}
                    badge={item.badge}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {outgoingRelations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1">
            Relations Sortantes (Dépendances) ({outgoingRelations.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outgoingRelations.map((item) => (
              <RelationshipCard
                key={item.id}
                title={item.title}
                relationType={item.relationType}
                Icon={item.Icon}
                description={item.description}
                onClick={item.onClick}
                badge={item.badge}
              />
            ))}
          </div>
        </div>
      )}

      {incomingRelations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1">
            Relations Entrantes (Impacts / Ancres) ({incomingRelations.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incomingRelations.map((item) => (
              <RelationshipCard
                key={item.id}
                title={item.title}
                relationType={item.relationType}
                Icon={item.Icon}
                description={item.description}
                onClick={item.onClick}
                badge={item.badge}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
