// src/app/filieres/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  Layers, 
  Building2, 
  Users, 
  Activity, 
  Target, 
  FileCode, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Network
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

// Scenarios static data mapping Priority 5
interface FiliereData {
  actors: number;
  projectsCount: number;
  funding: string;
  outcomesCount: number;
  mainGap: string;
  actorsList: string[];
  communitiesList: string[];
  valueChains: string[];
  segments: string[];
  challenges: string[];
  consortia: string[];
  projects: string[];
  opportunities: string[];
  outcomes: string[];
  gaps: string[];
}

const FILIERES_DATA: Record<string, FiliereData> = {
  Sante: {
    actors: 12,
    projectsCount: 5,
    funding: "2.4 M€",
    outcomesCount: 15,
    mainGap: "Validation Clinique",
    actorsList: ["MedTech Namur", "CHU Liège", "UCLouvain", "Acteur Wallon Tech 15"],
    communitiesList: ["IA Santé", "Data Space"],
    valueChains: ["Santé Numérique (e-Santé)", "Biotechs"],
    segments: ["Recherche & Dév.", "Gestion des Données", "Intelligence Artificielle", "Validation Clinique", "Industrialisation"],
    challenges: ["Certification réglementaire MDR", "Sécurité des données médicales"],
    consortia: ["Consortium MedTech IA", "Consortium BioWin Diagnostics"],
    projects: ["MedTech IA Imagerie", "Biotech Diagnostics (Planné)"],
    opportunities: ["Appel Health Innovation 2026", "Horizon Europe Health"],
    outcomes: ["Algorithme clinique certifié", "Homologation logicielle IA obtenue"],
    gaps: ["Acteurs spécialisés en validation clinique", "Accompagnements réglementaires marquage CE"]
  },
  Hydrogene: {
    actors: 8,
    projectsCount: 3,
    funding: "1.5 M€",
    outcomesCount: 8,
    mainGap: "Stockage Haute Pression",
    actorsList: ["HydroGreen", "Sirris", "Acteur Wallon Tech 22", "Acteur Wallon Tech 45"],
    communitiesList: ["Hydrogène", "Circularité"],
    valueChains: ["Hydrogène Vert"],
    segments: ["Production Hydrogène", "Stockage Haute Pression", "Transport Hydrogène", "Distribution locale", "Usage Sidérurgique"],
    challenges: ["Stockage haute pression sécurisé", "Sécurité OT des vannes de pression"],
    consortia: ["Consortium Métallurgie Propre Seraing"],
    projects: ["HydroSeraing"],
    opportunities: ["Appel Décarbonation Métallurgie", "WE - Transition Écologique"],
    outcomes: ["Prototype électrolyseur industriel", "Réservoir 700 bars homologué"],
    gaps: ["Acteurs certifiés stockage 700 bars", "Compétences capteurs prédictifs IA"]
  },
  Agroalimentaire: {
    actors: 15,
    projectsCount: 4,
    funding: "1.8 M€",
    outcomesCount: 10,
    mainGap: "Conditionnement Durable",
    actorsList: ["AgriFood Solutions", "Gembloux Agro-Bio Tech", "Acteur Wallon Tech 18"],
    communitiesList: ["AgriTech", "Circularité"],
    valueChains: ["AgriFood (Transition Alimentaire)"],
    segments: ["Recherche Agronomique", "Production agricole", "Transformation saine", "Conditionnement durable", "Distribution alimentaire"],
    challenges: ["Approvisionnement local de proximité", "Traçabilité des protéines végétales"],
    consortia: ["AgriTech Coalition Gembloux"],
    projects: ["VeggieTech Wallonie"],
    opportunities: ["WE Innovation Alimentaire", "FEDER Wallonie 2021-2027"],
    outcomes: ["Chaîne de traçabilité blockchain", "Formulation végétale saine obtenue"],
    gaps: ["Acteurs en conditionnement biodégradable", "Services de logistique agroalimentaire verte"]
  },
  Mobilite: {
    actors: 10,
    projectsCount: 4,
    funding: "1.2 M€",
    outcomesCount: 7,
    mainGap: "Télématique & IoT",
    actorsList: ["LogiTrans", "SmartFleet", "DataMove", "Acteur Wallon Tech 11"],
    communitiesList: ["Smart Mobility", "Cyber PME"],
    valueChains: ["Smart Mobility", "Fret Vert"],
    segments: ["Conception Systèmes", "Télématique & IoT", "Algorithmes de Routage", "Distribution & Logistique", "Usage & Fret Vert"],
    challenges: ["NIS2 & cybersécurité fret", "Optimisation consommation carburant"],
    consortia: ["Ecosystem LogiTrans & CETIC"],
    projects: ["LogiTrans Optimisation Fret", "Fret Vert Connecté (Planné)"],
    opportunities: ["Appel Fret Vert Wallonie", "Chèques Cybersécurité PME"],
    outcomes: ["Routage prédictif NIS2 conforme", "Dispatching logistique sécurisé"],
    gaps: ["Compétences IoT NIS2 embarqué", "Services d'audit OT logistique"]
  },
  Construction: {
    actors: 9,
    projectsCount: 2,
    funding: "800 k€",
    outcomesCount: 4,
    mainGap: "Éco-conception matériaux",
    actorsList: ["Acteur Wallon Tech 30", "Acteur Wallon Tech 31", "Acteur Wallon Tech 32"],
    communitiesList: ["Construction Durable", "Circularité"],
    valueChains: ["Construction Durable"],
    segments: ["Conception Éco-design", "Recyclage & Valorisation", "Usage & Bâtiment vert"],
    challenges: ["Transition bas carbone ciment", "Recyclage granulat béton"],
    consortia: ["Consortium Éco-Granulat Wallon"],
    projects: ["Béton Circulaire Pilote"],
    opportunities: ["WE - Transition Écologique"],
    outcomes: ["Béton recyclé certifié"],
    gaps: ["Acteurs de tri de granulats béton", "Financements de prototypage béton"]
  },
  Numerique: {
    actors: 20,
    projectsCount: 8,
    funding: "3.2 M€",
    outcomesCount: 24,
    mainGap: "Compétences IA & Cyber",
    actorsList: ["CETIC", "UCLouvain", "SmartFleet", "DataMove", "Acteur Wallon Tech 14"],
    communitiesList: ["Cyber PME", "Data Space", "IA Santé"],
    valueChains: ["IA & Data Spaces", "Cybersécurité Wallonie"],
    segments: ["Intelligence Artificielle", "Gestion des Données", "Cybersécurité", "Cloud"],
    challenges: ["Conformité NIS2", "Interopérabilité des Data Spaces", "Pénurie d'experts IA"],
    consortia: ["CETIC Cyber Consortium", "Data Space Wallonie Coalition"],
    projects: ["CyberSec PME Wallonie", "Data Space Hub Pilote"],
    opportunities: ["Appel Tremplin IA 2026", "Chèques Cybersécurité PME"],
    outcomes: ["Algorithme d'IA de détection", "Audit NIS2 complété"],
    gaps: ["Acteurs de cybersécurité NIS2", "Compétences de labellisation de données IA"]
  }
};

export default function FilieresPage() {
  const [selectedFiliere, setSelectedFiliere] = useState<string>("Sante");
  const data = FILIERES_DATA[selectedFiliere] || FILIERES_DATA.Sante;

  return (
    <PITLayout
      category="PILOTAGE DES POLITIQUES"
      title="Filières S3 Wallonie"
      description="Naviguez à l'intérieur des 6 filières majeures pour analyser les acteurs, projets, financements et identifier les verrous technologiques (gaps)."
      pageIcon={Layers}
      breadcrumb={[{ label: "Filières S3" }]}
    >
      <div className="space-y-8">
        {/* Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Filières Stratégiques</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Sélectionner une filière d'activité</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(FILIERES_DATA).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFiliere(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  selectedFiliere === key 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                    : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                }`}
              >
                {key === "Sante" ? "Santé" : 
                 key === "Hydrogene" ? "Hydrogène" :
                 key === "Agroalimentaire" ? "Agroalimentaire" :
                 key === "Mobilite" ? "Mobilité" :
                 key === "Construction" ? "Construction" : "Numérique"}
              </button>
            ))}
          </div>
        </div>

        {/* Priority 3 KPI Header */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-5 w-full">
          <div className="bg-glass p-4 rounded-xl border border-muted/20 bg-glass/20 text-center">
            <Building2 className="h-4 w-4 text-teal-650 mx-auto mb-1" />
            <span className="text-[8px] font-black text-muted uppercase block">Acteurs</span>
            <span className="text-lg font-black text-text block mt-0.5">{data.actors}</span>
          </div>
          <div className="bg-glass p-4 rounded-xl border border-muted/20 bg-glass/20 text-center">
            <Activity className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
            <span className="text-[8px] font-black text-muted uppercase block">Projets</span>
            <span className="text-lg font-black text-text block mt-0.5">{data.projectsCount}</span>
          </div>
          <div className="bg-glass p-4 rounded-xl border border-muted/20 bg-glass/20 text-center">
            <FileCode className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
            <span className="text-[8px] font-black text-muted uppercase block">Financements</span>
            <span className="text-lg font-black text-text block mt-0.5">{data.funding}</span>
          </div>
          <div className="bg-glass p-4 rounded-xl border border-muted/20 bg-glass/20 text-center">
            <TrendingUp className="h-4 w-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[8px] font-black text-muted uppercase block">Outcomes</span>
            <span className="text-lg font-black text-text block mt-0.5">{data.outcomesCount}</span>
          </div>
          <div className="bg-glass p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
            <AlertTriangle className="h-4 w-4 text-rose-500 mx-auto mb-1" />
            <span className="text-[8px] font-black text-rose-500 uppercase block">Gap Principal</span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400 block mt-1 truncate">{data.mainGap}</span>
          </div>
        </section>

        {/* Detailed Grid panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Acteurs & Communautés */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2">Acteurs & Communautés</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted uppercase block">Membres du Pôle :</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.actorsList.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-glass border border-muted/20 rounded text-[10px] font-semibold text-text">{a}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted uppercase block">Cercles d'Écosystèmes :</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.communitiesList.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-700 rounded text-[10px] font-extrabold">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chaînes de Valeur & Défis */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2">Chaînes & Défis</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted uppercase block">Chaînes de valeur S3 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.valueChains.map((vc, i) => (
                    <span key={i} className="px-2 py-0.5 bg-teal-500/10 text-teal-700 rounded text-[10px] font-extrabold">{vc}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-muted uppercase block">Défis à résoudre :</span>
                {data.challenges.map((ch, i) => (
                  <div key={i} className="p-2 bg-glass/25 border border-rose-500/20 text-text rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consortiums & Projets */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2">Consortiums & Projets</h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted uppercase block">Consortiums montés :</span>
                <div className="space-y-1">
                  {data.consortia.map((con, i) => (
                    <div key={i} className="p-2 bg-glass/20 border border-muted/10 rounded-lg text-[10px] font-bold text-text flex items-center justify-between">
                      <span>{con}</span>
                      <Network className="h-3.5 w-3.5 text-teal-605" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted uppercase block">Projets de R&D :</span>
                <div className="space-y-1">
                  {data.projects.map((pr, i) => (
                    <div key={i} className="p-2 bg-glass/20 border border-muted/10 rounded-lg text-[10px] font-bold text-text flex items-center justify-between">
                      <span>{pr}</span>
                      <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-1 rounded">Actif</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gaps / Gap Analysis */}
        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
            <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Analyse des Écarts Territoriaux (Diagnostic de Gaps)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.gaps.map((gap, i) => (
              <div key={i} className="bg-glass/20 p-3.5 rounded-xl border border-rose-500/10 text-xs font-medium text-text leading-relaxed">
                <strong>Écart détecté :</strong> {gap}
              </div>
            ))}
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
