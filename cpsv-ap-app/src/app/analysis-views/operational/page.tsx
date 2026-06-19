// src/app/analysis-views/operational/page.tsx
"use client";

import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function OperationalPerspectivePlaceholderPage() {
  return (
    <PITLayout
      category="VUE D'ANALYSE"
      title="Perspective opérationnelle"
      description="Suivre les activités, diagnostics, missions, services délivrés, financements, projets et preuves à valider."
      pageIcon={Activity}
      breadcrumb={[{ label: "Vues d'analyse", href: "/analysis-views" }, { label: "Perspective opérationnelle" }]}
    >
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl shadow-xs max-w-2xl mx-auto space-y-6">
        <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <Activity className="h-10 w-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-text">Perspective opérationnelle</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            Cette vue d'analyse consolidera toutes les actions d'accompagnement terrain : suivi des diagnostics de maturité numérique, des activités d'animation collective, de l'état d'avancement des projets et de la validation des preuves de livraison.
          </p>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 max-w-md leading-relaxed">
          🚧 <strong>Module en cours de maturation</strong> : Le contenu détaillé et interactif de cette vue analytique sera construit et connecté lors d'une prochaine étape de développement.
        </div>
        <Link 
          href="/analysis-views"
          className="flex items-center gap-2 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux Vues d'analyse</span>
        </Link>
      </div>
    </PITLayout>
  );
}
