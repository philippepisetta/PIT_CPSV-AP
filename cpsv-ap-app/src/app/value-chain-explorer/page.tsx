// src/app/value-chain-explorer/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Network, 
  ArrowRight, 
  Building2, 
  Layers, 
  FileText, 
  Activity, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Shield,
  Zap,
  TrendingUp,
  MapPin,
  HelpCircle as QuestionIcon,
  ChevronsRight,
  TrendingDown
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { Badge } from "@/components/ui/badge";
import { useV2ValueChains, useV2Vulnerabilities } from "@/hooks/useV2Queries";

// Define local tabs for the stage inspector
type InspectorTab = "vulnerabilities" | "impact-paths" | "actors" | "dependencies" | "mitigations";

export default function ValueChainExplorerPage() {
  const [selectedChainCode, setSelectedChainCode] = useState<string>("VC-AGROALIMENTAIRE");
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<InspectorTab>("vulnerabilities");

  // Fetch all value chains and vulnerabilities
  const { data: valueChainsRes, isLoading: isChainsLoading } = useV2ValueChains();
  const { data: vulnerabilitiesRes, isLoading: isVulnLoading } = useV2Vulnerabilities();

  const valueChains = valueChainsRes?.data || [];
  const vulnerabilities = vulnerabilitiesRes?.data || [];

  // Filter value chains to only show the 3 main strategic ones
  const strategicCodes = ["VC-AGROALIMENTAIRE", "VC-SANTE", "VC-CIRCULAR-ECON"];
  const displayValueChains = valueChains.filter((vc: any) => strategicCodes.includes(vc.code));

  // If displayValueChains is empty (due to seed variances), fallback to all value chains
  const activeValueChains = displayValueChains.length > 0 ? displayValueChains : valueChains;

  // Selected value chain
  const activeChain = activeValueChains.find((vc: any) => vc.code === selectedChainCode) || activeValueChains[0];

  // Selected stage
  const stages = activeChain?.stages || [];
  const activeStage = stages[selectedStageIdx] || stages[0];

  // Filter vulnerabilities linked to the selected value chain
  const chainVulnerabilities = vulnerabilities.filter((v: any) => 
    v.valueChains?.some((vc: any) => vc.id === activeChain?.id)
  );

  // Compute summary metrics for KPI Header
  const activeVulnCount = vulnerabilities.length;
  const avgCriticality = vulnerabilities.length > 0 
    ? Math.round(vulnerabilities.reduce((acc: number, v: any) => acc + (v.criticalityScore || 0), 0) / vulnerabilities.length)
    : 0;
  const coverageRate = vulnerabilities.length > 0
    ? Math.round((vulnerabilities.filter((v: any) => v.programs?.length > 0).length / vulnerabilities.length) * 100)
    : 0;

  // Helpers
  const getSeverityBadgeColor = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case "CRITICAL":
      case "CRITIQUE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "HIGH":
      case "HAUT":
      case "ÉLEVÉ":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "MEDIUM":
      case "MOYEN":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      default:
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case "ENERGY": return "Énergie";
      case "SUPPLY": return "Chaîne d'approvisionnement";
      case "FINANCIAL": return "Financière";
      case "HUMAN": return "Capital humain";
      case "DIGITAL": return "Numérique & Cyber";
      default: return cat || "Générale";
    }
  };

  return (
    <PITLayout
      category="INTELLIGENCE TERRITORIALE"
      title="Value Chain Visual Explorer"
      description="Visualisez les maillons des chaînes de valeur stratégiques wallonnes et tracez dynamiquement les dépendances, vulnérabilités et chemins d'impact."
      pageIcon={Network}
      breadcrumb={[{ label: "Value Chain Explorer" }]}
    >
      <div className="space-y-6">

        {/* 1. Summary KPI Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-glass border border-muted/20 bg-glass/25 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-muted block">Vulnérabilités Actives</span>
              <span className="text-xl font-black text-text">{activeVulnCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <Shield className="h-6 w-6 text-rose-500" />
            </div>
          </div>

          <div className="bg-glass border border-muted/20 bg-glass/25 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-muted block">Score de Criticité Moyen</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-text">{avgCriticality}/100</span>
                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Moyen-Haut
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>

          <div className="bg-glass border border-muted/20 bg-glass/25 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-muted block">Couverture de Remédiation</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-text">{coverageRate}%</span>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sécurisé
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Zap className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        {/* 2. Value Chain Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Filières Stratégiques S3</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Sélectionner une chaîne de valeur</h3>
          </div>
          {isChainsLoading ? (
            <span className="text-xs text-muted font-bold">Chargement des filières...</span>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {activeValueChains.map((vc: any) => (
                <button
                  key={vc.id}
                  onClick={() => { 
                    setSelectedChainCode(vc.code); 
                    setSelectedStageIdx(0); 
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    selectedChainCode === vc.code 
                      ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                      : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                  }`}
                >
                  {vc.name === "Santé" ? "Santé Numérique (e-Santé)" : vc.name === "Economie circulaire" ? "Économie Circulaire" : vc.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Pipeline Stages Visualization */}
        <div className="bg-glass/10 border border-muted/20 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 overflow-x-auto scrollbar-thin py-6">
            {stages.length === 0 ? (
              <div className="text-center py-6 text-muted text-xs italic">
                Aucun maillon de chaîne configuré pour cette filière dans le graphe.
              </div>
            ) : (
              stages.map((st: any, idx: number) => {
                const isSelected = selectedStageIdx === idx;
                // Count vulnerabilities linked to this value chain's stage (for demo, filter by chain)
                const stageVulns = chainVulnerabilities; 
                const hasCritical = stageVulns.some((v: any) => v.severity?.toUpperCase() === "CRITICAL");
                const borderClass = stageVulns.length === 0 
                  ? "border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                  : hasCritical 
                    ? "border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                    : "border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400";

                return (
                  <div key={st.id} className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedStageIdx(idx)}
                      className={`p-5 border-2 rounded-2xl text-left w-56 transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${borderClass} ${
                        isSelected ? "ring-4 ring-teal-500/40 font-black shadow-md scale-102" : "opacity-80"
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase opacity-75 block">Maillon {idx + 1} - {st.category || "Etape"}</span>
                      <h4 className="text-xs font-black text-text mt-1.5 leading-snug">{st.name}</h4>
                      
                      <div className="flex justify-between items-center mt-4 text-[9px] font-extrabold border-t border-muted/15 pt-2">
                        <span>Vulnérabilités : {stageVulns.length}</span>
                        <span className="px-2 py-0.5 rounded bg-black/10">
                          {stageVulns.length === 0 ? "SÉCURISÉ" : hasCritical ? "CRITIQUE" : "EXPOSÉ"}
                        </span>
                      </div>
                    </button>
                    {idx < stages.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted shrink-0 rotate-90 md:rotate-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. Tabbed Stage Inspector Dashboard */}
        {activeStage && (
          <div className="space-y-4">
            <div className="flex border-b border-muted/15 gap-1 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setActiveTab("vulnerabilities")}
                className={`px-4 py-2 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "vulnerabilities" 
                    ? "border-teal-500 text-teal-650" 
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                Vulnérabilités ({chainVulnerabilities.length})
              </button>
              <button
                onClick={() => setActiveTab("impact-paths")}
                className={`px-4 py-2 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "impact-paths" 
                    ? "border-teal-500 text-teal-650" 
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                Chemins d'Impact (Propagation)
              </button>
              <button
                onClick={() => setActiveTab("actors")}
                className={`px-4 py-2 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "actors" 
                    ? "border-teal-500 text-teal-650" 
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                Acteurs Exposés
              </button>
              <button
                onClick={() => setActiveTab("dependencies")}
                className={`px-4 py-2 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "dependencies" 
                    ? "border-teal-500 text-teal-650" 
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                Dépendances Sémantiques
              </button>
              <button
                onClick={() => setActiveTab("mitigations")}
                className={`px-4 py-2 text-xs font-black transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "mitigations" 
                    ? "border-teal-500 text-teal-650" 
                    : "border-transparent text-muted hover:text-text"
                }`}
              >
                Remédiations & Programmes
              </button>
            </div>

            <div className="bg-glass/10 border border-muted/20 rounded-2xl p-6 min-h-[300px]">
              
              {/* TAB 1: Vulnerabilities */}
              {activeTab === "vulnerabilities" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-muted/10 pb-2">
                    <h4 className="text-xs font-black uppercase text-text flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-rose-500" />
                      Vulnérabilités de la filière sur le maillon : {activeStage.name}
                    </h4>
                  </div>

                  {chainVulnerabilities.length === 0 ? (
                    <div className="text-center py-10 text-muted text-xs italic">
                      Aucune vulnérabilité n'impacte ce maillon de la chaîne de valeur.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chainVulnerabilities.map((v: any) => (
                        <div key={v.id} className="p-4 rounded-xl border border-muted/10 bg-glass/25 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono bg-muted/10 text-muted px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                                {v.code || `VULN-${v.id}`}
                              </span>
                              <h5 className="font-extrabold text-xs text-text mt-1">{v.name}</h5>
                            </div>
                            <Badge className={`text-[8px] font-black ${getSeverityBadgeColor(v.severity)}`}>
                              {v.severity}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">{v.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 border-t border-muted/10 pt-2 text-[10px] font-bold text-muted">
                            <div>Score Criticité : <strong className="text-text">{v.criticalityScore}/100</strong></div>
                            <div>Fiabilité : <strong className="text-text">{v.confidenceLevel || "MEDIUM"}</strong></div>
                            <div className="col-span-2 mt-1">Territoire : <strong className="text-text">{v.territorialImportance || "Régional"}</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Impact Paths (Visualization) */}
              {activeTab === "impact-paths" && (
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-text flex items-center gap-1.5 border-b border-muted/10 pb-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    Chemin de Propagation de l'Impact Sémantique (OCDE / CORTEX)
                  </h4>

                  {chainVulnerabilities.length === 0 ? (
                    <div className="text-center py-10 text-muted text-xs italic">
                      Aucune propagation de choc n'est calculée pour ce maillon (maillon sécurisé).
                    </div>
                  ) : (
                    <div className="space-y-8 py-4">
                      {chainVulnerabilities.map((v: any, index: number) => {
                        const linkedRisk = v.risks?.[0] || { code: "RISK-GEN", name: "Choc macro-économique général" };
                        const linkedDep = v.dependencies?.[0] || { name: "Dépendance structurelle" };
                        const exposedActor = v.beneficiaries?.[0] || { name: "PME Industrielle exposée", location: "Wallonie" };

                        return (
                          <div key={v.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/20 space-y-4">
                            <div className="text-[10px] font-black uppercase text-teal-605">
                              Chemin de propagation {index + 1} : {v.code || `VULN-${v.id}`}
                            </div>

                            {/* Node chain */}
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-2">
                              {/* Node 1: Risk */}
                              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 w-full lg:w-1/4 text-center space-y-1">
                                <span className="text-[9px] font-black text-rose-500 uppercase block">1. Risque / Choc</span>
                                <span className="text-[10px] font-bold text-text block leading-tight">{linkedRisk.name}</span>
                                <Badge className="text-[8px] bg-rose-500 text-white font-black">{linkedRisk.code}</Badge>
                              </div>

                              <ChevronsRight className="h-5 w-5 text-muted shrink-0 rotate-90 lg:rotate-0" />

                              {/* Node 2: Vulnerability */}
                              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 w-full lg:w-1/4 text-center space-y-1">
                                <span className="text-[9px] font-black text-amber-500 uppercase block">2. Vulnérabilité</span>
                                <span className="text-[10px] font-bold text-text block leading-tight">{v.name}</span>
                                <Badge className="text-[8px] bg-amber-500 text-white font-black">Criticité: {v.criticalityScore}</Badge>
                              </div>

                              <ChevronsRight className="h-5 w-5 text-muted shrink-0 rotate-90 lg:rotate-0" />

                              {/* Node 3: Dependency */}
                              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 w-full lg:w-1/4 text-center space-y-1">
                                <span className="text-[9px] font-black text-indigo-500 uppercase block">3. Dépendance Intrant</span>
                                <span className="text-[10px] font-bold text-text block leading-tight">{linkedDep.name}</span>
                                <Badge className="text-[8px] bg-indigo-500 text-white font-black">Intrant {linkedDep.category || "Matériel"}</Badge>
                              </div>

                              <ChevronsRight className="h-5 w-5 text-muted shrink-0 rotate-90 lg:rotate-0" />

                              {/* Node 4: Exposed Actor */}
                              <div className="p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 w-full lg:w-1/4 text-center space-y-1">
                                <span className="text-[9px] font-black text-teal-600 uppercase block">4. Acteur Impacté</span>
                                <span className="text-[10px] font-bold text-text block leading-tight">{exposedActor.name}</span>
                                <Badge className="text-[8px] bg-teal-500 text-white font-black">{exposedActor.location}</Badge>
                              </div>
                            </div>

                            {/* Remediation alert */}
                            <div className="p-3.5 bg-teal-500/5 border border-teal-500/15 rounded-xl text-xs flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-teal-605 shrink-0" />
                                <span className="text-muted leading-relaxed">
                                  <strong>Remédiation :</strong> {v.remediationPlan || "Plan de remédiation à l'étude."}
                                </span>
                              </div>
                              {v.programs?.[0] && (
                                <a 
                                  href={`/programs/${v.programs[0].id}`}
                                  className="px-3 py-1 bg-teal-500 text-white text-[10px] font-black rounded-lg hover:bg-teal-600 shrink-0"
                                >
                                  Voir Programme
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Exposed Actors */}
              {activeTab === "actors" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-text flex items-center gap-1.5 border-b border-muted/10 pb-2">
                    <Building2 className="h-4 w-4 text-teal-605" />
                    Entreprises et Acteurs de l'Écosystème Exposés
                  </h4>

                  {chainVulnerabilities.length === 0 ? (
                    <div className="text-center py-10 text-muted text-xs italic">
                      Aucun acteur économique n'est exposé sur ce maillon de la chaîne.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chainVulnerabilities.flatMap((v: any) => v.beneficiaries || []).map((b: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-muted/10 bg-glass/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-xs text-text">{b.name}</h5>
                            <span className="text-[10px] text-muted font-bold block">
                              Localisation: {b.location} | BCE: {b.bce || "Non renseigné"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Badge className="text-[9px] font-black uppercase bg-muted/10 text-muted">{b.size}</Badge>
                            <Badge className="text-[9px] font-black uppercase bg-teal-500/10 text-teal-600 border border-teal-500/25">Actif</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Taxonomic Dependencies */}
              {activeTab === "dependencies" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-text flex items-center gap-1.5 border-b border-muted/10 pb-2">
                    <Network className="h-4 w-4 text-indigo-500" />
                    Hiérarchie des Dépendances Sémantiques & Taxonomies
                  </h4>

                  {chainVulnerabilities.length === 0 ? (
                    <div className="text-center py-10 text-muted text-xs italic">
                      Aucune dépendance recensée sur ce maillon de la chaîne.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chainVulnerabilities.flatMap((v: any) => v.dependencies || []).map((d: any) => (
                        <div key={d.id} className="p-4 rounded-xl border border-muted/10 bg-glass/20 space-y-3 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-text text-xs">{d.name}</span>
                            <Badge className="text-[8px] uppercase bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                              Catégorie: {d.category}
                            </Badge>
                          </div>
                          <p className="text-muted text-[11px] leading-relaxed">{d.description}</p>
                          
                          <div className="flex items-center gap-4 text-[10px] text-muted font-black border-t border-muted/10 pt-2">
                            <span>Sévérité : <strong className="text-text">{d.criticalLevel || "MEDIUM"}</strong></span>
                            <span>Substituabilité : <strong className="text-text">{d.substitutability || "POSSIBLE"}</strong></span>
                          </div>

                          {/* Render children dependencies (Dependency hierarchy) if available */}
                          {d.childDependencies && d.childDependencies.length > 0 && (
                            <div className="border-l-2 border-indigo-500/40 pl-3 mt-3 space-y-2">
                              <span className="text-[9px] font-black text-indigo-500 uppercase block">Sous-dépendance (Enfant) :</span>
                              {d.childDependencies.map((child: any) => (
                                <div key={child.id} className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[11px] font-bold text-text">
                                  {child.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Mitigations & Programs */}
              {activeTab === "mitigations" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-text flex items-center gap-1.5 border-b border-muted/10 pb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Programmes Publics et Services d'Atténuation (Mitigation)
                  </h4>

                  {chainVulnerabilities.length === 0 ? (
                    <div className="text-center py-10 text-muted text-xs italic">
                      Aucune vulnérabilité active sur ce maillon, aucun programme d'atténuation requis.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chainVulnerabilities.map((v: any) => (
                        <div key={v.id} className="p-4 rounded-xl border border-muted/10 bg-glass/25 space-y-3">
                          <div className="text-[10px] font-black text-rose-500 uppercase">
                            Pour la vulnérabilité : {v.name}
                          </div>

                          {(!v.programs || v.programs.length === 0) ? (
                            <div className="p-3 bg-rose-500/5 border border-rose-505/20 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-extrabold flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 shrink-0" />
                              <span>VULNÉRABILITÉ ORPHELINE : Aucun programme public de remédiation associé !</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {v.programs.map((p: any) => (
                                <div key={p.id} className="p-3 rounded-xl border border-muted/10 bg-glass/30 flex justify-between items-center text-xs">
                                  <div className="space-y-0.5">
                                    <h5 className="font-extrabold text-text">{p.name}</h5>
                                    <span className="text-[9px] font-mono text-muted uppercase block">{p.code || 'PROG'}</span>
                                  </div>
                                  <a 
                                    href={`/programs/${p.id}`}
                                    className="px-2.5 py-1 text-[10px] font-black bg-teal-500 text-white rounded hover:bg-teal-600"
                                  >
                                    Cockpit
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Public Services matching standard mitigations */}
                          {v.mitigations && v.mitigations.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <span className="text-[9px] font-black text-teal-605 uppercase block">Services Publics (CPSV-AP) mobilisés :</span>
                              <div className="flex flex-wrap gap-2">
                                {v.mitigations.map((s: any) => (
                                  <span key={s.id} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-650 border border-teal-500/20 text-[10px] font-bold">
                                    {s.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </PITLayout>
  );
}
