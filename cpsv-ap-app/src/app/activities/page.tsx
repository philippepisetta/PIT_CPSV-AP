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
  Compass,
  FileCheck,
  Award,
  Link2,
  Info
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import ReferenceSelector from "@/components/ui/ReferenceSelector";
import MultiTagSelector from "@/components/ui/MultiTagSelector";
import OutcomeEditor from "@/components/ui/OutcomeEditor";
import { fetchWithCache, invalidateClientCache } from "@/lib/api";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Selection states
  const [selectedIndividual, setSelectedIndividual] = useState<ServiceDelivery | null>(null);
  const [selectedCollective, setSelectedCollective] = useState<CollectiveDelivery | null>(null);
  const [selectedSecondLine, setSelectedSecondLine] = useState<SecondLineMission | null>(null);

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

  async function loadData(bypassCache = false) {
    try {
      if (bypassCache) {
        invalidateClientCache();
      }
      setLoading(true);
      const [metaData, deliveriesData] = await Promise.all([
        fetchWithCache<any>("/api/meta"),
        fetchWithCache<ServiceDelivery[]>("/api/service-deliveries")
      ]);

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

      if (deliveriesData.length > 0) setSelectedIndividual(deliveriesData[0]);
      if (metaData.collectiveDeliveries?.length > 0) setSelectedCollective(metaData.collectiveDeliveries[0]);
      if (metaData.secondLineMissions?.length > 0) setSelectedSecondLine(metaData.secondLineMissions[0]);

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
      if (action === "new-collective") {
        setActiveTab("collective");
        setShowCollForm(true);
      } else if (action === "new-mission") {
        setActiveTab("secondline");
        setShowSecForm(true);
      }
    }
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
      
      await loadData(true);
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

      setSecServiceId("");
      setSecTitle("");
      setSecStartDate("");
      setSecEndDate("");
      setSecStatus("IN_PROGRESS");
      setSecLeadOperatorId("");
      setSecSelectedOperatorIds([]);
      setSecCollabsCount("0");
      setSecDeliverables("");
      setSecNotes("");
      setShowSecForm(false);

      await loadData(true);
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Filtrer les données selon recherche
  const filterList = (list: any[], keyName: string) => {
    return list.filter(item => {
      const query = searchQuery.toLowerCase();
      if (keyName === "individual") {
        return item.service?.name.toLowerCase().includes(query) || 
               item.beneficiary?.name.toLowerCase().includes(query) || 
               item.operator?.name.toLowerCase().includes(query);
      } else if (keyName === "collective") {
        return item.title.toLowerCase().includes(query) || 
               item.service?.name.toLowerCase().includes(query) || 
               item.operator?.name.toLowerCase().includes(query);
      } else {
        return item.title.toLowerCase().includes(query) || 
               item.service?.name.toLowerCase().includes(query) || 
               item.leadOperator?.name.toLowerCase().includes(query);
      }
    });
  };

  const filteredIndividual = filterList(individualDeliveries, "individual");
  const filteredCollective = filterList(collectiveDeliveries, "collective");
  const filteredSecondLine = filterList(secondLineMissions, "secondline");

  const collectiveServices = meta.services.filter(s => s.interventionLevel?.code === "COLLECTIVE");
  const secondLineServices = meta.services.filter(s => s.interventionLevel?.code === "SECOND_LINE");

  // --- PANNEAU GAUCHE : SUB-TABS & ITEM LIST ---
  const leftPane = (
    <div className="space-y-4">
      {/* Tab bar switcher */}
      <div className="flex bg-surface p-1 rounded-xl border border-muted/20 shadow-inner">
        {[
          { id: "individual", label: "Individuels" },
          { id: "collective", label: "Collectifs" },
          { id: "secondline", label: "Structures" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 bg-transparent ${
              activeTab === t.id 
                ? "bg-background text-text shadow-sm font-extrabold"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Item List */}
      <div className="rounded-2xl bg-glass border border-muted/20 p-4 max-h-[60vh] overflow-y-auto space-y-1.5">
        {activeTab === "individual" && filteredIndividual.map(item => {
          const isSelected = selectedIndividual?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedIndividual(item)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <p className="font-bold text-xs truncate">{item.service?.name}</p>
              <p className="text-[10px] text-muted truncate mt-0.5">Bénéficiaire : {item.beneficiary?.name}</p>
            </button>
          );
        })}

        {activeTab === "collective" && filteredCollective.map(item => {
          const isSelected = selectedCollective?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCollective(item)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <p className="font-bold text-xs truncate">{item.title}</p>
              <p className="text-[10px] text-muted truncate mt-0.5">{item.service?.name}</p>
            </button>
          );
        })}

        {activeTab === "secondline" && filteredSecondLine.map(item => {
          const isSelected = selectedSecondLine?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedSecondLine(item)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <p className="font-bold text-xs truncate">{item.title}</p>
              <p className="text-[10px] text-muted truncate mt-0.5">Lead : {item.leadOperator?.name}</p>
            </button>
          );
        })}

        {activeTab === "individual" && filteredIndividual.length === 0 && <p className="text-center py-6 text-xs text-muted italic">Aucun accompagnement.</p>}
        {activeTab === "collective" && filteredCollective.length === 0 && <p className="text-center py-6 text-xs text-muted italic">Aucun atelier.</p>}
        {activeTab === "secondline" && filteredSecondLine.length === 0 && <p className="text-center py-6 text-xs text-muted italic">Aucune mission.</p>}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS EN ENTITYDETAILPANEL ---
  const renderDetailPanel = () => {
    if (activeTab === "individual") {
      if (!selectedIndividual) return <div className="text-center py-8 text-xs text-muted italic bg-glass border border-muted/20 border-dashed rounded-xl">Sélectionnez une activité.</div>;
      const d = selectedIndividual;

      const overviewTab = (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[9px] font-bold uppercase text-muted">Bénéficiaire</span>
              <p className="font-bold text-text">{d.beneficiary?.name}</p>
            </div>
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[9px] font-bold uppercase text-muted">Conseiller / Opérateur</span>
              <p className="font-bold text-text">{d.operator?.name} ({d.operator?.type})</p>
            </div>
          </div>

          <div className="space-y-3">
            {d.outputReal && (
              <div className="space-y-1 bg-glass/20 p-3 rounded-xl border border-muted/10">
                <span className="text-[9px] font-bold uppercase text-muted block">Livrable réel (Output)</span>
                <p className="text-xs text-text font-mono">{d.outputReal}</p>
              </div>
            )}
            {d.outcomeReal && (
              <div className="space-y-1 bg-glass/20 p-3 rounded-xl border border-muted/10">
                <span className="text-[9px] font-bold uppercase text-muted block">Résultat mesuré (Outcome)</span>
                <p className="text-xs text-text">{d.outcomeReal}</p>
              </div>
            )}
            {d.impact && (
              <div className="space-y-1 bg-glass/20 p-3 rounded-xl border border-muted/10">
                <span className="text-[9px] font-bold uppercase text-muted block">Impact constaté</span>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{d.impact}</p>
              </div>
            )}
          </div>

          {d.maturityDelta && typeof d.maturityDelta === 'object' && Object.keys(d.maturityDelta).length > 0 && (
            <div className="space-y-2 pt-2 border-t border-muted/10">
              <span className="text-[9px] font-bold uppercase text-muted block">Évolution de la maturité</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(d.maturityDelta).map(([axis, delta]: [string, any]) => (
                  <span key={axis} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-[10px] border border-teal-500/15">
                    {axis.toUpperCase()} : {delta?.before} ➔ {delta?.after}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      const relationsTab = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <RelationshipCard
            title={d.service?.name}
            relationType="Service Public associé"
            Icon={FileText}
          />
          <RelationshipCard
            title={d.beneficiary?.name}
            relationType="Bénéficiaire accompagné"
            Icon={Building2}
          />
        </div>
      );

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/delivery/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:ServiceDelivery</span></p>
          <p className="text-text">Date d'accompagnement : <span className="font-bold">{new Date(d.date).toLocaleDateString()}</span></p>
        </div>
      );

      return (
        <EntityDetailPanel
          title={d.service?.name}
          subtitle={`Délivré par ${d.operator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">Individuel (Niveau 1)</span>}
          overviewTab={overviewTab}
          relationsTab={relationsTab}
          metadataTab={metadataTab}
        />
      );
    }

    if (activeTab === "collective") {
      if (!selectedCollective) return <div className="text-center py-8 text-xs text-muted italic bg-glass border border-muted/20 border-dashed rounded-xl">Sélectionnez une session.</div>;
      const d = selectedCollective;

      const overviewTab = (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-glass/30 p-3 rounded-xl border border-muted/10 text-center">
              <span className="text-xl font-black text-text block">{d.participantsCount}</span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider">Participants</span>
            </div>
            <div className="bg-glass/30 p-3 rounded-xl border border-muted/10 text-center">
              <span className="text-xl font-black text-text block">{d.companiesCount}</span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider">PMEs</span>
            </div>
            <div className="bg-glass/30 p-3 rounded-xl border border-muted/10 text-center">
              <div className="flex items-center justify-center gap-0.5">
                <span className="text-xl font-black text-text">{d.satisfactionScore || "—"}</span>
                {d.satisfactionScore && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
              </div>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider">Satisfaction</span>
            </div>
            <div className="bg-glass/30 p-3 rounded-xl border border-muted/10 text-center">
              <span className="text-xl font-black text-text block">{d.leadsCount || 0}</span>
              <span className="text-[9px] text-muted font-bold uppercase tracking-wider">Leads</span>
            </div>
          </div>

          {d.nextSteps && (
            <div className="bg-glass/20 border border-muted/15 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Plan de suivi & Suites</span>
              <p className="text-xs text-text italic">"{d.nextSteps}"</p>
            </div>
          )}

          {d.notes && (
            <div className="bg-glass/20 border border-muted/15 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Remarques / Notes</span>
              <p className="text-xs text-text">{d.notes}</p>
            </div>
          )}
        </div>
      );

      const relationsTab = (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <RelationshipCard
              title={d.service?.name}
              relationType="Service public de support"
              Icon={FileText}
            />
            <RelationshipCard
              title={d.operator?.name}
              relationType="Organisateur"
              Icon={Building2}
            />
          </div>
          {d.companies && d.companies.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase text-muted block">Entreprises inscrites de la PIT</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {d.companies.map(c => (
                  <RelationshipCard
                    key={c.id}
                    title={c.name}
                    relationType="Entreprise participante"
                    Icon={Building2}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/collective-delivery/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:CollectiveDelivery</span></p>
          <p className="text-text">Date de session : <span className="font-bold">{new Date(d.date).toLocaleDateString()}</span></p>
        </div>
      );

      return (
        <EntityDetailPanel
          title={d.title}
          subtitle={`Organisé par ${d.operator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Collectif (Niveau 2)</span>}
          overviewTab={overviewTab}
          relationsTab={relationsTab}
          metadataTab={metadataTab}
        />
      );
    }

    if (activeTab === "secondline") {
      if (!selectedSecondLine) return <div className="text-center py-8 text-xs text-muted italic bg-glass border border-muted/20 border-dashed rounded-xl">Sélectionnez une mission.</div>;
      const d = selectedSecondLine;

      const overviewTab = (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[9px] font-bold uppercase text-muted">Territoire couvert</span>
              <p className="font-bold text-text">{d.territoryCovered || "Wallonie"}</p>
            </div>
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1">
              <span className="text-[9px] font-bold uppercase text-muted">Collaborations créées</span>
              <p className="font-bold text-text">{d.collaborationsCount} collaborations</p>
            </div>
          </div>

          {d.deliverables && (
            <div className="space-y-1 bg-glass/20 p-4 rounded-xl border border-muted/10">
              <span className="text-[9px] font-bold uppercase text-muted block">Livrables / Référentiels produits</span>
              <p className="text-xs text-text font-mono whitespace-pre-wrap">{d.deliverables}</p>
            </div>
          )}

          {d.notes && (
            <div className="space-y-1 bg-glass/20 p-4 rounded-xl border border-muted/10">
              <span className="text-[9px] font-bold uppercase text-muted block">Notes opérationnelles</span>
              <p className="text-xs text-text">{d.notes}</p>
            </div>
          )}
        </div>
      );

      const relationsTab = (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <RelationshipCard
              title={d.service?.name}
              relationType="Mission Cadre"
              Icon={FileText}
            />
            <RelationshipCard
              title={d.leadOperator?.name}
              relationType="Opérateur Pilote (Lead)"
              Icon={Building2}
            />
          </div>
          {d.operatorsMobilized && d.operatorsMobilized.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase text-muted block">Opérateurs partenaires mobilisés</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {d.operatorsMobilized.map(op => (
                  <RelationshipCard
                    key={op.id}
                    title={op.name}
                    relationType={op.type}
                    Icon={Building2}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/secondline/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:SecondLineMission</span></p>
          <p className="text-text">Début : <span className="font-bold">{new Date(d.startDate).toLocaleDateString()}</span></p>
          {d.endDate && <p className="text-text">Fin : <span className="font-bold">{new Date(d.endDate).toLocaleDateString()}</span></p>}
        </div>
      );

      return (
        <EntityDetailPanel
          title={d.title}
          subtitle={`Piloté par ${d.leadOperator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">Structure (Niveau 3)</span>}
          overviewTab={overviewTab}
          relationsTab={relationsTab}
          metadataTab={metadataTab}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal des Interventions & Activités"
        description="Gérez et analysez le flux d'activités opérationnelles territoriales réparties sur 3 niveaux d'intervention de la PIT."
        Icon={Compass}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "collective" && (
              <button 
                onClick={() => setShowCollForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
              >
                <Plus className="h-4 w-4" />
                Nouvelle session
              </button>
            )}
            {activeTab === "secondline" && (
              <button 
                onClick={() => setShowSecForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
              >
                <Plus className="h-4 w-4" />
                Nouvelle mission
              </button>
            )}
          </div>
        }
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une activité, un service, un bénéficiaire ou un opérateur..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT COLLECTIF */}
      {showCollForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Enregistrer une Session Collective
              </h3>
              <button onClick={() => setShowCollForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollective} className="space-y-4">
              <ReferenceSelector
                label="Service / Intervention collectif *"
                value={colServiceId}
                onChange={setColServiceId}
                options={collectiveServices.map(s => ({ id: s.id, name: `${s.name} (${s.code})` }))}
                required
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Titre de la session / événement *</label>
                <input required value={colTitle} onChange={e => setColTitle(e.target.value)} type="text" placeholder="ex: Workshop IA Agroalimentaire Liège" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ReferenceSelector
                  label="Opérateur / Animateur *"
                  value={colOperatorId}
                  onChange={setColOperatorId}
                  options={meta.organizations}
                  required
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Date de session</label>
                  <input value={colDate} onChange={e => setColDate(e.target.value)} type="date" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Audience (Partic.)</label>
                  <input value={colParticipants} onChange={e => setColParticipants(e.target.value)} type="number" className="w-full bg-glass border border-muted/30 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">PMEs impactées</label>
                  <input value={colCompanies} onChange={e => setColCompanies(e.target.value)} type="number" className="w-full bg-glass border border-muted/30 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Satisfaction (0-5)</label>
                  <input value={colSatisfaction} onChange={e => setColSatisfaction(e.target.value)} type="number" min={0} max={5} step="0.1" className="w-full bg-glass border border-muted/30 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Leads initiés</label>
                  <input value={colLeads} onChange={e => setColLeads(e.target.value)} type="number" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Statut</label>
                  <select value={colStatus} onChange={e => setColStatus(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
                    <option value="PLANNED">Planifié</option>
                    <option value="OPEN_FOR_REGISTRATION">Inscriptions ouvertes</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé / Réalisé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              <MultiTagSelector
                label="Entreprises participantes de la PIT"
                options={meta.beneficiaries}
                selectedIds={colSelectedCompanyIds}
                onChange={setColSelectedCompanyIds}
                color="teal"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Plan d'action / Prochaines étapes</label>
                <textarea value={colNextSteps} onChange={e => setColNextSteps(e.target.value)} placeholder="ex: Programmer les diagnostics individuels..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text h-16" />
              </div>

              <div className="border-t border-muted/20 pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowCollForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all cursor-pointer bg-transparent">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md hover:bg-teal-750 transition-all cursor-pointer border-0">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT DEUXIEME LIGNE */}
      {showSecForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Share2 className="h-5 w-5 text-teal-600" />
                Enregistrer une Mission d'Écosystème
              </h3>
              <button onClick={() => setShowSecForm(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSecondLine} className="space-y-4">
              <ReferenceSelector
                label="Service / Mission de deuxième ligne *"
                value={secServiceId}
                onChange={setSecServiceId}
                options={secondLineServices.map(s => ({ id: s.id, name: `${s.name} (${s.code})` }))}
                required
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Nom / Titre de la mission *</label>
                <input required value={secTitle} onChange={e => setSecTitle(e.target.value)} type="text" placeholder="ex: Coordination du Cluster IA Wallon" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ReferenceSelector
                  label="Opérateur porteur principal *"
                  value={secLeadOperatorId}
                  onChange={setSecLeadOperatorId}
                  options={meta.organizations}
                  required
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Date de début</label>
                  <input value={secStartDate} onChange={e => setSecStartDate(e.target.value)} type="date" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Collaborations créées</label>
                  <input value={secCollabsCount} onChange={e => setSecCollabsCount(e.target.value)} type="number" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Couverture géographique</label>
                  <input value={secTerritory} onChange={e => setSecTerritory(e.target.value)} type="text" placeholder="ex: Wallonie, Hainaut" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Date de fin (optionnelle)</label>
                  <input value={secEndDate} onChange={e => setSecEndDate(e.target.value)} type="date" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Statut de la mission</label>
                  <select value={secStatus} onChange={e => setSecStatus(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
                    <option value="PLANNED">Planifié</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>

              <MultiTagSelector
                label="Opérateurs mobilisés"
                options={meta.organizations}
                selectedIds={secSelectedOperatorIds}
                onChange={setSecSelectedOperatorIds}
                color="purple"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Livrables / Référentiels produits</label>
                <textarea value={secDeliverables} onChange={e => setSecDeliverables(e.target.value)} placeholder="ex: Production du guide méthodologique..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text h-16" />
              </div>

              <div className="border-t border-muted/20 pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowSecForm(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all cursor-pointer bg-transparent">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md hover:bg-teal-750 transition-all cursor-pointer border-0">
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
