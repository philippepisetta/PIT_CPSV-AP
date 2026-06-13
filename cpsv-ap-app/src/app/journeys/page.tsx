// src/app/journeys/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Compass, 
  Building2, 
  ExternalLink, 
  Save, 
  ArrowLeft,
  Activity,
  Layers,
  Database,
  Users,
  Sparkles,
  Network,
  Info,
  FileText,
  Share2
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITTabs from "@/design-system/PITTabs";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { 
  useJourneysQuery, 
  useMetaQuery, 
  useBeneficiariesQuery, 
  useJourneyEnrollmentsQuery,
  useCreateJourneyMutation, 
  useUpdateJourneyMutation, 
  useDeleteJourneyMutation 
} from "@/hooks/usePITQueries";
import { cn } from "@/lib/utils";
import JourneyModelsView from "@/components/journeys/JourneyModelsView";

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
  createdAt?: string;
  updatedAt?: string;
}

interface JourneyEnrollment {
  id: number;
  journeyId: number;
  beneficiaryId: number;
  status: string;
  completionRate: number;
  beneficiary?: {
    name: string;
    location: string;
  };
  currentStage?: {
    name: string;
  };
}

export default function JourneysPage() {
  const { data: journeysData, isLoading: loadingJourneys, isError: errorJourneys } = useJourneysQuery();
  const { data: metaData, isLoading: loadingMeta, isError: errorMeta } = useMetaQuery();
  const { isLoading: loadingBenefs, isError: errorBenefs } = useBeneficiariesQuery();
  const { data: enrollmentsData, isLoading: loadingEnrollments, isError: errorEnrollments } = useJourneyEnrollmentsQuery();

  const journeys = useMemo(() => (journeysData || []) as Journey[], [journeysData]);
  const servicesList = (metaData?.services || []) as PublicService[];
  const filieresList = (metaData?.strategicValueChains || []) as StrategicValueChain[];
  const challengesList = (metaData?.challenges || []) as BusinessChallenge[];
  const ecosystemsList = (metaData?.ecosystems || []) as Ecosystem[];
  const transformationsList = (metaData?.transformationDimensions || []) as TransformationDimension[];
  const domainsList = (metaData?.strategicDomainDimensions || []) as StrategicDomainDimension[];
  const enrollments = useMemo(() => (enrollmentsData || []) as JourneyEnrollment[], [enrollmentsData]);

  const createMutation = useCreateJourneyMutation();
  const updateMutation = useUpdateJourneyMutation();
  const deleteMutation = useDeleteJourneyMutation();

  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [activeTab, setActiveTab] = useState<"models" | "active" | "relations" | "metadata">("models");
  const { isEntityTypeVisible } = usePerspective();

  // CRUD & Form States
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formId, setFormId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formProvider, setFormProvider] = useState("");
  const [formObjective, setFormObjective] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTargetAudience, setFormTargetAudience] = useState<string[]>([]);
  const [formFiliereIds, setFormFiliereIds] = useState<number[]>([]);
  const [formChallengeIds, setFormChallengeIds] = useState<number[]>([]);
  const [formEcosystemIds, setFormEcosystemIds] = useState<number[]>([]);
  const [formTransformationCodes, setFormTransformationCodes] = useState<string[]>([]);
  const [formDomainIds, setFormDomainIds] = useState<number[]>([]);

  // 6 steps service selections
  const [stepServices, setStepServices] = useState<Record<string, number[]>>({
    "Amorçage": [],
    "Diagnostic": [],
    "Coaching": [],
    "Planification": [],
    "Mise en œuvre": [],
    "Investissement": []
  });

  const [serviceSearch, setServiceSearch] = useState("");

  const isError = errorJourneys || errorMeta || errorBenefs || errorEnrollments;
  const isLoading = (loadingJourneys || loadingMeta || loadingBenefs || loadingEnrollments) && !isError;

  // Filter journeys based on perspective visibility
  const visibleJourneys = useMemo(() => {
    return journeys.filter(() => isEntityTypeVisible("journey"));
  }, [journeys, isEntityTypeVisible]);

  // Handle URL id query param selection & auto-selection
  useEffect(() => {
    if (visibleJourneys.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) {
        const found = visibleJourneys.find(j => String(j.id) === idParam);
        if (found) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedJourney(found);
          return;
        }
      }
      if (!selectedJourney) {
        setSelectedJourney(visibleJourneys[0]);
      }
    }
  }, [visibleJourneys, selectedJourney]);

  // Load journey data into form for editing
  const handleStartEdit = (j: Journey) => {
    setFormId(j.id);
    setFormName(j.name);
    setFormProvider(j.provider);
    setFormObjective(j.objective || "");
    setFormDescription(j.description || "");
    setFormTargetAudience(j.targetAudience || []);
    setFormFiliereIds((j.filieresS3 || []).map(f => f.id));
    setFormChallengeIds((j.challenges || []).map(c => c.id));
    setFormEcosystemIds((j.ecosystems || []).map(e => e.id));
    setFormTransformationCodes((j.transformationDimensions || []).map(t => t.code));
    setFormDomainIds((j.strategicDomains || []).map(d => d.id));

    // Map stages to steps
    const newStepServices: Record<string, number[]> = {
      "Amorçage": [],
      "Diagnostic": [],
      "Coaching": [],
      "Planification": [],
      "Mise en œuvre": [],
      "Investissement": []
    };
    (j.stages || []).forEach(stage => {
      if (newStepServices[stage.name] !== undefined) {
        newStepServices[stage.name] = stage.services.map(s => s.id);
      }
    });
    setStepServices(newStepServices);

    setIsEditing(true);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setFormId(null);
    setFormName("");
    setFormProvider("");
    setFormObjective("");
    setFormDescription("");
    setFormTargetAudience(["PME"]);
    setFormFiliereIds([]);
    setFormChallengeIds([]);
    setFormEcosystemIds([]);
    setFormTransformationCodes([]);
    setFormDomainIds([]);
    setStepServices({
      "Amorçage": [],
      "Diagnostic": [],
      "Coaching": [],
      "Planification": [],
      "Mise en œuvre": [],
      "Investissement": []
    });
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce parcours ? Cette action est irréversible et supprimera toutes ses étapes.")) {
      try {
        await deleteMutation.mutateAsync(id);
        alert("✅ Parcours supprimé avec succès.");
        if (selectedJourney?.id === id) {
          setSelectedJourney(null);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const handleToggleService = (stepName: string, serviceId: number) => {
    setStepServices(prev => {
      const current = prev[stepName] || [];
      const updated = current.includes(serviceId)
        ? current.filter(id => id !== serviceId)
        : [...current, serviceId];
      return { ...prev, [stepName]: updated };
    });
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  };

  const handleSave = async () => {
    if (!formName || !formProvider || !formObjective) {
      alert("⚠️ Le nom du parcours, le fournisseur et l'objectif sont obligatoires.");
      return;
    }

    const payload = {
      name: formName,
      provider: formProvider,
      objective: formObjective,
      description: formDescription,
      targetAudience: formTargetAudience,
      filiereIds: formFiliereIds,
      challengeIds: formChallengeIds,
      ecosystemIds: formEcosystemIds,
      transformationIds: formTransformationCodes,
      domainIds: formDomainIds,
      stages: Object.entries(stepServices).map(([name, ids], idx) => ({
        name,
        position: idx + 1,
        services: ids.map(id => ({ id }))
      }))
    };

    try {
      if (formId) {
        await updateMutation.mutateAsync({ id: formId, data: payload });
        alert("✅ Parcours mis à jour avec succès.");
      } else {
        await createMutation.mutateAsync(payload);
        alert("✅ Parcours créé avec succès.");
      }
      setIsEditing(false);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("❌ Une erreur est survenue lors de l'enregistrement.");
    }
  };

  // Helper mapping enrollments count
  const enrollmentsCount = useMemo(() => {
    const counts: Record<number, number> = {};
    enrollments.forEach((e) => {
      const jId = e.journeyId;
      counts[jId] = (counts[jId] || 0) + 1;
    });
    return counts;
  }, [enrollments]);

  if (isError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-red-650 uppercase">Erreur de chargement</h3>
        <p className="text-xs text-muted max-w-md">
          Impossible de charger les données du parcours. Le pool de connexion à la base de données est saturé ou le serveur est temporairement inaccessible.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des parcours de transformation...</p>
      </div>
    );
  }

  // --- FORMULAIRE D'EDITION / CREATION ---
  const renderForm = () => {
    const filteredFormServices = servicesList.filter(s => {
      if (!serviceSearch) return true;
      return s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
             s.code.toLowerCase().includes(serviceSearch.toLowerCase());
    });

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md p-6 space-y-6 animate-fadeIn text-left">
        <div className="flex justify-between items-center border-b border-gray-150 dark:border-gray-700 pb-3">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              {formId ? "Modifier le parcours territorial" : "Créer un nouveau parcours territorial"}
            </h3>
            <p className="text-xs text-muted mt-0.5">Renseignez les métadonnées et associez les services CPSV-AP aux 6 étapes types.</p>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}
            className="flex items-center gap-1 text-xs text-muted hover:text-text font-bold border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Metadata & Taxonomies */}
          <div className="lg:col-span-4 space-y-4 bg-gray-55 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block border-b border-gray-200 dark:border-gray-700 pb-1.5 select-none">
              Informations Générales
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom du Parcours *</label>
                <input
                  type="text"
                  placeholder="ex: Transition Énergétique PME"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Chef de file / Fournisseur *</label>
                <input
                  type="text"
                  placeholder="ex: Cluster Tweed / WE"
                  value={formProvider}
                  onChange={(e) => setFormProvider(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Objectif Stratégique *</label>
                <textarea
                  placeholder="ex: Réduire l'empreinte carbone et optimiser l'énergie"
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-255 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description Détaillée</label>
                <textarea
                  placeholder="Description du déroulé, cible, etc."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-255 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block border-b border-gray-200 dark:border-gray-700 pb-1.5 pt-2 select-none">
              Alignements Stratégiques S3
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Filières S3 Associées</label>
                <div className="max-h-[100px] overflow-y-auto border border-gray-250 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 space-y-1.5">
                  {filieresList.map(f => (
                    <label key={f.id} className="flex items-center gap-2 text-[10px] text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFiliereIds.includes(f.id)}
                        onChange={() => setFormFiliereIds(toggleArrayItem(formFiliereIds, f.id))}
                        className="w-3 h-3 accent-primary"
                      />
                      <span>{f.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{"Défis d'Affaires Associés"}</label>
                <div className="max-h-[100px] overflow-y-auto border border-gray-250 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 space-y-1.5">
                  {challengesList.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-[10px] text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formChallengeIds.includes(c.id)}
                        onChange={() => setFormChallengeIds(toggleArrayItem(formChallengeIds, c.id))}
                        className="w-3 h-3 accent-primary"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Écosystèmes Territoriaux</label>
                <div className="max-h-[100px] overflow-y-auto border border-gray-250 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 space-y-1.5">
                  {ecosystemsList.map(e => (
                    <label key={e.id} className="flex items-center gap-2 text-[10px] text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formEcosystemIds.includes(e.id)}
                        onChange={() => setFormEcosystemIds(toggleArrayItem(formEcosystemIds, e.id))}
                        className="w-3 h-3 accent-primary"
                      />
                      <span>{e.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">DR-BEST (Transformation)</label>
                <div className="max-h-[100px] overflow-y-auto border border-gray-250 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 space-y-1.5">
                  {transformationsList.map(t => (
                    <label key={t.code} className="flex items-center gap-2 text-[10px] text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formTransformationCodes.includes(t.code)}
                        onChange={() => setFormTransformationCodes(toggleArrayItem(formTransformationCodes, t.code))}
                        className="w-3 h-3 accent-primary"
                      />
                      <span>{t.code} - {t.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Domaines Stratégiques S3</label>
                <div className="max-h-[100px] overflow-y-auto border border-gray-250 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 space-y-1.5">
                  {domainsList.map(d => (
                    <label key={d.id} className="flex items-center gap-2 text-[10px] text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDomainIds.includes(d.id)}
                        onChange={() => setFormDomainIds(toggleArrayItem(formDomainIds, d.id))}
                        className="w-3 h-3 accent-primary"
                      />
                      <span>{d.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mapping Services */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-2.5">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider select-none">
                Sélection des Services CPSV-AP par Étape
              </span>
              <input
                type="text"
                placeholder="Filtrer les services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none w-full sm:w-48 text-text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
              {([
                "Amorçage",
                "Diagnostic",
                "Coaching",
                "Planification",
                "Mise en œuvre",
                "Investissement"
              ] as const).map(stepName => {
                const activeIds = stepServices[stepName] || [];

                return (
                  <div key={stepName} className="bg-gray-55 dark:bg-gray-900 p-3 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2 select-none">
                      {stepName} ({activeIds.length} associés)
                    </span>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 border border-gray-200/60 dark:border-gray-800 p-2 rounded-lg bg-white dark:bg-gray-950">
                      {filteredFormServices.map(service => {
                        const checked = activeIds.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className={cn(
                              "flex items-start gap-2 p-1.5 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-[10px] border",
                              checked
                                ? "border-primary/30 bg-primary/5 text-primary font-semibold"
                                : "border-transparent text-muted"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleService(stepName, service.id)}
                              className="mt-0.5 accent-primary w-3 h-3 shrink-0"
                            />
                            <div className="leading-tight">
                              <div className="font-semibold text-text">{service.name}</div>
                              <div className="text-[8px] text-muted-foreground">{service.organization?.name}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-150 dark:border-gray-800 pt-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition border-0 cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition shadow-sm border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Enregistrer le Parcours
          </button>
        </div>
      </div>
    );
  };

  // Shared dropdown selector for active, relations, and metadata tabs
  const renderJourneySelector = () => (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-150 dark:border-gray-800/80 shadow-xs mb-6 text-left">
      <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none">
        Parcours actif :
      </span>
      <select
        value={selectedJourney?.id || ""}
        onChange={(e) => {
          const found = visibleJourneys.find(j => String(j.id) === e.target.value);
          if (found) setSelectedJourney(found);
        }}
        className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs text-text focus:ring-1 focus:ring-purple-500 font-bold outline-none cursor-pointer"
      >
        {visibleJourneys.map(j => (
          <option key={j.id} value={j.id}>{j.name}</option>
        ))}
      </select>
    </div>
  );

  // Tab Options
  const tabOptions = [
    { id: "models", label: "Modèles de parcours", icon: Compass },
    { id: "active", label: "Parcours actifs", icon: Users },
    { id: "relations", label: "Relations", icon: Network },
    { id: "metadata", label: "Métadonnées", icon: Info }
  ];

  // Tab 2 content: Parcours actifs
  const activeTabContent = () => {
    if (!selectedJourney) return null;
    const activeEnrollments = enrollments.filter((e) => e.journeyId === selectedJourney.id);

    return (
      <div className="space-y-4">
        {renderJourneySelector()}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Suivi des Entreprises Engagées ({activeEnrollments.length})
            </h3>
          </div>

          {activeEnrollments.length > 0 ? (
            <div className="space-y-3">
              {activeEnrollments.map((e) => (
                <div 
                  key={e.id}
                  className="bg-gray-50/50 dark:bg-gray-900/30 border border-gray-150 dark:border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/25 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-text">{e.beneficiary?.name}</span>
                      <span className="text-[8px] font-bold bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-muted">
                        {e.beneficiary?.location}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted leading-tight">
                      Étape actuelle : <span className="font-semibold text-text">{e.currentStage?.name || "Initialisation"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right space-y-1">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full",
                        e.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" :
                        e.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {e.status}
                      </span>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${e.completionRate}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-text">{Math.round(e.completionRate)}%</span>
                      </div>
                    </div>
                    <a 
                      href={`/beneficiaries?id=${e.beneficiaryId}`}
                      className="p-1.5 rounded-lg hover:bg-gray-250 dark:hover:bg-gray-700 text-muted hover:text-purple-500 transition border-0 bg-transparent cursor-pointer"
                      title="Voir la fiche bénéficiaire"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-muted text-xs italic">
              {"Aucune entreprise wallonne n'est actuellement active sur ce parcours."}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab 3 content: Relations
  const relationsTabContent = () => {
    if (!selectedJourney) return null;
    const activeEnrollments = enrollments.filter((e) => e.journeyId === selectedJourney.id);
    const linkedServices = (selectedJourney.stages || []).flatMap(st => st.services || []);
    const linkedOrgs = Array.from(new Set(linkedServices.map(s => s.organization?.name).filter((name): name is string => !!name)));
    const linkedBenefs = activeEnrollments.map((e) => e.beneficiary?.name).filter((name): name is string => !!name);
    const linkedProjects = (selectedJourney.actionInstances || []).map((ai) => ai.title).filter((title): title is string => !!title);
    const linkedCapabilities = Array.from(new Set(linkedServices.flatMap(s => s.capabilities || []).map(c => c.name)));
    const linkedKnowledgeAssets = Array.from(new Set(linkedServices.flatMap(s => s.knowledgeAssets || []).map(a => a.title)));

    const relationSections = [
      {
        title: "Services CPSV-AP impliqués",
        items: linkedServices.map(s => ({
          id: s.id,
          title: s.name,
          relationType: `Code : ${s.code}`,
          Icon: FileText,
          onClick: () => window.location.href = `/services?id=${s.id}`
        }))
      },
      {
        title: "Opérateurs et Organisations impliqués",
        items: linkedOrgs.map((org: string, index: number) => ({
          id: index,
          title: org,
          relationType: "Opérateur de support",
          Icon: Building2
        }))
      },
      {
        title: "Entreprises bénéficiaires actives",
        items: linkedBenefs.map((ben: string, index: number) => ({
          id: index,
          title: ben,
          relationType: "PME accompagnée",
          Icon: Users
        }))
      },
      {
        title: "Programmes & Projets alignés",
        items: linkedProjects.map((p: string, index: number) => ({
          id: index,
          title: p,
          relationType: "Projet territorial",
          Icon: Layers
        }))
      },
      {
        title: "Filières S3 associées",
        items: (selectedJourney.filieresS3 || []).map(f => ({
          id: f.id,
          title: f.name,
          relationType: "Spécialisation intelligente",
          Icon: Network
        }))
      },
      {
        title: "Maillons de la chaîne de valeur",
        items: (selectedJourney.stagesTransverses || []).map(st => ({
          id: st.id,
          title: st.name,
          relationType: "Maillon de chaîne",
          Icon: Layers
        }))
      },
      {
        title: "Écosystèmes territoriaux (Clusters)",
        items: (selectedJourney.ecosystems || []).map(e => ({
          id: e.id,
          title: e.name,
          relationType: "Écosystème S3",
          Icon: Share2
        }))
      },
      {
        title: "DR-BEST (Axes de transformation)",
        items: (selectedJourney.transformationDimensions || []).map(t => ({
          id: t.code,
          title: t.name,
          relationType: "Transformation Dimension",
          Icon: Activity
        }))
      },
      {
        title: "Capabilités technologiques",
        items: linkedCapabilities.map((cap: string, index: number) => ({
          id: index,
          title: cap,
          relationType: "Compétence clé",
          Icon: Sparkles
        }))
      },
      {
        title: "Knowledge Assets générés/requis",
        items: linkedKnowledgeAssets.map((asset: string, index: number) => ({
          id: index,
          title: asset,
          relationType: "Actif de connaissance",
          Icon: Database
        }))
      }
    ];

    return (
      <div className="space-y-4">
        {renderJourneySelector()}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm text-left">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Cartographie du Territorial Knowledge Graph
            </h3>
          </div>
          <PITRelationsPanel sections={relationSections} />
        </div>
      </div>
    );
  };

  // Tab 4 content: Métadonnées
  const metadataTabContent = () => {
    if (!selectedJourney) return null;

    return (
      <div className="space-y-4">
        {renderJourneySelector()}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Métadonnées Techniques
            </h3>
          </div>
          <div className="bg-gray-50/50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-700 p-4 rounded-xl text-xs space-y-3 leading-relaxed">
            <p className="text-text">URI : <span className="font-mono text-purple-650 dark:text-purple-400 select-all">{selectedJourney.uri || `https://pit.wallonie.be/id/journey/${selectedJourney.id}`}</span></p>
            <p className="text-text">Classe RDF : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:JourneyTemplate</span></p>
            <p className="text-text">Chef de file : <span className="font-bold">{selectedJourney.provider}</span></p>
            <p className="text-text">Publics cibles : <span className="font-semibold">{selectedJourney.targetAudience?.join(", ") || "PME"}</span></p>
            <p className="text-text">{"Date d'encodage :"} <span className="font-medium">{selectedJourney.createdAt ? new Date(selectedJourney.createdAt).toLocaleDateString("fr-BE") : "N/A"}</span></p>
            <p className="text-text">Dernière mise à jour : <span className="font-medium">{selectedJourney.updatedAt ? new Date(selectedJourney.updatedAt).toLocaleDateString("fr-BE") : "N/A"}</span></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Parcours territoriaux"
      description="Modèles de parcours permettant d’organiser l’enchaînement des services, des acteurs et des étapes d’accompagnement au sein des écosystèmes territoriaux de Wallonie."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Parcours" }
      ]}
      tabs={
        !isEditing && !isCreating ? (
          <PITTabs
            tabs={tabOptions}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as "models" | "active" | "relations" | "metadata")}
          />
        ) : undefined
      }
    >
      {isEditing || isCreating ? (
        renderForm()
      ) : (
        <div className="w-full">
          {activeTab === "models" && (
            <JourneyModelsView
              journeys={visibleJourneys}
              selectedJourney={selectedJourney}
              setSelectedJourney={setSelectedJourney}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              onCreate={handleStartCreate}
              filieresList={filieresList}
              challengesList={challengesList}
              ecosystemsList={ecosystemsList}
              transformationsList={transformationsList}
              domainsList={domainsList}
              enrollmentsCount={enrollmentsCount}
            />
          )}
          {activeTab === "active" && activeTabContent()}
          {activeTab === "relations" && relationsTabContent()}
          {activeTab === "metadata" && metadataTabContent()}
        </div>
      )}
    </PITLayout>
  );
}
