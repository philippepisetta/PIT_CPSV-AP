// cpsv-ap-app/src/app/interoperability/resilience-data-catalogue/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Database, ArrowLeft, Eye, RefreshCw, AlertTriangle, Info, CheckCircle2,
  Lock, AlertCircle, Compass, HelpCircle, HardDrive, FileSpreadsheet, ExternalLink
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

interface DatasetItem {
  id: string;
  name: string;
  owner: string;
  steward: string;
  coverage: "Available" | "Partially Available" | "Not Available" | "To Be Negotiated";
  criticality: "Low" | "Medium" | "High" | "Strategic";
  frequency: string;
  accessLevel: string;
  qualityScore: number;
  questions: string[];
}

const DATASETS: DatasetItem[] = [
  {
    id: "DS-BENEFICIARIES",
    name: "Base Centrale des Bénéficiaires & Structures PIT",
    owner: "Agence du Numérique (ADN)",
    steward: "Data Steward PIT",
    coverage: "Available",
    criticality: "Strategic",
    frequency: "Hebdomadaire",
    accessLevel: "Interne Région / Partenaires",
    qualityScore: 92,
    questions: ["Identifier les bénéficiaires exposés", "Suivre les accompagnements et services mobilisés"]
  },
  {
    id: "DS-SPW-ENERGY",
    name: "Cadastre Industriel de Consommation de Gaz et Électricité",
    owner: "SPW Territoire, Énergie, Logement",
    steward: "Data Office SPW",
    coverage: "Partially Available",
    criticality: "Strategic",
    frequency: "Mensuelle (Agrégée)",
    accessLevel: "Restreint Décideurs",
    qualityScore: 78,
    questions: ["Estimer les impacts de la crise énergétique", "Cibler les aides conjoncturelles industrielles"]
  },
  {
    id: "DS-SPW-FLOOD",
    name: "Cartographie de l'Aléa Inondation (Zones inondables wallonnes)",
    owner: "SPW Agriculture, Ressources Naturelles, Environnement",
    steward: "SPW Data Office",
    coverage: "Available",
    criticality: "High",
    frequency: "Annuelle",
    accessLevel: "Public (Open Data)",
    qualityScore: 85,
    questions: ["Identifier les infrastructures situées en zone inondable", "Estimer l'impact géospatiale des crues"]
  },
  {
    id: "DS-WE-SUPPLY",
    name: "Dépendances d'approvisionnement des filières wallonnes",
    owner: "Wallonie Entreprendre (WE)",
    steward: "Strategy Office WE",
    coverage: "To Be Negotiated",
    criticality: "Strategic",
    frequency: "Semestrielle (Enquête)",
    accessLevel: "Confidentiel (Négociation)",
    qualityScore: 45,
    questions: ["Détecter les verrous logistiques et matières critiques", "Identifier les risques d'approvisionnement"]
  },
  {
    id: "DS-EDIH-DIGITAL",
    name: "Diagnostics de Maturité Numérique et TRL (EDIH)",
    owner: "EDIH WallonIA consortium",
    steward: "ADN Operations",
    coverage: "Available",
    criticality: "High",
    frequency: "Temps Réel",
    accessLevel: "Membres du consortium",
    qualityScore: 88,
    questions: ["Identifier la vulnérabilité humaine et numérique", "Planifier les formations de rebond"]
  }
];

const DATA_GAPS = [
  {
    question: "Quels bénéficiaires sont les plus exposés à la hausse des prix énergétiques ?",
    missing: "Jeux de données individuels de consommation gaz/électricité en temps réel et type de contrat d'énergie des PME.",
    status: "En cours de négociation avec les Gestionnaires de Réseau de Distribution (Ores, Resa) pour obtenir des profils de consommation agrégés par filière.",
    criticality: "Strategic"
  },
  {
    question: "Quelles chaînes d'approvisionnement industrielles risquent de s'effondrer ?",
    missing: "Flux de transport de marchandises et carnets de commandes de premier rang des fournisseurs internationaux.",
    status: "Données privées complexes à acquérir. Piste d'enquête annuelle menée conjointement avec l'AWEX et Wallonie Entreprendre.",
    criticality: "High"
  }
];

export default function ResilienceDataCataloguePage() {
  const [filterCoverage, setFilterCoverage] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");

  const filteredDatasets = DATASETS.filter(ds => {
    if (filterCoverage !== "all" && ds.coverage !== filterCoverage) return false;
    if (filterCriticality !== "all" && ds.criticality !== filterCriticality) return false;
    return true;
  });

  const getCoverageColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Partially Available": return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "To Be Negotiated": return "bg-indigo-500/10 text-indigo-700 border-indigo-500/20";
      default: return "bg-rose-500/10 text-rose-700 border-rose-500/20";
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case "Strategic": return "bg-rose-500/15 text-rose-750 font-black border-rose-500/30";
      case "High": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      default: return "bg-muted/10 text-muted border-muted/20";
    }
  };

  return (
    <PITLayout
      category="INTEROPÉRABILITÉ"
      title="Catalogue des Données de Résilience"
      description="Inventaire stratégique, évaluation de la couverture et feuille de route des données de résilience."
      pageIcon={Database}
      breadcrumb={[{ label: "Interopérabilité", href: "/interoperability" }, { label: "Données de résilience" }]}
    >
      <div className="space-y-8">
        
        {/* Strategic Header & Context */}
        <div className="p-6 rounded-2xl bg-glass border border-muted/20 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500 opacity-[0.03] blur-3xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded-full border border-teal-500/20">
              Gouvernance de la Donnée
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-text">Objectif Métier du Catalogue</h2>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Ce catalogue répond à la question stratégique : <strong className="text-teal-655 font-bold">« De quelles données disposons-nous pour évaluer la résilience ? »</strong>. Il sert de base de négociation et de gouvernance avec nos partenaires (Wallonie Entreprendre, AWEX, SPW, IWEPS) et le Cabinet pour piloter l'acquisition de données et d'indicateurs territoriaux.
          </p>
        </div>

        {/* Section 1: Data Gaps & Acquisition Roadmap */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-650" />
            <span>Feuille de Route d'Acquisition — Identification des Gaps de données</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DATA_GAPS.map((gap, idx) => (
              <div key={idx} className="bg-rose-500/5 border border-rose-500/15 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black bg-rose-500/10 text-rose-650 px-2 py-0.5 rounded border border-rose-500/25 uppercase">
                      Gap {gap.criticality === "Strategic" ? "Stratégique" : "Critique"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-text leading-snug">
                    Pour répondre à : « {gap.question} »
                  </h4>
                  <p className="text-[10px] text-text font-semibold leading-relaxed">
                    <strong className="text-rose-650">Données manquantes :</strong> {gap.missing}
                  </p>
                </div>
                <div className="p-3 bg-glass border border-muted/10 rounded-xl text-[10px] text-muted font-semibold leading-normal flex gap-2 items-start">
                  <Info className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
                  <span><strong>Statut :</strong> {gap.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Datasets Inventory */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-muted/10 pb-2">
            <h3 className="text-xs font-black uppercase text-muted tracking-wider flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-teal-655" />
              <span>Inventaire des Jeux de Données de Résilience</span>
            </h3>

            {/* Micro Filters */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                <span>Couverture :</span>
                <select 
                  value={filterCoverage}
                  onChange={(e) => setFilterCoverage(e.target.value)}
                  className="bg-muted/10 border border-muted/20 text-[9px] font-black px-1.5 py-0.5 rounded focus:outline-none"
                >
                  <option value="all">Tous</option>
                  <option value="Available">Available</option>
                  <option value="Partially Available">Partiel</option>
                  <option value="To Be Negotiated">À négocier</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted">
                <span>Criticité :</span>
                <select 
                  value={filterCriticality}
                  onChange={(e) => setFilterCriticality(e.target.value)}
                  className="bg-muted/10 border border-muted/20 text-[9px] font-black px-1.5 py-0.5 rounded focus:outline-none"
                >
                  <option value="all">Toutes</option>
                  <option value="Strategic">Stratégique</option>
                  <option value="High">Haute</option>
                </select>
              </div>
            </div>
          </div>

          {/* Datasets Table/Cards */}
          <div className="space-y-4">
            {filteredDatasets.map((ds) => (
              <div key={ds.id} className="bg-glass border border-muted/15 p-5 rounded-2xl space-y-4 transition-all hover:scale-101">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-teal-655" />
                      <span className="text-xs font-black text-text">{ds.name}</span>
                      <span className="text-[8px] font-black text-muted tracking-wider bg-muted/5 border border-muted/10 px-1.5 py-0.5 rounded">
                        {ds.id}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted font-semibold flex flex-wrap gap-x-4">
                      <span><strong>Producteur :</strong> {ds.owner}</span>
                      <span><strong>Gestionnaire :</strong> {ds.steward}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getCoverageColor(ds.coverage)}`}>
                      {ds.coverage === "Available" ? "Disponible" : ds.coverage === "Partially Available" ? "Partiel" : "À négocier"}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getCriticalityColor(ds.criticality)}`}>
                      {ds.criticality === "Strategic" ? "Stratégique" : ds.criticality === "High" ? "Haute" : "Moyenne"}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-muted/10">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">Qualité Sémantique (Score)</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${ds.qualityScore > 85 ? "bg-emerald-500" : ds.qualityScore > 60 ? "bg-amber-500" : "bg-rose-500"}`}
                          style={{ width: `${ds.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text">{ds.qualityScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">Fréquence & Accès</span>
                    <p className="text-[10px] text-text font-semibold">
                      {ds.frequency} — <span className="text-muted">{ds.accessLevel}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase">Questions politiques alimentées</span>
                    <ul className="list-disc list-inside text-[9px] text-muted font-semibold leading-normal">
                      {ds.questions.map((q, qIdx) => (
                        <li key={qIdx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link 
            href="/interoperability"
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'Interopérabilité</span>
          </Link>
        </div>

      </div>
    </PITLayout>
  );
}
