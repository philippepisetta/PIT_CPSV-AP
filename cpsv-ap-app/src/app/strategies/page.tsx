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
  Info,
  Calendar,
  Award,
  BookOpen
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITForm, { FormSection } from "@/design-system/PITForm";
import SplitLayout from "@/components/ui/SplitLayout";
import { cn } from "@/lib/utils";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";

export default function StrategiesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isEntityTypeVisible } = usePerspective();
  
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
      
      const linkedParticipations = meta.organizations
        .map((org: any) => {
          const part = org.initiativeParticipations?.find((ip: any) => ip.initiativeId === id);
          return part ? { org, role: part.role, status: part.status } : null;
        })
        .filter(Boolean);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary animate-pulse"></div>
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
      if (!isEntityTypeVisible("strategy")) return false;
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
            <div key={strat.id} className="space-y-1.5 border-l border-teal-650/20 pl-2">
              <div 
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border",
                  isSelected 
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-650 shadow-xs" 
                    : "bg-surface/50 border-muted/25 text-text hover:bg-glass/85"
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
                  <Target className="h-4 w-4 text-teal-650 shrink-0" />
                  <span className="truncate" title={strat.name}>
                    {strat.code ? `[${strat.code}] ` : ""}{strat.name}
                  </span>
                </div>
                <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400 shrink-0 ml-1">
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
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 shadow-xs"
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
                                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
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
                                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-650"
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
                                                                  ? "bg-rose-500/10 border-rose-500/30 text-rose-600"
                                                                  : "bg-transparent border-transparent hover:bg-glass/20 text-text/75"
                                                              )}
                                                              onClick={() => setSelectedNode({ type: "initiative", id: init.id })}
                                                            >
                                                              <div className="flex items-center gap-1 min-w-0">
                                                                <Zap className="h-2 w-2 text-rose-500 shrink-0" />
                                                                <span className="truncate" title={init.name}>{init.name}</span>
                                                              </div>
                                                              <span className="text-[6px] uppercase px-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 ml-1">
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
          <h3 className="text-xs font-black uppercase text-muted tracking-wider mb-4">
            Tableau de Bord Stratégique Transverse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PITStatCard 
              label="Budget Total Programmes" 
              value={`${totalProgramsBudget.toLocaleString()} €`} 
              icon={Coins} 
              themeColor="teal" 
              description="Consolidated public programs budget"
            />
            <PITStatCard 
              label="Indicateurs d'Impact Actifs" 
              value={totalImpactsCount} 
              icon={TrendingUp} 
              themeColor="emerald" 
              description="Cumul des réalisations sur le terrain"
            />
            <PITStatCard 
              label="Opérateurs & Consortia" 
              value={uniqueOperatorsCount} 
              icon={Building2} 
              themeColor="amber" 
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
                    <span className="text-teal-650 font-bold">{(prog.budget || 0).toLocaleString()} €</span>
                  </div>
                  <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-700 to-indigo-500 rounded-full" 
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
                details.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
              )} />
              {details.status}
            </p>
          </div>

          {details.budget !== undefined && (
            <div className="border border-muted/10 rounded-xl p-3 space-y-1 bg-glass/5">
              <span className="text-[9px] uppercase font-bold text-muted">Budget Encodé</span>
              <p className="font-extrabold text-teal-650 flex items-center gap-1 mt-0.5">
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
                className="font-bold text-teal-650 flex items-center gap-1 mt-0.5 hover:underline break-all"
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
                <Building2 className="h-3.5 w-3.5 text-teal-650" />
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
                <span key={f.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400">
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    // Relations Tab Content using PITRelationsPanel
    const relationSections: any[] = [];

    if (type === "strategy") {
      relationSections.push({
        title: "Priorités Régionales",
        items: (details.linkedPriorities || []).map((p: any) => ({
          id: p.id,
          title: p.name,
          relationType: "Priorité",
          Icon: Award,
          description: p.description
        }))
      });
      relationSections.push({
        title: "Programmes Opérationnels",
        items: (details.linkedProgs || []).map((p: any) => ({
          id: p.id,
          title: p.name,
          relationType: "Programme",
          Icon: Layers,
          description: p.budget ? `Budget: ${p.budget.toLocaleString()} €` : undefined
        }))
      });
    } else if (type === "priority") {
      if (details.strategy) {
        relationSections.push({
          title: "Politique Générale",
          items: [{
            id: details.strategy.id,
            title: details.strategy.name,
            relationType: "Stratégie",
            Icon: Target
          }]
        });
      }
      relationSections.push({
        title: "Programmes Opérationnels Rattachés",
        items: (details.linkedProgs || []).map((p: any) => ({
          id: p.id,
          title: p.name,
          relationType: "Programme",
          Icon: Layers
        }))
      });
    } else if (type === "program") {
      relationSections.push({
        title: "Politiques et Priorités",
        items: [
          ...(details.linkedStrats || []).map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: "Stratégie",
            Icon: Target
          })),
          ...(details.linkedPriorities || []).map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: "Priorité",
            Icon: Award
          }))
        ]
      });
      relationSections.push({
        title: "Consortium Opérationnel (Organisations)",
        items: (details.linkedParticipations || []).map((p: any) => ({
          id: p.org.id,
          title: p.org.name,
          relationType: p.role || "Opérateur",
          Icon: Building2,
          badge: p.status
        }))
      });
    } else if (type === "initiative") {
      if (details.measure) {
        relationSections.push({
          title: "Mesure de rattachement",
          items: [{
            id: details.measure.id,
            title: details.measure.name,
            relationType: "Mesure",
            Icon: Scale,
            description: details.measure.description
          }]
        });
      }
      relationSections.push({
        title: "Services Publics Offerts (CPSV)",
        items: (details.linkedServices || []).map((s: any) => ({
          id: s.id,
          title: s.name,
          relationType: "Service Public",
          Icon: FileText,
          description: s.code
        }))
      });
    }

    const relationsTab = <PITRelationsPanel sections={relationSections} />;

    // Impact / Activity Tab Content
    const impactContent = (
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
                    <span className="font-bold text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded text-xs shrink-0">
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

    // Knowledge Assets Tab Content (Metadata)
    const knowledgeContent = (
      <div className="space-y-3 text-xs">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Actifs de Connaissance Liés (D4WMO)</h4>
        <div className="grid grid-cols-1 gap-3">
          {details.linkedKnowledge?.map((k: any) => (
            <div key={k.id} className="border border-muted/10 rounded-xl p-3.5 bg-glass/10 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-teal-650 shrink-0" />
                  <span className="font-extrabold text-text truncate">{k.title}</span>
                </div>
                <p className="text-muted text-[10px] line-clamp-2 leading-relaxed">{k.description}</p>
                <span className="inline-block text-[8px] font-bold uppercase bg-teal-500/10 text-teal-700 dark:text-teal-400 px-1.5 py-0.2 rounded mt-1">
                  {k.type}
                </span>
              </div>
              {k.url && (
                <a 
                  href={k.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-2.5 py-1 text-[10px] font-extrabold bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg shadow-xs shrink-0 cursor-pointer text-center no-underline border-0"
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
      <PITDetailLayout 
        title={details.name}
        subtitle={`${type.toUpperCase()} ${details.code ? `• Code: ${details.code}` : ""}`}
        badge={
          <span className={cn(
            "text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full",
            type === "strategy" && "bg-teal-500/10 text-teal-750",
            type === "priority" && "bg-amber-500/10 text-amber-600",
            type === "program" && "bg-indigo-500/10 text-indigo-600",
            type === "measure" && "bg-purple-500/10 text-purple-600",
            type === "initiative" && "bg-rose-500/10 text-rose-600",
          )}>
            {type}
          </span>
        }
        overviewTab={overviewContent}
        relationsTab={relationsTab}
        impactTab={impactContent}
        metadataTab={knowledgeContent}
      />
    );
  };

  // Helper form layout builders using FormSection format for PITForm
  const strategySections: FormSection[] = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Identité de la politique stratégique",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom de la stratégie *</label>
            <input required type="text" value={stratForm.name} onChange={e => setStratForm({...stratForm, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Code / Sigle</label>
              <input type="text" value={stratForm.code} onChange={e => setStratForm({...stratForm, code: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Pilote (Institution)</label>
              <select value={stratForm.ownerOrganizationId} onChange={e => setStratForm({...stratForm, ownerOrganizationId: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700">
                <option value="">Sélectionner</option>
                {meta?.organizations?.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description *</label>
            <textarea required rows={3} value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700 resize-none" />
          </div>
        </div>
      )
    },
    {
      id: "dates_links",
      title: "Dates & Références",
      subtitle: "Horizon temporel et documentation",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Date de début</label>
              <input type="date" value={stratForm.startDate} onChange={e => setStratForm({...stratForm, startDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Date de fin</label>
              <input type="date" value={stratForm.endDate} onChange={e => setStratForm({...stratForm, endDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Site Web</label>
            <input type="url" placeholder="https://" value={stratForm.website} onChange={e => setStratForm({...stratForm, website: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
          </div>
        </div>
      )
    },
    {
      id: "alignments",
      title: "Alignements S3",
      subtitle: "Filières régionales concernées",
      fields: (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Filières S3 impliquées</label>
          <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
            {meta?.strategicValueChains?.map((vc: any) => (
              <label key={vc.id} className="flex items-center gap-2 font-medium cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={stratForm.filiereS3Ids.includes(vc.id)} 
                  onChange={e => {
                    const ids = e.target.checked 
                      ? [...stratForm.filiereS3Ids, vc.id]
                      : stratForm.filiereS3Ids.filter(id => id !== vc.id);
                    setStratForm({...stratForm, filiereS3Ids: ids});
                  }}
                  className="w-3.5 h-3.5 accent-teal-650"
                />
                {vc.name}
              </label>
            ))}
          </div>
        </div>
      )
    }
  ];

  const programSections: FormSection[] = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Détails opérationnels du programme",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom du programme *</label>
            <input required type="text" value={progForm.name} onChange={e => setProgForm({...progForm, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Code</label>
              <input type="text" value={progForm.code} onChange={e => setProgForm({...progForm, code: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Institution Pilote</label>
              <select value={progForm.ownerOrganizationId} onChange={e => setProgForm({...progForm, ownerOrganizationId: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700">
                <option value="">Sélectionner</option>
                {meta?.organizations?.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description *</label>
            <textarea required rows={3} value={progForm.description} onChange={e => setProgForm({...progForm, description: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700 resize-none" />
          </div>
        </div>
      )
    },
    {
      id: "budget_dates",
      title: "Financement & Dates",
      subtitle: "Budget alloué et enveloppes temporelles",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Budget (€)</label>
              <input type="number" value={progForm.budget} onChange={e => setProgForm({...progForm, budget: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Début</label>
              <input type="date" value={progForm.startDate} onChange={e => setProgForm({...progForm, startDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Fin</label>
              <input type="date" value={progForm.endDate} onChange={e => setProgForm({...progForm, endDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-750 rounded-lg text-xs outline-none text-text focus:ring-1 focus:ring-teal-700" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "strategies",
      title: "Rattachement Stratégique",
      subtitle: "Politiques cadres reliées",
      fields: (
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Politiques rattachées (Stratégies) *</label>
          <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
            {meta?.strategies?.map((strat: any) => (
              <label key={strat.id} className="flex items-center gap-2 font-medium cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={progForm.strategyIds.includes(strat.id)} 
                  onChange={e => {
                    const ids = e.target.checked 
                      ? [...progForm.strategyIds, strat.id]
                      : progForm.strategyIds.filter(id => id !== strat.id);
                    setProgForm({...progForm, strategyIds: ids});
                  }}
                  className="w-3.5 h-3.5 accent-teal-650"
                />
                {strat.name}
              </label>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <PITLayout
      category="POLITIQUES PUBLIQUES"
      title="Gouvernance & Alignement Stratégique"
      description="Faites le lien entre les politiques stratégiques régionales (S3, Circular Wallonia) et leur déploiement sur le territoire wallon."
      pageIcon={Target}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Gouvernance" }
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsStrategyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-extrabold text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl cursor-pointer transition-all shadow-xs border-0"
          >
            <Plus className="h-4 w-4" /> Nouvelle Stratégie
          </button>
          <button 
            onClick={() => setIsProgramModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-extrabold text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl cursor-pointer transition-all shadow-xs border-0"
          >
            <Plus className="h-4 w-4" /> Nouveau Programme
          </button>
        </div>
      }
    >
      <PITFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher par nom ou code..."
        selectFilters={[
          {
            id: "filiere",
            label: "Toutes les filières S3",
            value: filterFiliere,
            onChange: setFilterFiliere,
            options: meta?.strategicValueChains?.map((f: any) => ({ value: String(f.id), label: f.name })) || []
          }
        ]}
        extraControls={
          selectedNode && (
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-xs font-extrabold text-muted hover:text-text cursor-pointer bg-glass px-3.5 py-2.5 rounded-xl border border-muted/20"
            >
              Retour au Portfolio
            </button>
          )
        }
      />

      <SplitLayout 
        leftPane={
          <div className="bg-glass border border-muted/20 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs text-text uppercase tracking-wider text-muted border-b border-muted/10 pb-2.5">
              Arborescence Stratégique (Territoire ↔ S3)
            </h3>
            {renderTree()}
          </div>
        }
        rightPane={
          selectedNode ? renderDetailCockpit() : renderTransverseDashboard()
        }
        leftColSpan={5}
      />

      {/* STRATEGY CREATION MODAL */}
      {isStrategyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/25 rounded-2xl p-6 max-w-4xl w-full relative shadow-card max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="absolute right-4 top-4 z-10">
              <button onClick={() => setIsStrategyModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer p-1.5 rounded-lg hover:bg-glass">
                <X className="h-5 w-5" />
              </button>
            </div>
            <PITForm 
              title="Créer une Nouvelle Politique Stratégique"
              sections={strategySections}
              onSubmit={handleCreateStrategy}
              onCancel={() => setIsStrategyModalOpen(false)}
              submitLabel="Créer la stratégie"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Cadre Stratégique PIT :</strong> Les stratégies représentent le plus haut niveau d'orientation politique régionale.
                  </p>
                  <p>
                    Elles s'alignent avec les objectifs européens (Pacte Vert, Décennie Numérique) et fédèrent les opérateurs régionaux autour de filières prioritaires.
                  </p>
                  <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-700 dark:text-teal-400">
                    N'oubliez pas d'indiquer l'institution publique pilote pour assurer la traçabilité de la gouvernance.
                  </div>
                </div>
              }
            />
          </div>
        </div>
      )}

      {/* PROGRAM CREATION MODAL */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface border border-muted/25 rounded-2xl p-6 max-w-4xl w-full relative shadow-card max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="absolute right-4 top-4 z-10">
              <button onClick={() => setIsProgramModalOpen(false)} className="text-muted hover:text-text border-0 bg-transparent cursor-pointer p-1.5 rounded-lg hover:bg-glass">
                <X className="h-5 w-5" />
              </button>
            </div>
            <PITForm 
              title="Créer un Nouveau Programme Opérationnel"
              sections={programSections}
              onSubmit={handleCreateProgram}
              onCancel={() => setIsProgramModalOpen(false)}
              submitLabel="Créer le programme"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Programmes & Budgets :</strong> Un programme porte une enveloppe budgétaire publique allouée à la concrétisation d'une ou plusieurs stratégies.
                  </p>
                  <p>
                    Un programme regroupe des mesures d'aide concrètes, implémentées par des agences territoriales partenaires (AWEX, AdN, WE...).
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
