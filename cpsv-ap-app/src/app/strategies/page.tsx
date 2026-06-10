// src/app/strategies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Target, 
  Layers, 
  Scale, 
  Zap, 
  Building2, 
  Globe, 
  Coins, 
  FileText, 
  TrendingUp, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  Info,
  Calendar,
  DollarSign,
  Bookmark,
  Award,
  BookOpen
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import StatCard from "@/components/ui/StatCard";
import RelationshipCard from "@/components/ui/RelationshipCard";
import Timeline from "@/components/ui/Timeline";
import { cn } from "@/lib/utils";

export default function StrategiesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data from API
  const [meta, setMeta] = useState<any>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("");

  // Navigation State (collapsibles)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  // Selected Strategic Node
  // type can be 'strategy' | 'priority' | 'program' | 'measure' | 'initiative'
  const [selectedNode, setSelectedNode] = useState<{ type: string; id: number } | null>(null);

  // Modal forms
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const [isInitiativeModalOpen, setIsInitiativeModalOpen] = useState(false);

  // Form states
  const [stratForm, setStratForm] = useState({
    name: "", code: "", description: "", ownerOrganizationId: "", startDate: "", endDate: "", status: "ACTIVE", website: "", filiereS3Ids: [] as number[], fundingIds: [] as number[]
  });
  const [progForm, setProgForm] = useState({
    name: "", code: "", description: "", ownerOrganizationId: "", startDate: "", endDate: "", budget: "", status: "PLANNED", strategyIds: [] as number[], priorityIds: [] as number[], territoryIds: [] as number[]
  });
  const [measForm, setMeasForm] = useState({
    name: "", code: "", description: "", budget: "", status: "ACTIVE", programIds: [] as number[], priorityIds: [] as number[]
  });
  const [initForm, setInitForm] = useState({
    measureId: "", name: "", code: "", description: "", leadOrganizationId: "", startDate: "", endDate: "", status: "PLANNED", priorityIds: [] as number[], ecosystemIds: [] as number[], filiereIds: [] as number[], territoryIds: [] as number[], serviceIds: [] as number[]
  });

  async function loadData() {
    try {
      const res = await fetch("/api/meta");
      if (!res.ok) throw new Error("Erreur de chargement des référentiels stratégiques.");
      const data = await res.json();
      setMeta(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "new-strategy") {
        setIsStrategyModalOpen(true);
      } else if (action === "new-program") {
        setIsProgramModalOpen(true);
      }
    }
  }, []);

  const toggleExpand = (key: string) => {
    setExpandedNodes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper selectors
  const getSelectedDetails = () => {
    if (!selectedNode || !meta) return null;
    const { type, id } = selectedNode;
    
    if (type === "strategy") {
      const strat = meta.strategies.find((s: any) => s.id === id);
      if (!strat) return null;
      // Find programs linked
      const linkedProgs = meta.programs.filter((p: any) => p.strategies?.some((s: any) => s.id === id));
      const linkedPriorities = meta.strategicPriorities.filter((p: any) => p.strategyId === id);
      const linkedFunding = meta.fundingInstruments.filter((f: any) => f.strategies?.some((s: any) => s.id === id));
      const linkedFilieres = meta.strategicValueChains.filter((f: any) => f.strategies?.some((s: any) => s.id === id));
      return { ...strat, linkedProgs, linkedPriorities, linkedFunding, linkedFilieres };
    }

    if (type === "priority") {
      const priority = meta.strategicPriorities.find((p: any) => p.id === id);
      if (!priority) return null;
      const strategy = meta.strategies.find((s: any) => s.id === priority.strategyId);
      const linkedProgs = meta.programs.filter((p: any) => p.priorities?.some((pr: any) => pr.id === id));
      const linkedMeasures = meta.measures.filter((m: any) => m.priorities?.some((pr: any) => pr.id === id));
      const linkedInits = meta.initiatives.filter((i: any) => i.priorities?.some((pr: any) => pr.id === id));
      return { ...priority, strategy, linkedProgs, linkedMeasures, linkedInits };
    }

    if (type === "program") {
      const program = meta.programs.find((p: any) => p.id === id);
      if (!program) return null;
      const owner = meta.organizations.find((o: any) => o.id === program.ownerOrganizationId);
      const linkedStrats = meta.strategies.filter((s: any) => s.programs?.some((p: any) => p.id === id));
      const linkedPriorities = meta.strategicPriorities.filter((p: any) => p.programs?.some((pr: any) => pr.id === id));
      const linkedMeasures = meta.measures.filter((m: any) => m.programs?.some((p: any) => p.id === id));
      const linkedFunding = meta.fundingInstruments.filter((f: any) => f.programs?.some((p: any) => p.id === id));
      const linkedKnowledge = meta.knowledgeAssets.filter((k: any) => k.programs?.some((p: any) => p.id === id));
      
      // Participations
      const linkedParticipations = meta.organizations
        .map((org: any) => {
          const part = meta.meta?.programParticipations?.find((pp: any) => pp.programId === id && pp.organizationId === org.id) 
            || org.programParticipations?.find((pp: any) => pp.programId === id);
          return part ? { org, role: part.role, status: part.status } : null;
        })
        .filter(Boolean);

      return { ...program, owner, linkedStrats, linkedPriorities, linkedMeasures, linkedFunding, linkedKnowledge, linkedParticipations };
    }

    if (type === "measure") {
      const measure = meta.measures.find((m: any) => m.id === id);
      if (!measure) return null;
      const linkedProgs = meta.programs.filter((p: any) => p.measures?.some((m: any) => m.id === id));
      const linkedPriorities = meta.strategicPriorities.filter((p: any) => p.measures?.some((m: any) => m.id === id));
      const linkedInits = meta.initiatives.filter((i: any) => i.measureId === id);
      const linkedFunding = meta.fundingInstruments.filter((f: any) => f.measures?.some((m: any) => m.id === id));
      return { ...measure, linkedProgs, linkedPriorities, linkedInits, linkedFunding };
    }

    if (type === "initiative") {
      const initiative = meta.initiatives.find((i: any) => i.id === id);
      if (!initiative) return null;
      const measure = meta.measures.find((m: any) => m.id === initiative.measureId);
      const leadOrg = meta.organizations.find((o: any) => o.id === initiative.leadOrganizationId);
      const linkedServices = meta.services.filter((s: any) => s.initiatives?.some((i: any) => i.id === id));
      const linkedTerritories = meta.territories.filter((t: any) => t.initiatives?.some((i: any) => i.id === id));
      const linkedEcosystems = meta.ecosystems.filter((e: any) => e.initiatives?.some((i: any) => i.id === id));
      const linkedKnowledge = meta.knowledgeAssets.filter((k: any) => k.initiatives?.some((i: any) => i.id === id));
      const linkedFunding = meta.fundingInstruments.filter((f: any) => f.initiatives?.some((i: any) => i.id === id));
      
      // Participations
      const linkedParticipations = meta.organizations
        .map((org: any) => {
          const part = org.initiativeParticipations?.find((ip: any) => ip.initiativeId === id);
          return part ? { org, role: part.role, status: part.status } : null;
        })
        .filter(Boolean);

      // Impact records linked directly to this initiative via beneficiary engagements or S3 value chains of the initiative
      const linkedEngagements = meta.beneficiaryEngagements.filter((e: any) => e.initiativeId === id);
      const linkedImpacts = meta.impacts.filter((imp: any) => 
        linkedEngagements.some((e: any) => e.beneficiaryId === imp.beneficiaryId)
      );

      return { 
        ...initiative, measure, leadOrg, linkedServices, linkedTerritories, 
        linkedEcosystems, linkedKnowledge, linkedFunding, linkedParticipations,
        linkedEngagements, linkedImpacts
      };
    }

    return null;
  };

  // Submit creators
  const handleCreateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stratForm),
      });
      if (!res.ok) throw new Error("Erreur de création de la stratégie");
      setIsStrategyModalOpen(false);
      setStratForm({
        name: "", code: "", description: "", ownerOrganizationId: "", startDate: "", endDate: "", status: "ACTIVE", website: "", filiereS3Ids: [], fundingIds: []
      });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...progForm,
          budget: progForm.budget ? parseFloat(progForm.budget) : null
        }),
      });
      if (!res.ok) throw new Error("Erreur de création du programme");
      setIsProgramModalOpen(false);
      setProgForm({
        name: "", code: "", description: "", ownerOrganizationId: "", startDate: "", endDate: "", budget: "", status: "PLANNED", strategyIds: [], priorityIds: [], territoryIds: []
      });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateMeasure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/measures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...measForm,
          budget: measForm.budget ? parseFloat(measForm.budget) : null
        }),
      });
      if (!res.ok) throw new Error("Erreur de création de la mesure");
      setIsMeasureModalOpen(false);
      setMeasForm({
        name: "", code: "", description: "", budget: "", status: "ACTIVE", programIds: [], priorityIds: []
      });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initForm),
      });
      if (!res.ok) throw new Error("Erreur de création de l'initiative");
      setIsInitiativeModalOpen(false);
      setInitForm({
        measureId: "", name: "", code: "", description: "", leadOrganizationId: "", startDate: "", endDate: "", status: "PLANNED", priorityIds: [], ecosystemIds: [], filiereIds: [], territoryIds: [], serviceIds: []
      });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de la gouvernance stratégique...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold mb-2">Erreur de chargement</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Derived dashboard metrics (Transverse Portfolio)
  const totalProgramsBudget = meta.programs.reduce((acc: number, p: any) => acc + (p.budget || 0), 0);
  const totalImpactsCount = meta.impacts.length;
  const activePrograms = meta.programs.filter((p: any) => p.status === "ACTIVE" || p.status === "ACTIVE" || p.status === "ACTIVE");
  const uniqueOperatorsCount = new Set([
    ...meta.programs.map((p: any) => p.ownerOrganizationId),
    ...meta.initiatives.map((i: any) => i.leadOrganizationId)
  ].filter(Boolean)).size;

  // Filter strategies, programs, measures, initiatives in tree
  const filterBySearch = (name: string, code: string) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (name && name.toLowerCase().includes(query)) || (code && code.toLowerCase().includes(query));
  };

  const getFilteredStrategies = () => {
    return meta.strategies.filter((s: any) => {
      const matchSearch = filterBySearch(s.name, s.code);
      if (filterFiliere) {
        return matchSearch && s.filieresS3?.some((f: any) => f.id === parseInt(filterFiliere));
      }
      return matchSearch;
    });
  };

  // Render tree item
  const renderTree = () => {
    const filteredStrats = getFilteredStrategies();

    if (filteredStrats.length === 0) {
      return (
        <div className="text-xs text-muted italic text-center p-6 border border-dashed border-muted/20 rounded-xl bg-glass">
          Aucun référentiel stratégique trouvé.
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
        {filteredStrats.map((strat: any) => {
          const stratKey = `strat-${strat.id}`;
          const isStratExpanded = expandedNodes[stratKey];
          const isSelected = selectedNode?.type === "strategy" && selectedNode.id === strat.id;
          const stratPriorities = meta.strategicPriorities.filter((p: any) => p.strategyId === strat.id);

          return (
            <div key={strat.id} className="space-y-1.5 border-l-2 border-teal-500/10 pl-2">
              <div 
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border",
                  isSelected 
                    ? "bg-primary/10 border-primary/40 text-primary shadow-sm" 
                    : "bg-surface/50 border-muted/20 text-text hover:bg-glass/80"
                )}
                onClick={() => setSelectedNode({ type: "strategy", id: strat.id })}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleExpand(stratKey); }}
                    className="p-0.5 rounded hover:bg-muted/10 cursor-pointer bg-transparent border-0 text-muted"
                  >
                    {isStratExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                  <Target className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate" title={strat.name}>
                    {strat.code ? `[${strat.code}] ` : ""}{strat.name}
                  </span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 ml-1">
                  Stratégie
                </span>
              </div>

              {isStratExpanded && (
                <div className="pl-3 space-y-1.5">
                  {stratPriorities.length === 0 ? (
                    <p className="text-[10px] text-muted italic pl-6">Aucune priorité définie.</p>
                  ) : (
                    stratPriorities.map((prior: any) => {
                      const priorKey = `prior-${prior.id}`;
                      const isPriorExpanded = expandedNodes[priorKey];
                      const isPriorSelected = selectedNode?.type === "priority" && selectedNode.id === prior.id;
                      
                      // Find programs linked to this priority, or programs of strategy linked to priority
                      const priorProgs = meta.programs.filter((p: any) => 
                        p.priorities?.some((pr: any) => pr.id === prior.id) ||
                        (p.strategies?.some((s: any) => s.id === strat.id) && prior.strategyId === strat.id)
                      );

                      return (
                        <div key={prior.id} className="space-y-1 border-l border-amber-500/20 pl-2">
                          <div 
                            className={cn(
                              "flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors",
                              isPriorSelected
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs"
                                : "bg-transparent border-transparent hover:bg-glass/50 text-text/90"
                            )}
                            onClick={() => setSelectedNode({ type: "priority", id: prior.id })}
                          >
                            <div className="flex items-center gap-1 min-w-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleExpand(priorKey); }}
                                className="p-0.5 rounded hover:bg-muted/10 cursor-pointer bg-transparent border-0 text-muted"
                              >
                                {isPriorExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              </button>
                              <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span className="truncate" title={prior.name}>{prior.name}</span>
                            </div>
                            <span className="text-[8px] uppercase px-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 ml-1">
                              Priorité
                            </span>
                          </div>

                          {isPriorExpanded && (
                            <div className="pl-3 space-y-1">
                              {priorProgs.length === 0 ? (
                                <p className="text-[9px] text-muted italic pl-5">Aucun programme.</p>
                              ) : (
                                priorProgs.map((prog: any) => {
                                  const progKey = `prog-${prog.id}`;
                                  const isProgExpanded = expandedNodes[progKey];
                                  const isProgSelected = selectedNode?.type === "program" && selectedNode.id === prog.id;
                                  const progMeasures = meta.measures.filter((m: any) => m.programs?.some((p: any) => p.id === prog.id));

                                  return (
                                    <div key={prog.id} className="space-y-1 border-l border-indigo-500/20 pl-2">
                                      <div 
                                        className={cn(
                                          "flex items-center justify-between p-1 rounded-lg text-[11px] font-medium cursor-pointer border transition-colors",
                                          isProgSelected
                                            ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                                            : "bg-transparent border-transparent hover:bg-glass/40 text-text/85"
                                        )}
                                        onClick={() => setSelectedNode({ type: "program", id: prog.id })}
                                      >
                                        <div className="flex items-center gap-1 min-w-0">
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); toggleExpand(progKey); }}
                                            className="p-0.5 rounded hover:bg-muted/10 cursor-pointer bg-transparent border-0 text-muted"
                                          >
                                            {isProgExpanded ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
                                          </button>
                                          <Layers className="h-3 w-3 text-indigo-500 shrink-0" />
                                          <span className="truncate" title={prog.name}>{prog.name}</span>
                                        </div>
                                        <span className="text-[8px] uppercase px-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1">
                                          Prog
                                        </span>
                                      </div>

                                      {isProgExpanded && (
                                        <div className="pl-3 space-y-1">
                                          {progMeasures.length === 0 ? (
                                            <p className="text-[9px] text-muted italic pl-4">Aucune mesure.</p>
                                          ) : (
                                            progMeasures.map((meas: any) => {
                                              const measKey = `meas-${meas.id}`;
                                              const isMeasExpanded = expandedNodes[measKey];
                                              const isMeasSelected = selectedNode?.type === "measure" && selectedNode.id === meas.id;
                                              const measInits = meta.initiatives.filter((i: any) => i.measureId === meas.id);

                                              return (
                                                <div key={meas.id} className="space-y-0.5 border-l border-purple-500/20 pl-2">
                                                  <div 
                                                    className={cn(
                                                      "flex items-center justify-between p-1 rounded-md text-[10px] cursor-pointer border transition-colors",
                                                      isMeasSelected
                                                        ? "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400"
                                                        : "bg-transparent border-transparent hover:bg-glass/30 text-text/80"
                                                    )}
                                                    onClick={() => setSelectedNode({ type: "measure", id: meas.id })}
                                                  >
                                                    <div className="flex items-center gap-1 min-w-0">
                                                      <button 
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(measKey); }}
                                                        className="p-0.5 rounded hover:bg-muted/10 cursor-pointer bg-transparent border-0 text-muted"
                                                      >
                                                        {isMeasExpanded ? <ChevronDown className="h-2 w-2" /> : <ChevronRight className="h-2 w-2" />}
                                                      </button>
                                                      <Scale className="h-2.5 w-2.5 text-purple-500 shrink-0" />
                                                      <span className="truncate" title={meas.name}>{meas.name}</span>
                                                    </div>
                                                    <span className="text-[7px] uppercase px-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 ml-1">
                                                      Mesure
                                                    </span>
                                                  </div>

                                                  {isMeasExpanded && (
                                                    <div className="pl-3 space-y-0.5">
                                                      {measInits.length === 0 ? (
                                                        <p className="text-[8px] text-muted italic pl-3">Aucune initiative.</p>
                                                      ) : (
                                                        measInits.map((init: any) => {
                                                          const isInitSelected = selectedNode?.type === "initiative" && selectedNode.id === init.id;
                                                          return (
                                                            <div 
                                                              key={init.id}
                                                              className={cn(
                                                                "flex items-center justify-between p-0.5 px-1.5 rounded-md text-[9px] cursor-pointer border transition-colors",
                                                                isInitSelected
                                                                  ? "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400"
                                                                  : "bg-transparent border-transparent hover:bg-glass/20 text-text/75"
                                                              )}
                                                              onClick={() => setSelectedNode({ type: "initiative", id: init.id })}
                                                            >
                                                              <div className="flex items-center gap-1 min-w-0">
                                                                <Zap className="h-2 w-2 text-rose-500 shrink-0" />
                                                                <span className="truncate" title={init.name}>{init.name}</span>
                                                              </div>
                                                              <span className="text-[6px] uppercase px-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-455 shrink-0 ml-1">
                                                                Init
                                                               </span>
                                                            </div>
                                                          );
                                                        })
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render transverse dashboard on the right pane
  const renderTransverseDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 shadow-xs">
          <h3 className="text-sm font-black uppercase text-muted tracking-wider mb-4">
            Tableau de Bord Stratégique Transverse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              label="Budget Total Programmes" 
              value={`${totalProgramsBudget.toLocaleString()} €`} 
              Icon={Coins} 
              color="teal" 
              description="Consolidated public programs budget"
            />
            <StatCard 
              label="Indicateurs d'Impact Actifs" 
              value={totalImpactsCount} 
              Icon={TrendingUp} 
              color="emerald" 
              description="Cumul des réalisations sur le terrain"
            />
            <StatCard 
              label="Opérateurs & Consortia" 
              value={uniqueOperatorsCount} 
              Icon={Building2} 
              color="amber" 
              description="Acteurs publics mobilisés"
            />
          </div>
        </div>

        {/* Budgets by program */}
        <div className="bg-glass/20 border border-muted/15 rounded-2xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
            Répartition Budgétaire par Programme
          </h4>
          <div className="space-y-3">
            {meta.programs.filter((p: any) => p.budget).map((prog: any) => {
              const maxBudget = Math.max(...meta.programs.map((p: any) => p.budget || 0));
              const pct = maxBudget > 0 ? (prog.budget / maxBudget) * 100 : 0;
              return (
                <div key={prog.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text truncate max-w-[280px]">{prog.name}</span>
                    <span className="text-primary font-bold">{(prog.budget || 0).toLocaleString()} €</span>
                  </div>
                  <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
            {meta.programs.filter((p: any) => p.budget).length === 0 && (
              <p className="text-xs text-muted italic">Aucun budget encodé dans les programmes.</p>
            )}
          </div>
        </div>

        {/* S3 value chain strategic alignments */}
        <div className="bg-glass/20 border border-muted/15 rounded-2xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
            Alignement Sémantique Filières S3
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meta.strategicValueChains.map((vc: any) => {
              // Count how many strategies / programs / initiatives are connected
              const connectedStrats = meta.strategies.filter((s: any) => s.filieresS3?.some((f: any) => f.id === vc.id)).length;
              const connectedProgs = meta.programs.filter((p: any) => p.filieresS3?.some((f: any) => f.id === vc.id)).length;
              const connectedInits = meta.initiatives.filter((i: any) => i.filieresS3?.some((f: any) => f.id === vc.id)).length;
              const sum = connectedStrats + connectedProgs + connectedInits;
              return (
                <div key={vc.id} className="border border-muted/10 rounded-xl p-3 bg-glass/10 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-text">{vc.name}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      {sum} liens
                    </span>
                  </div>
                  <p className="text-[10px] text-muted line-clamp-2 leading-relaxed">{vc.description || "Pas de description"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render detail cockpit panel for selected strategic node
  const renderDetailCockpit = () => {
    const details = getSelectedDetails();
    if (!details) {
      return (
        <div className="text-center py-12 bg-glass border border-muted/20 border-dashed rounded-2xl p-6">
          <Info className="h-8 w-8 text-muted mx-auto mb-2 animate-bounce" />
          <p className="text-xs text-muted italic">Élément introuvable ou supprimé.</p>
        </div>
      );
    }

    const { type } = selectedNode!;

    // Overview Tab Content
    const overviewContent = (
      <div className="space-y-4 text-xs">
        <div className="bg-glass/10 border border-muted/10 rounded-xl p-4 space-y-2">
          <h4 className="font-extrabold text-text uppercase text-[10px] tracking-wider text-muted">Description</h4>
          <p className="text-text leading-relaxed whitespace-pre-line">
            {details.description || "Aucune description fournie pour cet élément."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5">
            <span className="text-[9px] uppercase font-bold text-muted">Statut</span>
            <p className="font-extrabold text-text flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "h-2 w-2 rounded-full",
                details.status === "ACTIVE" || details.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
              )} />
              {details.status}
            </p>
          </div>

          {details.budget !== undefined && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5">
              <span className="text-[9px] uppercase font-bold text-muted">Budget Encodé</span>
              <p className="font-extrabold text-primary flex items-center gap-1 mt-0.5">
                <Coins className="h-3.5 w-3.5" />
                {details.budget ? `${details.budget.toLocaleString()} €` : "Non spécifié"}
              </p>
            </div>
          )}

          {details.startDate && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5">
              <span className="text-[9px] uppercase font-bold text-muted">Date de début</span>
              <p className="font-bold text-text flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-muted" />
                {new Date(details.startDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {details.endDate && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5">
              <span className="text-[9px] uppercase font-bold text-muted">Date de fin</span>
              <p className="font-bold text-text flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-muted" />
                {new Date(details.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {details.website && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5 col-span-1 md:col-span-2">
              <span className="text-[9px] uppercase font-bold text-muted">Site Web Officiel</span>
              <a 
                href={details.website} 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-0.5 hover:underline break-all"
              >
                <Globe className="h-3.5 w-3.5" />
                {details.website}
              </a>
            </div>
          )}

          {details.ownerOrganization && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5 col-span-1 md:col-span-2">
              <span className="text-[9px] uppercase font-bold text-muted">Pilote de la Politique</span>
              <p className="font-bold text-text flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                {details.ownerOrganization.name}
              </p>
            </div>
          )}
        </div>

        {details.linkedFilieres?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-bold text-muted">Filières S3 Alignées</span>
            <div className="flex flex-wrap gap-1.5">
              {details.linkedFilieres.map((f: any) => (
                <span key={f.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    // Relations Tab Content
    const relationsContent = (
      <div className="space-y-4">
        {type === "strategy" && (
          <>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Priorités Régionales</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedPriorities?.map((p: any) => (
                  <RelationshipCard 
                    key={p.id} 
                    title={p.name} 
                    relationType="Priorité" 
                    Icon={Award} 
                    description={p.description}
                  />
                ))}
                {details.linkedPriorities?.length === 0 && <p className="text-xs text-muted italic">Aucune priorité.</p>}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Programmes Stratégiques</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedProgs?.map((p: any) => (
                  <RelationshipCard 
                    key={p.id} 
                    title={p.name} 
                    relationType="Programme" 
                    Icon={Layers} 
                    description={p.budget ? `Budget: ${p.budget.toLocaleString()} €` : undefined}
                  />
                ))}
                {details.linkedProgs?.length === 0 && <p className="text-xs text-muted italic">Aucun programme.</p>}
              </div>
            </div>
          </>
        )}

        {type === "priority" && (
          <>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Politique Générale</h4>
              <RelationshipCard 
                title={details.strategy?.name} 
                relationType="Stratégie" 
                Icon={Target} 
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Programmes rattachés</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedProgs?.map((p: any) => (
                  <RelationshipCard 
                    key={p.id} 
                    title={p.name} 
                    relationType="Programme" 
                    Icon={Layers} 
                  />
                ))}
                {details.linkedProgs?.length === 0 && <p className="text-xs text-muted italic">Aucun programme.</p>}
              </div>
            </div>
          </>
        )}

        {type === "program" && (
          <>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Politiques et Priorités</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedStrats?.map((s: any) => (
                  <RelationshipCard key={s.id} title={s.name} relationType="Stratégie" Icon={Target} />
                ))}
                {details.linkedPriorities?.map((p: any) => (
                  <RelationshipCard key={p.id} title={p.name} relationType="Priorité" Icon={Award} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Consortium Opérationnel (Organisations)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedParticipations?.map((p: any) => (
                  <RelationshipCard 
                    key={p.org.id} 
                    title={p.org.name} 
                    relationType={p.role || "Opérateur"} 
                    Icon={Building2} 
                    badge={p.status}
                  />
                ))}
                {details.linkedParticipations?.length === 0 && <p className="text-xs text-muted italic">Aucun opérateur enrôlé.</p>}
              </div>
            </div>
          </>
        )}

        {type === "initiative" && (
          <>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Mesure de rattachement</h4>
              {details.measure && (
                <RelationshipCard 
                  title={details.measure.name} 
                  relationType="Mesure" 
                  Icon={Scale} 
                  description={details.measure.description}
                />
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Services Publics Offerts (CPSV)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.linkedServices?.map((s: any) => (
                  <RelationshipCard 
                    key={s.id} 
                    title={s.name} 
                    relationType="Service Public" 
                    Icon={FileText} 
                    description={s.code}
                  />
                ))}
                {details.linkedServices?.length === 0 && <p className="text-xs text-muted italic">Aucun service public.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    );

    // Activity & Impacts Tab Content
    const activityContent = (
      <div className="space-y-4">
        {type === "initiative" ? (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Impacts Enregistrés de l'Initiative</h4>
            <div className="space-y-3">
              {details.linkedImpacts?.map((imp: any) => {
                const ind = meta.outcomeIndicators.find((i: any) => i.id === imp.indicatorId);
                return (
                  <div key={imp.id} className="bg-glass/10 border border-muted/10 rounded-xl p-3 flex justify-between items-start text-xs">
                    <div className="space-y-1">
                      <span className="font-extrabold text-text">{imp.beneficiary?.name}</span>
                      <p className="text-muted text-[10px]">{ind?.name}</p>
                      {imp.textValue && <p className="text-text italic font-medium mt-1">{imp.textValue}</p>}
                    </div>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs shrink-0">
                      {imp.numericValue !== null ? `${imp.numericValue} ${ind?.unit || ""}` : "Validé"}
                    </span>
                  </div>
                );
              })}
              {details.linkedImpacts?.length === 0 && (
                <p className="text-xs text-muted italic">Aucun impact mesuré directement sur cette initiative.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted italic p-4 text-center border border-dashed border-muted/20 rounded-xl">
            Les impacts fins sont enregistrés au niveau des Initiatives territoriales correspondantes.
          </div>
        )}
      </div>
    );

    // Knowledge Assets Tab Content
    const knowledgeContent = (
      <div className="space-y-3 text-xs">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Actifs de Connaissance Liés (D4WMO)</h4>
        <div className="grid grid-cols-1 gap-3">
          {details.linkedKnowledge?.map((k: any) => (
            <div key={k.id} className="border border-muted/10 rounded-xl p-3.5 bg-glass/10 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="font-extrabold text-text truncate">{k.title}</span>
                </div>
                <p className="text-muted text-[10px] line-clamp-2 leading-relaxed">{k.description}</p>
                <span className="inline-block text-[8px] font-bold uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 py-0.2 rounded mt-1">
                  {k.type}
                </span>
              </div>
              {k.url && (
                <a 
                  href={k.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-2.5 py-1 text-[10px] font-extrabold bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-xs shrink-0 cursor-pointer"
                >
                  Ouvrir
                </a>
              )}
            </div>
          ))}
          {(!details.linkedKnowledge || details.linkedKnowledge.length === 0) && (
            <p className="text-xs text-muted italic p-3 text-center">Aucun document ou actif de connaissance lié.</p>
          )}
        </div>
      </div>
    );

    return (
      <EntityDetailPanel 
        title={details.name}
        subtitle={`${type.toUpperCase()} ${details.code ? `• Code: ${details.code}` : ""}`}
        badge={
          <span className={cn(
            "text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full",
            type === "strategy" && "bg-teal-500/10 text-teal-600 dark:text-teal-400",
            type === "priority" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            type === "program" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            type === "measure" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            type === "initiative" && "bg-rose-500/10 text-rose-600 dark:text-rose-455",
          )}>
            {type}
          </span>
        }
        overviewTab={overviewContent}
        relationsTab={relationsContent}
        activityTab={activityContent}
        metadataTab={knowledgeContent}
      />
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Gouvernance & Alignement Stratégique" 
        description="Faites le lien entre les politiques stratégiques (S3, Circular Wallonia) et leur déploiement sur le territoire wallon."
        Icon={Target}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setIsStrategyModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Nouvelle Stratégie
            </button>
            <button 
              onClick={() => setIsProgramModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Nouveau Programme
            </button>
            <button 
              onClick={() => setIsMeasureModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Nouvelle Mesure
            </button>
            <button 
              onClick={() => setIsInitiativeModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Nouvelle Initiative
            </button>
          </div>
        }
      />

      <PageToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par nom ou code..."
        filterValue={filterFiliere}
        onFilterChange={setFilterFiliere}
        filterLabel="Toutes les filières S3"
        filterOptions={meta.strategicValueChains.map((f: any) => ({ value: String(f.id), label: f.name }))}
        extraControls={
          selectedNode && (
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-xs font-extrabold text-muted hover:text-text cursor-pointer bg-glass px-3 py-1.5 rounded-lg border border-muted/20"
            >
              Retour au Portfolio
            </button>
          )
        }
      />

      <SplitLayout 
        leftPane={
          <div className="bg-glass border border-muted/20 rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-text uppercase tracking-wider text-muted border-b border-muted/10 pb-2">
              Arborescence Stratégique (Territoire ↔ S3)
            </h3>
            {renderTree()}
          </div>
        }
        rightPane={
          selectedNode ? renderDetailCockpit() : renderTransverseDashboard()
        }
      />

      {/* STRATEGY CREATION MODAL */}
      {isStrategyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/20 rounded-2xl p-6 max-w-lg w-full relative shadow-card space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-muted/20 pb-3">
              <h3 className="text-sm font-black text-text uppercase flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                Créer une Nouvelle Politique Stratégique
              </h3>
              <button onClick={() => setIsStrategyModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStrategy} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted">Nom de la stratégie *</label>
                <input required type="text" value={stratForm.name} onChange={e => setStratForm({...stratForm, name: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Code / Sigle</label>
                  <input type="text" value={stratForm.code} onChange={e => setStratForm({...stratForm, code: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Pilote (Institution)</label>
                  <select value={stratForm.ownerOrganizationId} onChange={e => setStratForm({...stratForm, ownerOrganizationId: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text">
                    <option value="">Sélectionner</option>
                    {meta.organizations.map((o: any) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Description *</label>
                <textarea required rows={3} value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de début</label>
                  <input type="date" value={stratForm.startDate} onChange={e => setStratForm({...stratForm, startDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de fin</label>
                  <input type="date" value={stratForm.endDate} onChange={e => setStratForm({...stratForm, endDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Site Web</label>
                <input type="url" placeholder="https://" value={stratForm.website} onChange={e => setStratForm({...stratForm, website: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Filières S3 impliquées</label>
                <div className="grid grid-cols-2 gap-1.5 p-2 border border-muted/20 rounded-lg bg-glass/10">
                  {meta.strategicValueChains.map((vc: any) => (
                    <label key={vc.id} className="flex items-center gap-1.5 font-medium cursor-pointer text-[10px]">
                      <input 
                        type="checkbox" 
                        checked={stratForm.filiereS3Ids.includes(vc.id)} 
                        onChange={e => {
                          const ids = e.target.checked 
                            ? [...stratForm.filiereS3Ids, vc.id]
                            : stratForm.filiereS3Ids.filter(id => id !== vc.id);
                          setStratForm({...stratForm, filiereS3Ids: ids});
                        }} 
                      />
                      {vc.name}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-2 rounded-lg transition-colors cursor-pointer shadow-xs">
                Valider et Créer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROGRAM CREATION MODAL */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/20 rounded-2xl p-6 max-w-lg w-full relative shadow-card space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-muted/20 pb-3">
              <h3 className="text-sm font-black text-text uppercase flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Créer un Nouveau Programme Opérationnel
              </h3>
              <button onClick={() => setIsProgramModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted">Nom du programme *</label>
                <input required type="text" value={progForm.name} onChange={e => setProgForm({...progForm, name: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Code</label>
                  <input type="text" value={progForm.code} onChange={e => setProgForm({...progForm, code: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Institution Pilote</label>
                  <select value={progForm.ownerOrganizationId} onChange={e => setProgForm({...progForm, ownerOrganizationId: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text">
                    <option value="">Sélectionner</option>
                    {meta.organizations.map((o: any) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Description *</label>
                <textarea required rows={3} value={progForm.description} onChange={e => setProgForm({...progForm, description: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Budget (€)</label>
                  <input type="number" value={progForm.budget} onChange={e => setProgForm({...progForm, budget: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de début</label>
                  <input type="date" value={progForm.startDate} onChange={e => setProgForm({...progForm, startDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de fin</label>
                  <input type="date" value={progForm.endDate} onChange={e => setProgForm({...progForm, endDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Politiques rattachées (Stratégies) *</label>
                <div className="grid grid-cols-2 gap-1.5 p-2 border border-muted/20 rounded-lg bg-glass/10">
                  {meta.strategies.map((strat: any) => (
                    <label key={strat.id} className="flex items-center gap-1.5 font-medium cursor-pointer text-[10px]">
                      <input 
                        type="checkbox" 
                        checked={progForm.strategyIds.includes(strat.id)} 
                        onChange={e => {
                          const ids = e.target.checked 
                            ? [...progForm.strategyIds, strat.id]
                            : progForm.strategyIds.filter(id => id !== strat.id);
                          setProgForm({...progForm, strategyIds: ids});
                        }} 
                      />
                      {strat.name}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2 rounded-lg transition-colors cursor-pointer shadow-xs">
                Créer le Programme
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MEASURE CREATION MODAL */}
      {isMeasureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/20 rounded-2xl p-6 max-w-lg w-full relative shadow-card space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-muted/20 pb-3">
              <h3 className="text-sm font-black text-text uppercase flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Créer une Nouvelle Mesure
              </h3>
              <button onClick={() => setIsMeasureModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMeasure} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted">Nom de la mesure *</label>
                <input required type="text" value={measForm.name} onChange={e => setMeasForm({...measForm, name: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Code</label>
                  <input type="text" value={measForm.code} onChange={e => setMeasForm({...measForm, code: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Budget (€)</label>
                  <input type="number" value={measForm.budget} onChange={e => setMeasForm({...measForm, budget: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Description *</label>
                <textarea required rows={3} value={measForm.description} onChange={e => setMeasForm({...measForm, description: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Programmes rattachés *</label>
                <div className="grid grid-cols-2 gap-1.5 p-2 border border-muted/20 rounded-lg bg-glass/10">
                  {meta.programs.map((p: any) => (
                    <label key={p.id} className="flex items-center gap-1.5 font-medium cursor-pointer text-[10px]">
                      <input 
                        type="checkbox" 
                        checked={measForm.programIds.includes(p.id)} 
                        onChange={e => {
                          const ids = e.target.checked 
                            ? [...measForm.programIds, p.id]
                            : measForm.programIds.filter(id => id !== p.id);
                          setMeasForm({...measForm, programIds: ids});
                        }} 
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-2 rounded-lg transition-colors cursor-pointer shadow-xs">
                Créer la Mesure
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INITIATIVE CREATION MODAL */}
      {isInitiativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/20 rounded-2xl p-6 max-w-lg w-full relative shadow-card space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-muted/20 pb-3">
              <h3 className="text-sm font-black text-text uppercase flex items-center gap-2">
                <Zap className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                Créer une Nouvelle Initiative Territoriale
              </h3>
              <button onClick={() => setIsInitiativeModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInitiative} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-muted">Nom de l'initiative *</label>
                  <input required type="text" value={initForm.name} onChange={e => setInitForm({...initForm, name: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Mesure de rattachement *</label>
                  <select required value={initForm.measureId} onChange={e => setInitForm({...initForm, measureId: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text">
                    <option value="">Sélectionner</option>
                    {meta.measures.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Code</label>
                  <input type="text" value={initForm.code} onChange={e => setInitForm({...initForm, code: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted">Description *</label>
                <textarea required rows={2} value={initForm.description} onChange={e => setInitForm({...initForm, description: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Lead Opérateur</label>
                  <select value={initForm.leadOrganizationId} onChange={e => setInitForm({...initForm, leadOrganizationId: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text">
                    <option value="">Sélectionner</option>
                    {meta.organizations.map((o: any) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de début</label>
                  <input type="date" value={initForm.startDate} onChange={e => setInitForm({...initForm, startDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Date de fin</label>
                  <input type="date" value={initForm.endDate} onChange={e => setInitForm({...initForm, endDate: e.target.value})} className="w-full bg-glass border border-muted/30 rounded-lg p-2 text-text" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted">Territoires Couverts</label>
                  <div className="max-h-[100px] overflow-y-auto p-1.5 border border-muted/20 rounded-lg bg-glass/10">
                    {meta.territories.map((t: any) => (
                      <label key={t.id} className="flex items-center gap-1.5 font-medium cursor-pointer text-[9px] mb-0.5">
                        <input 
                          type="checkbox" 
                          checked={initForm.territoryIds.includes(t.id)} 
                          onChange={e => {
                            const ids = e.target.checked 
                              ? [...initForm.territoryIds, t.id]
                              : initForm.territoryIds.filter(id => id !== t.id);
                            setInitForm({...initForm, territoryIds: ids});
                          }} 
                        />
                        {t.name} ({t.type})
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted">Services Publics (CPSV)</label>
                  <div className="max-h-[100px] overflow-y-auto p-1.5 border border-muted/20 rounded-lg bg-glass/10">
                    {meta.services.map((s: any) => (
                      <label key={s.id} className="flex items-center gap-1.5 font-medium cursor-pointer text-[9px] mb-0.5">
                        <input 
                          type="checkbox" 
                          checked={initForm.serviceIds.includes(s.id)} 
                          onChange={e => {
                            const ids = e.target.checked 
                              ? [...initForm.serviceIds, s.id]
                              : initForm.serviceIds.filter(id => id !== s.id);
                            setInitForm({...initForm, serviceIds: ids});
                          }} 
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2 rounded-lg transition-colors cursor-pointer shadow-xs">
                Créer l'Initiative
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
