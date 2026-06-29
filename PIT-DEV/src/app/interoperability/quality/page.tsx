// src/app/interoperability/quality/page.tsx
"use client";

import React from "react";
import { CheckCircle2, ShieldAlert, Award, Star, Compass, Layout } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function DataQualityPage() {
  const dimensions = [
    { name: "Complétude", score: 94, desc: "Taux de présence des champs obligatoires (ex: n° BCE, raison sociale, contacts).", status: "Disponible" },
    { name: "Précision", score: 88, desc: "Exactitude des informations de géolocalisation et des classifications NACE.", status: "Disponible" },
    { name: "Conformité", score: 100, desc: "Respect des standards de schémas sémantiques CPSV-AP et DCAT-AP.", status: "Disponible" },
    { name: "Unicité", score: 97, desc: "Absence de doublons de bénéficiaires ou d'acteurs identifiés par URI unique.", status: "Disponible" },
    { name: "Cohérence", score: 91, desc: "Logique des relations de graphe (ex: pas d'impact sans preuve liée).", status: "Disponible" },
    { name: "Fraîcheur", score: 85, desc: "Délai écoulé depuis la dernière synchronisation avec la source d'autorité BCE.", status: "Prototype" },
    { name: "Traçabilité", score: 100, desc: "Présence des métadonnées de provenance (SourceSystem, lastSyncedAt).", status: "Disponible" },
    { name: "Clarté", score: 90, desc: "Documentation et lisibilité des taxonomies et libellés dans le graphe.", status: "Prototype" },
    { name: "Disponibilité", score: 99, desc: "Taux d'accès aux APIs sémantiques et aux flux d'exportations régionales.", status: "Prototype" }
  ];

  return (
    <PITLayout
      category="GOUVERNANCE DES DONNÉES"
      title="Qualité des Données Territoriales"
      description="Évaluez la conformité, la fraîcheur et la fiabilité des entités indexées dans le Territorial Knowledge Graph."
      pageIcon={Award}
      breadcrumb={[{ label: "Interopérabilité" }, { label: "Qualité des données" }]}
    >
      <div className="space-y-6">
        
        {/* Banner Explanatory */}
        <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500 opacity-[0.03] blur-3xl rounded-full" />
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Pourquoi mesurer la qualité ?</h3>
          <p className="text-xs text-text leading-relaxed font-semibold">
            La qualité des données est évaluée pour garantir que les données territoriales sont utilisables, compréhensibles, fiables, traçables et adaptées aux usages de pilotage, d’interopérabilité et de recommandation.
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((dim, idx) => (
            <div key={idx} className="bg-glass/30 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:scale-102">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-teal-605 uppercase tracking-wider">{dim.name}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    dim.status === "Disponible" 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                      : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                  }`}>
                    {dim.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-snug font-semibold">{dim.desc}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-muted/5">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-muted">Score de qualité</span>
                  <span className="text-teal-655">{dim.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden border border-muted/10">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" 
                    style={{ width: `${dim.score}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PITLayout>
  );
}
