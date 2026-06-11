// src/design-system/PITGraphView.tsx
"use client";

import React, { useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { getCachedPosition } from "@/lib/graphLayoutCache";

export type GraphMode =
  | "network"
  | "hierarchy"
  | "journey"
  | "value-chain"
  | "ecosystem"
  | "strategy"
  | "transformation"
  | "capability"
  | "impact";

interface GraphNodeData {
  id: string;
  label: string;
  type: string;
  code?: string;
  sector?: string;
  size?: string;
  province?: string;
}

interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface PITGraphViewProps {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string;
  mode?: GraphMode;
  className?: string;
  interactive?: boolean;
}

const typeColorMap: Record<string, string> = {
  strategy: "#f43f5e",          // Rose
  strategicpriority: "#fb7185",  // Light Rose
  program: "#3b82f6",            // Blue
  measure: "#06b6d4",            // Cyan
  initiative: "#14b8a6",         // Teal
  service: "#6366f1",            // Indigo
  journeystage: "#2dd4bf",       // Light Teal
  journey: "#10b981",            // Emerald
  ecosystem: "#a855f7",          // Light Purple
  valuechain: "#f59e0b",          // Amber
  beneficiary: "#f97316",        // Orange
  beneficiaryengagement: "#ec4899", // Pink
  actioninstance: "#ec4899",
  impact: "#10b981",
  outcomeindicator: "#14b8a6",
  fundinginstrument: "#3b82f6",
  territory: "#0f766e",          // Teal-700
  organization: "#8b5cf6",       // Violet
  dataset: "#0ea5e9",            // Sky-500
  knowledgeasset: "#f43f5e",     // Rose-500
  eventresource: "#fb7185",      // Light Rose
  challenge: "#64748b",          // Slate-500
  project: "#3b82f6",            // Blue
  objective: "#06b6d4",          // Cyan
  transformation: "#a855f7",     // Purple
  strategicdomain: "#f59e0b",    // Amber
  capability: "#10b981",        // Emerald
  impactdimension: "#e11d48",   // Rose-600
  knowledgedimension: "#6366f1", // Indigo
  dataquality: "#14b8a6",        // Teal
};

const typeLabelMap: Record<string, string> = {
  strategy: "Politique",
  strategicpriority: "Priorité",
  program: "Programme",
  measure: "Mesure",
  initiative: "Initiative",
  service: "Service CPSV-AP",
  journeystage: "Étape Parcours",
  journey: "Parcours Type",
  ecosystem: "Écosystème S3",
  valuechain: "Chaîne Valeur",
  beneficiary: "Bénéficiaire PME",
  beneficiaryengagement: "Prestation",
  actioninstance: "Action",
  impact: "Impact Territorial",
  outcomeindicator: "Indicateur",
  fundinginstrument: "Financement",
  territory: "Territoire",
  organization: "Opérateur",
  dataset: "Dataset DCAT-AP",
  knowledgeasset: "Actif Connaissance",
  eventresource: "Événement",
  challenge: "Défi d'affaires",
  project: "Projet Territorial",
  objective: "Objectif Stratégique",
  transformation: "Dimension DR-BEST",
  strategicdomain: "Axe S3 Régional",
  capability: "Compétence / Capabilité",
  impactdimension: "Axe d'Impact Global",
  knowledgedimension: "Type de Connaissance",
  dataquality: "Qualité de Données",
};

// Map of standard X offsets for the layered flow
const defaultTypeXMap: Record<string, number> = {
  strategy: 20,
  strategicpriority: 160,
  program: 300,
  measure: 440,
  initiative: 580,
  service: 720,
  journeystage: 860,
  journey: 1000,
  ecosystem: 1140,
  valuechain: 1280,
  beneficiary: 1420,
  beneficiaryengagement: 1560,
  actioninstance: 1560,
  impact: 1700,
  outcomeindicator: 1840,
  fundinginstrument: 1980,
  territory: 2120,
  organization: 2260,
  dataset: 2400,
  knowledgeasset: 2540,
  eventresource: 2680,
  challenge: 2820,
  project: 350,
  objective: 250,
  transformation: 100,
  strategicdomain: 120,
  capability: 180,
  impactdimension: 200,
  knowledgedimension: 220,
  dataquality: 240,
};

export default function PITGraphView({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
  mode = "network",
  className,
  interactive = true,
}: PITGraphViewProps) {
  // Compute node layouts based on GraphMode
  const layoutNodes = useMemo(() => {
    // Group nodes by their column criteria
    const columns: Record<string, GraphNodeData[]> = {};
    
    // Determine mapping key based on mode
    nodes.forEach((n) => {
      let key = n.type;
      if (mode === "hierarchy") {
        // Enforce top-down or strategic hierarchy: Stratégies -> Programmes -> Mesures -> Initiatives -> Services
        if (["strategy", "strategicpriority"].includes(n.type)) key = "col-1";
        else if (n.type === "program") key = "col-2";
        else if (n.type === "measure") key = "col-3";
        else if (n.type === "initiative") key = "col-4";
        else if (["service", "journey"].includes(n.type)) key = "col-5";
        else key = "col-6";
      } else if (mode === "journey") {
        // Enforce journey sequence: Beneficiary -> Journey -> JourneyStage -> Service -> Prestation
        if (n.type === "beneficiary") key = "col-1";
        else if (n.type === "journey") key = "col-2";
        else if (n.type === "journeystage") key = "col-3";
        else if (n.type === "service") key = "col-4";
        else key = "col-5";
      } else if (mode === "value-chain") {
        // Align horizontally based on S3 segments or maillons
        if (["filiere", "valuechain"].includes(n.type)) key = "col-1";
        else if (n.type === "service") key = "col-2";
        else if (n.type === "beneficiary") key = "col-3";
        else key = "col-4";
      } else if (mode === "ecosystem") {
        // Clustered focus layout
        if (n.type === "ecosystem") key = "col-1";
        else if (n.type === "organization") key = "col-2";
        else if (n.type === "beneficiary") key = "col-3";
        else key = "col-4";
      } else if (mode === "strategy") {
        // Portefeuille vision: Strategy -> Program -> Outcomes/Impacts
        if (n.type === "strategy") key = "col-1";
        else if (n.type === "program") key = "col-2";
        else if (["impact", "outcomeindicator"].includes(n.type)) key = "col-3";
        else key = "col-4";
      } else if (mode === "transformation") {
        // DR-BEST Transformation axis: Dimension -> Capabilities -> Services -> Projects -> Beneficiaries
        if (n.type === "transformation") key = "col-1";
        else if (n.type === "capability") key = "col-2";
        else if (n.type === "service") key = "col-3";
        else if (["project", "actioninstance"].includes(n.type)) key = "col-4";
        else if (n.type === "beneficiary") key = "col-5";
        else key = "col-6";
      } else if (mode === "capability") {
        // Capabilities axis: Skills -> Services -> Assets/Data -> Target Projects/Beneficiaries
        if (n.type === "capability") key = "col-1";
        else if (n.type === "service") key = "col-2";
        else if (["dataset", "knowledgeasset"].includes(n.type)) key = "col-3";
        else if (["project", "beneficiary"].includes(n.type)) key = "col-4";
        else key = "col-5";
      } else if (mode === "impact") {
        // Impact axis: Dimensions -> Objectives/Indicators -> Services/Projects -> Impacts -> Beneficiaries
        if (n.type === "impactdimension") key = "col-1";
        else if (["objective", "outcomeindicator"].includes(n.type)) key = "col-2";
        else if (["service", "project"].includes(n.type)) key = "col-3";
        else if (n.type === "impact") key = "col-4";
        else if (n.type === "beneficiary") key = "col-5";
        else key = "col-6";
      }
      
      if (!columns[key]) columns[key] = [];
      columns[key].push(n);
    });

    const height = 450;
    const computedXMap: Record<string, number> = {};
    const colKeys = Object.keys(columns);
    
    colKeys.forEach((key, colIndex) => {
      if (mode === "network") {
        // Use default type X offset mapping
        computedXMap[key] = defaultTypeXMap[key] || 400;
      } else {
        // Divide width evenly among active columns
        computedXMap[key] = 40 + colIndex * 220;
      }
    });

    return nodes.map((n) => {
      let key = n.type;
      if (mode === "hierarchy") {
        if (["strategy", "strategicpriority"].includes(n.type)) key = "col-1";
        else if (n.type === "program") key = "col-2";
        else if (n.type === "measure") key = "col-3";
        else if (n.type === "initiative") key = "col-4";
        else if (["service", "journey"].includes(n.type)) key = "col-5";
        else key = "col-6";
      } else if (mode === "journey") {
        if (n.type === "beneficiary") key = "col-1";
        else if (n.type === "journey") key = "col-2";
        else if (n.type === "journeystage") key = "col-3";
        else if (n.type === "service") key = "col-4";
        else key = "col-5";
      } else if (mode === "value-chain") {
        if (["filiere", "valuechain"].includes(n.type)) key = "col-1";
        else if (n.type === "service") key = "col-2";
        else if (n.type === "beneficiary") key = "col-3";
        else key = "col-4";
      } else if (mode === "ecosystem") {
        if (n.type === "ecosystem") key = "col-1";
        else if (n.type === "organization") key = "col-2";
        else if (n.type === "beneficiary") key = "col-3";
        else key = "col-4";
      } else if (mode === "strategy") {
        if (n.type === "strategy") key = "col-1";
        else if (n.type === "program") key = "col-2";
        else if (["impact", "outcomeindicator"].includes(n.type)) key = "col-3";
        else key = "col-4";
      } else if (mode === "transformation") {
        if (n.type === "transformation") key = "col-1";
        else if (n.type === "capability") key = "col-2";
        else if (n.type === "service") key = "col-3";
        else if (["project", "actioninstance"].includes(n.type)) key = "col-4";
        else if (n.type === "beneficiary") key = "col-5";
        else key = "col-6";
      } else if (mode === "capability") {
        if (n.type === "capability") key = "col-1";
        else if (n.type === "service") key = "col-2";
        else if (["dataset", "knowledgeasset"].includes(n.type)) key = "col-3";
        else if (["project", "beneficiary"].includes(n.type)) key = "col-4";
        else key = "col-5";
      } else if (mode === "impact") {
        if (n.type === "impactdimension") key = "col-1";
        else if (["objective", "outcomeindicator"].includes(n.type)) key = "col-2";
        else if (["service", "project"].includes(n.type)) key = "col-3";
        else if (n.type === "impact") key = "col-4";
        else if (n.type === "beneficiary") key = "col-5";
        else key = "col-6";
      }

      const colNodes = columns[key] || [];
      const idx = colNodes.findIndex((cn) => cn.id === n.id);
      const count = colNodes.length;

      const pos = getCachedPosition(n.id, mode, () => {
        const xVal = computedXMap[key] || 100;
        const ySpacing = Math.min(120, height / (count + 1));
        const yOffset = (height - (count - 1) * ySpacing) / 2;
        const yVal = yOffset + (idx >= 0 ? idx : 0) * ySpacing;
        return { x: xVal, y: yVal };
      });

      const isSelected = selectedNodeId === n.id;

      return {
        id: n.id,
        type: "default",
        data: {
          label: (
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase tracking-wider opacity-75 font-extrabold select-none">
                {typeLabelMap[n.type] || n.type}
              </span>
              <span className="mt-0.5 leading-tight font-bold text-[11px]">{n.label}</span>
              {n.code && (
                <span className="text-[9px] font-mono mt-1 opacity-90 font-bold uppercase bg-black/15 px-1 py-0.2 rounded w-fit">
                  {n.code}
                </span>
              )}
              {n.sector && (
                <span className="text-[8px] italic mt-0.5 opacity-80">
                  {n.sector} • {n.size}
                </span>
              )}
            </div>
          ),
        },
        position: pos,
        style: {
          background: typeColorMap[n.type] || "#3b82f6",
          color: "white",
          borderRadius: "12px",
          border: isSelected ? "3px solid #f9fafb" : "1px solid rgba(255, 255, 255, 0.15)",
          width: 180,
          padding: "12px",
          fontWeight: "500",
          fontSize: "11px",
          boxShadow: isSelected
            ? "0 0 16px rgba(255, 255, 255, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.3)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
          textAlign: "left",
          cursor: interactive ? "pointer" : "default",
        },
      } as Node;
    });
  }, [nodes, mode, selectedNodeId, interactive]);

  const rfEdges = useMemo(() => {
    return edges.map(
      (e) =>
        ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          animated: true,
          label: e.label,
          labelStyle: { fill: "#94a3b8", fontSize: "9px", fontWeight: 700 },
          style: { stroke: "#94a3b8", strokeWidth: 1.5, opacity: 0.65 },
          markerEnd: { type: "arrowclosed" as any, color: "#94a3b8" },
        } as Edge)
    );
  }, [edges]);

  return (
    <div className={cn("h-[500px] border border-gray-150 dark:border-gray-850 rounded-2xl bg-white dark:bg-gray-800 relative overflow-hidden shadow-inner", className)}>
      <ReactFlow
        nodes={layoutNodes}
        edges={rfEdges}
        onNodeClick={
          interactive && onNodeClick
            ? (event, node) => onNodeClick(node.id)
            : undefined
        }
        fitView
        nodesConnectable={false}
        nodesDraggable={interactive}
        zoomOnScroll={interactive}
        panOnDrag={interactive}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="opacity-25" />
        <Controls className="!bg-white dark:!bg-gray-800 !border-gray-150 dark:!border-gray-800 !text-text !rounded-xl !shadow-md" />
        <MiniMap
          nodeColor={(n) => typeColorMap[n.id.split("-")[0]] || "#3b82f6"}
          maskColor="rgba(0, 0, 0, 0.2)"
          className="!bg-white dark:!bg-gray-800 !border-gray-150 dark:!border-gray-800 !rounded-xl !shadow-md hidden sm:block"
        />
      </ReactFlow>
    </div>
  );
}
