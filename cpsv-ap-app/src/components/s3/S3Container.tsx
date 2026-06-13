// src/components/s3/S3Container.tsx
"use client";

import React, { useState, useMemo } from "react";
import { 
  Network, 
  Layers, 
  HelpCircle, 
  Building2, 
  Compass, 
  FolderOpen, 
  Activity, 
  ChevronRight, 
  Info,
  ArrowRight,
  Target,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel, { RelationItem } from "@/design-system/PITRelationsPanel";
import PITStatCard from "@/design-system/PITStatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2S3Domains, 
  useV2ValueChains, 
  useV2ValueChainStages, 
  useV2Services, 
  useV2Journeys,
  useV2Programs
} from "@/hooks/useV2Queries";

// Helper hook to fetch projects by S3 Domain
import { useQuery } from "@tanstack/react-query";
function useV2Projects(s3DomainId?: number) {
  const url = s3DomainId ? `/api/v2/projects?s3Domain=${s3DomainId}` : "/api/v2/projects";
  return useQuery({
    queryKey: ["v2-projects-list-s3", s3DomainId],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    staleTime: 30 * 1000
  });
}

export default function S3Container() {
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  // Fetch S3 hierarchy data
  const { data: domainsData, isLoading: isDomainsLoading, isError: isDomainsError } = useV2S3Domains();
  const { data: chainsData, isLoading: isChainsLoading } = useV2ValueChains();
  const { data: stagesData, isLoading: isStagesLoading } = useV2ValueChainStages();

  const domains = domainsData?.data || [];
  const chains = chainsData?.data || [];
  const stages = stagesData?.data || [];

  // Filter Value Chains based on selected Domain
  const filteredChains = useMemo(() => {
    if (!selectedDomainId) return [];
    return chains.filter((c: any) => c.s3DomainId === selectedDomainId);
  }, [chains, selectedDomainId]);

  // Filter Value Chain Stages based on selected Chain
  const filteredStages = useMemo(() => {
    if (!selectedChainId) return [];
    return stages.filter((s: any) => s.valueChainId === selectedChainId);
  }, [stages, selectedChainId]);

  // Selected entities details
  const activeDomain = useMemo(() => domains.find((d: any) => d.id === selectedDomainId), [domains, selectedDomainId]);
  const activeChain = useMemo(() => chains.find((c: any) => c.id === selectedChainId), [chains, selectedChainId]);
  const activeStage = useMemo(() => stages.find((s: any) => s.id === selectedStageId), [stages, selectedStageId]);

  return (
    <PITLayout
      category="COCKPIT S3"
      title="Observatoire de Spécialisation Intelligente (S3)"
      description="Explorez les filières d'innovation prioritaires wallonnes et identifiez les maillons stratégiques sur lesquels s'alignent les services publics."
      pageIcon={Network}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Stratégie S3" }]}
    >
      {isDomainsError && (
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

      {/* 3-Column Drilldown Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        {/* Column 1: S3 Domains */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 p-4 shadow-sm flex flex-col h-[300px]">
          <h3 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
            <span>1. Domaines Stratégiques S3</span>
            <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase text-[8px] border-0">
              {domains.length} Domaines
            </Badge>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
            {isDomainsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
              ))
            ) : (
              domains.map((dom: any) => (
                <div
                  key={dom.id}
                  onClick={() => {
                    setSelectedDomainId(dom.id);
                    setSelectedChainId(null);
                    setSelectedStageId(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    selectedDomainId === dom.id
                      ? "bg-teal-500/10 text-text border-l-4 border-l-teal-600 font-bold shadow-xs"
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="h-4 w-4 shrink-0 text-teal-600" />
                    <span className="text-xs truncate">{dom.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Value Chains */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 p-4 shadow-sm flex flex-col h-[300px]">
          <h3 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
            <span>2. Chaînes de Valeur</span>
            {selectedDomainId && (
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase text-[8px] border-0">
                {filteredChains.length} Filières
              </Badge>
            )}
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
            {!selectedDomainId ? (
              <div className="h-full flex items-center justify-center text-xs text-muted/70 italic text-center p-4">
                Sélectionnez un domaine stratégique à gauche.
              </div>
            ) : isChainsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
              ))
            ) : filteredChains.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted italic text-center p-4">
                Aucune chaîne de valeur enregistrée pour ce domaine.
              </div>
            ) : (
              filteredChains.map((chain: any) => (
                <div
                  key={chain.id}
                  onClick={() => {
                    setSelectedChainId(chain.id);
                    setSelectedStageId(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    selectedChainId === chain.id
                      ? "bg-blue-500/10 text-text border-l-4 border-l-blue-600 font-bold shadow-xs"
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Network className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-xs truncate">{chain.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Value Chain Stages */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 p-4 shadow-sm flex flex-col h-[300px]">
          <h3 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
            <span>3. Maillons Stratégiques</span>
            {selectedChainId && (
              <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold uppercase text-[8px] border-0">
                {filteredStages.length} Maillons
              </Badge>
            )}
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
            {!selectedChainId ? (
              <div className="h-full flex items-center justify-center text-xs text-muted/70 italic text-center p-4">
                Sélectionnez une chaîne de valeur au centre.
              </div>
            ) : isStagesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
              ))
            ) : filteredStages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted italic text-center p-4">
                Aucun maillon enregistré pour cette chaîne de valeur.
              </div>
            ) : (
              filteredStages.map((stage: any) => (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    selectedStageId === stage.id
                      ? "bg-purple-500/10 text-text border-l-4 border-l-purple-600 font-bold shadow-xs"
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Activity className="h-4 w-4 shrink-0 text-purple-600" />
                    <span className="text-xs truncate">{stage.name}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Details Panel */}
      {activeStage && activeDomain && activeChain && (
        <S3DetailPanel stage={activeStage} domain={activeDomain} chain={activeChain} />
      )}
    </PITLayout>
  );
}

// S3 Stage Details Panel
interface S3DetailPanelProps {
  stage: any;
  domain: any;
  chain: any;
}

function S3DetailPanel({ stage, domain, chain }: S3DetailPanelProps) {
  // Fetch S3 relations using API filters
  const { data: servicesData, isLoading: servicesLoading } = useV2Services({ valueChainStage: stage.id });
  const { data: journeysData, isLoading: journeysLoading } = useV2Journeys({ valueChainStage: stage.id });
  const { data: programsData, isLoading: programsLoading } = useV2Programs({ s3Domain: domain.id });
  const { data: projectsData, isLoading: projectsLoading } = useV2Projects(domain.id);

  const servicesList = servicesData?.data || [];
  const journeysList = journeysData?.data || [];
  const programsList = programsData?.data || [];
  const projectsList = projectsData?.data || [];

  // Extract S3 Capabilities & S3 Challenges from related services list
  const S3Capabilities = useMemo(() => {
    const capsMap = new Map<number, any>();
    servicesList.forEach((s: any) => {
      if (s.capabilitiesNew) {
        s.capabilitiesNew.forEach((c: any) => capsMap.set(c.id, c));
      }
    });
    return Array.from(capsMap.values());
  }, [servicesList]);

  const S3Challenges = useMemo(() => {
    const challMap = new Map<number, any>();
    servicesList.forEach((s: any) => {
      if (s.challenges) {
        s.challenges.forEach((c: any) => challMap.set(c.id, c));
      }
    });
    return Array.from(challMap.values());
  }, [servicesList]);

  // Overview Tab
  const overviewTabContent = (
    <div className="space-y-6 text-left">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PITStatCard
          label="Services rattachés"
          value={servicesList.length}
          icon={Building2}
          themeColor="teal"
          description="Offres actives"
        />
        <PITStatCard
          label="Parcours de transformation"
          value={journeysList.length}
          icon={Compass}
          themeColor="purple"
          description="Accompagnements PME"
        />
        <PITStatCard
          label="Programmes parents"
          value={programsList.length}
          icon={Target}
          themeColor="blue"
          description="Fonds alloués S3"
        />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description du Maillon</h4>
        <p className="text-xs text-text leading-relaxed">
          {stage.description || "Aucune description détaillée n'est enregistrée pour ce maillon de chaîne de valeur."}
        </p>
      </div>

      {/* Breadcrumb S3 mapping indicators */}
      <div className="p-4 bg-muted/30 border border-muted/10 rounded-xl space-y-3">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted block select-none">
          Alignement stratégique régional S3 :
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase text-[9px] border border-teal-500/20">
            {domain.name}
          </Badge>
          <ChevronRight className="h-3.5 w-3.5 text-muted/50" />
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase text-[9px] border border-blue-500/20">
            {chain.name}
          </Badge>
          <ChevronRight className="h-3.5 w-3.5 text-muted/50" />
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold uppercase text-[9px] border border-purple-500/20">
            {stage.name}
          </Badge>
        </div>
      </div>
    </div>
  );

  // S3 Transformation Tab (Services, Capabilities, Challenges of Maillon)
  const transformationTabContent = useMemo(() => {
    const serviceItems: RelationItem[] = servicesList.map((s: any) => ({
      id: s.id,
      title: s.name,
      relationType: "Service activé",
      Icon: Building2,
      description: s.description,
      onClick: () => window.location.href = `/services?id=${s.id}`
    }));

    const capabilityItems: RelationItem[] = S3Capabilities.map((c: any) => ({
      id: c.id,
      title: c.name,
      relationType: "Capabilité requise",
      Icon: Sparkles,
      description: c.description,
      onClick: () => window.location.href = `/capabilities?id=${c.id}`
    }));

    const challengeItems: RelationItem[] = S3Challenges.map((ch: any) => ({
      id: ch.id,
      title: ch.name,
      relationType: "Défi d'affaires adressé",
      Icon: HelpCircle,
      description: ch.description
    }));

    const sections = [
      { title: `Services du maillon (${servicesList.length})`, items: serviceItems },
      { title: `Capabilités activées (${S3Capabilities.length})`, items: capabilityItems },
      { title: `Défis résolus par le maillon (${S3Challenges.length})`, items: challengeItems }
    ];

    return (
      <div className="space-y-4 text-left">
        {servicesLoading ? (
          <div className="py-8 text-center text-xs text-muted">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-600 mx-auto mb-2"></div>
            Chargement de la chaîne de transformation...
          </div>
        ) : (
          <PITRelationsPanel sections={sections} />
        )}
      </div>
    );
  }, [servicesList, S3Capabilities, S3Challenges, servicesLoading]);

  // S3 Portefeuille Tab (Programs, Projects, Journeys)
  const portfolioTabContent = useMemo(() => {
    const programItems: RelationItem[] = programsList.map((p: any) => ({
      id: p.id,
      title: p.name,
      relationType: "Programme stratégique parent",
      Icon: Target,
      description: p.description,
      onClick: () => window.location.href = `/programs?id=${p.id}`
    }));

    const projectItems: RelationItem[] = projectsList.map((pj: any) => ({
      id: pj.id,
      title: pj.name,
      relationType: "Projet opérationnel parent",
      Icon: FolderOpen,
      description: pj.description
    }));

    const journeyItems: RelationItem[] = journeysList.map((j: any) => ({
      id: j.id,
      title: j.name,
      relationType: "Parcours sémantique associé",
      Icon: Compass,
      description: j.objective,
      onClick: () => window.location.href = `/journeys?id=${j.id}`
    }));

    const sections = [
      { title: `Parcours d'accompagnement associés (${journeysList.length})`, items: journeyItems },
      { title: `Programmes de financement régionaux S3 (${programsList.length})`, items: programItems },
      { title: `Projets du domaine parent (${projectsList.length})`, items: projectItems }
    ];

    return (
      <div className="space-y-4 text-left">
        {programsLoading || projectsLoading || journeysLoading ? (
          <div className="py-8 text-center text-xs text-muted">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-600 mx-auto mb-2"></div>
            Chargement du portefeuille S3...
          </div>
        ) : (
          <div className="space-y-4">
            <PITRelationsPanel sections={sections} />
            
            {/* Document gap */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300 rounded-xl space-y-1 mt-4">
              <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" /> Gaps techniques documentés :
              </p>
              <p className="leading-relaxed">
                Les programmes et projets sont liés uniquement à l'échelle du <strong>Domaine S3</strong> parent (Strategic S3 Domain) dans le modèle de données API v2, et non directement aux maillons individuels. Les résultats affichent donc le portefeuille complet du domaine.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }, [programsList, projectsList, journeysList, programsLoading, projectsLoading, journeysLoading]);

  // Metadata Tab
  const metadataTabContent = (
    <div className="space-y-4 text-xs font-semibold text-text text-left">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">URI de référence du Maillon</span>
          <span className="font-mono text-[10px] break-all select-all block mt-1 text-teal-600 dark:text-teal-400">
            {stage.uri || `https://pit.wallonie.be/s3-stages/${stage.id}`}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">URI du Domaine strategic</span>
          <span className="font-mono text-[10px] break-all select-all block mt-1 text-blue-550 dark:text-blue-400">
            {domain.uri || `https://pit.wallonie.be/s3-domains/${domain.id}`}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma Maillon</span>
          <span className="font-mono mt-1 block select-all">
            {stage.id}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma Domaine</span>
          <span className="font-mono mt-1 block select-all">
            {domain.id}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={stage.name}
      subtitle={stage.description || `Maillon ID: ${stage.id}`}
      badge={
        <div className="flex items-center gap-2 select-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-650 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
            Maillon S3 (Stage)
          </span>
          <span className="text-[9px] font-mono font-bold bg-muted px-1.5 py-0.2 rounded text-muted">
            {stage.category || `STG-${stage.id}`}
          </span>
        </div>
      }
      overviewTab={overviewTabContent}
      relationsTab={transformationTabContent}
      impactTab={portfolioTabContent}
      metadataTab={metadataTabContent}
      overviewLabel="Vue d'ensemble"
      relationsLabel="Chaîne de Transformation"
      impactLabel="Filières & Portefeuille"
      metadataLabel="Métadonnées"
    />
  );
}
