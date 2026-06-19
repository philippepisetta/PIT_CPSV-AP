// src/app/strategic/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  LineChart, 
  Target, 
  Layers, 
  ArrowRight, 
  ClipboardCheck, 
  Building2, 
  Share2, 
  FileCode, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Compass,
  FileText,
  X,
  Info
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { 
  useV2MissionsQuery, 
  useV2RoadmapsQuery, 
  useV2PortfoliosQuery,
  useV2GapAnalysisQuery,
  useV2OpportunitiesQuery,
  useV2EvidencesQuery,
  useMetaQuery,
  useBeneficiariesQuery,
  useV2ActivitiesListQuery,
  useV2ProjectsQuery,
  useV2OutcomesQuery,
  useV2CreateProjectMutation,
  useV2UpdateProjectMutation,
  useV2DeleteProjectMutation,
  useV2CreateOutcomeMutation,
  useV2UpdateOutcomeMutation,
  useV2DeleteOutcomeMutation,
  useV2CreateEvidenceMutation,
  useV2UpdateEvidenceMutation,
  useV2DeleteEvidenceMutation,
  useV2LineageQuery
} from "@/hooks/usePITQueries";

export default function StrategicPage() {
  const [activeTab, setActiveTab] = useState<string>("missions");

  // React Query Hooks
  const { data: missionsRes, isLoading: missionsLoading } = useV2MissionsQuery();
  const { data: roadmapsRes, isLoading: roadmapsLoading } = useV2RoadmapsQuery();
  const { data: portfoliosRes, isLoading: portfoliosLoading } = useV2PortfoliosQuery();
  const { data: gapRes, isLoading: gapLoading } = useV2GapAnalysisQuery();
  const { data: oppsRes, isLoading: oppsLoading } = useV2OpportunitiesQuery();
  const { data: evidencesRes, isLoading: evidencesLoading } = useV2EvidencesQuery();
  const { data: projectsRes, isLoading: projectsLoading } = useV2ProjectsQuery();
  const { data: outcomesRes, isLoading: outcomesLoading } = useV2OutcomesQuery();
  const { data: metaRes } = useMetaQuery();
  const { data: beneficiariesRes } = useBeneficiariesQuery();
  const { data: activitiesRes } = useV2ActivitiesListQuery();

  const missions = missionsRes?.data || [];
  const roadmaps = roadmapsRes?.data || [];
  const portfolios = portfoliosRes?.data || [];
  const gaps = gapRes?.data || [];
  const opportunities = oppsRes?.data || [];
  const evidences = evidencesRes?.data || [];
  const projects = projectsRes?.data || [];
  const outcomes = outcomesRes?.data || [];
  const programs = metaRes?.programs || [];
  const services = metaRes?.services || [];
  const beneficiaries = beneficiariesRes?.data || [];
  const activities = activitiesRes?.data || [];

  const loading = missionsLoading || roadmapsLoading || portfoliosLoading || gapLoading || oppsLoading || evidencesLoading || projectsLoading || outcomesLoading;

  // Selected lineage state
  const [selectedLineageId, setSelectedLineageId] = useState<number | null>(null);
  const [selectedLineageType, setSelectedLineageType] = useState<string>("project");
  const [selectedFunnel, setSelectedFunnel] = useState<"edih" | "cluster" | "we" | "awex">("edih");

  // Project CRUD States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectFormMode, setProjectFormMode] = useState<"create" | "edit">("create");
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projName, setProjName] = useState("");
  const [projCode, setProjCode] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projStart, setProjStart] = useState("");
  const [projEnd, setProjEnd] = useState("");
  const [projStatus, setProjStatus] = useState("PLANNED");
  const [projProgramId, setProjProgramId] = useState("");
  const [projBeneficiaryId, setProjBeneficiaryId] = useState("");

  const createProjectMutation = useV2CreateProjectMutation();
  const updateProjectMutation = useV2UpdateProjectMutation();
  const deleteProjectMutation = useV2DeleteProjectMutation();

  // Outcome CRUD States
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [outcomeFormMode, setOutcomeFormMode] = useState<"create" | "edit">("create");
  const [editingOutcome, setEditingOutcome] = useState<any | null>(null);
  const [outName, setOutName] = useState("");
  const [outCode, setOutCode] = useState("");
  const [outDesc, setOutDesc] = useState("");
  const [outUri, setOutUri] = useState("");
  const [outServiceId, setOutServiceId] = useState("");

  const createOutcomeMutation = useV2CreateOutcomeMutation();
  const updateOutcomeMutation = useV2UpdateOutcomeMutation();
  const deleteOutcomeMutation = useV2DeleteOutcomeMutation();

  // Evidence CRUD States
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceFormMode, setEvidenceFormMode] = useState<"create" | "edit">("create");
  const [editingEvidence, setEditingEvidence] = useState<any | null>(null);
  const [eviName, setEviName] = useState("");
  const [eviDesc, setEviDesc] = useState("");
  const [eviCode, setEviCode] = useState("");
  const [eviFile, setEviFile] = useState("");
  const [eviUrl, setEviUrl] = useState("");
  const [eviType, setEviType] = useState("");
  const [eviRequirementId, setEviRequirementId] = useState("");
  const [eviActivityId, setEviActivityId] = useState("");
  const [eviDeliveryId, setEviDeliveryId] = useState("");
  const [eviStatus, setEviStatus] = useState("PENDING");

  const createEvidenceMutation = useV2CreateEvidenceMutation();
  const updateEvidenceMutation = useV2UpdateEvidenceMutation();
  const deleteEvidenceMutation = useV2DeleteEvidenceMutation();

  // Project CRUD Methods
  const handleStartCreateProject = () => {
    setProjectFormMode("create");
    setEditingProject(null);
    setProjName("");
    setProjCode("");
    setProjDesc("");
    setProjStart("");
    setProjEnd("");
    setProjStatus("PLANNED");
    setProjProgramId("");
    setProjBeneficiaryId("");
    setShowProjectModal(true);
  };

  const handleStartEditProject = (proj: any) => {
    setProjectFormMode("edit");
    setEditingProject(proj);
    setProjName(proj.name || "");
    setProjCode(proj.code || "");
    setProjDesc(proj.description || "");
    setProjStart(proj.startDate ? proj.startDate.split("T")[0] : "");
    setProjEnd(proj.endDate ? proj.endDate.split("T")[0] : "");
    setProjStatus(proj.status || "PLANNED");
    setProjProgramId(proj.programId ? String(proj.programId) : "");
    setProjBeneficiaryId(proj.beneficiaryId ? String(proj.beneficiaryId) : "");
    setShowProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName) return;

    const payload = {
      name: projName,
      code: projCode || null,
      description: projDesc || null,
      startDate: projStart ? new Date(projStart).toISOString() : null,
      endDate: projEnd ? new Date(projEnd).toISOString() : null,
      status: projStatus,
      programId: projProgramId ? parseInt(projProgramId) : null,
      beneficiaryId: projBeneficiaryId ? parseInt(projBeneficiaryId) : null
    };

    if (projectFormMode === "edit" && editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data: payload }, {
        onSuccess: () => {
          setShowProjectModal(false);
          alert("✅ Projet mis à jour avec succès !");
        }
      });
    } else {
      createProjectMutation.mutate(payload, {
        onSuccess: () => {
          setShowProjectModal(false);
          alert("✅ Projet créé avec succès !");
        }
      });
    }
  };

  const handleDeleteProject = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) return;
    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        alert("✅ Projet supprimé avec succès !");
        if (selectedLineageId === id && selectedLineageType === "project") {
          setSelectedLineageId(null);
        }
      }
    });
  };

  // Outcome CRUD Methods
  const handleStartCreateOutcome = () => {
    setOutcomeFormMode("create");
    setEditingOutcome(null);
    setOutName("");
    setOutCode("");
    setOutDesc("");
    setOutUri("");
    setOutServiceId("");
    setShowOutcomeModal(true);
  };

  const handleStartEditOutcome = (out: any) => {
    setOutcomeFormMode("edit");
    setEditingOutcome(out);
    setOutName(out.name || "");
    setOutCode(out.code || "");
    setOutDesc(out.description || "");
    setOutUri(out.uri || "");
    setOutServiceId(out.publicServiceId ? String(out.publicServiceId) : "");
    setShowOutcomeModal(true);
  };

  const handleSaveOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outName || !outServiceId) {
      alert("Le nom et la liaison au Service Public sont obligatoires.");
      return;
    }

    const payload = {
      name: outName,
      code: outCode || null,
      description: outDesc || null,
      uri: outUri || null,
      publicServiceId: parseInt(outServiceId)
    };

    if (outcomeFormMode === "edit" && editingOutcome) {
      updateOutcomeMutation.mutate({ id: editingOutcome.id, data: payload }, {
        onSuccess: () => {
          setShowOutcomeModal(false);
          alert("✅ Outcome mis à jour avec succès !");
        }
      });
    } else {
      createOutcomeMutation.mutate(payload, {
        onSuccess: () => {
          setShowOutcomeModal(false);
          alert("✅ Outcome créé avec succès !");
        }
      });
    }
  };

  const handleDeleteOutcome = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet outcome ? Cette action est irréversible.")) return;
    deleteOutcomeMutation.mutate(id, {
      onSuccess: () => {
        alert("✅ Outcome supprimé avec succès !");
      }
    });
  };

  // Evidence CRUD Methods
  const handleStartCreateEvidence = () => {
    setEvidenceFormMode("create");
    setEditingEvidence(null);
    setEviName("");
    setEviDesc("");
    setEviCode("");
    setEviFile("");
    setEviUrl("");
    setEviType("Fichier");
    setEviRequirementId("");
    setEviActivityId("");
    setEviDeliveryId("");
    setEviStatus("PENDING");
    setShowEvidenceModal(true);
  };

  const handleStartEditEvidence = (evi: any) => {
    setEvidenceFormMode("edit");
    setEditingEvidence(evi);
    setEviName(evi.name || "");
    setEviDesc(evi.description || "");
    setEviCode(evi.code || "");
    setEviFile(evi.file || "");
    setEviUrl(evi.url || "");
    setEviType(evi.type || "Fichier");
    setEviRequirementId(evi.requirementId ? String(evi.requirementId) : "");
    setEviActivityId(evi.activityId ? String(evi.activityId) : "");
    setEviDeliveryId(evi.serviceDeliveryId ? String(evi.serviceDeliveryId) : "");
    setEviStatus(evi.status || "PENDING");
    setShowEvidenceModal(true);
  };

  const handleSaveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eviName) return;
    if (!eviRequirementId && !eviActivityId && !eviDeliveryId) {
      alert("Une preuve doit obligatoirement être rattachée à une Activité, une Exigence ou une Réalisation de service.");
      return;
    }

    const payload = {
      name: eviName,
      description: eviDesc || null,
      code: eviCode || null,
      file: eviFile || null,
      url: eviUrl || null,
      type: eviType || null,
      requirementId: eviRequirementId ? parseInt(eviRequirementId) : null,
      activityId: eviActivityId ? parseInt(eviActivityId) : null,
      serviceDeliveryId: eviDeliveryId ? parseInt(eviDeliveryId) : null,
      status: eviStatus
    };

    if (evidenceFormMode === "edit" && editingEvidence) {
      updateEvidenceMutation.mutate({ id: editingEvidence.id, data: payload }, {
        onSuccess: () => {
          setShowEvidenceModal(false);
          alert("✅ Preuve d'impact mise à jour avec succès !");
        }
      });
    } else {
      createEvidenceMutation.mutate(payload, {
        onSuccess: () => {
          setShowEvidenceModal(false);
          alert("✅ Preuve d'impact créée avec succès !");
        }
      });
    }
  };

  const handleDeleteEvidence = (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette preuve d'impact ? Cette action est irréversible.")) return;
    deleteEvidenceMutation.mutate(id, {
      onSuccess: () => {
        alert("✅ Preuve d'impact supprimée avec succès !");
      }
    });
  };

  // Static mock ecosystems for Vue Ecosystèmes
  const ECOSYSTEMS = [
    { name: "BioWin", description: "Pôle de compétitivité santé de la Wallonie (Biotechs, Medtechs).", actors: 12, projects: 5 },
    { name: "GreenWin", description: "Pôle de compétitivité chimie verte et matériaux durables.", actors: 8, projects: 3 },
    { name: "MecaTech", description: "Pôle de compétitivité génie mécanique et Industrie 5.0.", actors: 14, projects: 4 },
    { name: "Logistics in Wallonia", description: "Pôle de compétitivité mobilité, transport et logistique fret.", actors: 10, projects: 4 },
    { name: "Wagralim", description: "Pôle de compétitivité agroalimentaire et nutrition durable.", actors: 15, projects: 4 }
  ];

  return (
    <PITLayout
      category="PILOTAGE DG"
      title="Cockpit Stratégique Exécutif"
      description="Pilotage consolidé et navigation ascendante/descendante des politiques publiques : des missions stratégiques aux preuves d'impact sur le terrain."
      pageIcon={LineChart}
      breadcrumb={[{ label: "Cockpit DG" }]}
    >
      <div className="space-y-6">
        
        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-3">
          <Info className="h-5 w-5 text-teal-605 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-900 dark:text-teal-350">
            <p className="font-bold uppercase tracking-wider text-[10px]">Note Exécutive</p>
            <p className="mt-1 leading-relaxed">
              Cette vue consolide les données validées issues des services, projets, preuves et outcomes. Les modifications sont réservées aux profils autorisés.
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs Header */}
        <div className="flex bg-glass/25 p-1.5 rounded-2xl border border-muted/20 gap-1 overflow-x-auto scrollbar-thin">
          {[
            { id: "missions", label: "Missions & Roadmaps", icon: Target },
            { id: "ecosystems", label: "Vue Écosystèmes", icon: Share2 },
            { id: "opportunities", label: "Vue Financements", icon: FileCode },
            { id: "gaps", label: "Vue Gaps", icon: AlertTriangle },
            { id: "animation_funnels", label: "Vue Animation (Funnels)", icon: TrendingUp },
            { id: "impacts", label: "Vue Preuves & Impacts", icon: ClipboardCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? "bg-teal-500 text-white shadow-sm font-extrabold" 
                    : "text-muted hover:bg-glass hover:text-text"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-2" />
            <span className="text-xs font-bold">Agrégation stratégique en cours...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Missions & Roadmaps Tab */}
            {activeTab === "missions" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                  <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                    Missions & Thématiques S3
                  </h3>
                  <div className="space-y-3">
                    {missions.map((m: any) => (
                      <div key={m.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl space-y-2">
                        <span className="text-xs font-black text-text block leading-tight">{m.name}</span>
                        {m.themes?.map((t: any) => (
                          <div key={t.id} className="p-2.5 bg-glass/20 border border-muted/10 rounded-lg text-[10px] font-bold text-muted flex items-center justify-between">
                            <span>{t.name}</span>
                            <span className="text-[8px] font-black uppercase bg-teal-500/10 text-teal-655 px-1.5 rounded">Thème S3</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                  <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                    Feuilles de Route (Roadmaps) & Portefeuilles
                  </h3>
                  <div className="space-y-3">
                    {roadmaps.map((r: any) => (
                      <div key={r.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl space-y-2">
                        <span className="text-xs font-black text-text block leading-tight">{r.name}</span>
                        {r.objectives?.map((o: any) => (
                          <div key={o.id} className="text-[10px] text-text font-bold flex items-start gap-1">
                            <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{o.name}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Vue Ecosystèmes Tab */}
            {activeTab === "ecosystems" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ECOSYSTEMS.map((eco, i) => (
                  <div key={i} className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-muted/10 pb-2">
                      <h4 className="font-black text-xs text-text uppercase">{eco.name}</h4>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full">Pôle</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed font-semibold">{eco.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-black pt-2">
                      <div className="bg-glass p-2 rounded-lg">
                        Membres
                        <span className="block text-xs font-black mt-0.5">{eco.actors}</span>
                      </div>
                      <div className="bg-glass p-2 rounded-lg">
                        Projets
                        <span className="block text-xs font-black mt-0.5">{eco.projects}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Vue Financements Tab */}
            {activeTab === "opportunities" && (
              <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                  Programmes Financiers & Subventions Wallonnes
                </h3>
                <div className="space-y-3">
                  {opportunities.map((o: any) => (
                    <div key={o.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-black text-teal-605 uppercase block">{o.type}</span>
                        <span className="text-xs font-black text-text block mt-0.5">{o.title}</span>
                        <span className="text-[10px] text-muted block font-semibold">Fournisseur : {o.provider}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 shrink-0">
                        {o.status || "OPEN"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Vue Gaps Tab */}
            {activeTab === "gaps" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gaps.slice(0, 3).map((fil: any) => (
                  <div key={fil.id} className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-black text-text block uppercase border-b border-muted/10 pb-2">{fil.name}</span>
                    <div className="space-y-3">
                      {fil.valueChains?.map((vc: any) => (
                        <div key={vc.id} className="space-y-1.5">
                          <span className="text-[9px] font-extrabold text-muted block uppercase">{vc.name}</span>
                          {vc.segments?.map((seg: any) => {
                            const hasGaps = seg.gaps.actors || seg.gaps.services || seg.gaps.capabilities || seg.gaps.funding;
                            return (
                              <div key={seg.id} className="p-2 bg-glass/20 border border-muted/10 rounded-lg flex items-center justify-between text-[10px] font-bold">
                                <span className="text-text">{seg.name}</span>
                                {hasGaps ? (
                                  <span className="text-rose-500 font-extrabold flex items-center gap-0.5">
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Gaps
                                  </span>
                                ) : (
                                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> OK
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Vue Preuves & Impacts Tab */}
            {activeTab === "impacts" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Lists Col */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Projets S3 */}
                  <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-muted/10 pb-3">
                      <h3 className="font-extrabold text-xs text-text uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-500" /> Projets Stratégiques (S3)
                      </h3>
                      <button
                        type="button"
                        onClick={handleStartCreateProject}
                        className="px-2.5 py-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-[10px] font-black cursor-pointer hover:shadow"
                      >
                        + Nouveau Projet
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj: any) => (
                        <div key={proj.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-text leading-tight">{proj.name}</span>
                              <span className="text-[8px] font-extrabold bg-indigo-500/10 text-indigo-600 px-1.5 py-0.2 rounded-full uppercase shrink-0">
                                {proj.status}
                              </span>
                            </div>
                            <span className="text-[9px] text-muted font-black uppercase block">Code: {proj.code || `PROJ-${proj.id}`}</span>
                            <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{proj.description || "Aucune description."}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-muted/5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLineageId(proj.id);
                                setSelectedLineageType("project");
                              }}
                              className="text-[9px] font-black text-teal-500 hover:underline flex items-center gap-0.5 cursor-pointer border-0 bg-transparent"
                            >
                              <Compass className="w-3 h-3" /> Lignage S3
                            </button>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditProject(proj)}
                                className="text-[9px] font-black text-indigo-500 hover:underline cursor-pointer border-0 bg-transparent"
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id)}
                                className="text-[9px] font-black text-rose-500 hover:underline cursor-pointer border-0 bg-transparent"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {projects.length === 0 && (
                        <p className="text-xs text-muted italic p-4 col-span-2">Aucun projet enregistré.</p>
                      )}
                    </div>
                  </div>

                  {/* Impacts / Outcomes */}
                  <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-muted/10 pb-3">
                      <h3 className="font-extrabold text-xs text-text uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-teal-500" /> Impacts & Outcomes (S3 Lineage)
                      </h3>
                      <button
                        type="button"
                        onClick={handleStartCreateOutcome}
                        className="px-2.5 py-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-[10px] font-black cursor-pointer hover:shadow"
                      >
                        + Nouvel Outcome
                      </button>
                    </div>

                    <div className="space-y-3">
                      {outcomes.map((out: any) => (
                        <div key={out.id} className="p-3 bg-glass/35 border border-muted/10 rounded-xl flex justify-between items-center gap-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs text-text block leading-tight">{out.name}</span>
                            <span className="text-[9px] text-muted font-semibold block">{out.description}</span>
                            {out.publicService && (
                              <span className="text-[8px] text-teal-600 font-bold uppercase block mt-1">
                                Lignage Service: {out.publicService.name}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditOutcome(out)}
                              className="text-[9px] font-black text-indigo-500 hover:underline cursor-pointer border-0 bg-transparent"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOutcome(out.id)}
                              className="text-[9px] font-black text-rose-500 hover:underline cursor-pointer border-0 bg-transparent"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                      {outcomes.length === 0 && (
                        <p className="text-xs text-muted italic p-4">Aucun outcome stratégique enregistré.</p>
                      )}
                    </div>
                  </div>

                  {/* Preuves / Evidences */}
                  <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-muted/10 pb-3">
                      <h3 className="font-extrabold text-xs text-text uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardCheck className="w-4 h-4 text-teal-500" /> Registre des Preuves d'Impact
                      </h3>
                      <button
                        type="button"
                        onClick={handleStartCreateEvidence}
                        className="px-2.5 py-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-[10px] font-black cursor-pointer hover:shadow"
                      >
                        + Nouvelle Preuve
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                            <th className="py-2">Justificatif</th>
                            <th className="py-2">Type</th>
                            <th className="py-2">Fichier URL</th>
                            <th className="py-2">Statut</th>
                            <th className="py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evidences.map((evi: any) => (
                            <tr key={evi.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                              <td className="py-3 pr-2">
                                <span className="font-bold text-text block">{evi.name}</span>
                                <span className="text-muted text-[10px] block max-w-xs truncate">{evi.description}</span>
                              </td>
                              <td className="py-3 font-semibold text-text uppercase">{evi.type || "Fichier"}</td>
                              <td className="py-3 font-mono text-muted">
                                {evi.url ? (
                                  <a href={evi.url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                                    Voir justificatif
                                  </a>
                                ) : (
                                  "Aucun lien"
                                )}
                              </td>
                              <td className="py-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-max ${
                                  evi.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600" :
                                  evi.status === "REJECTED" ? "bg-rose-500/10 text-rose-600" :
                                  "bg-amber-500/10 text-amber-500"
                                }`}>
                                  {evi.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditEvidence(evi)}
                                    className="text-[9px] font-black text-indigo-500 hover:underline cursor-pointer border-0 bg-transparent"
                                  >
                                    Modifier
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEvidence(evi.id)}
                                    className="text-[9px] font-black text-rose-500 hover:underline cursor-pointer border-0 bg-transparent"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Lineage Trace Visualizer Panel */}
                <div className="space-y-6">
                  <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-6 sticky top-20">
                    <div>
                      <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                        ⛓️ Lignage Stratégique S3
                      </h3>
                      <p className="text-[10px] text-muted mt-1 leading-snug">
                        Visualisez la chaîne complète d&apos;intervention publique reliant les priorités régionales aux livrables opérationnels.
                      </p>
                    </div>

                    {selectedLineageId ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Type: {selectedLineageType}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedLineageId(null)}
                            className="text-[9px] font-black text-rose-500 hover:underline cursor-pointer border-0 bg-transparent"
                          >
                            Masquer
                          </button>
                        </div>
                        <LineageTraceVisualizer type={selectedLineageType} id={selectedLineageId} />
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-glass/10 border border-dashed border-muted/20 rounded-xl text-muted text-xs font-semibold">
                        <Compass className="w-8 h-8 text-muted/30 mx-auto mb-2 animate-pulse" />
                        Sélectionnez &quot;Lignage S3&quot; sur un projet ou une activité pour en tracer la chaîne d&apos;impact.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Vue Animation (Funnels) Tab */}
            {activeTab === "animation_funnels" && (
              <div className="space-y-6">
                {/* Funnel switcher */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-muted/10 pb-4 gap-4">
                  <div>
                    <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                      <TrendingUp className="h-5 w-5 text-teal-650" />
                      Entonnoirs d&apos;Animation Fédérés (Specialized Funnels)
                    </h3>
                    <p className="text-[11px] text-muted mt-0.5">Pilotez le taux de conversion opérationnel propre à chaque type d&apos;opérateur wallon.</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "edih", label: "EDIH" },
                      { id: "cluster", label: "Cluster" },
                      { id: "we", label: "WE (Financement)" },
                      { id: "awex", label: "AWEX (Export)" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFunnel(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          selectedFunnel === f.id 
                            ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                            : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Funnel Steps Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                  {selectedFunnel === "edih" && [
                    { label: "1. Participants", count: "120 PMEs", desc: "Sensibilisées aux technologies", pct: 100 },
                    { label: "2. Passation DMAT", count: "45 PMEs", desc: "Diagnostics de maturité complétés", pct: 37.5 },
                    { label: "3. Services reçus", count: "30 PMEs", desc: "Diagnostics profonds & audits", pct: 66.7 },
                    { label: "4. Test Before Invest", count: "12 PMEs", desc: "Prototypage & expérimentation", pct: 40.0 },
                    { label: "5. Investissement", count: "5 PMEs", desc: "Mise en production industrielle", pct: 41.7 }
                  ].map((step, idx, arr) => (
                    <div key={idx} className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-muted">{step.label}</span>
                        {idx > 0 && (
                          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-1 rounded">
                            -{Math.round(100 - step.pct)}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-text">{step.count}</h4>
                      <p className="text-[10px] text-muted font-semibold leading-tight">{step.desc}</p>
                      <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: `${step.pct}%` }} />
                      </div>
                    </div>
                  ))}

                  {selectedFunnel === "cluster" && [
                    { label: "1. Communautés", count: "10 Cercles", desc: "Réseaux thématiques actifs", pct: 100 },
                    { label: "2. Activités", count: "11 Événements", desc: "Ateliers, webinaires, séminaires", pct: 110 },
                    { label: "3. Matchmaking", count: "8 Recommandations", desc: "Paires de synergies identifiées", pct: 72.7 },
                    { label: "4. Consortium", count: "4 Établis", desc: "Consortiums formés par le pôle", pct: 50.0 },
                    { label: "5. Projets R&D", count: "2 Lancés", desc: "Nouveaux projets collaboratifs", pct: 50.0 }
                  ].map((step, idx) => (
                    <div key={idx} className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-muted">{step.label}</span>
                        {idx > 0 && idx < 3 && (
                          <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 px-1 rounded">
                            +10%
                          </span>
                        )}
                        {idx >= 3 && (
                          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-1 rounded">
                            -{Math.round(100 - step.pct)}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-text">{step.count}</h4>
                      <p className="text-[10px] text-muted font-semibold leading-tight">{step.desc}</p>
                      <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: `${idx >= 3 ? step.pct : 100}%` }} />
                      </div>
                    </div>
                  ))}

                  {selectedFunnel === "we" && [
                    { label: "1. Entreprises S3", count: "80 PMEs", desc: "Identifiées à fort potentiel S3", pct: 100 },
                    { label: "2. Accompagnement", count: "35 PMEs", desc: "Sessions individuelles de coaching", pct: 43.8 },
                    { label: "3. Financement", count: "15 Subventions", desc: "Aides financières WE validées", pct: 42.9 },
                    { label: "4. Croissance", count: "6 PMEs", desc: "Métrique d&apos;affaires en hausse", pct: 40.0 }
                  ].map((step, idx) => (
                    <div key={idx} className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-muted">{step.label}</span>
                        {idx > 0 && (
                          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-1 rounded">
                            -{Math.round(100 - step.pct)}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-text">{step.count}</h4>
                      <p className="text-[10px] text-muted font-semibold leading-tight">{step.desc}</p>
                      <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: `${step.pct}%` }} />
                      </div>
                    </div>
                  ))}

                  {selectedFunnel === "awex" && [
                    { label: "1. Mission Éco", count: "15 PMEs", desc: "Membres de la délégation Hanover", pct: 100 },
                    { label: "2. Contact Qualifié", count: "60 Prospects", desc: "Rencontres B2B enregistrées", pct: 400 },
                    { label: "3. Partenariat", count: "12 Accords", desc: "MOU signés à l&apos;international", pct: 20.0 },
                    { label: "4. Export Activé", count: "3 PMEs", desc: "Première livraison hors Belgique", pct: 25.0 }
                  ].map((step, idx) => (
                    <div key={idx} className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-muted">{step.label}</span>
                        {idx > 0 && idx < 2 && (
                          <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 px-1 rounded">
                            x4
                          </span>
                        )}
                        {idx >= 2 && (
                          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-1 rounded">
                            -{Math.round(100 - step.pct)}%
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-text">{step.count}</h4>
                      <p className="text-[10px] text-muted font-semibold leading-tight">{step.desc}</p>
                      <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: `${idx >= 2 ? step.pct : 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-muted/20 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-sm font-black text-text uppercase">
                {projectFormMode === "create" ? "Créer un Projet S3" : "Modifier le Projet S3"}
              </h3>
              <button type="button" onClick={() => setShowProjectModal(false)} className="text-muted hover:text-text cursor-pointer border-0 bg-transparent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Nom du Projet *</label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="ex: Projet IA Predictive Maintenance"
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Code Projet</label>
                  <input
                    type="text"
                    value={projCode}
                    onChange={(e) => setProjCode(e.target.value)}
                    placeholder="ex: PROJ-IA-PM"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Statut</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  >
                    <option value="PLANNED">Planifié</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Objectifs, verrous technologiques..."
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500 min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Date de Début</label>
                  <input
                    type="date"
                    value={projStart}
                    onChange={(e) => setProjStart(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Date de Fin</label>
                  <input
                    type="date"
                    value={projEnd}
                    onChange={(e) => setProjEnd(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Programme Parent</label>
                  <select
                    value={projProgramId}
                    onChange={(e) => setProjProgramId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Sélectionner</option>
                    {programs.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Entreprise Bénéficiaire</label>
                  <select
                    value={projBeneficiaryId}
                    onChange={(e) => setProjBeneficiaryId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Sélectionner</option>
                    {beneficiaries.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-3 py-1.5 bg-glass border border-muted/30 text-text rounded-xl text-xs font-extrabold cursor-pointer hover:bg-glass/60"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer hover:shadow"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outcome Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-muted/20 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-sm font-black text-text uppercase">
                {outcomeFormMode === "create" ? "Créer un Outcome (Impact)" : "Modifier l'Outcome"}
              </h3>
              <button type="button" onClick={() => setShowOutcomeModal(false)} className="text-muted hover:text-text cursor-pointer border-0 bg-transparent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveOutcome} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Nom de l'Outcome *</label>
                <input
                  type="text"
                  required
                  value={outName}
                  onChange={(e) => setOutName(e.target.value)}
                  placeholder="ex: Réduction de 15% des déchets industriels"
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Description</label>
                <textarea
                  value={outDesc}
                  onChange={(e) => setOutDesc(e.target.value)}
                  placeholder="Détails sur l'impact mesuré..."
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500 min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Code Outcome</label>
                  <input
                    type="text"
                    value={outCode}
                    onChange={(e) => setOutCode(e.target.value)}
                    placeholder="ex: OUT-CARBON-SAV"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">URI Sémantique</label>
                  <input
                    type="text"
                    value={outUri}
                    onChange={(e) => setOutUri(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Service Public rattaché *</label>
                <select
                  required
                  value={outServiceId}
                  onChange={(e) => setOutServiceId(e.target.value)}
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                >
                  <option value="">Sélectionner</option>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="px-3 py-1.5 bg-glass border border-muted/30 text-text rounded-xl text-xs font-extrabold cursor-pointer hover:bg-glass/60"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer hover:shadow"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-muted/20 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-sm font-black text-text uppercase">
                {evidenceFormMode === "create" ? "Ajouter une Preuve d'Impact" : "Modifier la Preuve"}
              </h3>
              <button type="button" onClick={() => setShowEvidenceModal(false)} className="text-muted hover:text-text cursor-pointer border-0 bg-transparent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEvidence} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Nom de la Preuve *</label>
                <input
                  type="text"
                  required
                  value={eviName}
                  onChange={(e) => setEviName(e.target.value)}
                  placeholder="ex: Rapport d'Audit Énergétique Certifié"
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-muted uppercase">Description</label>
                <textarea
                  value={eviDesc}
                  onChange={(e) => setEviDesc(e.target.value)}
                  placeholder="Contenu de la preuve..."
                  className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500 min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Code Preuve</label>
                  <input
                    type="text"
                    value={eviCode}
                    onChange={(e) => setEviCode(e.target.value)}
                    placeholder="ex: EVI-AUDIT-EN"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Type de Preuve</label>
                  <input
                    type="text"
                    value={eviType}
                    onChange={(e) => setEviType(e.target.value)}
                    placeholder="ex: PDF, Rapport, Attestation"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">Fichier</label>
                  <input
                    type="text"
                    value={eviFile}
                    onChange={(e) => setEviFile(e.target.value)}
                    placeholder="audit-report.pdf"
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted uppercase">URL du justificatif</label>
                  <input
                    type="text"
                    value={eviUrl}
                    onChange={(e) => setEviUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="border-t border-muted/10 pt-2 space-y-2">
                <span className="text-[9px] font-black text-indigo-500 uppercase block">Lignage d'intervention (sélectionner un parent)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase">Activité</label>
                    <select
                      value={eviActivityId}
                      onChange={(e) => {
                        setEviActivityId(e.target.value);
                        if (e.target.value) {
                          setEviRequirementId("");
                          setEviDeliveryId("");
                        }
                      }}
                      className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                    >
                      <option value="">Sélectionner</option>
                      {activities.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.activityType} - ID: {a.id}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase">Statut Preuve</label>
                    <select
                      value={eviStatus}
                      onChange={(e) => setEviStatus(e.target.value)}
                      className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-3 py-1.5 bg-glass border border-muted/30 text-text rounded-xl text-xs font-extrabold cursor-pointer hover:bg-glass/60"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-black cursor-pointer hover:shadow"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PITLayout>
  );
}

function LineageTraceVisualizer({ type, id }: { type: string; id: number }) {
  const { data: lineageRes, isLoading } = useV2LineageQuery(type, id);
  const lineageData = lineageRes?.data;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted text-xs font-bold">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500 mx-auto mb-2" />
        Traçage de lignage...
      </div>
    );
  }

  const flowSteps = [
    { label: "Programme", key: "programs", color: "bg-rose-500", icon: "🔴" },
    { label: "Priorité S3", key: "priorities", color: "bg-orange-500", icon: "🟠" },
    { label: "Initiative", key: "initiatives", color: "bg-amber-500", icon: "🟡" },
    { label: "Action", key: "actions", color: "bg-emerald-500", icon: "🟢" },
    { label: "Activité", key: "activities", color: "bg-teal-500", icon: "🔵" },
    { label: "Défi (Challenge)", key: "challenges", color: "bg-indigo-500", icon: "purple" },
    { label: "Parcours (Journey)", key: "journeys", color: "bg-purple-500", icon: "🧭" },
    { label: "Service public", key: "services", color: "bg-pink-500", icon: "💼" },
    { label: "Financement", key: "fundings", color: "bg-sky-500", icon: "💶" },
    { label: "Projet R&D", key: "projects", color: "bg-blue-500", icon: "🏗️" },
    { label: "Outcome (Impact)", key: "outcomes", color: "bg-green-500", icon: "📈" },
    { label: "Evidence (Preuve)", key: "evidences", color: "bg-violet-500", icon: "📄" },
  ];

  return (
    <div className="space-y-4 max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 scrollbar-thin">
      {flowSteps.map((step, idx) => {
        const items = lineageData?.[step.key] || [];
        return (
          <div key={idx} className="flex gap-3 items-start relative pb-4 last:pb-0">
            {/* Connector Line */}
            {idx < flowSteps.length - 1 && (
              <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-muted/20" />
            )}
            {/* Node Bullet */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step.color} text-white font-extrabold shadow-sm z-10 shrink-0`}>
              {idx + 1}
            </div>
            {/* Content */}
            <div className="space-y-0.5 bg-glass/25 border border-muted/10 p-2.5 rounded-xl flex-1 min-w-0">
              <span className="text-[9px] font-black text-muted uppercase tracking-wider block">{step.label}</span>
              {items.length > 0 ? (
                <div className="space-y-0.5">
                  {items.map((item: any) => (
                    <span key={item.id} className="text-[11px] font-bold text-text block leading-snug truncate" title={item.name || item.title || item.code}>
                      {item.name || item.title || item.code || `ID: ${item.id}`}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-muted italic font-medium">Non lié</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
