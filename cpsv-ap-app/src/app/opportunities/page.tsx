// src/app/opportunities/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  FileCode, 
  Search, 
  Sparkles, 
  Building2, 
  Users, 
  Plus, 
  ArrowRight, 
  Activity, 
  Calendar, 
  Shield,
  Edit2,
  Trash2,
  X,
  Eye,
  Award,
  Layers,
  Network,
  Info
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import { Badge } from "@/components/ui/badge";
import ContextPanel from "@/components/ContextPanel";
import { 
  useV2OpportunitiesQuery, 
  useV2MembersQuery, 
  useV2ProjectsQuery,
  useV2FundingProgramsQuery,
  useV2FundingCallsQuery,
  useV2FundingInstrumentsQuery,
  useV2FundingAwardsQuery,
  useV2CreateFundingProgramMutation,
  useV2UpdateFundingProgramMutation,
  useV2DeleteFundingProgramMutation,
  useV2CreateFundingCallMutation,
  useV2UpdateFundingCallMutation,
  useV2DeleteFundingCallMutation,
  useV2CreateFundingInstrumentMutation,
  useV2UpdateFundingInstrumentMutation,
  useV2DeleteFundingInstrumentMutation,
  useV2CreateFundingAwardMutation,
  useV2UpdateFundingAwardMutation,
  useV2DeleteFundingAwardMutation,
  useV2CommunitiesQuery,
  useV2FilieresQuery,
  useV2ValueChainsQuery,
  useMetaQuery
} from "@/hooks/usePITQueries";

interface Opportunity {
  id: number;
  title: string;
  type: string;
  provider: string;
  status: string;
  deadline?: string;
  description?: string;
  budget?: string;
}

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<"EXPLORER" | "PROGRAMS" | "CALLS" | "INSTRUMENTS" | "AWARDS">("EXPLORER");
  const [search, setSearch] = useState("");
  const [selectedOppId, setSelectedOppId] = useState<number | null>(null);

  // Context Panel States
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState("");
  const [panelId, setPanelId] = useState<number | string>("");

  // Queries
  const { data: oppsRes, isLoading: oppsLoading } = useV2OpportunitiesQuery();
  const { data: membersRes } = useV2MembersQuery();
  const { data: projectsRes } = useV2ProjectsQuery();
  const { data: programsRes, isLoading: programsLoading } = useV2FundingProgramsQuery();
  const { data: callsRes, isLoading: callsLoading } = useV2FundingCallsQuery();
  const { data: instrumentsRes, isLoading: instrumentsLoading } = useV2FundingInstrumentsQuery();
  const { data: awardsRes, isLoading: awardsLoading } = useV2FundingAwardsQuery();
  const { data: communitiesRes } = useV2CommunitiesQuery();
  const { data: filieresRes } = useV2FilieresQuery();
  const { data: valueChainsRes } = useV2ValueChainsQuery();
  const { data: metaRes } = useMetaQuery();

  const opportunities: Opportunity[] = oppsRes?.data || [];
  const members = membersRes?.data || [];
  const projects = projectsRes?.data || [];
  const programs = programsRes?.data || [];
  const calls = callsRes?.data || [];
  const instruments = instrumentsRes?.data || [];
  const awards = awardsRes?.data || [];
  const communities = communitiesRes?.data || [];
  const filieres = filieresRes?.data || [];
  const valueChains = valueChainsRes?.data || [];
  const publicServices = metaRes?.services || [];

  // Mutations
  const createProgram = useV2CreateFundingProgramMutation();
  const updateProgram = useV2UpdateFundingProgramMutation();
  const deleteProgram = useV2DeleteFundingProgramMutation();

  const createCall = useV2CreateFundingCallMutation();
  const updateCall = useV2UpdateFundingCallMutation();
  const deleteCall = useV2DeleteFundingCallMutation();

  const createInstrument = useV2CreateFundingInstrumentMutation();
  const updateInstrument = useV2UpdateFundingInstrumentMutation();
  const deleteInstrument = useV2DeleteFundingInstrumentMutation();

  const createAward = useV2CreateFundingAwardMutation();
  const updateAward = useV2UpdateFundingAwardMutation();
  const deleteAward = useV2DeleteFundingAwardMutation();

  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"PROGRAM" | "CALL" | "INSTRUMENT" | "AWARD">("PROGRAM");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States - Program
  const [progName, setProgName] = useState("");
  const [progDesc, setProgDesc] = useState("");

  // Form States - Call
  const [callName, setCallName] = useState("");
  const [callDesc, setCallDesc] = useState("");
  const [callProgramId, setCallProgramId] = useState("");
  const [callDeadline, setCallDeadline] = useState("");
  const [callStatus, setCallStatus] = useState("OPEN");
  const [callCommIds, setCallCommIds] = useState<number[]>([]);
  const [callFilIds, setCallFilIds] = useState<number[]>([]);
  const [callVcIds, setCallVcIds] = useState<number[]>([]);
  const [callOppIds, setCallOppIds] = useState<number[]>([]);
  const [callProjIds, setCallProjIds] = useState<number[]>([]);

  // Form States - Instrument
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState("FEDER");
  const [instDesc, setInstDesc] = useState("");
  const [instCallId, setInstCallId] = useState("");

  // Form States - Award
  const [awardAmount, setAwardAmount] = useState("");
  const [awardDate, setAwardDate] = useState("");
  const [awardProjId, setAwardProjId] = useState("");
  const [awardInstId, setAwardInstId] = useState("");
  const [awardStatus, setAwardStatus] = useState("GRANTED");

  // Inspect in Context Panel
  const handleInspect = (type: string, id: number | string) => {
    setPanelType(type);
    setPanelId(id);
    setPanelOpen(true);
  };

  // Original Opportunity Explorer Filter
  const filteredOpps = opportunities.filter((o: Opportunity) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    (o.provider && o.provider.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedOpp = opportunities.find(o => o.id === selectedOppId) || (filteredOpps.length > 0 ? filteredOpps[0] : null);

  const handleSelectOpp = (id: number) => {
    setSelectedOppId(id);
  };

  // Open Create Modals
  const handleOpenCreate = (type: "PROGRAM" | "CALL" | "INSTRUMENT" | "AWARD") => {
    setEditingItem(null);
    setModalType(type);
    if (type === "PROGRAM") {
      setProgName("");
      setProgDesc("");
    } else if (type === "CALL") {
      setCallName("");
      setCallDesc("");
      setCallProgramId(programs[0]?.id?.toString() || "");
      setCallDeadline("");
      setCallStatus("OPEN");
      setCallCommIds([]);
      setCallFilIds([]);
      setCallVcIds([]);
      setCallOppIds([]);
      setCallProjIds([]);
    } else if (type === "INSTRUMENT") {
      setInstName("");
      setInstType("FEDER");
      setInstDesc("");
      setInstCallId(calls[0]?.id?.toString() || "");
    } else if (type === "AWARD") {
      setAwardAmount("");
      setAwardDate(new Date().toISOString().substring(0, 10));
      setAwardProjId(projects[0]?.id?.toString() || "");
      setAwardInstId(instruments[0]?.id?.toString() || "");
      setAwardStatus("GRANTED");
    }
    setIsModalOpen(true);
  };

  // Open Edit Modals
  const handleOpenEdit = (type: "PROGRAM" | "CALL" | "INSTRUMENT" | "AWARD", item: any) => {
    setEditingItem(item);
    setModalType(type);
    if (type === "PROGRAM") {
      setProgName(item.name || "");
      setProgDesc(item.description || "");
    } else if (type === "CALL") {
      setCallName(item.name || "");
      setCallDesc(item.description || "");
      setCallProgramId(item.programId?.toString() || "");
      setCallDeadline(item.deadline ? new Date(item.deadline).toISOString().substring(0, 10) : "");
      setCallStatus(item.status || "OPEN");
      setCallCommIds(item.communities?.map((i: any) => i.id) || []);
      setCallFilIds(item.filieres?.map((i: any) => i.id) || []);
      setCallVcIds(item.valueChains?.map((i: any) => i.id) || []);
      setCallOppIds(item.opportunities?.map((i: any) => i.id) || []);
      setCallProjIds(item.projects?.map((i: any) => i.id) || []);
    } else if (type === "INSTRUMENT") {
      setInstName(item.name || "");
      setInstType(item.type || "FEDER");
      setInstDesc(item.description || "");
      setInstCallId(item.callId?.toString() || "");
    } else if (type === "AWARD") {
      setAwardAmount(item.amount?.toString() || "");
      setAwardDate(item.date ? new Date(item.date).toISOString().substring(0, 10) : "");
      setAwardProjId(item.projectId?.toString() || "");
      setAwardInstId(item.instrumentId?.toString() || "");
      setAwardStatus(item.status || "GRANTED");
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "PROGRAM") {
        const payload = { name: progName, description: progDesc || null };
        if (editingItem) {
          await updateProgram.mutateAsync({ id: editingItem.id, data: payload });
        } else {
          await createProgram.mutateAsync(payload);
        }
      } else if (modalType === "CALL") {
        const payload = {
          name: callName,
          description: callDesc || null,
          programId: parseInt(callProgramId),
          deadline: callDeadline ? new Date(callDeadline) : null,
          status: callStatus,
          communityIds: callCommIds,
          filiereIds: callFilIds,
          valueChainIds: callVcIds,
          opportunityIds: callOppIds,
          projectIds: callProjIds
        };
        if (editingItem) {
          await updateCall.mutateAsync({ id: editingItem.id, data: payload });
        } else {
          await createCall.mutateAsync(payload);
        }
      } else if (modalType === "INSTRUMENT") {
        const payload = {
          name: instName,
          type: instType,
          description: instDesc || null,
          callId: instCallId ? parseInt(instCallId) : null
        };
        if (editingItem) {
          await updateInstrument.mutateAsync({ id: editingItem.id, data: payload });
        } else {
          await createInstrument.mutateAsync(payload);
        }
      } else if (modalType === "AWARD") {
        const payload = {
          amount: parseFloat(awardAmount),
          date: awardDate ? new Date(awardDate) : new Date(),
          projectId: awardProjId ? parseInt(awardProjId) : null,
          instrumentId: awardInstId ? parseInt(awardInstId) : null,
          status: awardStatus
        };
        if (editingItem) {
          await updateAward.mutateAsync({ id: editingItem.id, data: payload });
        } else {
          await createAward.mutateAsync(payload);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving funding item:", err);
    }
  };

  const handleDeleteItem = async (type: "PROGRAM" | "CALL" | "INSTRUMENT" | "AWARD", id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      if (type === "PROGRAM") await deleteProgram.mutateAsync(id);
      else if (type === "CALL") await deleteCall.mutateAsync(id);
      else if (type === "INSTRUMENT") await deleteInstrument.mutateAsync(id);
      else if (type === "AWARD") await deleteAward.mutateAsync(id);
    }
  };

  const toggleRelation = (id: number, list: number[], setter: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (list.includes(id)) {
      setter(list.filter(item => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  // Render Original Left Pane
  const leftPane = (
    <div className="bg-surface rounded-2xl border border-muted/10 overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-muted/10 flex justify-between items-center bg-glass/5">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Opportunités de Financement ({filteredOpps.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1 p-4 space-y-3 scrollbar-thin">
        {filteredOpps.map((o: Opportunity) => {
          const isSelected = selectedOpp?.id === o.id;
          return (
            <div
              key={o.id}
              onClick={() => handleSelectOpp(o.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? "bg-teal-500/10 border-teal-500/40 shadow-md"
                  : "bg-glass/30 border-muted/15 hover:border-muted/30"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full w-max block">
                  {o.type}
                </span>
                <h4 className="font-extrabold text-xs text-text">{o.title}</h4>
                <p className="text-[10px] text-muted font-bold leading-tight">Fournisseur : {o.provider || "Région Wallonne"}</p>
              </div>

              <div className="flex justify-between items-center border-t border-muted/10 pt-2 text-[9px] font-bold text-muted">
                <span>Statut : {o.status || "OPEN"}</span>
                {o.deadline && <span>Échéance : {new Date(o.deadline).toLocaleDateString()}</span>}
              </div>
            </div>
          );
        })}

        {filteredOpps.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucune opportunité trouvée.
          </div>
        )}
      </div>
    </div>
  );

  // Render Original Right Pane
  const renderDetailPanel = () => {
    if (!selectedOpp) {
      return (
        <div className="text-center py-20 text-muted italic bg-glass/10 border-2 border-dashed border-muted/15 rounded-2xl">
          <FileCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Sélectionnez une opportunité pour charger son explorer.
        </div>
      );
    }

    const o = selectedOpp;

    // Filter eligible beneficiaries
    const eligibleCompanies = members.filter((m: any) => {
      if (o.title.toLowerCase().includes("ia")) {
        return m.iaMaturity && m.iaMaturity < 3;
      }
      if (o.title.toLowerCase().includes("cyber")) {
        return m.cyberMaturity && m.cyberMaturity < 3;
      }
      return true;
    }).slice(0, 4);

    // Filter projects linked to this opportunity
    const linkedProjects = projects.filter((p: any) => 
      p.name.toLowerCase().includes(o.title.toLowerCase().split(" ")[0]) ||
      p.description?.toLowerCase().includes(o.provider.toLowerCase())
    );

    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-1.5">
          <span className="text-[9px] font-bold text-muted uppercase block">Description du Programme</span>
          <p className="text-xs text-text leading-relaxed">{o.description || "Appel à projet visant à soutenir les collaborations de recherche et de développement en Wallonie."}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-text">
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Budget Global</span>
            <span className="text-sm font-black text-teal-655">{o.budget || "500,000 €"}</span>
          </div>
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Fournisseur</span>
            <span>{o.provider}</span>
          </div>
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold uppercase text-muted block">Échéance</span>
            <span>{o.deadline ? new Date(o.deadline).toLocaleDateString() : "Non spécifiée"}</span>
          </div>
        </div>
      </div>
    );

    const eligibleTab = (
      <div className="space-y-4">
        <div className="border-b border-muted/10 pb-2 flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-650 animate-pulse" />
            Bénéficiaires Éligibles Recommandés (SoI Engine)
          </h4>
          <span className="text-[8px] font-black bg-teal-500/10 text-teal-655 px-2 py-0.5 rounded border border-teal-500/20 uppercase">
            Auto-Match
          </span>
        </div>

        <div className="space-y-2.5">
          {eligibleCompanies.map((c: any) => (
            <div key={c.id} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text block">{c.name}</span>
                <span className="text-[9px] text-muted block">Localisation : {c.location} • Provenance : {c.sourceSystem || "CRM"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className="bg-teal-500/10 text-teal-655 text-[8px] font-bold uppercase">
                  Maturité IA : {c.iaMaturity || 1}/4
                </Badge>
                <button
                  onClick={() => alert(`✅ Notification d'éligibilité envoyée au conseiller de "${c.name}".`)}
                  className="px-2 py-0.5 bg-teal-500 text-white rounded text-[9px] font-bold cursor-pointer"
                >
                  Qualifier
                </button>
              </div>
            </div>
          ))}
          {eligibleCompanies.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucun bénéficiaire éligible trouvé.</p>
          )}
        </div>
      </div>
    );

    const consortiumTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Constitution d&apos;un Consortium en Un Clic
        </h4>
        <p className="text-[10px] text-muted leading-tight font-semibold">Gérez les partenaires et soumettez la proposition de consortium au nom du pôle.</p>

        {eligibleCompanies.length >= 2 ? (
          <div className="bg-glass/35 border border-indigo-500/25 p-4 rounded-2xl space-y-4">
            <span className="text-[9px] font-black uppercase text-indigo-605">Consortium suggéré</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text bg-glass/20 p-2.5 border border-muted/10 rounded-xl">
                <Building2 className="h-4 w-4 text-teal-605" />
                <span>Porteur principal : {eligibleCompanies[0].name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-text bg-glass/20 p-2.5 border border-muted/10 rounded-xl">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Cogénérateur R&D : {eligibleCompanies[1].name}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`✅ Consortium sémantique constitué ! L'opportunité a été reliée aux deux bénéficiaires et enregistrée dans le CRM Fédéré.`)}
              className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-black text-[10px] uppercase rounded-xl cursor-pointer shadow hover:shadow-lg transition-all"
            >
              Enregistrer le Consortium & Connecter au Graphe
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted italic text-center py-4">Pas assez de candidats éligibles pour constituer un consortium suggéré.</p>
        )}
      </div>
    );

    const projectsTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Projets Actifs Financés par cet Instrument
        </h4>
        <div className="space-y-2.5">
          {linkedProjects.map((p: any) => (
            <div key={p.id} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text block">{p.name}</span>
                <span className="text-[9px] text-muted block">Code : {p.code} • Statut : {p.status}</span>
              </div>
              <Badge className="bg-teal-500/10 text-teal-650 text-[8px] font-bold uppercase">
                Active Project
              </Badge>
            </div>
          ))}
          {linkedProjects.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucun projet actif n&apos;est actuellement relié à ce financement.</p>
          )}
        </div>
      </div>
    );

    const metadataTab = (
      <div className="space-y-4">
        <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-2.5">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Provenance et Métadonnées Sémantiques</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] text-muted">URI Sémantique</span>
              <span className="font-mono text-[10px] text-text break-all">https://pit.wallonie.be/id/opportunity/{o.id}</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Système Source</span>
              <span className="font-semibold text-text">Wallonie Entreprendre (WE) / AWEX</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Statut Interop</span>
              <span className="font-semibold text-text">Synchronisé</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Dernière Synchro</span>
              <span className="font-semibold text-text">Quotidien (04:00 AM)</span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <PITDetailLayout
        title={o.title}
        subtitle={`Instrument de Financement — Fournisseur : ${o.provider}`}
        badge={
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-655 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
            {o.type}
          </span>
        }
        overviewTab={overviewTab}
        relationsTab={eligibleTab}
        impactTab={consortiumTab}
        contributionsTab={projectsTab}
        metadataTab={metadataTab}
        overviewLabel="Vue d'ensemble"
        relationsLabel="Bénéficiaires Éligibles"
        impactLabel="Consortium Manager"
        contributionsLabel="Projets Liés"
      />
    );
  };

  return (
    <PITLayout
      category="CATALOGUE TERRITORIAL"
      title="Financements & Aides Régionales"
      description="Gérez les programmes, appels, instruments financiers et awards octroyés aux projets d'innovation de l'écosystème."
      pageIcon={FileCode}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Financements" }
      ]}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-muted/10 overflow-x-auto gap-2 text-xs font-black uppercase tracking-wider select-none">
          <button
            onClick={() => setActiveTab("EXPLORER")}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === "EXPLORER" 
                ? "border-teal-500 text-text font-black" 
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Opportunités Explorer
          </button>
          <button
            onClick={() => setActiveTab("PROGRAMS")}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === "PROGRAMS" 
                ? "border-teal-500 text-text font-black" 
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Programmes ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab("CALLS")}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === "CALLS" 
                ? "border-teal-500 text-text font-black" 
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Appels à Projets ({calls.length})
          </button>
          <button
            onClick={() => setActiveTab("INSTRUMENTS")}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === "INSTRUMENTS" 
                ? "border-teal-500 text-text font-black" 
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Instruments ({instruments.length})
          </button>
          <button
            onClick={() => setActiveTab("AWARDS")}
            className={`pb-3 px-4 border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
              activeTab === "AWARDS" 
                ? "border-teal-500 text-text font-black" 
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Awards Octroyés ({awards.length})
          </button>
        </div>

        {/* Dynamic Views based on tab */}
        {activeTab === "EXPLORER" && (
          <div className="space-y-4">
            <PITFilterBar
              searchQuery={search}
              onSearchChange={setSearch}
              searchPlaceholder="Rechercher un financement par nom ou fournisseur..."
            />
            <SplitLayout
              leftPane={leftPane}
              rightPane={renderDetailPanel()}
              leftColSpan={5}
            />
          </div>
        )}

        {/* PROGRAMS TAB */}
        {activeTab === "PROGRAMS" && (
          <div className="bg-glass/10 border border-muted/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-xs font-black uppercase text-muted">Programmes de Financement</h3>
              <button
                onClick={() => handleOpenCreate("PROGRAM")}
                className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouveau Programme
              </button>
            </div>

            {programsLoading ? (
              <div className="text-center py-8 text-muted">Chargement...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs.map((p: any) => (
                  <div key={p.id} className="p-4 rounded-xl border border-muted/10 bg-glass/15 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-text">{p.name}</h4>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleInspect("fundingprogram", p.id)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                            title="Inspecter"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit("PROGRAM", p)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("PROGRAM", p.id)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-rose-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">{p.description || "Aucune description de programme."}</p>
                    </div>

                    <div className="border-t border-muted/5 pt-2 flex items-center justify-between text-[9px] font-bold text-muted">
                      <span>URI : https://pit.wallonie.be/id/funding-program/{p.id}</span>
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-650 rounded">
                        {p.calls?.length || 0} Appels
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CALLS TAB */}
        {activeTab === "CALLS" && (
          <div className="bg-glass/10 border border-muted/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-xs font-black uppercase text-muted">Appels à Projets</h3>
              <button
                onClick={() => handleOpenCreate("CALL")}
                className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouvel Appel
              </button>
            </div>

            {callsLoading ? (
              <div className="text-center py-8 text-muted">Chargement...</div>
            ) : (
              <div className="space-y-4">
                {calls.map((c: any) => (
                  <div key={c.id} className="p-4 rounded-xl border border-muted/10 bg-glass/15 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            c.status === "OPEN" 
                              ? "bg-teal-500/10 text-teal-500 border border-teal-500/20" 
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[9px] text-muted font-bold">
                            Programme: {c.program?.name || `ID #${c.programId}`}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-text">{c.name}</h4>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleInspect("fundingcall", c.id)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                          title="Inspecter"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit("CALL", c)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("CALL", c.id)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-rose-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted leading-relaxed">{c.description || "Aucune description de l'appel."}</p>

                    <div className="flex flex-wrap items-center justify-between border-t border-muted/5 pt-2 text-[9px] font-bold text-muted gap-2">
                      {c.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted" />
                          Échéance : {new Date(c.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <div className="flex gap-2">
                        {c.filieres?.length > 0 && <span className="text-teal-505">Filières : {c.filieres.map((f: any) => f.name).join(", ")}</span>}
                        {c.projects?.length > 0 && <span className="text-blue-500">Projets : {c.projects.length}</span>}
                        {c.instruments?.length > 0 && <span className="text-indigo-400">Instruments : {c.instruments.length}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INSTRUMENTS TAB */}
        {activeTab === "INSTRUMENTS" && (
          <div className="bg-glass/10 border border-muted/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-xs font-black uppercase text-muted">Instruments Financiers</h3>
              <button
                onClick={() => handleOpenCreate("INSTRUMENT")}
                className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouvel Instrument
              </button>
            </div>

            {instrumentsLoading ? (
              <div className="text-center py-8 text-muted">Chargement...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instruments.map((ins: any) => (
                  <div key={ins.id} className="p-4 rounded-xl border border-muted/10 bg-glass/15 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full w-max block">
                            {ins.type}
                          </span>
                          <h4 className="font-extrabold text-xs text-text">{ins.name}</h4>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleInspect("fundinginstrument", ins.id)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                            title="Inspecter"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit("INSTRUMENT", ins)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("INSTRUMENT", ins.id)}
                            className="p-1 hover:bg-glass rounded text-muted hover:text-rose-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">{ins.description || "Aucune description d'instrument."}</p>
                    </div>

                    <div className="border-t border-muted/5 pt-2 flex items-center justify-between text-[9px] font-bold text-muted">
                      <span>Appel lié : {ins.call?.name || "Générique"}</span>
                      <span className="px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-600 rounded">
                        {ins.awards?.length || 0} Awards
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AWARDS TAB */}
        {activeTab === "AWARDS" && (
          <div className="bg-glass/10 border border-muted/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h3 className="text-xs font-black uppercase text-muted">Awards Octroyés</h3>
              <button
                onClick={() => handleOpenCreate("AWARD")}
                className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouvel Award
              </button>
            </div>

            {awardsLoading ? (
              <div className="text-center py-8 text-muted">Chargement...</div>
            ) : (
              <div className="space-y-3">
                {awards.map((aw: any) => (
                  <div key={aw.id} className="p-4 rounded-xl border border-muted/10 bg-glass/15 flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-fuchsia-500/10 text-fuchsia-600 border border-fuchsia-500/20">
                          {aw.status}
                        </span>
                        <span className="text-[10px] text-muted font-bold">
                          Instrument: {aw.instrument?.name || `ID #${aw.instrumentId}`}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-text">
                        {aw.amount?.toLocaleString("fr-BE", { style: "currency", currency: "EUR" })}
                      </h4>
                      <p className="text-[10px] text-muted font-bold">
                        Projet : {aw.project?.name || "Non spécifié"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-muted font-bold">
                      {aw.date && <span>Date d&apos;octroi : {new Date(aw.date).toLocaleDateString()}</span>}
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleInspect("fundingaward", aw.id)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                          title="Inspecter"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit("AWARD", aw)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-text transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("AWARD", aw.id)}
                          className="p-1 hover:bg-glass rounded text-muted hover:text-rose-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CRUD Form Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface border border-muted/30 rounded-2xl max-w-md w-full shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-text mb-4 uppercase tracking-wider">
              {editingItem ? "Modifier" : "Créer un"} {
                modalType === "PROGRAM" ? "Programme de Financement" :
                modalType === "CALL" ? "Appel à Projets" :
                modalType === "INSTRUMENT" ? "Instrument Financier" : "Award Octroyé"
              }
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Program Fields */}
              {modalType === "PROGRAM" && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Nom du Programme</label>
                    <input
                      type="text"
                      required
                      value={progName}
                      onChange={(e) => setProgName(e.target.value)}
                      placeholder="ex: Horizon Europe Wallonie"
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Description</label>
                    <textarea
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                      rows={3}
                      placeholder="Description globale du programme de financement..."
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </>
              )}

              {/* Call Fields */}
              {modalType === "CALL" && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Intitulé de l&apos;Appel</label>
                    <input
                      type="text"
                      required
                      value={callName}
                      onChange={(e) => setCallName(e.target.value)}
                      placeholder="ex: Appel Cyber-Résilience 2026"
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Programme</label>
                      <select
                        value={callProgramId}
                        onChange={(e) => setCallProgramId(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        {programs.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Statut</label>
                      <select
                        value={callStatus}
                        onChange={(e) => setCallStatus(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Date limite</label>
                      <input
                        type="date"
                        value={callDeadline}
                        onChange={(e) => setCallDeadline(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Description</label>
                    <textarea
                      value={callDesc}
                      onChange={(e) => setCallDesc(e.target.value)}
                      rows={2}
                      placeholder="Description..."
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </>
              )}

              {/* Instrument Fields */}
              {modalType === "INSTRUMENT" && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Nom de l&apos;Instrument</label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      placeholder="ex: Chèque Entreprises Cybersecurité"
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Type</label>
                      <select
                        value={instType}
                        onChange={(e) => setInstType(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        <option value="FEDER">FEDER</option>
                        <option value="Horizon Europe">Horizon Europe</option>
                        <option value="Chèque Entreprise">Chèque Entreprise</option>
                        <option value="Wallonie">Wallonie</option>
                        <option value="Digital Europe">Digital Europe</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Appel Lié</label>
                      <select
                        value={instCallId}
                        onChange={(e) => setInstCallId(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        <option value="">Aucun (Générique)</option>
                        {calls.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Description</label>
                    <textarea
                      value={instDesc}
                      onChange={(e) => setInstDesc(e.target.value)}
                      rows={3}
                      placeholder="Description..."
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </>
              )}

              {/* Award Fields */}
              {modalType === "AWARD" && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-muted block uppercase text-[10px]">Montant Octroyé (€)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={awardAmount}
                      onChange={(e) => setAwardAmount(e.target.value)}
                      placeholder="ex: 150000"
                      className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Instrument</label>
                      <select
                        value={awardInstId}
                        onChange={(e) => setAwardInstId(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        {instruments.map((ins: any) => (
                          <option key={ins.id} value={ins.id}>{ins.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Projet d&apos;Innovation</label>
                      <select
                        value={awardProjId}
                        onChange={(e) => setAwardProjId(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        <option value="">Aucun</option>
                        {projects.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Date d&apos;octroi</label>
                      <input
                        type="date"
                        value={awardDate}
                        onChange={(e) => setAwardDate(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted block uppercase text-[10px]">Statut</label>
                      <select
                        value={awardStatus}
                        onChange={(e) => setAwardStatus(e.target.value)}
                        className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                      >
                        <option value="GRANTED">GRANTED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-glass border border-muted/30 hover:bg-glass/55 text-text rounded-xl px-4 py-2 font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 font-bold transition-all cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspector Panel */}
      <ContextPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        entityType={panelType}
        entityId={panelId}
      />
    </PITLayout>
  );
}
