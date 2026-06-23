// src/app/vulnerabilities/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Building2, 
  Layers, 
  HelpCircle,
  Network,
  Zap,
  Activity,
  User,
  ArrowUpRight
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import { Badge } from "@/components/ui/badge";
import { useV2Vulnerabilities, useV2VulnerabilityDetail } from "@/hooks/useV2Queries";

export default function VulnerabilitiesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { data: vulnerabilitiesRes, isLoading: isListLoading } = useV2Vulnerabilities();
  const vulnerabilities = vulnerabilitiesRes?.data || [];

  const { data: detailRes, isLoading: isDetailLoading } = useV2VulnerabilityDetail(selectedId);
  const detail = detailRes?.data;

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

  const getConfidenceBadgeColor = (conf: string) => {
    switch (conf?.toUpperCase()) {
      case "HIGH":
      case "ÉLEVÉ":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "MEDIUM":
      case "MOYEN":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case "ENERGY": return "Énergie";
      case "SUPPLY": return "Chaîne d'approvisionnement";
      case "FINANCIAL": return "Financière";
      case "HUMAN": return "Capital humain";
      case "DIGITAL": return "Numérique & Cyber";
      case "ENVIRONMENTAL": return "Environnementale";
      case "GEOGRAPHIC": return "Géographique";
      default: return cat || "Générale";
    }
  };

  return (
    <PITLayout
      category="EXPOSITION RÉSILIENCE"
      title="Cockpit des Vulnérabilités Territoriales"
      description="Cartographie dynamique des vulnérabilités économiques et industrielles régionales, de leur criticité et des programmes publics d'atténuation."
      pageIcon={Shield}
      breadcrumb={[{ label: "Vulnérabilités" }]}
    >
      <SplitLayout
        leftColSpan={5}
        leftPane={
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-muted/10 pb-3">
              <h2 className="text-xs font-black uppercase text-muted tracking-wider">
                Vulnérabilités Identifiées ({vulnerabilities.length})
              </h2>
              <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded font-black">
                Alignement OCDE
              </span>
            </div>

            {isListLoading ? (
              <div className="text-center py-10 text-muted font-bold text-xs">
                Chargement des vulnérabilités territoriales...
              </div>
            ) : vulnerabilities.length === 0 ? (
              <div className="text-center py-10 text-muted text-xs italic">
                Aucune vulnérabilité territoriale répertoriée dans la base de données.
              </div>
            ) : (
              <div className="space-y-3">
                {vulnerabilities.map((v: any) => {
                  const isSelected = selectedId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedId(v.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${
                        isSelected 
                          ? "bg-gradient-to-r from-teal-500/10 to-indigo-500/5 border-teal-500/60 shadow-md ring-1 ring-teal-500/30" 
                          : "border-muted/15 bg-glass/25 hover:bg-glass/50 hover:border-muted/30"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono bg-muted/20 text-muted px-1.5 py-0.5 rounded font-bold uppercase">
                              {v.code || `VULN-${v.id}`}
                            </span>
                            <span className="text-[10px] font-extrabold text-teal-650 uppercase">
                              {getCategoryLabel(v.category)}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-xs text-text leading-tight mt-1">
                            {v.name}
                          </h3>
                        </div>

                        <Badge className={`text-[9px] font-black shrink-0 ${getSeverityBadgeColor(v.severity)}`}>
                          {v.severity || "MEDIUM"}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                        {v.description || "Aucune description fournie."}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-muted/10 pt-2 text-[10px] font-bold text-muted mt-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>Criticité : <strong className="text-text">{v.criticalityScore}/100</strong></span>
                          </div>
                          <span>Confiance : <strong className="text-text">{v.confidenceLevel || "MEDIUM"}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-teal-605">
                          <span>Détails & Graphes</span>
                          <ArrowRight className="h-3 w-3 shrink-0" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        }
        rightPane={
          selectedId === null ? (
            <div className="rounded-2xl border border-dashed border-muted/30 p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px] bg-glass/5">
              <Shield className="h-10 w-10 text-muted/40 stroke-1 mb-3 animate-pulse" />
              <h4 className="font-bold text-xs text-text mb-1">Sélectionner une vulnérabilité</h4>
              <p className="text-[10px] text-muted max-w-[200px] leading-relaxed">
                Cliquez sur une ligne pour charger la perspective d'intelligence territoriale et ses dépendances sémantiques.
              </p>
            </div>
          ) : isDetailLoading ? (
            <div className="rounded-2xl bg-surface border border-muted/20 p-6 text-center text-xs text-muted font-bold">
              Chargement des liens stratégiques...
            </div>
          ) : !detail ? (
            <div className="rounded-2xl bg-surface border border-muted/20 p-6 text-center text-xs text-muted">
              Impossible de charger les détails.
            </div>
          ) : (
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/25 p-5 space-y-5">
              {/* Header details */}
              <div className="space-y-2 border-b border-muted/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded font-black">
                    {detail.code || `VULN-${detail.id}`}
                  </span>
                  <Badge className={`text-[9px] font-black ${getSeverityBadgeColor(detail.severity)}`}>
                    {detail.severity}
                  </Badge>
                </div>
                <h3 className="text-sm font-extrabold text-text leading-tight">
                  {detail.name}
                </h3>
                <p className="text-[11px] text-muted leading-relaxed">
                  {detail.description}
                </p>
              </div>

              {/* Criticality details */}
              <div className="bg-glass/30 rounded-xl p-4 border border-muted/10 grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted block">Score de Criticité</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-text">{detail.criticalityScore}/100</span>
                    <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          detail.criticalityScore > 75 ? "bg-rose-500" : detail.criticalityScore > 40 ? "bg-amber-500" : "bg-teal-500"
                        }`}
                        style={{ width: `${detail.criticalityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted block">Fiabilité Donnée</span>
                  <Badge className={`text-[9px] font-black uppercase ${getConfidenceBadgeColor(detail.confidenceLevel)}`}>
                    {detail.confidenceLevel}
                  </Badge>
                </div>

                <div className="col-span-2 space-y-1 border-t border-muted/10 pt-2.5">
                  <span className="text-[10px] font-black uppercase text-muted block">Exposition Territoriale</span>
                  <div className="flex items-start gap-1.5 text-[11px] text-text font-bold leading-snug">
                    <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{detail.territorialImportance || "Non spécifiée géographiquement."}</span>
                  </div>
                </div>

                {detail.strategicImportance && (
                  <div className="col-span-2 space-y-1 border-t border-muted/10 pt-2.5">
                    <span className="text-[10px] font-black uppercase text-muted block">Importance Stratégique</span>
                    <div className="flex items-start gap-1.5 text-[11px] text-text font-bold leading-snug">
                      <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{detail.strategicImportance}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Remediation Plan */}
              {detail.remediationPlan && (
                <div className="space-y-1.5 bg-teal-500/5 border border-teal-500/10 rounded-xl p-4">
                  <h4 className="text-[10px] font-black uppercase text-teal-650 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Dispositif de Remédiation Stratégique
                  </h4>
                  <p className="text-[11px] text-muted leading-relaxed font-semibold">
                    {detail.remediationPlan}
                  </p>
                </div>
              )}

              {/* Relations sections */}
              <div className="space-y-4 pt-2">
                
                {/* 1. Dependencies */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-1">
                    <Network className="h-3.5 w-3.5 text-indigo-500" />
                    Dépendances de la Chaîne ({detail.dependencies?.length || 0})
                  </h4>
                  {(!detail.dependencies || detail.dependencies.length === 0) ? (
                    <span className="text-[10px] text-muted italic block">Aucune dépendance sémantique directe.</span>
                  ) : (
                    <div className="space-y-2">
                      {detail.dependencies.map((d: any) => (
                        <div key={d.id} className="p-2.5 rounded-lg border border-muted/10 bg-glass/10 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-text">{d.name}</span>
                            <Badge className="text-[8px] px-1 font-mono uppercase bg-muted/10">{d.category}</Badge>
                          </div>
                          {d.parentDependency && (
                            <div className="text-[9px] text-muted font-bold mt-1 flex items-center gap-1">
                              <span>Parent :</span>
                              <span className="underline">{d.parentDependency.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. S3 Value Chains */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-1">
                    <Layers className="h-3.5 w-3.5 text-teal-600" />
                    Chaînes de Valeur S3 Exposées ({detail.valueChains?.length || 0})
                  </h4>
                  {(!detail.valueChains || detail.valueChains.length === 0) ? (
                    <span className="text-[10px] text-muted italic block">Aucune chaîne de valeur S3 directement impactée.</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {detail.valueChains.map((vc: any) => (
                        <span key={vc.id} className="px-2.5 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-lg text-[10px] font-black flex items-center gap-1">
                          <Network className="h-3 w-3 shrink-0" />
                          {vc.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Risks (Propagation paths) */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                    Chocs & Risques Propagation CORTEX ({detail.risks?.length || 0})
                  </h4>
                  {(!detail.risks || detail.risks.length === 0) ? (
                    <span className="text-[10px] text-muted italic block">Aucun scénario de risque CORTEX associé.</span>
                  ) : (
                    <div className="space-y-2">
                      {detail.risks.map((r: any) => (
                        <div key={r.id} className="p-2.5 rounded-lg border border-rose-500/10 bg-rose-500/5 text-xs flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-rose-500 block uppercase font-black">{r.code}</span>
                            <span className="font-extrabold text-text block leading-tight">{r.name}</span>
                          </div>
                          <Badge className="text-[8px] bg-rose-500 text-white font-black uppercase">Score: {r.riskScore}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Mitigating Programs */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Programmes de Remédiation ({detail.programs?.length || 0})
                  </h4>
                  {(!detail.programs || detail.programs.length === 0) ? (
                    <div className="flex items-center gap-2 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-extrabold uppercase">
                        VULNÉRABILITÉ ORPHELINE : Aucun programme actif
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {detail.programs.map((p: any) => (
                        <a
                          key={p.id}
                          href={`/programs/${p.id}`}
                          className="p-2.5 rounded-lg border border-muted/10 bg-glass/10 text-xs flex justify-between items-center hover:border-teal-500/50 hover:bg-glass/20 transition-all cursor-pointer font-bold group"
                        >
                          <div className="space-y-0.5">
                            <span className="text-text group-hover:text-teal-650 transition-colors">{p.name}</span>
                            {p.code && <span className="text-[8px] font-mono text-muted block uppercase">{p.code}</span>}
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-teal-605 transition-all shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Exposed Beneficiaries */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5 border-b border-muted/10 pb-1">
                    <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                    Acteurs & Entreprises Exposées ({detail.beneficiaries?.length || 0})
                  </h4>
                  {(!detail.beneficiaries || detail.beneficiaries.length === 0) ? (
                    <span className="text-[10px] text-muted italic block">Aucune entreprise répertoriée comme exposée.</span>
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto space-y-1.5 scrollbar-thin">
                      {detail.beneficiaries.map((b: any) => (
                        <div key={b.id} className="p-2 bg-glass/5 border border-muted/5 rounded-lg text-[11px] font-bold flex justify-between items-center">
                          <span className="text-text">{b.name}</span>
                          <span className="text-[9px] text-muted bg-muted/15 px-1.5 py-0.5 rounded uppercase shrink-0 font-mono">
                            {b.location} ({b.size})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )
        }
      />
    </PITLayout>
  );
}
