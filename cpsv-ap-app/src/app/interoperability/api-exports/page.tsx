// src/app/interoperability/api-exports/page.tsx
"use client";

import React from "react";
import { Zap, Link as LinkIcon, Download, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function ApiExportsPage() {
  const endpoints = [
    {
      name: "Catalogue des Services CPSV-AP (JSON-LD / RDF)",
      description: "Exposition sémantique de l'offre régionale de services publics wallons selon la spécification européenne CPSV-AP v3.0.",
      format: "JSON-LD / RDF",
      status: "Prototype",
      type: "Exposition"
    },
    {
      name: "Bénéficiaires & Profils d'Acteurs (DCAT-AP Dataset)",
      description: "Métadonnées de description des bases d'accompagnement territorial au format de catalogue ouvert de données DCAT-AP.",
      format: "DCAT-AP XML/Turtle",
      status: "Cible vNext",
      type: "Export"
    },
    {
      name: "Flux de Maturité Temps Réel (NGSI-LD Context)",
      description: "Courants d'événements de changement de statut et de maturité DMAT pour synchronisation avec la Smart City Platform de Wallonie.",
      format: "NGSI-LD Context",
      status: "Cible vNext",
      type: "Sync"
    },
    {
      name: "API Entités & Graphe local (GraphQL)",
      description: "Endpoint d'interrogation du Territorial Knowledge Graph pour les applications tierces et agents autonomes (RAG).",
      format: "GraphQL / JSON",
      status: "Disponible",
      type: "API"
    },
    {
      name: "API REST CRUD Métier (V2 API)",
      description: "Endpoint standard d'intégration pour la création, mise à jour et archivage des bénéficiaires, projets et justificatifs.",
      format: "REST / JSON",
      status: "Disponible",
      type: "API"
    }
  ];

  return (
    <PITLayout
      category="DONNÉES & INTEROPÉRABILITÉ"
      title="API & Exports Sémantiques"
      description="Gérez les points d'accès techniques, téléchargez les schémas de données et configurez les flux d'expositions de la PIT."
      pageIcon={Zap}
      breadcrumb={[{ label: "Interopérabilité" }, { label: "API & exports" }]}
    >
      <div className="space-y-6">
        
        {/* Intro */}
        <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-2">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Interopérabilité Européenne & Régionale</h3>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Le contenu détaillé de cette vue sera enrichi dans une prochaine étape. Les flux de synchronisation temps réel et d'exposition aux formats normalisés DCAT-AP et NGSI-LD sont configurés ici.
          </p>
        </div>

        {/* List of endpoints */}
        <div className="space-y-4">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="bg-glass/30 border border-muted/15 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded uppercase">{ep.type}</span>
                  <span className="text-[10px] font-mono bg-glass border border-muted/20 px-2 py-0.2 rounded font-bold text-muted">{ep.format}</span>
                </div>
                <h4 className="font-extrabold text-sm text-text leading-tight">{ep.name}</h4>
                <p className="text-xs text-muted leading-snug font-semibold">{ep.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border ${
                  ep.status === "Disponible" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  ep.status === "Prototype" ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" :
                  "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}>
                  {ep.status === "Disponible" && <CheckCircle className="h-3 w-3 shrink-0" />}
                  {ep.status === "Prototype" && <Clock className="h-3 w-3 shrink-0" />}
                  {ep.status === "Cible vNext" && <AlertTriangle className="h-3 w-3 shrink-0" />}
                  {ep.status}
                </span>

                <button className="p-2 hover:bg-glass rounded-xl border border-muted/20 text-muted hover:text-text cursor-pointer flex items-center justify-center">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PITLayout>
  );
}
