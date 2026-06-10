// src/app/pilotage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, 
  MapPin, 
  TrendingUp, 
  Building2, 
  Coins, 
  Award, 
  Zap, 
  HelpCircle, 
  Target, 
  FileText,
  Users,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Layers,
  Scale
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import StatCard from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

export default function PilotagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API Data
  const [pilotageData, setPilotageData] = useState<any>(null);
  const [metaData, setMetaData] = useState<any>(null);

  // Filters
  const [filiereFilter, setFiliereFilter] = useState("");
  const [territoryFilter, setTerritoryFilter] = useState("");

  // Question navigation state
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  async function fetchPilotageData() {
    try {
      setLoading(true);
      
      // Construct query parameters
      const params = new URLSearchParams();
      if (filiereFilter) params.append("filiereS3Id", filiereFilter);
      if (territoryFilter) params.append("territoryId", territoryFilter);

      const [pilotageRes, metaRes] = await Promise.all([
        fetch(`/api/pilotage?${params.toString()}`),
        fetch("/api/meta")
      ]);

      if (!pilotageRes.ok || !metaRes.ok) {
        throw new Error("Erreur lors de la récupération des données de pilotage.");
      }

      const pilotage = await pilotageRes.json();
      const meta = await metaRes.json();

      setPilotageData(pilotage);
      setMetaData(meta);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  }

  // Refetch data when filters change
  useEffect(() => {
    fetchPilotageData();
  }, [filiereFilter, territoryFilter]);

  if (loading && !pilotageData) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du tableau de pilotage territorial...</p>
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

  const kpis = pilotageData?.kpis || {};
  const indicatorSummary = pilotageData?.indicatorSummary || [];
  const provinceDistribution = pilotageData?.provinceDistribution || {};
  const valueChainStats = pilotageData?.valueChainStats || [];
  const latestImpacts = pilotageData?.latestImpacts || [];

  // Questions configuration
  const alignmentQuestions = [
    {
      id: 1,
      short: "1. Politiques Publiques",
      question: "Quelles politiques publiques se déploient sur le territoire ?",
      description: "Visualisez la structure des stratégies, priorités, programmes et initiatives actives en Wallonie.",
      icon: Target,
    },
    {
      id: 2,
      short: "2. Consortium d'Opérateurs",
      question: "Comment s'organisent les consortiums d'opérateurs ?",
      description: "Analysez la répartition des rôles (pilotes, financeurs, experts) entre les agences régionales et clusters.",
      icon: Building2,
    },
    {
      id: 3,
      short: "3. Budgets & Allocations",
      question: "Quels budgets sont alloués et comment sont-ils répartis ?",
      description: "Suivez les enveloppes financières associées aux programmes opérationnels et leur état de déploiement.",
      icon: Coins,
    },
    {
      id: 4,
      short: "4. Impacts & Résultats concrets",
      question: "Quels impacts (quantitatifs & qualitatifs) sont mesurés sur le terrain ?",
      description: "Mesurez les retombées directes sur la maturité des entreprises et l'atteinte des cibles d'indicateurs.",
      icon: TrendingUp,
    },
    {
      id: 5,
      short: "5. Répartition Géo & S3",
      question: "Quelle est la répartition géographique et l'alignement S3 réel ?",
      description: "Cartographiez l'intensité des interventions par province wallonne et par filière de spécialisation S3.",
      icon: MapPin,
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Pilotage Stratégique & Territorial" 
        description="Système de pilotage intelligent basé sur le graphe sémantique pour mesurer l'alignement des aides et l'impact réel des politiques publiques."
        Icon={LineChart}
      />

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 bg-glass border border-muted/20 p-4 rounded-2xl shadow-sm mb-6 items-center">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">Filtre Filière S3 :</span>
          <select
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
            className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
          >
            <option value="">Toutes les filières</option>
            {metaData?.strategicValueChains?.map((vc: any) => (
              <option key={vc.id} value={vc.id}>{vc.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/2">
          <MapPin className="h-4 w-4 text-muted shrink-0" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">Filtre Territoire :</span>
          <select
            value={territoryFilter}
            onChange={(e) => setTerritoryFilter(e.target.value)}
            className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
          >
            <option value="">Tous les territoires</option>
            {metaData?.territories?.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 ALIGNMENT QUESTIONS NAV SELECTOR */}
      <div className="bg-glass/40 border border-muted/15 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">
            Questions d'Alignement Stratégique Territorial (5 Questions Clés)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {alignmentQuestions.map((q) => {
            const Icon = q.icon;
            const isActive = activeQuestion === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all duration-200",
                  isActive 
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10" 
                    : "bg-surface/50 border-muted/20 text-text hover:bg-glass/80"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-primary")} />
                <span className="text-[10px] font-black tracking-tight leading-tight">{q.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTION EXPLANATION BANNER */}
      <div className="bg-glass border border-muted/20 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-text uppercase flex items-center gap-2">
            {alignmentQuestions[activeQuestion - 1].question}
          </h2>
          <p className="text-xs text-muted mt-1">
            {alignmentQuestions[activeQuestion - 1].description}
          </p>
        </div>

        {/* LOADING STATE FOR QUESTION INNER CONTENTS */}
        {loading && (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        )}

        {/* QUESTION CONTENT 1: PUBLIC POLICIES DEPLOYMENT */}
        {!loading && activeQuestion === 1 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <StatCard label="Stratégies Globales" value={kpis.strategiesCount} Icon={Target} color="teal" />
              <StatCard label="Programmes Opérationnels" value={kpis.programsCount} Icon={Layers} color="blue" />
              <StatCard label="Mesures Structurantes" value={kpis.measuresCount} Icon={Scale} color="purple" />
              <StatCard label="Initiatives sur le terrain" value={kpis.initiativesCount} Icon={Zap} color="rose" />
            </div>

            <div className="border border-muted/15 rounded-xl overflow-hidden bg-glass/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-muted/20 bg-glass/25 text-[10px] uppercase font-bold text-muted">
                    <th className="p-3">Sigle / Code</th>
                    <th className="p-3">Nom de la Politique</th>
                    <th className="p-3">Domaines S3</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {metaData?.strategies?.map((strat: any) => (
                    <tr key={strat.id} className="hover:bg-glass/10 transition-colors">
                      <td className="p-3 font-bold text-primary">{strat.code || "STRAT"}</td>
                      <td className="p-3">
                        <p className="font-extrabold text-text">{strat.name}</p>
                        <p className="text-muted text-[10px] line-clamp-1">{strat.description}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {strat.filieresS3?.map((f: any) => (
                            <span key={f.id} className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                              {f.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-extrabold">
                          {strat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUESTION CONTENT 2: CONSORTIUM & OPERATORS */}
        {!loading && activeQuestion === 2 && (
          <div className="space-y-4 text-xs">
            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted mb-3">
                Acteurs pilotes et consortia impliqués
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metaData?.organizations?.map((org: any) => {
                  // Count active strategies, programs and initiatives piloted by this organization
                  const stratsCount = metaData.strategies.filter((s: any) => s.ownerOrganizationId === org.id).length;
                  const progsCount = metaData.programs.filter((p: any) => p.ownerOrganizationId === org.id).length;
                  const initsCount = metaData.initiatives.filter((i: any) => i.leadOrganizationId === org.id).length;
                  const totalPiloted = stratsCount + progsCount + initsCount;

                  if (totalPiloted === 0) return null;

                  return (
                    <div key={org.id} className="border border-muted/10 rounded-xl p-3 bg-glass/5 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <p className="font-extrabold text-text truncate">{org.name}</p>
                        <p className="text-muted text-[10px]">{org.type || "Institution publique"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {stratsCount > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400" title="Stratégies">{stratsCount} S</span>}
                        {progsCount > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" title="Programmes">{progsCount} P</span>}
                        {initsCount > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-455" title="Initiatives">{initsCount} I</span>}
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>

            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted mb-3">
                Rôle des participants dans les politiques publiques
              </h4>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 border border-muted/20 bg-glass/20 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-500" />
                  <span>Coordinateur de Programme : Agence du Numérique</span>
                </div>
                <div className="flex items-center gap-2 border border-muted/20 bg-glass/20 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-500" />
                  <span>Opérateurs Certifiés : WE, Clusters (MecaTech, BioWin, etc.)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUESTION CONTENT 3: BUDGET ALLOCATIONS */}
        {!loading && activeQuestion === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Budget Global Rempli" value={`${kpis.totalBudget.toLocaleString()} €`} Icon={Coins} color="teal" />
              <StatCard label="Budget Moyen par Programme" value={`${Math.round(kpis.totalBudget / (kpis.programsCount || 1)).toLocaleString()} €`} Icon={Coins} color="blue" />
              <StatCard label="Programmes avec financements" value={metaData?.programs?.filter((p: any) => p.budget > 0).length} Icon={CheckCircle2} color="emerald" />
            </div>

            <div className="space-y-3 bg-glass/10 border border-muted/10 rounded-xl p-4">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted">
                Détail Financier des Enveloppes de Programmes
              </h4>
              <div className="space-y-3.5">
                {metaData?.programs?.map((prog: any) => {
                  const maxBudget = Math.max(...metaData.programs.map((p: any) => p.budget || 0));
                  const pct = maxBudget > 0 ? ((prog.budget || 0) / maxBudget) * 100 : 0;
                  return (
                    <div key={prog.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-text truncate max-w-[320px]">{prog.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted uppercase">{prog.status}</span>
                          <span className="font-black text-primary">{(prog.budget || 0).toLocaleString()} €</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION CONTENT 4: CONCRETE IMPACTS */}
        {!loading && activeQuestion === 4 && (
          <div className="space-y-4 text-xs">
            {/* Indicator Totals */}
            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted mb-3">
                Résultats quantitatifs cumulés par Indicateur de Résultat S3
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {indicatorSummary.map((ind: any) => (
                  <div key={ind.id} className="border border-muted/10 rounded-xl p-3 bg-glass/5 flex flex-col justify-between space-y-2">
                    <span className="text-[9px] uppercase font-bold text-muted">{ind.name}</span>
                    <p className="text-xl font-extrabold text-text mt-1">
                      {ind.totalValue.toLocaleString()} {ind.unit}
                    </p>
                    <span className="text-[9px] font-bold text-muted mt-1">
                      Sur {ind.impactsCount} accompagnements PME
                    </span>
                  </div>
                ))}
                {indicatorSummary.length === 0 && (
                  <p className="text-xs text-muted italic col-span-3">Aucun indicateur d'impact mesuré dans cette configuration.</p>
                )}
              </div>
            </div>

            {/* Success Stories / Qualitative Impacts */}
            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4 space-y-3">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted">
                Flux d'impacts qualitatifs et livrables d'initiatives (success stories)
              </h4>
              <div className="space-y-3">
                {latestImpacts.map((imp: any) => (
                  <div key={imp.id} className="border-l-4 border-teal-500 bg-glass/5 p-3 rounded-r-xl space-y-1 hover:bg-glass/10 transition-colors">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-text">{imp.beneficiaryName}</span>
                      <span className="text-[9px] text-muted">{new Date(imp.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text leading-relaxed font-semibold italic text-[11px]">{imp.value}</p>
                    <div className="flex items-center gap-3 text-[9px] text-muted font-bold mt-1">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {imp.territoryName}</span>
                      <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" /> {imp.valueChainName}</span>
                    </div>
                  </div>
                ))}
                {latestImpacts.length === 0 && (
                  <p className="text-xs text-muted italic">Aucune fiche d'impact enregistrée.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUESTION CONTENT 5: GEOGRAPHIC & SECTORIAL */}
        {!loading && activeQuestion === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Geo Distribution */}
            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4 space-y-3">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted flex items-center gap-1">
                <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Intensité Territoriale par Province (Entreprises / Impacts)
              </h4>
              <div className="space-y-3">
                {Object.entries(provinceDistribution).map(([prov, stats]: any) => {
                  const maxBenefs = Math.max(...Object.values(provinceDistribution).map((s: any) => s.beneficiaries));
                  const pct = maxBenefs > 0 ? (stats.beneficiaries / maxBenefs) * 100 : 0;
                  return (
                    <div key={prov} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-text">{prov}</span>
                        <span className="text-muted font-bold">
                          {stats.beneficiaries} PME • {stats.impacts} Impacts
                        </span>
                      </div>
                      <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(provinceDistribution).length === 0 && (
                  <p className="text-xs text-muted italic">Aucune donnée géographique enregistrée.</p>
                )}
              </div>
            </div>

            {/* S3 Alignment Stats */}
            <div className="bg-glass/10 border border-muted/10 rounded-xl p-4 space-y-3">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-muted flex items-center gap-1">
                <Target className="h-4 w-4 text-amber-500" />
                Alignement Sectoriel S3 (Filières de Spécialisation)
              </h4>
              <div className="space-y-3.5">
                {valueChainStats.map((vc: any) => {
                  const maxBenefs = Math.max(...valueChainStats.map((v: any) => v.beneficiariesCount));
                  const pct = maxBenefs > 0 ? (vc.beneficiariesCount / maxBenefs) * 100 : 0;
                  return (
                    <div key={vc.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-text truncate max-w-[200px]">{vc.name}</span>
                        <span className="text-muted font-bold shrink-0">
                          {vc.beneficiariesCount} PME • {vc.servicesCount} aides • {vc.impactsCount} Impacts
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-teal-500 rounded-full" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
                {valueChainStats.length === 0 && (
                  <p className="text-xs text-muted italic">Aucune statistique de filière active.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
