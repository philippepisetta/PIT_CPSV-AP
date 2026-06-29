// src/app/interoperability/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Settings, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Network, 
  FileCode, 
  Activity, 
  RefreshCw,
  Plus,
  Shield,
  Zap,
  Info,
  BarChart2,
  Lock,
  Eye,
  Check,
  Trash2,
  Layers,
  Search,
  BookOpen
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import { 
  useV2SourceSystemsQuery, 
  useV2CreateSourceSystemMutation,
  useV2DataProductsQuery,
  useV2CreateDataProductMutation,
  useV2QualityRulesQuery,
  useV2CreateQualityRuleMutation,
  useV2DeleteQualityRuleMutation,
  useV2SemanticMappingsQuery,
  useV2CreateSemanticMappingMutation,
  useV2DeleteSemanticMappingMutation,
  useV2ApisQuery,
  useV2CreateApiMutation,
  useV2DeleteApiMutation,
  useV2ApiRoutesQuery,
  useV2CreateApiRouteMutation,
  useV2DeleteApiRouteMutation
} from "@/hooks/useV2Queries";

// Wrap page in a Client Component Suspense boundary for useSearchParams compliance
export default function Page() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de l'Espace Données...</p>
      </div>
    }>
      <InteroperabilityDashboard />
    </React.Suspense>
  );
}

function InteroperabilityDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tab handling from URL search parameters (?tab=...)
  const activeTab = searchParams.get("tab") || "dashboard";
  
  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`/data?${params.toString()}`);
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: sourcesRes, refetch: refetchSources } = useV2SourceSystemsQuery();
  const { data: datasetsRes, refetch: refetchDatasets } = useV2DataProductsQuery();
  const { data: qualityRulesRes, refetch: refetchQuality } = useV2QualityRulesQuery();
  const { data: mappingsRes, refetch: refetchMappings } = useV2SemanticMappingsQuery();
  const { data: apisRes, refetch: refetchApis } = useV2ApisQuery();
  const { data: apiRoutesRes, refetch: refetchRoutes } = useV2ApiRoutesQuery();

  // Mutations
  const createSourceMutation = useV2CreateSourceSystemMutation();
  const createDatasetMutation = useV2CreateDataProductMutation();
  const createQualityRuleMutation = useV2CreateQualityRuleMutation();
  const deleteQualityRuleMutation = useV2DeleteQualityRuleMutation();
  const createMappingMutation = useV2CreateSemanticMappingMutation();
  const deleteMappingMutation = useV2DeleteSemanticMappingMutation();
  const createApiMutation = useV2CreateApiMutation();
  const deleteApiMutation = useV2DeleteApiMutation();
  const createRouteMutation = useV2CreateApiRouteMutation();
  const deleteRouteMutation = useV2DeleteApiRouteMutation();

  const sources = sourcesRes?.data || [];
  const datasets = datasetsRes?.data || [];
  const qualityRules = qualityRulesRes?.data || [];
  const mappings = mappingsRes?.data || [];
  const apis = apisRes?.data || [];
  const apiRoutes = apiRoutesRes?.data || [];

  // Selected Item details modal states
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  
  // Creation Modal states
  const [showCreateSource, setShowCreateSource] = useState(false);
  const [showCreateDataset, setShowCreateDataset] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [showCreateMapping, setShowCreateMapping] = useState(false);
  const [showCreateApi, setShowCreateApi] = useState(false);
  const [showCreateRoute, setShowCreateRoute] = useState(false);

  // Form states - Source System
  const [srcName, setSrcName] = useState("");
  const [srcDesc, setSrcDesc] = useState("");
  const [srcOwner, setSrcOwner] = useState("");
  const [srcSteward, setSrcSteward] = useState("");
  const [srcFrequency, setSrcFrequency] = useState("DAILY");
  const [srcAccessLevel, setSrcAccessLevel] = useState("RESTRICTED");
  const [srcFormat, setSrcFormat] = useState("JSON");
  const [srcEndpoint, setSrcEndpoint] = useState("");
  const [srcType, setSrcType] = useState("API REST");
  const [srcEnvironment, setSrcEnvironment] = useState("production");
  const [srcTech, setSrcTech] = useState("PostgreSQL");
  const [srcPersonal, setSrcPersonal] = useState("non");

  // Form states - Dataset
  const [dsTitle, setDsTitle] = useState("");
  const [dsDesc, setDsDesc] = useState("");
  const [dsDomain, setDsDomain] = useState("Économie & Entreprises");
  const [dsType, setDsType] = useState("dataset_harmonise");
  const [dsSensitivity, setDsSensitivity] = useState("public");
  const [dsProducer, setDsProducer] = useState("");
  const [dsOwner, setDsOwner] = useState("");
  const [dsSteward, setDsSteward] = useState("");
  const [dsExposableApi, setDsExposableApi] = useState(true);
  const [dsExposableCatalog, setDsExposableCatalog] = useState(true);
  const [dsDcatAp, setDsDcatAp] = useState(true);
  const [dsSemantic, setDsSemantic] = useState(true);
  const [dsAccessRules, setDsAccessRules] = useState("");
  const [dsUsageConditions, setDsUsageConditions] = useState("");
  const [dsLicense, setDsLicense] = useState("Open Data");
  const [dsFormat, setDsFormat] = useState("JSON-LD");
  const [dsSourceIds, setDsSourceIds] = useState<string[]>([]);

  // Form states - Quality Rule
  const [qrName, setQrName] = useState("");
  const [qrDesc, setQrDesc] = useState("");
  const [qrDimension, setQrDimension] = useState("completude");
  const [qrDatasetId, setQrDatasetId] = useState("");
  const [qrSourceId, setQrSourceId] = useState("");
  const [qrAttribute, setQrAttribute] = useState("");
  const [qrControlRule, setQrControlRule] = useState("");
  const [qrThreshold, setQrThreshold] = useState("100%");

  // Form states - Semantic Mapping
  const [mapName, setMapName] = useState("");
  const [mapDesc, setMapDesc] = useState("");
  const [mapSourceId, setMapSourceId] = useState("");
  const [mapDatasetId, setMapDatasetId] = useState("");
  const [mapTargetModel, setMapTargetModel] = useState("CPSV-AP");
  const [mapSourceEntity, setMapSourceEntity] = useState("");
  const [mapSourceAttr, setMapSourceAttr] = useState("");
  const [mapTargetEntity, setMapTargetEntity] = useState("");
  const [mapTargetAttr, setMapTargetAttr] = useState("");
  const [mapTransform, setMapTransform] = useState("");

  // Form states - API
  const [apiName, setApiName] = useState("");
  const [apiDesc, setApiDesc] = useState("");
  const [apiDomain, setApiDomain] = useState("Général");
  const [apiType, setApiType] = useState("REST");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://api.wallonie.be/v2");
  const [apiAuth, setApiAuth] = useState("API key");
  const [apiExposure, setApiExposure] = useState("interne");

  // Form states - API Route
  const [rtApiId, setRtApiId] = useState("");
  const [rtMethod, setRtMethod] = useState("GET");
  const [rtPath, setRtPath] = useState("");
  const [rtDesc, setRtDesc] = useState("");
  const [rtDatasetId, setRtDatasetId] = useState("");
  const [rtMappingId, setRtMappingId] = useState("");
  const [rtOutputModel, setRtOutputModel] = useState("JSON-LD");

  // Submitter Handlers
  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    createSourceMutation.mutate({
      name: srcName,
      description: srcDesc,
      owner: srcOwner,
      steward: srcSteward,
      frequency: srcFrequency,
      accessLevel: srcAccessLevel,
      format: srcFormat,
      endpoint: srcEndpoint,
      type: srcType,
      environment: srcEnvironment,
      technology: srcTech,
      isPersonalData: srcPersonal === "oui"
    }, {
      onSuccess: () => {
        alert("✅ Système source enregistré avec succès !");
        setShowCreateSource(false);
        setSrcName("");
        setSrcDesc("");
        setSrcOwner("");
        setSrcEndpoint("");
        refetchSources();
      }
    });
  };

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault();
    // Compute a mock readiness score based on flags
    let score = 0;
    if (dsExposableApi) score += 20;
    if (dsExposableCatalog) score += 20;
    if (dsDcatAp) score += 20;
    if (dsSemantic) score += 20;
    if (dsAccessRules && dsUsageConditions) score += 20;

    createDatasetMutation.mutate({
      title: dsTitle,
      description: dsDesc,
      domain: dsDomain,
      type: dsType,
      status: "valide",
      sensitivity: dsSensitivity,
      producer: dsProducer,
      dataOwner: dsOwner,
      dataSteward: dsSteward,
      exposableApi: dsExposableApi,
      exposableCatalog: dsExposableCatalog,
      dcatApAvailable: dsDcatAp,
      semanticMappingAvailable: dsSemantic,
      accessRulesDefined: !!dsAccessRules,
      usageRulesDefined: !!dsUsageConditions,
      accessRules: dsAccessRules,
      usageConditions: dsUsageConditions,
      license: dsLicense,
      format: dsFormat,
      dataSpaceMaturityScore: score,
      sourceIds: dsSourceIds
    }, {
      onSuccess: () => {
        alert("✅ Dataset enregistré avec succès !");
        setShowCreateDataset(false);
        setDsTitle("");
        setDsDesc("");
        setDsProducer("");
        setDsOwner("");
        setDsSourceIds([]);
        refetchDatasets();
      }
    });
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    createQualityRuleMutation.mutate({
      name: qrName,
      description: qrDesc,
      dimension: qrDimension,
      datasetId: qrDatasetId ? parseInt(qrDatasetId) : null,
      sourceId: qrSourceId ? parseInt(qrSourceId) : null,
      attribute: qrAttribute,
      controlRule: qrControlRule,
      threshold: qrThreshold,
      status: "non_controle"
    }, {
      onSuccess: () => {
        alert("✅ Règle de contrôle qualité enregistrée !");
        setShowCreateRule(false);
        setQrName("");
        setQrDesc("");
        setQrAttribute("");
        setQrControlRule("");
        refetchQuality();
      }
    });
  };

  const handleDeleteRule = (id: number) => {
    if (confirm("Supprimer cette règle de qualité ?")) {
      deleteQualityRuleMutation.mutate(id, {
        onSuccess: () => refetchQuality()
      });
    }
  };

  const handleCreateMapping = (e: React.FormEvent) => {
    e.preventDefault();
    createMappingMutation.mutate({
      name: mapName,
      description: mapDesc,
      sourceId: mapSourceId ? parseInt(mapSourceId) : null,
      datasetId: mapDatasetId ? parseInt(mapDatasetId) : null,
      targetModel: mapTargetModel,
      sourceEntity: mapSourceEntity,
      sourceAttribute: mapSourceAttr,
      targetEntity: mapTargetEntity,
      targetAttribute: mapTargetAttr,
      transformRule: mapTransform,
      status: "valide"
    }, {
      onSuccess: () => {
        alert("✅ Mapping sémantique enregistré !");
        setShowCreateMapping(false);
        setMapName("");
        setMapDesc("");
        setMapSourceEntity("");
        setMapTargetEntity("");
        refetchMappings();
      }
    });
  };

  const handleDeleteMapping = (id: number) => {
    if (confirm("Supprimer ce mapping sémantique ?")) {
      deleteMappingMutation.mutate(id, {
        onSuccess: () => refetchMappings()
      });
    }
  };

  const handleCreateApi = (e: React.FormEvent) => {
    e.preventDefault();
    createApiMutation.mutate({
      name: apiName,
      description: apiDesc,
      domain: apiDomain,
      type: apiType,
      baseUrl: apiBaseUrl,
      authType: apiAuth,
      exposureLevel: apiExposure,
      status: "publiee"
    }, {
      onSuccess: () => {
        alert("✅ API enregistrée avec succès !");
        setShowCreateApi(false);
        setApiName("");
        setApiDesc("");
        setApiBaseUrl("");
        refetchApis();
      }
    });
  };

  const handleDeleteApi = (id: number) => {
    if (confirm("Supprimer cette API ?")) {
      deleteApiMutation.mutate(id, {
        onSuccess: () => refetchApis()
      });
    }
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    createRouteMutation.mutate({
      apiId: parseInt(rtApiId),
      method: rtMethod,
      path: rtPath,
      description: rtDesc,
      datasetId: rtDatasetId ? parseInt(rtDatasetId) : null,
      mappingId: rtMappingId ? parseInt(rtMappingId) : null,
      outputModel: rtOutputModel,
      status: "active"
    }, {
      onSuccess: () => {
        alert("✅ Route API enregistrée !");
        setShowCreateRoute(false);
        setRtPath("");
        setRtDesc("");
        setRtMappingId("");
        refetchRoutes();
        refetchApis();
      }
    });
  };

  const handleDeleteRoute = (id: number) => {
    if (confirm("Supprimer cette route API ?")) {
      deleteRouteMutation.mutate(id, {
        onSuccess: () => {
          refetchRoutes();
          refetchApis();
        }
      });
    }
  };

  // Compute Stats for Dashboard
  const activeApis = apis.length;
  const avgMaturity = datasets.length > 0 
    ? Math.round(datasets.reduce((acc: number, d: any) => acc + (d.dataSpaceMaturityScore || 0), 0) / datasets.length)
    : 0;

  // Filtered lists
  const filteredSources = sources.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.owner || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDatasets = datasets.filter((d: any) => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.domain || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PITLayout
      category="GOUVERNANCE & INTEROPÉRABILITÉ DES DONNÉES"
      title="Workspace Interopérabilité & Alignement Sémantique"
      description="Supervisez les systèmes sources, cataloguez les data products, validez la qualité et configurez les APIs d'intégration sémantique du data space wallon."
      pageIcon={Database}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Espace Données" }]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          {[
            { id: "dashboard", label: "Vue d'ensemble", icon: BarChart2 },
            { id: "sources", label: "Sources de données", icon: Settings },
            { id: "datasets", label: "Datasets / Data products", icon: Database },
            { id: "quality", label: "Qualité des données", icon: CheckCircle2 },
            { id: "mappings", label: "Mappings sémantiques", icon: Network },
            { id: "apis", label: "APIs & routes", icon: Zap },
            { id: "governance", label: "Gouvernance d'accès", icon: Shield }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer border-0 ${
                  isSelected 
                    ? "bg-purple-600 text-white shadow-sm" 
                    : "text-muted hover:text-text hover:bg-glass/10"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="space-y-6">

        {/* 1. VIEW D'ENSEMBLE (DASHBOARD) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <PITStatCard label="Sources connectées" value={sources.length} description="systèmes SoR" icon={Settings} themeColor="purple" />
              <PITStatCard label="Datasets / Products" value={datasets.length} description="normalisés" icon={Database} themeColor="purple" />
              <PITStatCard label="Règles Qualité" value={qualityRules.length} description="de contrôle actives" icon={CheckCircle2} themeColor="emerald" />
              <PITStatCard label="APIs exposées" value={activeApis} description="endpoints actifs" icon={Zap} themeColor="purple" />
              <PITStatCard label="Maturité Data Space" value={`${avgMaturity}%`} description="de conformité moyenne" icon={Shield} themeColor="purple" />
            </div>

            {/* Main view container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Intro and Quality score */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-glass/30 border border-muted/15 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Interopérabilité & Data Spaces</h3>
                  <p className="text-xs text-text leading-relaxed font-semibold">
                    Bienvenue dans le cockpit de gestion de l&apos;interopérabilité des données territoriales. Cet espace permet aux Data Stewards de cartographier la provenance des données (Sources de données), de structurer les actifs sémantiques (Datasets / Data Products), d&apos;automatiser le contrôle qualité et d&apos;exposer des APIs standardisées conformes aux standards européens (CPSV-AP, DCAT-AP, W3C LOCN).
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button onClick={() => setShowCreateSource(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-sm border-0 cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /> Enregistrer Source System
                    </button>
                    <button onClick={() => setShowCreateDataset(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-sm border-0 cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /> Enregistrer Dataset
                    </button>
                  </div>
                </div>

                {/* Data Quality summary */}
                <div className="bg-glass/25 border border-muted/15 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-muted/10 pb-2.5">
                    <h3 className="text-xs font-black uppercase text-muted tracking-wider">État de la Qualité des Données</h3>
                    <button onClick={() => handleTabChange("quality")} className="text-[10px] font-black text-purple-605 uppercase hover:underline border-0 bg-transparent cursor-pointer">
                      Détails dimensions →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "Complétude", score: 94 },
                      { name: "Conformité CPSV/DCAT", score: 100 },
                      { name: "Fraîcheur", score: 85 }
                    ].map((d, i) => (
                      <div key={i} className="bg-glass/20 border border-muted/10 p-3 rounded-xl space-y-1.5 text-center">
                        <span className="text-[9px] font-bold uppercase text-muted block">{d.name}</span>
                        <span className="text-lg font-black text-purple-605">{d.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Activity & info */}
              <div className="space-y-6">
                <div className="bg-glass/30 border border-muted/15 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">Connecteurs de Data Spaces</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600">✔</span>
                      <div className="text-xs">
                        <p className="font-bold text-text">Export DCAT-AP activé</p>
                        <p className="text-muted text-[10px]">Catalogue synchronisé avec le portail Open Data de la Région wallonne.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-650">ℹ</span>
                      <div className="text-xs">
                        <p className="font-bold text-text">NGSI-LD en cours d&apos;alignement</p>
                        <p className="text-muted text-[10px]">Modélisation sémantique en temps réel des entités économiques.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-glass/30 border border-muted/15 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">Systèmes Sources d&apos;Autorité</h3>
                  <div className="space-y-3">
                    {sources.slice(0, 3).map((src: any) => (
                      <div key={src.id} className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-text">{src.name}</span>
                        <span className="text-[8px] bg-purple-500/10 text-purple-605 px-1.5 py-0.5 rounded font-black uppercase">{src.format}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SOURCES DE DONNÉES (SOURCE SYSTEMS) */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <PITFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Rechercher un système source..." />
              <button onClick={() => setShowCreateSource(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm border-0 cursor-pointer shrink-0">
                <Plus className="h-4 w-4" /> Enregistrer un système
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSources.map((sys: any) => (
                <div key={sys.id} className="bg-glass/30 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-wider text-purple-605 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        {sys.type || "Source de données"}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> CONNECTÉ
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-text leading-tight">{sys.name}</h3>
                    <p className="text-xs text-muted leading-tight font-semibold">Organisme : {sys.owner || "SPW"}</p>
                    {sys.endpoint && (
                      <p className="text-[9px] text-muted font-mono leading-tight truncate bg-glass p-1.5 rounded-lg border border-muted/10">Endpoint : {sys.endpoint}</p>
                    )}
                  </div>

                  <div className="border-t border-muted/10 pt-3 flex justify-between items-center text-[9px] font-bold text-muted">
                    <span>Fréquence : {sys.frequency || "Annuel"}</span>
                    <span>Format : {sys.format || "JSON"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. DATASETS / DATA PRODUCTS */}
        {activeTab === "datasets" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <PITFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Rechercher un dataset..." />
              <button onClick={() => setShowCreateDataset(true)} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm border-0 cursor-pointer shrink-0">
                <Plus className="h-4 w-4" /> Enregistrer un dataset
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDatasets.map((ds: any) => (
                <div key={ds.id} className="bg-glass/30 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-wider text-purple-605 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        {ds.domain || "Économie"}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        TRL / Taux Maturité : {ds.dataSpaceMaturityScore || 0}%
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-text leading-snug">{ds.title}</h3>
                      <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-1">{ds.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                      <div className="bg-glass/20 border border-muted/10 p-2.5 rounded-xl text-[10px]">
                        <span className="text-muted block uppercase text-[8px] font-bold">Règles d&apos;accès</span>
                        <p className="font-bold text-text truncate">{ds.accessRules || "Standard Open Data"}</p>
                      </div>
                      <div className="bg-glass/20 border border-muted/10 p-2.5 rounded-xl text-[10px]">
                        <span className="text-muted block uppercase text-[8px] font-bold">Format</span>
                        <p className="font-bold text-text font-mono">{ds.format || "JSON-LD"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-muted/10 pt-3 flex justify-between items-center text-[9px] font-bold text-muted">
                    <span>Producteur : {ds.producer || "SPW"}</span>
                    <span>Fréquence : {ds.updateFrequency || "Mensuelle"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. QUALITÉ DES DONNÉES (DATA QUALITY) */}
        {activeTab === "quality" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Cockpit Qualité & Mesure</h3>
                <p className="text-[11px] text-muted">Vérifiez les dimensions de qualité des données et définissez les règles de contrôle d&apos;autorité.</p>
              </div>
              <button onClick={() => setShowCreateRule(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all border-0 cursor-pointer shrink-0">
                <Plus className="h-4 w-4" /> Ajouter règle de contrôle
              </button>
            </div>

            {/* 9 Dimensions Quality Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Complétude", score: 94, desc: "Taux de présence des champs obligatoires (ex: n° BCE)." },
                { name: "Conformité", score: 100, desc: "Respect des standards CPSV-AP et DCAT-AP." },
                { name: "Fraîcheur", score: 85, desc: "Fréquence d&apos;actualisation par rapport aux sources d&apos;autorité." },
                { name: "Précision", score: 88, desc: "Exactitude des coordonnées et typologies." },
                { name: "Unicité", score: 97, desc: "Absence de doublons de bénéficiaires." },
                { name: "Cohérence", score: 91, desc: "Logique des liaisons et dépendances." },
                { name: "Traçabilité", score: 100, desc: "Métadonnées de provenance et d&apos;audit." },
                { name: "Clarté", score: 90, desc: "Documentation et clarté des libellés." },
                { name: "Disponibilité", score: 99, desc: "Taux d&apos;accès à l&apos;API de données." }
              ].map((dim, i) => (
                <div key={i} className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-purple-650 uppercase">{dim.name}</span>
                    <span className="text-[10px] font-black text-emerald-500">{dim.score}%</span>
                  </div>
                  <p className="text-[10px] text-muted leading-tight font-semibold">{dim.desc}</p>
                </div>
              ))}
            </div>

            {/* Rules list */}
            <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">Règles de Contrôle actives</h3>
              {qualityRules.length === 0 ? (
                <p className="text-xs text-muted italic text-center py-6">Aucune règle qualité enregistrée dans le graphe.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-muted/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-glass/10 border-b border-muted/10 font-bold uppercase text-[9px] text-muted">
                        <th className="p-3">Règle</th>
                        <th className="p-3">Dimension</th>
                        <th className="p-3">Attribut</th>
                        <th className="p-3">Seuil requis</th>
                        <th className="p-3">Dernier statut</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/10 font-semibold text-text">
                      {qualityRules.map((qr: any) => (
                        <tr key={qr.id} className="hover:bg-glass/5">
                          <td className="p-3 font-bold">{qr.name}</td>
                          <td className="p-3 uppercase text-[9px] text-purple-650">{qr.dimension}</td>
                          <td className="p-3 font-mono">{qr.attribute || "Global"}</td>
                          <td className="p-3 font-bold text-indigo-650">{qr.threshold || "100%"}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              CONFORME
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeleteRule(qr.id)} className="text-rose-500 hover:text-rose-700 bg-transparent border-0 cursor-pointer p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. MAPPINGS SÉMANTIQUES */}
        {activeTab === "mappings" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Alignements Sémantiques & Ontologies</h3>
                <p className="text-[11px] text-muted">Définissez les correspondances entre les tables source et les propriétés cibles des ontologies (CPSV-AP, DCAT-AP).</p>
              </div>
              <button onClick={() => setShowCreateMapping(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all border-0 cursor-pointer shrink-0">
                <Plus className="h-4 w-4" /> Ajouter un mapping
              </button>
            </div>

            <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
              {mappings.length === 0 ? (
                <p className="text-xs text-muted italic text-center py-6">Aucun mapping sémantique configuré dans la base.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-muted/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-glass/10 border-b border-muted/10 font-bold uppercase text-[9px] text-muted">
                        <th className="p-3">Nom</th>
                        <th className="p-3">Modèle Cible</th>
                        <th className="p-3">Source (Table / Attribut)</th>
                        <th className="p-3">Cible (Ontologie)</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/10 font-semibold text-text">
                      {mappings.map((m: any) => (
                        <tr key={m.id} className="hover:bg-glass/5">
                          <td className="p-3 font-bold">{m.name}</td>
                          <td className="p-3 text-indigo-650 font-bold">{m.targetModel}</td>
                          <td className="p-3 font-mono text-[11px]">{m.sourceEntity ? `${m.sourceEntity}.${m.sourceAttribute}` : "—"}</td>
                          <td className="p-3 font-mono text-[11px] text-purple-650">{m.targetEntity ? `${m.targetEntity}:${m.targetAttribute}` : "—"}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-black uppercase border border-emerald-500/20">
                              ALIGNÉ
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeleteMapping(m.id)} className="text-rose-500 hover:text-rose-700 bg-transparent border-0 cursor-pointer p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. APIS & ROUTES */}
        {activeTab === "apis" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">APIs & Expositions Sémantiques</h3>
                <p className="text-[11px] text-muted">Gérez les passerelles et points d&apos;accès sémantiques (REST, GraphQL, NGSI-LD) ouverts sur le réseau de données.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCreateApi(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all border-0 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Publier API
                </button>
                <button onClick={() => setShowCreateRoute(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all border-0 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Créer Route
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* APIs list (Left column) */}
              <div className="lg:col-span-1 space-y-4">
                <h4 className="text-xs font-black uppercase text-muted tracking-wider">Catalogues d&apos;APIs</h4>
                {apis.length === 0 ? (
                  <p className="text-xs text-muted italic p-4 bg-glass border border-muted/10 rounded-xl text-center">Aucune API configurée.</p>
                ) : (
                  <div className="space-y-3">
                    {apis.map((api: any) => (
                      <div 
                        key={api.id}
                        onClick={() => setSelectedApi(api)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedApi?.id === api.id 
                            ? "bg-purple-500/10 border-purple-500 text-purple-800 dark:text-purple-300" 
                            : "bg-glass border-muted/15 hover:border-muted/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black uppercase bg-purple-500/10 text-purple-600 px-1.5 py-0.2 rounded">{api.type}</span>
                          <span className="text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-600 px-1.5 py-0.2 rounded">{api.exposureLevel}</span>
                        </div>
                        <h4 className="font-extrabold text-xs mt-2">{api.name}</h4>
                        <p className="text-[10px] text-muted truncate mt-1">{api.baseUrl}</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-muted/5 text-[9px] text-muted">
                          <span>Version : {api.version}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteApi(api.id); }} className="text-rose-500 hover:text-rose-700 bg-transparent border-0 cursor-pointer">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* API Detail and Route view (Right columns) */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-black uppercase text-muted tracking-wider">Routes & Endpoints associés</h4>
                {!selectedApi ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-glass/20 border border-muted/15 border-dashed rounded-2xl text-center text-muted">
                    <Zap className="h-8 w-8 text-muted/30 mb-2" />
                    <p className="text-xs italic font-semibold">Sélectionnez une API à gauche pour en voir ses routes et habilitations d&apos;accès.</p>
                  </div>
                ) : (
                  <div className="bg-glass/30 border border-muted/20 p-5 rounded-2xl space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-black text-sm text-text">{selectedApi.name}</h3>
                        <span className="text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded border border-purple-500/25">
                          {selectedApi.status || "publiée"}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1 leading-snug">{selectedApi.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs bg-glass p-3 border border-muted/10 rounded-xl">
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase block">Type</span>
                          <span className="font-bold text-text">{selectedApi.type}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase block">Authentification</span>
                          <span className="font-bold text-text">{selectedApi.authType}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase block">Exposition</span>
                          <span className="font-bold text-text">{selectedApi.exposureLevel}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted uppercase block">Environnement</span>
                          <span className="font-bold text-text font-mono">{selectedApi.environment || "prod"}</span>
                        </div>
                      </div>

                      {(selectedApi.accessRules || selectedApi.usageRules) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[10px] bg-glass p-3 border border-muted/10 rounded-xl">
                          {selectedApi.accessRules && (
                            <div>
                              <span className="text-[9px] font-black text-muted uppercase block">Règles d&apos;accès</span>
                              <p className="text-text font-semibold">{selectedApi.accessRules}</p>
                            </div>
                          )}
                          {selectedApi.usageRules && (
                            <div>
                              <span className="text-[9px] font-black text-muted uppercase block">Règles d&apos;usage</span>
                              <p className="text-text font-semibold">{selectedApi.usageRules}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Liste des endpoints</span>
                      {(!selectedApi.routes || selectedApi.routes.length === 0) ? (
                        <p className="text-[11px] text-muted italic">Aucune route configurée pour cette API.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedApi.routes.map((rt: any) => (
                            <div key={rt.id} className="p-4 bg-glass/40 border border-muted/10 rounded-xl space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                    rt.method === "GET" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                                  }`}>
                                    {rt.method}
                                  </span>
                                  <span className="font-mono text-xs text-text font-bold">{rt.path}</span>
                                </div>
                                <button onClick={() => handleDeleteRoute(rt.id)} className="text-rose-500 hover:text-rose-700 bg-transparent border-0 cursor-pointer">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {rt.description && <p className="text-[10px] text-muted italic">{rt.description}</p>}

                              <div className="bg-glass/25 p-3 rounded-lg border border-muted/5 space-y-2 text-[10px]">
                                <p className="text-text leading-relaxed">
                                  💡 <span className="font-bold">Alignement Sémantique :</span> Cette API expose le dataset{" "}
                                  <span className="text-purple-650 font-extrabold">{rt.dataset?.title || "Aucun dataset"}</span>, via la route{" "}
                                  <span className="font-mono bg-muted/10 px-1 rounded">{rt.path}</span>, en utilisant le mapping{" "}
                                  <span className="text-indigo-650 font-extrabold">{rt.mapping?.name || "Aucun mapping sémantique"}</span>, dans le format de sortie{" "}
                                  <span className="text-emerald-650 font-extrabold">{rt.outputModel || "Non spécifié"}</span>.
                                </p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1.5 border-t border-muted/5 text-[9px] text-muted">
                                  <span><strong className="text-text font-semibold">Dataset :</strong> {rt.dataset?.title || "Non lié"}</span>
                                  <span><strong className="text-text font-semibold">Mapping :</strong> {rt.mapping?.name || "Non lié"}</span>
                                  <span><strong className="text-text font-semibold">Modèle de sortie :</strong> {rt.outputModel}</span>
                                  <span><strong className="text-text font-semibold">Habilitation :</strong> {rt.requiredRights || "Aucune"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. GOUVERNANCE D'ACCÈS */}
        {activeTab === "governance" && (
          <div className="bg-glass/30 border border-muted/20 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider border-b border-muted/10 pb-2">Politique de Gouvernance d&apos;Accès & RGPD</h3>
              <p className="text-xs text-muted mt-1 leading-snug">Visualisez la répartition de la sensibilité des données et l&apos;application des contraintes juridiques ou de souveraineté.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-glass/20 border border-muted/15 p-5 rounded-xl space-y-3">
                <span className="text-[10px] font-black text-purple-650 uppercase">Règles de Souveraineté</span>
                <p className="text-xs text-muted leading-relaxed font-semibold">Toutes les données hébergées sur le Territorial Knowledge Graph respectent le cadre du cloud souverain régional. Les données de résilience économique ou d&apos;infrastructures critiques ne sont jamais exposées hors du réseau interne sans convention préalable.</p>
              </div>

              <div className="bg-glass/20 border border-muted/15 p-5 rounded-xl space-y-3">
                <span className="text-[10px] font-black text-purple-650 uppercase">Classification de Sensibilité</span>
                <p className="text-xs text-muted leading-relaxed font-semibold">Les attributs de datasets sont taggués selon 6 niveaux (public, interne, restreint, confidentiel, données personnelles, données sensibles). Les routes d&apos;API cryptent automatiquement les attributs nominatifs.</p>
              </div>

              <div className="bg-glass/20 border border-muted/15 p-5 rounded-xl space-y-3">
                <span className="text-[10px] font-black text-purple-650 uppercase">Audit & Traçabilité</span>
                <p className="text-xs text-muted leading-relaxed font-semibold">Les logs de modifications des schémas, les versions d&apos;alignements sémantiques et les accès d&apos;API sont historisés dans le registre d&apos;audit technique de la plateforme à des fins de contrôle d&apos;autorité.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* CREATION MODALS                                          */}
      {/* ======================================================== */}

      {/* 1. Modal: Source System */}
      {showCreateSource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background border border-muted/20 w-full max-w-2xl rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Enregistrer un Système Source (SoR)</h3>
              <button onClick={() => setShowCreateSource(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateSource} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Nom du système *</label>
                  <input required type="text" value={srcName} onChange={e => setSrcName(e.target.value)} placeholder="ex: BCE Banque-Carrefour" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Organisme propriétaire *</label>
                  <input required type="text" value={srcOwner} onChange={e => setSrcOwner(e.target.value)} placeholder="ex: SPW Économie" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Description</label>
                <textarea rows={2} value={srcDesc} onChange={e => setSrcDesc(e.target.value)} placeholder="Détaillez le rôle de ce système de record..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Responsable technique (Steward)</label>
                  <input type="text" value={srcSteward} onChange={e => setSrcSteward(e.target.value)} placeholder="Nom ou email..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">URL / API Endpoint</label>
                  <input type="text" value={srcEndpoint} onChange={e => setSrcEndpoint(e.target.value)} placeholder="https://api..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Mode de transmission</label>
                  <select value={srcType} onChange={e => setSrcType(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="API REST">API REST</option>
                    <option value="Flux Kafka">Flux Kafka</option>
                    <option value="Fichier batch CSV">Fichier batch CSV</option>
                    <option value="Base de données SQL">Base de données SQL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Fréquence de synchro</label>
                  <select value={srcFrequency} onChange={e => setSrcFrequency(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="REAL_TIME">Temps réel</option>
                    <option value="DAILY">Quotidien</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="MONTHLY">Mensuel</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Données personnelles ?</label>
                  <select value={srcPersonal} onChange={e => setSrcPersonal(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="non">Non</option>
                    <option value="oui">Oui (RGPD requise)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateSource(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Dataset / Data Product */}
      {showCreateDataset && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background border border-muted/20 w-full max-w-3xl rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Enregistrer un Dataset / Data Product</h3>
              <button onClick={() => setShowCreateDataset(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateDataset} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Titre du Dataset *</label>
                  <input required type="text" value={dsTitle} onChange={e => setDsTitle(e.target.value)} placeholder="ex: Registre des aides régionales" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Producteur / Émetteur *</label>
                  <input required type="text" value={dsProducer} onChange={e => setDsProducer(e.target.value)} placeholder="ex: Wallonie Entreprendre" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Description *</label>
                <textarea required rows={2} value={dsDesc} onChange={e => setDsDesc(e.target.value)} placeholder="Expliquez la structure et l'utilité du dataset normalisé..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Domaine métier</label>
                  <input type="text" value={dsDomain} onChange={e => setDsDomain(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Type d&apos;actif</label>
                  <select value={dsType} onChange={e => setDsType(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="source_brute">Source brute</option>
                    <option value="dataset_harmonise">Dataset harmonisé</option>
                    <option value="data_product">Data Product</option>
                    <option value="referentiel">Référentiel</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Sensibilité juridique</label>
                  <select value={dsSensitivity} onChange={e => setDsSensitivity(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="public">Public (Open Data)</option>
                    <option value="interne">Interne</option>
                    <option value="restreint">Restreint</option>
                    <option value="confidentiel">Confidentiel</option>
                  </select>
                </div>
              </div>

              {/* Data space readiness switches */}
              <div className="bg-glass p-4 border border-muted/15 rounded-xl space-y-3">
                <span className="text-[9px] font-black uppercase text-purple-650 tracking-wider block">Maturité Data Space & Intégration</span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" checked={dsExposableApi} onChange={e => setDsExposableApi(e.target.checked)} />
                    <span>Exposable via API REST</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" checked={dsExposableCatalog} onChange={e => setDsExposableCatalog(e.target.checked)} />
                    <span>Publié au catalogue open-data</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" checked={dsDcatAp} onChange={e => setDsDcatAp(e.target.checked)} />
                    <span>Conforme à DCAT-AP v3</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input type="checkbox" checked={dsSemantic} onChange={e => setDsSemantic(e.target.checked)} />
                    <span>Mapping sémantique disponible</span>
                  </label>
                </div>
              </div>

              {/* Governance rules block */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Règles d&apos;accès / Sécurité</label>
                  <input type="text" value={dsAccessRules} onChange={e => setDsAccessRules(e.target.value)} placeholder="ex: Habilitation admin requise" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Conditions d&apos;usage / RGPD</label>
                  <input type="text" value={dsUsageConditions} onChange={e => setDsUsageConditions(e.target.value)} placeholder="ex: Usage commercial interdit" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateDataset(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Créer Dataset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Quality Rule */}
      {showCreateRule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-muted/20 w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Ajouter une règle de contrôle qualité</h3>
              <button onClick={() => setShowCreateRule(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Nom de la règle *</label>
                <input required type="text" value={qrName} onChange={e => setQrName(e.target.value)} placeholder="ex: Non-vacuité du code postal" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Dimension de qualité *</label>
                  <select value={qrDimension} onChange={e => setQrDimension(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="completude">Complétude</option>
                    <option value="precision">Précision</option>
                    <option value="conformite">Conformité</option>
                    <option value="unicite">Unicité</option>
                    <option value="coherence">Cohérence</option>
                    <option value="fraicheur">Fraîcheur</option>
                    <option value="tracabilite">Traçabilité</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Attribut physique contrôlé</label>
                  <input type="text" value={qrAttribute} onChange={e => setQrAttribute(e.target.value)} placeholder="ex: address.zipcode" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Règle de contrôle (Code / Règle logique)</label>
                <textarea rows={2} value={qrControlRule} onChange={e => setQrControlRule(e.target.value)} placeholder="ex: VALUE IS NOT NULL AND LENGTH(VALUE) == 4" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Seuil de conformité requis</label>
                  <input type="text" value={qrThreshold} onChange={e => setQrThreshold(e.target.value)} placeholder="ex: 95% ou 100%" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Associer au Dataset</label>
                  <select value={qrDatasetId} onChange={e => setQrDatasetId(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="">Aucun</option>
                    {datasets.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateRule(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Semantic Mapping */}
      {showCreateMapping && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-muted/20 w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Créer un Mapping Sémantique</h3>
              <button onClick={() => setShowCreateMapping(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateMapping} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Nom du mapping *</label>
                <input required type="text" value={mapName} onChange={e => setMapName(e.target.value)} placeholder="ex: BCE to CPSV LegalEntity" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Modèle / Standard Cible *</label>
                  <input required type="text" value={mapTargetModel} onChange={e => setMapTargetModel(e.target.value)} placeholder="ex: CPSV-AP, DCAT-AP" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Source System associé</label>
                  <select value={mapSourceId} onChange={e => setMapSourceId(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="">Aucun</option>
                    {sources.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-glass/20 p-3 rounded-xl border border-muted/10">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-muted block">Source Physique</span>
                  <input type="text" value={mapSourceEntity} onChange={e => setMapSourceEntity(e.target.value)} placeholder="Table: ex: bce_company" className="w-full bg-glass border border-muted/25 rounded-lg px-2.5 py-1.5 text-text outline-none" />
                  <input type="text" value={mapSourceAttr} onChange={e => setMapSourceAttr(e.target.value)} placeholder="Attribut: ex: legal_name" className="w-full bg-glass border border-muted/25 rounded-lg px-2.5 py-1.5 text-text outline-none" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-muted block">Cible Graphe</span>
                  <input type="text" value={mapTargetEntity} onChange={e => setMapTargetEntity(e.target.value)} placeholder="Classe: ex: cpsv:PublicOrganization" className="w-full bg-glass border border-muted/25 rounded-lg px-2.5 py-1.5 text-text outline-none" />
                  <input type="text" value={mapTargetAttr} onChange={e => setMapTargetAttr(e.target.value)} placeholder="Propriété: ex: dct:title" className="w-full bg-glass border border-muted/25 rounded-lg px-2.5 py-1.5 text-text outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Règle de transformation (Code / Formule)</label>
                <input type="text" value={mapTransform} onChange={e => setMapTransform(e.target.value)} placeholder="ex: VALUE.toUpperCase() ou TRIM(VALUE)" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateMapping(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Créer Mapping</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: API */}
      {showCreateApi && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-muted/20 w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Publier un Point d&apos;accès API</h3>
              <button onClick={() => setShowCreateApi(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateApi} className="space-y-4 text-xs">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Nom de l&apos;API *</label>
                <input required type="text" value={apiName} onChange={e => setApiName(e.target.value)} placeholder="ex: API Publique des Écosystèmes" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">URL de base (Base URL) *</label>
                <input required type="text" value={apiBaseUrl} onChange={e => setApiBaseUrl(e.target.value)} placeholder="https://api.wallonie.be/..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Type de passerelle</label>
                  <select value={apiType} onChange={e => setApiType(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="REST">REST (JSON)</option>
                    <option value="NGSI_LD">NGSI-LD (Graphe)</option>
                    <option value="GraphQL">GraphQL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Type d&apos;authentification</label>
                  <select value={apiAuth} onChange={e => setApiAuth(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="aucune">Aucune</option>
                    <option value="API key">API Key</option>
                    <option value="OAuth2">OAuth2 / JWT</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Exposition</label>
                  <select value={apiExposure} onChange={e => setApiExposure(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="interne">Interne</option>
                    <option value="partenaires">Partenaires</option>
                    <option value="public">Publique</option>
                    <option value="data_space">Data Space</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateApi(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Enregistrer API</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: API Route */}
      {showCreateRoute && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-muted/20 w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="font-extrabold text-sm text-text">Créer une Route d&apos;API</h3>
              <button onClick={() => setShowCreateRoute(false)} className="text-muted hover:text-text bg-transparent border-0 cursor-pointer font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateRoute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">API Cible *</label>
                  <select required value={rtApiId} onChange={e => setRtApiId(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="">Sélectionner</option>
                    {apis.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Méthode HTTP *</label>
                  <select value={rtMethod} onChange={e => setRtMethod(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Chemin d&apos;accès (Path) *</label>
                <input required type="text" value={rtPath} onChange={e => setRtPath(e.target.value)} placeholder="ex: /beneficiaries/{id}" className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Description</label>
                <textarea rows={2} value={rtDesc} onChange={e => setRtDesc(e.target.value)} placeholder="Description de l'action de cette route..." className="w-full bg-glass border border-muted/25 rounded-lg px-3 py-2 text-text outline-none" />
              </div>
               <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Dataset renvoyé (Source sémantique)</label>
                  <select value={rtDatasetId} onChange={e => setRtDatasetId(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="">Aucun</option>
                    {datasets.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Mapping sémantique utilisé</label>
                  <select value={rtMappingId} onChange={e => setRtMappingId(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="">Aucun</option>
                    {mappings.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted block mb-1">Format de sortie (Payload)</label>
                  <select value={rtOutputModel} onChange={e => setRtOutputModel(e.target.value)} className="w-full bg-glass border border-muted/25 rounded-lg p-2 text-text outline-none">
                    <option value="JSON-LD">JSON-LD (Sémantique)</option>
                    <option value="JSON">JSON brut</option>
                    <option value="NGSI-LD">NGSI-LD</option>
                    <option value="RDF">RDF / XML</option>
                    <option value="DCAT-AP">DCAT-AP</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-muted/10">
                <button type="button" onClick={() => setShowCreateRoute(false)} className="px-4 py-2 bg-glass border border-muted/25 rounded-xl text-text font-bold cursor-pointer">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-750 text-white rounded-xl font-bold cursor-pointer border-0">Ajouter Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PITLayout>
  );
}
