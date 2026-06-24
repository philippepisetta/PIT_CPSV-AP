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
  Link as LinkIcon,
  Shield,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Filter,
  CheckCircle,
  Database,
  ExternalLink,
  GitBranch,
  Lock,
  ListCollapse
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITStatCard from "@/design-system/PITStatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2S3Domains, 
  useV2ValueChains, 
  useV2ValueChainStages, 
  useV2Services, 
  useV2Journeys,
  useV2Programs,
  useV2DIS,
  useV2S3Clusters,
  useV2S3MarketApplications,
  useV2S3Methodology,
  useV2S3Indicators,
  useV2ReferenceFrameworks,
  useV2ReferenceMappings
} from "@/hooks/useV2Queries";

export default function S3Container() {
  const [activeTab, setActiveTab] = useState<string>("drilldown");

  // State for drilldown explorer
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  // States for sub-selections
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [selectedMarketAppId, setSelectedMarketAppId] = useState<number | null>(null);
  const [selectedDisId, setSelectedDisId] = useState<number | null>(null);

  // Filters
  const [clusterRoleFilter, setClusterRoleFilter] = useState<string>("ALL");

  // Fetch S3/DIS queries
  const { data: domainsData, isLoading: isDomainsLoading } = useV2S3Domains();
  const { data: chainsData, isLoading: isChainsLoading } = useV2ValueChains();
  const { data: stagesData, isLoading: isStagesLoading } = useV2ValueChainStages();
  const { data: disData, isLoading: isDisLoading } = useV2DIS();
  const { data: clustersData, isLoading: isClustersLoading } = useV2S3Clusters();
  const { data: marketAppsData, isLoading: isMarketAppsLoading } = useV2S3MarketApplications();
  const { data: methodologyData, isLoading: isMethodologyLoading } = useV2S3Methodology();
  const { data: indicatorsData, isLoading: isIndicatorsLoading } = useV2S3Indicators();
  const { data: frameworksData } = useV2ReferenceFrameworks();
  const { data: mappingsData } = useV2ReferenceMappings();

  const domains = domainsData?.data || [];
  const chains = chainsData?.data || [];
  const stages = stagesData?.data || [];
  const disList = disData?.data || [];
  const clusters = clustersData?.data || [];
  const marketApps = marketAppsData?.data || [];
  const methodologyNotes = methodologyData?.data || [];
  const indicatorBlocks = indicatorsData?.data || [];
  const frameworks = frameworksData?.data || [];
  const mappings = mappingsData?.data || [];

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

  // Filtered clusters based on role dropdown
  const filteredClusters = useMemo(() => {
    if (clusterRoleFilter === "ALL") return clusters;
    return clusters.filter((c: any) => c.role === clusterRoleFilter);
  }, [clusters, clusterRoleFilter]);

  // Selected Entities
  const activeDomain = useMemo(() => domains.find((d: any) => d.id === selectedDomainId), [domains, selectedDomainId]);
  const activeChain = useMemo(() => chains.find((c: any) => c.id === selectedChainId), [chains, selectedChainId]);
  const activeStage = useMemo(() => stages.find((s: any) => s.id === selectedStageId), [stages, selectedStageId]);
  const activeCluster = useMemo(() => clusters.find((c: any) => c.id === selectedClusterId), [clusters, selectedClusterId]);
  const activeMarketApp = useMemo(() => marketApps.find((m: any) => m.id === selectedMarketAppId), [marketApps, selectedMarketAppId]);
  const activeDis = useMemo(() => disList.find((d: any) => d.id === selectedDisId), [disList, selectedDisId]);

  return (
    <PITLayout
      category="COCKPIT S3"
      title="Observatoire de Spécialisation Intelligente (S3)"
      description="Gérez le positionnement wallon dans la stratégie S3, des clusters méthodologiques Technopolis aux DIS et data spaces officiels."
      pageIcon={Network}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Stratégie S3 / DIS" }]}
    >
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap border-b border-muted/20 gap-1 mb-6">
        <button
          onClick={() => setActiveTab("drilldown")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "drilldown"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <Layers className="h-4 w-4" />
          Filières & Drilldown S3
        </button>
        <button
          onClick={() => setActiveTab("market-apps")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "market-apps"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <Compass className="h-4 w-4" />
          Marchés Applicatifs
        </button>
        <button
          onClick={() => setActiveTab("clusters")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "clusters"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <Activity className="h-4 w-4" />
          Clusters Technopolis (20)
        </button>
        <button
          onClick={() => setActiveTab("dis-groupings")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "dis-groupings"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <Target className="h-4 w-4" />
          Regroupements DIS
        </button>
        <button
          onClick={() => setActiveTab("scoring")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "scoring"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Scoring Multicritère
        </button>
        <button
          onClick={() => setActiveTab("mappings")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "mappings"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <GitBranch className="h-4 w-4" />
          Cartographie Sémantique
        </button>
        <button
          onClick={() => setActiveTab("methodology")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "methodology"
              ? "border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold"
              : "border-transparent text-muted hover:text-text hover:bg-glass"
          }`}
        >
          <Shield className="h-4 w-4" />
          Qualité des données & Limites
        </button>
      </div>

      {/* Tab Contents */}
      <div className="w-full">
        {/* ==================== TAB 1: DRILLDOWN S3 ==================== */}
        {activeTab === "drilldown" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* S3 Domains */}
              <div className="bg-surface border border-muted/20 p-4 rounded-2xl h-[300px] flex flex-col">
                <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
                  <span>1. Domaines S3</span>
                  <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-0">{domains.length}</Badge>
                </h4>
                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {isDomainsLoading ? (
                    <div className="text-xs text-muted p-4">Chargement...</div>
                  ) : (
                    domains.map((dom: any) => (
                      <div
                        key={dom.id}
                        onClick={() => {
                          setSelectedDomainId(dom.id);
                          setSelectedChainId(null);
                          setSelectedStageId(null);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                          selectedDomainId === dom.id
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border-l-2 border-teal-500"
                            : "text-muted hover:bg-glass hover:text-text"
                        }`}
                      >
                        <span>{dom.name}</span>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Value Chains */}
              <div className="bg-surface border border-muted/20 p-4 rounded-2xl h-[300px] flex flex-col">
                <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
                  <span>2. Chaînes de valeur</span>
                  <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-0">{filteredChains.length}</Badge>
                </h4>
                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {!selectedDomainId ? (
                    <div className="text-xs text-muted/60 italic p-4 text-center">Sélectionnez un domaine S3.</div>
                  ) : (
                    filteredChains.map((c: any) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChainId(c.id);
                          setSelectedStageId(null);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                          selectedChainId === c.id
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border-l-2 border-teal-500"
                            : "text-muted hover:bg-glass hover:text-text"
                        }`}
                      >
                        <span>{c.name}</span>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Stages */}
              <div className="bg-surface border border-muted/20 p-4 rounded-2xl h-[300px] flex flex-col">
                <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3 flex items-center justify-between">
                  <span>3. Maillons</span>
                  <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-0">{filteredStages.length}</Badge>
                </h4>
                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {!selectedChainId ? (
                    <div className="text-xs text-muted/60 italic p-4 text-center">Sélectionnez une filière.</div>
                  ) : (
                    filteredStages.map((s: any) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStageId(s.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                          selectedStageId === s.id
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border-l-2 border-teal-500"
                            : "text-muted hover:bg-glass hover:text-text"
                        }`}
                      >
                        <span>{s.name}</span>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Stage Detail Panel */}
            {activeStage && activeDomain && activeChain && (
              <div className="bg-surface border border-muted/20 p-6 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-muted/10 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-text">{activeStage.name}</h3>
                    <p className="text-xs text-muted mt-1">{activeStage.description || "Pas de description"}</p>
                  </div>
                  <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-0 self-start sm:self-center">
                    Maillon S3
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-muted tracking-wider">Lignage S3</h5>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                      <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded font-bold">{activeDomain.name}</span>
                      <span>&rarr;</span>
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">{activeChain.name}</span>
                      <span>&rarr;</span>
                      <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-bold">{activeStage.name}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-muted tracking-wider">URI Identifiant</h5>
                    <span className="text-[10px] font-mono bg-glass/25 p-2 rounded block break-all text-muted">
                      {activeStage.uri || `http://pit.wallonie.be/s3/concepts/${activeStage.id}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: MARCHÉS APPLICATIFS ==================== */}
        {activeTab === "market-apps" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="bg-surface border border-muted/20 p-4 rounded-2xl lg:col-span-1 h-[600px] flex flex-col">
              <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3">
                Marchés Applicatifs Wallons ({marketApps.length})
              </h4>
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                {isMarketAppsLoading ? (
                  <div className="text-xs text-muted p-4">Chargement...</div>
                ) : (
                  marketApps.map((app: any) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedMarketAppId(app.id)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all text-xs text-left ${
                        selectedMarketAppId === app.id
                          ? "bg-teal-500/10 border-teal-500/50 text-text font-bold"
                          : "bg-surface border-muted/10 hover:border-muted/30 text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-text">{app.code || `MA-${app.id}`}</span>
                        {app.isProxy && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 text-[8px] font-extrabold uppercase px-1 py-0 shadow-none">
                            Proxy
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground font-normal">{app.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="lg:col-span-2 space-y-6">
              {activeMarketApp ? (
                <div className="bg-surface border border-muted/20 p-6 rounded-2xl space-y-6 text-left">
                  <div className="flex items-start justify-between border-b border-muted/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded">
                          {activeMarketApp.code || `MA-${activeMarketApp.id}`}
                        </span>
                        <Badge className={`${activeMarketApp.validationStatus === 'VALIDATED' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'} border-0 font-extrabold text-[9px] uppercase px-2`}>
                          {activeMarketApp.validationStatus}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black text-text mt-2">{activeMarketApp.name}</h3>
                      <p className="text-xs text-muted mt-2">{activeMarketApp.description || "Aucune description enregistrée."}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-muted tracking-wider">Relations S3 / DIS</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-muted block uppercase">DIS Potentiel lié</span>
                          <span className="text-xs font-bold text-text">
                            {activeMarketApp.potentialDis?.name || "Non affecté"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block uppercase">Cluster GTS3 d'origine</span>
                          <span className="text-xs font-bold text-text">
                            {activeMarketApp.cluster ? `Cluster ${activeMarketApp.cluster.code} - ${activeMarketApp.cluster.name}` : "Non affecté"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-muted tracking-wider">Codes de qualification stable</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-muted block uppercase">Codes NACE sectoriels</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeMarketApp.naceCodes && activeMarketApp.naceCodes.length > 0 ? (
                              activeMarketApp.naceCodes.map((c: any) => (
                                <Badge key={c.id} className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 text-[10px]">
                                  {c.code}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted/60 italic">Aucun code NACE associé</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block uppercase">Classification NABS 2007</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeMarketApp.nabsCodes && activeMarketApp.nabsCodes.length > 0 ? (
                              activeMarketApp.nabsCodes.map((c: any) => (
                                <Badge key={c.id} className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-0 text-[10px]">
                                  {c.code}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted/60 italic">Aucun code NABS associé</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Triangulation warning */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                    <p className="text-xs font-black uppercase text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Limite méthodologique GTS3
                    </p>
                    <p className="text-[11px] text-muted leading-relaxed font-normal">
                      Ce marché applicatif a été identifié par clustering sémantique KMeans sur l'OpenData et ORBIS par Technopolis. Il représente un proxy stratégique temporaire nécessitant une triangulation et validation par le Cabinet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-muted/20 p-12 rounded-2xl text-center text-xs text-muted italic flex items-center justify-center h-[350px]">
                  Sélectionnez un marché applicatif à gauche pour visualiser ses fiches et diagnostics 360°.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CLUSTERS TECHNOPOLIS ==================== */}
        {activeTab === "clusters" && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-surface border border-muted/20 p-4 rounded-xl gap-4 text-left">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted" />
                <span className="text-xs font-bold text-text">Filtrer par Rôle</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ALL", "MARKET_CLUSTER", "TRANSVERSAL_CLUSTER", "NOISY_CLUSTER", "RESIDUAL_CLUSTER"].map((role) => (
                  <Button
                    key={role}
                    variant={clusterRoleFilter === role ? "default" : "outline"}
                    size="sm"
                    className="text-xs py-1 h-auto"
                    onClick={() => setClusterRoleFilter(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isClustersLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 bg-muted/20 border border-muted/10 rounded-2xl animate-pulse"></div>
                ))
              ) : filteredClusters.length === 0 ? (
                <div className="col-span-full bg-surface border border-muted/20 p-12 rounded-2xl text-center text-xs text-muted italic">
                  Aucun cluster trouvé pour ce filtre.
                </div>
              ) : (
                filteredClusters.map((cluster: any) => (
                  <div
                    key={cluster.id}
                    className="bg-surface border border-muted/20 p-5 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between text-left relative overflow-hidden"
                  >
                    {cluster.isProxy && (
                      <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[7px] px-2.5 py-0.5 rounded-bl border-l border-b border-amber-500/20">
                        Proxy
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-teal-500/10 text-teal-600 border-0 font-extrabold text-[9px] uppercase px-2 py-0">
                          ID: {cluster.code}
                        </Badge>
                        <Badge className="bg-muted text-muted-foreground border-0 font-bold text-[8px] uppercase px-1.5">
                          {cluster.role}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-black text-text line-clamp-1">{cluster.name}</h4>
                      <p className="text-[11px] text-muted line-clamp-3 leading-relaxed">{cluster.description || "Pas de description"}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-muted/10 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted uppercase">Statut: {cluster.validationStatus}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] h-6 px-2 hover:bg-teal-500/5 text-teal-600 hover:text-teal-700 font-bold uppercase gap-1"
                        onClick={() => {
                          setSelectedClusterId(cluster.id);
                          setActiveTab("market-apps");
                        }}
                      >
                        Détails <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: REGROUPEMENTS DIS POTENTIELS ==================== */}
        {activeTab === "dis-groupings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* List of DIS */}
            <div className="bg-surface border border-muted/20 p-4 rounded-2xl lg:col-span-1 h-[600px] flex flex-col">
              <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 mb-3">
                Domaines d'Innovation Stratégique (DIS)
              </h4>
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                {isDisLoading ? (
                  <div className="text-xs text-muted p-4">Chargement...</div>
                ) : (
                  disList.map((dis: any) => (
                    <div
                      key={dis.id}
                      onClick={() => setSelectedDisId(dis.id)}
                      className={`p-3.5 rounded-xl cursor-pointer border transition-all text-xs ${
                        selectedDisId === dis.id
                          ? "bg-teal-500/10 border-teal-500/50 text-text font-bold"
                          : "bg-surface border-muted/10 hover:border-muted/30 text-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-text uppercase tracking-wider">{dis.code || `DIS-${dis.id}`}</span>
                        <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[8px] font-extrabold uppercase px-1.5 py-0 shadow-none">
                          {dis.version}
                        </Badge>
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground font-normal mt-1">{dis.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DIS Detail */}
            <div className="lg:col-span-2 space-y-6">
              {activeDis ? (
                <div className="bg-surface border border-muted/20 p-6 rounded-2xl space-y-6">
                  <div className="border-b border-muted/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded">
                        {activeDis.code || `DIS-${activeDis.id}`}
                      </span>
                      <span className="text-[10px] font-bold text-muted">Version: {activeDis.version}</span>
                    </div>
                    <h3 className="text-lg font-black text-text mt-3">{activeDis.name}</h3>
                    <p className="text-xs text-muted mt-2 leading-relaxed">{activeDis.description || "Aucune description enregistrée."}</p>
                  </div>

                  {/* Associated Clusters */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-muted tracking-wider">Clusters GTS3 rattachés</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeDis.clusters && activeDis.clusters.length > 0 ? (
                        activeDis.clusters.map((c: any) => (
                          <div key={c.id} className="p-3 bg-muted/20 border border-muted/10 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold text-text block">Cluster {c.code}</span>
                              <span className="text-[10px] text-muted block truncate max-w-[180px]">{c.name}</span>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[8px] font-bold">
                              {c.role}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted/60 italic col-span-full">Aucun cluster rattaché</span>
                      )}
                    </div>
                  </div>

                  {/* Framework and source */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
                      <span className="text-[9px] font-bold text-muted uppercase block">Cadre de référence S3</span>
                      <span className="text-xs font-extrabold mt-1 block">
                        {activeDis.framework?.labelFr || "S3 Wallonie CoP"}
                      </span>
                    </div>
                    <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
                      <span className="text-[9px] font-bold text-muted uppercase block">Source Documentaire</span>
                      <span className="text-xs font-extrabold mt-1 block text-teal-600 dark:text-teal-400">
                        {activeDis.sourceDocument?.title || "Technopolis S3 Presentation 2026"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-muted/20 p-12 rounded-2xl text-center text-xs text-muted italic flex items-center justify-center h-[350px]">
                  Sélectionnez un Domaine d'Innovation Stratégique (DIS) à gauche pour afficher ses mappings et clusters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SCORING MULTICRITÈRE ==================== */}
        {activeTab === "scoring" && (
          <div className="space-y-6 text-left">
            <div className="bg-surface border border-muted/20 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-black uppercase text-muted tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-teal-600" /> Tableau Analytique de Scoring GTS3 / DIS
              </h4>
              <p className="text-xs text-muted">
                Visualisez la performance comparative des clusters méthodologiques GTS3 sur les critères prioritaires de la S3 Wallonne (critères Technopolis validés).
              </p>
            </div>

            <div className="bg-surface border border-muted/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-muted/10 text-xs">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left font-black uppercase tracking-wider text-muted">Code</th>
                      <th className="px-4 py-3 text-left font-black uppercase tracking-wider text-muted">Cluster</th>
                      <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-muted">Masse critique</th>
                      <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-muted">Intensité RDI</th>
                      <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-muted">Potentiel Export</th>
                      <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-muted">Contribution S3</th>
                      <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-muted">Arbitrage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/10 font-medium text-text">
                    {isClustersLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">Chargement du scoring...</td>
                      </tr>
                    ) : clusters.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted">Aucun score disponible. Exécutez le seeding.</td>
                      </tr>
                    ) : (
                      clusters.map((c: any) => {
                        const scores = c.scoringCriteria || [];
                        const mass = scores.find((s: any) => s.name.includes("Masse"))?.weight || 1.0;
                        const rdi = scores.find((s: any) => s.name.includes("RDI"))?.weight || 1.0;
                        const exp = scores.find((s: any) => s.name.includes("Export"))?.weight || 1.0;
                        const contr = scores.find((s: any) => s.name.includes("S3"))?.weight || 1.0;
                        
                        return (
                          <tr key={c.id} className="hover:bg-glass/10 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-teal-600 dark:text-teal-400">CL-{c.code}</td>
                            <td className="px-4 py-3.5 max-w-[200px] truncate">{c.name}</td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold">{(mass * 10).toFixed(1)}/10</td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold">{(rdi * 10).toFixed(1)}/10</td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold">{(exp * 10).toFixed(1)}/10</td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold">{(contr * 10).toFixed(1)}/10</td>
                            <td className="px-4 py-3.5 text-center">
                              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 uppercase text-[8px] font-extrabold px-1.5 shadow-none">
                                {c.arbitrationStatus}
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
        )}

        {/* ==================== TAB 6: CARTOGRAPHIE SÉMANTIQUE ==================== */}
        {activeTab === "mappings" && (
          <div className="space-y-6 text-left">
            <div className="bg-surface border border-muted/20 p-5 rounded-2xl">
              <h4 className="text-xs font-black uppercase text-muted tracking-wider flex items-center gap-1.5 mb-2">
                <GitBranch className="h-4 w-4 text-teal-650" /> Alignement Sémantique des Référentiels
              </h4>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Visualisez et qualifiez les liens logiques entre les objets PIT et les frameworks officiels (S3, Data Spaces).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mappings Overview */}
              <div className="bg-surface border border-muted/20 p-5 rounded-2xl space-y-4">
                <h5 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10 flex items-center justify-between">
                  <span>Alignements Conceptuels (SKOS)</span>
                  <Badge className="bg-teal-500/10 text-teal-600 border-0">{mappings.length} Mappings</Badge>
                </h5>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
                  {mappings.length === 0 ? (
                    <div className="text-xs text-muted/60 italic text-center py-6">Aucun mapping de concept enregistré.</div>
                  ) : (
                    mappings.map((m: any) => (
                      <div key={m.id} className="p-3 bg-muted/20 border border-muted/10 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-teal-600 dark:text-teal-400">{m.sourceConcept?.labelFr}</span>
                          <span className="text-[9px] font-black bg-teal-500/10 text-teal-600 border border-teal-500/20 px-1 rounded uppercase">
                            {m.mappingType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted text-[10px]">&rarr;</span>
                          <span className="font-extrabold text-blue-600 dark:text-blue-400">{m.targetConcept?.labelFr}</span>
                        </div>
                        {m.description && (
                          <p className="text-[10px] text-muted font-normal mt-1 leading-normal italic">{m.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Visual mappings list */}
              <div className="bg-surface border border-muted/20 p-5 rounded-2xl space-y-4">
                <h5 className="text-[10px] font-black uppercase text-muted tracking-wider pb-2 border-b border-muted/10">
                  Lignage Métier (Lineage Logique)
                </h5>

                <div className="space-y-3.5">
                  <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                    <span className="text-[10px] font-black text-teal-600 uppercase block select-none mb-1">DIS &rarr; S3 Priority</span>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Les Domaines d'Innovation Stratégique wallons (ex: Circular Wallonia) s'alignent sur les priorités thématiques de la Commission Européenne.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <span className="text-[10px] font-black text-blue-600 uppercase block select-none mb-1">MarketApplication &rarr; S3 Priority</span>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Les marchés applicatifs PwC / Technopolis sont qualifiés par rapport aux thématiques globales S3 pour valider la représentativité.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                    <span className="text-[10px] font-black text-purple-600 uppercase block select-none mb-1">S3 Cluster &rarr; DIS</span>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Les 20 clusters issus du KMeans Technopolis sont assignés comme proxys sémantiques au DIS correspondant (ex: Système intelligent &rarr; Manufacturing).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: METHODOLOGY & LIMITATIONS ==================== */}
        {activeTab === "methodology" && (
          <div className="space-y-6 text-left">
            <div className="bg-surface border border-muted/20 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-3">
                <Shield className="h-4 w-4 text-teal-600" /> Évaluation Méthodologique & Limites
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase block">Notion de Proxy S3</span>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      Les clusters Technopolis (ORBIS/OpenData) sont stockés comme des <strong>Proxys méthodologiques</strong>. Ils ne constituent pas la vérité politique absolue et doivent faire l'objet de triangulations ultérieures avant d'être validés.
                    </p>
                  </div>

                  <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase block">Limitation : Perte de multi-positionnement</span>
                    <p className="text-xs text-muted leading-relaxed font-normal">
                      La méthode KMeans contraint chaque entreprise ou mot-clé à appartenir à un unique cluster (single-assignment), ce qui sous-représente les acteurs hybrides.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase block">Notes de Méthodologie GTS3 ({methodologyNotes.length})</span>
                    <div className="space-y-2">
                      {methodologyNotes.map((note: any) => (
                        <div key={note.id} className="p-2.5 bg-muted/25 rounded-lg border border-muted/10 text-xs">
                          <span className="font-extrabold text-teal-600 block">{note.title}</span>
                          <p className="text-[11px] text-muted mt-1 leading-normal font-normal">{note.content}</p>
                          {note.limitations && (
                            <p className="text-[10px] text-amber-600 font-normal mt-1 italic">&bull; Limitation: {note.limitations}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PITLayout>
  );
}
