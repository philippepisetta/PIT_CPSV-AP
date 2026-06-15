// src/app/gap-analysis/page.tsx
"use client";

import { Shield, AlertTriangle, Check } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { useV2GapAnalysisQuery } from "@/hooks/usePITQueries";

export default function GapAnalysisPage() {
  const { data: gapRes, isLoading } = useV2GapAnalysisQuery();
  const gapAnalysis = gapRes?.data || [];

  return (
    <PITLayout
      category="PILOTAGE STRATÉGIQUE"
      title="Analyse de Gaps Territoriaux"
      description="Identifiez les acteurs manquants, les compétences sous-représentées, les services absents et les financements manquants par maillon de chaîne de valeur."
      pageIcon={Shield}
      breadcrumb={[{ label: "Gap Analysis" }]}
    >
      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="space-y-8">
            {gapAnalysis.map((filiere: any) => (
              <div key={filiere.id} className="space-y-4 border-b border-muted/10 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-text uppercase tracking-wider">{filiere.name}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-650">
                    Filière Écosystème
                  </span>
                </div>

                <div className="space-y-6">
                  {filiere.valueChains?.map((vc: any) => (
                    <div key={vc.id} className="space-y-3 pl-4 border-l-2 border-indigo-500/30">
                      <h4 className="text-xs font-extrabold text-muted uppercase tracking-wide">{vc.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vc.segments?.map((seg: any) => {
                          const hasGaps = seg.gaps.actors || seg.gaps.services || seg.gaps.capabilities || seg.gaps.funding;
                          
                          return (
                            <div key={seg.id} className="p-4 rounded-xl border border-muted/10 bg-glass/30 space-y-3 hover:shadow-md transition-all">
                              <div className="flex justify-between items-center border-b border-muted/10 pb-2">
                                <span className="font-extrabold text-xs text-text">{seg.name}</span>
                                {hasGaps ? (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <Check className="h-3 w-3" /> Alignement Complet
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2 text-[10px]">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted">Acteurs sur ce maillon</span>
                                  {seg.gaps.actors ? (
                                    <span className="text-rose-500 font-extrabold">Gap : Acteurs manquants</span>
                                  ) : (
                                    <span className="text-text font-bold">Acteurs présents</span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted">Services de support</span>
                                  {seg.gaps.services ? (
                                    <span className="text-rose-500 font-extrabold">Gap : Services absents</span>
                                  ) : (
                                    <span className="text-text font-bold">{seg.servicesCount} service(s)</span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted">Compétences clés</span>
                                  {seg.gaps.capabilities ? (
                                    <span className="text-amber-500 font-extrabold">Nécessite Cyber/IA</span>
                                  ) : (
                                    <span className="text-text font-bold">Compétences OK</span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted">Aides financières</span>
                                  {seg.gaps.funding ? (
                                    <span className="text-rose-500 font-extrabold">Gap : Financement critique</span>
                                  ) : (
                                    <span className="text-text font-bold">Aides OK</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PITLayout>
  );
}
