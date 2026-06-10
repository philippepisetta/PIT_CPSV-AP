// src/components/GraphViewer.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { 
  Filter, 
  Users, 
  Share2, 
  Layers, 
  Globe, 
  X, 
  Search, 
  FileText, 
  Building2, 
  Compass, 
  Database, 
  Activity, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  MapPin,
  CheckCircle,
  FileCheck,
  Target
} from "lucide-react";

import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import StatCard from "@/components/ui/StatCard";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";

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

  // References cache
  const [meta, setMeta] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

  // Selection states
  const [selectedEntityDetails, setSelectedEntityDetails] = useState<any>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const [detailLoading, setDetailLoading] = useState(false);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Perspective states
  const [perspective, setPerspective] = useState<"all" | "beneficiary" | "ecosystem" | "valuechain" | "strategy" | "program" | "territory">("all");
  const [targetEntityId, setTargetEntityId] = useState<string>("");

  useEffect(() => {
    async function loadGraphAndRefs() {
      try {
        setLoading(true);
        const [graphRes, metaRes, benefRes] = await Promise.all([
          fetch("/api/graph"),
          fetch("/api/meta"),
          fetch("/api/beneficiaries")
        ]);

        if (!graphRes.ok) throw new Error("Erreur de chargement du graphe sémantique");
        
        const gData = await graphRes.json();
        setGraphData(gData);

        if (metaRes.ok) {
          const mData = await metaRes.json();
          setMeta(mData);
        }

        if (benefRes.ok) {
          const bData = await benefRes.json();
          setBeneficiaries(bData);
        }
      } catch (err: any) {
        console.error("Erreur graphe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGraphAndRefs();
  }, []);

  // Map of X positions per node type for a clean layered layout
  const typeXMap: Record<string, number> = {
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
  };

  // Harmonious theme matching user requests
  const typeColorMap: Record<string, string> = {
    strategy: "#f43f5e",          // Rose
    strategicpriority: "#fb7185",  // Light Rose
    program: "#3b82f6",          // Blue
    measure: "#06b6d4",          // Cyan
    initiative: "#14b8a6",       // Teal
    service: "#6366f1",          // Indigo
    journeystage: "#2dd4bf",     // Light Teal
    journey: "#10b981",          // Emerald
    ecosystem: "#a855f7",        // Light Purple
    valuechain: "#8b5cf6",       // Purple
    beneficiary: "#d946ef",      // Fuchsia
    beneficiaryengagement: "#ec4899", // Pink
    actioninstance: "#f472b6",   // Light Pink
    impact: "#059669",           // Dark Emerald
    outcomeindicator: "#eab308",  // Yellow
    fundinginstrument: "#22c55e", // Green
    territory: "#f97316",        // Orange
    organization: "#64748b",     // Slate
    dataset: "#06b6d4",          // Cyan
    knowledgeasset: "#f59e0b",   // Amber
    eventresource: "#84cc16",    // Lime
    challenge: "#ef4444",        // Red
  };

  const typeLabelMap: Record<string, string> = {
    strategy: "Stratégie",
    strategicpriority: "Priorité stratégique",
    program: "Programme",
    measure: "Mesure",
    initiative: "Initiative",
    service: "Service CPSV",
    journeystage: "Étape parcours",
    journey: "Parcours",
    ecosystem: "Écosystème",
    valuechain: "Filière S3",
    beneficiary: "Bénéficiaire",
    beneficiaryengagement: "Engagement",
    actioninstance: "Action / Engagement",
    impact: "Impact constaté",
    outcomeindicator: "Indicateur",
    fundinginstrument: "Financement",
    territory: "Territoire",
    organization: "Opérateur",
    dataset: "Données (DCAT-AP)",
    knowledgeasset: "Actif de connaissance",
    eventresource: "Événement",
    challenge: "Défi d'affaires",
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

  // Handle Node Selection Details
  const handleNodeSelection = async (nodeId: string) => {
    const parts = nodeId.split("-");
    const id = parseInt(parts.pop() || "0");
    const type = parts.join("-");

    setSelectedNodeType(type);
    setDetailLoading(true);

    try {
      if (type === "beneficiary") {
        const found = beneficiaries.find((b: any) => b.id === id);
        setSelectedEntityDetails(found || { id, name: "Bénéficiaire " + id });
      } else if (type === "service") {
        const res = await fetch(`/api/services/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedEntityDetails(data);
        } else {
          const found = meta?.services?.find((s: any) => s.id === id);
          setSelectedEntityDetails(found || { id, name: "Service " + id });
        }
      } else if (type === "journey") {
        try {
          const res = await fetch("/api/journeys");
          if (res.ok) {
            const journeysList = await res.json();
            const j = journeysList.find((item: any) => item.id === id);
            setSelectedEntityDetails(j || { id, name: "Parcours " + id });
          } else {
            setSelectedEntityDetails({ id, name: "Parcours " + id });
          }
        } catch {
          setSelectedEntityDetails({ id, name: "Parcours " + id });
        }
      } else if (type === "ecosystem") {
        const found = meta?.ecosystems?.find((e: any) => e.id === id);
        setSelectedEntityDetails(found || { id, name: "Écosystème " + id });
      } else if (type === "dataset") {
        const found = meta?.datasets?.find((d: any) => d.id === id);
        setSelectedEntityDetails(found || { id, title: "Dataset " + id });
      } else if (type === "knowledgeasset") {
        const found = meta?.knowledgeAssets?.find((k: any) => k.id === id);
        setSelectedEntityDetails(found || { id, title: "Actif de connaissance " + id });
      } else if (type === "eventresource") {
        const found = meta?.eventResources?.find((e: any) => e.id === id);
        setSelectedEntityDetails(found || { id, title: "Événement " + id });
      } else if (type === "organization" || type === "org") {
        const found = meta?.organizations?.find((o: any) => o.id === id);
        setSelectedEntityDetails(found || { id, name: "Organisme " + id });
      } else if (type === "challenge") {
        const found = meta?.challenges?.find((c: any) => c.id === id);
        setSelectedEntityDetails(found || { id, name: "Défi " + id });
      } else if (type === "valuechain") {
        const found = meta?.strategicValueChains?.find((v: any) => v.id === id);
        setSelectedEntityDetails(found || { id, name: "Filière S3 " + id });
      } else if (type === "strategy") {
        const found = meta?.strategies?.find((s: any) => s.id === id);
        setSelectedEntityDetails(found || { id, name: "Stratégie " + id });
      } else if (type === "strategicpriority") {
        const found = meta?.strategicPriorities?.find((p: any) => p.id === id);
        setSelectedEntityDetails(found || { id, name: "Priorité Stratégique " + id });
      } else if (type === "program") {
        const found = meta?.programs?.find((p: any) => p.id === id);
        setSelectedEntityDetails(found || { id, name: "Programme " + id });
      } else if (type === "measure") {
        const found = meta?.measures?.find((m: any) => m.id === id);
        setSelectedEntityDetails(found || { id, name: "Mesure " + id });
      } else if (type === "initiative") {
        const found = meta?.initiatives?.find((i: any) => i.id === id);
        setSelectedEntityDetails(found || { id, name: "Initiative " + id });
      } else if (type === "territory") {
        const found = meta?.territories?.find((t: any) => t.id === id);
        setSelectedEntityDetails(found || { id, name: "Territoire " + id });
      } else if (type === "beneficiaryengagement") {
        const found = meta?.beneficiaryEngagements?.find((e: any) => e.id === id);
        setSelectedEntityDetails(found || { id, title: "Engagement " + id });
      } else if (type === "impact") {
        const found = meta?.impacts?.find((i: any) => i.id === id);
        setSelectedEntityDetails(found || { id, textValue: "Impact " + id });
      } else if (type === "outcomeindicator") {
        const found = meta?.outcomeIndicators?.find((i: any) => i.id === id);
        setSelectedEntityDetails(found || { id, name: "Indicateur " + id });
      } else if (type === "fundinginstrument") {
        const found = meta?.fundingInstruments?.find((f: any) => f.id === id);
        setSelectedEntityDetails(found || { id, name: "Instrument de Financement " + id });
      } else {
        setSelectedEntityDetails({ id, name: nodeId });
      }
    } catch (err) {
      console.error("Erreur lors de la sélection du nœud:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || !graphData) return [];
    return graphData.nodes
      .filter(n => n.label.toLowerCase().includes(q))
      .slice(0, 10);
  }, [graphData, searchQuery]);

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

      const idNum = parseInt(n.id.split("-").pop() || "0");
      const isSelected = selectedEntityDetails && selectedNodeType === n.type && selectedEntityDetails.id === idNum;

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
          border: isSelected ? "3px solid #14b8a6" : "none",
          width: 175,
          padding: "12px",
          fontWeight: "500",
          fontSize: "12px",
          boxShadow: isSelected 
            ? "0 0 0 4px rgba(20, 184, 166, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
  }, [filteredData, selectedEntityDetails, selectedNodeType]);

  // Render detail panel for selected entity
  const renderDetailPanel = () => {
    if (detailLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-glass border border-muted/20 rounded-2xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xs font-semibold text-muted animate-pulse">Chargement des détails sémantiques...</p>
        </div>
      );
    }

    if (!selectedEntityDetails) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-glass border border-muted/20 border-dashed rounded-2xl p-6 text-muted italic text-xs">
          <Globe className="h-10 w-10 text-muted/50 mb-3 animate-pulse" />
          <p>Cliquez sur un nœud dans le graphe ou recherchez une entité pour afficher ses détails structurés et ses relations sémantiques.</p>
        </div>
      );
    }

    const item = selectedEntityDetails;
    const type = selectedNodeType;

    let title = item.name || item.title || "";
    let subtitle = "";
    let badgeText = typeLabelMap[type] || type;
    let overviewTab: React.ReactNode = null;
    let relationsTab: React.ReactNode = null;
    let metadataTab: React.ReactNode = null;

    // Build specific detail views
    if (type === "beneficiary") {
      subtitle = item.primaryNaceSector ? `NACE : ${item.primaryNaceSector.code}` : `Localisation : ${item.location}`;
      overviewTab = (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10">
              <span className="text-[10px] text-muted uppercase block">Effectif</span>
              <span className="font-bold text-text">{item.employees || 0} ETP</span>
            </div>
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10">
              <span className="text-[10px] text-muted uppercase block">CA Estimé</span>
              <span className="font-bold text-text">
                {item.revenue ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(item.revenue) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted uppercase block font-bold">Maturité Digitale</span>
            <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(item.maturityDigital / 5) * 100}%` }} />
            </div>
            <span className="text-[10px] text-muted">{item.maturityDigital}/5</span>
          </div>
          {item.challenges && item.challenges.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-muted uppercase block font-bold">Défis d'affaires</span>
              <div className="flex flex-wrap gap-1">
                {item.challenges.map((c: any) => (
                  <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-semibold border border-blue-500/10">{c.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Historique d'Interventions</span>
          {item.deliveries && item.deliveries.length > 0 ? (
            <div className="space-y-2">
              {item.deliveries.map((del: any) => (
                <RelationshipCard
                  key={del.id}
                  title={del.service?.name || "Service"}
                  relationType={del.status}
                  Icon={FileCheck}
                  description={`Opérateur: ${del.operator?.name || "N/A"}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">Aucun accompagnement enregistré.</p>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>N° BCE : <span className="font-mono">{item.bce || "N/A"}</span></p>
          <p>Territoire : <span className="font-semibold">{item.location} ({item.province})</span></p>
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">d4wmo:Beneficiary</span></p>
        </div>
      );
    } 
    else if (type === "service") {
      subtitle = `Code : ${item.code || "N/A"}`;
      overviewTab = (
        <div className="space-y-4">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 text-xs text-text/95 leading-relaxed">
            {item.description}
          </div>
          {item.organization && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10 text-xs">
              <span className="text-[10px] text-muted uppercase block">Organisme Responsable</span>
              <span className="font-bold text-text">{item.organization.name}</span>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          {item.outputs && item.outputs.length > 0 && (
            <div>
              <span className="text-[10px] text-muted uppercase block font-bold mb-1">Livrables (Outputs)</span>
              <ul className="text-xs space-y-1 list-disc pl-4 text-text/90">
                {item.outputs.map((o: any) => <li key={o.id}>{o.name}</li>)}
              </ul>
            </div>
          )}
          {item.outcomes && item.outcomes.length > 0 && (
            <div className="pt-2 border-t border-muted/10">
              <span className="text-[10px] text-muted uppercase block font-bold mb-1">Impacts (Outcomes)</span>
              <ul className="text-xs space-y-1 list-disc pl-4 text-text/90">
                {item.outcomes.map((o: any) => <li key={o.id}>{o.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>URI : <span className="font-mono text-teal-500 break-all">{item.uri}</span></p>
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">cpsv:PublicService</span></p>
        </div>
      );
    }
    else if (type === "journey") {
      subtitle = `Par : ${item.provider}`;
      overviewTab = (
        <div className="space-y-4">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 text-xs text-text/95 leading-relaxed">
            {item.description || "Aucune description"}
          </div>
          {item.objective && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10 text-xs">
              <span className="text-[10px] text-muted uppercase block">Objectif principal</span>
              <p className="italic text-text/90">"{item.objective}"</p>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Étapes Types du Parcours</span>
          {item.stages && item.stages.length > 0 ? (
            <div className="space-y-3">
              {item.stages.map((stage: any) => (
                <div key={stage.id} className="p-2.5 bg-glass/20 rounded-lg border border-muted/10 text-xs">
                  <span className="font-bold text-teal-600 dark:text-teal-400">Étape {stage.position} : {stage.name}</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {stage.services?.map((s: any) => (
                      <span key={s.id} className="px-1.5 py-0.5 bg-background border border-muted/20 rounded text-[9px]">{s.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">Aucune étape déclarée.</p>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">d4wmo:Journey</span></p>
        </div>
      );
    }
    else if (type === "ecosystem") {
      overviewTab = (
        <div className="space-y-4">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 text-xs text-text/95 leading-relaxed">
            {item.description}
          </div>
          {item.mission && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10 text-xs italic text-text/90">
              "{item.mission}"
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Membres (Opérateurs)</span>
          <div className="grid grid-cols-1 gap-2">
            {item.actors?.map((actor: any) => (
              <RelationshipCard
                key={actor.id}
                title={actor.name}
                relationType={actor.type}
                Icon={Building2}
              />
            ))}
          </div>
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Territoire : <span className="font-bold">{item.territory || "Wallonie"}</span></p>
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">d4wmo:Ecosystem</span></p>
        </div>
      );
    }
    else if (type === "dataset") {
      title = item.title || item.name || "";
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description}
          </div>
          {item.ownerOrganization && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10">
              <span className="text-[10px] text-muted uppercase block">Propriétaire</span>
              <span className="font-bold text-text">{item.ownerOrganization.name}</span>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-2 text-xs">
          <p>Fréquence de mise à jour : <span className="font-bold">{item.updateFrequency}</span></p>
          <p>Qualité / Conformité : <span className="font-bold text-teal-500">{item.qualityScore ? `${item.qualityScore}/5` : "N/A"}</span></p>
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">dcat:Dataset</span></p>
        </div>
      );
    }
    else if (type === "knowledgeasset") {
      title = item.title || item.name || "";
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description || "Aucun résumé descriptif."}
          </div>
          <p>Type d'actif : <span className="font-bold">{item.type}</span></p>
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Services Documentés</span>
          {item.publicServices?.length > 0 ? (
            item.publicServices.map((s: any) => (
              <RelationshipCard
                key={s.id}
                title={s.name}
                relationType="Service"
                Icon={FileText}
              />
            ))
          ) : (
            <p className="text-xs text-muted italic">Aucun service public directement lié.</p>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">d4wmo:KnowledgeAsset</span></p>
        </div>
      );
    }
    else if (type === "strategy") {
      title = item.name || "";
      subtitle = `Code : ${item.code || "N/A"}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description}
          </div>
          {item.website && (
            <p>Site Web : <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold font-mono">{item.website}</a></p>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Priorités Stratégiques</span>
          {item.priorities?.map((p: any) => (
            <div key={p.id} className="p-2.5 bg-glass/20 border border-muted/10 rounded-lg text-xs font-semibold">
              {p.name}
            </div>
          ))}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Strategy</span></p>
          <p>Opérateur porteur : <span className="font-semibold">{item.ownerOrganization?.name || "Wallonie"}</span></p>
        </div>
      );
    }
    else if (type === "program") {
      title = item.name || "";
      subtitle = `Budget : ${item.budget ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(item.budget) : 'N/A'}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description}
          </div>
          <div className="bg-glass/10 p-2 rounded-lg border border-muted/10 flex items-center justify-between">
            <span className="text-muted">Statut</span>
            <span className="font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase text-[10px]">{item.status}</span>
          </div>
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Mesures Financées</span>
          {item.measures?.length > 0 ? (
            item.measures.map((m: any) => (
              <RelationshipCard
                key={m.id}
                title={m.name}
                relationType="Mesure"
                Icon={TrendingUp}
              />
            ))
          ) : (
            <p className="text-xs text-muted italic">Aucune mesure déclarée.</p>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Program</span></p>
          <p>Opérateur : <span className="font-semibold">{item.ownerOrganization?.name || "Non renseigné"}</span></p>
        </div>
      );
    }
    else if (type === "measure") {
      title = item.name || "";
      subtitle = `Budget estimé : ${item.budget ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(item.budget) : 'N/A'}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description}
          </div>
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Initiatives</span>
          {item.initiatives?.map((i: any) => (
            <RelationshipCard
              key={i.id}
              title={i.name}
              relationType="Initiative"
              Icon={CheckCircle}
            />
          ))}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Measure</span></p>
        </div>
      );
    }
    else if (type === "initiative") {
      title = item.name || "";
      subtitle = `Statut de l'action : ${item.status}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description}
          </div>
          {item.leadOrganization && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10">
              <span className="text-[10px] text-muted uppercase block">Organisation Chef de file</span>
              <span className="font-bold text-text">{item.leadOrganization.name}</span>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Services Publics d'Accompagnement</span>
          {item.publicServices?.map((s: any) => (
            <RelationshipCard
              key={s.id}
              title={s.name}
              relationType="Service"
              Icon={FileText}
            />
          ))}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Initiative</span></p>
        </div>
      );
    }
    else if (type === "territory") {
      title = item.name || "";
      subtitle = `Type : ${item.type}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          {item.description && (
            <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
              {item.description}
            </div>
          )}
          {item.parentTerritory && (
            <div className="bg-glass/10 p-2.5 rounded-lg border border-muted/10">
              <span className="text-[10px] text-muted uppercase block">Territoire Parent</span>
              <span className="font-bold text-text">{item.parentTerritory.name}</span>
            </div>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-2 text-xs">
          <p>Identifiant / Code ISO : <span className="font-mono">{item.code}</span></p>
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Territory</span></p>
        </div>
      );
    }
    else if (type === "beneficiaryengagement") {
      title = item.title || "";
      subtitle = `Statut : ${item.status}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.objective || "Aucun objectif détaillé."}
          </div>
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          {item.beneficiary && (
            <RelationshipCard
              title={item.beneficiary.name}
              relationType="Bénéficiaire"
              Icon={Users}
            />
          )}
          {item.initiative && (
            <RelationshipCard
              title={item.initiative.name}
              relationType="Initiative de rattachement"
              Icon={CheckCircle}
            />
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:BeneficiaryEngagement</span></p>
        </div>
      );
    }
    else if (type === "impact") {
      title = item.indicator?.name || "Impact";
      subtitle = item.numericValue !== null ? `${item.numericValue} ${item.indicator?.unit || ""}` : "Impact Qualitatif";
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-bold italic">
            "{item.textValue || "Impact constaté sur le terrain"}"
          </div>
          {item.evidence && (
            <p className="text-xs bg-glass/10 p-2 rounded border border-muted/10">Preuve : <span className="font-medium text-text">{item.evidence}</span></p>
          )}
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          {item.beneficiary && (
            <RelationshipCard
              title={item.beneficiary.name}
              relationType="Bénéficiaire"
              Icon={Users}
            />
          )}
          {item.territory && (
            <RelationshipCard
              title={item.territory.name}
              relationType="Territoire d'impact"
              Icon={MapPin}
            />
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:Impact</span></p>
        </div>
      );
    }
    else if (type === "fundinginstrument") {
      title = item.name || "";
      subtitle = `Type de financement : ${item.type}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description || "Aucun descriptif."}
          </div>
        </div>
      );
      relationsTab = (
        <div className="space-y-3">
          <span className="text-[10px] text-muted uppercase block font-bold">Programmes co-financés</span>
          {item.programs?.length > 0 ? (
            item.programs.map((prog: any) => (
              <RelationshipCard
                key={prog.id}
                title={prog.name}
                relationType="Programme"
                Icon={TrendingUp}
              />
            ))
          ) : (
            <p className="text-xs text-muted italic">Aucun lien direct de programme.</p>
          )}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:FundingInstrument</span></p>
        </div>
      );
    }
    else if (type === "outcomeindicator") {
      title = item.name || "";
      subtitle = `Unité : ${item.unit}`;
      overviewTab = (
        <div className="space-y-4 text-xs">
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-3.5 leading-relaxed font-medium">
            {item.description || "Indicateur de mesure d'impact."}
          </div>
        </div>
      );
      relationsTab = (
        <p className="text-xs text-muted italic">Pour voir les impacts, consultez les fiches des entreprises.</p>
      );
      metadataTab = (
        <div className="text-xs space-y-2">
          <p>Classe : <span className="font-mono bg-glass px-1 rounded">pit:OutcomeIndicator</span></p>
        </div>
      );
    }
    else {
      // Default fallback rendering
      overviewTab = (
        <div className="text-xs p-4 bg-glass/10 rounded-lg">
          <p>Nom : <strong className="text-text">{item.name || title}</strong></p>
          {item.description && <p className="mt-2 text-muted leading-relaxed">{item.description}</p>}
        </div>
      );
      metadataTab = (
        <div className="text-xs space-y-1">
          <p>Type de nœud : <span className="font-mono">{type}</span></p>
          <p>ID interne : <span className="font-mono">{item.id}</span></p>
        </div>
      );
    }

    return (
      <EntityDetailPanel
        title={title}
        subtitle={subtitle}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">{badgeText}</span>}
        actions={
          <button 
            onClick={() => {
              setSelectedEntityDetails(null);
              setSelectedNodeType("");
            }}
            className="rounded-full p-1.5 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Fermer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        }
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Control Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-surface border border-muted rounded-2xl relative">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <span className="text-sm font-bold text-text">Perspective Métier :</span>
        </div>

        {/* Search Panel inside Toolbar */}
        <div className="relative flex-1 w-full md:max-w-xs">
          <div className="flex items-center gap-2 border border-muted bg-glass/20 rounded-lg px-2.5 py-1 text-xs text-muted">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un nœud par son nom..."
              className="bg-transparent border-none outline-none flex-1 text-text placeholder-muted focus:ring-0 text-xs py-0.5"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted hover:text-text cursor-pointer border-none bg-transparent">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {/* Search Dropdown Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-muted bg-surface p-2 shadow-lg scrollbar-thin">
              {searchResults.map(node => (
                <div
                  key={node.id}
                  onClick={() => {
                    handleNodeSelection(node.id);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-glass text-xs font-semibold text-text cursor-pointer"
                >
                  <span className="truncate flex-1 text-left">{node.label}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-muted/40 rounded text-muted shrink-0 ml-2">
                    {typeLabelMap[node.type] || node.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button 
            onClick={() => setPerspective("all")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "all" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Globe className="h-3.5 w-3.5" /> Graphe Global
          </button>

          <button 
            onClick={() => setPerspective("strategy")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "strategy" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Target className="h-3.5 w-3.5" /> Stratégie
          </button>

          <button 
            onClick={() => setPerspective("program")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "program" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" /> Programme
          </button>

          <button 
            onClick={() => setPerspective("beneficiary")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "beneficiary" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Users className="h-3.5 w-3.5" /> Bénéficiaire
          </button>

          <button 
            onClick={() => setPerspective("ecosystem")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "ecosystem" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Share2 className="h-3.5 w-3.5" /> Écosystème
          </button>

          <button 
            onClick={() => setPerspective("valuechain")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "valuechain" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> Filière S3
          </button>

          <button 
            onClick={() => setPerspective("territory")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer",
              perspective === "territory" ? "bg-primary text-white" : "bg-glass border border-muted/50 text-muted hover:text-text"
            )}
          >
            <MapPin className="h-3.5 w-3.5" /> Territoire
          </button>
        </div>

        {/* Target Entity Selector */}
        {perspective !== "all" && selectorOptions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
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

      {/* Split Layout */}
      <SplitLayout
        leftPane={
          <div className="h-[600px] w-full rounded-2xl bg-surface/50 border border-muted shadow-sm p-1 overflow-hidden relative">
            <ReactFlow 
              nodes={flowNodes} 
              edges={flowEdges} 
              onNodeClick={(event, node) => handleNodeSelection(node.id)}
              fitView
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#64748b" style={{ opacity: 0.1 }} />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
              <Controls />
            </ReactFlow>
          </div>
        }
        rightPane={renderDetailPanel()}
        leftColSpan={8}
      />
    </div>
  );
}
