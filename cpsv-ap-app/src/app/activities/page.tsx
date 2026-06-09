// src/app/activities/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Plus, 
  Calendar, 
  Users, 
  Star, 
  Share2, 
  TrendingUp, 
  FileText, 
  X, 
  CheckCircle,
  HelpCircle,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  Compass
} from "lucide-react";

interface PublicService {
  id: number;
  name: string;
  code: string;
  interventionLevel?: {
    code: string;
    name: string;
  };
}

interface Organization {
  id: number;
  name: string;
  type: string;
}

interface Beneficiary {
  id: number;
  name: string;
}

interface ServiceDelivery {
  id: number;
  service: PublicService;
  beneficiary: Beneficiary;
  operator: Organization;
  status: string;
  date: string;
  outputReal?: string;
  outcomeReal?: string;
  impact?: string;
  maturityDelta?: any;
}

interface CollectiveDelivery {
  id: number;
  service: PublicService;
  title: string;
  date: string;
  operator: Organization;
  status: string;
  participantsCount: number;
  companiesCount: number;
  satisfactionScore?: number;
  leadsCount?: number;
  nextSteps?: string;
  companies: Beneficiary[];
  notes?: string;
}

interface SecondLineMission {
  id: number;
  service: PublicService;
  title: string;
  startDate: string;
  endDate?: string;
  status: string;
  leadOperator: Organization;
  operatorsMobilized: Organization[];
  collaborationsCount: number;
  deliverables?: string;
  territoryCovered?: string;
  notes?: string;
}

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<"individual" | "collective" | "secondline">("individual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données
  const [meta, setMeta] = useState<{
    services: PublicService[];
    organizations: Organization[];
    beneficiaries: Beneficiary[];
  }>({
    services: [],
    organizations: [],
    beneficiaries: []
  });
  const [individualDeliveries, setIndividualDeliveries] = useState<ServiceDelivery[]>([]);
  const [collectiveDeliveries, setCollectiveDeliveries] = useState<CollectiveDelivery[]>([]);
  const [secondLineMissions, setSecondLineMissions] = useState<SecondLineMission[]>([]);

  // Modals
  const [showCollForm, setShowCollForm] = useState(false);
  const [showSecForm, setShowSecForm] = useState(false);

  // Formulaire Collectif
  const [colServiceId, setColServiceId] = useState("");
  const [colTitle, setColTitle] = useState("");
  const [colDate, setColDate] = useState("");
  const [colOperatorId, setColOperatorId] = useState("");
  const [colStatus, setColStatus] = useState("COMPLETED");
  const [colParticipants, setColParticipants] = useState("0");
  const [colCompanies, setColCompanies] = useState("0");
  const [colSatisfaction, setColSatisfaction] = useState("5.0");
  const [colLeads, setColLeads] = useState("0");
  const [colNextSteps, setColNextSteps] = useState("");
  const [colSelectedCompanyIds, setColSelectedCompanyIds] = useState<number[]>([]);
  const [colNotes, setColNotes] = useState("");

  // Formulaire Deuxième ligne
  const [secServiceId, setSecServiceId] = useState("");
  const [secTitle, setSecTitle] = useState("");
  const [secStartDate, setSecStartDate] = useState("");
  const [secEndDate, setSecEndDate] = useState("");
  const [secStatus, setSecStatus] = useState("IN_PROGRESS");
  const [secLeadOperatorId, setSecLeadOperatorId] = useState("");
  const [secSelectedOperatorIds, setSecSelectedOperatorIds] = useState<number[]>([]);
  const [secCollabsCount, setSecCollabsCount] = useState("0");
  const [secDeliverables, setSecDeliverables] = useState("");
  const [secTerritory, setSecTerritory] = useState("Wallonie");
  const [secNotes, setSecNotes] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [metaRes, deliveryRes] = await Promise.all([
        fetch("/api/meta"),
        fetch("/api/service-deliveries")
      ]);

      if (!metaRes.ok || !deliveryRes.ok) {
        throw new Error("Erreur lors de la récupération des activités.");
      }

      const metaData = await metaRes.json();
      const deliveriesData = await deliveryRes.json();

      setMeta({
        services: metaData.services || [],
        organizations: metaData.organizations || [],
        beneficiaries: metaData.sectors ? metaData.sectors.reduce((acc: any[], s: any) => {
          s.primaryBeneficiaries?.forEach((b: any) => {
            if (!acc.some(exist => exist.id === b.id)) {
              acc.push({ id: b.id, name: b.name });
            }
          });
          return acc;
        }, []) : []
      });

      setIndividualDeliveries(deliveriesData);
      setCollectiveDeliveries(metaData.collectiveDeliveries || []);
      setSecondLineMissions(metaData.secondLineMissions || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Soumettre CollectiveDelivery
  async function handleAddCollective(e: React.FormEvent) {
    e.preventDefault();
    if (!colServiceId || !colTitle || !colOperatorId) {
      alert("Le service, le titre et l'opérateur sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/collective-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: parseInt(colServiceId),
          title: colTitle,
          date: colDate || null,
          operatorId: parseInt(colOperatorId),
          status: colStatus,
          participantsCount: parseInt(colParticipants) || 0,
          companiesCount: parseInt(colCompanies) || 0,
          satisfactionScore: colSatisfaction ? parseFloat(colSatisfaction) : null,
          leadsCount: parseInt(colLeads) || 0,
          nextSteps: colNextSteps || null,
          companyIds: colSelectedCompanyIds,
          notes: colNotes || null
        })
      });

      if (!res.ok) throw new Error("Erreur de sauvegarde de l'événement collectif.");
      
      // Reset
      setColServiceId("");
      setColTitle("");
      setColDate("");
      setColOperatorId("");
      setColStatus("COMPLETED");
      setColParticipants("0");
      setColCompanies("0");
      setColSatisfaction("5.0");
      setColLeads("0");
      setColNextSteps("");
      setColSelectedCompanyIds([]);
      setColNotes("");
      setShowCollForm(false);
      
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Soumettre SecondLineMission
  async function handleAddSecondLine(e: React.FormEvent) {
    e.preventDefault();
    if (!secServiceId || !secTitle || !secLeadOperatorId) {
      alert("Le service, le titre et l'opérateur principal sont obligatoires.");
      return;
    }

    try {
      const res = await fetch("/api/second-line-missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: parseInt(secServiceId),
          title: secTitle,
          startDate: secStartDate || null,
          endDate: secEndDate || null,
          status: secStatus,
          leadOperatorId: parseInt(secLeadOperatorId),
          operatorIds: secSelectedOperatorIds,
          collaborationsCount: parseInt(secCollabsCount) || 0,
          deliverables: secDeliverables || null,
          territoryCovered: secTerritory || null,
          notes: secNotes || null
        })
      });

      if (!res.ok) throw new Error("Erreur de sauvegarde de la mission de deuxième ligne.");

      // Reset
      setSecServiceId("");
      setSecTitle("");
      setSecStartDate("");
      setSecEndDate("");
      setSecStatus("IN_PROGRESS");
      setSecLeadOperatorId("");
      setSecSelectedOperatorIds([]);
      setSecCollabsCount("0");
      setSecDeliverables("");
      setSecTerritory("Wallonie");
      setSecNotes("");
      setShowSecForm(false);

      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du journal des activités...</p>
      </div>
    );
  }

  // Filtrer les services selon le niveau d'intervention pour les formulaires
  const collectiveServices = meta.services.filter(s => s.interventionLevel?.code === "COLLECTIVE");
  const secondLineServices = meta.services.filter(s => s.interventionLevel?.code === "SECOND_LINE");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent flex items-center gap-2">
            <Compass className="h-7 w-7 text-primary" />
            Suivi Opérationnel & Activités
          </h1>
          <p className="text-muted text-sm">
            Enregistrez et gérez les interventions à fort impact du territoire wallon : individuelles, collectives ou sémantiques.
          </p>
        </div>

        {/* Boutons d'ajout selon onglet */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab === "collective" && (
            <button 
              onClick={() => setShowCollForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold shadow-md hover:bg-emerald-600 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvel événement collectif
            </button>
          )}
          {activeTab === "secondline" && (
            <button 
              onClick={() => setShowSecForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 text-white font-semibold shadow-md hover:bg-purple-600 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvelle mission d'écosystème
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-muted">
        {[
          { id: "individual", label: "Accompagnements Individuels (Niveau 1)", count: individualDeliveries.length, color: "border-blue-500 text-blue-500" },
          { id: "collective", label: "Sessions Collectives (Niveau 2)", count: collectiveDeliveries.length, color: "border-emerald-500 text-emerald-500" },
          { id: "secondline", label: "Missions de Deuxième ligne (Niveau 3)", count: secondLineMissions.length, color: "border-purple-500 text-purple-500" },
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 -mb-[2px] ${
                isActive 
                  ? `${t.color} font-black`
                  : "border-transparent text-muted hover:text-text hover:border-muted"
              }`}
            >
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-glass font-bold" : "bg-muted/40 text-muted"
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      <div className="animate-in fade-in duration-300">
        {/* ONGLET 1 : INDIVIDUEL */}
        {activeTab === "individual" && (
          <div className="grid grid-cols-1 gap-6">
            {individualDeliveries.map((d) => (
              <div key={d.id} className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.02] blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                      {d.service?.name}
                    </span>
                    <h3 className="text-lg font-black text-text tracking-tight mt-1">
                      Accompagnement de : <strong className="text-primary">{d.beneficiary?.name}</strong>
                    </h3>
                    <p className="text-xs text-muted/80 flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Opérateur : {d.operator?.name} — Réalisé le {new Date(d.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start md:self-center ${
                    d.status === "COMPLETED" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                  }`}>
                    {d.status === "COMPLETED" ? "Terminé" : d.status === "IN_PROGRESS" ? "En cours" : "Planifié"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-muted/50 pt-4">
                  {d.outputReal && (
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-muted uppercase tracking-wider text-[10px]">Livrable réel (Output) :</span>
                      <p className="text-text bg-glass p-2.5 rounded-xl border border-muted/30 font-mono text-[11px]">{d.outputReal}</p>
                    </div>
                  )}
                  {d.outcomeReal && (
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-muted uppercase tracking-wider text-[10px]">Résultat réel (Outcome) :</span>
                      <p className="text-text bg-glass p-2.5 rounded-xl border border-muted/30 text-[11px]">{d.outcomeReal}</p>
                    </div>
                  )}
                </div>

                {d.maturityDelta && typeof d.maturityDelta === 'object' && Object.keys(d.maturityDelta).length > 0 && (
                  <div className="text-xs pt-3 border-t border-muted/30 flex flex-col gap-1.5">
                    <span className="font-bold text-muted uppercase tracking-wider text-[10px]">Impact sur la maturité du bénéficiaire :</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(d.maturityDelta).map(([axis, delta]: [string, any]) => {
                        const axisLabels: Record<string, string> = {
                          digital: "Digital",
                          ia: "IA",
                          cyber: "Cybersécurité",
                          export: "Export",
                          durability: "Durabilité"
                        };
                        return (
                          <span key={axis} className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg font-bold border border-blue-500/10 flex items-center gap-1.5 text-[11px]">
                            <span className="uppercase text-[9px] font-extrabold tracking-wider">{axisLabels[axis] || axis}</span>
                            <span className="opacity-70">{delta?.before}</span>
                            <span className="text-blue-500/50">➔</span>
                            <span className="text-emerald-500 font-extrabold">{delta?.after}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 2 : COLLECTIF */}
        {activeTab === "collective" && (
          <div className="grid grid-cols-1 gap-6">
            {collectiveDeliveries.map((d) => (
              <div key={d.id} className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-[0.02] blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {d.service?.name} (Animation)
                    </span>
                    <h3 className="text-lg font-black text-text tracking-tight mt-1">
                      {d.title}
                    </h3>
                    <p className="text-xs text-muted/80 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Organisé par : {d.operator?.name} — Date : {new Date(d.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start md:self-center ${
                    d.status === "COMPLETED" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                  }`}>
                    {d.status === "COMPLETED" ? "Réalisé" : d.status === "OPEN_FOR_REGISTRATION" ? "Inscriptions ouvertes" : "Planifié"}
                  </span>
                </div>

                {/* KPIs Collectifs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-muted/50 pt-4 text-center">
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block">{d.participantsCount}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Participants</span>
                  </div>
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block">{d.companiesCount}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Entreprises</span>
                  </div>
                  <div className="bg-glass rounded-xl p-3 border border-muted/30 flex flex-col justify-center items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-black text-text">{d.satisfactionScore || "—"}</span>
                      {d.satisfactionScore && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Satisfaction / 5</span>
                  </div>
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block">{d.leadsCount || 0}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Leads initiés</span>
                  </div>
                </div>

                {d.nextSteps && (
                  <div className="text-xs space-y-1 bg-glass p-3 border border-muted/30 rounded-xl">
                    <span className="font-bold text-muted uppercase tracking-wider text-[9px]">Plan de suivi / Suites données :</span>
                    <p className="text-text mt-0.5 italic">"{d.nextSteps}"</p>
                  </div>
                )}

                {d.companies && d.companies.length > 0 && (
                  <div className="text-xs pt-2 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-muted uppercase tracking-wider text-[9px]">Entreprises identifiées :</span>
                    {d.companies.map(c => (
                      <span key={c.id} className="px-2 py-0.5 bg-surface border border-muted rounded text-[10px] font-semibold text-text">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {collectiveDeliveries.length === 0 && (
              <div className="text-center py-12 text-sm text-muted italic bg-surface border border-muted border-dashed rounded-2xl p-6">
                Aucun événement collectif enregistré pour le moment.
              </div>
            )}
          </div>
        )}

        {/* ONGLET 3 : DEUXIEME LIGNE */}
        {activeTab === "secondline" && (
          <div className="grid grid-cols-1 gap-6">
            {secondLineMissions.map((d) => (
              <div key={d.id} className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 opacity-[0.02] blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">
                      {d.service?.name} (Mission d'Écosystème)
                    </span>
                    <h3 className="text-lg font-black text-text tracking-tight mt-1">
                      {d.title}
                    </h3>
                    <p className="text-xs text-muted/80 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      Opérateur porteur : {d.leadOperator?.name} — Démarrée le {new Date(d.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start md:self-center ${
                    d.status === "COMPLETED" ? "bg-emerald-500/15 text-emerald-500" : "bg-purple-500/15 text-purple-500"
                  }`}>
                    {d.status === "COMPLETED" ? "Terminé" : d.status === "IN_PROGRESS" ? "En cours" : "Planifié"}
                  </span>
                </div>

                {/* KPIs Deuxième ligne Grid */}
                <div className="grid grid-cols-3 gap-4 border-t border-muted/50 pt-4 text-center">
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block">{d.operatorsMobilized?.length + 1}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Acteurs mobilisés</span>
                  </div>
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block">{d.collaborationsCount}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Collaborations créées</span>
                  </div>
                  <div className="bg-glass rounded-xl p-3 border border-muted/30">
                    <span className="text-2xl font-black text-text block truncate" title={d.territoryCovered || "Wallonie"}>
                      {d.territoryCovered || "Wallonie"}
                    </span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Couverture</span>
                  </div>
                </div>

                {d.deliverables && (
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-muted uppercase tracking-wider text-[9px] block">Référentiels / Livrables produits :</span>
                    <p className="text-text bg-glass p-2.5 rounded-xl border border-muted/30 font-mono text-[11px] leading-relaxed">
                      {d.deliverables}
                    </p>
                  </div>
                )}

                {d.operatorsMobilized && d.operatorsMobilized.length > 0 && (
                  <div className="text-xs pt-2 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-muted uppercase tracking-wider text-[9px]">Opérateurs impliqués :</span>
                    {d.operatorsMobilized.map(op => (
                      <span key={op.id} className="px-2 py-0.5 bg-surface border border-muted rounded text-[10px] font-semibold text-text">
                        {op.name} ({op.type})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {secondLineMissions.length === 0 && (
              <div className="text-center py-12 text-sm text-muted italic bg-surface border border-muted border-dashed rounded-2xl p-6">
                Aucune mission de deuxième ligne enregistrée pour le moment.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal d'ajout Collectif */}
      {showCollForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Enregistrer une Session Collective
              </h3>
              <button onClick={() => setShowCollForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollective} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Service / Intervention collectif *</label>
                <select required value={colServiceId} onChange={e => setColServiceId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                  <option value="">Sélectionnez le service collectif...</option>
                  {collectiveServices.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                  {collectiveServices.length === 0 && (
                    <option disabled value="">Aucun service collectif dans le catalogue</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Titre de la session / événement *</label>
                <input required value={colTitle} onChange={e => setColTitle(e.target.value)} type="text" placeholder="ex: Workshop IA Agroalimentaire Liège" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Opérateur / Animateur *</label>
                  <select required value={colOperatorId} onChange={e => setColOperatorId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="">Sélectionnez l'acteur...</option>
                    {meta.organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.type})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Date de session</label>
                  <input value={colDate} onChange={e => setColDate(e.target.value)} type="date" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Audience (Partic.)</label>
                  <input value={colParticipants} onChange={e => setColParticipants(e.target.value)} type="number" className="w-full bg-glass border border-muted rounded-lg p-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Entreprises touc.</label>
                  <input value={colCompanies} onChange={e => setColCompanies(e.target.value)} type="number" className="w-full bg-glass border border-muted rounded-lg p-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Satisfaction (0-5)</label>
                  <input value={colSatisfaction} onChange={e => setColSatisfaction(e.target.value)} type="number" min={0} max={5} step="0.1" className="w-full bg-glass border border-muted rounded-lg p-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Leads initiés</label>
                  <input value={colLeads} onChange={e => setColLeads(e.target.value)} type="number" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Statut</label>
                  <select value={colStatus} onChange={e => setColStatus(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="PLANNED">Planifié</option>
                    <option value="OPEN_FOR_REGISTRATION">Inscriptions ouvertes</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé / Réalisé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Entreprises participantes de la PIT</label>
                <div className="border border-muted rounded-lg p-2.5 max-h-24 overflow-y-auto space-y-1 bg-glass">
                  {meta.beneficiaries.map(b => (
                    <label key={b.id} className="flex items-center space-x-2 text-xs">
                      <input 
                        type="checkbox"
                        checked={colSelectedCompanyIds.includes(b.id)}
                        onChange={e => {
                          if (e.target.checked) setColSelectedCompanyIds([...colSelectedCompanyIds, b.id]);
                          else setColSelectedCompanyIds(colSelectedCompanyIds.filter(id => id !== b.id));
                        }}
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Plan d'action / Prochaines étapes</label>
                <textarea value={colNextSteps} onChange={e => setColNextSteps(e.target.value)} placeholder="ex: Programmer les diagnostics individuels..." className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-16" />
              </div>

              <div className="border-t border-muted pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowCollForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all">
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

      {/* Modal d'ajout Deuxième ligne */}
      {showSecForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-500" />
                Enregistrer une Mission d'Écosystème
              </h3>
              <button onClick={() => setShowSecForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSecondLine} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Service / Mission de deuxième ligne *</label>
                <select required value={secServiceId} onChange={e => setSecServiceId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                  <option value="">Sélectionnez la mission de référence...</option>
                  {secondLineServices.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                  {secondLineServices.length === 0 && (
                    <option disabled value="">Aucun service de 2e ligne dans le catalogue</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Nom / Titre de la mission *</label>
                <input required value={secTitle} onChange={e => setSecTitle(e.target.value)} type="text" placeholder="ex: Coordination du Cluster IA Wallon" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Opérateur porteur principal *</label>
                  <select required value={secLeadOperatorId} onChange={e => setSecLeadOperatorId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="">Sélectionnez le lead...</option>
                    {meta.organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.type})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Date de début</label>
                  <input value={secStartDate} onChange={e => setSecStartDate(e.target.value)} type="date" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Collaborations créées</label>
                  <input value={secCollabsCount} onChange={e => setSecCollabsCount(e.target.value)} type="number" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Couverture géographique</label>
                  <input value={secTerritory} onChange={e => setSecTerritory(e.target.value)} type="text" placeholder="ex: Wallonie, Hainaut" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Date de fin (optionnelle)</label>
                  <input value={secEndDate} onChange={e => setSecEndDate(e.target.value)} type="date" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Statut de la mission</label>
                  <select value={secStatus} onChange={e => setSecStatus(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="PLANNED">Planifié</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Opérateurs mobilisés (Sélection multiple)</label>
                <div className="border border-muted rounded-lg p-2.5 max-h-24 overflow-y-auto space-y-1 bg-glass">
                  {meta.organizations.map(o => (
                    <label key={o.id} className="flex items-center space-x-2 text-xs">
                      <input 
                        type="checkbox"
                        checked={secSelectedOperatorIds.includes(o.id)}
                        onChange={e => {
                          if (e.target.checked) setSecSelectedOperatorIds([...secSelectedOperatorIds, o.id]);
                          else setSecSelectedOperatorIds(secSelectedOperatorIds.filter(id => id !== o.id));
                        }}
                      />
                      <span>{o.name} ({o.type})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Livrables / Référentiels produits</label>
                <textarea value={secDeliverables} onChange={e => setSecDeliverables(e.target.value)} placeholder="ex: Production du guide méthodologique..." className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-16" />
              </div>

              <div className="border-t border-muted pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowSecForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-500 text-white rounded-xl font-bold shadow-md hover:bg-purple-600 transition-all">
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
