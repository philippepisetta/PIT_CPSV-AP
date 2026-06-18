// src/app/ecosystem-challenges/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  Target, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Eye, 
  Network, 
  Layers, 
  Shield, 
  FileCode, 
  FileText, 
  CheckCircle, 
  Activity, 
  TrendingUp,
  MapPin,
  Info
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import ContextPanel from "@/components/ContextPanel";
import {
  useV2EcosystemChallengesQuery,
  useV2CreateEcosystemChallengeMutation,
  useV2UpdateEcosystemChallengeMutation,
  useV2DeleteEcosystemChallengeMutation,
  useV2CommunitiesQuery,
  useV2FilieresQuery,
  useV2ValueChainsQuery,
  useV2ProjectsQuery,
  useV2OutcomesQuery,
  useV2OpportunitiesQuery,
  useMetaQuery
} from "@/hooks/usePITQueries";

const CHALLENGE_TYPES = [
  "TECHNOLOGICAL",
  "REGULATORY",
  "MARKET",
  "SKILLS",
  "INFRASTRUCTURE",
  "COMPETENCY",
  "CYBERSECURITY",
  "DEEPTECH",
  "HYDROGEN",
  "RECRUITMENT"
];

export default function EcosystemChallengesPage() {
  const { data: challengesRes, isLoading: challengesLoading } = useV2EcosystemChallengesQuery();
  const { data: communitiesRes } = useV2CommunitiesQuery();
  const { data: filieresRes } = useV2FilieresQuery();
  const { data: valueChainsRes } = useV2ValueChainsQuery();
  const { data: projectsRes } = useV2ProjectsQuery();
  const { data: outcomesRes } = useV2OutcomesQuery();
  const { data: opportunitiesRes } = useV2OpportunitiesQuery();
  const { data: metaRes } = useMetaQuery();

  const challenges = challengesRes?.data || [];
  const communities = communitiesRes?.data || [];
  const filieres = filieresRes?.data || [];
  const valueChains = valueChainsRes?.data || [];
  const projects = projectsRes?.data || [];
  const outcomes = outcomesRes?.data || [];
  const opportunities = opportunitiesRes?.data || [];
  const publicServices = metaRes?.services || [];

  const createMutation = useV2CreateEcosystemChallengeMutation();
  const updateMutation = useV2UpdateEcosystemChallengeMutation();
  const deleteMutation = useV2DeleteEcosystemChallengeMutation();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterType, setSelectedFilterType] = useState("ALL");
  const [selectedFilterPriority, setSelectedFilterPriority] = useState("ALL");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("ACTIVE");

  // ContextPanel States
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState("");
  const [panelId, setPanelId] = useState<number | string>("");

  // Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(CHALLENGE_TYPES[0]);
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("ACTIVE");
  const [impact, setImpact] = useState("");
  const [territory, setTerritory] = useState("");

  // Relations Selection States
  const [selectedCommunities, setSelectedCommunities] = useState<number[]>([]);
  const [selectedFilieres, setSelectedFilieres] = useState<number[]>([]);
  const [selectedValueChains, setSelectedValueChains] = useState<number[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState<number[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Filter and Search Logic
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c: any) => {
      const matchesSearch = 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedFilterType === "ALL" || c.type === selectedFilterType;
      const matchesPriority = selectedFilterPriority === "ALL" || c.priority === selectedFilterPriority;
      const matchesStatus = selectedFilterStatus === "ALL" || c.status === selectedFilterStatus;

      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });
  }, [challenges, searchTerm, selectedFilterType, selectedFilterPriority, selectedFilterStatus]);

  // KPI calculations
  const kpis = useMemo(() => {
    const total = challenges.length;
    const highPriority = challenges.filter((c: any) => c.priority === "HIGH").length;
    const resolved = challenges.filter((c: any) => c.status === "RESOLVED").length;
    const active = challenges.filter((c: any) => c.status === "ACTIVE").length;
    return { total, highPriority, resolved, active };
  }, [challenges]);

  const openCreateModal = () => {
    setEditingChallenge(null);
    setTitle("");
    setDescription("");
    setType(CHALLENGE_TYPES[0]);
    setPriority("MEDIUM");
    setStatus("ACTIVE");
    setImpact("");
    setTerritory("");
    setSelectedCommunities([]);
    setSelectedFilieres([]);
    setSelectedValueChains([]);
    setSelectedProjects([]);
    setSelectedOutcomes([]);
    setSelectedOpportunities([]);
    setSelectedServices([]);
    setIsOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingChallenge(c);
    setTitle(c.title || "");
    setDescription(c.description || "");
    setType(c.type || CHALLENGE_TYPES[0]);
    setPriority(c.priority || "MEDIUM");
    setStatus(c.status || "ACTIVE");
    setImpact(c.impact || "");
    setTerritory(c.territory || "");
    setSelectedCommunities(c.communities?.map((item: any) => item.id) || []);
    setSelectedFilieres(c.filieres?.map((item: any) => item.id) || []);
    setSelectedValueChains(c.valueChains?.map((item: any) => item.id) || []);
    setSelectedProjects(c.projects?.map((item: any) => item.id) || []);
    setSelectedOutcomes(c.outcomes?.map((item: any) => item.id) || []);
    setSelectedOpportunities(c.opportunities?.map((item: any) => item.id) || []);
    setSelectedServices(c.services?.map((item: any) => item.id) || []);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description: description || null,
      type,
      priority,
      status,
      impact: impact || null,
      territory: territory || null,
      communityIds: selectedCommunities,
      filiereIds: selectedFilieres,
      valueChainIds: selectedValueChains,
      projectIds: selectedProjects,
      outcomeIds: selectedOutcomes,
      opportunityIds: selectedOpportunities,
      serviceIds: selectedServices
    };

    try {
      if (editingChallenge) {
        await updateMutation.mutateAsync({ id: editingChallenge.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving challenge:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous archiver ce défi d'écosystème ? (Soft-delete)")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleInspect = (type: string, id: number | string) => {
    setPanelType(type);
    setPanelId(id);
    setPanelOpen(true);
  };

  const toggleRelation = (id: number, list: number[], setter: React.Dispatch<React.SetStateAction<number[]>>) => {
    if (list.includes(id)) {
      setter(list.filter(item => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Défis d'Écosystème & Verrous Territoriaux"
      description="Identifiez, documentez et résolvez les verrous d'écosystème en collaboration avec les pôles, clusters et programmes de Wallonie."
      pageIcon={Target}
      breadcrumb={[{ label: "Défis d'Écosystème" }]}
    >
      <div className="space-y-6">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-glass/20 border border-muted/10 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black text-muted uppercase">Défis Enregistrés</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-black text-text">{kpis.total}</span>
              <span className="text-[10px] text-teal-500 font-bold">Total</span>
            </div>
          </div>
          <div className="bg-glass/20 border border-muted/10 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black text-muted uppercase">Défis Actifs</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-black text-rose-500">{kpis.active}</span>
              <span className="text-[10px] text-rose-500 font-bold">En cours</span>
            </div>
          </div>
          <div className="bg-glass/20 border border-muted/10 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black text-muted uppercase">Priorité Critique</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-black text-amber-500">{kpis.highPriority}</span>
              <span className="text-[10px] text-amber-500 font-bold">Haute</span>
            </div>
          </div>
          <div className="bg-glass/20 border border-muted/10 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-black text-muted uppercase">Verrous Résolus</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-2xl font-black text-emerald-500">{kpis.resolved}</span>
              <span className="text-[10px] text-emerald-500 font-bold">Résolus</span>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-glass/10 border border-muted/20 p-4 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Rechercher un défi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-xs text-text font-bold focus:outline-none focus:border-teal-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-end">
              <select
                value={selectedFilterType}
                onChange={(e) => setSelectedFilterType(e.target.value)}
                className="bg-glass border border-muted/20 rounded-xl px-2 py-1.5 text-xs text-text font-bold focus:outline-none"
              >
                <option value="ALL">Tous les types</option>
                {CHALLENGE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedFilterPriority}
                onChange={(e) => setSelectedFilterPriority(e.target.value)}
                className="bg-glass border border-muted/20 rounded-xl px-2 py-1.5 text-xs text-text font-bold focus:outline-none"
              >
                <option value="ALL">Toutes priorités</option>
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
              </select>

              <select
                value={selectedFilterStatus}
                onChange={(e) => setSelectedFilterStatus(e.target.value)}
                className="bg-glass border border-muted/20 rounded-xl px-2 py-1.5 text-xs text-text font-bold focus:outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ACTIVE">Actifs</option>
                <option value="RESOLVED">Résolus</option>
              </select>

              <button
                onClick={openCreateModal}
                className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouveau Défi
              </button>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        {challengesLoading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4" />
            Chargement des défis d'écosystème...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.length === 0 ? (
              <div className="text-center py-12 bg-glass/10 border border-muted/20 rounded-2xl text-muted text-xs">
                Aucun défi d'écosystème ne correspond à vos filtres.
              </div>
            ) : (
              filteredChallenges.map((c: any) => (
                <div 
                  key={c.id} 
                  className="p-5 rounded-2xl border border-muted/15 bg-glass/10 hover:bg-glass/20 transition-all duration-200 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          c.priority === "HIGH" 
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                            : c.priority === "MEDIUM" 
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                            : "bg-teal-500/10 text-teal-500 border border-teal-500/20"
                        }`}>
                          {c.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          c.status === "ACTIVE" 
                            ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-[9px] font-bold text-muted bg-glass px-2 py-0.5 rounded">
                          {c.type}
                        </span>
                        {c.territory && (
                          <span className="text-[9px] font-bold text-muted flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {c.territory}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-text mt-1.5">{c.title}</h3>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleInspect("ecosystemchallenge", c.id)}
                        className="p-1.5 bg-glass border border-muted/10 hover:bg-glass/50 text-muted hover:text-text rounded-xl transition-all"
                        title="Inspecter le Graphe"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 bg-glass border border-muted/10 hover:bg-glass/50 text-muted hover:text-text rounded-xl transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-glass border border-muted/10 hover:bg-glass/50 text-muted hover:text-rose-500 rounded-xl transition-all"
                        title="Archiver"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed font-medium">
                    {c.description || "Aucune description de défi n'est fournie."}
                  </p>

                  {c.impact && (
                    <div className="p-3 bg-glass/5 rounded-xl border border-muted/5 text-[11px] text-muted flex gap-2">
                      <Info className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-text block mb-0.5">Impact attendu :</span>
                        {c.impact}
                      </div>
                    </div>
                  )}

                  {/* Connected Nodes Badges */}
                  <div className="border-t border-muted/10 pt-3 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-muted">
                    {c.communities?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Network className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Communautés :</span>
                        <div className="flex gap-1">
                          {c.communities.map((comm: any) => (
                            <span 
                              key={comm.id} 
                              onClick={() => handleInspect("community", comm.id)}
                              className="px-1.5 py-0.5 bg-indigo-550/10 text-indigo-400 rounded hover:underline cursor-pointer"
                            >
                              {comm.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.filieres?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-teal-500" />
                        <span>Filières S3 :</span>
                        <div className="flex gap-1">
                          {c.filieres.map((fil: any) => (
                            <span 
                              key={fil.id} 
                              className="px-1.5 py-0.5 bg-teal-500/10 text-teal-400 rounded"
                            >
                              {fil.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.projects?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Activity className="h-3.5 w-3.5 text-blue-500" />
                        <span>Projets connectés :</span>
                        <div className="flex gap-1">
                          {c.projects.map((proj: any) => (
                            <span 
                              key={proj.id} 
                              onClick={() => handleInspect("project", proj.id)}
                              className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded hover:underline cursor-pointer"
                            >
                              {proj.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.opportunities?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileCode className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Opportunités :</span>
                        <div className="flex gap-1">
                          {c.opportunities.map((opp: any) => (
                            <span 
                              key={opp.id} 
                              onClick={() => handleInspect("opportunity", opp.id)}
                              className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded hover:underline cursor-pointer"
                            >
                              {opp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.services?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Services CPSV :</span>
                        <div className="flex gap-1">
                          {c.services.map((serv: any) => (
                            <span 
                              key={serv.id} 
                              onClick={() => handleInspect("service", serv.id)}
                              className="px-1.5 py-0.5 bg-indigo-400/10 text-indigo-400 rounded hover:underline cursor-pointer"
                            >
                              {serv.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal CRUD Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface border border-muted/30 rounded-2xl max-w-2xl w-full shadow-2xl p-6 relative my-8 flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black text-text mb-4 uppercase tracking-wider">
              {editingChallenge ? "Modifier le Défi d'Écosystème" : "Créer un Défi d'Écosystème"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-2 flex-1 scrollbar-thin">
              <div className="space-y-1">
                <label className="font-bold text-muted block uppercase text-[10px]">Titre du Défi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Sécurisation cybernétique des PME industrielles"
                  className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted block uppercase text-[10px]">Type de Défi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                  >
                    {CHALLENGE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block uppercase text-[10px]">Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                  >
                    <option value="HIGH">HAUTE</option>
                    <option value="MEDIUM">MOYENNE</option>
                    <option value="LOW">BASSE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted block uppercase text-[10px]">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted block uppercase text-[10px]">Territoire ciblé</label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    placeholder="ex: Province de Liège, Wallonie"
                    className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted block uppercase text-[10px]">Impact recherché</label>
                  <input
                    type="text"
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="ex: Réduire de 50% les attaques cyber réussies sur 12 mois"
                    className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted block uppercase text-[10px]">Description du verrou / besoin</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Décrivez précisément l'impact et la nature du blocage technologique..."
                  className="w-full bg-glass border border-muted/20 rounded-xl px-3 py-2 text-text focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Connected Relationships Form Area */}
              <div className="border-t border-muted/10 pt-4 space-y-4">
                <h4 className="font-black uppercase tracking-wider text-muted text-[10px]">Liaisons du Graphe de Connaissances</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Communities select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Communautés Rattachées</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {communities.map((comm: any) => (
                        <label key={comm.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedCommunities.includes(comm.id)}
                            onChange={() => toggleRelation(comm.id, selectedCommunities, setSelectedCommunities)}
                            className="rounded border-muted/30 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{comm.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filières select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Filières S3</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {filieres.map((fil: any) => (
                        <label key={fil.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedFilieres.includes(fil.id)}
                            onChange={() => toggleRelation(fil.id, selectedFilieres, setSelectedFilieres)}
                            className="rounded border-muted/30 text-teal-605 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{fil.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Value Chains select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Chaînes de Valeur</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {valueChains.map((vc: any) => (
                        <label key={vc.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedValueChains.includes(vc.id)}
                            onChange={() => toggleRelation(vc.id, selectedValueChains, setSelectedValueChains)}
                            className="rounded border-muted/30 text-teal-605 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{vc.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Projects select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Projets Collaboratifs</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {projects.map((proj: any) => (
                        <label key={proj.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedProjects.includes(proj.id)}
                            onChange={() => toggleRelation(proj.id, selectedProjects, setSelectedProjects)}
                            className="rounded border-muted/30 text-teal-605 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{proj.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Opportunités / Guichets</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {opportunities.map((opp: any) => (
                        <label key={opp.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedOpportunities.includes(opp.id)}
                            onChange={() => toggleRelation(opp.id, selectedOpportunities, setSelectedOpportunities)}
                            className="rounded border-muted/30 text-teal-605 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{opp.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Public Services select */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted block">Services Publics (CPSV)</label>
                    <div className="max-h-24 overflow-y-auto border border-muted/15 rounded-xl p-2 bg-glass/5 space-y-1 scrollbar-thin">
                      {publicServices.map((serv: any) => (
                        <label key={serv.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(serv.id)}
                            onChange={() => toggleRelation(serv.id, selectedServices, setSelectedServices)}
                            className="rounded border-muted/30 text-teal-605 focus:ring-teal-500"
                          />
                          <span className="font-bold text-text truncate">{serv.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-glass border border-muted/30 hover:bg-glass/55 text-text rounded-xl px-4 py-2 font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-teal-550 hover:bg-teal-600 text-white rounded-xl px-4 py-2 font-bold transition-all cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? "Sauvegarde..." 
                    : editingChallenge ? "Mettre à jour" : "Créer le Défi"}
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
