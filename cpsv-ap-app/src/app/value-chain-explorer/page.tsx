// src/app/value-chain-explorer/page.tsx
"use client";

import { useState } from "react";
import { 
  Network, 
  ArrowRight, 
  Building2, 
  Layers, 
  FileText, 
  Activity, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

// Scenarios data for Priority 2 Value Chain Explorer
interface SegmentDetail {
  name: string;
  actors: string[];
  competencies: string[];
  services: string[];
  projects: string[];
  funding: string[];
  gaps: string[];
}

const VALUE_CHAINS: Record<string, { title: string; segments: SegmentDetail[] }> = {
  Hydrogene: {
    title: "Chaîne de Valeur - Hydrogène Vert",
    segments: [
      {
        name: "Production Hydrogène",
        actors: ["HydroGreen", "Cockerill"],
        competencies: ["Électrolyse", "Séparation des gaz"],
        services: ["Test Before Invest - Sirris"],
        projects: ["HydroSeraing"],
        funding: ["Appel Décarbonation"],
        gaps: []
      },
      {
        name: "Stockage Haute Pression",
        actors: [],
        competencies: ["R&D Pression"],
        services: [],
        projects: [],
        funding: [],
        gaps: ["Pas d'acteur certifié stockage 700 bars", "Pas de service public d'accompagnement spécifique", "Pas de financement de prototypage ciblé"]
      },
      {
        name: "Transport Hydrogène",
        actors: ["Fluxys", "LogiTrans"],
        competencies: ["Canalisations gaz", "Camions citernes"],
        services: ["Chèques Cyber PME"],
        projects: ["Fret Vert Connecté"],
        funding: ["Appel Fret Vert"],
        gaps: ["Réglementation transport hydrogène manquante"]
      },
      {
        name: "Distribution locale",
        actors: ["Dats24"],
        competencies: ["Stations-services hydrogène"],
        services: ["Conseil d'installation"],
        projects: [],
        funding: [],
        gaps: ["Gaps de raccordement réseau"]
      },
      {
        name: "Usage Sidérurgique",
        actors: ["Aperam Seraing"],
        competencies: ["Sidérurgie verte", "Fours à hydrogène"],
        services: ["Audit Transition Énergétique"],
        projects: ["HydroSeraing"],
        funding: ["Appel Décarbonation Métallurgie"],
        gaps: []
      }
    ]
  },
  Sante: {
    title: "Chaîne de Valeur - Santé Numérique",
    segments: [
      {
        name: "Recherche & Dév.",
        actors: ["UCLouvain", "CETIC"],
        competencies: ["Deep Learning", "Imagerie"],
        services: ["Test Before Invest"],
        projects: ["MedTech IA Imagerie"],
        funding: ["Appel Health Innovation 2026"],
        gaps: []
      },
      {
        name: "Gestion des Données",
        actors: ["CHU Liège", "MedTech Namur"],
        competencies: ["Data Space", "Sécurité des données"],
        services: ["Diagnostic Clinique IA"],
        projects: ["MedTech IA Imagerie"],
        funding: ["Horizon Europe Health"],
        gaps: []
      },
      {
        name: "Intelligence Artificielle",
        actors: ["UCLouvain", "MedTech Namur"],
        competencies: ["Algorithmes prédictifs", "Computer Vision"],
        services: ["Diagnostic Clinique IA"],
        projects: ["MedTech IA Imagerie"],
        funding: ["Appel Tremplin IA 2026"],
        gaps: []
      },
      {
        name: "Validation Clinique",
        actors: ["CHU Liège"],
        competencies: ["Essais cliniques"],
        services: [],
        projects: [],
        funding: [],
        gaps: ["Absence de PME de support d'essais cliniques", "Pas d'accompagnement labellisation"]
      },
      {
        name: "Industrialisation",
        actors: [],
        competencies: ["Marquage CE MDR"],
        services: [],
        projects: [],
        funding: [],
        gaps: ["Pénurie de consultants agréés CE MDR", "Pas de financement de pré-certification", "Aucune infrastructure de test locale"]
      }
    ]
  }
};

export default function ValueChainExplorerPage() {
  const [selectedChain, setSelectedChain] = useState<string>("Hydrogene");
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);

  const chain = VALUE_CHAINS[selectedChain] || VALUE_CHAINS.Hydrogene;
  const segment = chain.segments[selectedSegmentIdx] || chain.segments[0];

  const getSegmentColor = (seg: SegmentDetail) => {
    const gaps = seg.gaps.length;
    if (gaps === 0) return "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (gaps <= 2) return "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    return "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
  };

  return (
    <PITLayout
      category="EXPOSITION SÉMANTIQUE"
      title="Value Chain Visual Explorer"
      description="Visualisez graphiquement l'alignement de vos filières. Identifiez les segments orphelins ou sous-représentés."
      pageIcon={Network}
      breadcrumb={[{ label: "Value Chain Explorer" }]}
    >
      <div className="space-y-6">
        {/* Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Chaînes de Valeur S3</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Sélectionner une chaîne de valeur</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(VALUE_CHAINS).map((key) => (
              <button
                key={key}
                onClick={() => { setSelectedChain(key); setSelectedSegmentIdx(0); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  selectedChain === key 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                    : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                }`}
              >
                {key === "Hydrogene" ? "Hydrogène Vert" : "Santé Numérique (e-Santé)"}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Pipeline Visualization */}
        <div className="bg-glass/10 border border-muted/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-4 overflow-x-auto scrollbar-thin py-10">
          {chain.segments.map((seg, idx) => {
            const colorClasses = getSegmentColor(seg);
            const isSelected = selectedSegmentIdx === idx;
            return (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setSelectedSegmentIdx(idx)}
                  className={`p-5 border-2 rounded-2xl text-left w-52 transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${colorClasses} ${
                    isSelected ? "ring-4 ring-teal-500/40 font-black shadow-md scale-102" : "opacity-80"
                  }`}
                >
                  <span className="text-[9px] font-black uppercase opacity-75 block">Maillon {idx + 1}</span>
                  <h4 className="text-xs font-black text-text mt-1.5 leading-snug">{seg.name}</h4>
                  
                  <div className="flex justify-between items-center mt-4 text-[9px] font-extrabold border-t border-muted/15 pt-2">
                    <span>Gaps: {seg.gaps.length}</span>
                    <span className="px-2 py-0.5 rounded bg-black/15">
                      {seg.gaps.length === 0 ? "COUV." : seg.gaps.length >= 3 ? "CRITIQUE" : "GAP"}
                    </span>
                  </div>
                </button>
                {idx < chain.segments.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted shrink-0 rotate-90 md:rotate-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Active Segment Detail Drawer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Diagnostic & Gaps Panel */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Diagnostics & Gaps ({segment.gaps.length})
            </h4>

            {segment.gaps.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-xs py-4 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>Ce maillon est entièrement couvert d'un point de vue acteurs, compétences et accompagnements.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {segment.gaps.map((g, i) => (
                  <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/15 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-medium leading-relaxed">
                    {g}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acteurs & Compétences */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-650" />
              Acteurs & Compétences
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Acteurs sur ce maillon :</span>
                {segment.actors.length === 0 ? (
                  <span className="text-xs text-muted italic">Aucun acteur recensé</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {segment.actors.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 bg-glass border border-muted/20 rounded text-[10px] font-semibold text-text">{a}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Compétences clés associées :</span>
                <div className="flex flex-wrap gap-1.5">
                  {segment.competencies.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-700 rounded text-[10px] font-extrabold">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services, Projets & Financements */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              Accompagnements
            </h4>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted uppercase block">Services Disponibles :</span>
                {segment.services.length === 0 ? (
                  <span className="text-[10px] text-muted italic">Aucun service public</span>
                ) : (
                  segment.services.map((s, i) => (
                    <div key={i} className="text-[10px] font-bold bg-glass/20 border border-muted/10 p-2 rounded-lg text-text">
                      {s}
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted uppercase block">Projets de R&D :</span>
                {segment.projects.length === 0 ? (
                  <span className="text-[10px] text-muted italic">Aucun projet actif</span>
                ) : (
                  segment.projects.map((p, i) => (
                    <div key={i} className="text-[10px] font-bold bg-glass/20 border border-muted/10 p-2 rounded-lg text-text">
                      {p}
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted uppercase block">Financements Mobiles :</span>
                {segment.funding.length === 0 ? (
                  <span className="text-[10px] text-muted italic">Aucun financement</span>
                ) : (
                  segment.funding.map((f, i) => (
                    <div key={i} className="text-[10px] font-bold bg-glass/20 border border-muted/10 p-2 rounded-lg text-text">
                      {f}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
