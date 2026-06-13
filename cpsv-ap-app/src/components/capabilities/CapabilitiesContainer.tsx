// src/components/capabilities/CapabilitiesContainer.tsx
"use client";

import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Share2, 
  Layers, 
  Compass, 
  FolderOpen, 
  Activity, 
  CheckCircle,
  HelpCircle,
  Eye, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import PITRelationsPanel, { RelationItem } from "@/design-system/PITRelationsPanel";
import PITGraphView from "@/design-system/PITGraphView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2Capabilities, 
  useV2Services, 
  useV2Journeys, 
  useV2GraphQuery,
  useV2Contributions
} from "@/hooks/useV2Queries";
import PITImpactPanel from "@/design-system/PITImpactPanel";

// Temporary hook for fetching challenges (fallback query client-side)
import { useQuery } from "@tanstack/react-query";
function useV2Challenges() {
  return useQuery({
    queryKey: ["v2-challenges-list"],
    queryFn: async () => {
      const res = await fetch("/api/v2/challenges");
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return res.json();
    },
    staleTime: 30 * 1000
  });
}

export default function CapabilitiesContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<number | null>(null);

  // Fetch all capabilities (flat collection)
  const { data: capData, isLoading: isCapLoading, isError: isCapError } = useV2Capabilities();

  // Selected capability
  const capabilities = capData?.data || [];

  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((cap: any) => {
      const matchesSearch = 
        cap.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cap.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cap.description && cap.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType ? cap.capabilityType === selectedType : true;
      return matchesSearch && matchesType;
    });
  }, [capabilities, searchQuery, selectedType]);

  const selectedCap = useMemo(() => {
    if (!selectedCapabilityId) return null;
    return capabilities.find((c: any) => c.id === selectedCapabilityId) || null;
  }, [capabilities, selectedCapabilityId]);

  const typeOptions = [
    { value: "TECHNOLOGICAL", label: "Technologique" },
    { value: "HUMAN", label: "Humaine" },
    { value: "OPERATIONAL", label: "Opérationnelle" }
  ];

  return (
    <PITLayout
      category="COCKPIT CAPABILITÉS"
      title="Référentiel des Capabilités"
      description="Gérez les compétences et aptitudes technologiques (IA, IoT, Cloud) et d'affaires requises pour accompagner la transition des PME."
      pageIcon={BookOpen}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Capabilités" }]}
    >
      {/* 1. Filter Bar */}
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une capabilité (nom, code, description)..."
        selectFilters={[
          {
            id: "type-filter",
            label: "Filtrer par Type",
            value: selectedType,
            options: typeOptions,
            onChange: setSelectedType
          }
        ]}
      />

      {isCapError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 rounded-xl flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            ⚠️
          </span>
          <div>
            <p className="font-bold">API v2 Hors Ligne (Erreur HTTP 404)</p>
            <p className="text-[11px] text-muted-foreground font-normal mt-0.5">
              Le service d'API v2 (Render) n'est pas disponible ou exécute une version obsolète. Les données temps réel ne peuvent pas être récupérées.
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Workspace Split Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left List */}
        <div className={selectedCapabilityId ? "xl:col-span-6 space-y-4" : "xl:col-span-12 space-y-4"}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
                    <th className="px-5 py-4">Code / Capabilité</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Parent Capability</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isCapLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-44"></div></td>
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                        <td className="px-5 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                      </tr>
                    ))
                  ) : filteredCapabilities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted italic">
                        Aucune capabilité trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredCapabilities.map((cap: any) => {
                      const parent = capabilities.find((c: any) => c.id === cap.parentCapabilityId);
                      return (
                        <tr
                          key={cap.id}
                          onClick={() => setSelectedCapabilityId(cap.id)}
                          className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-100 dark:border-gray-850 transition-colors ${
                            selectedCapabilityId === cap.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                          }`}
                        >
                          <td className="px-5 py-4 font-bold text-text">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                                {cap.code}
                              </span>
                              <span className="truncate max-w-[200px]" title={cap.name}>{cap.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={`font-bold text-[9px] uppercase px-2 py-0.5 rounded-full ${
                              cap.capabilityType === "TECHNOLOGICAL"
                                ? "bg-blue-500/10 border-blue-500/25 text-blue-600"
                                : cap.capabilityType === "HUMAN"
                                ? "bg-amber-500/10 border-amber-500/25 text-amber-600"
                                : "bg-purple-500/10 border-purple-500/25 text-purple-600"
                            }`}>
                              {cap.capabilityType === "TECHNOLOGICAL" ? "Technologique" : cap.capabilityType === "HUMAN" ? "Humaine" : "Opérationnelle"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-muted/95 font-semibold">
                            {parent ? parent.name : <span className="text-muted/50 italic">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[9px] uppercase">
                              {cap.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        {selectedCap && (
          <div className="xl:col-span-6 w-full space-y-4">
            <CapabilityDetailPanel capability={selectedCap} capabilities={capabilities} onClose={() => setSelectedCapabilityId(null)} />
          </div>
        )}
      </div>
    </PITLayout>
  );
}

// Capability Detailed Panel using PITDetailLayout
interface CapabilityDetailPanelProps {
  capability: any;
  capabilities: any[];
  onClose: () => void;
}

function CapabilityDetailPanel({ capability, capabilities, onClose }: CapabilityDetailPanelProps) {
  // Fetch services and journeys lists for client-side filtering of relations
  const { data: servicesData } = useV2Services({ pageSize: 100 });
  const { data: journeysData } = useV2Journeys({ pageSize: 100 });
  const { data: challengesData } = useV2Challenges();
  const { data: graphData } = useV2GraphQuery("capabilities", capability.id);
  const { data: contributionsData } = useV2Contributions("capabilities", capability.id);

  const parent = capabilities.find((c) => c.id === capability.parentCapabilityId);

  // Client-side filter relations
  const relatedServices = useMemo(() => {
    const list = servicesData?.data || [];
    return list.filter((s: any) => 
      s.capabilitiesNew && s.capabilitiesNew.some((c: any) => c.id === capability.id)
    );
  }, [servicesData, capability]);

  const relatedJourneys = useMemo(() => {
    const list = journeysData?.data || [];
    // Journeys don't have capabilitiesNew returned directly, so we check graph/API metadata mapping
    return list.filter((j: any) => 
      j.challenges && j.challenges.some((chall: any) => 
        chall.id === capability.id // or matching s3 alignment
      )
    );
  }, [journeysData, capability]);

  const relatedChallenges = useMemo(() => {
    const list = challengesData?.data || [];
    return list.filter((c: any) => 
      c.capabilities && c.capabilities.some((cap: any) => cap.id === capability.id)
    );
  }, [challengesData, capability]);

  // Overview tab
  const overviewContent = (
    <div className="space-y-6">
      {/* 2 cards of KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Services rattachés"
          value={relatedServices.length}
          icon={Building2}
          themeColor="teal"
          description="Offres actives"
        />
        <PITStatCard
          label="Défis d'affaires"
          value={relatedChallenges.length}
          icon={HelpCircle}
          themeColor="rose"
          description="Besoins entreprises"
        />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description</h4>
        <p className="text-xs text-text leading-relaxed">
          {capability.description || "Aucune description détaillée n'est enregistrée pour cette capabilité."}
        </p>
      </div>

      {capability.synonyms && capability.synonyms.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Synonymes / Mots-clés</h4>
          <div className="flex flex-wrap gap-1.5">
            {capability.synonyms.map((s: string, idx: number) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-muted/80 text-muted font-bold text-[10px] border border-muted/10">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hierarchy and Type details */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-muted/10 text-xs">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider block">
            Type de Capabilité
          </span>
          <span className="font-bold text-text">
            {capability.capabilityType === "TECHNOLOGICAL" ? "Technologique (IA, Cloud, Cybersécurité)" : capability.capabilityType === "HUMAN" ? "Humaine (Formation, Skills)" : "Opérationnelle (Processus, Lean)"}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider block">
            Capabilité Parente
          </span>
          <span className="font-bold text-text">
            {parent ? parent.name : <span className="text-muted/50 italic font-normal">Aucune (Racine)</span>}
          </span>
        </div>
      </div>
    </div>
  );

  // Relations tab
  const relationsContent = useMemo(() => {
    const challengeItems: RelationItem[] = relatedChallenges.map((c: any) => ({
      id: c.id,
      title: c.name,
      relationType: "Adresses Challenge",
      Icon: HelpCircle,
      description: c.description
    }));

    const serviceItems: RelationItem[] = relatedServices.map((s: any) => ({
      id: s.id,
      title: s.name,
      relationType: "Soutenu par Service",
      Icon: Building2,
      description: s.description
    }));

    const journeyItems: RelationItem[] = relatedJourneys.map((j: any) => ({
      id: j.id,
      title: j.name,
      relationType: "Intégré dans Parcours",
      Icon: Compass,
      description: j.objective
    }));

    const sections = [
      { title: "Défis d'affaires adressés", items: challengeItems },
      { title: "Services publics d'accompagnement", items: serviceItems },
      { title: "Parcours de transformation", items: journeyItems }
    ];

    return (
      <div className="space-y-4">
        <PITRelationsPanel sections={sections} />
        
        {/* Document gaps */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300 rounded-xl space-y-1 mt-4">
          <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" /> Gaps techniques documentés :
          </p>
          <p className="leading-relaxed">
            Les relations directes <code>Capability ↔ Program</code> et <code>Capability ↔ Project</code> ne sont pas retournées par l'API v2 actuelle. Elles seront implémentées dans le Sprint 6 avec le graphe complet.
          </p>
        </div>
      </div>
    );
  }, [relatedChallenges, relatedServices, relatedJourneys]);

  // Graph tab
  const graphContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Graphe local de la Capabilité (vNext)
        </h4>
        <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 rounded">
          Capability Hierarchy
        </span>
      </div>
      {graphData?.data ? (
        <PITGraphView 
          nodes={graphData.data.nodes} 
          edges={graphData.data.edges} 
          mode="capability"
          className="border border-muted/10 rounded-xl"
        />
      ) : (
        <div className="h-[300px] flex items-center justify-center border border-muted/10 border-dashed rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}
    </div>
  );

  // Metadata tab
  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">URI de référence</span>
          <span className="font-mono text-[10px] break-all select-all block mt-1 text-teal-600 dark:text-teal-400">
            {capability.uri}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Prisma ID</span>
          <span className="font-mono mt-1 block select-all">
            {capability.id}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={capability.name}
      subtitle={capability.description || `Capabilité ID: ${capability.id}`}
      badge={
        <div className="flex items-center gap-2 select-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
            Capabilité Métier
          </span>
          <span className="text-[9px] font-mono font-bold bg-muted px-1.5 py-0.2 rounded text-muted">
            {capability.code}
          </span>
        </div>
      }
      actions={
        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-[11px] font-bold">
          Fermer
        </Button>
      }
      overviewTab={overviewContent}
      relationsTab={graphContent}
      impactTab={relationsContent}
      contributionsTab={<PITImpactPanel data={contributionsData} />}
      metadataTab={metadataContent}
      overviewLabel="Vue d'ensemble"
      relationsLabel="Relations Graphe"
      impactLabel="Relations Métier"
      contributionsLabel="Impact & Contributions"
      metadataLabel="Métadonnées"
    />
  );
}
