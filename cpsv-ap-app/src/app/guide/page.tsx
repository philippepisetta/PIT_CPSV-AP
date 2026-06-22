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
  BookOpen,
  Database,
  FileText,
  Shield,
  FileCode,
  Zap,
  Info
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<"scope" | "glossary" | "methodology">("scope");
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
      href: "/territories",
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
      href: "/strategic",
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
      href: "/opportunities",
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
      href: "/beneficiaries",
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
      href: "/beneficiaries",
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
      href: "/strategic",
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
    }
  ];

  const glossaryItems = [
    { name: "Acteur territorial", desc: "Organisation publique, privée ou académique présente au sein de l'écosystème d'innovation wallon (ex: Sirris, CETIC, AdN)." },
    { name: "Bénéficiaire", desc: "Organisation (PME, Startup, ASBL, Commune, Centre de recherche) qui est accompagnée ou susceptible de recevoir un service d'aide publique." },
    { name: "Contact", desc: "Personne physique rattachée à une organisation, qualifiée par son rôle opérationnel ou technique et ses coordonnées directes." },
    { name: "Membership (Affiliation)", desc: "Relation d'adhésion d'une organisation à une communauté thématique, un programme régional, un cluster ou un consortium R&D, dotée d'un rôle (ex: Membre, Coordinateur)." },
    { name: "Communauté", desc: "Cercle d'animation thématique sectoriel ou technologique (ex: IA Santé, Construction durable) piloté par un pôle de compétitivité." },
    { name: "Service", desc: "Offre standardisée de prestation d'accompagnement ou de financement, modélisée selon la spécification européenne CPSV-AP." },
    { name: "Parcours", desc: "Suite séquentielle logique d'étapes (Journeys) combinant plusieurs services publics pour guider le bénéficiaire dans sa transition." },
    { name: "ServiceDelivery", desc: "Réalisation effective d'une prestation de service individuel ou collectif pour le compte d'un bénéficiaire à une date donnée." },
    { name: "Evidence (Justificatif / Preuve)", desc: "Pièce justificative physique (ex: PDF d'audit, contrat, livrable) attestant de la livraison d'un service (Preuve métier) ou démontrant l'atteinte d'un résultat d'impact (Preuve d'impact)." },
    { name: "Outcome", desc: "Résultat qualifié ou effet mesurable induit par un service d'accompagnement ou un projet R&D (ex: +2 en maturité cybersécurité)." },
    { name: "Dataset", desc: "Actif ou catalogue de données territoriales référencé au standard DCAT-AP pour l'échange inter-plateformes." },
    { name: "SourceSystem", desc: "Système informatique source de référence (ex: Banque-Carrefour des Entreprises, CRM Wallonie Entreprendre) conférant l'autorité de données." }
  ];

  const current = steps[activeStep - 1];
  const StepIcon = current.icon;

  return (
    <PITLayout
      category="GOUVERNANCE"
      title="Documentation Fonctionnelle & Méthodologie"
      description="Référentiel fonctionnel de la PIT Wallonie : périmètre opérationnel, glossaire du modèle métier sémantisé et guide de mise en œuvre territoriale."
      pageIcon={BookOpen}
      breadcrumb={[{ label: "Documentation" }]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          {[
            { id: "scope", label: "Périmètre Projet", icon: Info },
            { id: "glossary", label: "Modèle Métier", icon: FileText },
            { id: "methodology", label: "Méthodologie", icon: Compass }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border-0 bg-transparent ${
                  activeTab === t.id 
                    ? "bg-teal-500 text-white font-extrabold" 
                    : "text-muted hover:text-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* TAB 1: SCOPE */}
        {activeTab === "scope" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-surface border border-muted/20 bg-glass/20 space-y-4">
              <h3 className="text-sm font-extrabold text-text uppercase tracking-wider border-b border-muted/10 pb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-655" />
                Périmètre Opérationnel de la Plateforme (vNext Framework)
              </h3>
              <p className="text-xs text-text leading-relaxed font-medium">
                La version actuelle de la PIT constitue un socle de back-office territorial sémantisé. Le Territorial Knowledge Graph complet, les agents IA/RAG, le portail entreprise, les vues avancées et la résilience territoriale relèvent de la cible vNext ou de démonstrateurs à construire progressivement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Production */}
              <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider">Disponible en Production (Socle)</h4>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">Disponible</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-900/90 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bénéficiaires 360</strong> : Fiches unifiées avec typologie administrative et synchro BCE.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Catalogue CPSV</strong> : Indexation conforme CPSV-AP v3.0 avec grille de coûts.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Gestion d’Écosystème</strong> : Suivi des communautés, acteurs territoriaux et consortiums.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Défis d’Écosystème</strong> : Formulaires de qualification et de liaison sémantique.</span>
                  </li>
                </ul>
              </div>

              {/* Demonstrator */}
              <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider">Disponible en Démonstrateur</h4>
                  <span className="text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-650 px-2 py-0.5 rounded-full border border-indigo-500/20">Démonstrateur</span>
                </div>
                <ul className="space-y-2 text-xs text-indigo-900/90 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Moteur de Matchmaking</strong> : Suggestions de services selon les scores de maturité DMAT.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Visualisation Graphe</strong> : Graph Explorer interactif (forces) et diagrammes locaux.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Mode Histoire</strong> : Scénarios métiers de démo pré-seedés (EDIH, BioWin, etc.).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Résilience & Cabinet</strong> : Simulation de chocs (Crise Énergétique x3), radar OCDE 6 axes, conséquences et aides d'urgence.</span>
                  </li>
                </ul>
              </div>

              {/* Prototype & Cible vNext */}
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3 md:col-span-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider">Prévu en Cible vNext ou Prototype</h4>
                  <span className="text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">Prototype / Cible vNext</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-900/90 font-medium">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Résilience industrialisée</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Intégration de l'ensemble des scénarios de crise et scoring automatique de vulnérabilité.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Territorial Knowledge Graph complet</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Triplestore RDF natif avec requêtes SPARQL.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Agents IA / RAG</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Assistants intelligents d’aide à la décision.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Recommandation automatique avancée</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Moteur d’orientation prédictif complet.</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Portail entreprise complet</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Espace interactif d’auto-évaluation pour les PME.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Cockpit DG complet</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Tableaux de bord stratégiques de pilotage du ROI territorial.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Data Marketplace complet</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Échange décentralisé de datasets.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span><strong>Exports NGSI-LD industrialisés</strong> <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1 rounded">Cible vNext</span> : Standardisation et exposition temps réel.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Out of scope */}
              <div className="p-5 rounded-2xl border border-gray-400/20 bg-gray-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Hors périmètre actuel</h4>
                  <span className="text-[9px] font-black uppercase bg-gray-500/10 text-gray-600 px-2 py-0.5 rounded-full border border-gray-500/20">Exclu</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-800/90 font-medium">
                  <li className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                    <span><strong>CRM commercial classique</strong> : Prospection, facturation et vente commerciale privée.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                    <span><strong>Facturation & Comptabilité</strong> : Outils de transaction financière, comptabilité interne et taxes.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: GLOSSARY */}
        {activeTab === "glossary" && (
          <div className="bg-glass border border-muted/20 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-text uppercase tracking-wider border-b border-muted/10 pb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-655" />
              Glossaire du Modèle Métier Sémantique
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossaryItems.map((item, index) => (
                <div key={index} className="p-3.5 bg-glass/25 border border-muted/10 rounded-xl space-y-1">
                  <h4 className="text-xs font-black text-teal-605">{item.name}</h4>
                  <p className="text-[11px] text-muted font-semibold leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: METHODOLOGY */}
        {activeTab === "methodology" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
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
                        <CheckCircle2 className="h-4 w-4 text-teal-605 shrink-0 mt-0.5" />
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
        )}

      </div>
    </PITLayout>
  );
}
