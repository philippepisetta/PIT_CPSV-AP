// src/app/analysis-views/page.tsx
"use client";

import Link from "next/link";
import { 
  Layers, 
  Network, 
  Target, 
  Activity, 
  Globe, 
  Database, 
  Zap,
  Shield
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

interface PerspectiveCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  badge?: string;
  colorClass: string;
  iconColorClass: string;
}

const cards: PerspectiveCard[] = [
  {
    title: "Cartographie globale",
    description: "Visualiser l’ensemble des liens entre acteurs, services, projets, communautés, données, filières et impacts.",
    href: "/graph",
    icon: Network,
    badge: "Actif",
    colorClass: "hover:border-teal-500/50 hover:shadow-teal-500/5",
    iconColorClass: "text-teal-600 dark:text-teal-400 bg-teal-500/10"
  },
  {
    title: "Stratégie & impacts",
    description: "Analyser les objectifs, priorités, programmes, KPI, outcomes et contributions aux stratégies régionales.",
    href: "/strategic",
    icon: Target,
    badge: "Actif",
    colorClass: "hover:border-amber-500/50 hover:shadow-amber-500/5",
    iconColorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
  },
  {
    title: "Opérations & suivi",
    description: "Suivre les activités, diagnostics, missions, services délivrés, financements, projets et preuves à valider.",
    href: "/analysis-views/operational",
    icon: Activity,
    badge: "Bientôt",
    colorClass: "hover:border-rose-500/50 hover:shadow-rose-500/5",
    iconColorClass: "text-rose-600 dark:text-rose-400 bg-rose-500/10"
  },
  {
    title: "Territoire & écosystèmes",
    description: "Explorer la répartition territoriale des acteurs, communautés, filières, chaînes de valeur et dynamiques locales.",
    href: "/territories",
    icon: Globe,
    badge: "Actif",
    colorClass: "hover:border-blue-500/50 hover:shadow-blue-500/5",
    iconColorClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10"
  },
  {
    title: "Données & interopérabilité",
    description: "Analyser les datasets, demandes de données, accords, qualité, interopérabilité, API, DCAT-AP et NGSI-LD.",
    href: "/interoperability",
    icon: Database,
    badge: "Actif",
    colorClass: "hover:border-purple-500/50 hover:shadow-purple-500/5",
    iconColorClass: "text-purple-605 dark:text-purple-400 bg-purple-500/10"
  },
  {
    title: "Parcours & transformation",
    description: "Suivre les parcours des bénéficiaires, leur maturité, les services consommés, les recommandations et la progression.",
    href: "/analysis-views/transformation",
    icon: Zap,
    badge: "Bientôt",
    colorClass: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
    iconColorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
  },
  {
    title: "Résilience territoriale",
    description: "Analyser l’exposition, la vulnérabilité, la capacité d’absorption, d’adaptation et de rebond des acteurs économiques wallons face à différents chocs : crise énergétique, inondation, cybermenace, pandémie ou rupture d’approvisionnement.",
    href: "/analysis-views/resilience",
    icon: Shield,
    badge: "Prototype",
    colorClass: "hover:border-cyan-500/50 hover:shadow-cyan-500/5",
    iconColorClass: "text-cyan-600 dark:text-cyan-405 bg-cyan-500/10"
  }
];

export default function AnalysisViewsHubPage() {
  return (
    <PITLayout
      category="ESPACES D'ANALYSE"
      title="Vues d’analyse"
      description="Sélectionnez une perspective d'analyse métier pour filtrer et explorer les informations territoriales selon vos besoins de pilotage."
      pageIcon={Layers}
      breadcrumb={[{ label: "Vues d'analyse" }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.title} 
              href={card.href}
              className={`flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${card.colorClass}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.iconColorClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {card.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    card.badge === "Actif" 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-black text-text mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {card.description}
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-teal-605 group-hover:underline pt-2 border-t border-gray-100 dark:border-gray-850">
                <span>Explorer cette vue</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </PITLayout>
  );
}
