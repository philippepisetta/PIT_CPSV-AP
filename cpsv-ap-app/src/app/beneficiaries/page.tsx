// src/app/beneficiaries/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Plus, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  FileCheck,
  TrendingUp,
  X,
  AlertCircle,
  Layers,
  HelpCircle,
  Network,
  Users,
  Search,
  BookOpen
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITForm, { FormSection } from "@/design-system/PITForm";
import SplitLayout from "@/components/ui/SplitLayout";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import { cn } from "@/lib/utils";
import { fetchWithCache, invalidateClientCache } from "@/lib/api";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";

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
}

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isEntityTypeVisible } = usePerspective();
  
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
  async function loadData(bypassCache = false) {
    try {
      if (bypassCache) {
        invalidateClientCache();
      }
      setLoading(true);
      const [bData, mData] = await Promise.all([
        fetchWithCache<Beneficiary[]>("/api/beneficiaries"),
        fetchWithCache<any>("/api/meta")
      ]);

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "new-beneficiary") {
        setShowAddForm(true);
      } else if (action === "new-delivery") {
        setShowDeliveryForm(true);
      }
    }
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
      
      await loadData(true);
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
      
      await loadData(true);
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Filtrer les bénéficiaires
  const filteredBeneficiaries = beneficiaries.filter(b => {
    if (!isEntityTypeVisible("beneficiary")) return false;

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary animate-pulse"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de la liste des bénéficiaires...</p>
      </div>
    );
  }

  // --- PANNEAU GAUCHE : LISTE DES ENTREPRISES ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1">
        Entreprises actives ({filteredBeneficiaries.length})
      </h3>
      <div className="space-y-2">
        {filteredBeneficiaries.map((b) => (
          <PITEntityCard
            key={b.id}
            title={b.name}
            description={`${b.location} (${b.province}) — ${b.size}`}
            icon={Building2}
            type="beneficiary"
            isSelected={selectedBeneficiary?.id === b.id}
            onClick={() => setSelectedBeneficiary(b)}
          />
        ))}
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

    // 1. Overview tab
    const overviewTab = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-glass/30 border border-muted/10 rounded-xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Informations d'établissement</span>
            <div className="space-y-1.5 mt-2">
              <p className="text-text">Ville : <span className="font-bold">{b.location}</span></p>
              <p className="text-text">Province : <span className="font-bold">{b.province}</span></p>
              <p className="text-text">BCE : <span className="font-bold font-mono">{b.bce || "Non renseigné"}</span></p>
            </div>
          </div>
          <div className="bg-glass/30 border border-muted/10 rounded-xl p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Indicateurs financiers</span>
            <div className="space-y-1.5 mt-2">
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
                  <span className="font-black text-teal-650">{axis.val} / 5</span>
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

    // 2. Relations Tab
    const relationSections = [
      {
        title: "Secteurs NACE d'Activité",
        items: (b.secondaryNaceSectors || []).map(s => ({
          id: s.id,
          title: s.name,
          relationType: `Code : ${s.code}`,
          Icon: Briefcase
        }))
      },
      {
        title: "Défis Stratégiques",
        items: (b.challenges || []).map(c => ({
          id: c.id,
          title: c.name,
          relationType: "Défi",
          Icon: HelpCircle
        }))
      },
      {
        title: "Filières Stratégiques (S3)",
        items: (b.filieresS3 || []).map(f => ({
          id: f.id,
          title: f.name,
          relationType: "Filière S3",
          Icon: Network
        }))
      },
      {
        title: "Maillons Opérationnels",
        items: (b.stages || []).map(s => ({
          id: s.id,
          title: `${s.name} (${s.category})`,
          relationType: "Maillon",
          Icon: Layers
        }))
      }
    ];

    const relationsTab = <PITRelationsPanel sections={relationSections} />;

    // 3. Activités (Accompagnements réels)
    const timelineItems: TimelineItem[] = (b.deliveries || []).map(d => {
      const descriptionContent = (
        <div className="space-y-2 text-[11px] mt-1.5">
          {d.outputReal && (
            <p><strong className="text-muted">Output :</strong> <span className="font-mono bg-surface/50 border border-muted/10 px-1 py-0.5 rounded">{d.outputReal}</span></p>
          )}
          {d.outcomeReal && (
            <p><strong className="text-muted">Outcome :</strong> {d.outcomeReal}</p>
          )}
          {d.impact && (
            <p><strong className="text-muted">Impact :</strong> <span className="bg-teal-500/10 text-teal-600 px-1.5 py-0.5 rounded font-bold">{d.impact}</span></p>
          )}
          {d.maturityDelta && typeof d.maturityDelta === 'object' && Object.keys(d.maturityDelta).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 border-t border-muted/5 pt-1">
              {Object.entries(d.maturityDelta).map(([axis, delta]: [string, any]) => (
                <span key={axis} className="px-1.5 py-0.2 bg-teal-500/5 text-teal-700 dark:text-teal-400 border border-teal-500/10 rounded text-[9px] font-bold">
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
          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold transition text-[11px] cursor-pointer border-0"
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

    // 4. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/beneficiary/{b.id}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:TerritorialBeneficiary</span></p>
        <p className="text-text">Arrondissement : <span className="font-bold">{b.arrondissement || "Namur"}</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={b.name}
        subtitle={`${b.size} — Arrondissement de ${b.arrondissement || "Namur"}`}
        badge={
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-450 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
            Bénéficiaire Territorial
          </span>
        }
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        impactTab={activityTab}
        metadataTab={metadataTab}
      />
    );
  };

  // Form Section definitions for creation
  const beneficiarySections: FormSection[] = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Identité de la PME",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Nom de l'organisation *</label>
              <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Numéro BCE</label>
              <input value={newBce} onChange={e => setNewBce(e.target.value)} type="text" placeholder="ex: 0400.123.456" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Type / Taille</label>
              <select value={newSize} onChange={e => setNewSize(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none">
                <option value="TPE">TPE</option>
                <option value="PME">PME</option>
                <option value="Grande Entreprise">Grande Entreprise</option>
                <option value="Startup">Startup</option>
                <option value="Indépendant">Indépendant</option>
                <option value="Centre de recherche">Centre de recherche</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Effectif (ETP)</label>
              <input value={newEmployees} onChange={e => setNewEmployees(e.target.value)} type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Chiffre d'affaires (€)</label>
              <input value={newRevenue} onChange={e => setNewRevenue(e.target.value)} type="number" step="any" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Ville / Localisation</label>
              <input required value={newLocation} onChange={e => setNewLocation(e.target.value)} type="text" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Province</label>
              <select value={newProvince} onChange={e => setNewProvince(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none">
                <option value="Namur">Namur</option>
                <option value="Liège">Liège</option>
                <option value="Hainaut">Hainaut</option>
                <option value="Brabant Wallon">Brabant Wallon</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Secteur Principal NACE</label>
              <select value={newPrimaryNaceId} onChange={e => setNewPrimaryNaceId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none">
                <option value="">Sélectionner</option>
                {meta.sectors.map(s => (
                  <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "alignment",
      title: "Alignements & Taxonomies S3",
      subtitle: "Filières et défis de la PME",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Demande / Problématique initiale</label>
            <textarea value={newDemand} onChange={e => setNewDemand(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-700 text-text outline-none h-16 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Défis Stratégiques</label>
              <select multiple value={selectedChallengeIds.map(String)} onChange={e => setSelectedChallengeIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] text-text outline-none h-24">
                {meta.challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Filières S3 associées</label>
              <select multiple value={selectedFiliereIds.map(String)} onChange={e => setSelectedFiliereIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] text-text outline-none h-24">
                {meta.strategicValueChains.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Maillons de chaîne de valeur</label>
            <select multiple value={selectedStageIds.map(String)} onChange={e => setSelectedStageIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] text-text outline-none h-24">
              {meta.stages.map(st => (
                <option key={st.id} value={st.id}>{st.name} ({st.category})</option>
              ))}
            </select>
          </div>
        </div>
      )
    },
    {
      id: "maturity",
      title: "Maturité Diagnostiquée",
      subtitle: "Scores de départ sur 5",
      fields: (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {maturityAxes.map((axis) => (
            <div key={axis.key} className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-muted block truncate" title={axis.label}>{axis.label}</label>
              <input 
                type="number" 
                min={1} 
                max={5} 
                value={axis.value} 
                onChange={e => handleMaturityChange(axis.key, Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))} 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-center text-xs text-text focus:ring-1 focus:ring-teal-700" 
              />
            </div>
          ))}
        </div>
      )
    }
  ];

  const deliverySections: FormSection[] = [
    {
      id: "general",
      title: "Opérateur & Service",
      subtitle: "Détails de l'intervention publique",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Service public dispensé *</label>
            <select required value={delServiceId} onChange={e => setDelServiceId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
              <option value="">Sélectionner</option>
              {meta.services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Opérateur (Organization) *</label>
              <select required value={delOperatorId} onChange={e => setDelOperatorId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="">Sélectionner</option>
                {meta.organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Statut de réalisation</label>
              <select value={delStatus} onChange={e => setDelStatus(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "outcomes",
      title: "Impacts & Résultats",
      subtitle: "Outputs et gains de performance",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Livrable Réel (Output)</label>
            <input type="text" placeholder="ex: Rapport d'audit de maturité" value={delOutput} onChange={e => setDelOutput(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Résultat Mesuré (Outcome)</label>
            <input type="text" placeholder="ex: 3 opportunités IA détectées" value={delOutcome} onChange={e => setDelOutcome(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Impact constaté</label>
            <input type="text" placeholder="ex: Gain de productivité de 15%" value={delImpactText} onChange={e => setDelImpactText(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
        </div>
      )
    },
    {
      id: "maturity_boost",
      title: "Évolution de Maturité",
      subtitle: "Gains sur l'axe de diagnostic",
      fields: (
        <div className="space-y-3">
          {delStatus === "Terminé" ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Axe</label>
                <select value={delMaturityAxis} onChange={e => setDelMaturityAxis(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                  <option value="digital">Digital</option>
                  <option value="ia">IA</option>
                  <option value="cyber">Cybersécurité</option>
                  <option value="export">Export</option>
                  <option value="durability">Durabilité</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Score avant</label>
                <input 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={delMaturityBefore} 
                  onChange={e => setDelMaturityBefore(parseInt(e.target.value) || 1)} 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-center text-xs text-text outline-none" 
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-muted block mb-1">Score après</label>
                <input 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={delMaturityAfter} 
                  onChange={e => setDelMaturityAfter(parseInt(e.target.value) || 2)} 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-center text-xs text-text outline-none" 
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted italic">L'évolution de la maturité est enregistrable uniquement pour les accompagnements terminés.</p>
          )}
        </div>
      )
    }
  ];

  return (
    <PITLayout
      category="BÉNÉFICIAIRES"
      title="Bénéficiaires Territoriaux"
      description="Gérez les profils des PME wallonnes, suivez l'évolution de leur maturité numérique et enregistrez leurs diagnostics et réalisations réelles de services publics."
      pageIcon={Users}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Bénéficiaires" }
      ]}
      actions={
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" /> Nouveau Bénéficiaire
        </button>
      }
    >
      <PITFilterBar
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted/25 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="absolute right-4 top-4 z-10">
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <PITForm
              title="Créer un Profil Bénéficiaire"
              sections={beneficiarySections}
              onSubmit={handleAddBeneficiary}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Enregistrer le bénéficiaire"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Bénéficiaires & BCE :</strong> Saisissez les données sémantiques de la PME.
                  </p>
                  <p>
                    L'alignement S3 de la PME se déduit de son secteur NACE principal et des filières sélectionnées.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      )}

      {/* MODAL ENREGISTREMENT DELIVERY */}
      {showDeliveryForm && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted/25 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="absolute right-4 top-4 z-10">
              <button onClick={() => setShowDeliveryForm(false)} className="p-1 rounded-lg hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <PITForm
              title="Enregistrer un accompagnement réel"
              sections={deliverySections}
              onSubmit={handleAddDelivery}
              onCancel={() => setShowDeliveryForm(false)}
              submitLabel="Enregistrer l'accompagnement"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Accompagnements réels :</strong> Déclarez un service public délivré à {selectedBeneficiary.name}.
                  </p>
                  <p>
                    Si l'accompagnement est complété, vous pouvez booster d'un point la maturité de la PME sur l'axe d'intervention correspondant.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      )}
    </PITLayout>
  );
}
