// src/app/beneficiaries/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Plus, 
  MapPin, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  FileCheck,
  TrendingUp,
  X,
  AlertCircle,
  Layers,
  HelpCircle,
  Network,
  Users,
  Calendar,
  Sparkles,
  Search,
  BookOpen
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import ReferenceSelector from "@/components/ui/ReferenceSelector";
import MultiTagSelector from "@/components/ui/MultiTagSelector";
import MaturitySelector from "@/components/ui/MaturitySelector";
import OutcomeEditor from "@/components/ui/OutcomeEditor";
import { cn } from "@/lib/utils";


interface NaceSector {
  id: number;
  code: string;
  name: string;
}

interface StrategicValueChain {
  id: number;
  name: string;
}

interface ValueChainStage {
  id: number;
  name: string;
  category: string;
}

interface BusinessChallenge {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
}

interface PublicService {
  id: number;
  name: string;
}

interface ServiceDelivery {
  id: number;
  service: PublicService;
  status: string;
  date: string;
  operator: Organization;
  outputReal?: string;
  outcomeReal?: string;
  impact?: string;
  maturityBefore?: any;
  maturityAfter?: any;
  maturityDelta?: any;
}

interface Beneficiary {
  id: number;
  name: string;
  bce: string;
  size: string;
  employees: number;
  revenue: number;
  location: string;
  province: string;
  arrondissement: string;
  demand?: string;
  primaryNaceSector?: NaceSector;
  secondaryNaceSectors: NaceSector[];
  challenges: BusinessChallenge[];
  filieresS3: StrategicValueChain[];
  stages: ValueChainStage[];
  maturityDigital: number;
  maturityIa: number;
  maturityCyber: number;
  maturityExport: number;
  maturityDurability: number;
  deliveries: ServiceDelivery[];
  roadmapLogs?: any[];
}

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Métadonnées
  const [meta, setMeta] = useState<{
    sectors: NaceSector[];
    strategicValueChains: StrategicValueChain[];
    stages: ValueChainStage[];
    challenges: BusinessChallenge[];
    organizations: Organization[];
    services: PublicService[];
  }>({
    sectors: [],
    strategicValueChains: [],
    stages: [],
    challenges: [],
    organizations: [],
    services: []
  });

  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulaire Beneficiary
  const [newName, setNewName] = useState("");
  const [newBce, setNewBce] = useState("");
  const [newSize, setNewSize] = useState("PME");
  const [newEmployees, setNewEmployees] = useState("");
  const [newRevenue, setNewRevenue] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newProvince, setNewProvince] = useState("Namur");
  const [newDemand, setNewDemand] = useState("");
  const [newPrimaryNaceId, setNewPrimaryNaceId] = useState("");
  const [selectedSecondaryNaceIds, setSelectedSecondaryNaceIds] = useState<number[]>([]);
  const [selectedChallengeIds, setSelectedChallengeIds] = useState<number[]>([]);
  const [selectedFiliereIds, setSelectedFiliereIds] = useState<number[]>([]);
  const [selectedStageIds, setSelectedStageIds] = useState<number[]>([]);
  
  // Scores maturité
  const [maturityAxes, setMaturityAxes] = useState([
    { key: "digital", label: "Maturité Digitale", value: 1 },
    { key: "ia", label: "Maturité IA", value: 1 },
    { key: "cyber", label: "Maturité Cybersécurité", value: 1 },
    { key: "export", label: "Maturité Export", value: 1 },
    { key: "durability", label: "Maturité Durabilité", value: 1 }
  ]);

  const handleMaturityChange = (key: string, value: number) => {
    setMaturityAxes(prev => prev.map(a => a.key === key ? { ...a, value } : a));
  };

  // Formulaire ServiceDelivery
  const [delServiceId, setDelServiceId] = useState("");
  const [delOperatorId, setDelOperatorId] = useState("");
  const [delStatus, setDelStatus] = useState("Terminé");
  const [delOutput, setDelOutput] = useState("");
  const [delOutcome, setDelOutcome] = useState("");
  const [delImpactText, setDelImpactText] = useState("");
  
  // Changement de maturité dans la livraison
  const [delMaturityAxis, setDelMaturityAxis] = useState("ia");
  const [delMaturityBefore, setDelMaturityBefore] = useState(1);
  const [delMaturityAfter, setDelMaturityAfter] = useState(2);

  // Charger les données
  async function loadData() {
    try {
      setLoading(true);
      const [bRes, mRes] = await Promise.all([
        fetch("/api/beneficiaries"),
        fetch("/api/meta")
      ]);

      if (!bRes.ok || !mRes.ok) throw new Error("Erreur de récupération des données.");
      
      const bData = await bRes.json();
      const mData = await mRes.json();

      setBeneficiaries(bData);
      setMeta({
        sectors: mData.sectors || [],
        strategicValueChains: mData.strategicValueChains || [],
        stages: mData.stages || [],
        challenges: mData.challenges || [],
        organizations: mData.organizations || [],
        services: mData.services || []
      });

      if (bData.length > 0 && !selectedBeneficiary) {
        setSelectedBeneficiary(bData[0]);
      } else if (selectedBeneficiary) {
        const updated = bData.find((b: Beneficiary) => b.id === selectedBeneficiary.id);
        if (updated) setSelectedBeneficiary(updated);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Soumettre un nouveau Bénéficiaire
  async function handleAddBeneficiary(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newLocation) {
      alert("Le nom et la localisation sont requis.");
      return;
    }

    const mDigital = maturityAxes.find(a => a.key === "digital")?.value || 1;
    const mIa = maturityAxes.find(a => a.key === "ia")?.value || 1;
    const mCyber = maturityAxes.find(a => a.key === "cyber")?.value || 1;
    const mExport = maturityAxes.find(a => a.key === "export")?.value || 1;
    const mDurability = maturityAxes.find(a => a.key === "durability")?.value || 1;

    try {
      const response = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          bce: newBce || null,
          size: newSize,
          employees: newEmployees ? parseInt(newEmployees) : null,
          revenue: newRevenue ? parseFloat(newRevenue) : null,
          location: newLocation,
          province: newProvince,
          demand: newDemand || null,
          primaryNaceSectorId: newPrimaryNaceId ? parseInt(newPrimaryNaceId) : null,
          secondaryNaceSectorIds: selectedSecondaryNaceIds,
          challengeIds: selectedChallengeIds,
          filiereS3Ids: selectedFiliereIds,
          stageIds: selectedStageIds,
          maturityDigital: mDigital,
          maturityIa: mIa,
          maturityCyber: mCyber,
          maturityExport: mExport,
          maturityDurability: mDurability
        })
      });

      if (!response.ok) throw new Error("Erreur lors de la création.");
      
      // Réinitialisation
      setNewName("");
      setNewBce("");
      setNewEmployees("");
      setNewRevenue("");
      setNewLocation("");
      setNewDemand("");
      setNewPrimaryNaceId("");
      setSelectedSecondaryNaceIds([]);
      setSelectedChallengeIds([]);
      setSelectedFiliereIds([]);
      setSelectedStageIds([]);
      setMaturityAxes([
        { key: "digital", label: "Maturité Digitale", value: 1 },
        { key: "ia", label: "Maturité IA", value: 1 },
        { key: "cyber", label: "Maturité Cybersécurité", value: 1 },
        { key: "export", label: "Maturité Export", value: 1 },
        { key: "durability", label: "Maturité Durabilité", value: 1 }
      ]);
      setShowAddForm(false);
      
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Soumettre un ServiceDelivery (Livraison de service réelle)
  async function handleAddDelivery(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBeneficiary || !delServiceId || !delOperatorId) {
      alert("Veuillez sélectionner un service et un opérateur.");
      return;
    }

    const maturityBefore: Record<string, number> = {};
    const maturityAfter: Record<string, number> = {};
    const maturityDelta: Record<string, any> = {};

    if (delStatus === "Terminé") {
      maturityBefore[delMaturityAxis] = delMaturityBefore;
      maturityAfter[delMaturityAxis] = delMaturityAfter;
      maturityDelta[delMaturityAxis] = { before: delMaturityBefore, after: delMaturityAfter };
    }

    try {
      const response = await fetch("/api/service-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiaryId: selectedBeneficiary.id,
          serviceId: parseInt(delServiceId),
          status: delStatus,
          operatorId: parseInt(delOperatorId),
          outputReal: delOutput || null,
          outcomeReal: delOutcome || null,
          impact: delImpactText || null,
          maturityBefore: delStatus === "Terminé" ? maturityBefore : null,
          maturityAfter: delStatus === "Terminé" ? maturityAfter : null,
          maturityDelta: delStatus === "Terminé" ? maturityDelta : null
        })
      });

      if (!response.ok) throw new Error("Erreur de sauvegarde de l'accompagnement.");
      
      setDelServiceId("");
      setDelOutput("");
      setDelOutcome("");
      setDelImpactText("");
      setShowDeliveryForm(false);
      
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Filtrer les bénéficiaires
  const filteredBeneficiaries = beneficiaries.filter(b => {
    const term = searchQuery.toLowerCase();
    return b.name.toLowerCase().includes(term) || 
           b.location.toLowerCase().includes(term) || 
           b.province.toLowerCase().includes(term) || 
           b.primaryNaceSector?.name.toLowerCase().includes(term) ||
           b.primaryNaceSector?.code.toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de la liste des bénéficiaires...</p>
      </div>
    );
  }

  // --- PANNEAU GAUCHE : LISTE DES ENTREPRISES ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2">
        Entreprises actives ({filteredBeneficiaries.length})
      </h3>
      <div className="space-y-1.5">
        {filteredBeneficiaries.map((b) => {
          const isSelected = selectedBeneficiary?.id === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBeneficiary(b)}
              className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected 
                  ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" 
                  : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <Building2 className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
              <div className="truncate flex-1">
                <p className="font-bold text-sm truncate">{b.name}</p>
                <p className="text-xs text-muted/80 truncate mt-0.5">{b.location} ({b.province}) — {b.size}</p>
              </div>
            </button>
          );
        })}
        {filteredBeneficiaries.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun bénéficiaire ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedBeneficiary) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un bénéficiaire dans la liste pour voir sa fiche détaillée.
        </div>
      );
    }

    const b = selectedBeneficiary;

    // 1. Onglet Overview
    const overviewTab = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-glass/30 border border-muted/10 rounded-xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Informations d'établissement</span>
            <div className="space-y-1 mt-1.5">
              <p className="text-text">Ville : <span className="font-bold">{b.location}</span></p>
              <p className="text-text">Province : <span className="font-bold">{b.province}</span></p>
              <p className="text-text">BCE : <span className="font-bold">{b.bce || "Non renseigné"}</span></p>
            </div>
          </div>
          <div className="bg-glass/30 border border-muted/10 rounded-xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Indicateurs financiers</span>
            <div className="space-y-1 mt-1.5">
              <p className="text-text">Effectif : <span className="font-bold">{b.employees || "—"} ETP</span></p>
              <p className="text-text">Chiffre d'Affaires : <span className="font-bold">{b.revenue ? `${b.revenue.toLocaleString()} €` : "—"}</span></p>
              <p className="text-text">Secteur Principal NACE : <span className="font-bold">{b.primaryNaceSector?.code || "—"}</span></p>
            </div>
          </div>
        </div>

        {b.demand && (
          <div className="bg-glass/20 border border-muted/20 rounded-xl p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Besoin / Demande Initiale</h4>
            <p className="text-xs text-text/95 italic leading-relaxed">"{b.demand}"</p>
          </div>
        )}

        {/* Maturités */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5">
            Diagnostic de Maturité Actuel
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Maturité Digitale", val: b.maturityDigital, color: "bg-blue-500" },
              { label: "Maturité IA", val: b.maturityIa, color: "bg-purple-500" },
              { label: "Maturité Cybersécurité", val: b.maturityCyber, color: "bg-rose-500" },
              { label: "Maturité Export", val: b.maturityExport, color: "bg-amber-500" },
              { label: "Maturité Durabilité", val: b.maturityDurability, color: "bg-emerald-500" }
            ].map((axis, i) => (
              <div key={i} className="space-y-1.5 bg-glass/20 border border-muted/10 p-3 rounded-xl">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text">{axis.label}</span>
                  <span className="font-black text-teal-600 dark:text-teal-400">{axis.val} / 5</span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", axis.color)} style={{ width: `${(axis.val / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // 2. Onglet Relations
    const relationsTab = (
      <div className="space-y-4">
        {/* NACE Sectors */}
        {b.secondaryNaceSectors && b.secondaryNaceSectors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Secteurs NACE d'Activité</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {b.secondaryNaceSectors.map(s => (
                <RelationshipCard
                  key={s.id}
                  title={s.name}
                  relationType={`Code : ${s.code}`}
                  Icon={Briefcase}
                />
              ))}
            </div>
          </div>
        )}

        {/* Challenges */}
        {b.challenges && b.challenges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Défis Stratégiques</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {b.challenges.map(c => (
                <RelationshipCard
                  key={c.id}
                  title={c.name}
                  relationType="Défi"
                  Icon={HelpCircle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filières S3 */}
        {b.filieresS3 && b.filieresS3.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Filières Stratégiques (S3)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {b.filieresS3.map(f => (
                <RelationshipCard
                  key={f.id}
                  title={f.name}
                  relationType="Filière S3"
                  Icon={Network}
                />
              ))}
            </div>
          </div>
        )}

        {/* Maillons */}
        {b.stages && b.stages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Maillons Opérationnels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {b.stages.map(s => (
                <RelationshipCard
                  key={s.id}
                  title={`${s.name} (${s.category})`}
                  relationType="Maillon de valeur"
                  Icon={Layers}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );

    // 3. Onglet Activités (Historique Deliveries)
    const timelineItems: TimelineItem[] = (b.deliveries || []).map(d => {
      const descriptionContent = (
        <div className="space-y-2 text-[11px]">
          {d.outputReal && (
            <p><strong className="text-muted">Output :</strong> <span className="font-mono bg-surface/50 border border-muted/10 px-1 py-0.5 rounded">{d.outputReal}</span></p>
          )}
          {d.outcomeReal && (
            <p><strong className="text-muted">Outcome :</strong> {d.outcomeReal}</p>
          )}
          {d.impact && (
            <p><strong className="text-muted">Impact :</strong> <span className="bg-teal-500/10 text-teal-600 px-1 py-0.5 rounded font-bold">{d.impact}</span></p>
          )}
          {d.maturityDelta && typeof d.maturityDelta === 'object' && Object.keys(d.maturityDelta).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 border-t border-muted/5 pt-1">
              {Object.entries(d.maturityDelta).map(([axis, delta]: [string, any]) => (
                <span key={axis} className="px-1.5 py-0.2 bg-teal-500/5 text-teal-600 dark:text-teal-400 border border-teal-500/10 rounded text-[9px] font-bold">
                  {axis.toUpperCase()} : {delta?.before} ➔ {delta?.after}
                </span>
              ))}
            </div>
          )}
        </div>
      );

      return {
        id: d.id,
        title: d.service?.name || "Service public",
        subtitle: `Opérateur : ${d.operator?.name || "Non spécifié"}`,
        date: new Date(d.date).toLocaleDateString(),
        description: descriptionContent,
        badge: (
          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
            d.status === "Terminé" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}>
            {d.status}
          </span>
        ),
        Icon: FileCheck,
        color: d.status === "Terminé" ? "teal" : "amber"
      };
    });

    const activityTab = (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-muted/10 pb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Suivi des Accompagnements Réels
          </h4>
          <button
            onClick={() => setShowDeliveryForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition text-[11px] cursor-pointer border-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Enregistrer un service
          </button>
        </div>

        <Timeline
          items={timelineItems}
          emptyMessage="Aucun service public n'a encore été délivré à ce bénéficiaire."
        />
      </div>
    );

    // 4. Onglet Metadata
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 space-y-3.5 text-xs">
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">ID Unique Système</span>
          <span className="font-mono text-text text-xs">{b.id}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">URI Sémantique</span>
          <span className="font-mono text-xs text-teal-600 dark:text-teal-400 break-all">
            https://pit.wallonie.be/id/beneficiary/{b.id}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Classe Ontologique</span>
          <span className="font-mono text-xs text-text bg-glass border border-muted/20 px-1.5 py-0.5 rounded">
            d4wmo:TerritorialBeneficiary
          </span>
        </div>
      </div>
    );

    return (
      <EntityDetailPanel
        title={b.name}
        subtitle={`${b.size} — Arrondissement de ${b.arrondissement || "Namur"}`}
        badge={
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
            Bénéficiaire Territorial
          </span>
        }
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        activityTab={activityTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bénéficiaires Territoriaux"
        description="Gérez les profils des PME wallonnes, suivez l'évolution de leur maturité numérique et enregistrez leurs diagnostics et réalisations réelles de services publics."
        Icon={Users}
        actions={
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            Nouveau Bénéficiaire
          </button>
        }
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une PME par nom, ville, province ou code NACE..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT BENEFICIAIRE */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text">Créer un profil Bénéficiaire</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Nom de l'organisation *</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Numéro BCE (Banquec Carrefour)</label>
                  <input value={newBce} onChange={e => setNewBce(e.target.value)} type="text" placeholder="ex: 0400.123.456" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Type / Taille</label>
                  <select value={newSize} onChange={e => setNewSize(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
                    <option value="TPE">TPE</option>
                    <option value="PME">PME</option>
                    <option value="Grande Entreprise">Grande Entreprise</option>
                    <option value="Startup">Startup</option>
                    <option value="Indépendant">Indépendant</option>
                    <option value="Centre de recherche">Centre de recherche</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Effectif (ETP)</label>
                  <input value={newEmployees} onChange={e => setNewEmployees(e.target.value)} type="number" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Chiffre d'affaires (€)</label>
                  <input value={newRevenue} onChange={e => setNewRevenue(e.target.value)} type="number" step="any" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Ville / Localisation</label>
                  <input required value={newLocation} onChange={e => setNewLocation(e.target.value)} type="text" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Province</label>
                  <select value={newProvince} onChange={e => setNewProvince(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
                    <option value="Namur">Namur</option>
                    <option value="Liège">Liège</option>
                    <option value="Hainaut">Hainaut</option>
                    <option value="Brabant Wallon">Brabant Wallon</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
                <ReferenceSelector
                  label="Secteur NACE Principal"
                  value={newPrimaryNaceId}
                  onChange={setNewPrimaryNaceId}
                  options={meta.sectors.map(s => ({ id: s.id, name: `${s.code} — ${s.name}` }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Demande ou besoin initial</label>
                <textarea value={newDemand} onChange={e => setNewDemand(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text h-16" />
              </div>

              {/* Tag selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MultiTagSelector
                  label="Défis à relever"
                  options={meta.challenges}
                  selectedIds={selectedChallengeIds}
                  onChange={setSelectedChallengeIds}
                  color="blue"
                />
                <MultiTagSelector
                  label="Filières S3 associées"
                  options={meta.strategicValueChains}
                  selectedIds={selectedFiliereIds}
                  onChange={setSelectedFiliereIds}
                  color="amber"
                />
                <MultiTagSelector
                  label="NACE Secondaires"
                  options={meta.sectors.map(s => ({ id: s.id, name: `${s.code} — ${s.name}` }))}
                  selectedIds={selectedSecondaryNaceIds}
                  onChange={setSelectedSecondaryNaceIds}
                  color="teal"
                />
              </div>

              <MultiTagSelector
                label="Maillons de chaîne transverses"
                options={meta.stages.map(st => ({ id: st.id, name: `${st.name} (${st.category})` }))}
                selectedIds={selectedStageIds}
                onChange={setSelectedStageIds}
                color="purple"
              />

              <MaturitySelector
                axes={maturityAxes}
                onChange={handleMaturityChange}
              />

              <div className="border-t border-muted/20 pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all cursor-pointer bg-transparent">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md hover:bg-teal-700 transition-all cursor-pointer border-0">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ENREGISTREMENT DELIVERY */}
      {showDeliveryForm && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-teal-600" />
                Enregistrer un accompagnement réel
              </h3>
              <button onClick={() => setShowDeliveryForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDelivery} className="space-y-4">
              <ReferenceSelector
                label="Service public dispensé *"
                value={delServiceId}
                onChange={setDelServiceId}
                options={meta.services}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <ReferenceSelector
                  label="Conseiller / Opérateur (Organization) *"
                  value={delOperatorId}
                  onChange={setDelOperatorId}
                  options={meta.organizations}
                  required
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Statut de réalisation</label>
                  <select value={delStatus} onChange={e => setDelStatus(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors">
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>
              </div>

              <OutcomeEditor
                outputReal={delOutput}
                onOutputChange={setDelOutput}
                outcomeReal={delOutcome}
                onOutcomeChange={setDelOutcome}
                impactText={delImpactText}
                onImpactChange={setDelImpactText}
              />

              {delStatus === "Terminé" && (
                <div className="bg-glass border border-muted/30 rounded-xl p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                    <AlertCircle className="h-4 w-4" />
                    Impact d'évolution de la maturité
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-muted">Axe</label>
                      <select value={delMaturityAxis} onChange={e => setDelMaturityAxis(e.target.value)} className="w-full bg-glass border border-muted/30 rounded px-2 py-1 text-text">
                        <option value="digital">Digital</option>
                        <option value="ia">IA</option>
                        <option value="cyber">Cybersécurité</option>
                        <option value="export">Export</option>
                        <option value="durability">Durabilité</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-muted">Score avant</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={delMaturityBefore} 
                        onChange={e => setDelMaturityBefore(parseInt(e.target.value) || 1)} 
                        className="w-full bg-glass border border-muted/30 rounded px-2 py-1 text-center text-text" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-muted">Score après</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={delMaturityAfter} 
                        onChange={e => setDelMaturityAfter(parseInt(e.target.value) || 2)} 
                        className="w-full bg-glass border border-muted/30 rounded px-2 py-1 text-center text-text" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-muted/20 pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowDeliveryForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all cursor-pointer bg-transparent">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md hover:bg-teal-700 transition-all cursor-pointer border-0">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
