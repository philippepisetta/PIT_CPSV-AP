// src/components/GraphViewer.tsx

"use client";

import { useEffect, useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useOrganisations, useServices, useRelations } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function GraphViewer() {
  const { data: orgData, isLoading: orgLoading } = useOrganisations();
  const { data: svcData, isLoading: svcLoading } = useServices();
  const { data: relData, isLoading: relLoading } = useRelations();

  const loading = orgLoading || svcLoading || relLoading;

  // Transform mock data into nodes and edges for React Flow
  const nodes: Node[] = useMemo(() => {
    const organisations = orgData?.organisations ?? [];
    const services = svcData?.services ?? [];

    const orgNodes = organisations.map((org) => ({
      id: org.id,
      type: "default",
      data: { label: org.name, type: org.type },
      position: { x: 0, y: 0 },
      style: {
        background: "#0f766e",
        color: "white",
        borderRadius: "8px",
        width: 180,
        padding: "8px",
      },
    }));

    const svcNodes = services.map((svc, idx) => ({
      id: svc.id,
      type: "default",
      data: { label: svc.name },
      position: { x: 250, y: idx * 120 },
      style: {
        background: "#3b82f6",
        color: "white",
        borderRadius: "8px",
        width: 180,
        padding: "8px",
      },
    }));

    return [...orgNodes, ...svcNodes];
  }, [orgData, svcData]);

  const edges: Edge[] = useMemo(() => {
    if (!relData) return [];
    return relData.relations.map((rel) => ({
      id: `${rel.source}-${rel.target}`,
      source: rel.source,
      target: rel.target,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#9ca3af" },
      markerEnd: { type: "arrowclosed", color: "#9ca3af" },
    }));
  }, [relData]);

  // Simple auto‑layout: let React Flow apply its built‑in dagre layout on mount
  useEffect(() => {
    // No external layout library used; rely on default positions.
  }, []);

  if (loading) {
    return (
      <div className={cn("flex h-full items-center justify-center text-muted")}>
        Chargement du graphe…
      </div>
    );
  }

  return (
    <div className={cn("h-[600px] w-full rounded-xl bg-surface shadow-card p-2")}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
