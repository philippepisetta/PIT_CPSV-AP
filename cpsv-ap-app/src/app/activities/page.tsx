// src/app/activities/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Building2, 
  Plus, 
  Users, 
  Star, 
  Share2, 
  FileText, 
  X, 
  Layers, 
  Compass, 
  FileCheck,
  Info,
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITForm, { FormSection } from "@/design-system/PITForm";
import SplitLayout from "@/components/ui/SplitLayout";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { useMetaQuery, useServiceDeliveriesQuery } from "@/hooks/usePITQueries";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useV2Journeys, 
  useV2Services, 
  useV2ConvertActivityToJourney, 
  useV2ConvertActivityToService, 
  useV2ConvertActivityToFunding 
} from "@/hooks/useV2Queries";

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
  beneficiaryId?: number;
  beneficiary: Beneficiary;
  service: PublicService;
  operator: Organization;
  status: string;
  date: string;
  outputReal?: string;
  outcomeReal?: string;
  impact?: string;
  maturityDelta?: any;
  notes?: string;
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"individual" | "collective" | "secondline">("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { isEntityTypeVisible } = usePerspective();

  // Queries
  const { data: metaData, isLoading: metaLoading, error: metaError } = useMetaQuery();
  const { data: deliveriesData, isLoading: deliveriesLoading, error: deliveriesError } = useServiceDeliveriesQuery();
  const { data: journeysRes } = useV2Journeys();
  const { data: servicesRes } = useV2Services();

  // Mutations
  const convertToJourney = useV2ConvertActivityToJourney();
  const convertToService = useV2ConvertActivityToService();
  const convertToFunding = useV2ConvertActivityToFunding();

  const loading = metaLoading || deliveriesLoading;
  const error = (metaError?.message || deliveriesError?.message) || null;

  // Deriving data
  const meta = useMemo(() => {
    if (!metaData) {
      return { services: [], organizations: [], beneficiaries: [], fundingInstruments: [] };
    }
    return {
      services: (metaData.services || []) as PublicService[],
      organizations: (metaData.organizations || []) as Organization[],
      fundingInstruments: (metaData.fundingInstruments || []) as any[],
      beneficiaries: (metaData.sectors ? metaData.sectors.reduce((acc: any[], s: any) => {
        s.primaryBeneficiaries?.forEach((b: any) => {
          if (!acc.some((exist: any) => exist.id === b.id)) {
            acc.push({ id: b.id, name: b.name });
          }
        });
        return acc;
      }, []) : []) as Beneficiary[]
    };
  }, [metaData]);

  const individualDeliveries = (deliveriesData || []) as ServiceDelivery[];
  const collectiveDeliveries = (metaData?.collectiveDeliveries || []) as CollectiveDelivery[];
  const secondLineMissions = (metaData?.secondLineMissions || []) as SecondLineMission[];

  const journeys = journeysRes?.data || [];
  const servicesList = servicesRes?.data || [];

  // Selection states
  const [selectedIndividual, setSelectedIndividual] = useState<ServiceDelivery | null>(null);
  const [selectedCollective, setSelectedCollective] = useState<CollectiveDelivery | null>(null);
  const [selectedSecondLine, setSelectedSecondLine] = useState<SecondLineMission | null>(null);

  // Sync selections when lists load
  useEffect(() => {
    if (individualDeliveries.length > 0 && !selectedIndividual) {
      setSelectedIndividual(individualDeliveries[0]);
    }
  }, [individualDeliveries, selectedIndividual]);

  useEffect(() => {
    if (collectiveDeliveries.length > 0 && !selectedCollective) {
      setSelectedCollective(collectiveDeliveries[0]);
    }
  }, [collectiveDeliveries, selectedCollective]);

  useEffect(() => {
    if (secondLineMissions.length > 0 && !selectedSecondLine) {
      setSelectedSecondLine(secondLineMissions[0]);
    }
  }, [secondLineMissions, selectedSecondLine]);

  // Conversion States
  const [convertType, setConvertType] = useState<"journey" | "service" | "funding" | null>(null);
  const [targetJourneyId, setTargetJourneyId] = useState<string>("");
  const [targetServiceId, setTargetServiceId] = useState<string>("");
  const [targetFundingId, setTargetFundingId] = useState<string>("");

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

  const loadData = async (bypassCache = false) => {
    if (bypassCache) {
      await queryClient.invalidateQueries({ queryKey: ["meta"] });
      await queryClient.invalidateQueries({ queryKey: ["service-deliveries"] });
    }
  };

  useEffect(() => {
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

  const handleConversion = (beneficiaryId: number, operatorId?: number) => {
    if (!convertType) return;
    if (convertType === "journey" && targetJourneyId) {
      convertToJourney.mutate({
        beneficiaryId,
        journeyId: parseInt(targetJourneyId)
      }, {
        onSuccess: () => {
          alert("✅ Activité convertie avec succès en parcours !");
          setConvertType(null);
        }
      });
    } else if (convertType === "service" && targetServiceId && operatorId) {
      convertToService.mutate({
        beneficiaryId,
        serviceId: parseInt(targetServiceId),
        operatorId
      }, {
        onSuccess: () => {
          alert("✅ Activité convertie avec succès en livraison de service !");
          setConvertType(null);
        }
      });
    } else if (convertType === "funding" && targetFundingId) {
      convertToFunding.mutate({
        beneficiaryId,
        fundingInstrumentId: parseInt(targetFundingId)
      }, {
        onSuccess: () => {
          alert("✅ Activité convertie avec succès en instrument de financement !");
          setConvertType(null);
        }
      });
    }
  };

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

  // Filtrer les données selon recherche et category tag in notes/title
  const filterList = (list: any[], keyName: string) => {
    return list.filter(item => {
      if (!isEntityTypeVisible("activity")) return false;

      // Category filter check
      if (categoryFilter !== "all") {
        const notes = (item.notes || "").toLowerCase();
        const title = (item.title || "").toLowerCase();
        const searchTag = `[${categoryFilter}]`;
        if (!notes.includes(searchTag) && !title.includes(searchTag)) {
          return false;
        }
      }

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

  const categories = [
    { id: "all", label: "Tout" },
    { id: "atelier", label: "Atelier" },
    { id: "webinaire", label: "Webinaire" },
    { id: "coaching", label: "Coaching" },
    { id: "groupe_de_travail", label: "Groupe de Travail" },
    { id: "mission_economique", label: "Mission Éco" }
  ];

  // --- PANNEAU GAUCHE : SUB-TABS & ITEM LIST ---
  const leftPane = (
    <div className="space-y-4">
      {/* Category selector pills */}
      <div className="flex flex-wrap gap-1.5 bg-glass/10 p-1.5 rounded-xl border border-muted/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border-0 bg-transparent cursor-pointer transition-all ${
              categoryFilter === cat.id 
                ? "bg-teal-500 text-white font-extrabold" 
                : "text-muted hover:text-text hover:bg-glass"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

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
      <div className="rounded-2xl bg-glass border border-muted/20 p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
        {activeTab === "individual" && filteredIndividual.map(item => (
          <PITEntityCard
            key={item.id}
            title={item.service?.name}
            description={`Bénéficiaire : ${item.beneficiary?.name}`}
            icon={FileCheck}
            type="activity"
            isSelected={selectedIndividual?.id === item.id}
            onClick={() => setSelectedIndividual(item)}
          />
        ))}

        {activeTab === "collective" && filteredCollective.map(item => (
          <PITEntityCard
            key={item.id}
            title={item.title}
            description={item.service?.name}
            icon={Users}
            type="activity"
            isSelected={selectedCollective?.id === item.id}
            onClick={() => setSelectedCollective(item)}
          />
        ))}

        {activeTab === "secondline" && filteredSecondLine.map(item => (
          <PITEntityCard
            key={item.id}
            title={item.title}
            description={`Lead : ${item.leadOperator?.name}`}
            icon={Share2}
            type="activity"
            isSelected={selectedSecondLine?.id === item.id}
            onClick={() => setSelectedSecondLine(item)}
          />
        ))}

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
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1 mt-1">
              <span className="text-[9px] font-bold uppercase text-muted">Bénéficiaire</span>
              <p className="font-bold text-text">{d.beneficiary?.name}</p>
            </div>
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1 mt-1">
              <span className="text-[9px] font-bold uppercase text-muted">Conseiller / Opérateur</span>
              <p className="font-bold text-text">{d.operator?.name} ({d.operator?.type})</p>
            </div>
          </div>

          <div className="space-y-3">
            {d.notes && (
              <div className="space-y-1 bg-glass/20 p-3 rounded-xl border border-muted/10">
                <span className="text-[9px] font-bold uppercase text-muted block">Notes d&apos;activité</span>
                <p className="text-xs text-text">{d.notes}</p>
              </div>
            )}
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
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400">{d.impact}</p>
              </div>
            )}
          </div>

          {/* Conversion Section for Animateur */}
          {d.beneficiary && (
            <div className="bg-glass/10 p-4 border border-muted/15 rounded-2xl space-y-4 mt-6">
              <span className="text-[10px] font-black uppercase text-teal-605 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-650" /> Convertir l&apos;Activité (Entonnoir de Conversion)
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConvertType("journey")}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                    convertType === "journey" ? "bg-teal-500 text-white" : "bg-glass border-muted/20 text-text hover:bg-glass/60"
                  }`}
                >
                  Convertir en Parcours
                </button>
                <button
                  onClick={() => setConvertType("service")}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                    convertType === "service" ? "bg-teal-500 text-white" : "bg-glass border-muted/20 text-text hover:bg-glass/60"
                  }`}
                >
                  Convertir en Service
                </button>
                <button
                  onClick={() => setConvertType("funding")}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                    convertType === "funding" ? "bg-teal-500 text-white" : "bg-glass border-muted/20 text-text hover:bg-glass/60"
                  }`}
                >
                  Convertir en Financement
                </button>
              </div>

              {convertType === "journey" && (
                <div className="space-y-2 pt-2 border-t border-muted/10">
                  <label className="text-[9px] font-bold uppercase text-muted block">Sélectionner le Parcours Cible</label>
                  <select 
                    value={targetJourneyId} 
                    onChange={e => setTargetJourneyId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs text-text outline-none focus:border-teal-500"
                  >
                    <option value="">Sélectionner</option>
                    {journeys.map((j: any) => (
                      <option key={j.id} value={j.id}>{j.name} ({j.provider})</option>
                    ))}
                  </select>
                  <button 
                    disabled={!targetJourneyId} 
                    onClick={() => handleConversion(d.beneficiary.id)}
                    className="w-full py-1.5 bg-teal-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    Valider l&apos;inscription
                  </button>
                </div>
              )}

              {convertType === "service" && (
                <div className="space-y-2 pt-2 border-t border-muted/10">
                  <label className="text-[9px] font-bold uppercase text-muted block">Sélectionner le Service Cible</label>
                  <select 
                    value={targetServiceId} 
                    onChange={e => setTargetServiceId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs text-text outline-none focus:border-teal-500"
                  >
                    <option value="">Sélectionner</option>
                    {servicesList.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                  <button 
                    disabled={!targetServiceId} 
                    onClick={() => handleConversion(d.beneficiary.id, d.operator.id)}
                    className="w-full py-1.5 bg-teal-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    Valider la livraison de service
                  </button>
                </div>
              )}

              {convertType === "funding" && (
                <div className="space-y-2 pt-2 border-t border-muted/10">
                  <label className="text-[9px] font-bold uppercase text-muted block">Sélectionner le Financement Cible</label>
                  <select 
                    value={targetFundingId} 
                    onChange={e => setTargetFundingId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs text-text outline-none focus:border-teal-500"
                  >
                    <option value="">Sélectionner</option>
                    {meta.fundingInstruments.map((f: any) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
                    ))}
                  </select>
                  <button 
                    disabled={!targetFundingId} 
                    onClick={() => handleConversion(d.beneficiary.id)}
                    className="w-full py-1.5 bg-teal-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    Confirmer la subvention
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );

      const relationSections = [
        {
          title: "Alignements Métier",
          items: [
            {
              id: d.service?.id,
              title: d.service?.name,
              relationType: "Service Public associé",
              Icon: FileText
            },
            {
              id: d.beneficiary?.id,
              title: d.beneficiary?.name,
              relationType: "Bénéficiaire accompagné",
              Icon: Building2
            }
          ]
        }
      ];

      const relationsTab = <PITRelationsPanel sections={relationSections} />;

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/delivery/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:ServiceDelivery</span></p>
          <p className="text-text">Date d&apos;accompagnement : <span className="font-bold">{new Date(d.date).toLocaleDateString()}</span></p>
        </div>
      );

      return (
        <PITDetailLayout
          title={d.service?.name}
          subtitle={`Délivré par ${d.operator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">Individuel</span>}
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
              <p className="text-xs text-text italic">&quot;{d.nextSteps}&quot;</p>
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

      const relationSections = [
        {
          title: "Alignements Métier",
          items: [
            {
              id: d.service?.id,
              title: d.service?.name,
              relationType: "Service public de support",
              Icon: FileText
            },
            {
              id: d.operator?.id,
              title: d.operator?.name,
              relationType: "Organisateur",
              Icon: Building2
            }
          ]
        },
        {
          title: "Entreprises inscrites de la PIT",
          items: (d.companies || []).map(c => ({
            id: c.id,
            title: c.name,
            relationType: "Entreprise participante",
            Icon: Building2
          }))
        }
      ];

      const relationsTab = <PITRelationsPanel sections={relationSections} />;

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/collective-delivery/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:CollectiveDelivery</span></p>
          <p className="text-text">Date de session : <span className="font-bold">{new Date(d.date).toLocaleDateString()}</span></p>
        </div>
      );

      return (
        <PITDetailLayout
          title={d.title}
          subtitle={`Organisé par ${d.operator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-full">Collectif</span>}
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
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1 mt-1">
              <span className="text-[9px] font-bold uppercase text-muted">Territoire couvert</span>
              <p className="font-bold text-text">{d.territoryCovered || "Wallonie"}</p>
            </div>
            <div className="bg-glass/20 border border-muted/10 p-3 rounded-xl text-xs space-y-1 mt-1">
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

      const relationSections = [
        {
          title: "Alignements Métier",
          items: [
            {
              id: d.service?.id,
              title: d.service?.name,
              relationType: "Mission Cadre",
              Icon: FileText
            },
            {
              id: d.leadOperator?.id,
              title: d.leadOperator?.name,
              relationType: "Opérateur Pilote (Lead)",
              Icon: Building2
            }
          ]
        },
        {
          title: "Opérateurs partenaires mobilisés",
          items: (d.operatorsMobilized || []).map(op => ({
            id: op.id,
            title: op.name,
            relationType: op.type,
            Icon: Building2
          }))
        }
      ];

      const relationsTab = <PITRelationsPanel sections={relationSections} />;

      const metadataTab = (
        <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
          <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/secondline/{d.id}</span></p>
          <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:SecondLineMission</span></p>
          <p className="text-text">Début : <span className="font-bold">{new Date(d.startDate).toLocaleDateString()}</span></p>
          {d.endDate && <p className="text-text">Fin : <span className="font-bold">{new Date(d.endDate).toLocaleDateString()}</span></p>}
        </div>
      );

      return (
        <PITDetailLayout
          title={d.title}
          subtitle={`Piloté par ${d.leadOperator?.name}`}
          badge={<span className="text-[9px] font-bold uppercase text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full">Structure</span>}
          overviewTab={overviewTab}
          relationsTab={relationsTab}
          metadataTab={metadataTab}
        />
      );
    }
  };

  // Form Section definitions for creation
  const collectiveSections: FormSection[] = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Détails de l'atelier collectif",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Service / Intervention collectif *</label>
            <select required value={colServiceId} onChange={e => setColServiceId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
              <option value="">Sélectionner</option>
              {collectiveServices.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Titre de la session / événement *</label>
            <input required value={colTitle} onChange={e => setColTitle(e.target.value)} type="text" placeholder="ex: Workshop IA Agroalimentaire" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Opérateur / Animateur *</label>
              <select required value={colOperatorId} onChange={e => setColOperatorId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="">Sélectionner</option>
                {meta.organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Date de session</label>
              <input value={colDate} onChange={e => setColDate(e.target.value)} type="date" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "stats",
      title: "Audience & Satisfaction",
      subtitle: "Gains de visibilité et retours",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Audience (Partic.)</label>
              <input value={colParticipants} onChange={e => setColParticipants(e.target.value)} type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">PMEs impactées</label>
              <input value={colCompanies} onChange={e => setColCompanies(e.target.value)} type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Satisfaction (0-5)</label>
              <input value={colSatisfaction} onChange={e => setColSatisfaction(e.target.value)} type="number" min={0} max={5} step="0.1" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Leads initiés</label>
              <input value={colLeads} onChange={e => setColLeads(e.target.value)} type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Statut</label>
              <select value={colStatus} onChange={e => setColStatus(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="PLANNED">Planifié</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Fait / Complété</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "followup",
      title: "Suivi & Notes",
      subtitle: "Suites de l&apos;atelier et remarques",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">PMEs de la PIT participantes</label>
            <select multiple value={colSelectedCompanyIds.map(String)} onChange={e => setColSelectedCompanyIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none h-24">
              {meta.beneficiaries.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Plan de suivi / Next steps</label>
            <input value={colNextSteps} onChange={e => setColNextSteps(e.target.value)} type="text" placeholder="ex: Relancer les participants sous 15 jours" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Notes additionnelles</label>
            <textarea value={colNotes} onChange={e => setColNotes(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none h-16 resize-none" />
          </div>
        </div>
      )
    }
  ];

  const secondLineSections: FormSection[] = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Identité de la mission cadre",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Mission de deuxième ligne *</label>
            <select required value={secServiceId} onChange={e => setSecServiceId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
              <option value="">Sélectionner</option>
              {secondLineServices.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Titre descriptif *</label>
            <input required value={secTitle} onChange={e => setSecTitle(e.target.value)} type="text" placeholder="ex: Plateforme Sémantique Régionale" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Opérateur Pilote (Lead) *</label>
              <select required value={secLeadOperatorId} onChange={e => setSecLeadOperatorId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="">Sélectionner</option>
                {meta.organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Date début</label>
                <input value={secStartDate} onChange={e => setSecStartDate(e.target.value)} type="date" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded p-1 text-[10px] text-text outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Date fin</label>
                <input value={secEndDate} onChange={e => setSecEndDate(e.target.value)} type="date" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded p-1 text-[10px] text-text outline-none" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "collabs",
      title: "Coopération & Couverture",
      subtitle: "Acteurs mobilisés et livrables",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Opérateurs partenaires mobilisés</label>
            <select multiple value={secSelectedOperatorIds.map(String)} onChange={e => setSecSelectedOperatorIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none h-20">
              {meta.organizations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Territoire couvert</label>
              <input value={secTerritory} onChange={e => setSecTerritory(e.target.value)} type="text" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Collabs initiées</label>
              <input value={secCollabsCount} onChange={e => setSecCollabsCount(e.target.value)} type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Livrables / Outils produits</label>
            <textarea value={secDeliverables} onChange={e => setSecDeliverables(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none h-16 resize-none" />
          </div>
        </div>
      )
    }
  ];

  return (
    <PITLayout
      category="ESPACE ANIMATION"
      title="Activity Explorer & Suivis"
      description="Consultez les livrables d&apos;accompagnements individuels, les indicateurs d&apos;ateliers collectifs, et convertissez les opportunités détectées."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Activités d&apos;Animation" }
      ]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          <button
            onClick={() => setShowCollForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase rounded-lg border-0 cursor-pointer shadow-sm transition-all"
          >
            + Nouvel Atelier
          </button>
          <button
            onClick={() => setShowSecForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] uppercase rounded-lg border-0 cursor-pointer shadow-sm transition-all"
          >
            + Nouvelle Mission
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 rounded-xl">
            Erreur de connexion : {error}
          </div>
        )}

        <PITFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Rechercher une activité par nom, service ou opérateur..."
        />

        <SplitLayout
          leftPane={leftPane}
          rightPane={renderDetailPanel()}
          leftColSpan={5}
        />
      </div>

      {/* Form Modals */}
      {showCollForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <PITForm
              title="Créer un Atelier Collectif"
              sections={collectiveSections}
              onSubmit={handleAddCollective}
              onCancel={() => setShowCollForm(false)}
            />
          </div>
        </div>
      )}

      {/* Second line mission Modal */}
      {showSecForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <PITForm
              title="Créer une Mission de Structure (Deuxième ligne)"
              sections={secondLineSections}
              onSubmit={handleAddSecondLine}
              onCancel={() => setShowSecForm(false)}
            />
          </div>
        </div>
      )}
    </PITLayout>
  );
}
