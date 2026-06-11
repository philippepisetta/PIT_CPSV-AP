// src/app/journeys/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Compass, 
  Building2, 
  ExternalLink, 
  HelpCircle, 
  Network, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ArrowLeft,
  Activity,
  Layers,
  TrendingUp,
  Database,
  Users,
  Sparkles,
  Share2
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import PITVirtualList from "@/design-system/PITVirtualList";
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
  description?: string;
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

export default function JourneysPage() {
  const { data: journeysData, isLoading: loadingJourneys } = useJourneysQuery();
  const { data: metaData, isLoading: loadingMeta } = useMetaQuery();
  const { data: beneficiariesData, isLoading: loadingBenefs } = useBeneficiariesQuery();
  const { data: enrollmentsData, isLoading: loadingEnrollments } = useJourneyEnrollmentsQuery();

  const journeys = (journeysData || []) as Journey[];
  const servicesList = (metaData?.services || []) as PublicService[];
  const filieresList = (metaData?.strategicValueChains || []) as StrategicValueChain[];
  const challengesList = (metaData?.challenges || []) as BusinessChallenge[];
  const ecosystemsList = (metaData?.ecosystems || []) as Ecosystem[];
  const transformationsList = (metaData?.transformationDimensions || []) as TransformationDimension[];
  const domainsList = (metaData?.strategicDomainDimensions || []) as StrategicDomainDimension[];
  const beneficiaries = beneficiariesData || [];
  const enrollments = enrollmentsData || [];

  const createMutation = useCreateJourneyMutation();
  const updateMutation = useUpdateJourneyMutation();
  const deleteMutation = useDeleteJourneyMutation();

  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const isLoading = loadingJourneys || loadingMeta || loadingBenefs || loadingEnrollments;

  // Handle URL id query param selection
  useEffect(() => {
    if (journeys.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) {
        const found = journeys.find(j => String(j.id) === idParam);
        if (found) {
          setSelectedJourney(found);
          return;
        }
      }
      if (!selectedJourney) {
        setSelectedJourney(journeys[0]);
      }
    }
  }, [journeys, selectedJourney]);

  // Filtered journeys list
  const filteredJourneys = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return journeys.filter(j => {
      if (!isEntityTypeVisible("journey")) return false;
      if (!q) return true;
      return j.name.toLowerCase().includes(q) || 
             j.provider.toLowerCase().includes(q) || 
             (j.objective && j.objective.toLowerCase().includes(q));
    });
  }, [journeys, searchQuery, isEntityTypeVisible]);

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

    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formName || !formProvider) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires (Nom, Fournisseur).");
      return;
    }

    const payloadStages = Object.entries(stepServices).map(([name, ids], index) => ({
      name,
      position: index + 1,
      services: ids.map(id => ({ id }))
    }));

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
      stages: payloadStages
    };

    try {
      if (formId) {
        await updateMutation.mutateAsync({ id: formId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsEditing(false);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("⚠️ Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("❌ Êtes-vous sûr de vouloir supprimer définitivement ce parcours ?")) {
      try {
        await deleteMutation.mutateAsync(id);
        if (selectedJourney?.id === id) {
          setSelectedJourney(null);
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Une erreur est survenue lors de la suppression.");
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

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des parcours de transformation...</p>
      </div>
    );
  }

  // --- PANNEAU GAUCHE : LISTE ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] flex flex-col">
      <div className="flex justify-between items-center pb-2 border-b border-muted/10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1">
          Parcours territoriaux ({filteredJourneys.length})
        </h3>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-[10px] font-bold transition shadow-xs cursor-pointer border-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau
        </button>
      </div>
      <div className="flex-1 min-h-0">
        {filteredJourneys.length > 0 ? (
          <PITVirtualList
            items={filteredJourneys}
            itemHeight={110}
            maxHeight="60vh"
            renderItem={(j) => (
              <div className="py-1 pr-1" style={{ height: "110px" }}>
                <PITEntityCard
                  title={j.name}
                  description={j.objective || "Aucun objectif défini"}
                  icon={Compass}
                  type="parcours"
                  subtitle={`Fournisseur : ${j.provider}`}
                  isSelected={selectedJourney?.id === j.id}
                  onClick={() => {
                    setSelectedJourney(j);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                />
              </div>
            )}
          />
        ) : (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun parcours ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ---
  const renderDetailPanel = () => {
    if (!selectedJourney) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez ou créez un parcours pour l'afficher.
        </div>
      );
    }

    const j = selectedJourney;

    // Filter active enrollments for this journey
    const activeEnrollments = enrollments.filter((e: any) => e.journeyId === j.id);

    // 1. Modèles de Parcours Tab (Overview / Timeline)
    const timelineItems: TimelineItem[] = (j.stages || []).map((stage) => {
      const servicesContent = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {(stage.services || []).map((service) => (
            <div 
              key={service.id} 
              className="rounded-xl border border-muted/20 bg-glass/25 p-3.5 space-y-2 flex flex-col justify-between hover:border-teal-500/20 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-[9px] text-muted">
                  <span className="font-mono bg-muted/10 px-1.5 py-0.2 rounded font-bold uppercase">{service.code}</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {service.organization?.name || "Opérateur"}
                  </span>
                </div>
                <h5 className="font-bold text-text text-[11px] mt-1.5 leading-snug">{service.name}</h5>
                {service.description && (
                  <p className="text-[10px] text-muted/80 line-clamp-2 mt-1 leading-normal">
                    {service.description}
                  </p>
                )}
              </div>
              
              <div className="pt-2 border-t border-muted/10 flex justify-end">
                <a
                  href={`/services?id=${service.id}`}
                  className="text-[9px] font-bold text-teal-650 dark:text-teal-400 flex items-center gap-1 hover:underline"
                >
                  Fiche service
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
          {(!stage.services || stage.services.length === 0) && (
            <div className="text-[10px] italic text-muted/65 p-2 bg-glass/10 border border-muted/5 rounded-xl col-span-2">
              Aucun service CPSV-AP associé à ce maillon.
            </div>
          )}
        </div>
      );

      return {
        id: stage.id,
        title: stage.name,
        subtitle: `Étape ${stage.position}`,
        description: servicesContent,
        Icon: Compass,
        color: "teal",
      };
    });

    const overviewTab = (
      <div className="space-y-6">
        {j.objective && (
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Objectif métier</h4>
            <p className="text-xs text-text italic">"{j.objective}"</p>
          </div>
        )}

        {j.description && (
          <div className="bg-glass/10 border border-muted/5 rounded-xl p-4 text-xs text-muted/95 leading-relaxed">
            {j.description}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5">
            Chemin d'accompagnement
          </h4>
          <Timeline
            items={timelineItems}
            emptyMessage="Aucun maillon configuré pour ce parcours."
          />
        </div>
      </div>
    );

    // 2. Parcours Actifs Tab (Enrolled companies)
    const activeTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5">
          Suivi des Entreprises Engagées ({activeEnrollments.length})
        </h4>

        {activeEnrollments.length > 0 ? (
          <div className="space-y-3">
            {activeEnrollments.map((e: any) => (
              <div 
                key={e.id}
                className="bg-glass/20 border border-muted/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-text">{e.beneficiary?.name}</span>
                    <span className="text-[8px] font-bold bg-muted/10 px-1.5 py-0.5 rounded text-muted">
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
                      <div className="w-16 h-1 bg-muted/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${e.completionRate}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-text">{Math.round(e.completionRate)}%</span>
                    </div>
                  </div>

                  <a 
                    href={`/beneficiaries?id=${e.beneficiaryId}`}
                    className="p-1.5 rounded-lg hover:bg-muted/20 text-muted hover:text-primary transition"
                    title="Voir la fiche bénéficiaire"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-glass/5 border border-dashed border-muted/10 rounded-xl text-muted text-xs italic">
            Aucune entreprise wallonne n'est actuellement active sur ce parcours.
          </div>
        )}
      </div>
    );

    // 3. Relations Tab (Territorial Knowledge Graph)
    const linkedServices = (j.stages || []).flatMap(st => st.services || []);
    const linkedOrgs = Array.from(new Set(linkedServices.map(s => s.organization?.name).filter(Boolean)));
    const linkedBenefs = activeEnrollments.map((e: any) => e.beneficiary?.name).filter(Boolean);
    const linkedProjects = (j.actionInstances || []).map((ai: any) => ai.title).filter(Boolean);
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
        items: linkedOrgs.map((org, index) => ({
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
        items: (j.filieresS3 || []).map(f => ({
          id: f.id,
          title: f.name,
          relationType: "Spécialisation intelligente",
          Icon: Network
        }))
      },
      {
        title: "Maillons de la chaîne de valeur",
        items: (j.stagesTransverses || []).map(st => ({
          id: st.id,
          title: st.name,
          relationType: "Maillon de chaîne",
          Icon: Layers
        }))
      },
      {
        title: "Écosystèmes territoriaux (Clusters)",
        items: (j.ecosystems || []).map(e => ({
          id: e.id,
          title: e.name,
          relationType: "Écosystème S3",
          Icon: Share2
        }))
      },
      {
        title: "DR-BEST (Axes de transformation)",
        items: (j.transformationDimensions || []).map(t => ({
          id: t.code,
          title: t.name,
          relationType: "Transformation Dimension",
          Icon: Activity
        }))
      },
      {
        title: "Capabilités technologiques",
        items: linkedCapabilities.map((cap, index) => ({
          id: index,
          title: cap,
          relationType: "Compétence clé",
          Icon: Sparkles
        }))
      },
      {
        title: "Knowledge Assets générés/requis",
        items: linkedKnowledgeAssets.map((asset, index) => ({
          id: index,
          title: asset,
          relationType: "Actif de connaissance",
          Icon: Database
        }))
      }
    ];

    const relationsTabPanel = <PITRelationsPanel sections={relationSections} />;

    // 4. Métadonnées Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">{j.uri || `https://pit.wallonie.be/id/journey/${j.id}`}</span></p>
        <p className="text-text">Classe RDF : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:JourneyTemplate</span></p>
        <p className="text-text">Chef de file : <span className="font-bold">{j.provider}</span></p>
        <p className="text-text">Publics cibles : <span className="font-semibold">{j.targetAudience?.join(", ") || "PME"}</span></p>
      </div>
    );

    const actionButtons = (
      <div className="flex gap-2">
        <button
          onClick={() => handleStartEdit(j)}
          className="p-1.5 rounded-lg hover:bg-muted/25 text-muted hover:text-primary transition cursor-pointer border-0 bg-transparent"
          title="Modifier le parcours"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(j.id)}
          className="p-1.5 rounded-lg hover:bg-muted/25 text-muted hover:text-red-500 transition cursor-pointer border-0 bg-transparent"
          title="Supprimer le parcours"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );

    return (
      <PITDetailLayout
        title={j.name}
        subtitle={`Parcours territorial par : ${j.provider}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Modèle de Parcours</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTabPanel}
        impactTab={activeTab}
        metadataTab={metadataTab}
        actions={actionButtons}
        overviewLabel="Modèle de parcours"
        impactLabel="Parcours actifs"
        relationsLabel="Relations"
        metadataLabel="Métadonnées"
      />
    );
  };

  // --- FORMULAIRE D'EDITION / CREATION ---
  const renderForm = () => {
    const filteredFormServices = servicesList.filter(s => {
      if (!serviceSearch) return true;
      return s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
             s.code.toLowerCase().includes(serviceSearch.toLowerCase());
    });

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-150 dark:border-gray-800 pb-3">
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
          <div className="lg:col-span-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-850">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block border-b border-gray-250 dark:border-gray-700 pb-1.5">
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
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description Détaillée</label>
                <textarea
                  placeholder="Description du déroulé, cible, etc."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block border-b border-gray-250 dark:border-gray-700 pb-1.5 pt-2">
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
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Défis d'affaires ciblés</label>
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
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
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
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
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
                                ? "border-primary/30 bg-primary/5 text-primary"
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
                              <div className="font-semibold">{service.name}</div>
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

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Parcours territoriaux"
      description="Modèles de parcours permettant d’organiser l’enchaînement des services, des acteurs et des étapes d’accompagnement au sein des écosystèmes territoriaux."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Parcours" }
      ]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un parcours par nom, fournisseur ou objectif..."
      />

      {isEditing || isCreating ? (
        renderForm()
      ) : (
        <SplitLayout
          leftPane={leftPane}
          rightPane={renderDetailPanel()}
          leftColSpan={4}
        />
      )}
    </PITLayout>
  );
}
