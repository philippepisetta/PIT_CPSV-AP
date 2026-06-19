// src/app/governance/referentiels/page.tsx
"use client";

import React from "react";
import { BookOpen, Layers, CheckCircle2 } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function ReferentielsPage() {
  const referentiels = [
    { name: "Secteurs NACE", description: "Nomenclature officielle des activités économiques en Wallonie (BCE).", standard: "Eurostat NACE Rev. 2", status: "Disponible" },
    { name: "Maturité DR-BEST", description: "Taxonomie transversale d'audit technologique et d'évaluation numérique.", standard: "Wallonie / AdN", status: "Disponible" },
    { name: "Priorités S3", description: "Domaines technologiques et thématiques de la Smart Specialisation Strategy wallonne.", standard: "SPW Économie / S3", status: "Disponible" },
    { name: "Services Publics (CPSV-AP)", description: "Modélisation des caractéristiques descriptives des aides d'innovation.", standard: "SEMIC CPSV-AP v3.0", status: "Disponible" }
  ];

  return (
    <PITLayout
      category="GOUVERNANCE"
      title="Référentiels & Taxonomies"
      description="Gérez les vocabulaires contrôlés et alignements de taxonomies transversales de la Plateforme d'Intelligence Territoriale."
      pageIcon={BookOpen}
      breadcrumb={[{ label: "Gouvernance" }, { label: "Référentiels" }]}
    >
      <div className="space-y-6">
        
        {/* Placeholder banner */}
        <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-2">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Gestion des Vocabulaires Contrôlés</h3>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Le contenu détaillé de cette vue sera construit dans une prochaine étape. Les taxonomies et référentiels officiels de l'administration régionale sont listés ci-dessous.
          </p>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {referentiels.map((ref, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-glass/30 border border-muted/15 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-teal-605 uppercase tracking-wider">{ref.name}</span>
                <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">{ref.status}</span>
              </div>
              <p className="text-[11px] text-muted font-semibold leading-snug">{ref.description}</p>
              <div className="pt-2.5 border-t border-muted/5 flex justify-between items-center text-[10px] font-black text-muted">
                <span>Standard : {ref.standard}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PITLayout>
  );
}
