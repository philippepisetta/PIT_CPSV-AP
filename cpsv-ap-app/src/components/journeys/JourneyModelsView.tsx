// src/components/journeys/JourneyModelsView.tsx
"use client";

import React, { useState, useMemo } from "react";
import { 
  Compass, 
  Building2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Database, 
  Users, 
  Network, 
  Share2, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import PITStatCard from "@/design-system/PITStatCard";

interface PublicService {
  id: number;
  name: string;
  code: string;
  description?: string;
  organization: { id: number; name: string };
  capabilities?: { id: number; code: string; name: string }[];
  knowledgeAssets?: { id: number; title: string; type: string }[];
}

interface JourneyStage {
  id: number;
  name: string;
  position: number;
  services: PublicService[];
}

interface StrategicValueChain {
  id: number;
  name: string;
}

interface BusinessChallenge {
  id: number;
  name: string;
}

interface Ecosystem {
  id: number;
  name: string;
}

interface TransformationDimension {
  code: string;
  name: string;
}

interface StrategicDomainDimension {
  id: number;
  name: string;
}

interface ValueChainStage {
  id: number;
  name: string;
  category: string;
}

interface Journey {
  id: number;
  uri?: string;
  name: string;
  provider: string;
  objective: string;
  description?: string;
  targetAudience: string[];
  stages: JourneyStage[];
  filieresS3?: StrategicValueChain[];
  challenges?: BusinessChallenge[];
  ecosystems?: Ecosystem[];
  transformationDimensions?: TransformationDimension[];
  strategicDomains?: StrategicDomainDimension[];
  stagesTransverses?: ValueChainStage[];
  actionInstances?: { id: number; title: string }[];
}

interface JourneyModelsViewProps {
  journeys: Journey[];
  selectedJourney: Journey | null;
  setSelectedJourney: (j: Journey | null) => void;
  onEdit: (j: Journey) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  filieresList: StrategicValueChain[];
  challengesList: BusinessChallenge[];
  ecosystemsList: Ecosystem[];
  transformationsList: TransformationDimension[];
  domainsList: StrategicDomainDimension[];
  enrollmentsCount: Record<number, number>; // Maps journey ID to number of active enrolled PMEs
}

export default function JourneyModelsView({
  journeys,
  selectedJourney,
  setSelectedJourney,
  onEdit,
  onDelete,
  onCreate,
  filieresList,
  challengesList,
  ecosystemsList,
  transformationsList,
  domainsList,
  enrollmentsCount,
}: JourneyModelsViewProps) {
  // Local Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filiereFilter, setFiliereFilter] = useState<string>("All");
  const [challengeFilter, setChallengeFilter] = useState<string>("All");
  const [ecosystemFilter, setEcosystemFilter] = useState<string>("All");
  const [transformationFilter, setTransformationFilter] = useState<string>("All");
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [showDrawer, setShowDrawer] = useState(false);

  // Filtered Journeys
  const filteredJourneys = useMemo(() => {
    return journeys.filter(j => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        j.name.toLowerCase().includes(q) || 
        j.provider.toLowerCase().includes(q) || 
        (j.objective && j.objective.toLowerCase().includes(q));

      const matchFiliere = filiereFilter === "All" || 
        (j.filieresS3 || []).some(f => String(f.id) === filiereFilter);

      const matchChallenge = challengeFilter === "All" || 
        (j.challenges || []).some(c => String(c.id) === challengeFilter);

      const matchEcosystem = ecosystemFilter === "All" || 
        (j.ecosystems || []).some(e => String(e.id) === ecosystemFilter);

      const matchTransformation = transformationFilter === "All" || 
        (j.transformationDimensions || []).some(t => t.code === transformationFilter);

      const matchDomain = domainFilter === "All" || 
        (j.strategicDomains || []).some(d => String(d.id) === domainFilter);

      return matchSearch && matchFiliere && matchChallenge && matchEcosystem && matchTransformation && matchDomain;
    });
  }, [journeys, searchQuery, filiereFilter, challengeFilter, ecosystemFilter, transformationFilter, domainFilter]);

  // Aggregate Stats
  const totalModels = journeys.length;
  
  const totalServicesLinked = useMemo(() => {
    const ids = new Set<number>();
    journeys.forEach(j => {
      (j.stages || []).forEach(st => {
        (st.services || []).forEach(s => ids.add(s.id));
      });
    });
    return ids.size;
  }, [journeys]);

  const totalEcosystemsLinked = useMemo(() => {
    const ids = new Set<number>();
    journeys.forEach(j => {
      (j.ecosystems || []).forEach(e => ids.add(e.id));
    });
    return ids.size;
  }, [journeys]);

  const totalS3Alignments = useMemo(() => {
    const ids = new Set<number>();
    journeys.forEach(j => {
      (j.filieresS3 || []).forEach(f => ids.add(f.id));
    });
    return ids.size;
  }, [journeys]);

  const handleCardClick = (j: Journey) => {
    setSelectedJourney(j);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Stat Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <PITStatCard
          label="Modèles de Parcours"
          value={totalModels}
          icon={Compass}
          themeColor="purple"
          description="Gabarits territoriaux de référence"
        />
        <PITStatCard
          label="Services CPSV-AP Mappés"
          value={totalServicesLinked}
          icon={Database}
          themeColor="teal"
          description="Services régionaux connectés"
        />
        <PITStatCard
          label="Écosystèmes Actifs"
          value={totalEcosystemsLinked}
          icon={Share2}
          themeColor="blue"
          description="Clusters et pôles impliqués"
        />
        <PITStatCard
          label="Alignements S3"
          value={totalS3Alignments}
          icon={Network}
          themeColor="emerald"
          description="Filières intelligentes couvertes"
        />
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Filtres Multicritères (Alignements Sémantiques & Stratégiques)
            </h4>
            <p className="text-[11px] text-muted leading-tight">Ajustez vos filtres pour isoler les parcours liés aux priorités régionales.</p>
          </div>
          <button
            onClick={onCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border-0 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel Encodage de Parcours
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-1 space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Recherche libre</label>
            <input
              type="text"
              placeholder="Nom, fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Filière Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Filière S3</label>
            <select
              value={filiereFilter}
              onChange={(e) => setFiliereFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">Toutes les filières</option>
              {filieresList.map(f => (
                <option key={f.id} value={String(f.id)}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Défi Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{"Défi d'Affaires"}</label>
            <select
              value={challengeFilter}
              onChange={(e) => setChallengeFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">Tous les défis</option>
              {challengesList.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Écosystème Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Écosystème</label>
            <select
              value={ecosystemFilter}
              onChange={(e) => setEcosystemFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">Tous les écosystèmes</option>
              {ecosystemsList.map(e => (
                <option key={e.id} value={String(e.id)}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* DR-BEST Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">DR-BEST Transformation</label>
            <select
              value={transformationFilter}
              onChange={(e) => setTransformationFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">Toutes les dimensions</option>
              {transformationsList.map(t => (
                <option key={t.code} value={t.code}>{t.code} - {t.name}</option>
              ))}
            </select>
          </div>

          {/* Domaine Select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Domaine Stratégique S3</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-255 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-purple-500"
            >
              <option value="All">Tous les domaines</option>
              {domainsList.map(d => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJourneys.length > 0 ? (
          filteredJourneys.map((j) => {
            const totalSvcCount = (j.stages || []).reduce((sum, list) => sum + (list.services || []).length, 0);
            const activeEnrollmentsCount = enrollmentsCount[j.id] || 0;

            return (
              <div
                key={j.id}
                onClick={() => handleCardClick(j)}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl border shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition duration-200 space-y-4 cursor-pointer text-left",
                  selectedJourney?.id === j.id
                    ? "border-purple-500 dark:border-purple-400 ring-1 ring-purple-500/30"
                    : "border-gray-150 dark:border-gray-805/80"
                )}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                      {j.name}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEdit(j)}
                        title="Modifier ce parcours"
                        className="p-1 hover:bg-gray-105 dark:hover:bg-gray-700 text-gray-400 hover:text-purple-500 rounded transition cursor-pointer border-0 bg-transparent"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(j.id)}
                        title="Supprimer ce parcours"
                        className="p-1 hover:bg-gray-105 dark:hover:bg-gray-700 text-gray-400 hover:text-rose-500 rounded transition cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted">
                    Chef de file : <strong className="text-text">{j.provider}</strong>
                  </p>

                  {j.objective && (
                    <p className="text-[10px] text-muted/90 leading-relaxed bg-gray-50/55 dark:bg-gray-900/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 italic">
                      {"\""}{j.objective}{"\""}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1.5 select-none">
                    {(j.filieresS3 || []).map(f => (
                      <span key={f.id} className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400">
                        {f.name}
                      </span>
                    ))}
                    {(j.stagesTransverses || []).map(st => (
                      <span key={st.id} className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-indigo-500/10 text-indigo-650 border border-indigo-500/20 dark:text-indigo-400">
                        {st.name}
                      </span>
                    ))}
                    {(j.challenges || []).map(c => (
                      <span key={c.id} className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-purple-500/10 text-purple-600 border border-purple-500/20 dark:text-purple-400">
                        {c.name}
                      </span>
                    ))}
                    {activeEnrollmentsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        {activeEnrollmentsCount} PME actives
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700/60 pt-3 space-y-2">
                  <span className="text-[8px] font-extrabold text-gray-450 uppercase tracking-wider block select-none">
                    Mappage des Étapes ({totalSvcCount} services CPSV-AP)
                  </span>

                  <div className="grid grid-cols-2 gap-1.5 text-[9px] select-none">
                    {([
                      { id: "Amorçage", label: "1. Amorçage" },
                      { id: "Diagnostic", label: "2. Diagnostic" },
                      { id: "Coaching", label: "3. Coaching" },
                      { id: "Planification", label: "4. Planification" },
                      { id: "Mise en œuvre", label: "5. Mise en œuvre" },
                      { id: "Investissement", label: "6. Investissement" }
                    ]).map((phase) => {
                      const dbStage = (j.stages || []).find(st => st.name === phase.id);
                      const count = dbStage?.services?.length || 0;
                      return (
                        <div
                          key={phase.id}
                          className={cn(
                            "flex items-center justify-between p-1 rounded border",
                            count > 0
                              ? "bg-purple-500/5 border-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold"
                              : "bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-300 dark:text-gray-700"
                          )}
                        >
                          <span className="truncate pr-1">{phase.label}</span>
                          <span className={cn("px-1 py-0.2 rounded text-[7px]", count > 0 ? "bg-purple-500/10 text-purple-600 font-bold border border-purple-500/20 dark:text-purple-400" : "bg-gray-100 dark:bg-gray-800")}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-12 py-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Aucun modèle de parcours trouvé</h4>
            <p className="text-[10px] text-gray-450 mt-1">Ajustez vos filtres taxonomiques ou créez un parcours personnalisé.</p>
          </div>
        )}
      </div>

      {/* 4. Slide-out Drawer Details Panel */}
      {showDrawer && selectedJourney && (
        <>
          {/* Overlay Backdrop */}
          <div 
            onClick={() => setShowDrawer(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/45 backdrop-blur-xs z-40 transition-opacity animate-fadeIn"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-150 dark:border-gray-800 z-50 overflow-y-auto animate-slideIn">
            <div className="p-6 space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                      Modèle de Parcours
                    </span>
                    <span className="text-[10px] text-muted">{selectedJourney.provider}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                    {selectedJourney.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-text cursor-pointer transition border-0 bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons inside drawer */}
              <div className="flex justify-end gap-2 border-b border-gray-50 dark:border-gray-750 pb-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    onEdit(selectedJourney);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition border-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm("❌ Supprimer ce parcours ?")) {
                      setShowDrawer(false);
                      onDelete(selectedJourney.id);
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition border-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="space-y-6 text-xs text-text">
                {/* 1. Objective Block */}
                {selectedJourney.objective && (
                  <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-650 dark:text-purple-400 block select-none">
                      Objectif Stratégique
                    </span>
                    <p className="italic text-gray-700 dark:text-gray-300 font-medium">{"\""}{selectedJourney.objective}{"\""}</p>
                  </div>
                )}

                {/* 2. Description */}
                {selectedJourney.description && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block select-none">Description</span>
                    <p className="text-muted leading-relaxed font-normal bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                      {selectedJourney.description}
                    </p>
                  </div>
                )}

                {/* 3. Target Audience */}
                {selectedJourney.targetAudience && selectedJourney.targetAudience.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block select-none">Public Cible</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJourney.targetAudience.map(aud => (
                        <span key={aud} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-[10px] font-semibold">
                          {aud}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Strategic Alignments Summary */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block select-none">
                    Alignements Taxonomiques
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <span className="text-[8px] font-bold text-gray-400 block uppercase select-none">Filières S3</span>
                      <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                        {selectedJourney.filieresS3?.map(f => f.name).join(", ") || "Non spécifié"}
                      </div>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                      <span className="text-[8px] font-bold text-gray-400 block uppercase select-none">Maillon Transverse</span>
                      <div className="font-bold text-indigo-650 dark:text-indigo-400 mt-0.5 truncate">
                        {selectedJourney.stagesTransverses?.map(st => st.name).join(", ") || "Non spécifié"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Detailed Steps & Services timeline */}
                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block select-none">
                    Timeline des Services CPSV-AP Recommandés
                  </span>

                  <div className="relative border-l-2 border-purple-500/20 pl-4 ml-2 space-y-4">
                    {([
                      { id: "Amorçage", label: "1. Amorçage" },
                      { id: "Diagnostic", label: "2. Diagnostic" },
                      { id: "Coaching", label: "3. Coaching" },
                      { id: "Planification", label: "4. Planification" },
                      { id: "Mise en œuvre", label: "5. Mise en œuvre" },
                      { id: "Investissement", label: "6. Investissement" }
                    ]).map((phase) => {
                      const dbStage = (selectedJourney.stages || []).find(st => st.name === phase.id);
                      const servicesInStage = dbStage?.services || [];

                      return (
                        <div key={phase.id} className="relative">
                          {/* Dot marker */}
                          <div className={cn(
                            "absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 bg-white dark:bg-gray-800",
                            servicesInStage.length > 0 ? "border-purple-500" : "border-gray-300 dark:border-gray-700"
                          )} />

                          <div className="space-y-1.5">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider block",
                              servicesInStage.length > 0 ? "text-purple-650 dark:text-purple-400" : "text-gray-400"
                            )}>
                              {phase.label}
                            </span>

                            {servicesInStage.length > 0 ? (
                              <div className="space-y-2">
                                {servicesInStage.map(service => (
                                  <div key={service.id} className="bg-gray-50/70 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:border-purple-500/20 transition-all">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="font-mono text-[8px] bg-gray-200 dark:bg-gray-700 px-1 py-0.2 rounded text-muted font-bold uppercase shrink-0">
                                        {service.code}
                                      </span>
                                      <span className="text-[9px] text-muted flex items-center gap-1 font-bold truncate">
                                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                                        {service.organization?.name}
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-gray-900 dark:text-gray-100 text-[10px] mt-1.5 leading-tight">
                                      {service.name}
                                    </h5>
                                    <div className="flex justify-end pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                                      <a
                                        href={`/services?id=${service.id}`}
                                        className="text-[9px] font-bold text-teal-650 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                                      >
                                        Fiche service
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] italic text-gray-400 block pl-1">Aucun service recommandé</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
