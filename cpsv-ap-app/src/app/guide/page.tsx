// src/app/guide/page.tsx
"use client";

import { useState } from "react";
import { 
  Compass, 
  MapPin, 
  Building2, 
  Target, 
  Layers, 
  Users, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  BookOpen
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "1. Modéliser le Territoire",
      subtitle: "Arborescence & Communes",
      description: "La première étape consiste à structurer les échelles territoriales (Région, Provinces, Arrondissements, Economic Basins). Le Territorial Knowledge Graph s'appuie sur cette structure hiérarchique pour agréger les indicateurs de réussite locaux.",
      details: [
        "Définition des nœuds territoires (Province de Liège, Namur, Hainaut, etc.)",
        "Liaison parent-enfant pour la consolidation ascendante",
        "Géolocalisation des bénéficiaires et des points d'impact"
      ],
      icon: MapPin,
      cta: "Découvrir le Graphe Territorial",
      href: "/graph",
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10"
    },
    {
      id: 2,
      title: "2. Référencer les Opérateurs",
      subtitle: "Consortium & Institutions",
      description: "Identifiez les autorités publiques compétentes, les pôles de compétitivité, clusters, centres de recherche et guichets d'accompagnement wallons. Chaque opérateur pilote un ou plusieurs dispositifs.",
      details: [
        "Enregistrement des fiches organisations pilotes",
        "Définition des rôles dans les consortiums d'opérateurs",
        "Cartographie des écosystèmes (ex: Hubs d'Innovation)"
      ],
      icon: Building2,
      cta: "Consulter les Écosystèmes",
      href: "/ecosystems",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10"
    },
    {
      id: 3,
      title: "3. Définir la Vision Stratégique",
      subtitle: "Politiques S3 & Circular Wallonia",
      description: "Saisissez les grandes politiques publiques régionales (ex: Stratégie de Spécialisation Intelligente S3, Plan de Relance). Découpez-les en Priorités Stratégiques transverses.",
      details: [
        "Création de la politique stratégique parente",
        "Attribution d'un code unique de gouvernance",
        "Ajout des axes et priorités associés aux filières S3"
      ],
      icon: Target,
      cta: "Créer une Stratégie",
      href: "/strategies?action=new-strategy",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
    },
    {
      id: 4,
      title: "4. Structurer les Programmes & Budgets",
      subtitle: "Programmes & Enveloppes",
      description: "Associez les priorités stratégiques à des Programmes Opérationnels. C'est à ce niveau qu'on alloue les budgets (FEDER, Chèques-entreprises) et qu'on définit le rôle des acteurs du consortium.",
      details: [
        "Création de programmes de financement avec budgets",
        "Attribution de mesures opérationnelles fines",
        "Liaison many-to-many avec les priorités"
      ],
      icon: Layers,
      cta: "Planifier un Programme",
      href: "/strategies?action=new-program",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10"
    },
    {
      id: 5,
      title: "5. Enrôler les Entreprises (PME)",
      subtitle: "Bénéficiaires & BCE",
      description: "Enregistrez les entreprises bénéficiaires du territoire wallon. Renseignez leur numéro BCE, leur province, leur secteur NACE et qualifiez leur maturité de base (Cyber, IA, Digital, Export, Durabilité) de 1 à 5.",
      details: [
        "Recherche et création via BCE valide",
        "Spécification des secteurs NACE secondaires",
        "Jauges de maturité initiales de l'entreprise"
      ],
      icon: Users,
      cta: "Ajouter une Entreprise (BCE)",
      href: "/beneficiaries?action=new-beneficiary",
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10"
    },
    {
      id: 6,
      title: "6. Enregistrer les Accompagnements",
      subtitle: "Niveaux 1, 2, 3 d'Intervention",
      description: "Loguez en temps réel l'exécution de l'action publique : prestations individuelles de conseil (Niveau 1), workshops collectifs (Niveau 2) et chantiers d'écosystèmes (Niveau 3).",
      details: [
        "Service Delivery individuel avec delta de maturité",
        "Collective Delivery avec score de satisfaction sur 5",
        "Second-Line Mission avec mobilisation de consortiums d'opérateurs"
      ],
      icon: Activity,
      cta: "Enregistrer une prestation",
      href: "/beneficiaries?action=new-delivery",
      color: "text-rose-600 dark:text-rose-455 bg-rose-500/10",
      extraCtas: [
        { label: "Atelier Collectif", href: "/activities?action=new-collective" },
        { label: "Mission d'Écosystème", href: "/activities?action=new-mission" }
      ]
    },
    {
      id: 7,
      title: "7. Activer les Parcours de Croissance",
      subtitle: "Transformation Sémantique",
      description: "Mettez en relation les PME avec des Parcours de croissance pré-calculés, ou utilisez l'algorithme de matchmaking du Recommender pour orienter chaque PME vers les aides les plus pertinentes selon ses faiblesses de maturité.",
      details: [
        "Aiguillage via les diagnostics sémantiques",
        "Parcours séquentiels multi-services par étapes",
        "Documentation technique et actifs de connaissance associés"
      ],
      icon: Sparkles,
      cta: "Lancer le Recommender",
      href: "/recommender",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
    },
    {
      id: 8,
      title: "8. Mesurer l'Impact & Piloter",
      subtitle: "5 Questions de Pilotage",
      description: "Suivez l'atteinte des cibles d'impact de vos politiques publiques. Visualisez en temps réel les indicateurs d'emplois créés, de décarbonation et d'intensification territoriale dans les cockpits.",
      details: [
        "Cumul des indicateurs de réussite quantitatifs",
        "Flux d'impacts qualitatifs et livrables (Success Stories)",
        "Contrôle d'alignement géographique et sectoriel"
      ],
      icon: TrendingUp,
      cta: "Consulter le Pilotage",
      href: "/pilotage",
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
    }
  ];

  const current = steps[activeStep - 1];
  const StepIcon = current.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Guide d'Utilisation Interactif" 
        description="Suivez les 8 étapes clés de la méthodologie PIT Wallonie pour structurer le pilotage territorial, aligner vos aides publiques et mesurer l'impact réel."
        Icon={Compass}
      />

      {/* PROGRESS BAR */}
      <div className="bg-glass border border-muted/20 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
        <span className="text-xs font-black text-muted uppercase tracking-wider shrink-0">
          Progression : Étape {activeStep} sur 8
        </span>
        <div className="flex-1 h-2 bg-muted/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-300" 
            style={{ width: `${(activeStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* STEPPER GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Step selector */}
        <div className="lg:col-span-1 bg-glass border border-muted/20 rounded-2xl p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 mb-2">
            Étapes de la Méthodologie
          </h3>
          <div className="space-y-1.5">
            {steps.map((s) => {
              const isPassed = activeStep > s.id;
              const isActive = activeStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs font-bold",
                    isActive 
                      ? "bg-primary/10 border-primary/40 text-primary shadow-xs" 
                      : "bg-transparent border-transparent hover:bg-glass/50 text-text/80"
                  )}
                >
                  <span className="truncate">{s.title}</span>
                  {isPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted/40 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step details cockpit */}
        <div className="lg:col-span-2 bg-glass border border-muted/20 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
          {/* Backdrop HSL glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary opacity-[0.03] blur-3xl rounded-full" />
          
          <div className="flex items-center gap-3 border-b border-muted/10 pb-4">
            <div className={cn("p-3 rounded-xl shrink-0", current.color)}>
              <StepIcon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted">{current.subtitle}</span>
              <h2 className="text-lg font-black text-text mt-0.5">{current.title}</h2>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-text leading-relaxed font-semibold">
              {current.description}
            </p>

            <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 space-y-2.5">
              <h4 className="font-extrabold text-muted text-[10px] uppercase tracking-wider">
                Livrables et actions attendues :
              </h4>
              <ul className="space-y-2 pl-1.5">
                {current.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-text/90 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-muted/10">
            <div className="flex items-center gap-2">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-muted/30 hover:bg-glass text-xs font-bold text-text rounded-lg disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>
              <button
                disabled={activeStep === 8}
                onClick={() => setActiveStep(prev => prev + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-muted/30 hover:bg-glass text-xs font-bold text-text rounded-lg disabled:opacity-50 cursor-pointer"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {current.extraCtas?.map((btn, idx) => (
                <Link
                  key={idx}
                  href={btn.href}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-extrabold bg-glass border border-muted/30 hover:border-primary/50 text-text rounded-lg transition-colors cursor-pointer"
                >
                  {btn.label}
                </Link>
              ))}
              <Link 
                href={current.href}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black text-white bg-primary hover:bg-primary/90 rounded-lg shadow-md shadow-primary/10 transition-colors cursor-pointer"
              >
                {current.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
