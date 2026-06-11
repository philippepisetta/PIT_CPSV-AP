// src/components/services/ServicesContainer.tsx
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Wizard from "@/components/encode/Wizard";
import { Plus, List, Database, Layers, CheckCircle, BarChart3, ShieldAlert, ArrowRight, Activity, TrendingUp, Info, X, Copy, FileCode, Users, Building2, MapPin, Sparkles, RotateCcw, Check, AlertCircle, Search, Trash2, HelpCircle, Gauge, Route, Edit3, Compass } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CraftEcosystem from "@/components/craft/CraftEcosystem";

// List of the 10 real Walloon services for absolute reliability and zero API fail risks
const walloonServices = [
  {
    id: "svc-1",
    name: "Diagnostic de maturité numérique PME",
    organisationId: "Agence du Numérique",
    uri: "https://pit.wallonie.be/services/diagnostic-maturite-numerique",
    description: "Évaluez la maturité digitale de votre PME wallonne et obtenez un plan d'action personnalisé.",
    status: "Published",
    themes: ["IA", "Innovation", "Formation"],
    sectors: ["Manufacturing", "Retail", "Construction"],
    impacts: { carbon: 40, jobs: 70, sovereignty: 85, resilience: 90, competitiveness: 95 },
    kpis: { companiesAccompanied: 320, satisfactionRate: 96 },
    dependency: { label: "Suivi par Accompagnement Industrie 4.0", target: "svc-2" }
  },
  {
    id: "svc-2",
    name: "Accompagnement transformation digitale industrie 4.0",
    organisationId: "Wallonie Entreprendre",
    uri: "https://pit.wallonie.be/services/accompagnement-transformation-industrie-4-0",
    description: "Accompagnement sur mesure pour la digitalisation de vos lignes de production et usines physiques.",
    status: "Published",
    themes: ["Industrie 4.0", "Innovation"],
    sectors: ["Manufacturing", "Energie"],
    impacts: { carbon: 60, jobs: 80, sovereignty: 75, resilience: 85, competitiveness: 98 },
    kpis: { companiesAccompanied: 110, satisfactionRate: 92 },
    dependency: { label: "Suivi par Expérimentation IA", target: "svc-3" }
  },
  {
    id: "svc-3",
    name: "Programme expérimentation IA industrielle",
    organisationId: "EDIH Wallonia",
    uri: "https://pit.wallonie.be/services/experimentation-ia-industrielle",
    description: "Validez et prototypez vos cas d'usage d'intelligence artificielle appliquée avec des experts du domaine.",
    status: "Published",
    themes: ["IA", "Industrie 4.0", "Innovation"],
    sectors: ["Manufacturing", "BioTech", "Energie"],
    impacts: { carbon: 50, jobs: 90, sovereignty: 95, resilience: 90, competitiveness: 96 },
    kpis: { companiesAccompanied: 45, satisfactionRate: 98 },
    dependency: { label: "Dernière étape du parcours IA", target: null }
  },
  {
    id: "svc-4",
    name: "Recherche de financement innovation",
    organisationId: "Wallonie Entreprendre",
    uri: "https://pit.wallonie.be/services/recherche-financement-innovation",
    description: "Accès aux financements publics et privés (capital risque, prêts subventionnés) pour vos projets innovants.",
    status: "Published",
    themes: ["Financement", "Innovation"],
    sectors: ["Manufacturing", "BioTech", "Smart City"],
    impacts: { carbon: 30, jobs: 95, sovereignty: 80, resilience: 85, competitiveness: 92 },
    kpis: { companiesAccompanied: 240, satisfactionRate: 94 },
    dependency: { label: "Suivi par Accompagnement Export", target: "svc-5" }
  },
  {
    id: "svc-5",
    name: "Accompagnement export international digital",
    organisationId: "AWEX",
    uri: "https://pit.wallonie.be/services/export-international-digital",
    description: "Déployez votre stratégie e-commerce et de visibilité digitale pour cibler les marchés internationaux.",
    status: "Published",
    themes: ["Export", "Cybersécurité"],
    sectors: ["Retail", "Manufacturing"],
    impacts: { carbon: 40, jobs: 85, sovereignty: 70, resilience: 80, competitiveness: 96 },
    kpis: { companiesAccompanied: 180, satisfactionRate: 90 },
    dependency: { label: "Étape finale export", target: null }
  },
  {
    id: "svc-6",
    name: "Parcours cybersécurité PME",
    organisationId: "AKT + AdN",
    uri: "https://pit.wallonie.be/services/parcours-cybersecurite-pme",
    description: "Sécurisez vos données et protégez vos infrastructures informatiques contre les rançongiciels.",
    status: "Published",
    themes: ["Cybersécurité", "Formation"],
    sectors: ["Manufacturing", "Retail", "Construction", "BioTech"],
    impacts: { carbon: 20, jobs: 60, sovereignty: 95, resilience: 98, competitiveness: 90 },
    kpis: { companiesAccompanied: 410, satisfactionRate: 95 },
    dependency: { label: "Recommande Diagnostic Maturité", target: "svc-1" }
  },
  {
    id: "svc-7",
    name: "Programme transition énergétique industrielle",
    organisationId: "Cluster Tweed",
    uri: "https://pit.wallonie.be/services/transition-energetique-industrielle",
    description: "Réduisez l'empreinte carbone et optimisez la consommation d'énergie de vos lignes de production.",
    status: "Published",
    themes: ["Énergie", "Circularité"],
    sectors: ["Manufacturing", "Construction"],
    impacts: { carbon: 98, jobs: 75, sovereignty: 85, resilience: 92, competitiveness: 94 },
    kpis: { companiesAccompanied: 78, satisfactionRate: 94 },
    dependency: { label: "Recommande Transformation Industrie 4.0", target: "svc-2" }
  },
  {
    id: "svc-8",
    name: "Détection de consortiums innovation S3",
    organisationId: "SPW EER",
    uri: "https://pit.wallonie.be/services/consortiums-innovation-s3",
    description: "Identifiez des partenaires de recherche et de développement pour répondre aux appels à projets S3 wallons.",
    status: "Published",
    themes: ["Innovation", "Smart Region"],
    sectors: ["BioTech", "Manufacturing", "Energie"],
    impacts: { carbon: 40, jobs: 90, sovereignty: 90, resilience: 88, competitiveness: 95 },
    kpis: { companiesAccompanied: 62, satisfactionRate: 88 },
    dependency: { label: "Suivi par Expérimentation IA", target: "svc-3" }
  },
  {
    id: "svc-9",
    name: "Mise en relation partenaires IA & industrie",
    organisationId: "Pôle Mecatech",
    uri: "https://pit.wallonie.be/services/relation-ia-industrie",
    description: "Trouvez le prestataire ou le chercheur idéal pour intégrer des technologies IA avancées dans votre usine.",
    status: "Published",
    themes: ["IA", "Industrie 4.0", "Innovation"],
    sectors: ["Manufacturing"],
    impacts: { carbon: 45, jobs: 80, sovereignty: 92, resilience: 85, competitiveness: 96 },
    kpis: { companiesAccompanied: 154, satisfactionRate: 91 },
    dependency: { label: "Suivi par Expérimentation IA", target: "svc-3" }
  },
  {
    id: "svc-10",
    name: "Accompagnement stratégie données territoriales",
    organisationId: "Agence du Numérique",
    uri: "https://pit.wallonie.be/services/strategie-donnees-territoriales",
    description: "Aidez votre territoire ou commune à concevoir un entrepôt de données (data lake) interopérable et souverain.",
    status: "Published",
    themes: ["Smart Region", "Innovation"],
    sectors: ["Smart City"],
    impacts: { carbon: 30, jobs: 50, sovereignty: 98, resilience: 95, competitiveness: 85 },
    kpis: { companiesAccompanied: 32, satisfactionRate: 96 },
    dependency: { label: "Recommande Consortiums S3", target: "svc-8" }
  }
];

// Service cost/duration/benefit reference data (used by recommendation engine)
const serviceCostData: Record<string, { minEur: number; maxEur: number; durationDays: number; benefitScore: number; personDays: number }> = {
  "svc-1":  { minEur: 500,   maxEur: 2000,  durationDays: 15,  benefitScore: 82, personDays: 5 },
  "svc-2":  { minEur: 8000,  maxEur: 20000, durationDays: 90,  benefitScore: 95, personDays: 25 },
  "svc-3":  { minEur: 5000,  maxEur: 15000, durationDays: 60,  benefitScore: 91, personDays: 18 },
  "svc-4":  { minEur: 1000,  maxEur: 3000,  durationDays: 20,  benefitScore: 88, personDays: 8 },
  "svc-5":  { minEur: 2000,  maxEur: 6000,  durationDays: 30,  benefitScore: 84, personDays: 10 },
  "svc-6":  { minEur: 1500,  maxEur: 4000,  durationDays: 25,  benefitScore: 87, personDays: 7 },
  "svc-7":  { minEur: 5000,  maxEur: 18000, durationDays: 75,  benefitScore: 93, personDays: 20 },
  "svc-8":  { minEur: 800,   maxEur: 2500,  durationDays: 12,  benefitScore: 79, personDays: 4 },
  "svc-9":  { minEur: 600,   maxEur: 1800,  durationDays: 10,  benefitScore: 76, personDays: 3 },
  "svc-10": { minEur: 3000,  maxEur: 10000, durationDays: 45,  benefitScore: 85, personDays: 15 },
};

type EffectivenessType = "Succès Majeur" | "En bonne voie" | "Mitigé" | "Insuffisant";

interface RealizedService {
  serviceName: string;
  status: "completed" | "active";
  org: string;
  resultText: string;
  date?: string;
  costEur?: number;
  durationDays?: number;
  benefitScore?: number;
  resourcesPersonDays?: number;
}

interface SimulatedService {
  serviceName: string;
  org: string;
  phaseId: string;
  estimatedCostEur: number;
  estimatedDurationDays: number;
  estimatedBenefitScore: number;
  estimatedResourcesPersonDays: number;
  rationale: string;
}

interface JourneyStep {
  proposed: string[];
  realized: RealizedService[];
  simulated?: SimulatedService[];
}

interface BeneficiaryJourneyInstance {
  id: string;
  name: string;
  provider: string;
  objective: string;
  effectivenessScore: number;
  effectivenessStatus: EffectivenessType;
  effectivenessExplanation: string;
  metrics: {
    label: string;
    before: string | number;
    after: string | number;
    unit: string;
    isPositive: boolean;
  }[];
  steps: {
    amorcage: JourneyStep;
    diagnostic: JourneyStep;
    coaching: JourneyStep;
    planification: JourneyStep;
    implementation: JourneyStep;
    investissement: JourneyStep;
  };
}

interface Beneficiary {
  id: string;
  name: string;
  size: string;
  sector: string;
  location: string;
  journeys: BeneficiaryJourneyInstance[];
  strategies: string[];
  digiscore: {
    score: number;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    date: string;
  };
  demand: string;
}



const initialBeneficiaries: Beneficiary[] = [
  {
    id: "ben-1",
    name: "MecaWall S.A.",
    size: "PME (120 emp.)",
    sector: "Manufacturing",
    location: "Namur",
    strategies: ["S3 (Industrie 4.0)", "EDIH (Cybersécurité)"],
    digiscore: { score: 62, level: "Intermediate", date: "2024-04-12" },
    demand: "Mettre en place des lignes de montage connectées tout en renforçant la protection contre les rançongiciels.",
    journeys: [
      {
        id: "j-1",
        name: "Transformation Numérique (Industrie 4.0)",
        provider: "Agence du Numérique / WE",
        objective: "Lignes de production connectées et automatisation",
        effectivenessScore: 85,
        effectivenessStatus: "En bonne voie",
        effectivenessExplanation: "La PME a réussi l'intégration de capteurs connectés sur ses lignes et prépare sa recherche de financement. Le diagnostic cyber reste une priorité non traitée.",
        metrics: [
          { label: "Productivité brute", before: "100%", after: "115%", unit: "", isPositive: true },
          { label: "Déchets de découpe", before: "18%", after: "14%", unit: "%", isPositive: true },
          { label: "Consommation d'énergie", before: "100%", after: "88%", unit: "%", isPositive: true }
        ],
        steps: {
          amorcage: {
            proposed: ["Mise en relation partenaires IA & industrie"],
            realized: [{ serviceName: "Mise en relation partenaires IA & industrie", status: "completed", org: "Pôle Mecatech", resultText: "Partenaire trouvé pour le tri optique", date: "2024-03-15", costEur: 1200, durationDays: 10, benefitScore: 78, resourcesPersonDays: 3 }],
            simulated: []
          },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "Agence du Numérique", resultText: "Maturité numérique de départ évaluée", date: "2024-04-10", costEur: 1500, durationDays: 15, benefitScore: 82, resourcesPersonDays: 5 }],
            simulated: []
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: [],
            simulated: []
          },
          planification: {
            proposed: ["Accompagnement stratégie données territoriales"],
            realized: [],
            simulated: []
          },
          implementation: {
            proposed: ["Accompagnement transformation digitale industrie 4.0"],
            realized: [{ serviceName: "Accompagnement transformation digitale industrie 4.0", status: "active", org: "Wallonie Entreprendre", resultText: "Lignes de montage en cours de digitalisation", date: "2024-05-20", costEur: 12000, durationDays: 60, benefitScore: 90, resourcesPersonDays: 25 }],
            simulated: []
          },
          investissement: {
            proposed: ["Recherche de financement innovation"],
            realized: [],
            simulated: []
          }
        }
      },
      {
        id: "j-2",
        name: "Résilience Cybersécurité",
        provider: "AKT / AdN",
        objective: "Sécurisation de l'infrastructure d'usine connectée",
        effectivenessScore: 25,
        effectivenessStatus: "Insuffisant",
        effectivenessExplanation: "L'audit cybersécurité initial n'a pas été réalisé alors qu'il est indispensable pour protéger les capteurs IoT industriels nouvellement installés.",
        metrics: [
          { label: "Intrusions bloquées", before: "0%", after: "15%", unit: "", isPositive: true },
          { label: "Employés formés", before: "0%", after: "0%", unit: "%", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [], realized: [], simulated: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [],
            simulated: []
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: [],
            simulated: []
          },
          planification: { proposed: [], realized: [], simulated: [] },
          implementation: { proposed: [], realized: [], simulated: [] },
          investissement: { proposed: [], realized: [], simulated: [] }
        }
      }
    ]
  },
  {
    id: "ben-2",
    name: "BioTech Liège Corp",
    size: "Startup (18 emp.)",
    sector: "BioTech",
    location: "Liège",
    strategies: ["S3 (Sciences de la Vie)", "Start+Tremplin IA"],
    digiscore: { score: 45, level: "Intermediate", date: "2024-05-18" },
    demand: "Valider la conformité TRL de notre plateforme de recherche clinique et initier l'analyse d'images médicales par IA.",
    journeys: [
      {
        id: "j-3",
        name: "Recherche & Collaboration S3",
        provider: "SPW EER",
        objective: "Consortiums de recherche clinique et validation TRL",
        effectivenessScore: 78,
        effectivenessStatus: "En bonne voie",
        effectivenessExplanation: "Le consortium d'innovation S3 a été validé et le diagnostic TRL est complet. Reste à lancer l'expérimentation IA avec l'EDIH.",
        metrics: [
          { label: "Brevets R&D déposés", before: 0, after: 1, unit: "", isPositive: true },
          { label: "Chercheurs recrutés", before: 0, after: 3, unit: "", isPositive: true }
        ],
        steps: {
          amorcage: {
            proposed: ["Détection de consortiums innovation S3"],
            realized: [{ serviceName: "Détection de consortiums innovation S3", status: "completed", org: "SPW EER", resultText: "Consortium validé avec l'ULiège", date: "2024-01-20", costEur: 1800, durationDays: 12, benefitScore: 80, resourcesPersonDays: 4 }],
            simulated: []
          },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "AdN", resultText: "Maturité TRL 3 évaluée", date: "2024-02-15", costEur: 1500, durationDays: 15, benefitScore: 82, resourcesPersonDays: 5 }],
            simulated: []
          },
          coaching: { proposed: [], realized: [], simulated: [] },
          planification: { proposed: [], realized: [], simulated: [] },
          implementation: {
            proposed: ["Programme expérimentation IA industrielle"],
            realized: [],
            simulated: []
          },
          investissement: { proposed: [], realized: [], simulated: [] }
        }
      },
      {
        id: "j-4",
        name: "Accompagnement Économique & Export",
        provider: "WE / AWEX",
        objective: "Levée de fonds R&D et développement international",
        effectivenessScore: 95,
        effectivenessStatus: "Succès Majeur",
        effectivenessExplanation: "Aide financière substantielle sécurisée auprès de Wallonie Entreprendre et plan d'expansion export en cours de préparation.",
        metrics: [
          { label: "Budget R&D sécurisé", before: "50k", after: "300k", unit: "€", isPositive: true },
          { label: "Chiffre d'affaires export", before: "0%", after: "+25%", unit: "", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [], realized: [], simulated: [] },
          diagnostic: { proposed: [], realized: [], simulated: [] },
          coaching: {
            proposed: ["Accompagnement export international digital"],
            realized: [{ serviceName: "Accompagnement export international digital", status: "completed", org: "AWEX", resultText: "Stratégie e-commerce mise en place", date: "2024-03-01", costEur: 4500, durationDays: 30, benefitScore: 86, resourcesPersonDays: 10 }],
            simulated: []
          },
          planification: { proposed: [], realized: [], simulated: [] },
          implementation: { proposed: [], realized: [], simulated: [] },
          investissement: {
            proposed: ["Recherche de financement innovation"],
            realized: [{ serviceName: "Recherche de financement innovation", status: "completed", org: "Wallonie Entreprendre", resultText: "Aide WE 450k€ obtenue", date: "2024-04-15", costEur: 2000, durationDays: 20, benefitScore: 95, resourcesPersonDays: 8 }],
            simulated: []
          }
        }
      }
    ]
  },
  {
    id: "ben-3",
    name: "CyberGuard PME",
    size: "TPE (4 emp.)",
    sector: "Retail",
    location: "Charleroi",
    strategies: ["EDIH (Cybersécurité)"],
    digiscore: { score: 85, level: "Advanced", date: "2024-03-22" },
    demand: "Protéger notre point de vente physique et nos canaux e-commerce contre le phishing et les cyberattaques.",
    journeys: [
      {
        id: "j-5",
        name: "Résilience Cybersécurité",
        provider: "AKT / AdN",
        objective: "Audit de vulnérabilité et formation des collaborateurs",
        effectivenessScore: 92,
        effectivenessStatus: "Succès Majeur",
        effectivenessExplanation: "Audit complet cybersécurité effectué et plan d'action résolu. Les employés ont été formés, le risque de rançongiciel a été neutralisé à 100%.",
        metrics: [
          { label: "Intrusions / Failles bloquées", before: "10%", after: "100%", unit: "", isPositive: true },
          { label: "Équipe formée au Phishing", before: "0%", after: "100%", unit: "%", isPositive: true },
          { label: "Indisponibilité IT (jours/an)", before: 4.5, after: 0.1, unit: " j", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [], realized: [], simulated: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "AdN", resultText: "Maturité cyber évaluée", date: "2024-01-10", costEur: 800, durationDays: 5, benefitScore: 85, resourcesPersonDays: 3 }],
            simulated: []
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: [
              { serviceName: "Parcours cybersécurité PME", status: "completed", org: "AKT / AdN", resultText: "Audit de vulnérabilité & pare-feu", date: "2024-02-05", costEur: 2500, durationDays: 20, benefitScore: 92, resourcesPersonDays: 7 },
              { serviceName: "Formation Cyber express", status: "completed", org: "AdN", resultText: "Sensibilisation phishing effectuée", date: "2024-02-20", costEur: 500, durationDays: 2, benefitScore: 95, resourcesPersonDays: 2 }
            ],
            simulated: []
          },
          planification: { proposed: [], realized: [], simulated: [] },
          implementation: { proposed: [], realized: [], simulated: [] },
          investissement: { proposed: [], realized: [], simulated: [] }
        }
      }
    ]
  },
  {
    id: "ben-4",
    name: "EcoWeave S.A.",
    size: "PME (45 emp.)",
    sector: "Textile",
    location: "Mons",
    strategies: ["Économie Circulaire & Climat", "S3 (Industrie 4.0)"],
    digiscore: { score: 72, level: "Advanced", date: "2024-02-15" },
    demand: "Réduire les émissions de CO2 de nos usines textiles et valoriser les déchets de fibres.",
    journeys: [
      {
        id: "j-6",
        name: "Transition Énergétique & Décarbonation",
        provider: "Cluster Tweed",
        objective: "Plan carbone et décarbonation de l'outil industriel",
        effectivenessScore: 95,
        effectivenessStatus: "Succès Majeur",
        effectivenessExplanation: "Transition énergétique remarquable avec réduction majeure des émissions carbones directes (-25%) et économies d'énergies substantielles sur l'outil industriel.",
        metrics: [
          { label: "Émissions de CO2 directes", before: "100%", after: "75%", unit: "", isPositive: true },
          { label: "Économies d'énergie", before: "0 €", after: "18 500 €", unit: "/an", isPositive: true },
          { label: "Matériaux recyclés", before: "5%", after: "40%", unit: "", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [], realized: [], simulated: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "Cluster Tweed", resultText: "Plan de réduction carbone établi", date: "2024-02-28", costEur: 1500, durationDays: 15, benefitScore: 88, resourcesPersonDays: 5 }],
            simulated: []
          },
          coaching: { proposed: [], realized: [], simulated: [] },
          planification: {
            proposed: ["Programme transition énergétique industrielle"],
            realized: [{ serviceName: "Programme transition énergétique industrielle", status: "completed", org: "Cluster Tweed", resultText: "Plan carbone validé par un expert", date: "2024-03-15", costEur: 9000, durationDays: 75, benefitScore: 93, resourcesPersonDays: 20 }],
            simulated: []
          },
          implementation: {
            proposed: ["Accompagnement transformation digitale industrie 4.0"],
            realized: [{ serviceName: "Accompagnement transformation digitale industrie 4.0", status: "completed", org: "Wallonie Entreprendre", resultText: "Optimisation de l'outil industriel", date: "2024-06-01", costEur: 11000, durationDays: 55, benefitScore: 91, resourcesPersonDays: 25 }],
            simulated: []
          },
          investissement: { proposed: [], realized: [], simulated: [] }
        }
      }
    ]
  },
  {
    id: "ben-5",
    name: "SmartCity Namur",
    size: "Régie (12 emp.)",
    sector: "Smart City",
    location: "Namur",
    strategies: ["S3 (IA & Algorithmes)", "Smart Region"],
    digiscore: { score: 28, level: "Beginner", date: "2024-03-01" },
    demand: "Développer notre stratégie OpenData communale et attirer des partenaires d'innovation technologique.",
    journeys: [
      {
        id: "j-7",
        name: "Données Territoriales",
        provider: "Agence du Numérique",
        objective: "Stratégie de données territoriales ouvertes et souveraines",
        effectivenessScore: 52,
        effectivenessStatus: "Mitigé",
        effectivenessExplanation: "La stratégie de données territoriales a été rédigée avec succès, mais le consortium S3 n'a pas pu être mis en place, créant un blocage pour la phase d'amorçage.",
        metrics: [
          { label: "Catalogues OpenData", before: 0, after: 24, unit: "", isPositive: true },
          { label: "Communes partenaires", before: 1, after: 5, unit: "", isPositive: true },
          { label: "Requêtes API citoyennes", before: "0", after: "15k", unit: "/mois", isPositive: true }
        ],
        steps: {
          amorcage: {
            proposed: ["Détection de consortiums innovation S3"],
            realized: [],
            simulated: []
          },
          diagnostic: { proposed: [], realized: [], simulated: [] },
          coaching: { proposed: [], realized: [], simulated: [] },
          planification: {
            proposed: ["Accompagnement stratégie données territoriales"],
            realized: [{ serviceName: "Accompagnement stratégie données territoriales", status: "completed", org: "Agence du Numérique", resultText: "Schéma directeur OpenData approuvé", date: "2024-03-10", costEur: 6000, durationDays: 45, benefitScore: 85, resourcesPersonDays: 15 }],
            simulated: []
          },
          implementation: { proposed: [], realized: [], simulated: [] },
          investissement: { proposed: [], realized: [], simulated: [] }
        }
      }
    ]
  }
];

const calculateEffectiveness = (journey: BeneficiaryJourneyInstance) => {
  let totalProposed = 0;
  let matches = 0;
  let overlaps = 0;
  let gaps = 0;
  
  const phases = ["amorcage", "diagnostic", "coaching", "planification", "implementation", "investissement"] as const;
  
  phases.forEach(phaseId => {
    const step = journey.steps[phaseId];
    if (step.proposed.length > 0) {
      totalProposed += step.proposed.length;
      step.proposed.forEach(propSvc => {
        const found = step.realized.find(r => r.serviceName.toLowerCase() === propSvc.toLowerCase());
        if (found && (found.status === "completed" || found.status === "active")) {
          matches++;
        } else {
          gaps++;
        }
      });
    }
    
    const completedCount = step.realized.filter(r => r.status === "completed").length;
    if (completedCount > 1) {
      overlaps += (completedCount - 1);
    }
  });

  let score = 50;
  if (totalProposed > 0) {
    score = Math.round((matches / totalProposed) * 100);
  } else if (matches > 0) {
    score = 100;
  }
  
  score = Math.max(0, Math.min(100, score - (overlaps * 10)));
  
  let status: EffectivenessType = "Mitigé";
  if (score >= 90) status = "Succès Majeur";
  else if (score >= 70) status = "En bonne voie";
  else if (score >= 40) status = "Mitigé";
  else status = "Insuffisant";

  let explanation = "";
  if (status === "Succès Majeur") {
    explanation = "Excellent alignement ! La PME a suivi l'essentiel du parcours recommandé sans ruptures majeures. Les gains d'impact mesurés confirment le ROI très positif.";
  } else if (status === "En bonne voie") {
    explanation = "Bonne progression générale. La plupart des services recommandés sont complétés ou en cours d'exécution. Quelques gaps mineurs restent à combler.";
  } else if (status === "Mitigé") {
    explanation = "Plusieurs écarts constatés. Des étapes recommandées n'ont pas été réalisées (gaps) ou des services ont été entamés sans planification préalable.";
  } else {
    explanation = "Parcours très fragmenté. Forte dérive par rapport aux recommandations avec plusieurs zones blanches critiques non résolues.";
  }

  return { score, status, explanation };
};

const calculateSimulatedEffectiveness = (steps: BeneficiaryJourneyInstance["steps"]) => {
  let totalProposed = 0;
  let matches = 0;
  let overlaps = 0;
  let gaps = 0;
  
  const phases = ["amorcage", "diagnostic", "coaching", "planification", "implementation", "investissement"] as const;
  
  phases.forEach(phaseId => {
    const step = steps[phaseId];
    if (step.proposed.length > 0) {
      totalProposed += step.proposed.length;
      step.proposed.forEach(propSvc => {
        const foundRealized = step.realized.find(r => r.serviceName.toLowerCase() === propSvc.toLowerCase());
        const foundSimulated = step.simulated?.find(s => s.serviceName.toLowerCase() === propSvc.toLowerCase());
        if ((foundRealized && (foundRealized.status === "completed" || foundRealized.status === "active")) || foundSimulated) {
          matches++;
        } else {
          gaps++;
        }
      });
    }
    
    const completedCount = step.realized.filter(r => r.status === "completed").length;
    const simulatedCount = step.simulated?.length || 0;
    if (completedCount + simulatedCount > 1) {
      overlaps += (completedCount + simulatedCount - 1);
    }
  });

  let score = 50;
  if (totalProposed > 0) {
    score = Math.round((matches / totalProposed) * 100);
  } else if (matches > 0) {
    score = 100;
  }
  
  score = Math.max(0, Math.min(100, score - (overlaps * 10)));
  
  let status: EffectivenessType = "Mitigé";
  if (score >= 90) status = "Succès Majeur";
  else if (score >= 70) status = "En bonne voie";
  else if (score >= 40) status = "Mitigé";
  else status = "Insuffisant";

  let explanation = "";
  if (status === "Succès Majeur") {
    explanation = "Excellent alignement simulé ! Le parcours recommandé est comblé sans ruptures majeures. Les gains d'impact mesurés confirment le ROI très positif.";
  } else if (status === "En bonne voie") {
    explanation = "Bonne progression simulée. La plupart des services recommandés sont complétés, en cours ou simulés. Quelques gaps mineurs restent à combler.";
  } else if (status === "Mitigé") {
    explanation = "Plusieurs écarts subsistent même après simulation. Des étapes recommandées n'ont pas pu être couvertes faute de budget ou de temps.";
  } else {
    explanation = "Parcours très fragmenté. Forte dérive par rapport aux recommandations avec plusieurs zones blanches critiques non résolues.";
  }

  return { score, status, explanation };
};

const runSimulation = (
  journey: BeneficiaryJourneyInstance,
  simBudgetMax: number,
  simDurationMax: number,
  simPriority: "competitiveness" | "jobs" | "resilience" | "carbon" | "sovereignty",
  servicesList: any[]
) => {
  const simulatedSteps: BeneficiaryJourneyInstance["steps"] = JSON.parse(JSON.stringify(journey.steps));
  
  const phases = ["amorcage", "diagnostic", "coaching", "planification", "implementation", "investissement"] as const;
  phases.forEach(p => {
    simulatedSteps[p].simulated = [];
  });
  
  let realizedCost = 0;
  let realizedDuration = 0;
  let realizedPersonDays = 0;
  
  phases.forEach(phaseId => {
    const step = journey.steps[phaseId];
    step.realized.forEach(r => {
      realizedCost += r.costEur || 0;
      realizedDuration += r.durationDays || 0;
      realizedPersonDays += r.resourcesPersonDays || 0;
    });
  });

  const gaps: Array<{ phaseId: typeof phases[number]; proposedName: string }> = [];
  phases.forEach(phaseId => {
    const step = journey.steps[phaseId];
    if (step.proposed.length > 0 && step.realized.length === 0) {
      step.proposed.forEach(propSvc => {
        gaps.push({ phaseId, proposedName: propSvc });
      });
    }
  });

  interface Candidate {
    phaseId: typeof phases[number];
    serviceName: string;
    org: string;
    costEur: number;
    durationDays: number;
    benefitScore: number;
    personDays: number;
    adjustedScore: number;
    impacts: any;
  }
  
  const candidates: Candidate[] = [];
  gaps.forEach(gap => {
    const matchedSvc = servicesList.find(s => s.name.toLowerCase() === gap.proposedName.toLowerCase());
    if (matchedSvc) {
      const costData = serviceCostData[matchedSvc.id] || { minEur: 1000, maxEur: 3000, durationDays: 20, benefitScore: 80, personDays: 5 };
      const avgCost = (costData.minEur + costData.maxEur) / 2;
      const specificImpact = matchedSvc.impacts && matchedSvc.impacts[simPriority] !== undefined ? matchedSvc.impacts[simPriority] : 50;
      const adjustedScore = (costData.benefitScore * 0.4) + (specificImpact * 0.6);
      
      candidates.push({
        phaseId: gap.phaseId,
        serviceName: matchedSvc.name,
        org: matchedSvc.organisationId,
        costEur: avgCost,
        durationDays: costData.durationDays,
        benefitScore: costData.benefitScore,
        personDays: costData.personDays,
        adjustedScore: adjustedScore,
        impacts: matchedSvc.impacts || {}
      });
    }
  });

  candidates.sort((a, b) => {
    const roiA = a.adjustedScore / (a.costEur / 1000 + a.durationDays / 30 + 0.1);
    const roiB = b.adjustedScore / (b.costEur / 1000 + b.durationDays / 30 + 0.1);
    return roiB - roiA;
  });

  let currentCost = realizedCost;
  let currentDuration = realizedDuration;
  let currentPersonDays = realizedPersonDays;
  
  const addedSimulated: SimulatedService[] = [];

  candidates.forEach(cand => {
    if (currentCost + cand.costEur <= simBudgetMax && currentDuration + cand.durationDays <= simDurationMax) {
      const simSvc: SimulatedService = {
        serviceName: cand.serviceName,
        org: cand.org,
        phaseId: cand.phaseId,
        estimatedCostEur: cand.costEur,
        estimatedDurationDays: cand.durationDays,
        estimatedBenefitScore: cand.benefitScore,
        estimatedResourcesPersonDays: cand.personDays,
        rationale: `Recommandé pour combler la phase ${cand.phaseId} car il présente un excellent score d'impact ${simPriority} de ${cand.impacts[simPriority] || 50}% pour un coût et une durée optimaux.`
      };
      
      if (!simulatedSteps[cand.phaseId].simulated) {
        simulatedSteps[cand.phaseId].simulated = [];
      }
      simulatedSteps[cand.phaseId].simulated!.push(simSvc);
      
      currentCost += cand.costEur;
      currentDuration += cand.durationDays;
      currentPersonDays += cand.personDays;
      addedSimulated.push(simSvc);
    }
  });

  return {
    simulatedSteps,
    totalCost: currentCost,
    totalDuration: currentDuration,
    totalPersonDays: currentPersonDays,
    addedSimulated
  };
};

export default function ServicesContainer() {
  const [activeTab, setActiveTab] = useState<"catalogues" | "strategies" | "beneficiaries" | "craft">("catalogues");
  const [catalogueSubTab, setCatalogueSubTab] = useState<"services" | "referentials">("services");
  const [showServiceWizard, setShowServiceWizard] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<"s3" | "circular" | "edih" | "tremplin">("s3");
  const [servicesList, setServicesList] = useState(walloonServices);
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Referentials States
  const [valueChains, setValueChains] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [businessNeeds, setBusinessNeeds] = useState<any[]>([]);
  
  // Referential creation states
  const [refType, setRefType] = useState<"valuechain" | "stage" | "role" | "need">("valuechain");
  const [newRefName, setNewRefName] = useState("");
  const [newRefDesc, setNewRefDesc] = useState("");
  const [newRefUri, setNewRefUri] = useState("");
  const [newNeedVcIds, setNewNeedVcIds] = useState<number[]>([]);
  const [newNeedStageIds, setNewNeedStageIds] = useState<number[]>([]);
  const [newNeedSvcIds, setNewNeedSvcIds] = useState<number[]>([]);

  // Company Form / Modal States
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyFormMode, setCompanyFormMode] = useState<"create" | "edit">("create");

  const [compName, setCompName] = useState("");
  const [compSize, setCompSize] = useState("PME");
  const [compSector, setCompSector] = useState("");
  const [compLocation, setCompLocation] = useState("");
  const [compDemand, setCompDemand] = useState("");
  const [compDigiscore, setCompDigiscore] = useState<number>(30);
  const [compDigiLevel, setCompDigiLevel] = useState("Intermediate");
  const [compVcIds, setCompVcIds] = useState<number[]>([]);
  const [compStageIds, setCompStageIds] = useState<number[]>([]);
  const [compRoleIds, setCompRoleIds] = useState<number[]>([]);
  const [compNeedIds, setCompNeedIds] = useState<number[]>([]);

  // --- NEW: Besoin Builder states ---
  const [needRuleOperator, setNeedRuleOperator] = useState<"AND" | "OR">("AND");
  const [needRuleConditions, setNeedRuleConditions] = useState<Array<{field: string; operator: string; value: string}>>([]);
  const addRuleCondition = () => setNeedRuleConditions(prev => [...prev, { field: "sector", operator: "==", value: "" }]);
  const updateRuleCondition = (idx: number, key: string, value: string) => setNeedRuleConditions(prev => prev.map((c, i) => i === idx ? { ...c, [key]: value } : c));
  const removeRuleCondition = (idx: number) => setNeedRuleConditions(prev => prev.filter((_, i) => i !== idx));

  // --- NEW: Multi-operator collaboration states ---
  const [activeOperator, setActiveOperator] = useState<"AdN" | "WE" | "AWEX" | "UCM">("AdN");
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Array<{id: string; operator: string; action: string; timestamp: string; detail: string}>>([]);

  // --- NEW: Simulation Digiscore boost states ---
  const [simCheckedServices, setSimCheckedServices] = useState<Set<string>>(new Set());
  const toggleSimService = (svcName: string) => setSimCheckedServices(prev => { const next = new Set(prev); next.has(svcName) ? next.delete(svcName) : next.add(svcName); return next; });

  const handleCreateReferential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefName) return;

    let url = "";
    let body: any = { name: newRefName, description: newRefDesc, uri: newRefUri };

    if (refType === "valuechain") {
      url = "/api/value-chains";
    } else if (refType === "stage") {
      url = "/api/stages";
    } else if (refType === "role") {
      url = "/api/roles";
    } else if (refType === "need") {
      url = "/api/business-needs";
      body = {
        ...body,
        valueChainIds: newNeedVcIds,
        valueChainStageIds: newNeedStageIds,
        serviceIds: newNeedSvcIds,
        rule: needRuleConditions.length > 0 ? { operator: needRuleOperator, conditions: needRuleConditions.map(c => ({ ...c, value: isNaN(Number(c.value)) ? c.value : Number(c.value) })) } : null
      };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert("✅ Référentiel créé avec succès !");
        setNewRefName("");
        setNewRefDesc("");
        setNewRefUri("");
        setNewNeedVcIds([]);
        setNewNeedStageIds([]);
        setNewNeedSvcIds([]);
        setRefreshTrigger(prev => prev + 1);
      } else {
        const error = await res.json();
        alert(`❌ Erreur: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur de communication avec le serveur");
    }
  };

  const handleDeleteReferential = async (type: string, id: number) => {
    if (!confirm("❌ Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    let url = "";
    if (type === "valuechain") url = `/api/value-chains/${id}`;
    else if (type === "stage") url = `/api/stages/${id}`;
    else if (type === "role") url = `/api/roles/${id}`;
    else if (type === "need") url = `/api/business-needs/${id}`;

    try {
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditCompany = (company: any) => {
    setCompanyFormMode("edit");
    setCompName(company.name);
    setCompSize(company.size);
    setCompSector(company.sector);
    setCompLocation(company.location);
    setCompDemand(company.demand || "");
    setCompDigiscore(company.digiscore?.score || 30);
    setCompDigiLevel(company.digiscore?.level || "Intermediate");
    
    fetch(`/api/companies/${company.id}`)
      .then(res => res.json())
      .then(data => {
        setCompVcIds(data.belongsToValueChain?.map((x: any) => x.id) || []);
        setCompStageIds(data.participatesInStage?.map((x: any) => x.id) || []);
        setCompRoleIds(data.playsRole?.map((x: any) => x.id) || []);
        setCompNeedIds(data.needs?.map((x: any) => x.id) || []);
        setShowCompanyForm(true);
      });
  };

  const handleOpenCreateCompany = () => {
    setCompanyFormMode("create");
    setCompName("");
    setCompSize("PME");
    setCompSector("");
    setCompLocation("");
    setCompDemand("");
    setCompDigiscore(30);
    setCompDigiLevel("Intermediate");
    setCompVcIds([]);
    setCompStageIds([]);
    setCompRoleIds([]);
    setCompNeedIds([]);
    setShowCompanyForm(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;

    const body = {
      name: compName,
      size: compSize,
      sector: compSector,
      location: compLocation,
      demand: compDemand,
      digiscoreScore: compDigiscore,
      digiscoreLevel: compDigiLevel,
      digiscoreDate: new Date().toISOString(),
      belongsToValueChainIds: compVcIds,
      participatesInStageIds: compStageIds,
      playsRoleIds: compRoleIds,
      needIds: compNeedIds
    };

    const url = companyFormMode === "create" ? "/api/companies" : `/api/companies/${selectedBeneficiaryId}`;
    const method = companyFormMode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert(companyFormMode === "create" ? "✅ Entreprise créée avec succès !" : "✅ Profil mis à jour avec succès !");
        setShowCompanyForm(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        const error = await res.json();
        alert(`❌ Erreur: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur de communication");
    }
  };

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>("ben-1");
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("j-1");
  const [searchQuery, setSearchQuery] = useState("");

  // Journey Catalog States
  const [journeyTemplates, setJourneyTemplates] = useState<any[]>([]);

  // Simulator States
  const [simPhase, setSimPhase] = useState<string>("amorcage");
  const [simService, setSimService] = useState<string>("");
  const [simStatus, setSimStatus] = useState<"completed" | "active">("completed");
  const [simResult, setSimResult] = useState<string>("");
  const [simNewJourneyName, setSimNewJourneyName] = useState<string>("Transformation Numérique (Industrie 4.0)");

  // As-Is / Simulation mode
  const [benefViewMode, setBenefViewMode] = useState<"asis" | "simulation">("asis");
  const [simBudgetMax, setSimBudgetMax] = useState<number>(25000);
  const [simDurationMax, setSimDurationMax] = useState<number>(120);
  const [simPriority, setSimPriority] = useState<"competitiveness" | "jobs" | "resilience" | "carbon" | "sovereignty">("competitiveness");

  useEffect(() => {
    // Automatically pre-populate simulator service selector
    if (servicesList.length > 0 && !simService) {
      setSimService(servicesList[0].name);
    }
  }, [servicesList, simService]);

  useEffect(() => {
    // Ensure active journey selection exists for the active company
    const activeB = beneficiaries.find(b => b.id === selectedBeneficiaryId);
    if (activeB && activeB.journeys.length > 0) {
      const exists = activeB.journeys.some(j => j.id === selectedJourneyId);
      if (!exists) {
        setSelectedJourneyId(activeB.journeys[0].id);
      }
    }
  }, [selectedBeneficiaryId, beneficiaries, selectedJourneyId]);

  // Load audit logs when beneficiary selection changes
  useEffect(() => {
    const b = beneficiaries.find(b => b.id === selectedBeneficiaryId);
    if (b && Array.isArray((b as any).roadmapLogs)) {
      setAuditLogs((b as any).roadmapLogs);
    } else {
      setAuditLogs([]);
    }
  }, [selectedBeneficiaryId, beneficiaries]);

  const handleAddProposed = (phaseId: string, serviceName: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      const updatedJourneys = b.journeys.map(j => {
        if (j.id !== selectedJourneyId) return j;
        
        const phaseKey = phaseId as keyof typeof j.steps;
        const currentProposed = j.steps[phaseKey].proposed;
        if (currentProposed.includes(serviceName)) return j;
        
        const updatedSteps = {
          ...j.steps,
          [phaseKey]: {
            ...j.steps[phaseKey],
            proposed: [...currentProposed, serviceName]
          }
        };
        
        const updatedJourney = { ...j, steps: updatedSteps };
        const { score, status, explanation } = calculateEffectiveness(updatedJourney);
        
        return {
          ...updatedJourney,
          effectivenessScore: score,
          effectivenessStatus: status,
          effectivenessExplanation: explanation
        };
      });

      return { ...b, journeys: updatedJourneys };
    }));
  };

  const handleAddRealized = (phaseId: string, serviceName: string, status: "completed" | "active", resultText: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      const matchedSvc = servicesList.find(s => s.name === serviceName);
      const orgName = matchedSvc ? matchedSvc.organisationId : "Partenaire";
      
      const costData = matchedSvc ? serviceCostData[matchedSvc.id] : null;
      const costEur = costData ? (costData.minEur + costData.maxEur) / 2 : 1000;
      const durationDays = costData ? costData.durationDays : 15;
      const benefitScore = costData ? costData.benefitScore : 80;
      const resourcesPersonDays = costData ? costData.personDays : 5;

      const updatedJourneys = b.journeys.map(j => {
        if (j.id !== selectedJourneyId) return j;
        
        const phaseKey = phaseId as keyof typeof j.steps;
        const currentRealized = j.steps[phaseKey].realized;
        const updatedSteps = {
          ...j.steps,
          [phaseKey]: {
            ...j.steps[phaseKey],
            realized: [
              ...currentRealized,
              { 
                serviceName, 
                status, 
                org: orgName, 
                resultText: resultText || "Réalisation enregistrée",
                costEur,
                durationDays,
                benefitScore,
                resourcesPersonDays,
                date: new Date().toISOString().split('T')[0]
              }
            ]
          }
        };
        
        const updatedJourney = { ...j, steps: updatedSteps };
        const { score, status: effStatus, explanation } = calculateEffectiveness(updatedJourney);
        
        return {
          ...updatedJourney,
          effectivenessScore: score,
          effectivenessStatus: effStatus,
          effectivenessExplanation: explanation
        };
      });

      return { ...b, journeys: updatedJourneys };
    }));
  };

  const handleRemoveProposed = (phaseId: string, serviceName: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      const updatedJourneys = b.journeys.map(j => {
        if (j.id !== selectedJourneyId) return j;
        
        const phaseKey = phaseId as keyof typeof j.steps;
        const updatedSteps = {
          ...j.steps,
          [phaseKey]: {
            ...j.steps[phaseKey],
            proposed: j.steps[phaseKey].proposed.filter(p => p !== serviceName)
          }
        };
        
        const updatedJourney = { ...j, steps: updatedSteps };
        const { score, status, explanation } = calculateEffectiveness(updatedJourney);
        
        return {
          ...updatedJourney,
          effectivenessScore: score,
          effectivenessStatus: status,
          effectivenessExplanation: explanation
        };
      });

      return { ...b, journeys: updatedJourneys };
    }));
  };

  const handleRemoveRealized = (phaseId: string, serviceIndex: number) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      const updatedJourneys = b.journeys.map(j => {
        if (j.id !== selectedJourneyId) return j;
        
        const phaseKey = phaseId as keyof typeof j.steps;
        const updatedSteps = {
          ...j.steps,
          [phaseKey]: {
            ...j.steps[phaseKey],
            realized: j.steps[phaseKey].realized.filter((_, idx) => idx !== serviceIndex)
          }
        };
        
        const updatedJourney = { ...j, steps: updatedSteps };
        const { score, status, explanation } = calculateEffectiveness(updatedJourney);
        
        return {
          ...updatedJourney,
          effectivenessScore: score,
          effectivenessStatus: status,
          effectivenessExplanation: explanation
        };
      });

      return { ...b, journeys: updatedJourneys };
    }));
  };

  const handleEnrollJourney = (journeyTemplateName: string) => {
    const template = journeyTemplates.find(t => t.name === journeyTemplateName);
    if (!template) return;
    
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      const alreadyEnrolled = b.journeys.some(j => j.name === journeyTemplateName);
      if (alreadyEnrolled) {
        alert(`⚠️ Déjà inscrit au parcours: ${journeyTemplateName}`);
        return b;
      }
      
      const newJourneyInstance: BeneficiaryJourneyInstance = {
        id: `j-${Date.now()}`,
        name: template.name,
        provider: template.provider,
        objective: template.objective,
        effectivenessScore: 0,
        effectivenessStatus: "Insuffisant",
        effectivenessExplanation: "Ce parcours vient d'être initié. Réalisez les services recommandés.",
        metrics: [
          { label: "Maturité départ", before: "0%", after: "10%", unit: "", isPositive: true },
          { label: "Avancement R&D", before: "0", after: "0", unit: "", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [...(template.steps?.amorcage || [])], realized: [] },
          diagnostic: { proposed: [...(template.steps?.diagnostic || [])], realized: [] },
          coaching: { proposed: [...(template.steps?.coaching || [])], realized: [] },
          planification: { proposed: [...(template.steps?.planification || [])], realized: [] },
          implementation: { proposed: [...(template.steps?.implementation || [])], realized: [] },
          investissement: { proposed: [...(template.steps?.investissement || [])], realized: [] }
        }
      };
      
      const { score, status, explanation } = calculateEffectiveness(newJourneyInstance);
      newJourneyInstance.effectivenessScore = score;
      newJourneyInstance.effectivenessStatus = status;
      newJourneyInstance.effectivenessExplanation = explanation;
      
      // Auto switch to this new journey
      setSelectedJourneyId(newJourneyInstance.id);
      
      return {
        ...b,
        journeys: [...b.journeys, newJourneyInstance]
      };
    }));
  };

  const handleWithdrawJourney = (journeyId: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      if (b.journeys.length <= 1) {
        alert("⚠️ Un bénéficiaire doit avoir au moins un parcours actif.");
        return b;
      }
      
      const updatedJourneys = b.journeys.filter(j => j.id !== journeyId);
      // Auto fallback selected journey
      if (selectedJourneyId === journeyId) {
        setSelectedJourneyId(updatedJourneys[0].id);
      }
      
      return {
        ...b,
        journeys: updatedJourneys
      };
    }));
  };

  // Load services, referentials, journeys and companies from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const dbServices = await res.json();
          const mappedDbServices = dbServices.map((dbSvc: any) => {
            const matchingRich = walloonServices.find(
              (w) => w.uri === dbSvc.uri || w.name.toLowerCase() === dbSvc.name.toLowerCase()
            );

            if (matchingRich) {
              return {
                ...matchingRich,
                id: String(dbSvc.id),
                name: dbSvc.name,
                organisationId: dbSvc.organization?.name || matchingRich.organisationId,
              };
            }

            const randomVal = dbSvc.id * 13 % 100;
            const generatedTheme = ["IA", "Industrie 4.0", "Cybersécurité", "Innovation", "Énergie"][dbSvc.id % 5] as any;
            return {
              id: String(dbSvc.id),
              name: dbSvc.name,
              organisationId: dbSvc.organization?.name || "Agence du Numérique",
              uri: dbSvc.uri || `https://pit.wallonie.be/id/public-service/${dbSvc.id}`,
              description: dbSvc.description || "Service public d'innovation industrielle encodé via le cockpit territorial.",
              status: "Published",
              themes: [generatedTheme, "Innovation"],
              sectors: ["Manufacturing", "BioTech", "Energie", "Smart City"].slice(0, (dbSvc.id % 2) + 1),
              impacts: {
                carbon: 30 + (randomVal % 65),
                jobs: 40 + (randomVal % 55),
                sovereignty: 60 + (randomVal % 38),
                resilience: 50 + (randomVal % 48),
                competitiveness: 70 + (randomVal % 28)
              },
              kpis: {
                companiesAccompanied: 15 + (dbSvc.id * 8),
                satisfactionRate: 90 + (dbSvc.id % 10)
              },
              dependency: { label: "Aucun prérequis", target: null }
            };
          });

          const combined = [...mappedDbServices];
          walloonServices.forEach((w) => {
            const exists = mappedDbServices.some(
              (d: any) => d.uri === w.uri || d.name.toLowerCase() === w.name.toLowerCase()
            );
            if (!exists) {
              combined.push(w);
            }
          });
          setServicesList(combined);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };

    const fetchMeta = async () => {
      try {
        const res = await fetch("/api/meta");
        if (res.ok) {
          const data = await res.json();
          setValueChains(data.valueChains || []);
          setStages(data.stages || []);
          setRoles(data.roles || []);
          setBusinessNeeds(data.needs || []);
        }
      } catch (err) {
        console.error("Failed to load meta referentials:", err);
      }
    };

    const getServicePhaseName = (svc: any) => {
      const name = (svc.name || "").toLowerCase();
      if (name.includes("financ") || name.includes("subside") || name.includes("invest")) return "investissement";
      if (name.includes("diagnost") || name.includes("evalu") || name.includes("audit")) return "diagnostic";
      if (name.includes("coach") || name.includes("cyber") || name.includes("sensib")) return "coaching";
      if (name.includes("plan") || name.includes("strateg")) return "planification";
      if (name.includes("implem") || name.includes("prototyp") || name.includes("ia") || name.includes("transition")) return "implementation";
      return "amorcage";
    };

    const fetchJourneys = async () => {
      try {
        const res = await fetch("/api/journeys");
        if (res.ok) {
          const dbJourneys = await res.json();
          if (dbJourneys && dbJourneys.length > 0) {
            const mapped = dbJourneys.map((j: any) => {
              const stepsObj: any = {
                amorcage: [],
                diagnostic: [],
                coaching: [],
                planification: [],
                implementation: [],
                investissement: []
              };

              const phaseMap: Record<string, string> = {
                "Amorçage": "amorcage",
                "Diagnostic": "diagnostic",
                "Coaching": "coaching",
                "Planification": "planification",
                "Mise en œuvre": "implementation",
                "Investissement": "investissement"
              };
              (j.stages || []).forEach((stage: any) => {
                const phaseKey = phaseMap[stage.name] || "amorcage";
                (stage.services || []).forEach((svc: any) => {
                  stepsObj[phaseKey].push(svc.name);
                });
              });

              return {
                id: String(j.id),
                name: j.name,
                provider: j.provider,
                objective: j.objective || "",
                businessEvent: "Operating Business",
                euStrategy: "Décennie Numérique",
                localS3: "Industrie 4.0",
                filiere: j.valueChains && j.valueChains[0] ? j.valueChains[0].name : "Industrie Manufacturière",
                valueChainSegment: j.valueChainStages && j.valueChainStages[0] ? j.valueChainStages[0].name : "Production & Industrialisation",
                steps: stepsObj
              };
            });

            setJourneyTemplates(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load journeys:", err);
      }
    };

    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const dbCompanies = await res.json();
          if (dbCompanies && dbCompanies.length > 0) {
            const mapped = dbCompanies.map((c: any) => {
              const journeysMapped = (c.enrolledJourneys || []).map((j: any) => {
                const stepsObj: any = {
                  amorcage: { proposed: [], realized: [], simulated: [] },
                  diagnostic: { proposed: [], realized: [], simulated: [] },
                  coaching: { proposed: [], realized: [], simulated: [] },
                  planification: { proposed: [], realized: [], simulated: [] },
                  implementation: { proposed: [], realized: [], simulated: [] },
                  investissement: { proposed: [], realized: [], simulated: [] }
                };

                (j.steps || []).forEach((step: any) => {
                  const phaseId = getServicePhaseName(step.service || { name: step.name });
                  stepsObj[phaseId].proposed.push(step.name);
                  if (c.digiscoreScore && c.digiscoreScore > 40 && phaseId === "diagnostic") {
                    stepsObj[phaseId].realized.push({
                      serviceName: step.name,
                      status: "completed",
                      org: step.service?.organization?.name || "Agence du Numérique",
                      resultText: "Diagnostic complété",
                      costEur: 1500,
                      durationDays: 15,
                      benefitScore: 85,
                      resourcesPersonDays: 5
                    });
                  }
                });

                const journeyInstance: any = {
                  id: String(j.id),
                  name: j.name,
                  provider: j.provider,
                  objective: j.objective || "Accompagnement",
                  steps: stepsObj,
                  metrics: [
                    { label: "Maturité numérique", before: "20%", after: `${c.digiscoreScore || 45}%`, unit: "", isPositive: true }
                  ]
                };

                const { score, status, explanation } = calculateEffectiveness(journeyInstance);
                journeyInstance.effectivenessScore = score;
                journeyInstance.effectivenessStatus = status;
                journeyInstance.effectivenessExplanation = explanation;

                return journeyInstance;
              });

              const finalJourneys = journeysMapped.length > 0 ? journeysMapped : [
                {
                  id: "j-mock-1",
                  name: "Transformation Numérique (Industrie 4.0)",
                  provider: "AdN / WE",
                  objective: "Lignes de production connectées",
                  effectivenessScore: 70,
                  effectivenessStatus: "En bonne voie",
                  effectivenessExplanation: "Diagnostic réalisé. En attente d'implémentation.",
                  metrics: [{ label: "Productivité", before: "100%", after: "110%", unit: "", isPositive: true }],
                  steps: {
                    amorcage: { proposed: ["Mise en relation partenaires IA & industrie"], realized: [], simulated: [] },
                    diagnostic: { proposed: ["Diagnostic de maturité numérique PME"], realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "Agence du Numérique", resultText: "Maturité initiale évaluée", costEur: 1500, durationDays: 15, benefitScore: 82, resourcesPersonDays: 5 }], simulated: [] },
                    coaching: { proposed: [], realized: [], simulated: [] },
                    planification: { proposed: [], realized: [], simulated: [] },
                    implementation: { proposed: ["Accompagnement transformation digitale industrie 4.0"], realized: [], simulated: [] },
                    investissement: { proposed: [], realized: [], simulated: [] }
                  }
                }
              ];

              return {
                id: String(c.id),
                name: c.name,
                size: c.size,
                sector: c.sector,
                location: c.location,
                demand: c.demand || "Aucune demande spécifique",
                strategies: (c.needs || []).map((n: any) => n.name),
                digiscore: {
                  score: c.digiscoreScore || 30,
                  level: c.digiscoreLevel || "Intermediate",
                  date: c.digiscoreDate ? new Date(c.digiscoreDate).toISOString().split('T')[0] : "2026-06-01"
                },
                journeys: finalJourneys
              };
            });
            setBeneficiaries(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      }
    };

    fetchServices();
    fetchMeta();
    fetchJourneys();
    fetchCompanies();
  }, [refreshTrigger]);

  // Filter logic
  const filteredServices = selectedTheme === "All"
    ? servicesList
    : servicesList.filter(s => s.themes.includes(selectedTheme as any));

  // Calculating aggregate statistics
  const totalAccompanied = servicesList.reduce((sum, s) => sum + s.kpis.companiesAccompanied, 0);
  const avgSatisfaction = servicesList.length ? Math.round(servicesList.reduce((sum, s) => sum + s.kpis.satisfactionRate, 0) / servicesList.length) : 0;
  const avgSovereignty = servicesList.length ? Math.round(servicesList.reduce((sum, s) => sum + s.impacts.sovereignty, 0) / servicesList.length) : 0;

  const handleEnrollJourneyTemplate = (templateId: string) => {
    const template = journeyTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    setBeneficiaries(prev => prev.map(b => {
      if (b.id !== selectedBeneficiaryId) return b;
      
      if (b.journeys.some(j => j.name === template.name)) {
        alert(`⚠️ L'entreprise ${b.name} est déjà inscrite au parcours "${template.name}".`);
        return b;
      }
      
      const newJourneyInstance: BeneficiaryJourneyInstance = {
        id: `j-${Date.now()}`,
        name: template.name,
        provider: template.provider,
        objective: template.objective,
        effectivenessScore: 0,
        effectivenessStatus: "Mitigé",
        effectivenessExplanation: "Nouveau parcours inscrit. En attente de réalisations.",
        metrics: [
          { label: "Progrès S3", before: "0%", after: "10%", unit: "", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: template.steps.amorcage, realized: [], simulated: [] },
          diagnostic: { proposed: template.steps.diagnostic, realized: [], simulated: [] },
          coaching: { proposed: template.steps.coaching, realized: [], simulated: [] },
          planification: { proposed: template.steps.planification, realized: [], simulated: [] },
          implementation: { proposed: template.steps.implementation, realized: [], simulated: [] },
          investissement: { proposed: template.steps.investissement, realized: [], simulated: [] }
        }
      };
      
      const { score, status, explanation } = calculateEffectiveness(newJourneyInstance);
      newJourneyInstance.effectivenessScore = score;
      newJourneyInstance.effectivenessStatus = status;
      newJourneyInstance.effectivenessExplanation = explanation;
      
      setSelectedJourneyId(newJourneyInstance.id);
      
      return {
        ...b,
        journeys: [...b.journeys, newJourneyInstance]
      };
    }));
  };

  const renderServicesCatalogue = () => {
    if (showServiceWizard) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Nouvel Encodage de Service</h3>
              <p className="text-xs text-gray-550 dark:text-gray-400 mt-0.5">Saisissez les informations requises dans le formulaire d'encodage.</p>
            </div>
            <button
              onClick={() => setShowServiceWizard(false)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-655 text-gray-705 dark:text-zinc-300 text-xs font-semibold rounded-lg transition border-0 cursor-pointer"
            >
              Retour au catalogue
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-6 shadow-sm">
            <Wizard onSuccess={() => {
              setShowServiceWizard(false);
              setRefreshTrigger(prev => prev + 1);
            }} />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Key KPI Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Services Encodés</span>
              <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{servicesList.length}</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-650">
              <Database className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Accompagnements</span>
              <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{totalAccompanied} PME</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Souveraineté Moyenne</span>
              <h4 className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{avgSovereignty}%</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Satisfaction PME</span>
              <h4 className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">{avgSatisfaction}%</h4>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filtering row */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400">Filtrer par Thème :</span>
            {["All", "IA", "Industrie 4.0", "Cybersécurité", "Innovation", "Énergie"].map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer",
                  selectedTheme === theme
                    ? "bg-teal-700 border-teal-700 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                )}
              >
                {theme}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowServiceWizard(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel Encodage de Service
          </button>
        </div>

        {/* Airtable-like data table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 font-bold uppercase text-gray-400">
                  <th className="px-6 py-4">Nom du service</th>
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Thématiques</th>
                  <th className="px-6 py-4">Secteurs Cibles</th>
                  <th className="px-6 py-4">Impact Carbone</th>
                  <th className="px-6 py-4">Satisfaction</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredServices.map((svc: any) => (
                  <tr
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className="hover:bg-teal-50/35 dark:hover:bg-teal-950/15 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 max-w-[200px]">
                      <div className="hover:text-primary transition-colors">{svc.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal truncate mt-0.5">{svc.uri}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{svc.organisationId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {svc.themes.map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 font-semibold text-[9px] border border-teal-100 dark:border-teal-900">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {svc.sectors.join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${svc.impacts.carbon}%` }} />
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">{svc.impacts.carbon}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">
                      {svc.kpis.satisfactionRate}%
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                        {svc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReferentials = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-fuchsia-650 flex items-center gap-1.5">
              <Database className="w-5 h-5 text-fuchsia-500 animate-pulse" />
              <span>Gestion des Référentiels Sémantiques</span>
            </h3>
            <p className="text-xs text-gray-550 dark:text-gray-400">
              Gérez les taxonomies territoriales (filières, maillons, rôles) et les besoins métiers transversaux reliant les entreprises aux services publics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-150 dark:border-gray-850 shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2">Taxonomies</span>
            {([
              { id: "valuechain", label: "Filières Économiques", desc: "Secteurs d'activité (S3)" },
              { id: "stage", label: "Maillons Industriels", desc: "Chaîne de valeur" },
              { id: "role", label: "Rôles Écosystème", desc: "Acteurs de la PIT" },
              { id: "need", label: "Besoins Métier", desc: "Besoins d'innovation" }
            ] as const).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRefType(r.id);
                  setNewRefName("");
                  setNewRefDesc("");
                  setNewRefUri("");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition text-xs flex flex-col cursor-pointer border-0 bg-transparent",
                  refType === r.id
                    ? "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 font-bold border-l-2 border-fuchsia-500"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                )}
              >
                <span>{r.label}</span>
                <span className="text-[9px] font-normal opacity-75 mt-0.5">{r.desc}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                Ajouter un élément
              </h4>
              <form onSubmit={handleCreateReferential} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom / Libellé *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Agroalimentaire"
                    value={newRefName}
                    onChange={(e) => setNewRefName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    placeholder="Description sémantique..."
                    value={newRefDesc}
                    onChange={(e) => setNewRefDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">URI Sémantique (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="ex: https://pit.wallonie.be/id/value-chain/agro"
                    value={newRefUri}
                    onChange={(e) => setNewRefUri(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                  />
                </div>

                {refType === "need" && (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Liaisons Sémantiques</span>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Filières concernées</label>
                      <select
                        multiple
                        value={newNeedVcIds.map(String)}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                          setNewNeedVcIds(values);
                        }}
                        className="w-full h-20 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                      >
                        {valueChains.map((vc) => (
                          <option key={vc.id} value={vc.id}>{vc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Maillons concernés</label>
                      <select
                        multiple
                        value={newNeedStageIds.map(String)}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                          setNewNeedStageIds(values);
                        }}
                        className="w-full h-20 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                      >
                        {stages.map((st) => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Services associés</label>
                      <select
                        multiple
                        value={newNeedSvcIds.map(String)}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                          setNewNeedSvcIds(values);
                        }}
                        className="w-full h-20 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                      >
                        {servicesList.map((svc) => (
                          <option key={svc.id} value={svc.id}>{svc.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* ✨ BESOIN BUILDER — Règles logiques dynamiques */}
                    <div className="space-y-3 pt-3 border-t border-fuchsia-100 dark:border-fuchsia-900/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Besoin Builder — Règles d&apos;Attribution Dynamiques
                        </span>
                        <button type="button" onClick={addRuleCondition}
                          className="text-[9px] font-bold text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-200 dark:border-fuchsia-800 px-2 py-0.5 rounded-full hover:bg-fuchsia-100 transition cursor-pointer">
                          + Ajouter une condition
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-400 leading-snug">Ce besoin sera suggéré automatiquement si l&apos;entreprise satisfait les conditions ci-dessous.</p>

                      {/* Operator toggle */}
                      {needRuleConditions.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 font-bold uppercase">Opérateur logique :</span>
                          {(["AND", "OR"] as const).map(op => (
                            <button key={op} type="button" onClick={() => setNeedRuleOperator(op)}
                              className={cn("text-[9px] font-black px-2.5 py-0.5 rounded-full border transition cursor-pointer",
                                needRuleOperator === op
                                  ? "bg-fuchsia-600 text-white border-fuchsia-600"
                                  : "bg-transparent text-fuchsia-600 border-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20")}>
                              {op}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Condition rows */}
                      <div className="space-y-1.5">
                        {needRuleConditions.map((cond, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <select value={cond.field} onChange={e => updateRuleCondition(idx, "field", e.target.value)}
                              className="flex-1 px-2 py-1 text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-100 outline-none">
                              <option value="sector">Secteur</option>
                              <option value="size">Taille</option>
                              <option value="location">Localisation</option>
                              <option value="digiscoreScore">Digiscore</option>
                            </select>
                            <select value={cond.operator} onChange={e => updateRuleCondition(idx, "operator", e.target.value)}
                              className="w-14 px-1 py-1 text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-100 outline-none">
                              <option value="==">==</option>
                              <option value="!=">!=</option>
                              <option value="<">&lt;</option>
                              <option value=">">&gt;</option>
                              <option value="<=">&lt;=</option>
                              <option value=">=">&gt;=</option>
                            </select>
                            <input type="text" placeholder="valeur" value={cond.value} onChange={e => updateRuleCondition(idx, "value", e.target.value)}
                              className="flex-1 px-2 py-1 text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-100 outline-none" />
                            <button type="button" onClick={() => removeRuleCondition(idx)}
                              className="p-0.5 text-rose-400 hover:text-rose-600 cursor-pointer border-0 bg-transparent">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {needRuleConditions.length === 0 && (
                          <p className="text-[9px] text-gray-300 dark:text-gray-600 italic">
                            Aucune règle — le besoin sera appliqué uniquement par croisement filière × maillon.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-xs font-bold transition border-0 cursor-pointer shadow-sm"
                >
                  Ajouter au Référentiel
                </button>
              </form>
            </div>

            <div className="md:col-span-7 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                Éléments Actuels
              </h4>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {refType === "valuechain" && valueChains.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-150 dark:border-gray-850">
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-250 block">{item.name}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5 truncate">{item.uri}</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-405 mt-1">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReferential("valuechain", item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer border-0 bg-transparent shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {refType === "stage" && stages.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-150 dark:border-gray-850">
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-250 block">{item.name}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5 truncate">{item.uri}</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-405 mt-1">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReferential("stage", item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer border-0 bg-transparent shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {refType === "role" && roles.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-150 dark:border-gray-850">
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-250 block">{item.name}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5 truncate">{item.uri}</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-405 mt-1">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReferential("role", item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer border-0 bg-transparent shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {refType === "need" && businessNeeds.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-150 dark:border-gray-850">
                    <div className="min-w-0 flex-1 pr-3 space-y-2">
                      <div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-250 block">{item.name}</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5 truncate">{item.uri}</span>
                        <p className="text-[10px] text-gray-500 dark:text-gray-405 mt-1">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                        {item.valueChains?.map((vc: any) => (
                          <span key={vc.id} className="bg-purple-100/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 text-purple-700 dark:text-purple-400 text-[8px] font-bold px-1.5 py-0.2 rounded">
                            {vc.name}
                          </span>
                        ))}
                        {item.valueChainStages?.map((st: any) => (
                          <span key={st.id} className="bg-teal-100/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 text-teal-700 dark:text-teal-400 text-[8px] font-bold px-1.5 py-0.2 rounded">
                            {st.name}
                          </span>
                        ))}
                        {item.services?.map((s: any) => (
                          <span key={s.id} className="bg-blue-100/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 text-[8px] font-bold px-1.5 py-0.2 rounded">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReferential("need", item.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer border-0 bg-transparent shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header premium type Linear/Notion */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-gray-100 dark:border-gray-800 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">
            Backoffice Territorial
          </span>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-1">
            <Layers className="text-primary-500 w-6 h-6 animate-pulse" />
            PIT Wallonie • Cockpit Sémantique CPSV-AP
          </h1>
          <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
            Visualisez, concevez et intégrez les relations sémantiques des services d'innovation industrielle.
          </p>
        </div>

        {/* Triple Tab switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
          <button
            onClick={() => {
              setActiveTab("catalogues");
              setShowServiceWizard(false);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 bg-transparent",
              activeTab === "catalogues"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Database className="w-3.5 h-3.5" />
            Catalogues
          </button>

          <button
            onClick={() => setActiveTab("strategies")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 bg-transparent",
              activeTab === "strategies"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Stratégies Territoriales
          </button>

          <button
            onClick={() => setActiveTab("beneficiaries")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 bg-transparent",
              activeTab === "beneficiaries"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Suivi Bénéficiaires
          </button>

          <button
            onClick={() => setActiveTab("craft")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 bg-transparent",
              activeTab === "craft"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            Écosystème & Observatoire
          </button>
        </div>
      </div>

      {/* 1. CATALOGUES VIEW */}
      {activeTab === "catalogues" && (
        <div className="space-y-4">
          <div className="flex border-b border-gray-150 dark:border-gray-800 pb-3 gap-6 mb-4">
            <button
              onClick={() => {
                setCatalogueSubTab("services");
                setShowServiceWizard(false);
              }}
              className={cn(
                "pb-2 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer border-0 bg-transparent",
                catalogueSubTab === "services" && !showServiceWizard
                  ? "border-fuchsia-500 text-gray-900 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              Catalogue des Services
            </button>

            <button
              onClick={() => {
                setCatalogueSubTab("referentials");
                setShowServiceWizard(false);
              }}
              className={cn(
                "pb-2 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer border-0 bg-transparent",
                catalogueSubTab === "referentials"
                  ? "border-fuchsia-500 text-gray-900 dark:text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              Référentiels Sémantiques
            </button>
          </div>

          {catalogueSubTab === "services" && renderServicesCatalogue()}
          {catalogueSubTab === "referentials" && renderReferentials()}
        </div>
      )}

      {/* 2. STRATÉGIES TERRITORIALES VIEW */}
      {activeTab === "strategies" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Strategy sub-tab selector */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner max-w-2xl">
            {([
              { id: "s3", label: "S3 (Spécialisation)" },
              { id: "circular", label: "Économie Circulaire" },
              { id: "edih", label: "EDIH" },
              { id: "tremplin", label: "Start+Tremplin IA" }
            ] as const).map((strat) => (
              <button
                key={strat.id}
                onClick={() => setSelectedStrategy(strat.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition duration-200 cursor-pointer border-0 bg-transparent",
                  selectedStrategy === strat.id
                    ? "bg-white dark:bg-gray-700 text-teal-650 dark:text-teal-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-905"
                )}
              >
                {strat.label}
              </button>
            ))}
          </div>

          {/* Strategy Info Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm">
            <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
              {selectedStrategy === "s3" && "Stratégie de Spécialisation Intelligente (S3)"}
              {selectedStrategy === "circular" && "Économie Circulaire & Transition Énergétique"}
              {selectedStrategy === "edih" && "EDIH Wallonia (Cybersécurité & IA)"}
              {selectedStrategy === "tremplin" && "Start+Tremplin IA (Amorçage & Coaching)"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedStrategy === "s3" && "Focus sur l'Industrie 4.0, les Technologies du Futur et la souveraineté industrielle de la Région Wallonne."}
              {selectedStrategy === "circular" && "Accompagner la décarbonation, l'optimisation des flux de matières et d'énergies pour les PME régionales."}
              {selectedStrategy === "edih" && "Hub européen d'innovation numérique pour sensibiliser et auditer la maturité IA et Cybersécurité."}
              {selectedStrategy === "tremplin" && "Coaching intensif et programmes d'amorçage pour intégrer l'intelligence artificielle dans les processus."}
            </p>
          </div>

          {/* Strategy KPIs */}
          {(() => {
            const strategyBenefs = beneficiaries.filter(b => {
              if (selectedStrategy === "s3") return b.strategies.some(s => s.startsWith("S3"));
              if (selectedStrategy === "circular") return b.strategies.some(s => s.includes("Circulaire") || s.includes("Climate") || s.includes("Circular"));
              if (selectedStrategy === "edih") return b.strategies.some(s => s.startsWith("EDIH"));
              if (selectedStrategy === "tremplin") return b.strategies.some(s => s.includes("Tremplin"));
              return true;
            });

            const totalAllocated = strategyBenefs.reduce((sum, b) => {
              let bSum = 0;
              b.journeys.forEach(j => {
                Object.values(j.steps).forEach(s => {
                  s.realized.forEach(r => { bSum += r.costEur || 0; });
                });
              });
              return sum + bSum;
            }, 0);

            const activeSvcCount = servicesList.filter(s => {
              if (selectedStrategy === "s3") return s.themes.includes("Industrie 4.0") || s.themes.includes("Innovation") || s.themes.includes("Smart Region");
              if (selectedStrategy === "circular") return s.themes.includes("Énergie") || s.themes.includes("Circularité");
              if (selectedStrategy === "edih") return s.themes.includes("Cybersécurité") || s.themes.includes("IA");
              if (selectedStrategy === "tremplin") return s.themes.includes("IA") || s.themes.includes("Innovation");
              return true;
            }).length;

            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Entreprises Engagées</span>
                    <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{strategyBenefs.length} PME</h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Budget Total Mobilisé</span>
                    <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{totalAllocated.toLocaleString()} €</h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Database className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Services Associés</span>
                    <h4 className="text-xl font-black text-teal-600 mt-1">{activeSvcCount} dispositifs</h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Impact Moyen Atteint</span>
                    <h4 className="text-xl font-black text-purple-600 mt-1">
                      {strategyBenefs.length ? (strategyBenefs.reduce((sum, b) => sum + (b.journeys[0]?.effectivenessScore || 0), 0) / strategyBenefs.length).toFixed(0) : 0}%
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Radar & Heatmap Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SVG Aggregated Impact Radar (filtered dynamically) */}
            {(() => {
              const strategyServices = servicesList.filter(s => {
                if (selectedStrategy === "s3") return s.themes.includes("Industrie 4.0") || s.themes.includes("Innovation") || s.themes.includes("Smart Region");
                if (selectedStrategy === "circular") return s.themes.includes("Énergie") || s.themes.includes("Circularité");
                if (selectedStrategy === "edih") return s.themes.includes("Cybersécurité") || s.themes.includes("IA");
                if (selectedStrategy === "tremplin") return s.themes.includes("IA") || s.themes.includes("Innovation");
                return true;
              });

              const avgCarbon = strategyServices.length ? Math.round(strategyServices.reduce((sum, s) => sum + s.impacts.carbon, 0) / strategyServices.length) : 0;
              const avgSovereignty = strategyServices.length ? Math.round(strategyServices.reduce((sum, s) => sum + s.impacts.sovereignty, 0) / strategyServices.length) : 0;
              const avgResilience = strategyServices.length ? Math.round(strategyServices.reduce((sum, s) => sum + s.impacts.resilience, 0) / strategyServices.length) : 0;
              const avgCompetitiveness = strategyServices.length ? Math.round(strategyServices.reduce((sum, s) => sum + s.impacts.competitiveness, 0) / strategyServices.length) : 0;
              const avgJobs = strategyServices.length ? Math.round(strategyServices.reduce((sum, s) => sum + s.impacts.jobs, 0) / strategyServices.length) : 0;

              const getRadarPoint = (val: number, i: number) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const r = 90 * (val / 100);
                const x = 120 + r * Math.cos(angle);
                const y = 120 + r * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              };

              const points = `${getRadarPoint(avgCarbon, 0)} ${getRadarPoint(avgSovereignty, 1)} ${getRadarPoint(avgResilience, 2)} ${getRadarPoint(avgCompetitiveness, 3)} ${getRadarPoint(avgJobs, 4)}`;

              const pCarbon = getRadarPoint(avgCarbon, 0).split(",");
              const pSovereignty = getRadarPoint(avgSovereignty, 1).split(",");
              const pResilience = getRadarPoint(avgResilience, 2).split(",");
              const pCompetitiveness = getRadarPoint(avgCompetitiveness, 3).split(",");
              const pJobs = getRadarPoint(avgJobs, 4).split(",");

              return (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-primary-500">
                      Radar de Contribution Stratégique
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Moyenne des contributions des services associés à cette stratégie territoriale.
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <svg width="240" height="240" className="overflow-visible">
                      <circle cx="120" cy="120" r="90" className="stroke-gray-200 dark:stroke-gray-700 fill-none" strokeWidth="1" />
                      <circle cx="120" cy="120" r="60" className="stroke-gray-200 dark:stroke-gray-850 fill-none" strokeWidth="1" strokeDasharray="3" />
                      <circle cx="120" cy="120" r="30" className="stroke-gray-200 dark:stroke-gray-850 fill-none" strokeWidth="1" strokeDasharray="3" />

                      {Array.from({ length: 5 }).map((_, i) => {
                        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                        const x = 120 + 90 * Math.cos(angle);
                        const y = 120 + 90 * Math.sin(angle);
                        return (
                          <line key={i} x1="120" y1="120" x2={x} y2={y} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="1" />
                        );
                      })}

                      <polygon
                        points={points}
                        fill="rgba(15, 118, 110, 0.15)"
                        stroke="#0f766e"
                        strokeWidth="2.5"
                      />

                      <circle cx={pCarbon[0]} cy={pCarbon[1]} r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                      <circle cx={pSovereignty[0]} cy={pSovereignty[1]} r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                      <circle cx={pResilience[0]} cy={pResilience[1]} r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                      <circle cx={pCompetitiveness[0]} cy={pCompetitiveness[1]} r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                      <circle cx={pJobs[0]} cy={pJobs[1]} r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />

                      <text x="120" y="20" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Carbone ({avgCarbon}%)</text>
                      <text x="215" y="100" textAnchor="start" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Souveraineté ({avgSovereignty}%)</text>
                      <text x="195" y="195" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Résilience ({avgResilience}%)</text>
                      <text x="45" y="195" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Compétitivité ({avgCompetitiveness}%)</text>
                      <text x="25" y="100" textAnchor="end" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Emploi ({avgJobs}%)</text>
                    </svg>
                  </div>
                </div>
              );
            })()}

            {/* Alignement Thématique S3 Matrix */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-green-500">
                  Alignement Thématique (Heatmap)
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cartographie des services actifs vis-à-vis des axes prioritaires régionaux.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { theme: "IA & Algorithmes", services: ["svc-1", "svc-3", "svc-9"], color: "bg-teal-500" },
                  { theme: "Industrie 4.0 & IoT", services: ["svc-2", "svc-3", "svc-9"], color: "bg-blue-500" },
                  { theme: "Cybersécurité", services: ["svc-5", "svc-6"], color: "bg-red-500" },
                  { theme: "Transition Énergétique", services: ["svc-7"], color: "bg-green-500" },
                  { theme: "Recherche & Consortium S3", services: ["svc-4", "svc-8", "svc-10"], color: "bg-purple-500" },
                ].map((row, idx) => {
                  const isHighlighted = 
                    (selectedStrategy === "s3" && (row.theme.includes("Industrie") || row.theme.includes("Consortium"))) ||
                    (selectedStrategy === "circular" && row.theme.includes("Énergétique")) ||
                    (selectedStrategy === "edih" && (row.theme.includes("Cybersécurité") || row.theme.includes("IA"))) ||
                    (selectedStrategy === "tremplin" && row.theme.includes("IA"));

                  return (
                    <div key={idx} className={cn("flex items-center gap-3 p-1 rounded-lg transition-colors border border-transparent", isHighlighted && "bg-teal-500/5 dark:bg-teal-950/15 border-teal-500/20")}>
                      <span className="w-32 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 truncate">{row.theme}</span>
                      <div className="flex-1 flex gap-1 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-lg border border-gray-100 dark:border-gray-800/80">
                        {servicesList.map((s) => {
                          const active = row.services.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              title={`${s.name} - ${active ? "Actif" : "Non concerné"}`}
                              className={cn(
                                "flex-1 h-6 rounded-md transition duration-300 flex items-center justify-center text-[9px] font-bold cursor-pointer",
                                active
                                  ? cn(row.color, "text-white shadow-sm")
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-705"
                              )}
                            >
                              {s.id.replace("svc-", "")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between text-[8px] text-gray-400 pt-1 font-bold">
                  <span>Services : 1 à 10</span>
                  <span>Survolez pour identifier le service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Gaps & Doublons Graph */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-blue-500 flex items-center gap-2">
                <Layers className="w-4 h-4 animate-pulse" />
                Analyse du Parcours Territorial : Gaps & Doublons
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Visualisation de la couverture des 6 phases pour la stratégie sélectionnée. Les services affichés sont filtrés par pertinence thématique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-2">
              {[
                { id: "amorcage", label: "1. Amorçage", description: "Sensibilisation et mise en relation" },
                { id: "diagnostic", label: "2. Diagnostic", description: "Évaluation de maturité" },
                { id: "coaching", label: "3. Coaching", description: "Conseil court & cybersécurité" },
                { id: "planification", label: "4. Planification", description: "Roadmap & stratégie" },
                { id: "implementation", label: "5. Mise en œuvre", description: "Accompagnement & prototype" },
                { id: "investissement", label: "6. Investissement", description: "Subsides & capital" },
              ].map((phase) => {
                const getServicePhase = (svc: any) => {
                  const idNum = String(svc.id).replace("svc-", "");
                  if (idNum === "8" || idNum === "9") return "amorcage";
                  if (idNum === "1") return "diagnostic";
                  if (idNum === "6" || idNum === "5") return "coaching";
                  if (idNum === "10") return "planification";
                  if (idNum === "2" || idNum === "3" || idNum === "7") return "implementation";
                  if (idNum === "4") return "investissement";
                  
                  const name = (svc.name || "").toLowerCase();
                  if (name.includes("financ") || name.includes("subside") || name.includes("invest")) return "investissement";
                  if (name.includes("diagnost") || name.includes("evalu") || name.includes("audit")) return "diagnostic";
                  if (name.includes("coach") || name.includes("cyber") || name.includes("sensib")) return "coaching";
                  if (name.includes("plan") || name.includes("strateg")) return "planification";
                  if (name.includes("implem") || name.includes("prototyp") || name.includes("ia") || name.includes("transition")) return "implementation";
                  return "amorcage";
                };

                const strategyServices = servicesList.filter(s => {
                  if (selectedStrategy === "s3") return s.themes.includes("Industrie 4.0") || s.themes.includes("Innovation") || s.themes.includes("Smart Region");
                  if (selectedStrategy === "circular") return s.themes.includes("Énergie") || s.themes.includes("Circularité");
                  if (selectedStrategy === "edih") return s.themes.includes("Cybersécurité") || s.themes.includes("IA");
                  if (selectedStrategy === "tremplin") return s.themes.includes("IA") || s.themes.includes("Innovation");
                  return true;
                });

                const phaseServices = strategyServices.filter((s: any) => getServicePhase(s) === phase.id);
                const hasServices = phaseServices.length > 0;
                const isOverlap = phaseServices.length > 1;

                return (
                  <div 
                    key={phase.id} 
                    className={cn(
                      "p-3 rounded-xl border flex flex-col h-full justify-between transition-all duration-300",
                      isOverlap 
                        ? "bg-amber-500/5 border-amber-500/20 dark:bg-amber-950/10" 
                        : hasServices 
                          ? "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800" 
                          : "bg-red-500/5 border-red-500/20 dark:bg-red-950/10"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                          {phase.label}
                        </span>
                        {isOverlap && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Doublons ({phaseServices.length})
                          </span>
                        )}
                        {!hasServices && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            Vide
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">{phase.description}</p>
                    </div>

                    <div className="space-y-2 mt-4 flex-1">
                      {hasServices ? (
                        phaseServices.map((svc: any) => (
                          <div 
                            key={svc.id} 
                            onClick={() => setSelectedService(svc)}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow transition duration-200 cursor-pointer text-left"
                          >
                            <h4 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                              {svc.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1.5">
                              <span className="text-[8px] text-gray-400 font-medium truncate max-w-[80px]">
                                {svc.organisationId}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[7px] font-bold border border-primary/20">
                                {svc.themes && svc.themes[0] ? svc.themes[0] : "S3"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-red-200/50 dark:border-red-900/30 rounded-lg h-full">
                          <ShieldAlert className="w-5 h-5 text-red-500/60 mb-1" />
                          <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider">Zone Blanche</span>
                          <span className="text-[8px] text-gray-400 mt-0.5">Rupture de parcours</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}



      {/* 4. BENEFICIARIES VIEW */}
      {activeTab === "beneficiaries" && (() => {
        const getPhaseDiagnostic = (phaseId: string, step: any) => {
          const hasProposed = step.proposed.length > 0;
          const completed = step.realized.filter((r: any) => r.status === "completed");
          const active = step.realized.filter((r: any) => r.status === "active");
          const hasRealized = completed.length > 0 || active.length > 0;

          if (!hasProposed && !hasRealized) {
            return {
              status: "neutral",
              label: "Non concerné",
              bg: "bg-gray-150 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800",
              desc: "Cette étape n'a pas été recommandée pour cette entreprise."
            };
          }
          if (hasProposed && !hasRealized) {
            return {
              status: "gap",
              label: "Rupture (Gap)",
              bg: "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20",
              desc: "Étape recommandée mais non entamée (zone blanche)."
            };
          }
          if (!hasProposed && hasRealized) {
            return {
              status: "opportunity",
              label: "Hors-parcours",
              bg: "bg-blue-500/10 text-blue-600 dark:text-blue-450 border-blue-500/20",
              desc: "Service réalisé de manière autonome."
            };
          }
          if (step.realized.filter((r: any) => r.status === "completed").length > 1) {
            return {
              status: "overlap",
              label: "Doublon",
              bg: "bg-amber-500/10 text-amber-600 dark:text-amber-455 border-amber-500/20",
              desc: "Plusieurs services suivis pour un même objectif."
            };
          }
          return {
            status: "match",
            label: "Aligné",
            bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border-emerald-500/20",
            desc: "Le parcours recommandé a été respecté avec succès."
          };
        };

        const b = beneficiaries.find(x => x.id === selectedBeneficiaryId) || beneficiaries[0];
        const selectedJourney = b.journeys.find(j => j.id === selectedJourneyId) || b.journeys[0];

        // 1. Calculate As-Is (Realized) metrics
        let realCost = 0;
        let realDuration = 0;
        let realPersonDays = 0;
        let realActiveCount = 0;
        let realCompletedCount = 0;
        const phasesList = ["amorcage", "diagnostic", "coaching", "planification", "implementation", "investissement"] as const;
        
        phasesList.forEach(phaseId => {
          const step = selectedJourney.steps[phaseId];
          step.realized.forEach(r => {
            realCost += r.costEur || 0;
            realDuration += r.durationDays || 0;
            realPersonDays += r.resourcesPersonDays || 0;
            if (r.status === "active") realActiveCount++;
            if (r.status === "completed") realCompletedCount++;
          });
        });
        
        const realEff = calculateEffectiveness(selectedJourney);

        // 2. Calculate Simulation metrics
        const simResultData = runSimulation(selectedJourney, simBudgetMax, simDurationMax, simPriority, servicesList);
        const simSteps = simResultData.simulatedSteps;
        const simCost = simResultData.totalCost;
        const simDuration = simResultData.totalDuration;
        const simPersonDays = simResultData.totalPersonDays;
        const simEff = calculateSimulatedEffectiveness(simSteps);
        const addedSimulated = simResultData.addedSimulated;

        // 3. Compute Delta values
        const deltaCost = simCost - realCost;
        const deltaDuration = simDuration - realDuration;
        const deltaPersonDays = simPersonDays - realPersonDays;
        const deltaScore = simEff.score - realEff.score;
        
        const simRoi = deltaCost > 0 ? (deltaScore / (deltaCost / 1000)).toFixed(1) : "0.0";

        const handleLocalAddProposed = () => {
          if (!simService) return;
          handleAddProposed(simPhase, simService);
        };

        const handleLocalAddRealized = () => {
          if (!simService) return;
          handleAddRealized(simPhase, simService, simStatus, simResult);
          setSimResult("");
        };

        const getPhaseSimulatedDiagnostic = (phaseId: string, step: any) => {
          const hasProposed = step.proposed.length > 0;
          const completed = step.realized.filter((r: any) => r.status === "completed");
          const active = step.realized.filter((r: any) => r.status === "active");
          const hasRealized = completed.length > 0 || active.length > 0;
          const hasSimulated = step.simulated && step.simulated.length > 0;

          if (!hasProposed && !hasRealized && !hasSimulated) {
            return {
              status: "neutral",
              label: "Non concerné",
              bg: "bg-gray-150 dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800",
              desc: "Cette étape n'a pas été recommandée pour cette entreprise."
            };
          }
          if (hasProposed && !hasRealized && !hasSimulated) {
            return {
              status: "gap",
              label: "Non couvert",
              bg: "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20",
              desc: "Étape recommandée mais hors critères de simulation."
            };
          }
          if (hasProposed && !hasRealized && hasSimulated) {
            return {
              status: "simulated",
              label: "✨ Simulation",
              bg: "bg-amber-500/10 text-amber-600 dark:text-amber-455 border-amber-500/20",
              desc: "Étape comblée par recommandation automatique."
            };
          }
          if (!hasProposed && (hasRealized || hasSimulated)) {
            return {
              status: "opportunity",
              label: "Hors-parcours",
              bg: "bg-blue-500/10 text-blue-600 dark:text-blue-455 border-blue-500/20",
              desc: "Service réalisé ou simulé hors recommandation."
            };
          }
          const completedCount = step.realized.filter((r: any) => r.status === "completed").length;
          const simulatedCount = step.simulated?.length || 0;
          if (completedCount + simulatedCount > 1) {
            return {
              status: "overlap",
              label: "Doublon",
              bg: "bg-amber-500/10 text-amber-600 dark:text-amber-455 border-amber-500/20",
              desc: "Plusieurs services suivis pour un même objectif."
            };
          }
          return {
            status: "match",
            label: "Aligné",
            bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border-emerald-500/20",
            desc: "Le parcours recommandé a été respecté avec succès."
          };
        };

        const getPhaseDiagnosticForMode = (phaseId: string, stepRealized: any[], stepProposed: string[], stepSimulated?: any[]) => {
          if (benefViewMode === "asis") {
            return getPhaseDiagnostic(phaseId, { proposed: stepProposed, realized: stepRealized });
          } else {
            return getPhaseSimulatedDiagnostic(phaseId, { proposed: stepProposed, realized: stepRealized, simulated: stepSimulated });
          }
        };

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Main dashboard description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Suivi des Bénéficiaires & Diagnostics de Parcours
                </h3>
                <p className="text-xs text-gray-400">
                  Visualisez les parcours réels d'innovation ("As-Is") ou simulez des accompagnements potentiels sous contraintes de budget, de temps et de ressources pour optimiser la trajectoire des PME wallonnes.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 whitespace-nowrap shrink-0">
                <Users className="w-4 h-4" />
                <span>{beneficiaries.length} Bénéficiaires Actifs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Master List of companies */}
              <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Rechercher une PME..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-gray-705 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateCompany}
                    className="p-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition cursor-pointer border-0 shadow-sm shrink-0 flex items-center justify-center"
                    title="Ajouter une entreprise"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {beneficiaries
                    .filter(item => 
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => {
                      const isActive = item.id === selectedBeneficiaryId;
                      const primaryJourney = item.journeys[0];
                      const completion = primaryJourney ? Object.values(primaryJourney.steps).reduce((acc: number, step: any) => {
                        if (step.proposed.length > 0) {
                          const matched = step.proposed.some((p: string) => step.realized.some((r: any) => r.serviceName.toLowerCase() === p.toLowerCase() && (r.status === "completed" || r.status === "active")));
                          if (matched) return acc + 1;
                        }
                        return acc;
                      }, 0) : 0;
                      const totalProposedPhases = primaryJourney ? Object.values(primaryJourney.steps).filter((step: any) => step.proposed.length > 0).length : 0;
                      const pct = totalProposedPhases > 0 ? Math.round((completion / totalProposedPhases) * 100) : 100;

                      const effStatus = primaryJourney ? primaryJourney.effectivenessStatus : "Insuffisant";
                      let badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20";
                      if (effStatus === "Succès Majeur") {
                        badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border-emerald-500/20";
                      } else if (effStatus === "En bonne voie") {
                        badgeColor = "bg-teal-500/10 text-teal-600 dark:text-teal-455 border-teal-500/20";
                      } else if (effStatus === "Mitigé") {
                        badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-455 border-amber-500/20";
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedBeneficiaryId(item.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2 cursor-pointer",
                            isActive
                              ? "bg-teal-500/5 dark:bg-teal-950/15 border-teal-500/30 text-teal-700 dark:text-teal-300 shadow-sm"
                              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800/80 hover:bg-gray-50/50 dark:hover:bg-gray-900/30"
                          )}
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className="min-w-0 pr-1">
                              <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider truncate">{item.sector}</span>
                              <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100 truncate block">{item.name}</span>
                            </div>
                            <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold border shrink-0", badgeColor)}>
                              {effStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[9px] text-gray-400">
                            <MapPin className="w-3 h-3 text-teal-500" />
                            <span className="truncate">{item.location} • {item.size}</span>
                          </div>

                          <div className="space-y-1 mt-1 w-full">
                            <div className="flex justify-between text-[9px] font-bold">
                              <span className="text-gray-400">Avancement</span>
                              <span className="text-teal-600 dark:text-teal-400">{pct}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Right Side: Detailed Dashboard for selected company */}
              <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                {/* Detailed Header Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 dark:border-gray-700/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Building2 className="w-5 h-5 text-teal-650 dark:text-teal-400 animate-pulse" />
                        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100">{b.name}</h2>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-450">
                          {b.size}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Secteur d'activité : <strong className="text-gray-600 dark:text-gray-300">{b.sector}</strong> • Localisation : <strong className="text-gray-600 dark:text-gray-300">{b.location}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Objectif Territorial</span>
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400">{selectedJourney ? selectedJourney.name : "Non inscrit"}</span>
                      </div>
                      <button
                        onClick={() => {
                          const orig = initialBeneficiaries.find(o => o.id === b.id);
                          if (orig) {
                            setBeneficiaries(prev => prev.map(item => item.id === b.id ? JSON.parse(JSON.stringify(orig)) : item));
                          }
                          setSimBudgetMax(25000);
                          setSimDurationMax(120);
                          setSimPriority("competitiveness");
                        }}
                        title="Restaurer l'état initial de simulation"
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-750 text-gray-400 dark:text-gray-500 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Journey Switcher Tabs */}
                  <div className="border-b border-gray-100 dark:border-gray-750 pb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Parcours Actifs du Bénéficiaire (Cliquez pour basculer)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {b.journeys.map((j) => {
                        const isSelected = j.id === selectedJourneyId;
                        let jBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-450";
                        if (j.effectivenessStatus === "Succès Majeur") jBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-455";
                        else if (j.effectivenessStatus === "En bonne voie") jBadgeColor = "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-455";
                        else if (j.effectivenessStatus === "Mitigé") jBadgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-455";

                        return (
                          <div
                            key={j.id}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-xs",
                              isSelected
                                ? "bg-teal-650 text-white border-teal-650 shadow-sm"
                                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                            onClick={() => setSelectedJourneyId(j.id)}
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-bold leading-tight">{j.name}</span>
                              <span className={cn("text-[9px] mt-0.5 font-medium", isSelected ? "text-teal-100" : "text-gray-400 dark:text-gray-500")}>
                                {j.provider} • Efficacité: {j.effectivenessScore}%
                              </span>
                            </div>
                            <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-extrabold border shrink-0", isSelected ? "bg-white/20 text-white border-white/30" : jBadgeColor)}>
                              {j.effectivenessStatus}
                            </span>
                            {b.journeys.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWithdrawJourney(j.id);
                                }}
                                title="Se désinscrire de ce parcours"
                                className={cn(
                                  "p-1 rounded-md transition hover:bg-rose-500/20 hover:text-rose-500 ml-1 cursor-pointer",
                                  isSelected ? "text-teal-100 hover:bg-white/20 hover:text-white" : "text-gray-400"
                                )}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Strategies & Digiscore Diagnostic Widget */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left Column: Digiscore & Strategies */}
                      <div className="md:col-span-5 flex flex-col justify-between border-r border-gray-100 dark:border-gray-750 pr-0 md:pr-6 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-teal-650 dark:text-teal-400" />
                            Diagnostic de Maturité Digitale
                          </h4>
                          
                          <div className="flex items-center gap-4 py-2">
                            {/* Circular progress ring */}
                            <div className="relative w-20 h-20 shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="34"
                                  className="text-gray-100 dark:text-gray-700 stroke-current"
                                  strokeWidth="6"
                                  fill="transparent"
                                />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="34"
                                  className="text-teal-600 dark:text-teal-400 stroke-current transition-all duration-500"
                                  strokeWidth="6"
                                  fill="transparent"
                                  strokeDasharray={2 * Math.PI * 34}
                                  strokeDashoffset={2 * Math.PI * 34 * (1 - (b.digiscore?.score || 0) / 100)}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-black text-teal-650 dark:text-teal-400">
                                  {b.digiscore?.score || 0}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400 font-extrabold uppercase">Niveau</span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[9px] font-bold border",
                                  b.digiscore?.level === "Beginner" && "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20",
                                  b.digiscore?.level === "Intermediate" && "bg-amber-500/10 text-amber-600 dark:text-amber-455 border-amber-500/20",
                                  b.digiscore?.level === "Advanced" && "bg-teal-500/10 text-teal-600 dark:text-teal-455 border-teal-500/20",
                                  b.digiscore?.level === "Expert" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border-emerald-500/20"
                                )}>
                                  {b.digiscore?.level === "Beginner" && "Débutant"}
                                  {b.digiscore?.level === "Intermediate" && "Intermédiaire"}
                                  {b.digiscore?.level === "Advanced" && "Avancé"}
                                  {b.digiscore?.level === "Expert" && "Expert"}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-405">
                                Évalué le {b.digiscore?.date || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Strategies List */}
                        <div className="space-y-2 border-t border-gray-100 dark:border-gray-750/50 pt-3">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">
                            Stratégies Territoriales Actives
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {b.strategies && b.strategies.length > 0 ? (
                              b.strategies.map((strat, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-305 text-[9px] font-bold rounded-lg border border-gray-250 dark:border-gray-700 flex items-center gap-1"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                  {strat}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">Aucune stratégie active</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Smart Recommendations */}
                      <div className="md:col-span-7 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                            Recommandations Sémantiques
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Propositions personnalisées basées sur le profil de l'entreprise, sa demande et son digiscore.
                          </p>
                        </div>

                        {(() => {
                          // Define recommendation data based on level
                          let recService = { name: "Diagnostic de maturité numérique PME", phase: "diagnostic", desc: "Évaluation de la maturité digitale de votre PME et plan d'action personnalisé." };
                          let recJourney = { id: "t-6", name: "Données Territoriales", objective: "Stratégie de données territoriales ouvertes et souveraines" };

                          if (b.digiscore?.level === "Intermediate") {
                            recService = { name: "Parcours cybersécurité PME", phase: "coaching", desc: "Sécurisez vos données et protégez vos infrastructures informatiques." };
                            recJourney = { id: "t-1", name: "Transformation Numérique (Industrie 4.0)", objective: "Lignes de production connectées et automatisation" };
                          } else if (b.digiscore?.level === "Advanced") {
                            recService = { name: "Programme expérimentation IA industrielle", phase: "implementation", desc: "Validez et prototypez vos cas d'usage d'intelligence artificielle." };
                            recJourney = { id: "t-4", name: "Transition Énergétique & Décarbonation", objective: "Plan carbone et décarbonation industrielle" };
                          } else if (b.digiscore?.level === "Expert") {
                            recService = { name: "Recherche de financement innovation", phase: "investissement", desc: "Accès aux financements publics et privés pour vos projets innovants." };
                            recJourney = { id: "t-5", name: "Recherche & Collaboration S3", objective: "Consortiums de recherche clinique et validation TRL" };
                          }

                          // Check if service is already proposed or completed/active in the selected journey
                          const isServiceProposed = selectedJourney ? selectedJourney.steps[recService.phase as keyof typeof selectedJourney.steps]?.proposed.includes(recService.name) : false;
                          const isServiceRealized = selectedJourney ? selectedJourney.steps[recService.phase as keyof typeof selectedJourney.steps]?.realized.some(r => r.serviceName.toLowerCase() === recService.name.toLowerCase()) : false;
                          
                          // Check if journey is already enrolled
                          const isJourneyEnrolled = b.journeys.some(j => j.name === recJourney.name);

                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Service recommendation card */}
                              <div className="bg-gray-50 dark:bg-gray-900/60 p-3.5 rounded-xl border border-gray-150 dark:border-gray-800/80 flex flex-col justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-extrabold text-teal-650 dark:text-teal-400 uppercase tracking-wider">
                                    Service suggéré
                                  </span>
                                  <h5 className="text-xs font-extrabold text-gray-800 dark:text-zinc-100 line-clamp-1">
                                    {recService.name}
                                  </h5>
                                  <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                                    {recService.desc}
                                  </p>
                                </div>
                                <div className="pt-1">
                                  {isServiceRealized ? (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-455 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 block text-center">
                                      ✓ Déjà réalisé
                                    </span>
                                  ) : isServiceProposed ? (
                                    <span className="text-[10px] font-bold text-teal-650 dark:text-teal-455 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20 block text-center">
                                      ✓ Déjà proposé
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleAddProposed(recService.phase, recService.name)}
                                      className="w-full py-1.5 bg-teal-650 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg transition border-0 cursor-pointer shadow-sm"
                                    >
                                      Ajouter au plan
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Journey recommendation card */}
                              <div className="bg-gray-50 dark:bg-gray-900/60 p-3.5 rounded-xl border border-gray-150 dark:border-gray-800/80 flex flex-col justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    Parcours recommandé
                                  </span>
                                  <h5 className="text-xs font-extrabold text-gray-800 dark:text-zinc-100 line-clamp-1">
                                    {recJourney.name}
                                  </h5>
                                  <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                                    {recJourney.objective}
                                  </p>
                                </div>
                                <div className="pt-1">
                                  {isJourneyEnrolled ? (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-455 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 block text-center">
                                      ✓ Déjà inscrit
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleEnrollJourneyTemplate(recJourney.id)}
                                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition border-0 cursor-pointer shadow-sm"
                                    >
                                      Inscrire l'entreprise
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Mode Toggle Bar */}
                  <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800/80 max-w-sm shadow-inner">
                    <button
                      onClick={() => setBenefViewMode("asis")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition duration-200",
                        benefViewMode === "asis"
                          ? "bg-white dark:bg-gray-800 text-teal-650 dark:text-teal-400 shadow-sm border border-gray-100 dark:border-gray-700"
                          : "text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Vue As-Is (Réel)
                    </button>
                    <button
                      onClick={() => setBenefViewMode("simulation")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition duration-200",
                        benefViewMode === "simulation"
                          ? "bg-teal-650 dark:bg-teal-650 text-white shadow-sm"
                          : "text-gray-550 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                      Mode Simulation
                    </button>
                  </div>

                  {/* Bilan d'impact panel / Comparative Indicators Panel */}
                  <div className="border-t border-gray-100 dark:border-gray-750 pt-5">
                    {benefViewMode === "asis" ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left: Effectiveness score gauge */}
                        <div className="md:col-span-4 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-150 dark:border-gray-800/80 flex flex-col items-center justify-between text-center min-h-[140px]">
                          <div className="w-full">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                              Efficacité du Parcours Réel
                            </span>
                            <div className="flex items-baseline justify-center gap-1 mt-2">
                              <span className="text-3xl font-black text-teal-600 dark:text-teal-400">{realEff.score}</span>
                              <span className="text-sm font-bold text-gray-400">/ 100</span>
                            </div>
                          </div>

                          <div className="w-full mt-3 space-y-1">
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  realEff.score >= 90
                                    ? "bg-emerald-500"
                                    : realEff.score >= 70
                                      ? "bg-teal-500"
                                      : realEff.score >= 40
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                )}
                                style={{ width: `${realEff.score}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-extrabold block text-gray-500 dark:text-gray-450 pt-1">
                              Atteinte des objectifs S3
                            </span>
                          </div>
                        </div>

                        {/* Right: Explanation & metrics */}
                        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                          <div className="bg-teal-500/5 dark:bg-teal-950/5 p-3.5 rounded-xl border border-teal-500/10 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 mb-1">
                              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                              <span>Bilan d'impact territorial</span>
                            </div>
                            {realEff.explanation}
                          </div>

                          {/* Comparateur Avant vs Après */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              Mesures & Retours d'Impact (Avant vs Après)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {selectedJourney.metrics.map((metric: any, mIdx: number) => (
                                <div key={mIdx} className="bg-white dark:bg-gray-900/50 p-2.5 rounded-xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                                  <span className="text-[9px] text-gray-400 font-bold block truncate">{metric.label}</span>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-1 min-w-0">
                                      <span className="text-[10px] text-gray-400 line-through truncate">{metric.before}</span>
                                      <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-450 truncate">
                                        {metric.after}{metric.unit}
                                      </span>
                                    </div>
                                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 shrink-0">
                                      {metric.isPositive ? "▲ OK" : "▼"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Simulation Dashboard Metrics
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Cost Comparison */}
                          <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-gray-900 p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 shadow-sm">
                            <span className="text-[9px] font-extrabold text-teal-650 dark:text-teal-400 uppercase tracking-wider block">Coût total (Réel → Simulé)</span>
                            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-150 mt-1">
                              {realCost.toLocaleString()} € → <span className="text-teal-650 dark:text-teal-400">{simCost.toLocaleString()} €</span>
                            </h4>
                            <span className="text-[9px] font-semibold text-gray-400 block mt-1">
                              Additionnel: +{deltaCost.toLocaleString()} €
                            </span>
                          </div>

                          {/* Duration Comparison */}
                          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-sm">
                            <span className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Durée totale (Réel → Simulé)</span>
                            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-150 mt-1">
                              {realDuration} j → <span className="text-blue-600 dark:text-blue-400">{simDuration} j</span>
                            </h4>
                            <span className="text-[9px] font-semibold text-gray-400 block mt-1">
                              Temps requis: +{deltaDuration} jours
                            </span>
                          </div>

                          {/* Resources Comparison */}
                          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 shadow-sm">
                            <span className="text-[9px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Ressources (Réel → Simulé)</span>
                            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-150 mt-1">
                              {realPersonDays} j-h → <span className="text-purple-600 dark:text-purple-400">{simPersonDays} j-h</span>
                            </h4>
                            <span className="text-[9px] font-semibold text-gray-400 block mt-1">
                              Effort additionnel: +{deltaPersonDays} j-h
                            </span>
                          </div>

                          {/* Score Comparison */}
                          <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 shadow-sm">
                            <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Score Efficacité (Réel → Simulé)</span>
                            <h4 className="text-sm font-black text-gray-800 dark:text-zinc-150 mt-1">
                              {realEff.score}% → <span className="text-amber-500 font-extrabold">{simEff.score}%</span>
                            </h4>
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 block mt-1">
                              Gain: +{deltaScore}% ({simEff.status})
                            </span>
                          </div>
                        </div>

                        {/* Performance indicators */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Performance ROI de la Simulation</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Calcule le gain de maturité du parcours par tranche de 1 000 € investis dans les services publics.
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-2xl font-black text-teal-650 dark:text-teal-400 block">{simRoi}x</span>
                              <span className="text-[8px] font-semibold text-gray-400">Score / 1k € simulés</span>
                            </div>
                            <span className="bg-teal-500/10 text-teal-650 dark:text-teal-400 border border-teal-500/20 text-[9px] font-bold px-2 py-1 rounded-lg">
                              {Number(simRoi) > 2 ? "Rentabilité Élevée" : "Rentabilité Modérée"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 text-[11px] text-gray-600 dark:text-zinc-350 leading-relaxed">
                          <strong>Bilan de la Simulation :</strong> {simEff.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulation controls panel */}
                {benefViewMode === "simulation" && (() => {
                  // --- Digiscore boost calculation ---
                  const b = beneficiaries.find(x => x.id === selectedBeneficiaryId);
                  const baseScore = (b as any)?.digiscoreScore ?? 0;
                  const totalBoost = Array.from(simCheckedServices).reduce((acc, svcName) => {
                    const svc = servicesList.find(s => s.name === svcName) as any;
                    return acc + (svc?.impacts?.digiscoreBoost ?? svc?.impacts?.competitiveness ? 5 : 0);
                  }, 0);
                  const simScore = Math.min(100, baseScore + totalBoost);
                  return (
                  <div className="space-y-4">
                    {/* Impact Prédictif Digiscore */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Gauge className="w-5 h-5 text-amber-500 animate-pulse" />
                        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                          Simulation d&apos;Impact Prédictif — Digiscore
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gauge comparée */}
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="flex items-end gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">Score Actuel</span>
                              <div className="relative w-20 h-20">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14b8a6" strokeWidth="3"
                                    strokeDasharray={`${baseScore} ${100 - baseScore}`} strokeLinecap="round"/>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-base font-black text-teal-600">{baseScore}%</span>
                              </div>
                            </div>
                            <div className="text-2xl font-black text-amber-400">→</div>
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] text-amber-600 font-black uppercase mb-1">Après Simulation</span>
                              <div className="relative w-24 h-24">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fde68a" strokeWidth="3"/>
                                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.5"
                                    strokeDasharray={`${simScore} ${100 - simScore}`} strokeLinecap="round"
                                    className="transition-all duration-700"/>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-amber-600">{simScore}%</span>
                              </div>
                            </div>
                          </div>
                          {totalBoost > 0 && (
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                              +{totalBoost}% grâce à {simCheckedServices.size} service{simCheckedServices.size > 1 ? "s" : ""} simulé{simCheckedServices.size > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        {/* Checklist des services simulés */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Cocher les services à simuler :</span>
                          {servicesList.slice(0, 6).map(svc => (
                            <label key={svc.id} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" checked={simCheckedServices.has(svc.name)}
                                onChange={() => toggleSimService(svc.name)}
                                className="w-3.5 h-3.5 accent-amber-500 cursor-pointer" />
                              <span className={cn("text-xs transition", simCheckedServices.has(svc.name) ? "text-amber-700 dark:text-amber-400 font-bold" : "text-gray-500 dark:text-gray-400")}>
                                {svc.name}
                              </span>
                              {(svc as any).impacts?.digiscoreBoost && (
                                <span className="text-[9px] text-emerald-600 font-bold ml-auto">+{(svc as any).impacts.digiscoreBoost}%</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Existing simulation controls */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                          Moteur de Simulation &amp; Critères de Recommandation S3
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400">
                        Définissez vos contraintes de budget, de temps et votre priorité d&apos;impact. L&apos;algorithme client calcule instantanément la meilleure combinaison de services sémantiques pour combler les gaps constatés.
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                        {/* Budget max Slider */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                            <span>Budget Max (Cumulé)</span>
                            <span className="text-teal-650 dark:text-teal-400 font-extrabold">{simBudgetMax.toLocaleString()} €</span>
                          </div>
                          <input type="range" min={realCost} max={realCost + 40000} step={1000} value={simBudgetMax}
                            onChange={(e) => setSimBudgetMax(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                          <div className="flex justify-between text-[8px] text-gray-400">
                            <span>Actuel ({realCost.toLocaleString()} €)</span>
                            <span>Max ({ (realCost + 40000).toLocaleString() } €)</span>
                          </div>
                        </div>
                        {/* Duration max Slider */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                            <span>Durée Max (Cumulée)</span>
                            <span className="text-teal-650 dark:text-teal-400 font-extrabold">{simDurationMax} jours</span>
                          </div>
                          <input type="range" min={realDuration} max={realDuration + 180} step={5} value={simDurationMax}
                            onChange={(e) => setSimDurationMax(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                          <div className="flex justify-between text-[8px] text-gray-400">
                            <span>Actuel ({realDuration} j)</span>
                            <span>Max ({realDuration + 180} j)</span>
                          </div>
                        </div>
                        {/* Priority selector */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Priorité Strategique S3</label>
                          <select value={simPriority} onChange={(e) => setSimPriority(e.target.value as any)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500">
                            <option value="competitiveness">📈 Compétitivité industrielle</option>
                            <option value="jobs">👥 Création &amp; Maintien d&apos;emplois</option>
                            <option value="resilience">🛡️ Cyber-résilience &amp; Sécurité</option>
                            <option value="carbon">🌱 Décarbonation &amp; Climat</option>
                            <option value="sovereignty">🔐 Souveraineté &amp; Interopérabilité</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })()}
              </div> {/* Ends Right Side col-span-9 */}
            </div> {/* Ends Grid grid-cols-12 */}

            {/* Comparative Gaps & Doublons Grid (Full Screen Width) */}
            <div className="bg-white dark:bg-gray-800 p-6 -mx-6 px-6 md:px-8 border-y border-gray-200 dark:border-gray-700 shadow-md space-y-5">
                  {/* Section Header with Multi-Operator Collaboration Bar */}
                  <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          Analyse du Parcours : Gaps &amp; Doublons
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          Cartographie des 6 phases pour <strong>{b.name}</strong>. Gaps = services recommandés non initiés · Doublons = chevauchements redondants.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />Gap
                        </span>
                        {benefViewMode === "simulation" && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-455 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />Simulé
                          </span>
                        )}
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-455 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Match
                        </span>
                      </div>
                    </div>

                    {/* 🤝 MULTI-OPERATOR COLLABORATION BAR */}
                    <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Conseiller actif :</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(["AdN", "WE", "AWEX", "UCM"] as const).map(op => {
                          const colors: Record<string, string> = {
                            AdN: "bg-fuchsia-600 text-white border-fuchsia-600",
                            WE: "bg-emerald-600 text-white border-emerald-600",
                            AWEX: "bg-blue-600 text-white border-blue-600",
                            UCM: "bg-orange-500 text-white border-orange-500",
                          };
                          const inactiveColors: Record<string, string> = {
                            AdN: "text-fuchsia-600 border-fuchsia-300 hover:bg-fuchsia-50",
                            WE: "text-emerald-600 border-emerald-300 hover:bg-emerald-50",
                            AWEX: "text-blue-600 border-blue-300 hover:bg-blue-50",
                            UCM: "text-orange-500 border-orange-300 hover:bg-orange-50",
                          };
                          return (
                            <button key={op} type="button"
                              onClick={() => setActiveOperator(op)}
                              className={cn("text-[10px] font-black px-3 py-1 rounded-full border transition cursor-pointer",
                                activeOperator === op ? colors[op] : `bg-transparent ${inactiveColors[op]}`)}>
                              {op}
                            </button>
                          );
                        })}
                      </div>
                      {/* Presence indicator */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          2 conseillers connectés (AdN, WE)
                        </span>
                        <button type="button" onClick={() => {
                          setShowAuditLog(!showAuditLog);
                        }}
                          className="text-[9px] font-bold text-gray-400 hover:text-gray-700 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                          {showAuditLog ? "Masquer" : "📋 Journal d'audit"}
                        </button>
                      </div>
                    </div>

                    {/* Audit log panel */}
                    {showAuditLog && (
                      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                        <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">Journal d&apos;Audit Collaboratif</span>
                        {auditLogs.length === 0 ? (
                          <p className="text-[10px] text-gray-400 italic">Aucune action enregistrée pour ce bénéficiaire.</p>
                        ) : auditLogs.map((log, idx) => {
                          const opColors: Record<string, string> = {
                            AdN: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/30 dark:text-fuchsia-400",
                            WE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                            AWEX: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
                            UCM: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
                          };
                          return (
                            <div key={idx} className="flex items-start gap-2 text-[10px]">
                              <span className={cn("px-1.5 py-0.5 rounded font-bold text-[9px] shrink-0", opColors[log.operator] || "bg-gray-200 text-gray-600")}>{log.operator}</span>
                              <div className="flex-1">
                                <span className="font-bold text-gray-700 dark:text-gray-300">{log.action}</span>
                                {log.detail && <p className="text-gray-500 dark:text-gray-500 text-[9px] mt-0.5">{log.detail}</p>}
                              </div>
                              <span className="text-[8px] text-gray-400 shrink-0">{new Date(log.timestamp).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          );
                        })}
                        {/* Log a new action */}
                        <button type="button"
                          onClick={() => {
                            const newLog = { id: `log-${Date.now()}`, operator: activeOperator, action: "Validation de l'étape", timestamp: new Date().toISOString(), detail: `Validé par ${activeOperator} via le cockpit PIT.` };
                            setAuditLogs(prev => [...prev, newLog]);
                          }}
                          className={cn("w-full mt-2 py-1.5 text-[10px] font-bold rounded-lg border transition cursor-pointer",
                            activeOperator === "AdN" ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100 dark:bg-fuchsia-950/20 dark:text-fuchsia-400 dark:border-fuchsia-800" :
                            activeOperator === "WE" ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800" :
                            activeOperator === "AWEX" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800" :
                            "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800")}>
                          + Enregistrer une action ({activeOperator})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Phase Cards Grid */}
                  <div className="overflow-x-auto pb-4 scrollbar-thin">
                    <div className="grid grid-cols-6 gap-3 min-w-[1200px] lg:min-w-[1400px]">
                    {([
                      { id: "amorcage",      num: "1", label: "Amorçage",      desc: "Sensibilisation & mise en relation" },
                      { id: "diagnostic",    num: "2", label: "Diagnostic",    desc: "Évaluation maturité & TRL" },
                      { id: "coaching",      num: "3", label: "Coaching",      desc: "Conseils & cybersécurité" },
                      { id: "planification", num: "4", label: "Planification", desc: "Roadmap & stratégie" },
                      { id: "implementation",num: "5", label: "Mise en œuvre", desc: "Accompagnement & prototype" },
                      { id: "investissement",num: "6", label: "Investissement", desc: "Financements & subsides" }
                    ] as const).map((phase) => {
                      const stepData = selectedJourney ? selectedJourney.steps[phase.id] : { proposed: [], realized: [] };
                      const stepDataSimulated = benefViewMode === "simulation" ? simSteps[phase.id].simulated || [] : [];
                      
                      const diag = getPhaseDiagnosticForMode(phase.id, stepData.realized, stepData.proposed, stepDataSimulated);

                      return (
                        <div
                          key={phase.id}
                          className={cn(
                            "flex flex-col rounded-xl border overflow-hidden transition-all duration-300",
                            diag.status === "gap"
                              ? "border-rose-300 dark:border-rose-800 bg-rose-500/5"
                              : diag.status === "overlap"
                                ? "border-amber-300 dark:border-amber-800 bg-amber-500/5"
                                : diag.status === "simulated"
                                  ? "border-amber-400 dark:border-amber-700 bg-amber-500/10 shadow-md shadow-amber-500/5"
                                  : diag.status === "opportunity"
                                    ? "border-blue-300 dark:border-blue-800 bg-blue-500/5"
                                    : diag.status === "match"
                                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-500/5"
                                      : "border-gray-200 dark:border-gray-700"
                          )}
                        >
                          {/* Card Header — couleur de fond selon statut */}
                          <div className={cn(
                            "px-3 pt-3 pb-3 space-y-1.5 border-b border-gray-100 dark:border-gray-750",
                            diag.status === "gap"        ? "bg-rose-50 dark:bg-rose-950/20"
                            : diag.status === "overlap"  ? "bg-amber-50 dark:bg-amber-950/20"
                            : diag.status === "simulated"? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40"
                            : diag.status === "opportunity" ? "bg-blue-50 dark:bg-blue-950/20"
                            : diag.status === "match"    ? "bg-emerald-50 dark:bg-emerald-950/20"
                            : "bg-gray-50 dark:bg-gray-900/50"
                          )}>
                            {/* Ligne 1 : numéro ① + nom de la phase */}
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-300 shadow-sm shrink-0">
                                {phase.num}
                              </span>
                              <p className="text-[11px] font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
                                {phase.label}
                              </p>
                            </div>
                            {/* Ligne 2 : description courte */}
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-snug pl-7">
                              {phase.desc}
                            </p>
                            {/* Ligne 3 : badge statut */}
                            <span className={cn(
                              "flex items-center justify-center gap-1 w-full px-2 py-1 rounded-md text-[9px] font-bold border",
                              diag.status === "simulated" 
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-350"
                                : diag.status === "gap"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200"
                                  : diag.status === "match"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200"
                                    : diag.bg
                            )}>
                              {diag.label}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div className="flex-1 flex flex-col gap-3 p-3 bg-white dark:bg-gray-800">
                            {/* Section Proposé */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-450 shrink-0" />
                                <span className="text-[9px] font-extrabold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                                  Proposé
                                </span>
                              </div>
                              {stepData.proposed.length > 0 ? (
                                <div className="space-y-1">
                                  {stepData.proposed.map((pSvc: string, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between gap-1 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                                      <span className="text-[9px] text-gray-700 dark:text-gray-300 font-medium truncate" title={pSvc}>{pSvc}</span>
                                      <button
                                        onClick={() => handleRemoveProposed(phase.id, pSvc)}
                                        title="Supprimer"
                                        className="text-gray-400 hover:text-rose-500 p-0.5 rounded transition cursor-pointer shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[9px] text-gray-400 italic pl-1">Aucune recommandation</p>
                              )}
                            </div>

                            {/* Section Réalisé */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                  Réalisé
                                </span>
                              </div>
                              {stepData.realized.length > 0 ? (
                                <div className="space-y-2">
                                  {stepData.realized.map((rSvc: any, idx: number) => {
                                    const isCompleted = rSvc.status === "completed";
                                    return (
                                      <div key={idx} className="flex flex-col gap-1 bg-emerald-50 dark:bg-emerald-950/15 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/60 shadow-sm">
                                        <div className="flex items-start gap-1 justify-between">
                                          <div className="flex items-start gap-1 min-w-0">
                                            <span className={cn(
                                              "w-1.5 h-1.5 rounded-full shrink-0 mt-1",
                                              isCompleted ? "bg-emerald-500" : "bg-teal-400 animate-pulse"
                                            )} />
                                            <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate leading-tight" title={rSvc.serviceName}>
                                              {rSvc.serviceName}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() => handleRemoveRealized(phase.id, idx)}
                                            title="Retirer"
                                            className="text-gray-400 hover:text-rose-500 p-0.5 rounded transition shrink-0 cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                        
                                        <div className="flex justify-between items-center gap-1 text-[8px] text-gray-400 mt-0.5">
                                          <span className="truncate max-w-[80px] font-semibold">{rSvc.org}</span>
                                          <span className={cn("px-1 rounded text-[7px] font-bold shrink-0", isCompleted ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" : "text-teal-600 bg-teal-100 dark:bg-teal-900/30")}>
                                            {isCompleted ? "✓ Fait" : "⟳ En cours"}
                                          </span>
                                        </div>

                                        {/* Cost and Duration Badges */}
                                        <div className="flex flex-wrap gap-1 pt-1.5 mt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                                          {rSvc.costEur !== undefined && (
                                            <span className="bg-emerald-100/40 dark:bg-emerald-900/25 px-1 py-0.2 rounded text-[7.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                                              💶 {rSvc.costEur.toLocaleString()} €
                                            </span>
                                          )}
                                          {rSvc.durationDays !== undefined && (
                                            <span className="bg-emerald-100/40 dark:bg-emerald-900/25 px-1 py-0.2 rounded text-[7.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                                              ⏱️ {rSvc.durationDays} j
                                            </span>
                                          )}
                                          {rSvc.resourcesPersonDays !== undefined && (
                                            <span className="bg-emerald-100/40 dark:bg-emerald-900/25 px-1 py-0.2 rounded text-[7.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                                              👥 {rSvc.resourcesPersonDays} j-h
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-rose-500/80 pl-1">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span className="text-[9px] font-bold">Aucun service suivi</span>
                                </div>
                              )}
                            </div>

                            {/* Section Simulation (Only visible in simulation mode) */}
                            {benefViewMode === "simulation" && stepDataSimulated && stepDataSimulated.length > 0 && (
                              <div className="border-t border-gray-100 dark:border-gray-750 pt-2.5 space-y-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                                  <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                    Simulé
                                  </span>
                                </div>
                                {stepDataSimulated.map((sSvc: any, idx: number) => (
                                  <div key={idx} className="flex flex-col gap-1.5 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 p-2.5 rounded-lg border border-amber-300 dark:border-amber-800 shadow-xs text-left">
                                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 leading-tight" title={sSvc.serviceName}>
                                      {sSvc.serviceName}
                                    </p>
                                    <span className="text-[8px] text-gray-400 font-medium">{sSvc.org}</span>
                                    
                                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-amber-200/50 dark:border-amber-850/50">
                                      <span className="bg-amber-100/50 dark:bg-amber-900/40 px-1 py-0.2 rounded text-[7.5px] text-amber-700 dark:text-amber-400 font-bold">
                                        💶 {sSvc.estimatedCostEur.toLocaleString()} €
                                      </span>
                                      <span className="bg-amber-100/50 dark:bg-amber-900/40 px-1 py-0.2 rounded text-[7.5px] text-amber-700 dark:text-amber-400 font-bold">
                                        ⏱️ {sSvc.estimatedDurationDays} j
                                      </span>
                                      <span className="bg-amber-100/50 dark:bg-amber-900/40 px-1 py-0.2 rounded text-[7.5px] text-amber-700 dark:text-amber-400 font-bold">
                                        👥 {sSvc.estimatedResourcesPersonDays} j-h
                                      </span>
                                    </div>
                                    
                                    <p className="text-[8.5px] text-gray-450 dark:text-gray-400 leading-snug italic mt-1 bg-white/50 dark:bg-gray-900/50 p-1.5 rounded">
                                      {sSvc.rationale}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Diagnostic Desc */}
                            <p className="text-[8.5px] text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2 mt-auto leading-snug">
                              {diag.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>

                {/* Trajectory editor administration cockpit */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-650 dark:text-teal-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      Cockpit d'Administration du Parcours Réel
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    Modifiez le parcours réel de l'entreprise ou ajoutez des recommandations de base. Vos simulations se synchroniseront instantanément pour refléter les nouveaux points de départ réels.
                  </p>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-2">
                    {/* Simulator col 1: propose service */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-850 dark:text-gray-200">
                        <Check className="w-4 h-4 text-teal-500" />
                        <span>1. Proposer une Recommandation</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Étape du Parcours
                          </label>
                          <select
                            value={simPhase}
                            onChange={(e) => setSimPhase(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="amorcage">1. Amorçage</option>
                            <option value="diagnostic">2. Diagnostic</option>
                            <option value="coaching">3. Coaching</option>
                            <option value="planification">4. Planification</option>
                            <option value="implementation">5. Mise en œuvre</option>
                            <option value="investissement">6. Investissement</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Service du Catalogue S3
                          </label>
                          <select
                            value={simService}
                            onChange={(e) => setSimService(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                          >
                            {servicesList.map(s => (
                              <option key={s.id} value={s.name}>{s.name} ({s.organisationId})</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleLocalAddProposed}
                          className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer border-0"
                        >
                          Ajouter aux Recommandations
                        </button>
                      </div>
                    </div>

                    {/* Simulator col 2: record realized */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-850 dark:text-gray-200">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>2. Déclarer une Action Réalisée</span>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              Étape du Parcours
                            </label>
                            <select
                              value={simPhase}
                              onChange={(e) => setSimPhase(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                            >
                              <option value="amorcage">1. Amorçage</option>
                              <option value="diagnostic">2. Diagnostic</option>
                              <option value="coaching">3. Coaching</option>
                              <option value="planification">4. Planification</option>
                              <option value="implementation">5. Mise en œuvre</option>
                              <option value="investissement">6. Investissement</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              Statut de l'Action
                            </label>
                            <select
                              value={simStatus}
                              onChange={(e) => setSimStatus(e.target.value as any)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                            >
                              <option value="completed">Complété (Fait)</option>
                              <option value="active">En cours</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Service du Catalogue S3
                          </label>
                          <select
                            value={simService}
                            onChange={(e) => setSimService(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                          >
                            {servicesList.map(s => (
                              <option key={s.id} value={s.name}>{s.name} ({s.organisationId})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Résultat & Livrable Mesuré
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Plan de transition carbone rédigé"
                            value={simResult}
                            onChange={(e) => setSimResult(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-teal-500"
                          />
                        </div>

                        <button
                          onClick={handleLocalAddRealized}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer border-0"
                        >
                          Enregistrer la Réalisation
                        </button>
                      </div>
                    </div>

                    {/* Simulator col 3: enroll new journey */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-150 dark:border-gray-800 space-y-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-850 dark:text-gray-200">
                        <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                        <span>3. Inscrire à un Nouveau Parcours</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Modèle de Parcours
                          </label>
                          <select
                            value={simNewJourneyName}
                            onChange={(e) => setSimNewJourneyName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                          >
                            {journeyTemplates.map((t, idx) => (
                              <option key={idx} value={t.name}>
                                {t.name} ({t.provider})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-[10px] text-gray-550 dark:text-gray-400 leading-tight italic bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                          <strong>Objectif :</strong> {journeyTemplates.find(t => t.name === simNewJourneyName)?.objective}
                        </div>

                        <button
                          onClick={() => handleEnrollJourney(simNewJourneyName)}
                          className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer border-0"
                        >
                          Inscrire au Parcours
                        </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}



      {/* 6. CRAFT ECOSYSTEM & OBSERVATORY */}
      {activeTab === "craft" && (
        <CraftEcosystem />
      )}

      {/* Company Form Modal */}
      <AnimatePresence>
        {showCompanyForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompanyForm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45 cursor-pointer"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[520px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto p-6 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-gray-150 dark:border-gray-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">
                      {companyFormMode === "create" ? "Ajouter une Entreprise" : "Modifier le profil de l'entreprise"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Saisissez les informations sémantiques et de contact.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompanyForm(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition cursor-pointer border-0 bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCompany} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nom de l'entreprise *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Biscuiterie Dupont"
                      value={compName}
                      onChange={(e) => setCompName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Taille *</label>
                      <select
                        value={compSize}
                        onChange={(e) => setCompSize(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                      >
                        <option value="TPE">TPE (moins de 10 ETP)</option>
                        <option value="PME">PME (10-250 ETP)</option>
                        <option value="ETI">ETI (250-5000 ETP)</option>
                        <option value="Grande Entreprise">GE (plus de 5000 ETP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Localisation (Ville) *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Namur"
                        value={compLocation}
                        onChange={(e) => setCompLocation(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Secteur *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Agroalimentaire"
                        value={compSector}
                        onChange={(e) => setCompSector(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Digiscore Score (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="45"
                        value={compDigiscore}
                        onChange={(e) => setCompDigiscore(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Niveau Digiscore</label>
                    <select
                      value={compDigiLevel}
                      onChange={(e) => setCompDigiLevel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500"
                    >
                      <option value="Beginner">Débutant (Score &lt; 30)</option>
                      <option value="Intermediate">Intermédiaire (Score 30-60)</option>
                      <option value="Advanced">Avancé (Score 60-85)</option>
                      <option value="Expert">Expert (Score &gt; 85)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Demande / Problématique de l'entreprise</label>
                    <textarea
                      placeholder="Décrivez les besoins en innovation et accompagnement de l'entreprise..."
                      value={compDemand}
                      onChange={(e) => setCompDemand(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-fuchsia-500 resize-none"
                    />
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alignement Sémantique (Taxonomies)</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Filières (ValueChains)</label>
                        <select
                          multiple
                          value={compVcIds.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setCompVcIds(values);
                          }}
                          className="w-full h-24 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                        >
                          {valueChains.map((vc) => (
                            <option key={vc.id} value={vc.id}>{vc.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Maillons (Stages)</label>
                        <select
                          multiple
                          value={compStageIds.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setCompStageIds(values);
                          }}
                          className="w-full h-24 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                        >
                          {stages.map((st) => (
                            <option key={st.id} value={st.id}>{st.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Rôles Écosystème</label>
                        <select
                          multiple
                          value={compRoleIds.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setCompRoleIds(values);
                          }}
                          className="w-full h-24 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Besoins métier</label>
                        <select
                          multiple
                          value={compNeedIds.map(String)}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                            setCompNeedIds(values);
                          }}
                          className="w-full h-24 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg text-[10px] outline-none text-gray-700 dark:text-gray-100"
                        >
                          {businessNeeds.map((n) => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-xs font-bold transition border-0 cursor-pointer shadow-sm mt-4"
                  >
                    Enregistrer le Profil
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail Slide-Over Panel */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 cursor-pointer"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[520px] xl:w-[650px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto p-6 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 bg-primary-500/10 px-2.5 py-0.5 rounded-full">
                      {selectedService.organisationId}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-2 leading-tight">
                      {selectedService.name}
                    </h3>
                    <div className="text-[10px] text-gray-400 font-mono select-all truncate max-w-[320px] sm:max-w-[400px] mt-1 bg-gray-50 dark:bg-gray-950 p-1.5 rounded border border-gray-200/50 dark:border-gray-800/80">
                      {selectedService.uri}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Core Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Description Sémantique
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed bg-gray-50/50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-100 dark:border-gray-850">
                      {selectedService.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Statut de Validation</h4>
                      <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full">
                        {selectedService.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Thématiques S3</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedService.themes.map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 text-[9px] font-semibold bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Parcours associés section */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-teal-650" />
                      Parcours associés
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {journeyTemplates.filter((jt: any) => 
                        Object.values(jt.steps || {}).some((list: any) => 
                          Array.isArray(list) && list.some((name: string) => name.toLowerCase() === selectedService.name.toLowerCase())
                        )
                      ).map((jt: any) => (
                        <a
                          key={jt.id}
                          href={`/journeys?id=${jt.id}`}
                          className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900 rounded-lg text-[10px] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Compass className="w-3 h-3 text-teal-500" />
                          {jt.name}
                        </a>
                      ))}
                      {journeyTemplates.filter((jt: any) => 
                        Object.values(jt.steps || {}).some((list: any) => 
                          Array.isArray(list) && list.some((name: string) => name.toLowerCase() === selectedService.name.toLowerCase())
                        )
                      ).length === 0 && (
                        <span className="text-[10px] italic text-muted">Aucun parcours associé</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Strategic Impact Radar or Scores */}
                <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-650" />
                    Impact Stratégique Régional (S3)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
                    {Object.entries(selectedService.impacts).map(([key, val]: any) => (
                      <div key={key} className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-800/80 shadow-xs">
                        <span className="text-[8px] text-gray-400 font-bold uppercase truncate w-full text-center">{key}</span>
                        <span className="font-extrabold text-teal-700 dark:text-teal-400 text-sm mt-1">{val}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                    Indicateurs clés & Télémétrie
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">PME Accompagnées</span>
                      <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
                        {selectedService.kpis.companiesAccompanied}
                      </span>
                    </div>
                    <div className="bg-green-500/5 p-3 rounded-xl border border-green-500/10 text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">Taux Satisfaction</span>
                      <span className="text-xl font-black text-green-600 dark:text-green-400 mt-1 block">
                        {selectedService.kpis.satisfactionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linked Datasets, Evidence & Outputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 dark:bg-gray-950/20 p-3 rounded-xl border border-gray-100 dark:border-gray-850 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Exigences & Documents Requis</h5>
                    <ul className="text-[10px] text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Attestation d'activité en Wallonie</li>
                      <li>Numéro BCE (Banque Carrefour)</li>
                      <li>Attestation PME active</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-gray-950/20 p-3 rounded-xl border border-gray-100 dark:border-gray-850 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-green-500">Outputs & Livrables Générés</h5>
                    <ul className="text-[10px] text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Rapport officiel de maturité</li>
                      <li>Feuille de route stratégique</li>
                      <li>Certification sémantique</li>
                    </ul>
                  </div>
                </div>

                {/* Live JSON-LD Code panel */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-500" />
                      Graphe de Métadonnées (JSON-LD v3.0)
                    </h4>
                    <button
                      onClick={() => {
                        const jsonLd = {
                          "@context": [
                            "https://schema.org/",
                            {
                              "cpsv": "http://data.europa.eu/m8g/",
                              "dct": "http://purl.org/dc/terms/",
                              "cv": "http://data.europa.eu/m8g/"
                            }
                          ],
                          "@id": selectedService.uri,
                          "@type": "cpsv:PublicService",
                          "dct:title": selectedService.name,
                          "dct:description": selectedService.description,
                          "cv:competentAuthority": {
                            "@type": "dct:Agent",
                            "dct:title": selectedService.organisationId
                          },
                          "cv:hasInput": [
                            {
                              "@type": "cv:Evidence",
                              "dct:title": "Extrait BCE & Attestation PME éligible"
                            }
                          ],
                          "cv:hasOutput": [
                            {
                              "@type": "cv:Output",
                              "dct:title": "Rapport stratégique & plan d'action"
                            }
                          ]
                        };
                        navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
                        alert("✅ JSON-LD sémantique copié dans le presse-papiers !");
                      }}
                      className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copier JSON-LD
                    </button>
                  </div>
                  <div className="bg-gray-950 text-zinc-300 p-4 rounded-xl text-[10px] font-mono border border-gray-800 max-h-[220px] overflow-auto scrollbar-thin select-all">
                    <pre>{JSON.stringify({
                      "@context": [
                        "https://schema.org/",
                        {
                          "cpsv": "http://data.europa.eu/m8g/",
                          "dct": "http://purl.org/dc/terms/",
                          "cv": "http://data.europa.eu/m8g/"
                        }
                      ],
                      "@id": selectedService.uri,
                      "@type": "cpsv:PublicService",
                      "dct:title": selectedService.name,
                      "dct:description": selectedService.description,
                      "cv:competentAuthority": {
                        "@type": "dct:Agent",
                        "dct:title": selectedService.organisationId
                      },
                      "cv:hasInput": [
                        {
                          "@type": "cv:Evidence",
                          "dct:title": "Extrait BCE & Attestation PME éligible"
                        }
                      ],
                      "cv:hasOutput": [
                        {
                          "@type": "cv:Output",
                          "dct:title": "Rapport de diagnostic & roadmap"
                        }
                      ]
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
