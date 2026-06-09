// src/components/GraphViewer.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { Filter, Users, Share2, Layers, Globe } from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  code?: string;
  sector?: string;
  size?: string;
  province?: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function GraphViewer() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Perspective states
  const [perspective, setPerspective] = useState<"all" | "beneficiary" | "ecosystem" | "valuechain">("all");
  const [targetEntityId, setTargetEntityId] = useState<string>("");

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
    beneficiary: 20,
    actioninstance: 180,
    challenge: 340,
    valuechain: 500,
    ecosystem: 660,
    journey: 820,
    journeystage: 980,
    service: 1140,
    organization: 1300,
    dataset: 1460,
    knowledgeasset: 1620,
    eventresource: 1780,
  };

  // Harmonious theme matching user requests
  const typeColorMap: Record<string, string> = {
    beneficiary: "#d946ef",      // Fuchsia
    actioninstance: "#ec4899",   // Pink
    challenge: "#ef4444",        // Red
    valuechain: "#8b5cf6",       // Purple
    ecosystem: "#a855f7",        // Light Purple
    journey: "#10b981",          // Emerald
    journeystage: "#14b8a6",     // Teal
    service: "#3b82f6",          // Blue
    organization: "#64748b",     // Slate
    dataset: "#06b6d4",          // Cyan
    knowledgeasset: "#f59e0b",   // Amber
    eventresource: "#10b981",    // Emerald (Green)
  };

  const typeLabelMap: Record<string, string> = {
    beneficiary: "Bénéficiaire",
    actioninstance: "Engagement",
    challenge: "Défi d'affaires",
    valuechain: "Filière S3",
    ecosystem: "Écosystème",
    journey: "Parcours",
    journeystage: "Étape parcours",
    service: "Service CPSV",
    organization: "Opérateur",
    dataset: "Données (DCAT-AP)",
    knowledgeasset: "Actif de connaissance",
    eventresource: "Événement",
  };

  // Get list of targets for selectors
  const selectorOptions = useMemo(() => {
    if (!graphData) return [];
    if (perspective === "all") return [];
    return graphData.nodes
      .filter(n => n.type === perspective)
      .map(n => ({ id: n.id, label: n.label }));
  }, [graphData, perspective]);

  // Set default target entity when perspective changes
  useEffect(() => {
    if (selectorOptions.length > 0) {
      setTargetEntityId(selectorOptions[0].id);
    } else {
      setTargetEntityId("");
    }
  }, [selectorOptions]);

  // Dynamic Filtering Logic
  const filteredData = useMemo(() => {
    if (!graphData) return { nodes: [], edges: [] };
    
    // If Global view, keep all
    if (perspective === "all" || !targetEntityId) {
      return graphData;
    }

    const keptNodeIds = new Set<string>([targetEntityId]);
    
    // First degree connection pass
    const firstDegreeNeighbors = new Set<string>();
    graphData.edges.forEach(e => {
      if (e.source === targetEntityId) {
        firstDegreeNeighbors.add(e.target);
      } else if (e.target === targetEntityId) {
        firstDegreeNeighbors.add(e.source);
      }
    });
    firstDegreeNeighbors.forEach(id => keptNodeIds.add(id));

    // Second degree connection pass (e.g. Services connected to Journey stages)
    graphData.edges.forEach(e => {
      if (firstDegreeNeighbors.has(e.source)) {
        keptNodeIds.add(e.target);
      } else if (firstDegreeNeighbors.has(e.target)) {
        keptNodeIds.add(e.source);
      }
    });

    const filteredNodes = graphData.nodes.filter(n => keptNodeIds.has(n.id));
    const filteredEdges = graphData.edges.filter(e => keptNodeIds.has(e.source) && keptNodeIds.has(e.target));

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [graphData, perspective, targetEntityId]);

  const { flowNodes, flowEdges } = useMemo(() => {
    const { nodes: filteredNodes, edges: filteredEdges } = filteredData;

    // Group to calculate vertical spacing
    const typeCounts: Record<string, number> = {};
    const typeIndices: Record<string, number> = {};

    filteredNodes.forEach((n) => {
      typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
    });

    const fNodes: Node[] = filteredNodes.map((n) => {
      const idx = typeIndices[n.type] || 0;
      typeIndices[n.type] = idx + 1;

      const x = typeXMap[n.type] ?? 100;
      const count = typeCounts[n.type] || 1;
      
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

    const fEdges: Edge[] = filteredEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: true,
      label: e.label,
      labelStyle: { fill: "#94a3b8", fontSize: "9px", fontWeight: 600, background: "transparent" },
      style: { stroke: "#cbd5e1", strokeWidth: 1.8 },
      markerEnd: { type: "arrowclosed" as any, color: "#cbd5e1" },
    }));

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [filteredData]);

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
    <div className="flex flex-col gap-4">
      {/* Perspective Control Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-surface border border-muted rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <span className="text-sm font-bold text-text">Perspective Métier :</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setPerspective("all")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              perspective === "all" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Globe className="h-3.5 w-3.5" /> Graphe Global
          </button>

          <button 
            onClick={() => setPerspective("beneficiary")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              perspective === "beneficiary" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Users className="h-3.5 w-3.5" /> Bénéficiaire
          </button>

          <button 
            onClick={() => setPerspective("ecosystem")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              perspective === "ecosystem" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Share2 className="h-3.5 w-3.5" /> Écosystème
          </button>

          <button 
            onClick={() => setPerspective("valuechain")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              perspective === "valuechain" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> Filière S3
          </button>
        </div>

        {/* Target Entity Selector */}
        {perspective !== "all" && selectorOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Cible :</span>
            <select 
              value={targetEntityId}
              onChange={e => setTargetEntityId(e.target.value)}
              className="bg-glass border border-muted rounded-lg px-2.5 py-1.5 text-xs font-bold text-text focus:outline-none"
            >
              {selectorOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-4 bg-surface border border-muted rounded-2xl text-xs font-semibold text-text">
        <span className="text-muted">Légende :</span>
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

      {/* ReactFlow Canvas */}
      <div className={cn("h-[650px] w-full rounded-2xl bg-surface/50 border border-muted shadow-sm p-1 overflow-hidden relative")}>
        <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#64748b" style={{ opacity: 0.1 }} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
