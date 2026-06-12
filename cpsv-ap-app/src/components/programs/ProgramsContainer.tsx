// src/components/programs/ProgramsContainer.tsx
"use client";

import React, { useState } from "react";
import { 
  Target, 
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
  Eye, 
  ArrowRight,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles
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
  useV2Programs, 
  useV2ProgramDetail, 
  useV2ProgramProjects, 
  useV2ProjectActions, 
  useV2ActionActivities, 
  useV2S3Domains, 
  useV2GraphQuery,
  useV2Contributions
} from "@/hooks/useV2Queries";
import PITImpactPanel from "@/design-system/PITImpactPanel";

// Sub-component to fetch project count for a program in the table
function ProjectCount({ programId }: { programId: number }) {
  const { data } = useV2ProgramProjects(programId, 1, 1);
  return <span>{data?.meta?.total ?? 0}</span>;
}

export default function ProgramsContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedS3Domain, setSelectedS3Domain] = useState("");
  const [selectedDrBest, setSelectedDrBest] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);

  // Fetch programs list
  const { data: programsData, isLoading: isProgramsLoading } = useV2Programs({
    page,
    pageSize,
    q: searchQuery,
    s3Domain: selectedS3Domain,
    drbest: selectedDrBest
  });

  // Fetch S3 Domains for filters
  const { data: s3DomainsData } = useV2S3Domains();

  // Selected Program Detail
  const { data: programDetailData, isLoading: isDetailLoading } = useV2ProgramDetail(selectedProgramId);

  // Handle row click
  const handleSelectProgram = (id: number) => {
    setSelectedProgramId(id);
  };

  const programs = programsData?.data || [];
  const meta = programsData?.meta || { total: 0, totalPages: 1 };

  // Format budget in Euro
  const formatBudget = (value?: number | null) => {
    if (value === undefined || value === null) return "Non spécifié";
    return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  };

  // Build S3 domain filter options
  const s3Options = (s3DomainsData?.data || []).map((d: any) => ({
    value: d.id.toString(),
    label: d.name
  }));

  const drbestOptions = [
    { value: "DATA", label: "Data (D)" },
    { value: "REMOTE", label: "Remote (R)" },
    { value: "BUSINESS", label: "Business (B)" },
    { value: "ECOSYSTEM", label: "Ecosystem (E)" },
    { value: "SKILLS", label: "Skills (S)" },
    { value: "TECHNOLOGY", label: "Technology (T)" }
  ];

  return (
    <PITLayout
      category="COCKPIT PROGRAMMES"
      title="Programmes d'Innovation Régionaux"
      description="Naviguez à travers les dispositifs de financement et d'accompagnement de la Wallonie (EDIH, Fiche 138, Circular Wallonia) structurés selon le modèle hiérarchique."
      pageIcon={Target}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Programmes" }]}
    >
      {/* 1. Filter Bar */}
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
        searchPlaceholder="Rechercher un programme (nom, code)..."
        selectFilters={[
          {
            id: "s3-filter",
            label: "Filtrer par Axe S3",
            value: selectedS3Domain,
            options: s3Options,
            onChange: (val) => { setSelectedS3Domain(val); setPage(1); }
          },
          {
            id: "drbest-filter",
            label: "Filtrer par DR-BEST",
            value: selectedDrBest,
            options: drbestOptions,
            onChange: (val) => { setSelectedDrBest(val); setPage(1); }
          }
        ]}
      />

      {/* 2. Main Work Grid (Split Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* Left Side: Table */}
        <div className={selectedProgramId ? "xl:col-span-6 space-y-4" : "xl:col-span-12 space-y-4"}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
                    <th className="px-5 py-4">Code / Programme</th>
                    <th className="px-5 py-4">Opérateur / Owner</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4 text-center">Projets</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                    <th className="px-5 py-4 text-center">Activités</th>
                    <th className="px-5 py-4">Mis à jour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isProgramsLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div></td>
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div></td>
                        <td className="px-5 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                        <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                        <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                        <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                        <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                      </tr>
                    ))
                  ) : programs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-muted italic">
                        Aucun programme ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : (
                    programs.map((prog: any) => (
                      <tr
                        key={prog.id}
                        onClick={() => handleSelectProgram(prog.id)}
                        className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-100 dark:border-gray-850 transition-colors ${
                          selectedProgramId === prog.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                        }`}
                      >
                        <td className="px-5 py-4 font-bold text-text">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                              {prog.code || `PRG-${prog.id}`}
                            </span>
                            <span className="truncate max-w-[200px]" title={prog.name}>{prog.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted/95 font-semibold">
                          {prog.ownerOrganization?.name || "SPW EER"}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={`font-bold text-[9px] uppercase px-2 py-0.5 rounded-full ${
                            prog.status === "ACTIVE" 
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600" 
                              : prog.status === "COMPLETED"
                              ? "bg-purple-500/10 border-purple-500/25 text-purple-600"
                              : "bg-amber-500/10 border-amber-500/25 text-amber-600"
                          }`}>
                            {prog.status === "ACTIVE" ? "Actif" : prog.status === "COMPLETED" ? "Terminé" : "Planifié"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-teal-600 dark:text-teal-400">
                          <ProjectCount programId={prog.id} />
                        </td>
                        <td className="px-5 py-4 text-center text-muted">-</td>
                        <td className="px-5 py-4 text-center text-muted">-</td>
                        <td className="px-5 py-4 text-muted font-mono text-[10px]">
                          -
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="px-5 py-4 bg-gray-50/75 dark:bg-gray-900/50 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center text-xs">
                <span className="text-muted">
                  Page <strong className="text-text">{page}</strong> sur <strong className="text-text">{meta.totalPages}</strong> ({meta.total} programmes)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="h-8 text-[11px]"
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    className="h-8 text-[11px]"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        {selectedProgramId && (
          <div className="xl:col-span-6 w-full space-y-4">
            {isDetailLoading || !programDetailData ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                <p className="text-muted text-xs font-semibold mt-3">Chargement des détails du programme...</p>
              </div>
            ) : (
              <ProgramDetailPanel program={programDetailData.data} onClose={() => setSelectedProgramId(null)} />
            )}
          </div>
        )}
      </div>
    </PITLayout>
  );
}

// Program Detail Pane using PITDetailLayout
interface ProgramDetailPanelProps {
  program: any;
  onClose: () => void;
}

function ProgramDetailPanel({ program, onClose }: ProgramDetailPanelProps) {
  const [activeProjId, setActiveProjId] = useState<number | null>(null);
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  // Queries for relations
  const { data: graphData } = useV2GraphQuery("programs", program.id);
  const { data: contributionsData } = useV2Contributions("programs", program.id);

  const contributionsContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Mesure d'Impact stratégique & Contributions
      </h4>
      <PITImpactPanel data={contributionsData} />
    </div>
  );

  // Overview Tab Layout
  const overviewContent = (
    <div className="space-y-6">
      {/* 3 cards of KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Budget alloué"
          value={program.budget ? `${(program.budget / 1000000).toFixed(1)}M€` : "N/A"}
          icon={TrendingUp}
          themeColor="teal"
          description={program.budget ? `Budget total: ${new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(program.budget)}` : "Non spécifié"}
        />
        <PITStatCard
          label="Statut opérationnel"
          value={program.status === "ACTIVE" ? "Actif" : program.status === "COMPLETED" ? "Terminé" : "Planifié"}
          icon={CheckCircle}
          themeColor="indigo"
          description="Région Wallonne"
        />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description</h4>
        <p className="text-xs text-text leading-relaxed">
          {program.description || "Aucune description détaillée n'est renseignée pour ce programme."}
        </p>
      </div>

      {/* Organizations & Geography */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-muted/10">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-teal-650" /> Lead Operator
          </span>
          <span className="text-xs font-bold text-text">
            {program.ownerOrganization?.name || "SPW Économie, Emploi, Recherche"}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-500" /> Échelle Géographique
          </span>
          <span className="text-xs font-bold text-text">Wallonie / Europe (EDIH)</span>
        </div>
      </div>

      {/* Taxonomies Alignment */}
      <div className="space-y-3 pt-4 border-t border-muted/10">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Alignements stratégiques</span>
        <div className="flex flex-wrap gap-1.5">
          <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
            S3: Innovation Industrielle
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
            DR-BEST: TECHNOLOGY (T)
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
            DR-BEST: ECOSYSTEM (E)
          </Badge>
        </div>
      </div>
    </div>
  );

  // Projects Drill Down Tree Tab
  const projectsContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Hiérarchie : Programme ➔ Projet ➔ Action ➔ Activité
      </h4>
      <ProgramProjectsTree 
        programId={program.id} 
        activeProjId={activeProjId} 
        setActiveProjId={setActiveProjId}
        activeActionId={activeActionId}
        setActiveActionId={setActiveActionId}
      />
    </div>
  );

  // Flat Actions Tab
  const actionsContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Flat Actions List
      </h4>
      {activeProjId ? (
        <ProjectActionsList projectId={activeProjId} />
      ) : (
        <p className="text-xs text-muted italic py-4 text-center border border-muted/10 border-dashed rounded-xl">
          Sélectionnez un projet dans l'onglet "Projets" pour en lister les actions.
        </p>
      )}
    </div>
  );

  // Flat Activities Tab
  const activitiesContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Flat Activities List
      </h4>
      {activeActionId ? (
        <ActionActivitiesList actionId={activeActionId} />
      ) : (
        <p className="text-xs text-muted italic py-4 text-center border border-muted/10 border-dashed rounded-xl">
          Sélectionnez une action dans l'onglet "Projets" pour en lister les activités d'exécution.
        </p>
      )}
    </div>
  );

  // Graph Tab Content
  const graphContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Graphe local de relations sémantiques (vNext)
        </h4>
        <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 rounded">
          Program Portfolio Network
        </span>
      </div>
      {graphData?.data ? (
        <PITGraphView 
          nodes={graphData.data.nodes} 
          edges={graphData.data.edges} 
          mode="strategy"
          className="border border-muted/10 rounded-xl"
        />
      ) : (
        <div className="h-[300px] flex items-center justify-center border border-muted/10 border-dashed rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}
    </div>
  );

  // Metadata tab content
  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">URI de référence</span>
          <span className="font-mono text-[10px] break-all select-all block mt-1 text-teal-600 dark:text-teal-400">
            {program.uri || `https://pit.wallonie.be/programs/${program.id}`}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Prisma ID</span>
          <span className="font-mono mt-1 block select-all">
            {program.id}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Start Date</span>
          <span className="mt-1 block">
            {program.startDate ? new Date(program.startDate).toLocaleDateString("fr-BE") : "N/A"}
          </span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">End Date</span>
          <span className="mt-1 block">
            {program.endDate ? new Date(program.endDate).toLocaleDateString("fr-BE") : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={program.name}
      subtitle={program.description || `Programme ID: ${program.id}`}
      badge={
        <div className="flex items-center gap-2 select-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
            Programme Core
          </span>
          <span className="text-[9px] font-mono font-bold bg-muted px-1.5 py-0.2 rounded text-muted">
            {program.code || `PRG-${program.id}`}
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
      impactTab={projectsContent}
      contributionsTab={contributionsContent}
      metadataTab={metadataContent}
      historyTab={
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
            Historique des Modifications
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs">
              <Clock className="h-4.5 w-4.5 text-muted/60 mt-0.5" />
              <div>
                <p className="font-bold">Initial Seeding and Peopling</p>
                <p className="text-[10px] text-muted">12 Juin 2026 ➔ seed.ts automatically run</p>
              </div>
            </div>
          </div>
        </div>
      }
      overviewLabel="Vue d'ensemble"
      relationsLabel="Relations Graphe"
      impactLabel="Hiérarchie S3"
      contributionsLabel="Mesure d'impact"
      metadataLabel="Métadonnées"
    />
  );
}

// Tree view for projects, actions and activities
interface TreeProps {
  programId: number;
  activeProjId: number | null;
  setActiveProjId: (id: number | null) => void;
  activeActionId: number | null;
  setActiveActionId: (id: number | null) => void;
}

function ProgramProjectsTree({ 
  programId, 
  activeProjId, 
  setActiveProjId,
  activeActionId,
  setActiveActionId
}: TreeProps) {
  const [page, setPage] = useState(1);
  const { data: projectsData, isLoading } = useV2ProgramProjects(programId, page, 5);

  if (isLoading) {
    return (
      <div className="space-y-2.5 py-4">
        <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
      </div>
    );
  }

  const projects = projectsData?.data || [];
  const meta = projectsData?.meta || { total: 0, totalPages: 1 };

  if (projects.length === 0) {
    return (
      <p className="text-xs text-muted italic py-4 text-center border border-muted/10 border-dashed rounded-xl">
        Aucun projet n'est associé à ce programme.
      </p>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="space-y-2">
        {projects.map((proj: any) => {
          const isOpen = activeProjId === proj.id;
          return (
            <div key={proj.id} className="border border-muted/15 rounded-xl overflow-hidden bg-glass/5 shadow-xs">
              {/* Project Title Row */}
              <div 
                onClick={() => setActiveProjId(isOpen ? null : proj.id)}
                className={`flex items-center justify-between p-3.5 hover:bg-glass cursor-pointer select-none transition-colors ${
                  isOpen ? "bg-teal-500/5 border-b border-muted/15" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className={`h-4.5 w-4.5 ${isOpen ? "text-teal-650" : "text-muted/70"}`} />
                  <div>
                    <span className="text-[9px] font-bold font-mono text-muted uppercase bg-muted px-1.5 py-0.2 rounded mr-2">
                      PROJET
                    </span>
                    <span className="text-xs font-bold text-text">{proj.name}</span>
                  </div>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-muted" /> : <ChevronRight className="h-4 w-4 text-muted" />}
              </div>

              {/* Collapsed content: Actions */}
              {isOpen && (
                <div className="p-3 bg-gray-50/50 dark:bg-gray-900/10 pl-6 border-l-2 border-l-teal-600 space-y-3">
                  <ProjectActionsTree 
                    projectId={proj.id} 
                    activeActionId={activeActionId} 
                    setActiveActionId={setActiveActionId} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center text-[10px] text-muted font-bold uppercase tracking-wider pt-2">
          <span>{meta.total} projets</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-2 py-1 bg-muted rounded disabled:opacity-50 hover:bg-glass transition-colors cursor-pointer border-0 text-[10px] font-extrabold uppercase"
            >
              Prev
            </button>
            <button 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              className="px-2 py-1 bg-muted rounded disabled:opacity-50 hover:bg-glass transition-colors cursor-pointer border-0 text-[10px] font-extrabold uppercase"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tree view for Actions
function ProjectActionsTree({ 
  projectId, 
  activeActionId, 
  setActiveActionId 
}: { 
  projectId: number; 
  activeActionId: number | null; 
  setActiveActionId: (id: number | null) => void;
}) {
  const [page, setPage] = useState(1);
  const { data: actionsData, isLoading } = useV2ProjectActions(projectId, page, 5);

  if (isLoading) {
    return <div className="h-8 bg-muted rounded animate-pulse"></div>;
  }

  const actions = actionsData?.data || [];
  const meta = actionsData?.meta || { total: 0, totalPages: 1 };

  if (actions.length === 0) {
    return (
      <p className="text-[11px] text-muted italic py-1 pl-4">
        Aucun jalon d'action configuré.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {actions.map((act: any) => {
        const isOpen = activeActionId === act.id;
        return (
          <div key={act.id} className="border border-muted/10 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div 
              onClick={() => setActiveActionId(isOpen ? null : act.id)}
              className={`flex items-center justify-between p-2.5 hover:bg-glass cursor-pointer select-none transition-colors ${
                isOpen ? "bg-indigo-500/5 border-b border-muted/10" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className={`h-4 w-4 ${isOpen ? "text-indigo-500" : "text-muted/60"}`} />
                <div>
                  <span className="text-[8px] font-bold font-mono text-muted uppercase bg-muted px-1.5 py-0.2 rounded mr-1.5">
                    ACTION
                  </span>
                  <span className="text-[11px] font-bold text-text">{act.title}</span>
                </div>
              </div>
              {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted" /> : <ChevronRight className="h-3.5 w-3.5 text-muted" />}
            </div>

            {isOpen && (
              <div className="p-2.5 bg-gray-50/25 dark:bg-gray-900/5 pl-5 border-l-2 border-l-indigo-500 space-y-2">
                <ActionActivitiesTree actionId={act.id} />
              </div>
            )}
          </div>
        );
      })}

      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center text-[9px] text-muted font-bold tracking-widest uppercase pt-1">
          <span>{meta.total} actions</span>
          <div className="flex gap-1">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-1.5 py-0.5 bg-muted rounded disabled:opacity-50 text-[9px] font-extrabold uppercase border-0 cursor-pointer"
            >
              Prev
            </button>
            <button 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              className="px-1.5 py-0.5 bg-muted rounded disabled:opacity-50 text-[9px] font-extrabold uppercase border-0 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tree view for Activities
function ActionActivitiesTree({ actionId }: { actionId: number }) {
  const [page, setPage] = useState(1);
  const { data: activitiesData, isLoading } = useV2ActionActivities(actionId, page, 5);

  if (isLoading) {
    return <div className="h-6 bg-muted rounded animate-pulse"></div>;
  }

  const activities = activitiesData?.data || [];
  const meta = activitiesData?.meta || { total: 0, totalPages: 1 };

  if (activities.length === 0) {
    return (
      <p className="text-[10px] text-muted italic py-1 pl-4">
        Aucune activité enregistrée.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((act: any) => (
        <div key={act.id} className="p-2.5 bg-glass/20 border border-muted/10 rounded-lg flex items-center justify-between text-[11px] hover:border-teal-500/20 transition-all">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <div>
              <span className="text-[8px] font-bold font-mono text-muted uppercase bg-muted px-1.5 py-0.2 rounded mr-1.5">
                ACTIVITE
              </span>
              <span className="font-semibold text-text">{act.type}</span>
            </div>
          </div>
          <span className="text-[9px] text-muted font-mono">
            {act.date ? new Date(act.date).toLocaleDateString("fr-BE") : "N/A"}
          </span>
        </div>
      ))}

      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center text-[9px] text-muted font-bold pt-1 uppercase">
          <span>{meta.total} activités</span>
          <div className="flex gap-1">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-1.5 py-0.5 bg-muted rounded disabled:opacity-50 text-[9px] font-extrabold uppercase border-0 cursor-pointer"
            >
              Prev
            </button>
            <button 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              className="px-1.5 py-0.5 bg-muted rounded disabled:opacity-50 text-[9px] font-extrabold uppercase border-0 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Flat lists fallbacks for tabs
function ProjectActionsList({ projectId }: { projectId: number }) {
  const { data, isLoading } = useV2ProjectActions(projectId, 1, 50);
  if (isLoading) return <div className="h-10 bg-muted rounded animate-pulse"></div>;
  const items = data?.data || [];
  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <div key={item.id} className="p-3 bg-glass/20 border border-muted/10 rounded-xl text-xs flex justify-between items-center">
          <span className="font-bold">{item.title}</span>
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase text-[9px]">
            {item.status || "PENDING"}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function ActionActivitiesList({ actionId }: { actionId: number }) {
  const { data, isLoading } = useV2ActionActivities(actionId, 1, 50);
  if (isLoading) return <div className="h-10 bg-muted rounded animate-pulse"></div>;
  const items = data?.data || [];
  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <div key={item.id} className="p-3 bg-glass/20 border border-muted/10 rounded-xl text-xs flex justify-between items-center">
          <span className="font-bold">{item.type}</span>
          <span className="text-[10px] text-muted font-mono">
            {item.date ? new Date(item.date).toLocaleDateString("fr-BE") : "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
}
