// src/app/accompaniment/page.tsx
"use client";

import React, { useMemo } from "react";
import { 
  Users, 
  Share2, 
  FileCode, 
  TrendingUp, 
  ClipboardCheck, 
  Activity, 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FolderGit,
  Compass
} from "lucide-react";
import Link from "next/link";
import PITLayout from "@/design-system/PITLayout";
import PITStatCard from "@/design-system/PITStatCard";
import { 
  useV2EcosystemKpisQuery, 
  useV2EcosystemActivityQuery, 
  useV2EvidencesQuery,
  useV2UpdateEvidenceStatusMutation
} from "@/hooks/usePITQueries";
import { useV2Beneficiaries } from "@/hooks/useV2Queries";

export default function AccompanimentPage() {
  const { data: kpisRes, isLoading: kpisLoading } = useV2EcosystemKpisQuery();
  const { data: activityRes, isLoading: activityLoading } = useV2EcosystemActivityQuery();
  const { data: evidencesRes, isLoading: evidencesLoading } = useV2EvidencesQuery();
  const { data: beneficiariesRes, isLoading: beneficiariesLoading } = useV2Beneficiaries();
  
  const updateStatusMutation = useV2UpdateEvidenceStatusMutation();

  const kpis = kpisRes?.data || { members: 0, activeMembers: 0, projects: 0, opportunities: 0, events: 0, collaborations: 0 };
  const activities = activityRes?.data || [];
  const evidences = evidencesRes?.data || [];
  const beneficiaries = beneficiariesRes?.data || [];

  const pendingEvidences = useMemo(() => {
    return evidences.filter((e: any) => e.status === "PENDING");
  }, [evidences]);

  const handleEvidenceAction = (id: number, status: "APPROVED" | "REJECTED") => {
    updateStatusMutation.mutate({ id, status });
  };

  // Funnel steps data
  const funnelSteps = [
    { label: "Participants", count: 120, pct: 100, desc: "Acteurs ayant participé à une activité collective, un atelier, un webinaire." },
    { label: "Diagnostics", count: 45, pct: 37.5, desc: "Bénéficiaires ayant complété un diagnostic de maturité DMAT." },
    { label: "Services", count: 30, pct: 66.7, desc: "Services ou accompagnements effectivement délivrés." },
    { label: "Financements", count: 15, pct: 50, desc: "Aides ou subsides connectés à un bénéficiaire ou projet." },
    { label: "Projets", count: 8, pct: 53.3, desc: "Projets collaboratifs R&D ou de transition lancés." },
    { label: "Outcomes", count: 5, pct: 62.5, desc: "Résultats d'impact qualifiés rattachés à une preuve." }
  ];

  const loading = kpisLoading || activityLoading || evidencesLoading || beneficiariesLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de l'Espace Accompagnement...</p>
      </div>
    );
  }

  return (
    <PITLayout
      category="ESPACE ACCOMPAGNEMENT"
      title="Tableau de Bord Accompagnement & Animation"
      description="Gérez votre portefeuille de bénéficiaires, planifiez les parcours d'accompagnement individuels, et pilotez l'animation collective de votre écosystème."
      pageIcon={Users}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Accompagnement" }]}
    >
      <div className="space-y-8">
        {/* KPIs Section */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <PITStatCard label="Bénéficiaires Suivis" value={beneficiaries.length} icon={Users} themeColor="teal" description="Structures dans le portefeuille" />
          <PITStatCard label="Communautés" value={10} icon={Share2} themeColor="indigo" description="Cercles d'animation thématiques" />
          <PITStatCard label="Opportunités Actives" value={kpis.opportunities} icon={FileCode} themeColor="emerald" description="Appels d'innovation ouverts" />
          <PITStatCard label="Indice de Dynamique" value="84%" icon={TrendingUp} themeColor="amber" description="Taux d'engagement de l'écosystème" />
        </section>

        {/* Portefeuille & Quick actions split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Portfolio quick list */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-muted/10 pb-4">
              <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                <Users className="h-5 w-5 text-teal-650" />
                Mon Portefeuille de Bénéficiaires
              </h3>
              <Link 
                href="/accompaniment/beneficiaries"
                className="text-xs font-black text-teal-650 bg-teal-500/10 px-2.5 py-1 rounded-xl hover:bg-teal-500/20 transition-all"
              >
                Gérer le portefeuille →
              </Link>
            </div>
            
            <div className="divide-y divide-muted/10">
              {beneficiaries.slice(0, 5).map((bene: any) => (
                <div key={bene.id} className="py-3 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="font-bold text-text block">{bene.name}</span>
                    <span className="text-muted text-[10px] block">{bene.location} • {bene.size || "PME"}</span>
                  </div>
                  <Link
                    href={`/accompaniment/beneficiaries`}
                    className="text-[10px] font-black text-teal-650 hover:underline"
                  >
                    Fiche 360°
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
            <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider border-b border-muted/10 pb-4">
              Actions d'Accompagnement
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/accompaniment/journeys"
                className="flex items-center justify-between p-3 bg-glass/35 hover:bg-glass/60 rounded-xl border border-muted/15 text-xs font-bold text-text transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-teal-605 group-hover:scale-110 transition-transform" />
                  Lancer un Parcours
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/accompaniment/beneficiaries?action=new"
                className="flex items-center justify-between p-3 bg-glass/35 hover:bg-glass/60 rounded-xl border border-muted/15 text-xs font-bold text-text transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  Nouveau Bénéficiaire
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/accompaniment/activities?action=new-collective"
                className="flex items-center justify-between p-3 bg-glass/35 hover:bg-glass/60 rounded-xl border border-muted/15 text-xs font-bold text-text transition-all group"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  Créer un Atelier / Webinaire
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Funnel d'Animation */}
        <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
          <div className="border-b border-muted/10 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                <TrendingUp className="h-5 w-5 text-teal-650" />
                Funnel d'Animation Régionale (Conversion de valeur)
              </h3>
              <p className="text-[11px] text-muted mt-0.5">Le funnel mesure la conversion de l’animation territoriale en valeur opérationnelle et en impact mesurable.</p>
            </div>
            <span className="text-xs font-black text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
              SoI Mode
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            {funnelSteps.map((step, idx) => (
              <div 
                key={step.label} 
                className="bg-glass/35 border border-muted/15 p-4 rounded-xl flex flex-col justify-between space-y-2 relative overflow-hidden transition-all hover:scale-102 hover:shadow"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-muted">{idx + 1}. {step.label}</span>
                    {idx > 0 && (
                      <span className="text-[8px] font-black bg-teal-500/10 text-teal-655 px-1 rounded">
                        -{Math.round(100 - step.pct)}%
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-text">{step.count}</h4>
                  <p className="text-[9px] text-muted leading-tight font-semibold">{step.desc}</p>
                </div>

                <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" 
                    style={{ width: `${step.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preuves & Activités splits */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Preuves */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-muted/10 pb-4">
              <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                <ClipboardCheck className="h-5 w-5 text-teal-650" />
                Vérification des Justificatifs (Evidence Audit)
              </h3>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal-500/10 text-teal-650">
                {pendingEvidences.length} en attente
              </span>
            </div>

            {pendingEvidences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                <p className="text-xs font-bold">Aucune preuve d'impact en attente de vérification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                      <th className="py-2">Justificatif</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Statut</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEvidences.map((evi: any) => (
                      <tr key={evi.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-text block">{evi.name}</span>
                          <span className="text-muted text-[10px] block max-w-sm truncate">{evi.description}</span>
                        </td>
                        <td className="py-3">
                          <span className="bg-glass border border-muted/20 px-2 py-0.5 rounded-md text-[10px] font-mono">
                            {evi.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500">
                            PENDING
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleEvidenceAction(evi.id, "APPROVED")}
                            className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => handleEvidenceAction(evi.id, "REJECTED")}
                            className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                          >
                            Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Activities timeline */}
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-muted/10 pb-4">
              <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                <Activity className="h-5 w-5 text-indigo-500" />
                Activités Récentes
              </h3>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin">
              {activities.slice(0, 5).map((act: any) => (
                <div key={act.id} className="border-l-2 border-indigo-500/30 pl-3 py-1 space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-indigo-500 block">
                    {act.type}
                  </span>
                  <p className="text-xs font-bold text-text leading-tight">{act.title}</p>
                  <p className="text-[10px] text-muted leading-tight">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
