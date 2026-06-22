// cpsv-ap-app/src/app/strategic/demonstrator/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Compass, ArrowLeft, Target, ShieldAlert, Activity, CheckCircle, 
  HelpCircle, ChevronRight, Info, ShieldCheck, Landmark, BarChart3
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

interface StepDetail {
  id: string;
  title: string;
  icon: any;
  color: string;
  badge: string;
  headline: string;
  description: string;
  metrics?: { label: string; value: string; sub: string }[];
  connections?: string[];
}

const STEPS: StepDetail[] = [
  {
    id: "challenge",
    title: "1. Défi Stratégique",
    icon: Target,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    badge: "Priorité S3 Régionale",
    headline: "Renforcer la Résilience et l'Autonomie Énergétique du Territoire",
    description: "Le cadre stratégique wallon (S3 / Caroline) identifie comme défi majeur la décarbonation et la sécurisation des approvisionnements de notre industrie lourde.",
    metrics: [
      { label: "Priorité", value: "CRITIQUE", sub: "Horizon 2030" },
      { label: "Objectifs Liés", value: "3 Stratégiques", sub: "S3 Wallonie" }
    ],
    connections: ["Territoire: Wallonie", "Filière: Sidérurgie & Chimie"]
  },
  {
    id: "risk",
    title: "2. Risque CORTEX",
    icon: ShieldAlert,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    badge: "Qualifié par CORTEX",
    headline: "Crise et Choc d'Approvisionnement Énergétique",
    description: "CORTEX identifie le risque de rupture de flux gaziers. La PIT intervient pour qualifier la répercussion de ce risque sur le tissu d'entreprises wallonnes.",
    metrics: [
      { label: "Niveau Risque", value: "12 / 25", sub: "Score de criticité" },
      { label: "Aléas Ciblés", value: "Gaz, Électricité", sub: "Chocs d'approvisionnement" }
    ],
    connections: ["Risque lié: R-ENERGY-01", "Aléas associés: FLOOD, HEAT"]
  },
  {
    id: "scenario",
    title: "3. Scénario Test",
    icon: Compass,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badge: "Simulé à 6 mois",
    headline: "Triplement Brutal du Prix du Gaz de Marché (Gaz ×3)",
    description: "Simulation d'une hausse tarifaire extrême subie par les grands consommateurs industriels pendant une période de 6 mois consécutifs.",
    metrics: [
      { label: "Durée", value: "6 Mois", sub: "Période d'impact" },
      { label: "Facteur Choc", value: "× 3.0", sub: "Surcoût de base" }
    ],
    connections: ["Scénario: SC-ENERGY-01", "Probabilité: 0.70"]
  },
  {
    id: "impact",
    title: "4. Impact Économique",
    icon: Activity,
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    badge: "Décideur-Orienté (DMAT)",
    headline: "Évaluation Prévisionnelle des Pertes et Expositions",
    description: "Cartographie instantanée via le Graphe de Connaissances de la PIT pour chiffrer précisément l'exposition du territoire.",
    metrics: [
      { label: "Bénéficiaires", value: "142", sub: "Structures affectées" },
      { label: "Emplois Menacés", value: "18 500 ETP", sub: "Sidérurgie & Chimie" },
      { label: "Chiffre d'Affaires", value: "4.2 Mrds €", sub: "Annuel exposé" },
      { label: "Enveloppe Aide", value: "120 M €", sub: "Besoin de soutien" }
    ],
    connections: ["Actifs menacés: 12 usines", "Impacts secondaires: Sous-traitance"]
  },
  {
    id: "programs",
    title: "5. Dispositifs / Réponse",
    icon: Landmark,
    color: "text-teal-650 bg-teal-500/10 border-teal-500/20",
    badge: "Mobilisation publique",
    headline: "Activation du Plan Regional de Soutien Énergétique",
    description: "Alignement des services d'accompagnement (EDIH WallonIA) et des subventions/prêts de trésorerie (Wallonie Entreprendre) pour soutenir les acteurs exposés.",
    metrics: [
      { label: "Aide Transition", value: "Subvention", sub: "Plan Conjoncturel" },
      { label: "Accompagnement", value: "Diagnostic", sub: "Efficacité Énergétique" }
    ],
    connections: ["Service CPSV: Diagnostics", "Financeur: Wallonie Entreprendre"]
  },
  {
    id: "outcomes",
    title: "6. Outcomes / Impact Réel",
    icon: BarChart3,
    color: "text-emerald-650 bg-emerald-500/10 border-emerald-500/20",
    badge: "Evidence-Based Policy",
    headline: "Indicateurs de Succès de la Politique de Soutien",
    description: "Validation de l'aide publique. Mesure réelle de l'impact des subventions régionales 6 mois après leur mise en place à l'aide des observations de la PIT.",
    metrics: [
      { label: "Stabilisation", value: "95 %", sub: "Bénéficiaires sauvés" },
      { label: "Efficacité", value: "-15 %", sub: "Consommation gaz" }
    ],
    connections: ["Indicateurs de succès: IND-STAB-01", "Qualité preuve: High"]
  }
];

export default function StrategicDemonstratorPage() {
  const [activeStepId, setActiveStepId] = useState<string>("challenge");

  const activeStep = STEPS.find(s => s.id === activeStepId) || STEPS[0];
  const activeStepIndex = STEPS.findIndex(s => s.id === activeStepId);

  const handleNext = () => {
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepId(STEPS[activeStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepId(STEPS[activeStepIndex - 1].id);
    }
  };

  const ActiveIcon = activeStep.icon;

  return (
    <PITLayout
      category="PILOTAGE STRATÉGIQUE"
      title="Démonstrateur Politique Exécutif"
      description="Parcours de simulation et d'aide à la décision stratégique pour le Cabinet et la Direction Générale."
      pageIcon={Compass}
      breadcrumb={[{ label: "Pilotage stratégique", href: "/strategic" }, { label: "Démonstrateur Cabinet" }]}
    >
      <div className="space-y-8">
        
        {/* Top pedagogical card */}
        <div className="p-6 rounded-2xl bg-glass border border-muted/20 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500 opacity-[0.03] blur-3xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-teal-500/10 text-teal-655 px-2 py-0.5 rounded-full border border-teal-500/20">
              Cabinet & DG Cockpit
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-text">Démonstrateur Exécutif — Cadre Caroline & CORTEX</h2>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Ce démonstrateur illustre de manière interactive comment la PIT interconnecte la stratégie, les risques CORTEX, les impacts simulés, les acteurs concernés et l'évaluation réelle des politiques publiques (Evidence-Based Policy Making).
          </p>
        </div>

        {/* Main interactive area split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Center: Interactive Navigation Tunnel */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Step bubbles list */}
            <div className="flex justify-between items-center bg-glass/25 border border-muted/10 p-3 rounded-xl overflow-x-auto gap-2">
              {STEPS.map((s, idx) => {
                const StepIcon = s.icon;
                const isActive = s.id === activeStepId;
                const isPassed = idx < activeStepIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStepId(s.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-black transition-all ${
                      isActive 
                        ? "bg-teal-500/10 text-teal-655 border border-teal-500/20" 
                        : isPassed 
                          ? "text-emerald-600 border border-emerald-500/10" 
                          : "text-muted hover:text-text border border-transparent"
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                    <span className="hidden md:inline">{s.title.split(". ")[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Detail Card */}
            <div className="bg-glass/35 border border-muted/15 p-6 rounded-2xl space-y-6 min-h-[360px] flex flex-col justify-between">
              
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${activeStep.color}`}>
                      {activeStep.badge}
                    </span>
                    <h4 className="text-sm font-black text-text mt-1">{activeStep.headline}</h4>
                  </div>
                  <div className={`p-3 rounded-xl ${activeStep.color} border`}>
                    <ActiveIcon className="h-6 w-6" />
                  </div>
                </div>

                <p className="text-xs text-text font-semibold leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Key Metrics */}
                {activeStep.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {activeStep.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-3 bg-muted/5 border border-muted/10 rounded-xl text-center">
                        <span className="text-[9px] font-black text-muted block uppercase">{m.label}</span>
                        <span className="text-xs font-black text-text block">{m.value}</span>
                        <span className="text-[8px] font-semibold text-muted block">{m.sub}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Connections (Graphe Links) */}
                {activeStep.connections && (
                  <div className="pt-2">
                    <span className="text-[9px] font-black text-muted block uppercase mb-1.5">Liaisons du Territorial Knowledge Graph</span>
                    <div className="flex flex-wrap gap-2">
                      {activeStep.connections.map((c, cIdx) => (
                        <span 
                          key={cIdx} 
                          className="text-[9px] font-bold bg-muted/10 text-muted px-2.5 py-1 rounded-full border border-muted/20"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center border-t border-muted/10 pt-4 mt-6">
                <button
                  onClick={handlePrev}
                  disabled={activeStepIndex === 0}
                  className="px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all disabled:opacity-50 text-text"
                >
                  Précédent
                </button>

                <div className="text-[10px] text-muted font-black tracking-widest uppercase">
                  Étape {activeStepIndex + 1} sur {STEPS.length}
                </div>

                {activeStepIndex === STEPS.length - 1 ? (
                  <Link
                    href="/strategic"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Terminer la démo
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Suivant
                  </button>
                )}
              </div>

            </div>

            {/* Note on Illustrative values */}
            <div className="text-[10px] text-muted italic font-semibold flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-muted flex-shrink-0" />
              <span>Note Cabinet : Les valeurs économiques et les outcomes présentés ci-dessus sont des données de simulation pour la démonstration de l'Evidence-Based Policy Making.</span>
            </div>

          </div>

          {/* Right: Pedagogical strategic panel */}
          <div className="space-y-4">
            
            <div className="bg-glass/25 border border-muted/15 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-655" />
                <h4 className="text-xs font-black uppercase tracking-wider text-text">Pédagogie & Valeur de la PIT</h4>
              </div>

              <div className="space-y-3">
                
                {/* Point 1 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-655 block">1. POURQUOI LA PIT EXISTE ?</span>
                  <p className="text-[10px] text-text font-semibold leading-relaxed">
                    Pour briser les silos administratifs et croiser les données de 20 domaines (CPSV, DCAT, OCDE) au sein d'un graphe de connaissances unique et opérationnel.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-655 block">2. COMMENT SOUTIENT-ELLE LA POLITIQUE ?</span>
                  <p className="text-[10px] text-text font-semibold leading-relaxed">
                    En permettant de mesurer l'impact réel (outcomes) des aides financières et des services d'accompagnement distribués aux bénéficiaires structurellement exposés.
                  </p>
                </div>

                {/* Point 3 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-655 block">3. SYNERGIE CORTEX</span>
                  <p className="text-[10px] text-text font-semibold leading-relaxed">
                    CORTEX gère la vigilance amont des risques majeurs. La PIT fournit la télémétrie structurelle fine des acteurs économiques et la réponse publique mobilisable en aval.
                  </p>
                </div>

              </div>
            </div>

            {/* Sandbox details */}
            <div className="p-4 bg-muted/5 border border-muted/10 rounded-xl text-center space-y-2">
              <span className="text-[10px] font-black text-muted block uppercase">Architecture Sémantique sous-jacente</span>
              <p className="text-[9px] text-muted leading-normal font-semibold">
                Ce démonstrateur valide physiquement les schémas PostgreSQL/Prisma étendus intégrant les profils de résilience OCDE, les cadres d'impact territoriaux et le modèle européen CPSV-AP.
              </p>
            </div>

          </div>

        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link 
            href="/strategic"
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au Pilotage stratégique</span>
          </Link>
        </div>

      </div>
    </PITLayout>
  );
}
