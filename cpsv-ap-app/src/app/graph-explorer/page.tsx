// src/app/graph-explorer/page.tsx
"use client";

import { useState, useMemo } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Network, 
  Search, 
  HelpCircle, 
  Info,
  CheckCircle,
  AlertTriangle,
  Play
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import ContextPanel from "@/components/ContextPanel";

// Mock stories for Priority 1 Graph Explorer
interface StoryChain {
  id: string;
  label: string;
  type: string; // beneficiary, challenge, service, journey, opportunity, project, outcome, evidence, strategiccontribution, strategicframework
  description: string;
  code?: string;
  url?: string;
  status?: string;
}

const STORIES: Record<string, StoryChain[]> = {
  BioPlast: [
    { id: "benef-bioplast", label: "BioPlast S.A.", type: "beneficiary", description: "PME spécialisée en polymères éco-conçus et réintégration matière." },
    { id: "chall-circularite", label: "Défi Circularité", type: "challenge", description: "Réduire les déchets de production et augmenter le taux de plastique réintégré." },
    { id: "serv-ecodesign", label: "Audit Éco-Design", type: "service", description: "Service d'accompagnement à la conception durable de packagings.", code: "SRV-ECO-DESIGN" },
    { id: "journ-circularite", label: "Parcours Circularité", type: "journey", description: "Plan de transition vers des emballages 100% recyclables." },
    { id: "opp-circular", label: "Aide Circular Wallonia", type: "opportunity", description: "Subsidiations pour projets pilotes en économie circulaire.", status: "APPROVED" },
    { id: "proj-circularpack", label: "Projet CircularPack", type: "project", description: "Développement industriel de barquettes alimentaires compostables." },
    { id: "out-plastrec", label: "Formulation thermoplastique", type: "outcome", description: "Polymère biosourcé validé techniquement à 42% de réintégration." },
    { id: "evi-co2", label: "Rapport validation CO2", type: "evidence", description: "Preuve validée de la réduction de 20% des émissions carbone.", url: "https://pit.wallonie.be/docs/greenwin_co2_report.pdf", status: "APPROVED" },
    { id: "sc-circular", label: "Contribution Circular Wallonia", type: "strategiccontribution", description: "Alignement avec les objectifs de réintégration matières régionales." },
    { id: "sf-circular", label: "Circular Wallonia", type: "strategicframework", description: "Stratégie régionale de l'économie circulaire de la Wallonie." }
  ],
  MedTech: [
    { id: "benef-medtech", label: "MedTech Namur", type: "beneficiary", description: "Startup en imagerie médicale assistée par IA." },
    { id: "chall-mdr", label: "Certification MDR CE", type: "challenge", description: "Obtenir l'homologation logicielle clinique pour le marquage CE." },
    { id: "serv-diagia", label: "Diagnostic IA Clinique", type: "service", description: "Test clinique assisté et validation de modèle d'IA médicale.", code: "SRV-IA-DIAG" },
    { id: "journ-iasante", label: "Parcours IA Santé", type: "journey", description: "Déploiement clinique et homologation réglementaire MDR." },
    { id: "opp-health", label: "Appel Health 2026", type: "opportunity", description: "Appel Horizon Europe pour dispositifs médicaux innovants.", status: "APPROVED" },
    { id: "proj-imagerie", label: "MedTech IA Imagerie", type: "project", description: "Détection automatisée de tumeurs par modèles d'imagerie clinique." },
    { id: "out-clinical", label: "Algorithme certifié", type: "outcome", description: "Certification logicielle obtenue avec validation clinique CHU Liège." },
    { id: "evi-clinical", label: "Rapport clinique CHU", type: "evidence", description: "Rapport officiel de validation du CHU Liège.", url: "https://pit.wallonie.be/docs/validation_report_chu_liege.pdf", status: "APPROVED" },
    { id: "sc-health", label: "Contribution e-Santé S3", type: "strategiccontribution", description: "Alignement avec la priorité Santé et Sciences du vivant de la S3." },
    { id: "sf-s3", label: "S3 Wallonie", type: "strategicframework", description: "Smart Specialisation Strategy wallonne." }
  ],
  LogiTrans: [
    { id: "benef-logitrans", label: "LogiTrans S.A.", type: "beneficiary", description: "PME de transport de fret et distribution logistique." },
    { id: "chall-nis2", label: "Sécurisation NIS2", type: "challenge", description: "Mise en conformité cyberNIS2 des serveurs de routage fret." },
    { id: "serv-cyber", label: "Cyber Diagnostic", type: "service", description: "Audit des failles de sécurité OT/IT et NIS2.", code: "SRV-CYBER-DIAG" },
    { id: "journ-cyberpme", label: "Parcours Cyber PME", type: "journey", description: "Plan de renforcement NIS2 et sécurisation cloud." },
    { id: "opp-cheques", label: "Chèques Cyber PME", type: "opportunity", description: "Aide financière WE pour l'audit et la remédiation cyber.", status: "APPROVED" },
    { id: "proj-fretvert", label: "LogiTrans Fret Vert", type: "project", description: "Plateforme de routage logistique sécurisée et décarbonée." },
    { id: "out-secure", label: "Routage NIS2 conforme", type: "outcome", description: "Réseau de routage sécurisé NIS2 certifié." },
    { id: "evi-nis2", label: "Preuve NIS2 Audit", type: "evidence", description: "Rapport d'audit de conformité cyber du CETIC.", url: "https://pit.wallonie.be/docs/logistrans_nis2_audit.pdf", status: "PENDING" },
    { id: "sc-digital", label: "Contribution Digital Wallonia", type: "strategiccontribution", description: "Sécurisation des PME territoriales d'intérêt régional." },
    { id: "sf-digital", label: "Digital Wallonia", type: "strategicframework", description: "Stratégie de transformation numérique de la Wallonie." }
  ],
  HydroGreen: [
    { id: "benef-hydrogreen", label: "HydroGreen S.A.", type: "beneficiary", description: "Grande entreprise spécialisée dans les vecteurs hydrogène vert." },
    { id: "chall-pressure", label: "Stockage Haute Pression", type: "challenge", description: "Sécuriser les réservoirs de stockage d'hydrogène à 700 bars." },
    { id: "serv-tbi", label: "Test Before Invest", type: "service", description: "Accès aux plateformes technologiques de test de pression Sirris.", code: "SRV-TBI-HYDRO" },
    { id: "journ-ind5", label: "Parcours Industrie 5.0", type: "journey", description: "Mise au point d'équipements de stockage sécurisés." },
    { id: "opp-decarb", label: "Appel Décarbonation", type: "opportunity", description: "Financements régionaux du Plan de Relance pour la décarbonation.", status: "APPROVED" },
    { id: "proj-hydroseraing", label: "Projet HydroSeraing", type: "project", description: "Prototype de stockage industriel et distribution hydrogène." },
    { id: "out-electrolyser", label: "Prototype d'Électrolyseur", type: "outcome", description: "Réservoir 700 bars homologué par capteurs prédictifs IA." },
    { id: "evi-meca", label: "Attestation IA MecaTech", type: "evidence", description: "Attestation de déploiement de capteurs prédictifs IA.", url: "https://pit.wallonie.be/docs/hydrogreen_ia_deploy.pdf", status: "PENDING" },
    { id: "sc-prw", label: "Contribution PRW", type: "strategiccontribution", description: "Alignement avec l'Initiative d'Innovation Stratégique PRW Hydrogène." },
    { id: "sf-prw", label: "Plan de Relance (PRW)", type: "strategicframework", description: "Plan de Relance de la Wallonie." }
  ]
};

const typeLabelMap: Record<string, string> = {
  beneficiary: "Entreprise",
  challenge: "Défi d'Écosystème",
  service: "Service CPSV-AP",
  journey: "Parcours",
  opportunity: "Financement",
  project: "Projet PIT",
  outcome: "Outcome",
  evidence: "Preuve (Evidence)",
  strategiccontribution: "Contribution",
  strategicframework: "Cadre Stratégique"
};

const typeColorMap: Record<string, string> = {
  beneficiary: "#f43f5e",
  challenge: "#ef4444",
  service: "#6366f1",
  journey: "#10b981",
  opportunity: "#22c55e",
  project: "#3b82f6",
  outcome: "#eab308",
  evidence: "#059669",
  strategiccontribution: "#f97316",
  strategicframework: "#a855f7"
};

export default function GraphExplorerPage() {
  const [selectedStory, setSelectedStory] = useState<string>("BioPlast");
  
  // ContextPanel states
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [selectedData, setSelectedData] = useState<any>(null);

  // Compute React Flow nodes and edges based on selected scenario
  const { nodes, edges } = useMemo(() => {
    const chain = STORIES[selectedStory] || STORIES.BioPlast;
    
    const flowNodes: Node[] = chain.map((item, idx) => {
      return {
        id: item.id,
        type: "default",
        data: { 
          label: (
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-80 block">
                {typeLabelMap[item.type]}
              </span>
              <span className="mt-0.5 leading-tight font-black">{item.label}</span>
              {item.code && <span className="text-[9px] font-mono mt-1 bg-black/15 px-1 py-0.2 rounded w-max">{item.code}</span>}
              {item.status && <span className="text-[8px] font-extrabold mt-1 block text-teal-200">[{item.status}]</span>}
            </div>
          ) 
        },
        position: { x: 40 + idx * 240, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: typeColorMap[item.type] || "#3b82f6",
          color: "white",
          borderRadius: "12px",
          border: "none",
          width: 190,
          padding: "12px",
          fontSize: "11px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }
      };
    });

    const flowEdges: Edge[] = [];
    for (let i = 0; i < chain.length - 1; i++) {
      flowEdges.push({
        id: `edge-${chain[i].id}-${chain[i+1].id}`,
        source: chain[i].id,
        target: chain[i+1].id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#cbd5e1", strokeWidth: 2.2 },
        markerEnd: { type: "arrowclosed" as any, color: "#cbd5e1" },
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [selectedStory]);

  const handleNodeClick = (event: any, node: Node) => {
    const chain = STORIES[selectedStory] || STORIES.BioPlast;
    const found = chain.find(item => item.id === node.id);
    if (found) {
      setSelectedType(found.type);
      setSelectedId(found.id);
      setSelectedData({
        name: found.label,
        description: found.description,
        uri: `https://pit.wallonie.be/id/${found.type}/${found.id}`,
        url: found.url,
        status: found.status,
        code: found.code
      });
      setPanelOpen(true);
    }
  };

  return (
    <PITLayout
      category="EXPOSITION SÉMANTIQUE"
      title="Graph Explorer Interactif S3"
      description="Visualisez et explorez en un clic le lignage complet reliant les bénéficiaires, leurs défis, les consortiums, les livrables techniques et les politiques stratégiques."
      pageIcon={Network}
      breadcrumb={[{ label: "Graph Explorer" }]}
    >
      <div className="space-y-6">
        {/* Story Selector Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Scénarios Master</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Visualiser une chaîne sémantique d'innovation</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(STORIES).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedStory(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  selectedStory === key 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                    : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                }`}
              >
                {key === "BioPlast" ? "BioPlast (Chimie)" : 
                 key === "MedTech" ? "MedTech Namur (Santé)" :
                 key === "LogiTrans" ? "LogiTrans (Mobilité)" : "HydroGreen (Hydrogène)"}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Viewer Canvas */}
        <div className="h-[450px] w-full border border-muted/20 bg-surface/30 rounded-3xl overflow-hidden relative shadow-inner">
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodeClick={handleNodeClick}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap style={{ borderRadius: 12, overflow: "hidden" }} />
          </ReactFlow>
          
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-muted/25 text-[10px] font-extrabold flex items-center gap-2 text-muted select-none">
            <Info className="h-4 w-4 text-teal-605 shrink-0" />
            <span>Double-cliquez ou zoomez pour vous déplacer. Cliquez sur un nœud pour ouvrir le <strong>ContextPanel</strong>.</span>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-glass/10 border border-muted/15 p-5 rounded-2xl space-y-3">
          <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Légende des Entités de Graphe</span>
          <div className="flex flex-wrap gap-3">
            {Object.entries(typeLabelMap).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 text-[10px] font-bold">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: typeColorMap[type] }} />
                <span className="text-text">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Context Drawer component */}
        <ContextPanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          entityType={selectedType}
          entityId={selectedId}
          entityData={selectedData}
        />
      </div>
    </PITLayout>
  );
}
