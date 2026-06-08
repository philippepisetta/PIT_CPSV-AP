// src/components/GraphViewer.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

interface GraphData {
  nodes: Array<{ id: string; label: string; type: string; code?: string; sector?: string; size?: string }>;
  edges: Array<{ id: string; source: string; target: string; label: string }>;
}

export default function GraphViewer() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await fetch("/api/graph");
        if (!res.ok) throw new Error("Erreur de chargement du graphe sémantique");
        const data = await res.json();
        setGraphData(data);
      } catch (err: any) {
        console.error("Erreur graphe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  // Map of X positions per node type for a clean layered layout
  const typeXMap: Record<string, number> = {
    company: 20,
    valuechain: 240,
    stage: 460,
    need: 680,
    journey: 900,
    service: 1120,
    organization: 1340,
  };

  // Harmonious theme matching user requests
  const typeColorMap: Record<string, string> = {
    company: "#d946ef",      // Fuchsia (favorite)
    valuechain: "#8b5cf6",   // Purple
    stage: "#a78bfa",        // Light purple
    need: "#f59e0b",         // Amber / Orange
    journey: "#10b981",      // Emerald
    service: "#3b82f6",      // Blue
    organization: "#64748b", // Slate
  };

  const typeLabelMap: Record<string, string> = {
    company: "Entreprise",
    valuechain: "Filière",
    stage: "Maillon",
    need: "Besoin",
    journey: "Parcours",
    service: "Service CPSV",
    organization: "Opérateur",
  };

  const { nodes, edges } = useMemo(() => {
    if (!graphData) return { nodes: [], edges: [] };

    // Group to calculate vertical spacing
    const typeCounts: Record<string, number> = {};
    const typeIndices: Record<string, number> = {};

    graphData.nodes.forEach((n) => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });

    const flowNodes: Node[] = graphData.nodes.map((n) => {
      const idx = typeIndices[n.type] || 0;
      typeIndices[n.type] = idx + 1;

      const x = typeXMap[n.type] ?? 100;
      const count = typeCounts[n.type] || 1;
      
      // Vertical centering inside a 700px height view
      const height = 650;
      const ySpacing = Math.min(110, height / (count + 1));
      const yOffset = (height - (count - 1) * ySpacing) / 2;
      const y = yOffset + idx * ySpacing;

      return {
        id: n.id,
        type: "default",
        data: { 
          label: (
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider opacity-75 font-semibold">
                {typeLabelMap[n.type] || n.type}
              </span>
              <span className="mt-0.5 leading-tight">{n.label}</span>
              {n.code && <span className="text-[10px] font-mono mt-1 opacity-90">{n.code}</span>}
              {n.sector && <span className="text-[9px] italic mt-0.5">{n.sector} - {n.size}</span>}
            </div>
          ) 
        },
        position: { x, y },
        style: {
          background: typeColorMap[n.type] || "#3b82f6",
          color: "white",
          borderRadius: "10px",
          border: "none",
          width: 175,
          padding: "12px",
          fontWeight: "500",
          fontSize: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          textAlign: "left",
        },
      };
    });

    const flowEdges: Edge[] = graphData.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: true,
      label: e.label,
      labelStyle: { fill: "#64748b", fontSize: "9px", fontWeight: 600, background: "#f8fafc" },
      style: { stroke: "#cbd5e1", strokeWidth: 1.8 },
      markerEnd: { type: "arrowclosed" as any, color: "#cbd5e1" },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [graphData]);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center text-muted-foreground font-medium animate-pulse">
        ⚡ Initialisation du graphe de connaissances territorial...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center text-red-500 gap-2">
        <span className="font-bold">❌ Erreur lors du chargement du graphe</span>
        <span className="text-sm opacity-80">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-xs font-semibold text-zinc-600">
        <span className="text-zinc-400">Légende :</span>
        {Object.entries(typeLabelMap).map(([type, label]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: typeColorMap[type] }} 
            />
            {label}
          </span>
        ))}
      </div>

      <div className={cn("h-[650px] w-full rounded-xl bg-zinc-50/50 border border-zinc-200 shadow-sm p-1 overflow-hidden")}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e4e4e7" />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
