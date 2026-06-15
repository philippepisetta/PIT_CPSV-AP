// src/app/strategic/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  LineChart, 
  Target, 
  Layers, 
  ArrowRight, 
  ClipboardCheck, 
  Building2, 
  Share2, 
  FileCode, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { 
  useV2MissionsQuery, 
  useV2RoadmapsQuery, 
  useV2PortfoliosQuery,
  useV2GapAnalysisQuery,
  useV2OpportunitiesQuery,
  useV2EvidencesQuery 
} from "@/hooks/usePITQueries";

export default function StrategicPage() {
  const [activeTab, setActiveTab] = useState<string>("missions");

  // React Query Hooks
  const { data: missionsRes, isLoading: missionsLoading } = useV2MissionsQuery();
  const { data: roadmapsRes, isLoading: roadmapsLoading } = useV2RoadmapsQuery();
  const { data: portfoliosRes, isLoading: portfoliosLoading } = useV2PortfoliosQuery();
  const { data: gapRes, isLoading: gapLoading } = useV2GapAnalysisQuery();
  const { data: oppsRes, isLoading: oppsLoading } = useV2OpportunitiesQuery();
  const { data: evidencesRes, isLoading: evidencesLoading } = useV2EvidencesQuery();

  const missions = missionsRes?.data || [];
  const roadmaps = roadmapsRes?.data || [];
  const portfolios = portfoliosRes?.data || [];
  const gaps = gapRes?.data || [];
  const opportunities = oppsRes?.data || [];
  const evidences = evidencesRes?.data || [];

  const loading = missionsLoading || roadmapsLoading || portfoliosLoading || gapLoading || oppsLoading || evidencesLoading;

  // Static mock ecosystems for Vue Ecosystèmes
  const ECOSYSTEMS = [
    { name: "BioWin", description: "Pôle de compétitivité santé de la Wallonie (Biotechs, Medtechs).", actors: 12, projects: 5 },
    { name: "GreenWin", description: "Pôle de compétitivité chimie verte et matériaux durables.", actors: 8, projects: 3 },
    { name: "MecaTech", description: "Pôle de compétitivité génie mécanique et Industrie 5.0.", actors: 14, projects: 4 },
    { name: "Logistics in Wallonia", description: "Pôle de compétitivité mobilité, transport et logistique fret.", actors: 10, projects: 4 },
    { name: "Wagralim", description: "Pôle de compétitivité agroalimentaire et nutrition durable.", actors: 15, projects: 4 }
  ];

  return (
    <PITLayout
      category="PILOTAGE DG"
      title="Cockpit Stratégique Exécutif"
      description="Pilotage consolidé et navigation ascendante/descendante des politiques publiques : des missions stratégiques aux preuves d'impact sur le terrain."
      pageIcon={LineChart}
      breadcrumb={[{ label: "Cockpit DG" }]}
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs Header */}
        <div className="flex bg-glass/25 p-1.5 rounded-2xl border border-muted/20 gap-1 overflow-x-auto scrollbar-thin">
          {[
            { id: "missions", label: "Missions & Roadmaps", icon: Target },
            { id: "ecosystems", label: "Vue Écosystèmes", icon: Share2 },
            { id: "opportunities", label: "Vue Financements", icon: FileCode },
            { id: "gaps", label: "Vue Gaps", icon: AlertTriangle },
            { id: "impacts", label: "Vue Preuves & Impacts", icon: ClipboardCheck }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? "bg-teal-500 text-white shadow-sm font-extrabold" 
                    : "text-muted hover:bg-glass hover:text-text"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-2" />
            <span className="text-xs font-bold">Agrégation stratégique en cours...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Missions & Roadmaps Tab */}
            {activeTab === "missions" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                  <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                    Missions & Thématiques S3
                  </h3>
                  <div className="space-y-3">
                    {missions.map((m: any) => (
                      <div key={m.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl space-y-2">
                        <span className="text-xs font-black text-text block leading-tight">{m.name}</span>
                        {m.themes?.map((t: any) => (
                          <div key={t.id} className="p-2.5 bg-glass/20 border border-muted/10 rounded-lg text-[10px] font-bold text-muted flex items-center justify-between">
                            <span>{t.name}</span>
                            <span className="text-[8px] font-black uppercase bg-teal-500/10 text-teal-655 px-1.5 rounded">Thème S3</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                  <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                    Feuilles de Route (Roadmaps) & Portefeuilles
                  </h3>
                  <div className="space-y-3">
                    {roadmaps.map((r: any) => (
                      <div key={r.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl space-y-2">
                        <span className="text-xs font-black text-text block leading-tight">{r.name}</span>
                        {r.objectives?.map((o: any) => (
                          <div key={o.id} className="text-[10px] text-text font-bold flex items-start gap-1">
                            <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{o.name}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Vue Ecosystèmes Tab */}
            {activeTab === "ecosystems" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ECOSYSTEMS.map((eco, i) => (
                  <div key={i} className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-muted/10 pb-2">
                      <h4 className="font-black text-xs text-text uppercase">{eco.name}</h4>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full">Pôle</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed font-semibold">{eco.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-black pt-2">
                      <div className="bg-glass p-2 rounded-lg">
                        Membres
                        <span className="block text-xs font-black mt-0.5">{eco.actors}</span>
                      </div>
                      <div className="bg-glass p-2 rounded-lg">
                        Projets
                        <span className="block text-xs font-black mt-0.5">{eco.projects}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Vue Financements Tab */}
            {activeTab === "opportunities" && (
              <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                  Programmes Financiers & Subventions Wallonnes
                </h3>
                <div className="space-y-3">
                  {opportunities.map((o: any) => (
                    <div key={o.id} className="p-4 bg-glass/35 border border-muted/10 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-black text-teal-605 uppercase block">{o.type}</span>
                        <span className="text-xs font-black text-text block mt-0.5">{o.title}</span>
                        <span className="text-[10px] text-muted block font-semibold">Fournisseur : {o.provider}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 shrink-0">
                        {o.status || "OPEN"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Vue Gaps Tab */}
            {activeTab === "gaps" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gaps.slice(0, 3).map((fil: any) => (
                  <div key={fil.id} className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-black text-text block uppercase border-b border-muted/10 pb-2">{fil.name}</span>
                    <div className="space-y-3">
                      {fil.valueChains?.map((vc: any) => (
                        <div key={vc.id} className="space-y-1.5">
                          <span className="text-[9px] font-extrabold text-muted block uppercase">{vc.name}</span>
                          {vc.segments?.map((seg: any) => {
                            const hasGaps = seg.gaps.actors || seg.gaps.services || seg.gaps.capabilities || seg.gaps.funding;
                            return (
                              <div key={seg.id} className="p-2 bg-glass/20 border border-muted/10 rounded-lg flex items-center justify-between text-[10px] font-bold">
                                <span className="text-text">{seg.name}</span>
                                {hasGaps ? (
                                  <span className="text-rose-500 font-extrabold flex items-center gap-0.5">
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Gaps
                                  </span>
                                ) : (
                                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> OK
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Vue Preuves & Impacts Tab */}
            {activeTab === "impacts" && (
              <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-xs text-text uppercase tracking-wider border-b border-muted/10 pb-2">
                  Registre des Preuves d'Impact (APPROVED & PENDING)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                        <th className="py-2">Justificatif</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Fichier URL</th>
                        <th className="py-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evidences.map((evi: any) => (
                        <tr key={evi.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-text block">{evi.name}</span>
                            <span className="text-muted text-[10px] block max-w-lg truncate">{evi.description}</span>
                          </td>
                          <td className="py-3 font-semibold text-text uppercase">{evi.type || "Fichier"}</td>
                          <td className="py-3 font-mono text-muted">
                            {evi.url ? (
                              <a href={evi.url} target="_blank" rel="noopener noreferrer" className="text-teal-605 hover:underline">
                                Voir justificatif
                              </a>
                            ) : (
                              "Aucun lien"
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-max ${
                              evi.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600" :
                              evi.status === "REJECTED" ? "bg-rose-500/10 text-rose-600" :
                              "bg-amber-500/10 text-amber-500"
                            }`}>
                              {evi.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </PITLayout>
  );
}
