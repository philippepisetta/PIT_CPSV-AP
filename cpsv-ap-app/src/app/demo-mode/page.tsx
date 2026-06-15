// src/app/demo-mode/page.tsx
"use client";

import { useState } from "react";
import { 
  Play, 
  Target, 
  Sparkles, 
  Compass, 
  FileText, 
  Network, 
  FileCode, 
  Activity, 
  TrendingUp, 
  ClipboardCheck, 
  Shield,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

// Scenarios data
interface StepData {
  title: string;
  icon: any;
  entityName: string;
  description: string;
  why: string;
}

const SCENARIOS: Record<string, { title: string; color: string; steps: StepData[] }> = {
  BioWin: {
    title: "BioWin - e-Santé",
    color: "fuchsia",
    steps: [
      { title: "Étape 1 : Défi", icon: Target, entityName: "MedTech Namur S.A.", description: "La startup exprime un défi : obtenir l'homologation réglementaire clinique MDR pour son algorithme d'imagerie clinique assisté par IA.", why: "Identification du besoin réel sur le terrain." },
      { title: "Étape 2 : Recommandation", icon: Sparkles, entityName: "Matching automatique PIT", description: "La PIT recommande automatiquement le service de Diagnostic IA et de test clinique, ainsi qu'un partenariat de R&D avec le CHU de Liège.", why: "Le moteur de recommandation élimine la recherche manuelle." },
      { title: "Étape 3 : Parcours", icon: Compass, entityName: "Parcours IA Santé", description: "Le conseiller du pôle initie le parcours e-Santé structuré en 4 étapes clés : Diagnostic, Accompagnement clinique, Certification CE, Évaluation.", why: "Suivi pas-à-pas de la transformation de l'entreprise." },
      { title: "Étape 4 : Services", icon: FileText, entityName: "Diagnostic Clinique IA (SRV-IA-DIAG)", description: "Délivrance du service public d'accompagnement réglementaire CE et de validation clinique par le pôle.", why: "Centralisation et historisation de la délivrance d'aides." },
      { title: "Étape 5 : Consortium", icon: Network, entityName: "Consortium MedTech IA", description: "Création d'un consortium associant MedTech Namur, UCLouvain (Deep Learning) et le CHU Liège (Validation clinique).", why: "Collaboration structurée des acteurs de l'écosystème." },
      { title: "Étape 6 : Financement", icon: FileCode, entityName: "Appel Health Innovation 2026", description: "Le consortium soumet une demande de financement régional (Horizon Europe Health) et obtient une subvention de 2.4 M€.", why: "Levier financier requis pour la R&D." },
      { title: "Étape 7 : Projet", icon: Activity, entityName: "Projet MedTech IA Imagerie", description: "Lancement opérationnel du projet collaboratif de recherche industrielle.", why: "Exécution et développement de l'innovation." },
      { title: "Étape 8 : Outcome", icon: TrendingUp, entityName: "Algorithme clinique certifié", description: "Le résultat est atteint : l'algorithme est homologué et certifié MDR avec une précision augmentée de 25%.", why: "Mesure de résultat d'affaires quantifiable." },
      { title: "Étape 9 : Preuve", icon: ClipboardCheck, entityName: "Rapport de validation du CHU", description: "Le justificatif officiel (Rapport d'audit du CHU Liège) est audité et validé (status: APPROVED) par l'animateur du pôle.", why: "Audit de confiance de la donnée d'impact." },
      { title: "Étape 10 : Contribution", icon: Shield, entityName: "S3 Wallonie - Santé & Sciences", description: "L'impact validé met à jour instantanément la contribution à la priorité S3 de la Région Wallonne.", why: "Preuve de l'efficacité de la politique publique." }
    ]
  },
  GreenWin: {
    title: "GreenWin - Éco-Design",
    color: "teal",
    steps: [
      { title: "Étape 1 : Défi", icon: Target, entityName: "BioPlast S.A.", description: "L'entreprise cherche à réduire de 20% son empreinte CO2 de production en intégrant des polymères biosourcés.", why: "Défi d'économie circulaire et de transition écologique." },
      { title: "Étape 2 : Recommandation", icon: Sparkles, entityName: "Recommandations Éco-Design", description: "Recommandation sémantique du service public d'Audit Éco-Design et de mise en relation avec Sirris.", why: "Proposition de solutions et de partenaires de R&D." },
      { title: "Étape 3 : Parcours", icon: Compass, entityName: "Parcours Transition Circulaire", description: "Lancement du parcours d'innovation d'éco-conception industrielle.", why: "Planification structurée de la transition matière." },
      { title: "Étape 4 : Services", icon: FileText, entityName: "Audit Éco-Design (SRV-ECO-DESIGN)", description: "Délivrance de l'audit technique de faisabilité polymère par Sirris.", why: "Délivrance de services et d'expertise ciblée." },
      { title: "Étape 5 : Consortium", icon: Network, entityName: "Consortium Circular Materials", description: "Montage du consortium : BioPlast, Sirris et le Forem pour les compétences.", why: "Synergie de compétences complémentaires." },
      { title: "Étape 6 : Financement", icon: FileCode, entityName: "Aide WE - Transition Écologique", description: "Obtention d'une aide financière d'accompagnement de Wallonie Entreprendre.", why: "Financement public de la décarbonation." },
      { title: "Étape 7 : Projet", icon: Activity, entityName: "Projet CircularPack", description: "Projet pilote de fabrication de barquettes alimentaires recyclables.", why: "Production industrielle de l'innovation." },
      { title: "Étape 8 : Outcome", icon: TrendingUp, entityName: "42% de plastique réintégré", description: "Obtention d'une formulation plastique biosourcée validée.", why: "Indicateur d'impact quantitatif." },
      { title: "Étape 9 : Preuve", icon: ClipboardCheck, entityName: "Rapport validation CO2", description: "Soumission et approbation (status: APPROVED) du rapport de validation carbone.", why: "Justificatif d'impact audité." },
      { title: "Étape 10 : Contribution", icon: Shield, entityName: "Circular Wallonia & S3", description: "Calcul immédiat de la contribution du projet au cadre Circular Wallonia.", why: "Lignage direct de la preuve à la politique." }
    ]
  },
  Logistics: {
    title: "Logistics in Wallonia - Mobilité",
    color: "blue",
    steps: [
      { title: "Étape 1 : Défi", icon: Target, entityName: "LogiTrans S.A.", description: "Mettre en conformité réglementaire cyber-sécurisée NIS2 les applications de dispatch logistique.", why: "Défi critique de résilience numérique." },
      { title: "Étape 2 : Recommandation", icon: Sparkles, entityName: "Recommandations Cybersécurité", description: "Matching avec le CETIC et recommandation du dispositif d'aide Chèques Cybersécurité.", why: "Orientation vers l'aide publique adaptée." },
      { title: "Étape 3 : Parcours", icon: Compass, entityName: "Parcours Sécurisation NIS2", description: "Planification du diagnostic de vulnérabilités et du déploiement cyber.", why: "Parcours de conformité guidé." },
      { title: "Étape 4 : Services", icon: FileText, entityName: "Cyber Diagnostic (SRV-CYBER-DIAG)", description: "Réalisation du diagnostic des serveurs industriels de transport par le CETIC.", why: "Délivrance de l'audit de cybersécurité." },
      { title: "Étape 5 : Consortium", icon: Network, entityName: "Consortium Fret Connecté", description: "Consortium LogiTrans, CETIC et SmartFleet (dispatching IoT).", why: "Collaboration technique écosystémique." },
      { title: "Étape 6 : Financement", icon: FileCode, entityName: "Appel Fret Vert / NIS2", description: "Subvention obtenue via le plan FEDER Wallonie.", why: "Mobilisation des fonds européens." },
      { title: "Étape 7 : Projet", icon: Activity, entityName: "Projet Fret Vert Sécurisé", description: "Implémentation opérationnelle du dispatching sécurisé et chiffré.", why: "Exécution de la remédiation cyber." },
      { title: "Étape 8 : Outcome", icon: TrendingUp, entityName: "Dispatch crypté NIS2 conforme", description: "Système de dispatching d'intérêt régional certifié résilient.", why: "Conformité d'affaires démontrée." },
      { title: "Étape 9 : Preuve", icon: ClipboardCheck, entityName: "Rapport d'audit NIS2 CETIC", description: "Rapport d'audit de sécurité formel validé (status: APPROVED) par le pôle.", why: "Audit de la preuve d'intégrité." },
      { title: "Étape 10 : Contribution", icon: Shield, entityName: "Digital Wallonia - Cyber PME", description: "Impact consolidé dans l'indicateur d'entreprises wallonnes NIS2 résilientes.", why: "Valorisation de l'alignement stratégique." }
    ]
  }
};

export default function DemoModePage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("BioWin");
  const [currentStep, setCurrentStep] = useState<number>(0);

  const scenario = SCENARIOS[selectedScenario] || SCENARIOS.BioWin;
  const step = scenario.steps[currentStep];

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectScenario = (key: string) => {
    setSelectedScenario(key);
    setCurrentStep(0);
  };

  const StepIcon = step.icon;

  return (
    <PITLayout
      category="PILOTE DE DÉMONSTRATION"
      title="PIT Story Mode (Démonstration)"
      description="Sélectionnez un écosystème et découvrez pas-à-pas sous une forme visuelle comment la PIT relie la politique publique aux résultats."
      pageIcon={Play}
      breadcrumb={[{ label: "Demo Mode" }]}
    >
      <div className="space-y-6">
        {/* Selector Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Démonstration 15 Min</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Choisir une simulation</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(SCENARIOS).map((key) => (
              <button
                key={key}
                onClick={() => selectScenario(key)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  selectedScenario === key 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                    : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                }`}
              >
                {SCENARIOS[key].title}
              </button>
            ))}
          </div>
        </div>

        {/* Guided Wizard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Vertical Steps timeline */}
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 flex flex-col space-y-3">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-wider border-b border-muted/10 pb-2">
              Étapes du Scénario
            </h3>
            
            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin pr-1">
              {scenario.steps.map((s, idx) => {
                const isActive = currentStep === idx;
                const isPassed = idx < currentStep;
                const SIcon = s.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-teal-500 border-teal-500 text-white font-extrabold shadow-sm" 
                        : isPassed 
                        ? "bg-glass/35 border-teal-500/20 text-text/90" 
                        : "bg-glass/10 border-transparent text-muted"
                    }`}
                  >
                    <div className={`p-1 rounded-md ${isActive ? "bg-black/10 text-white" : "bg-glass border border-muted/15 text-muted"}`}>
                      <SIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-black uppercase opacity-85 leading-tight">{s.title.split(":")[0]}</span>
                      <span className="text-xs truncate font-bold">{s.title.split(":")[1] || s.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active Step Details */}
          <div className="lg:col-span-2 rounded-2xl border border-muted/20 bg-glass/20 p-8 flex flex-col justify-between min-h-[450px]">
            <div className="space-y-6">
              {/* Step Title */}
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/10 text-teal-650 rounded-xl border border-teal-500/20">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted">Simulation Écosystème</span>
                    <h3 className="text-base font-black text-text leading-tight">{step.title}</h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-muted bg-glass px-2.5 py-1 rounded-full border border-muted/15">
                  {currentStep + 1} / {scenario.steps.length}
                </span>
              </div>

              {/* Entity card representation */}
              <div className="p-6 rounded-2xl border border-teal-500/25 bg-teal-500/5 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500 to-indigo-500 opacity-[0.03] blur-2xl" />
                <span className="text-[9px] font-black uppercase text-teal-605">Objet du Graphe Territorial</span>
                <h4 className="text-sm font-black text-text">{step.entityName}</h4>
                <p className="text-xs text-text font-medium leading-relaxed mt-2">{step.description}</p>
              </div>

              {/* Why PIT Explainer */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-500 block">Pourquoi cette étape ?</span>
                <p className="text-xs text-muted leading-relaxed font-semibold italic">
                  "{step.why}"
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-muted/10 pt-6 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-text rounded-xl text-xs font-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </button>
              
              {currentStep < scenario.steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:shadow-md text-white rounded-xl text-xs font-black cursor-pointer transition-all"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-500 font-extrabold text-xs">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Scénario complété avec succès !
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PITLayout>
  );
}
