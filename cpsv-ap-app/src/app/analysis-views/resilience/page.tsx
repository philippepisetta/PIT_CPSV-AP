// src/app/analysis-views/resilience/page.tsx
"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Eye, Activity, Heart, RefreshCw, Layers, Zap, AlertTriangle } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function ResiliencePerspectivePage() {
  const framework = [
    {
      title: "1. Exposition",
      question: "Qui peut être touché ?",
      examples: "Localisation, zone inondable, secteur énergivore, marché export, dépendance numérique.",
      icon: Eye,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10"
    },
    {
      title: "2. Vulnérabilité",
      question: "Quelle serait la gravité de l’impact ?",
      examples: "Taille, emploi, chiffre d’affaires, fonds propres, dépendance client ou fournisseur.",
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
    },
    {
      title: "3. Capacité d’absorption",
      question: "Combien de temps peut-on tenir ?",
      examples: "Trésorerie, stocks, réserves, aides déjà reçues, capacité financière.",
      icon: Heart,
      color: "text-teal-650 dark:text-teal-400 bg-teal-500/10"
    },
    {
      title: "4. Capacité d’adaptation",
      question: "Existe-t-il des alternatives ?",
      examples: "Fournisseurs alternatifs, télétravail, diversification, appartenance à un cluster ou pôle.",
      icon: Layers,
      color: "text-indigo-650 dark:text-indigo-400 bg-indigo-500/10"
    },
    {
      title: "5. Capacité de rebond",
      question: "Comment revenir à la normale ou se renforcer ?",
      examples: "Financement, assurance, accompagnement, innovation, services publics mobilisables.",
      icon: RefreshCw,
      color: "text-emerald-650 dark:text-emerald-400 bg-emerald-500/10"
    }
  ];

  const useCases = [
    {
      title: "Crise énergétique",
      desc: "Identifier les entreprises et filières exposées à une hausse brutale du coût de l’énergie.",
      color: "border-amber-500/25 bg-amber-500/5 text-amber-900 dark:text-amber-300"
    },
    {
      title: "Inondation",
      desc: "Identifier les entreprises et emplois situés dans des zones impactées ou vulnérables.",
      color: "border-blue-500/25 bg-blue-500/5 text-blue-900 dark:text-blue-300"
    },
    {
      title: "Rupture d’approvisionnement",
      desc: "Identifier les filières dépendantes de fournisseurs, pays ou matières critiques.",
      color: "border-purple-500/25 bg-purple-500/5 text-purple-900 dark:text-purple-300"
    },
    {
      title: "Cybermenace",
      desc: "Identifier les bénéficiaires exposés à des risques numériques et les services de rebond mobilisables.",
      color: "border-rose-500/25 bg-rose-500/5 text-rose-900 dark:text-rose-300"
    }
  ];

  return (
    <PITLayout
      category="VUE D'ANALYSE"
      title="Résilience territoriale"
      description="Vue d’analyse dédiée à l’évaluation de la résilience économique du territoire wallon."
      pageIcon={Shield}
      breadcrumb={[{ label: "Vues d'analyse", href: "/analysis-views" }, { label: "Résilience territoriale" }]}
    >
      <div className="space-y-8">
        
        {/* Subtitle / Intro Banner */}
        <div className="p-6 rounded-2xl bg-glass border border-muted/20 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500 opacity-[0.03] blur-3xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">
              Prototype / Cible vNext
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-text">Cadre Wallon de Résilience Économique Territoriale ( Caroline / OCDE )</h2>
          <p className="text-xs text-text leading-relaxed font-semibold">
            La PIT ne vise pas à devenir une salle de crise ni un centre de commandement opérationnel. Cette vue a pour objectif de préparer une capacité d’analyse permettant d’identifier les acteurs exposés, les vulnérabilités économiques, les dépendances critiques, les capacités d’adaptation et les leviers de rebond.
          </p>
        </div>

        {/* Cadre d'analyse (5 Dimensions) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">
            Cadre d'analyse (5 Dimensions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {framework.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-glass/35 border border-muted/15 p-4 rounded-xl flex flex-col justify-between space-y-4 transition-all hover:scale-102">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-text">{f.title}</span>
                      <div className={`p-1.5 rounded-lg ${f.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-teal-655 block leading-tight">{f.question}</span>
                      <p className="text-[10px] text-muted font-semibold leading-normal">{f.examples}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cas d'usage pressentis */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">
            Cas d'usage pressentis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${uc.color}`}>
                <h4 className="text-xs font-black uppercase tracking-wider">{uc.title}</h4>
                <p className="text-[10px] leading-relaxed font-semibold">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Maturation Note */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 max-w-2xl leading-relaxed">
          🚧 Le contenu détaillé de cette vue sera construit dans une prochaine étape sur base d’un cas d’usage validé avec les partenaires.
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link 
            href="/analysis-views"
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux Vues d'analyse</span>
          </Link>
        </div>

      </div>
    </PITLayout>
  );
}
