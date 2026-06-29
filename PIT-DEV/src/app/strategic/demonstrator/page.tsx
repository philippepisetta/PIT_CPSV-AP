// cpsv-ap-app/src/app/strategic/demonstrator/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Compass, ArrowLeft, Target, ShieldAlert, Activity, CheckCircle, 
  HelpCircle, ChevronRight, Info, ShieldCheck, Landmark, BarChart3,
  TrendingUp, Users, Coins, Layers, Settings, Database, FileText,
  AlertTriangle, Shield, Play, HelpCircle as HelpIcon, ArrowRight
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

// Define Types
interface Assumption {
  name: string;
  value: string;
  type: string;
}

interface MetricDetail {
  value: string;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  confidence_score: number;
  sources: string[];
  method: string;
  description: string;
}

interface DataGap {
  name: string;
  status: "AVAILABLE" | "PARTIAL" | "MISSING" | "TO_BE_NEGOTIATED";
  impact: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

interface ResponseService {
  name: string;
  provider: string;
  type: string;
}

interface ScenarioData {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgGrad: string;
  description: string;
  territory: string;
  affectedSectors: string;
  horizon: string;
  severity: string;
  assumptions: Assumption[];
  metrics: {
    exposed_structures: MetricDetail;
    exposed_etp: MetricDetail;
    exposed_revenue: MetricDetail;
    required_budget: MetricDetail;
  };
  data_gaps: DataGap[];
  proposed_services: ResponseService[];
  proposed_programs: string[];
  proposed_funding: string[];
  recommended_action: string;
}

// Complete mock dataset for the 3 policy questions
const SCENARIOS: Record<string, ScenarioData> = {
  energy: {
    id: "energy",
    title: "Crise Énergétique (Gaz x3)",
    icon: Play,
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    bgGrad: "from-amber-500/5 to-orange-500/5",
    description: "Simulation d'une hausse tarifaire extrême et prolongée subie par les industries wallonnes fortement dépendantes du gaz de process.",
    territory: "Wallonie (Région)",
    affectedSectors: "Sidérurgie (NACE 24), Chimie (NACE 20), Ciment (NACE 23)",
    horizon: "Moyen Terme (6 mois)",
    severity: "Critique (4/5)",
    assumptions: [
      { name: "Prix du gaz de marché", value: "Multiplié par 3.0", type: "CHOC" },
      { name: "Durée de la crise", value: "6 mois consécutifs", type: "PARAMÈTRE" },
      { name: "Baisse de production industrielle", value: "-20% pour les secteurs ciblés", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Impact si surcoût > 15% du CA annuel", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "142 structures",
        confidence: "HIGH",
        confidence_score: 85,
        description: "Nombre d'établissements industriels directement impactés par la hausse.",
        sources: ["BCE (Banque-Carrefour)", "Référentiel des Filières S3"],
        method: "Filtre NACE sectoriel croisé avec la base des bénéficiaires actifs de la PIT."
      },
      exposed_etp: {
        value: "18 500 ETP",
        confidence: "MEDIUM",
        confidence_score: 70,
        description: "Volume d'emplois menacés par le ralentissement ou l'arrêt de production.",
        sources: ["ONSS (Déclarations trimestrielles)", "Profils Bénéficiaires PIT"],
        method: "Pondération sectorielle et modélisation de sensibilité de l'emploi face à la baisse de charge."
      },
      exposed_revenue: {
        value: "4.2 Mrds €",
        confidence: "LOW",
        confidence_score: 45,
        description: "Chiffre d'affaires annuel cumulé des structures exposées au choc.",
        sources: ["Comptes annuels BNB", "Déclarations TVA"],
        method: "Agrégation du CA historique. Ne prend pas en compte les variations de carnet de commandes en cours d'année."
      },
      required_budget: {
        value: "120 M €",
        confidence: "LOW",
        confidence_score: 35,
        description: "Enveloppe financière de soutien estimée pour éviter des faillites en chaîne.",
        sources: ["Historique des aides d'urgence WE", "CPSV-AP Cost Grid"],
        method: "Simulation sur base d'un taux de recours de 50% avec une aide moyenne plafonnée par structure."
      }
    },
    data_gaps: [
      { name: "Consommation réelle de gaz par entreprise", status: "MISSING", impact: "CRITICAL" },
      { name: "Caractéristiques des contrats d'énergie (fixe/variable, durée)", status: "MISSING", impact: "HIGH" },
      { name: "Niveaux de stocks d'intrants critiques", status: "TO_BE_NEGOTIATED", impact: "MEDIUM" },
      { name: "Relations de sous-traitance régionales", status: "PARTIAL", impact: "LOW" }
    ],
    proposed_services: [
      { name: "Diagnostic Efficacité Énergétique Express", provider: "EDIH WallonIA / AdN", type: "Service Technique" },
      { name: "Audit Énergie Climat", provider: "SPW Énergie", type: "Service Réglementaire" }
    ],
    proposed_programs: ["Plan Conjoncturel Énergie Wallonie", "Digital Wallonia CleanTech"],
    proposed_funding: ["Subvention conjoncturelle gaz/électricité", "Prêt de trésorerie d'urgence (Wallonie Entreprendre)"],
    recommended_action: "Activer en urgence le guichet de subvention conjoncturelle, prioriser l'enrôlement des 142 structures industrielles ciblées dans le diagnostic d'efficacité énergétique de l'EDIH, et initier la négociation de données de consommation réelle avec les GRD (ORES/RESA) pour affiner les prochaines estimations."
  },
  flood: {
    id: "flood",
    title: "Inondations (Crue Décennale)",
    icon: Play,
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    bgGrad: "from-blue-500/5 to-cyan-500/5",
    description: "Épisode pluvieux extrême provoquant la crue de la Vesdre et de la Sambre avec blocage des infrastructures industrielles.",
    territory: "Province de Liège & Hainaut (Bassins industriels)",
    affectedSectors: "Logistique (NACE 52.1), Métallurgie lourde (NACE 24), Commerce de gros (NACE 46)",
    horizon: "Court Terme (15 jours)",
    severity: "Majeure (4/5)",
    assumptions: [
      { name: "Hauteur de crue moyenne", value: "+1.5m par rapport au lit majeur", type: "CHOC" },
      { name: "Arrêt des infrastructures de transport", value: "5 jours complets", type: "PARAMÈTRE" },
      { name: "Délai moyen de remise en conformité", value: "10 jours supplémentaires", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Localisation géographique en zone d'aléa élevé", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "85 structures",
        confidence: "HIGH",
        confidence_score: 90,
        description: "Nombre d'établissements situés physiquement dans la zone inondable.",
        sources: ["SPW Géoréférentiel (Cartographie d'aléa)", "BCE"],
        method: "Croisement géospatial des adresses BCE avec les couches d'inondation de la Wallonie."
      },
      exposed_etp: {
        value: "4 200 ETP",
        confidence: "HIGH",
        confidence_score: 80,
        description: "Travailleurs affectés par la fermeture temporaire des sites exposés.",
        sources: ["ONSS (Localisation des établissements)", "Base bénéficiaires PIT"],
        method: "Comptage des effectifs déclarés à l'adresse exacte des sites situés en zone d'aléa."
      },
      exposed_revenue: {
        value: "950 M €",
        confidence: "MEDIUM",
        confidence_score: 65,
        description: "Volume d'affaires menacé par l'arrêt temporaire d'activité (15 jours).",
        sources: ["BNB Comptes annuels", "Enquêtes de sinistralité historiques"],
        method: "Estimation du CA quotidien moyen par structure multiplié par la durée d'arrêt de 15 jours."
      },
      required_budget: {
        value: "45 M €",
        confidence: "MEDIUM",
        confidence_score: 60,
        description: "Enveloppe d'indemnisation et d'avances sur sinistres recommandée.",
        sources: ["Fonds des Calamités de la Région Wallonne", "Statistiques d'assurance"],
        method: "Application d'un taux moyen de dégâts matériels de 5% du CA annuel sur les structures ciblées."
      }
    },
    data_gaps: [
      { name: "État physique des digues et protections locales", status: "TO_BE_NEGOTIATED", impact: "CRITICAL" },
      { name: "Niveaux de couverture d'assurance catastrophes", status: "MISSING", impact: "HIGH" },
      { name: "Plans de Continuité d'Activité (PCA) des PME", status: "MISSING", impact: "MEDIUM" },
      { name: "Stocks d'équipements de secours partagés", status: "PARTIAL", impact: "LOW" }
    ],
    proposed_services: [
      { name: "Aide au relogement d'urgence d'activité", provider: "Wallonie Entreprendre", type: "Service Logistique" },
      { name: "Diagnostic d'infrastructures résilientes", provider: "SPW Mobilité & Voies Hydrauliques", type: "Service Technique" }
    ],
    proposed_programs: ["Fonds Wallon des Calamités", "Plan de Relance - Volet Résilience Inondation"],
    proposed_funding: ["Avance de trésorerie d'urgence sur sinistre", "Subvention de sécurisation des outils de production"],
    recommended_action: "Mobiliser le Fonds des Calamités, mettre à disposition les parcs industriels de substitution gérés par Wallonie Entreprendre pour le relogement temporaire, et initier une négociation avec le secteur des assurances pour lier les données de couverture directement à la PIT."
  },
  pandemic: {
    id: "pandemic",
    title: "Pandémie (Rupture Globale)",
    icon: Play,
    color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    bgGrad: "from-rose-500/5 to-red-500/5",
    description: "Restrictions de déplacement et confinement entraînant des ruptures majeures de chaînes logistiques globales.",
    territory: "Wallonie (Global)",
    affectedSectors: "Logistique (NACE 52.1), Biotech & Pharma (NACE 21), Agroalimentaire (NACE 10)",
    horizon: "Long Terme (12 mois)",
    severity: "Majeure (3/5)",
    assumptions: [
      { name: "Taux d'absentéisme moyen", value: "25% pour les postes non télétravaillables", type: "CHOC" },
      { name: "Restrictions de fret international", value: "Fermeture des frontières aériennes hors cargo", type: "PARAMÈTRE" },
      { name: "Baisse de la demande globale de consommation", value: "-15% sur les biens manufacturés", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Dépendance logistique internationale et hors-télétravail", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "410 structures",
        confidence: "MEDIUM",
        confidence_score: 75,
        description: "Nombre de structures wallonnes fortement intégrées dans les chaînes d'import/export.",
        sources: ["AWEX (Fichier exportateurs)", "BCE"],
        method: "Sélection des bénéficiaires ayant un statut d'exportateur ou de logisticien actif."
      },
      exposed_etp: {
        value: "35 000 ETP",
        confidence: "MEDIUM",
        confidence_score: 70,
        description: "Volume d'emplois exposés au chômage temporaire.",
        sources: ["ONSS", "Enquêtes sectorielles de maturité numérique"],
        method: "Calcul des effectifs salariés multiplié par l'indice d'impossibilité de télétravail du secteur."
      },
      exposed_revenue: {
        value: "8.1 Mrds €",
        confidence: "MEDIUM",
        confidence_score: 60,
        description: "Volume d'affaires annuel exposé aux retards de livraison et à la baisse de demande.",
        sources: ["BNB Comptes annuels", "Statistiques AWEX"],
        method: "Somme du chiffre d'affaires des exportateurs de produits manufacturés hors pharma."
      },
      required_budget: {
        value: "320 M €",
        confidence: "MEDIUM",
        confidence_score: 55,
        description: "Enveloppe de prêts garantis et de subventions pour le maintien de l'emploi.",
        sources: ["Mécanismes de garantie SOWALFIN", "Fonds de crise Covid historiques"],
        method: "Modélisation du coût moyen mensuel du chômage temporaire régional sur 3 mois."
      }
    },
    data_gaps: [
      { name: "Taux réel de télétravail par structure", status: "PARTIAL", impact: "CRITICAL" },
      { name: "Liste nominative des fournisseurs étrangers stratégiques", status: "MISSING", impact: "HIGH" },
      { name: "Niveaux réels de liquidités de secours des PME", status: "PARTIAL", impact: "MEDIUM" },
      { name: "Capacité locale de substitution d'approvisionnement", status: "MISSING", impact: "LOW" }
    ],
    proposed_services: [
      { name: "Diagnostic Télétravail & Maturité Numérique", provider: "Agence du Numérique (AdN)", type: "Service Technique" },
      { name: "Accompagnement à la Relocalisation de Fournisseurs", provider: "AWEX", type: "Service d'Intelligence" }
    ],
    proposed_programs: ["Plan de Transition Numérique - Industrie du Futur", "Alliance Wallonne pour la Relocalisation"],
    proposed_funding: ["Garantie publique de crise sur crédits bancaires", "Chèque Maturité Numérique Express"],
    recommended_action: "Déployer en urgence les chèques maturité numérique de l'AdN pour équiper les 35 000 ETP exposés au travail à distance, et ouvrir le guichet de garantie de crise de Wallonie Entreprendre pour consolider la trésorerie."
  }
};

export default function EnrichedStrategicDemonstratorPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<"scenario" | "impact" | "gaps" | "response">("scenario");
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [showTraceability, setShowTraceability] = useState<boolean>(false);

  // Fallback to energy crisis data if active
  const data: ScenarioData = selectedQuestion ? SCENARIOS[selectedQuestion] : SCENARIOS.energy;

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestion(id);
    setActiveStep("scenario");
    setExpandedKpi(null);
    setShowTraceability(false);
  };

  const handleBackToLanding = () => {
    setSelectedQuestion(null);
  };

  return (
    <PITLayout
      category="PILOTAGE STRATÉGIQUE"
      title="Démonstrateur Politique Exécutif"
      description="Parcours de simulation et d'aide à la décision stratégique pour le Cabinet et la Direction Générale."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Pilotage", href: "/pilotage" },
        { label: "Démonstrateur Cabinet" }
      ]}
    >
      <div className="space-y-8">
        
        {/* Workstream 7: Executive Storytelling & Positioning Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 opacity-[0.04] blur-2xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-teal-500/15 text-teal-655 px-2 py-0.5 rounded-full border border-teal-500/20">
              Cadre Méthodologique Officiel
            </span>
          </div>
          <h2 className="text-xs font-black text-text uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-650" />
            Positionnement de la PIT : Outil d'Aide à la Décision
          </h2>
          <p className="text-[11px] text-muted font-bold leading-relaxed">
            La PIT <strong className="text-text">n'est pas une salle de crise opérationnelle</strong> ni un centre de commandement en temps réel. Elle constitue une <strong className="text-text">plateforme d'intelligence territoriale et politique à froid</strong> permettant de cartographier les vulnérabilités structurelles, d'évaluer la confiance des indicateurs décisionnels (Evidence-Based Policy), et d'identifier les données manquantes afin de prioriser l'acquisition d'information de la Région.
          </p>
        </div>

        {/* WORKSTREAM 1: DECISION MAKER QUESTIONS (Landing View) */}
        {selectedQuestion === null ? (
          <div className="space-y-6">
            <div className="border-b border-muted/10 pb-2">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider flex items-center gap-2">
                <HelpIcon className="h-4 w-4 text-indigo-500" />
                <span>Questions Décideur — Choisissez un dossier stratégique</span>
              </h3>
              <p className="text-[10px] text-muted font-semibold mt-0.5">Exposez la PIT à travers des questions politiques directes de cabinet plutôt que par des structures de bases de données.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Energy Crisis */}
              <div 
                onClick={() => handleSelectQuestion("energy")}
                className="bg-glass/25 hover:bg-glass/40 border border-muted/15 hover:border-amber-500/30 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 opacity-10 blur-xl group-hover:scale-125 transition-transform" />
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                      <ShieldAlert className="h-6 w-6" />
                    </span>
                    <span className="text-[8px] font-black uppercase bg-amber-500/10 text-amber-655 px-2 py-0.5 rounded border border-amber-500/15">
                      Actif • Caroline
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-text group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">🔥 Crise Énergétique</h4>
                    <p className="text-[11px] text-muted font-semibold leading-relaxed">
                      Évaluez l'exposition de l'industrie lourde face à une hausse majeure des prix du gaz de process.
                    </p>
                  </div>
                  <div className="border-t border-muted/10 pt-3 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase block">Questions clés adressées :</span>
                    <ul className="text-[10px] text-muted space-y-1 pl-3 list-disc font-bold">
                      <li>Quelles filières S3 sont les plus exposées ?</li>
                      <li>Quels bassins d'emploi concentrent le risque ?</li>
                      <li>Combien de jobs et quel budget d'aide ?</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Lancer la simulation</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Card 2: Flood */}
              <div 
                onClick={() => handleSelectQuestion("flood")}
                className="bg-glass/25 hover:bg-glass/40 border border-muted/15 hover:border-blue-500/30 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 opacity-10 blur-xl group-hover:scale-125 transition-transform" />
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                      <Activity className="h-6 w-6" />
                    </span>
                    <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-655 px-2 py-0.5 rounded border border-blue-500/15">
                      Actif • Calamités
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">🌊 Inondations & Crues</h4>
                    <p className="text-[11px] text-muted font-semibold leading-relaxed">
                      Calculez l'impact d'une crue décennale sur les parcs logistiques et industriels situés en zone d'aléa.
                    </p>
                  </div>
                  <div className="border-t border-muted/10 pt-3 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase block">Questions clés adressées :</span>
                    <ul className="text-[10px] text-muted space-y-1 pl-3 list-disc font-bold">
                      <li>Combien de structures sont en zone inondable ?</li>
                      <li>Quelles activités de logistique sont coupées ?</li>
                      <li>Quels dispositifs d'aide de trésorerie ?</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Lancer la simulation</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Card 3: Pandemic */}
              <div 
                onClick={() => handleSelectQuestion("pandemic")}
                className="bg-glass/25 hover:bg-glass/40 border border-muted/15 hover:border-rose-500/30 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 opacity-10 blur-xl group-hover:scale-125 transition-transform" />
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="p-3 bg-rose-500/10 text-rose-650 rounded-xl">
                      <Target className="h-6 w-6" />
                    </span>
                    <span className="text-[8px] font-black uppercase bg-rose-500/10 text-rose-655 px-2 py-0.5 rounded border border-rose-500/15">
                      Actif • Transition
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-text group-hover:text-rose-655 dark:group-hover:text-rose-400 transition-colors">🦠 Pandémie & Logistique</h4>
                    <p className="text-[11px] text-muted font-semibold leading-relaxed">
                      Simulez les ruptures d'approvisionnement des maillons exportateurs et la mobilisation du télétravail.
                    </p>
                  </div>
                  <div className="border-t border-muted/10 pt-3 space-y-1">
                    <span className="text-[9px] font-black text-muted uppercase block">Questions clés adressées :</span>
                    <ul className="text-[10px] text-muted space-y-1 pl-3 list-disc font-bold">
                      <li>Quels maillons de la chaîne de valeur bloquent ?</li>
                      <li>Quels ETP ne peuvent pas télétravailler ?</li>
                      <li>Quels diagnostics de maturité de l'AdN ?</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-rose-655 dark:text-rose-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Lancer la simulation</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PRE-FILTERED ANALYTICAL JOURNEY VIEW */
          <div className="space-y-6">
            
            {/* Context bar with back action */}
            <div className="flex justify-between items-center bg-glass/25 border border-muted/10 p-3.5 rounded-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToLanding}
                  className="p-2 hover:bg-glass border border-muted/20 hover:text-primary transition-colors cursor-pointer rounded-xl flex items-center justify-center text-text"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <span className="text-[9px] font-black text-muted uppercase block">
                    Dossier actif
                  </span>
                  <h3 className="text-xs font-black text-text uppercase tracking-wider flex items-center gap-2">
                    {data.title}
                  </h3>
                </div>
              </div>

              {/* Wizard Steps Navigation */}
              <div className="hidden lg:flex bg-glass/25 p-1 rounded-xl border border-muted/10 gap-1">
                {[
                  { id: "scenario", label: "1. Hypothèses" },
                  { id: "impact", label: "2. Impact & Confiance" },
                  { id: "gaps", label: "3. Gaps de Données" },
                  { id: "response", label: "4. Plan de Soutien" }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStep(s.id as any);
                      setExpandedKpi(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      activeStep === s.id
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-muted hover:bg-glass hover:text-text"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Steps selector */}
            <div className="lg:hidden flex justify-between gap-1 overflow-x-auto pb-1">
              {[
                { id: "scenario", label: "Hypothèses" },
                { id: "impact", label: "Impacts" },
                { id: "gaps", label: "Data Gaps" },
                { id: "response", label: "Plan de Soutien" }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStep(s.id as any);
                    setExpandedKpi(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex-1 text-center shrink-0 border ${
                    activeStep === s.id
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-glass/10 border-muted/10 text-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* WIZARD CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column (Main wizard step view) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* WORKSTREAM 2: SCENARIO DEFINITION & ASSUMPTIONS VIEW */}
                {activeStep === "scenario" && (
                  <div className="bg-glass/25 border border-muted/15 p-6 rounded-2xl space-y-6">
                    <div className="border-b border-muted/10 pb-3 flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">Étape 1 : Cadrage Stratégique</span>
                        <h4 className="text-sm font-black text-text uppercase tracking-wider mt-0.5">{data.title}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/15">
                        {data.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold leading-relaxed">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-muted uppercase block">Description du scénario :</span>
                          <p className="text-text leading-relaxed font-medium">{data.description}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-muted uppercase block">Territoire ciblé :</span>
                          <span className="text-text font-bold block">{data.territory}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-muted uppercase block">Secteurs exposés :</span>
                          <span className="text-text font-bold block">{data.affectedSectors}</span>
                        </div>
                      </div>

                      {/* WORKSTREAM 2: Assumptions Panel (Hypothèses) */}
                      <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-3">
                        <h5 className="text-[10px] font-black text-text uppercase tracking-widest flex items-center gap-1.5 border-b border-muted/10 pb-1.5">
                          <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          Hypothèses Utilisées (Assumptions)
                        </h5>
                        <div className="space-y-2">
                          {data.assumptions.map((a, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                              <div>
                                <span className="text-text block leading-tight">{a.name}</span>
                                <span className="text-[8px] text-muted font-bold block uppercase">{a.type}</span>
                              </div>
                              <span className="bg-glass border border-muted/15 px-2 py-0.5 rounded text-text font-mono shrink-0">
                                {a.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WORKSTREAM 3 & 4: IMPACT DASHBOARD & EXPLAINABILITY ACCORDIONS */}
                {activeStep === "impact" && (
                  <div className="space-y-6">
                    
                    {/* Header */}
                    <div className="bg-glass/20 border border-muted/15 p-4 rounded-xl">
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 block">Étape 2 : Évaluation d'Impact</span>
                      <h4 className="text-xs font-black text-text uppercase tracking-wider mt-0.5">Indicateurs de Sensibilité & Confiance Décisionnelle</h4>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Card 1: Exposed structures */}
                      <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-muted/10 pb-2">
                          <div>
                            <span className="text-[9px] font-black text-muted uppercase block">Acteurs Exposés</span>
                            <span className="text-lg font-black text-text mt-1 block">{data.metrics.exposed_structures.value}</span>
                          </div>
                          {/* Confidence level badge */}
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 ${
                            data.metrics.exposed_structures.confidence === "HIGH" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" :
                            data.metrics.exposed_structures.confidence === "MEDIUM" ? "bg-amber-500/10 text-amber-700 border border-amber-500/15" :
                            "bg-orange-500/10 text-orange-600 border border-orange-500/15"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              data.metrics.exposed_structures.confidence === "HIGH" ? "bg-emerald-500" :
                              data.metrics.exposed_structures.confidence === "MEDIUM" ? "bg-amber-500" :
                              "bg-orange-500"
                            }`} />
                            {data.metrics.exposed_structures.confidence} ({data.metrics.exposed_structures.confidence_score}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed font-semibold">{data.metrics.exposed_structures.description}</p>
                        
                        {/* Expandable How was this calculated panel */}
                        <div className="border-t border-muted/5 pt-2">
                          <button
                            onClick={() => setExpandedKpi(expandedKpi === "structures" ? null : "structures")}
                            className="text-[9px] font-black text-teal-655 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                          >
                            <span>{expandedKpi === "structures" ? "Masquer la méthode" : "Comment cette valeur est-elle estimée ? ➔"}</span>
                          </button>
                          {expandedKpi === "structures" && (
                            <div className="mt-3 p-3.5 bg-glass border border-muted/15 rounded-xl space-y-2 text-[10px] leading-relaxed font-bold animate-fadeIn">
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Données utilisées :</span>
                                <span className="text-text block">{data.metrics.exposed_structures.sources.join(", ")}</span>
                              </div>
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Méthodologie :</span>
                                <span className="text-text block">{data.metrics.exposed_structures.method}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card 2: Exposed jobs */}
                      <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-muted/10 pb-2">
                          <div>
                            <span className="text-[9px] font-black text-muted uppercase block">Emplois Menacés (ETP)</span>
                            <span className="text-lg font-black text-text mt-1 block">{data.metrics.exposed_etp.value}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 ${
                            data.metrics.exposed_etp.confidence === "HIGH" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" :
                            data.metrics.exposed_etp.confidence === "MEDIUM" ? "bg-amber-500/10 text-amber-700 border border-amber-500/15" :
                            "bg-orange-500/10 text-orange-600 border border-orange-500/15"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              data.metrics.exposed_etp.confidence === "HIGH" ? "bg-emerald-500" :
                              data.metrics.exposed_etp.confidence === "MEDIUM" ? "bg-amber-500" :
                              "bg-orange-500"
                            }`} />
                            {data.metrics.exposed_etp.confidence} ({data.metrics.exposed_etp.confidence_score}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed font-semibold">{data.metrics.exposed_etp.description}</p>
                        
                        <div className="border-t border-muted/5 pt-2">
                          <button
                            onClick={() => setExpandedKpi(expandedKpi === "etp" ? null : "etp")}
                            className="text-[9px] font-black text-teal-655 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                          >
                            <span>{expandedKpi === "etp" ? "Masquer la méthode" : "Comment cette valeur est-elle estimée ? ➔"}</span>
                          </button>
                          {expandedKpi === "etp" && (
                            <div className="mt-3 p-3.5 bg-glass border border-muted/15 rounded-xl space-y-2 text-[10px] leading-relaxed font-bold animate-fadeIn">
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Données utilisées :</span>
                                <span className="text-text block">{data.metrics.exposed_etp.sources.join(", ")}</span>
                              </div>
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Méthodologie :</span>
                                <span className="text-text block">{data.metrics.exposed_etp.method}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card 3: Exposed turnover */}
                      <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-muted/10 pb-2">
                          <div>
                            <span className="text-[9px] font-black text-muted uppercase block">Volume d'Affaires Exposé</span>
                            <span className="text-lg font-black text-text mt-1 block">{data.metrics.exposed_revenue.value}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 ${
                            data.metrics.exposed_revenue.confidence === "HIGH" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" :
                            data.metrics.exposed_revenue.confidence === "MEDIUM" ? "bg-amber-500/10 text-amber-700 border border-amber-500/15" :
                            "bg-orange-500/10 text-orange-600 border border-orange-500/15"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              data.metrics.exposed_revenue.confidence === "HIGH" ? "bg-emerald-500" :
                              data.metrics.exposed_revenue.confidence === "MEDIUM" ? "bg-amber-500" :
                              "bg-orange-500"
                            }`} />
                            {data.metrics.exposed_revenue.confidence} ({data.metrics.exposed_revenue.confidence_score}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed font-semibold">{data.metrics.exposed_revenue.description}</p>
                        
                        <div className="border-t border-muted/5 pt-2">
                          <button
                            onClick={() => setExpandedKpi(expandedKpi === "revenue" ? null : "revenue")}
                            className="text-[9px] font-black text-teal-655 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                          >
                            <span>{expandedKpi === "revenue" ? "Masquer la méthode" : "Comment cette valeur est-elle estimée ? ➔"}</span>
                          </button>
                          {expandedKpi === "revenue" && (
                            <div className="mt-3 p-3.5 bg-glass border border-muted/15 rounded-xl space-y-2 text-[10px] leading-relaxed font-bold animate-fadeIn">
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Données utilisées :</span>
                                <span className="text-text block">{data.metrics.exposed_revenue.sources.join(", ")}</span>
                              </div>
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Méthodologie :</span>
                                <span className="text-text block">{data.metrics.exposed_revenue.method}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card 4: Support budget */}
                      <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-muted/10 pb-2">
                          <div>
                            <span className="text-[9px] font-black text-muted uppercase block">Enveloppe d'Aide Recommandée</span>
                            <span className="text-lg font-black text-text mt-1 block">{data.metrics.required_budget.value}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 ${
                            data.metrics.required_budget.confidence === "HIGH" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" :
                            data.metrics.required_budget.confidence === "MEDIUM" ? "bg-amber-500/10 text-amber-700 border border-amber-500/15" :
                            "bg-orange-500/10 text-orange-600 border border-orange-500/15"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              data.metrics.required_budget.confidence === "HIGH" ? "bg-emerald-500" :
                              data.metrics.required_budget.confidence === "MEDIUM" ? "bg-amber-500" :
                              "bg-orange-500"
                            }`} />
                            {data.metrics.required_budget.confidence} ({data.metrics.required_budget.confidence_score}%)
                          </span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed font-semibold">{data.metrics.required_budget.description}</p>
                        
                        <div className="border-t border-muted/5 pt-2">
                          <button
                            onClick={() => setExpandedKpi(expandedKpi === "budget" ? null : "budget")}
                            className="text-[9px] font-black text-teal-655 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
                          >
                            <span>{expandedKpi === "budget" ? "Masquer la méthode" : "Comment cette valeur est-elle estimée ? ➔"}</span>
                          </button>
                          {expandedKpi === "budget" && (
                            <div className="mt-3 p-3.5 bg-glass border border-muted/15 rounded-xl space-y-2 text-[10px] leading-relaxed font-bold animate-fadeIn">
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Données utilisées :</span>
                                <span className="text-text block">{data.metrics.required_budget.sources.join(", ")}</span>
                              </div>
                              <div>
                                <span className="text-muted block text-[8px] uppercase">Méthodologie :</span>
                                <span className="text-text block">{data.metrics.required_budget.method}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* WORKSTREAM 5: DATA GAPS PANEL (Couverture & Limites) */}
                {activeStep === "gaps" && (
                  <div className="bg-glass/25 border border-muted/15 p-6 rounded-2xl space-y-6">
                    <div>
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">Étape 3 : Cartographie des Manques</span>
                      <h4 className="text-sm font-black text-text uppercase tracking-wider mt-0.5">Comment affiner cette estimation ? (Data Gaps Panel)</h4>
                      <p className="text-[10px] text-muted font-bold mt-1 leading-relaxed">
                        L'identification des données manquantes est stratégique pour orienter la politique de gouvernance des données de la Région et cibler les accords d'acquisition.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-muted/10 text-muted font-black uppercase text-[9px] tracking-wider">
                            <th className="py-2.5">Donnée Requise</th>
                            <th className="py-2.5 text-center">Niveau de Criticité</th>
                            <th className="py-2.5 text-right">Statut de Disponibilité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data_gaps.map((gap, idx) => (
                            <tr key={idx} className="border-b border-muted/5 hover:bg-glass/5 transition-colors font-bold">
                              <td className="py-3 pr-2 text-text text-[11px]">{gap.name}</td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                  gap.impact === "CRITICAL" ? "bg-rose-500/10 text-rose-600" :
                                  gap.impact === "HIGH" ? "bg-orange-500/10 text-orange-600" :
                                  gap.impact === "MEDIUM" ? "bg-amber-500/10 text-amber-600" :
                                  "bg-blue-500/10 text-blue-600"
                                }`}>
                                  {gap.impact}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 justify-end ${
                                  gap.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-600" :
                                  gap.status === "PARTIAL" ? "bg-amber-500/10 text-amber-700" :
                                  gap.status === "MISSING" ? "bg-rose-500/10 text-rose-600" :
                                  "bg-blue-500/10 text-blue-700"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    gap.status === "AVAILABLE" ? "bg-emerald-500" :
                                    gap.status === "PARTIAL" ? "bg-amber-500" :
                                    gap.status === "MISSING" ? "bg-rose-500" :
                                    "bg-blue-500"
                                  }`} />
                                  {gap.status === "AVAILABLE" ? "Disponible" :
                                   gap.status === "PARTIAL" ? "Partielle" :
                                   gap.status === "MISSING" ? "Manquante" :
                                   "À Négocier"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* WORKSTREAM 6: RESPONSE MECHANISMS (Dispositifs de Soutien) */}
                {activeStep === "response" && (
                  <div className="bg-glass/25 border border-muted/15 p-6 rounded-2xl space-y-6">
                    <div>
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">Étape 4 : Réponse Publique</span>
                      <h4 className="text-sm font-black text-text uppercase tracking-wider mt-0.5">Dispositifs Activés & Plan d'Action Recommandé</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Services & Programs */}
                      <div className="space-y-4">
                        <div className="p-4 bg-glass border border-muted/15 rounded-xl space-y-3">
                          <span className="text-[9px] font-black text-muted uppercase block border-b border-muted/10 pb-1">Services d'Accompagnement</span>
                          {data.proposed_services.map((s, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                              <div>
                                <span className="text-text block leading-tight">{s.name}</span>
                                <span className="text-[8px] text-muted font-bold block">{s.provider}</span>
                              </div>
                              <span className="bg-teal-500/10 text-teal-655 px-2 py-0.5 rounded text-[8px] shrink-0 font-black uppercase">
                                {s.type}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-glass border border-muted/15 rounded-xl space-y-2">
                          <span className="text-[9px] font-black text-muted uppercase block border-b border-muted/10 pb-1">Programmes Cadres</span>
                          {data.proposed_programs.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-text">
                              <Landmark className="h-3.5 w-3.5 text-indigo-500" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Funding & Recommended actions */}
                      <div className="space-y-4">
                        <div className="p-4 bg-glass border border-muted/15 rounded-xl space-y-2">
                          <span className="text-[9px] font-black text-muted uppercase block border-b border-muted/10 pb-1">Instruments Financiers Mobilisés</span>
                          {data.proposed_funding.map((f, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-text">
                              <Coins className="h-3.5 w-3.5 text-emerald-500" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-black text-teal-655 uppercase block">Arbitrage Métier / Avis de la PIT :</span>
                          <p className="text-[10px] text-text font-semibold leading-relaxed">
                            {data.recommended_action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation actions in Wizard footer */}
                <div className="flex justify-between items-center bg-glass/10 p-3 rounded-xl border border-muted/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const stepOrder: ("scenario" | "impact" | "gaps" | "response")[] = ["scenario", "impact", "gaps", "response"];
                        const prevIdx = stepOrder.indexOf(activeStep) - 1;
                        if (prevIdx >= 0) {
                          setActiveStep(stepOrder[prevIdx]);
                          setExpandedKpi(null);
                        } else {
                          handleBackToLanding();
                        }
                      }}
                      className="px-3.5 py-1.5 bg-glass border border-muted/30 hover:bg-glass/50 text-[10px] font-black rounded-lg transition-all text-text cursor-pointer"
                    >
                      {activeStep === "scenario" ? "Changer de question" : "Précédent"}
                    </button>
                  </div>

                  <span className="text-[9px] text-muted font-black tracking-widest uppercase">
                    Dossier : {selectedQuestion.toUpperCase()}
                  </span>

                  <button
                    onClick={() => {
                      const stepOrder: ("scenario" | "impact" | "gaps" | "response")[] = ["scenario", "impact", "gaps", "response"];
                      const nextIdx = stepOrder.indexOf(activeStep) + 1;
                      if (nextIdx < stepOrder.length) {
                        setActiveStep(stepOrder[nextIdx]);
                        setExpandedKpi(null);
                      } else {
                        handleBackToLanding();
                      }
                    }}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer"
                  >
                    {activeStep === "response" ? "Terminer la simulation" : "Suivant"}
                  </button>
                </div>

              </div>

              {/* Right Column (Traceability toggle & Pedagogical context panel) */}
              <div className="space-y-4">
                
                {/* WORKSTREAM 6: TRACEABILITY VIEW TOGGLE CARD */}
                <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-muted/10 pb-2">
                    <h5 className="text-[10px] font-black text-text uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="h-4.5 w-4.5 text-teal-655" />
                      Gouvernance & Lignage
                    </h5>
                    <button
                      onClick={() => setShowTraceability(!showTraceability)}
                      className="text-[9px] font-black text-teal-655 hover:underline border-0 bg-transparent cursor-pointer"
                    >
                      {showTraceability ? "Masquer" : "Afficher"}
                    </button>
                  </div>

                  <p className="text-[10px] text-muted font-bold leading-normal">
                    La PIT garantit la traçabilité des indicateurs de la question initiale jusqu'au résultat pour assurer l'auditoire de la donnée.
                  </p>

                  {showTraceability && (
                    <div className="space-y-3.5 pt-2 animate-fadeIn">
                      <div className="space-y-2.5">
                        
                        {/* Box 1 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] font-bold text-text">
                          <span className="text-muted block text-[8px] uppercase">1. Question Cabinets</span>
                          <span className="block leading-tight mt-0.5">Estimer l'impact de la crise : {data.title}</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 2 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] font-bold text-text">
                          <span className="text-muted block text-[8px] uppercase">2. Jeux de données (DCAT-AP)</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px] font-mono">BCE</span>
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px] font-mono">ONSS</span>
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px] font-mono">BNB</span>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 3 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] font-bold text-text">
                          <span className="text-muted block text-[8px] uppercase">3. Indicateurs de structure</span>
                          <span className="block leading-tight mt-0.5">Effectifs ETP / Secteur NACE</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 4 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] font-bold text-text">
                          <span className="text-muted block text-[8px] uppercase">4. Hypothèses actives</span>
                          <span className="block leading-tight mt-0.5">
                            {data.assumptions.find(a => a.type === "HYPOTHÈSE")?.value || "Baisse de 20%"}
                          </span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 5 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] font-bold text-text">
                          <span className="text-muted block text-[8px] uppercase">5. Algorithme de calcul</span>
                          <span className="block font-mono text-[8px] bg-muted/10 p-1 rounded mt-0.5">SOMME (ETP * Coef_secteur)</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 6 */}
                        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[10px] font-bold text-text flex justify-between items-center">
                          <div>
                            <span className="text-teal-655 block text-[8px] uppercase">6. Résultat et Confiance</span>
                            <span className="block font-black mt-0.5 text-teal-650">{data.metrics.exposed_etp.value}</span>
                          </div>
                          <span className="bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            {data.metrics.exposed_etp.confidence}
                          </span>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* Additional context guidelines */}
                <div className="p-4 bg-muted/5 border border-muted/10 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-muted block uppercase">Gouvernance Sémantique</span>
                  <p className="text-[9px] text-muted leading-normal font-semibold">
                    Toutes les interconnexions sont mappées sous les standards CPSV-AP (Catalogue des Services Publics) et W3C ORG, garantissant l'alignement réglementaire avec l'administration wallonne.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </PITLayout>
  );
}

