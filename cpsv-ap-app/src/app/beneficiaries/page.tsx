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
  Layers
} from "lucide-react";

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
  
  // Scores maturité formulaire
  const [mDigital, setMDigital] = useState(1);
  const [mIa, setMIa] = useState(1);
  const [mCyber, setMCyber] = useState(1);
  const [mExport, setMExport] = useState(1);
  const [mDurability, setMDurability] = useState(1);

  // Formulaire ServiceDelivery
  const [delServiceId, setDelServiceId] = useState("");
  const [delOperatorId, setDelOperatorId] = useState("");
  const [delStatus, setDelStatus] = useState("Terminé");
  const [delOutput, setDelOutput] = useState("");
  const [delOutcome, setDelOutcome] = useState("");
  const [delImpactText, setDelImpactText] = useState("");
  
  // Changement de maturité dans la livraison
  const [delMaturityAxis, setDelMaturityAxis] = useState("ia"); // 'digital', 'ia', 'cyber', 'export', 'durability'
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
        // Mettre à jour le bénéficiaire sélectionné
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

    // Préparer les deltas de maturité structurés (Ajustement 3)
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

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de la liste des bénéficiaires...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
            Catalogue des Bénéficiaires
          </h1>
          <p className="text-muted text-sm">
            Gérez le profil des PME wallonnes, analysez leur maturité et enregistrez leurs réalisations de services.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-primary/95 transition-all text-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nouveau Bénéficiaire
        </button>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar : Liste des bénéficiaires (4/12 col) */}
        <section className="lg:col-span-4 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[70vh] overflow-y-auto" aria-label="Liste des bénéficiaires">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2">Entreprises actives</h2>
          <div className="space-y-1">
            {beneficiaries.map((b) => {
              const isSelected = selectedBeneficiary?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBeneficiary(b)}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <Building2 className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{b.name}</p>
                    <p className="text-xs text-muted/80 truncate">{b.location} ({b.province}) — {b.size}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Panel : Fiche détaillée (8/12 col) */}
        <section className="lg:col-span-8 space-y-8" aria-label="Détail du bénéficiaire">
          {selectedBeneficiary ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Header de la Fiche */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary to-amber-500 opacity-[0.02] blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                      {selectedBeneficiary.size}
                    </span>
                    <h2 className="text-2xl font-black text-text tracking-tight mt-1">{selectedBeneficiary.name}</h2>
                    <p className="text-xs text-muted flex items-center gap-1.5 mt-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedBeneficiary.location}, Province de {selectedBeneficiary.province}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted/90 space-y-1">
                    <p>BCE : <span className="font-bold text-text">{selectedBeneficiary.bce || "Non spécifié"}</span></p>
                    <p>Effectif : <span className="font-bold text-text">{selectedBeneficiary.employees || "Non spécifié"} ETP</span></p>
                    <p>CA : <span className="font-bold text-text">
                      {selectedBeneficiary.revenue ? `${selectedBeneficiary.revenue.toLocaleString()} €` : "Non spécifié"}
                    </span></p>
                  </div>
                </div>

                {selectedBeneficiary.primaryNaceSector && (
                  <div className="pt-3 border-t border-muted text-xs text-muted/90 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>Secteur principal : <strong>{selectedBeneficiary.primaryNaceSector.code}</strong> — {selectedBeneficiary.primaryNaceSector.name}</span>
                    </div>
                    {selectedBeneficiary.secondaryNaceSectors && selectedBeneficiary.secondaryNaceSectors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pl-6 text-muted/80">
                        <span className="font-semibold text-[11px] uppercase tracking-wider">Secteurs secondaires :</span>
                        {selectedBeneficiary.secondaryNaceSectors.map(s => (
                          <span key={s.id} className="px-1.5 py-0.5 rounded bg-surface border border-muted text-muted font-mono text-[11px]" title={s.name}>
                            {s.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {selectedBeneficiary.demand && (
                  <div className="bg-glass rounded-xl p-3 border border-muted/50 text-xs mt-3">
                    <p className="font-bold text-muted mb-1">Demande initiale :</p>
                    <p className="italic text-text/95">"{selectedBeneficiary.demand}"</p>
                  </div>
                )}
              </div>

              {/* Grid 2 colonnes : Maturité & Référentiels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Maturité Jauges */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm border-b border-muted pb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Scores de Maturité (Évaluation 1 à 5)
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { label: "Maturité Digitale", val: selectedBeneficiary.maturityDigital, color: "from-blue-500 to-indigo-500" },
                      { label: "Maturité IA", val: selectedBeneficiary.maturityIa, color: "from-purple-500 to-pink-500" },
                      { label: "Maturité Cybersécurité", val: selectedBeneficiary.maturityCyber, color: "from-red-500 to-rose-500" },
                      { label: "Maturité Export", val: selectedBeneficiary.maturityExport, color: "from-amber-500 to-orange-500" },
                      { label: "Maturité Durabilité", val: selectedBeneficiary.maturityDurability, color: "from-emerald-500 to-teal-500" },
                    ].map((m, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted">{m.label}</span>
                          <span className="text-text font-bold">{m.val} / 5</span>
                        </div>
                        <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${m.color} rounded-full`} 
                            style={{ width: `${(m.val / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Référentiels rattachés */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm border-b border-muted pb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-500" />
                    Référentiels & Alignements Sémantiques
                  </h3>
                  
                  <div className="space-y-3.5 text-xs">
                    {/* Défis */}
                    <div className="space-y-1.5">
                      <p className="font-bold text-muted">Défis d'affaires adressés :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBeneficiary.challenges.map(c => (
                          <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10">
                            {c.name}
                          </span>
                        ))}
                        {selectedBeneficiary.challenges.length === 0 && <span className="text-muted italic">Aucun défi associé</span>}
                      </div>
                    </div>

                    {/* Filières S3 */}
                    <div className="space-y-1.5">
                      <p className="font-bold text-muted">Filières S3 associées :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBeneficiary.filieresS3.map(f => (
                          <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10">
                            {f.name}
                          </span>
                        ))}
                        {selectedBeneficiary.filieresS3.length === 0 && <span className="text-muted italic">Aucune filière associée</span>}
                      </div>
                    </div>

                    {/* Maillons de la chaîne */}
                    <div className="space-y-1.5">
                      <p className="font-bold text-muted">Maillons d'activité transversaux :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBeneficiary.stages.map(s => (
                          <span key={s.id} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/10">
                            {s.name} <span className="opacity-60">({s.category})</span>
                          </span>
                        ))}
                        {selectedBeneficiary.stages.length === 0 && <span className="text-muted italic">Aucun maillon associé</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique opérationnel (ServiceDelivery) */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-muted pb-3">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-emerald-500" />
                    Réalisations Opérationnelles (Services Consommés)
                  </h3>
                  <button
                    onClick={() => setShowDeliveryForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Enregistrer un service
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedBeneficiary.deliveries && selectedBeneficiary.deliveries.length > 0 ? (
                    selectedBeneficiary.deliveries.map((d) => (
                      <div key={d.id} className="rounded-xl border border-muted bg-glass p-4 space-y-3 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-primary">{d.service?.name}</span>
                            <p className="text-xs text-muted/80 mt-0.5">Fournisseur : {d.operator?.name} — Réalisé le {new Date(d.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full self-start md:self-center ${
                            d.status === "Terminé" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                          }`}>
                            {d.status}
                          </span>
                        </div>

                        {d.outputReal && (
                          <div className="text-xs">
                            <span className="font-bold text-muted">Livrable réel (Output) :</span>
                            <p className="text-text mt-0.5 bg-surface/50 p-2 rounded border border-muted/20 font-mono">{d.outputReal}</p>
                          </div>
                        )}

                        {d.outcomeReal && (
                          <div className="text-xs">
                            <span className="font-bold text-muted">Résultat réel (Outcome) :</span>
                            <p className="text-text mt-0.5 bg-surface/50 p-2 rounded border border-muted/20">{d.outcomeReal}</p>
                          </div>
                        )}

                        {d.impact && (
                          <div className="text-xs flex items-center gap-2">
                            <span className="font-bold text-muted">Impact constaté :</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold border border-emerald-500/10">
                              {d.impact}
                            </span>
                          </div>
                        )}

                        {d.maturityDelta && typeof d.maturityDelta === 'object' && Object.keys(d.maturityDelta).length > 0 && (
                          <div className="text-xs pt-2 border-t border-muted/30 flex flex-col gap-1">
                            <span className="font-bold text-muted">Impact de maturité :</span>
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                              {Object.entries(d.maturityDelta).map(([axis, delta]: [string, any]) => {
                                const axisLabels: Record<string, string> = {
                                  digital: "Digital",
                                  ia: "IA",
                                  cyber: "Cybersécurité",
                                  export: "Export",
                                  durability: "Durabilité"
                                };
                                return (
                                  <span key={axis} className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold border border-blue-500/10 flex items-center gap-1.5 text-[11px]">
                                    <span className="uppercase text-[9px] font-extrabold tracking-wider">{axisLabels[axis] || axis}</span>
                                    <span className="opacity-75">{delta?.before}</span>
                                    <span className="text-blue-500/75">➔</span>
                                    <span className="text-emerald-500 font-extrabold">{delta?.after}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-muted italic">
                      Aucune réalisation de service enregistrée pour le moment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Veuillez sélectionner ou ajouter un bénéficiaire.
            </div>
          )}
        </section>
      </div>

      {/* Modal d'ajout de Bénéficiaire */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text">Ajouter un Bénéficiaire territorial</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Nom de l'organisation *</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Numéro BCE</label>
                  <input value={newBce} onChange={e => setNewBce(e.target.value)} type="text" placeholder="ex: 0400.123.456" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Type / Taille</label>
                  <select value={newSize} onChange={e => setNewSize(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="TPE">TPE</option>
                    <option value="PME">PME</option>
                    <option value="Grande Entreprise">Grande Entreprise</option>
                    <option value="Startup">Startup</option>
                    <option value="Indépendant">Indépendant</option>
                    <option value="Centre de recherche">Centre de recherche</option>
                    <option value="Commune">Commune</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Effectif (ETP)</label>
                  <input value={newEmployees} onChange={e => setNewEmployees(e.target.value)} type="number" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Chiffre d'affaires (€)</label>
                  <input value={newRevenue} onChange={e => setNewRevenue(e.target.value)} type="number" step="any" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Ville / Localisation</label>
                  <input required value={newLocation} onChange={e => setNewLocation(e.target.value)} type="text" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Province</label>
                  <select value={newProvince} onChange={e => setNewProvince(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="Namur">Namur</option>
                    <option value="Liège">Liège</option>
                    <option value="Hainaut">Hainaut</option>
                    <option value="Brabant Wallon">Brabant Wallon</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Secteur NACE Principal</label>
                  <select value={newPrimaryNaceId} onChange={e => setNewPrimaryNaceId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="">Sélectionnez un secteur...</option>
                    {meta.sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Demande ou besoin initial</label>
                <textarea value={newDemand} onChange={e => setNewDemand(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-20" />
              </div>

              {/* Sélection Référentiels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Défis à relever (Challenges)</label>
                  <div className="border border-muted rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-glass">
                    {meta.challenges.map(c => (
                      <label key={c.id} className="flex items-center space-x-2 text-xs">
                        <input 
                          type="checkbox"
                          checked={selectedChallengeIds.includes(c.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedChallengeIds([...selectedChallengeIds, c.id]);
                            else setSelectedChallengeIds(selectedChallengeIds.filter(id => id !== c.id));
                          }}
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Filières S3 associées</label>
                  <div className="border border-muted rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-glass">
                    {meta.strategicValueChains.map(f => (
                      <label key={f.id} className="flex items-center space-x-2 text-xs">
                        <input 
                          type="checkbox"
                          checked={selectedFiliereIds.includes(f.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedFiliereIds([...selectedFiliereIds, f.id]);
                            else setSelectedFiliereIds(selectedFiliereIds.filter(id => id !== f.id));
                          }}
                        />
                        <span>{f.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Secteurs NACE Secondaires</label>
                  <div className="border border-muted rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-glass">
                    {meta.sectors.map(s => (
                      <label key={s.id} className="flex items-center space-x-2 text-xs">
                        <input 
                          type="checkbox"
                          checked={selectedSecondaryNaceIds.includes(s.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedSecondaryNaceIds([...selectedSecondaryNaceIds, s.id]);
                            else setSelectedSecondaryNaceIds(selectedSecondaryNaceIds.filter(id => id !== s.id));
                          }}
                        />
                        <span>{s.code} — {s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sélection des maillons */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Maillons transverses impliqués</label>
                <div className="border border-muted rounded-lg p-2.5 max-h-32 overflow-y-auto space-y-1 bg-glass grid grid-cols-2 gap-2">
                  {meta.stages.map(st => (
                    <label key={st.id} className="flex items-center space-x-2 text-xs">
                      <input 
                        type="checkbox"
                        checked={selectedStageIds.includes(st.id)}
                        onChange={e => {
                          if (e.target.checked) setSelectedStageIds([...selectedStageIds, st.id]);
                          else setSelectedStageIds(selectedStageIds.filter(id => id !== st.id));
                        }}
                      />
                      <span className="truncate" title={`${st.name} (${st.category})`}>
                        {st.name} <span className="opacity-60">({st.category})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Maturités de base */}
              <div className="space-y-2 border-t border-muted pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Maturité Initiale (1 à 5)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {[
                    { label: "Digital", val: mDigital, set: setMDigital },
                    { label: "IA", val: mIa, set: setMIa },
                    { label: "Cyber", val: mCyber, set: setMCyber },
                    { label: "Export", val: mExport, set: setMExport },
                    { label: "Durabilité", val: mDurability, set: setMDurability }
                  ].map((axis, i) => (
                    <div key={i} className="space-y-1">
                      <label className="font-semibold">{axis.label}</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={axis.val} 
                        onChange={e => axis.set(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))} 
                        className="w-full bg-glass border border-muted rounded-lg p-1.5 text-center focus:outline-none focus:border-primary text-text" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-muted pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/95 transition-all">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'enregistrement de ServiceDelivery */}
      {showDeliveryForm && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-500" />
                Enregistrer un accompagnement réel
              </h3>
              <button onClick={() => setShowDeliveryForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDelivery} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Service public dispensé *</label>
                <select required value={delServiceId} onChange={e => setDelServiceId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                  <option value="">Sélectionnez le service...</option>
                  {meta.services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Conseiller / Opérateur (Organization) *</label>
                  <select required value={delOperatorId} onChange={e => setDelOperatorId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="">Sélectionnez l'acteur...</option>
                    {meta.organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.type})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Statut de réalisation</label>
                  <select value={delStatus} onChange={e => setDelStatus(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Livrable réel fourni (Output)</label>
                <input value={delOutput} onChange={e => setDelOutput(e.target.value)} type="text" placeholder="ex: Rapport PDF du 12/06/2026" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Résultat réel constaté (Outcome)</label>
                <textarea value={delOutcome} onChange={e => setDelOutcome(e.target.value)} placeholder="ex: 3 cas d'usage IA identifiés + PoC recommandé" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-16" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Description de l'impact</label>
                <input value={delImpactText} onChange={e => setDelImpactText(e.target.value)} type="text" placeholder="ex: maturité IA passée de 1 à 2" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
              </div>

              {/* Ajustement 3 : Tracking de maturité Before/After */}
              {delStatus === "Terminé" && (
                <div className="bg-glass border border-muted/50 rounded-xl p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <AlertCircle className="h-4 w-4" />
                    Impact d'évolution de la maturité
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-muted">Axe de maturité</label>
                      <select value={delMaturityAxis} onChange={e => setDelMaturityAxis(e.target.value)} className="w-full bg-surface border border-muted rounded p-1.5 text-text">
                        <option value="digital">Digital</option>
                        <option value="ia">IA</option>
                        <option value="cyber">Cybersécurité</option>
                        <option value="export">Export</option>
                        <option value="durability">Durabilité</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-muted">Score avant</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={delMaturityBefore} 
                        onChange={e => setDelMaturityBefore(parseInt(e.target.value) || 1)} 
                        className="w-full bg-surface border border-muted rounded p-1 text-center text-text" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-muted">Score après</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={5} 
                        value={delMaturityAfter} 
                        onChange={e => setDelMaturityAfter(parseInt(e.target.value) || 2)} 
                        className="w-full bg-surface border border-muted rounded p-1 text-center text-text" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-muted pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowDeliveryForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-all">
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
