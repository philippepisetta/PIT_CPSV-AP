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

type EffectivenessType = "Succès Majeur" | "En bonne voie" | "Mitigé" | "Insuffisant";

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
    amorcage: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
    diagnostic: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
    coaching: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
    planification: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
    implementation: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
    investissement: { proposed: string[]; realized: { serviceName: string; status: "completed" | "active"; org: string; resultText: string; }[]; };
  };
}

interface Beneficiary {
  id: string;
  name: string;
  size: string;
  sector: string;
  location: string;
  journeys: BeneficiaryJourneyInstance[];
}

interface JourneyTemplate {
  id: string;
  name: string;
  provider: string;
  objective: string;
  businessEvent: "Starting Business" | "Financing Business" | "Operating Business" | "Expanding Business" | "Closing Business"; 
  euStrategy: "Décennie Numérique" | "Pacte Vert (Green Deal)" | "Souveraineté & Cyber-résilience" | "Recherche & Collaboration S3";
  localS3: "IA & Algorithmes" | "Industrie 4.0" | "Cybersécurité" | "Transition Énergétique" | "Recherche & Collaboration S3" | "Accompagnement Économique & Export";
  filiere: "Agroalimentaire" | "Sciences de la Vie" | "Industrie Manufacturière" | "Énergies Propres" | "Technologies du Futur" | "Construction durable";
  valueChainSegment: "Recherche & Développement" | "Approvisionnement & Conception" | "Production & Industrialisation" | "Logistique & Distribution" | "Marketing & Export" | "Économie Circulaire & Fin de vie";
  steps: {
    amorcage: string[];
    diagnostic: string[];
    coaching: string[];
    planification: string[];
    implementation: string[];
    investissement: string[];
  };
}

const initialJourneyTemplates: JourneyTemplate[] = [
  {
    id: "t-1",
    name: "Transformation Numérique (Industrie 4.0)",
    provider: "AdN / WE",
    objective: "Lignes de production connectées et automatisation",
    businessEvent: "Operating Business",
    euStrategy: "Décennie Numérique",
    localS3: "Industrie 4.0",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Production & Industrialisation",
    steps: {
      amorcage: ["Mise en relation partenaires IA & industrie"],
      diagnostic: ["Diagnostic de maturité numérique PME"],
      coaching: ["Parcours cybersécurité PME"],
      planification: ["Accompagnement stratégie données territoriales"],
      implementation: ["Accompagnement transformation digitale industrie 4.0"],
      investissement: ["Recherche de financement innovation"]
    }
  },
  {
    id: "t-2",
    name: "Résilience Cybersécurité",
    provider: "AKT / AdN",
    objective: "Audit de vulnérabilité et formation cyber",
    businessEvent: "Operating Business",
    euStrategy: "Souveraineté & Cyber-résilience",
    localS3: "Cybersécurité",
    filiere: "Technologies du Futur",
    valueChainSegment: "Production & Industrialisation",
    steps: {
      amorcage: [],
      diagnostic: ["Diagnostic de maturité numérique PME"],
      coaching: ["Parcours cybersécurité PME"],
      planification: [],
      implementation: [],
      investissement: []
    }
  },
  {
    id: "t-3",
    name: "Accompagnement Économique & Export",
    provider: "WE / AWEX",
    objective: "Levée de fonds R&D et développement international",
    businessEvent: "Expanding Business",
    euStrategy: "Décennie Numérique",
    localS3: "Accompagnement Économique & Export",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Marketing & Export",
    steps: {
      amorcage: [],
      diagnostic: [],
      coaching: ["Accompagnement export international digital"],
      planification: [],
      implementation: [],
      investissement: ["Recherche de financement innovation"]
    }
  },
  {
    id: "t-4",
    name: "Transition Énergétique & Décarbonation",
    provider: "Cluster Tweed",
    objective: "Plan carbone et décarbonation industrielle",
    businessEvent: "Operating Business",
    euStrategy: "Pacte Vert (Green Deal)",
    localS3: "Transition Énergétique",
    filiere: "Énergies Propres",
    valueChainSegment: "Économie Circulaire & Fin de vie",
    steps: {
      amorcage: [],
      diagnostic: ["Diagnostic de maturité numérique PME"],
      coaching: [],
      planification: ["Programme transition énergétique industrielle"],
      implementation: ["Accompagnement transformation digitale industrie 4.0"],
      investissement: []
    }
  },
  {
    id: "t-5",
    name: "Recherche & Collaboration S3",
    provider: "SPW EER",
    objective: "Consortiums de recherche clinique et validation TRL",
    businessEvent: "Operating Business",
    euStrategy: "Recherche & Collaboration S3",
    localS3: "Recherche & Collaboration S3",
    filiere: "Sciences de la Vie",
    valueChainSegment: "Recherche & Développement",
    steps: {
      amorcage: ["Détection de consortiums innovation S3"],
      diagnostic: ["Diagnostic de maturité numérique PME"],
      coaching: [],
      planification: [],
      implementation: ["Programme expérimentation IA industrielle"],
      investissement: []
    }
  },
  {
    id: "t-6",
    name: "Données Territoriales",
    provider: "Agence du Numérique",
    objective: "Stratégie de données territoriales ouvertes et souveraines",
    businessEvent: "Operating Business",
    euStrategy: "Souveraineté & Cyber-résilience",
    localS3: "IA & Algorithmes",
    filiere: "Technologies du Futur",
    valueChainSegment: "Approvisionnement & Conception",
    steps: {
      amorcage: ["Détection de consortiums innovation S3"],
      diagnostic: [],
      coaching: [],
      planification: ["Accompagnement stratégie données territoriales"],
      implementation: [],
      investissement: []
    }
  }
];

const initialBeneficiaries: Beneficiary[] = [
  {
    id: "ben-1",
    name: "MecaWall S.A.",
    size: "PME (120 emp.)",
    sector: "Manufacturing",
    location: "Namur",
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
            realized: [{ serviceName: "Mise en relation partenaires IA & industrie", status: "completed", org: "Pôle Mecatech", resultText: "Partenaire trouvé pour le tri optique" }]
          },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "Agence du Numérique", resultText: "Maturité numérique de départ évaluée" }]
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: []
          },
          planification: {
            proposed: ["Accompagnement stratégie données territoriales"],
            realized: []
          },
          implementation: {
            proposed: ["Accompagnement transformation digitale industrie 4.0"],
            realized: [{ serviceName: "Accompagnement transformation digitale industrie 4.0", status: "active", org: "Wallonie Entreprendre", resultText: "Lignes de montage en cours de digitalisation" }]
          },
          investissement: {
            proposed: ["Recherche de financement innovation"],
            realized: []
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
          amorcage: { proposed: [], realized: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: []
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: []
          },
          planification: { proposed: [], realized: [] },
          implementation: { proposed: [], realized: [] },
          investissement: { proposed: [], realized: [] }
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
            realized: [{ serviceName: "Détection de consortiums innovation S3", status: "completed", org: "SPW EER", resultText: "Consortium validé avec l'ULiège" }]
          },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "AdN", resultText: "Maturité TRL 3 évaluée" }]
          },
          coaching: { proposed: [], realized: [] },
          planification: { proposed: [], realized: [] },
          implementation: {
            proposed: ["Programme expérimentation IA industrielle"],
            realized: []
          },
          investissement: { proposed: [], realized: [] }
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
          amorcage: { proposed: [], realized: [] },
          diagnostic: { proposed: [], realized: [] },
          coaching: {
            proposed: ["Accompagnement export international digital"],
            realized: []
          },
          planification: { proposed: [], realized: [] },
          implementation: { proposed: [], realized: [] },
          investissement: {
            proposed: ["Recherche de financement innovation"],
            realized: [{ serviceName: "Recherche de financement innovation", status: "completed", org: "Wallonie Entreprendre", resultText: "Aide à la R&D de 250k€ obtenue" }]
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
          { label: "Équipe formée au Phishing", before: "0%", after: "100%", unit: "", isPositive: true },
          { label: "Indisponibilité IT (jours/an)", before: 4.5, after: 0.1, unit: " j", isPositive: true }
        ],
        steps: {
          amorcage: { proposed: [], realized: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "AdN", resultText: "Maturité cyber évaluée" }]
          },
          coaching: {
            proposed: ["Parcours cybersécurité PME"],
            realized: [
              { serviceName: "Parcours cybersécurité PME", status: "completed", org: "AKT / AdN", resultText: "Audit de vulnérabilité & pare-feu" },
              { serviceName: "Formation Cyber express", status: "completed", org: "AdN", resultText: "Sensibilisation phishing effectuée" }
            ]
          },
          planification: { proposed: [], realized: [] },
          implementation: { proposed: [], realized: [] },
          investissement: { proposed: [], realized: [] }
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
          amorcage: { proposed: [], realized: [] },
          diagnostic: {
            proposed: ["Diagnostic de maturité numérique PME"],
            realized: [{ serviceName: "Diagnostic de maturité numérique PME", status: "completed", org: "AdN", resultText: "Audit énergétique préliminaire" }]
          },
          coaching: { proposed: [], realized: [] },
          planification: {
            proposed: ["Programme transition énergétique industrielle"],
            realized: [{ serviceName: "Programme transition énergétique industrielle", status: "completed", org: "Cluster Tweed", resultText: "Plan carbone validé par un expert" }]
          },
          implementation: {
            proposed: ["Accompagnement transformation digitale industrie 4.0"],
            realized: [{ serviceName: "Accompagnement transformation digitale industrie 4.0", status: "completed", org: "Wallonie Entreprendre", resultText: "Optimisation de l'outil industriel" }]
          },
          investissement: { proposed: [], realized: [] }
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
            realized: []
          },
          diagnostic: { proposed: [], realized: [] },
          coaching: { proposed: [], realized: [] },
          planification: {
            proposed: ["Accompagnement stratégie données territoriales"],
            realized: [{ serviceName: "Accompagnement stratégie données territoriales", status: "completed", org: "Agence du Numérique", resultText: "Schéma directeur OpenData approuvé" }]
          },
          implementation: { proposed: [], realized: [] },
          investissement: { proposed: [], realized: [] }
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

export default function ServicesContainer() {
  const [activeTab, setActiveTab] = useState<"list" | "encode" | "analytics" | "beneficiaries" | "journeys" | "craft">("list");
  const [servicesList, setServicesList] = useState(walloonServices);
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>("ben-1");
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>("j-1");
  const [searchQuery, setSearchQuery] = useState("");

  // Journey Catalog States
  const [journeyTemplates, setJourneyTemplates] = useState<JourneyTemplate[]>(initialJourneyTemplates);
  const [editingTemplate, setEditingTemplate] = useState<JourneyTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [beFilter, setBeFilter] = useState("All");
  const [euStrategyFilter, setEuStrategyFilter] = useState("All");
  const [localS3Filter, setLocalS3Filter] = useState("All");
  const [filiereFilter, setFiliereFilter] = useState("All");
  const [valueChainFilter, setValueChainFilter] = useState("All");

  // Form States for Template
  const [formName, setFormName] = useState("");
  const [formProvider, setFormProvider] = useState("");
  const [formObjective, setFormObjective] = useState("");
  const [formBE, setFormBE] = useState<JourneyTemplate["businessEvent"]>("Operating Business");
  const [formEU, setFormEU] = useState<JourneyTemplate["euStrategy"]>("Décennie Numérique");
  const [formS3, setFormS3] = useState<JourneyTemplate["localS3"]>("Industrie 4.0");
  const [formFiliere, setFormFiliere] = useState<JourneyTemplate["filiere"]>("Industrie Manufacturière");
  const [formValueChainSegment, setFormValueChainSegment] = useState<JourneyTemplate["valueChainSegment"]>("Production & Industrialisation");
  const [formSteps, setFormSteps] = useState<JourneyTemplate["steps"]>({
    amorcage: [],
    diagnostic: [],
    coaching: [],
    planification: [],
    implementation: [],
    investissement: []
  });

  const handleStartCreateTemplate = () => {
    setFormName("");
    setFormProvider("");
    setFormObjective("");
    setFormBE("Operating Business");
    setFormEU("Décennie Numérique");
    setFormS3("Industrie 4.0");
    setFormFiliere("Industrie Manufacturière");
    setFormValueChainSegment("Production & Industrialisation");
    setFormSteps({
      amorcage: [],
      diagnostic: [],
      coaching: [],
      planification: [],
      implementation: [],
      investissement: []
    });
    setEditingTemplate(null);
    setIsCreatingTemplate(true);
  };

  const handleStartEditTemplate = (t: JourneyTemplate) => {
    setFormName(t.name);
    setFormProvider(t.provider);
    setFormObjective(t.objective);
    setFormBE(t.businessEvent);
    setFormEU(t.euStrategy);
    setFormS3(t.localS3);
    setFormFiliere(t.filiere || "Industrie Manufacturière");
    setFormValueChainSegment(t.valueChainSegment || "Production & Industrialisation");
    setFormSteps({ ...t.steps });
    setEditingTemplate(t);
    setIsCreatingTemplate(false);
  };

  const handleSaveTemplate = () => {
    if (!formName || !formProvider || !formObjective) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires (Nom, Fournisseur, Objectif).");
      return;
    }

    if (editingTemplate) {
      setJourneyTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
        ...t,
        name: formName,
        provider: formProvider,
        objective: formObjective,
        businessEvent: formBE,
        euStrategy: formEU,
        localS3: formS3,
        filiere: formFiliere,
        valueChainSegment: formValueChainSegment,
        steps: formSteps
      } : t));
    } else {
      const newT: JourneyTemplate = {
        id: `t-${Date.now()}`,
        name: formName,
        provider: formProvider,
        objective: formObjective,
        businessEvent: formBE,
        euStrategy: formEU,
        localS3: formS3,
        filiere: formFiliere,
        valueChainSegment: formValueChainSegment,
        steps: formSteps
      };
      setJourneyTemplates(prev => [...prev, newT]);
    }

    setEditingTemplate(null);
    setIsCreatingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("❌ Êtes-vous sûr de vouloir supprimer ce modèle de parcours ?")) {
      setJourneyTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleToggleServiceInStep = (phaseKey: keyof JourneyTemplate["steps"], serviceName: string) => {
    setFormSteps(prev => {
      const current = prev[phaseKey];
      const updated = current.includes(serviceName)
        ? current.filter(n => n !== serviceName)
        : [...current, serviceName];
      return {
        ...prev,
        [phaseKey]: updated
      };
    });
  };

  // Simulator States
  const [simPhase, setSimPhase] = useState<string>("amorcage");
  const [simService, setSimService] = useState<string>("");
  const [simStatus, setSimStatus] = useState<"completed" | "active">("completed");
  const [simResult, setSimResult] = useState<string>("");
  const [simNewJourneyName, setSimNewJourneyName] = useState<string>("Transformation Numérique (Industrie 4.0)");

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
              { serviceName, status, org: orgName, resultText: resultText || "Réalisation enregistrée" }
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

  // Dynamic DB fetching and merging with fallback seeds
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const dbServices = await res.json();
          console.log("Loaded services from database:", dbServices);

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

          // Mix in any remaining rich mock services not yet saved to DB
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
        console.error("Error loading services from database:", err);
      }
    };

    fetchServices();
  }, [refreshTrigger]);

  // Filter logic
  const filteredServices = selectedTheme === "All"
    ? servicesList
    : servicesList.filter(s => s.themes.includes(selectedTheme as any));

  // Calculating aggregate statistics
  const totalAccompanied = servicesList.reduce((sum, s) => sum + s.kpis.companiesAccompanied, 0);
  const avgSatisfaction = servicesList.length ? Math.round(servicesList.reduce((sum, s) => sum + s.kpis.satisfactionRate, 0) / servicesList.length) : 0;
  const avgSovereignty = servicesList.length ? Math.round(servicesList.reduce((sum, s) => sum + s.impacts.sovereignty, 0) / servicesList.length) : 0;

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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Visualisez, concevez et intégrez les relations sémantiques des services d'innovation industrielle.
          </p>
        </div>

        {/* Triple Tab switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "list"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <List className="w-3.5 h-3.5" />
            Catalogue
          </button>

          <button
            onClick={() => setActiveTab("encode")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "encode"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvel Encodage
          </button>
          <button
            onClick={() => setActiveTab("beneficiaries")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "beneficiaries"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Suivi Bénéficiaires
          </button>
          <button
            onClick={() => setActiveTab("journeys")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "journeys"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Route className="w-3.5 h-3.5" />
            Gestion des Parcours
          </button>
          <button
            onClick={() => setActiveTab("craft")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "craft"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            Écosystème & Observatoire
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              activeTab === "analytics"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analyses & Graphes
          </button>
        </div>
      </div>

      {/* 1. CATALOGUE VIEW */}
      {activeTab === "list" && (
        <div className="space-y-6">
          {/* Key KPI Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Services Encodés</span>
                <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{servicesList.length}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400">Filtrer par Thème :</span>
            {["All", "IA", "Industrie 4.0", "Cybersécurité", "Innovation", "Énergie"].map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition",
                  selectedTheme === theme
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                )}
              >
                {theme}
              </button>
            ))}
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
                      className="hover:bg-primary-50/35 dark:hover:bg-primary-950/15 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100 max-w-[200px]">
                        <div className="hover:text-primary-500 transition-colors">{svc.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal truncate mt-0.5">{svc.uri}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{svc.organisationId}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {svc.themes.map((t: string) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-semibold text-[9px] border border-primary-100 dark:border-primary-900">
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
      )}

      {/* 2. ANALYTICS & GRAPH VIEW */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Top Row: Aggregated Radar & S3 Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SVG Aggregated Impact Radar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-primary-500">
                  Radar Global d'Impact Territorial
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Moyenne des contributions sémantiques aux 5 axes stratégiques de Wallonie (S3).
                </p>
              </div>

              <div className="flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <svg width="240" height="240" className="overflow-visible">
                  {/* Grid concentric circles */}
                  <circle cx="120" cy="120" r="90" className="stroke-gray-200 dark:stroke-gray-700 fill-none" strokeWidth="1" />
                  <circle cx="120" cy="120" r="60" className="stroke-gray-200 dark:stroke-gray-800 fill-none" strokeWidth="1" strokeDasharray="3" />
                  <circle cx="120" cy="120" r="30" className="stroke-gray-200 dark:stroke-gray-800 fill-none" strokeWidth="1" strokeDasharray="3" />

                  {/* Axis lines */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = 120 + 90 * Math.cos(angle);
                    const y = 120 + 90 * Math.sin(angle);
                    return (
                      <line key={i} x1="120" y1="120" x2={x} y2={y} className="stroke-gray-200 dark:stroke-gray-800" strokeWidth="1" />
                    );
                  })}

                  {/* Filled Aggregated Area */}
                  {/* Aggregated values: Carbon: 45%, Sovereignty: 84%, Resilience: 90%, Competitiveness: 94%, Employment (Jobs): 81% */}
                  <polygon
                    points="120,79.5 191.8,96.7 173.2,166.4 67.3,166.4 49.3,96.7"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="2.5"
                  />

                  {/* Node dots */}
                  <circle cx="120" cy="79.5" r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                  <circle cx="191.8" cy="96.7" r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                  <circle cx="173.2" cy="166.4" r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                  <circle cx="67.3" cy="166.4" r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />
                  <circle cx="49.3" cy="96.7" r="4.5" className="fill-white dark:fill-gray-900" stroke="#0f766e" strokeWidth="2.5" />

                  {/* Axis Labels */}
                  <text x="120" y="20" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Carbon (45%)</text>
                  <text x="215" y="100" textAnchor="start" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Souveraineté (84%)</text>
                  <text x="195" y="195" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Résilience (90%)</text>
                  <text x="45" y="195" textAnchor="middle" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Compétitivité (94%)</text>
                  <text x="25" y="100" textAnchor="end" className="text-[9px] font-extrabold fill-gray-500 dark:fill-gray-400">Emploi (81%)</text>
                </svg>
              </div>
            </div>

            {/* S3 Priority Heatmap Matrix */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-green-500">
                  Alignement Thématique S3 (Heatmap)
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cartographie des 10 services vis-à-vis des thématiques industrielles structurantes.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { theme: "IA & Algorithmes", services: ["svc-1", "svc-3", "svc-9"], color: "bg-teal-500" },
                  { theme: "Industrie 4.0 & IoT", services: ["svc-2", "svc-3", "svc-9"], color: "bg-blue-500" },
                  { theme: "Cybersécurité", services: ["svc-5", "svc-6"], color: "bg-red-500" },
                  { theme: "Transition Énergétique", services: ["svc-7"], color: "bg-green-500" },
                  { theme: "Recherche & Consortium S3", services: ["svc-4", "svc-8", "svc-10"], color: "bg-purple-500" },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center gap-3">
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
                                : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700"
                            )}
                          >
                            {s.id.replace("svc-", "")}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-[8px] text-gray-400 pt-1 font-bold">
                  <span>Services : 1 à 10</span>
                  <span>Survolez pour identifier le service</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Dynamic Semantic Dependency Pipeline Graph */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-blue-500 flex items-center gap-2">
                <Layers className="w-4 h-4 animate-pulse" />
                Analyse des Parcours Régionaux : Gaps & Doublons
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Visualisation en temps réel de l'offre de services publics répartie sur les 6 étapes clés de votre parcours d'entreprise. Identifiez instantanément les doublons opérationnels (plusieurs dispositifs sur le même créneau) et les ruptures de parcours (zones blanches).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-2">
              {[
                { id: "amorcage", label: "1. Amorçage", description: "Sensibilisation et mise en relation" },
                { id: "diagnostic", label: "2. Diagnostic", description: "Évaluation de maturité et TRL" },
                { id: "coaching", label: "3. Coaching", description: "Conseil court et cybersécurité" },
                { id: "planification", label: "4. Planification", description: "Roadmap et stratégie de données" },
                { id: "implementation", label: "5. Mise en œuvre", description: "Accompagnement, labs et prototypes" },
                { id: "investissement", label: "6. Investissement", description: "Subsides et capital risque" },
              ].map((phase) => {
                // Function to dynamically assign services list to their logical journey steps
                const getServicePhase = (svc: any) => {
                  const idNum = String(svc.id).replace("svc-", "");
                  if (idNum === "8" || idNum === "9") return "amorcage";
                  if (idNum === "1") return "diagnostic";
                  if (idNum === "6" || idNum === "5") return "coaching";
                  if (idNum === "10") return "planification";
                  if (idNum === "2" || idNum === "3" || idNum === "7") return "implementation";
                  if (idNum === "4") return "investissement";
                  
                  // Dynamic fallback for newly encoded services from the DB
                  const name = (svc.name || "").toLowerCase();
                  if (name.includes("financ") || name.includes("subside") || name.includes("invest")) return "investissement";
                  if (name.includes("diagnost") || name.includes("evalu") || name.includes("audit")) return "diagnostic";
                  if (name.includes("coach") || name.includes("cyber") || name.includes("sensib")) return "coaching";
                  if (name.includes("plan") || name.includes("strateg")) return "planification";
                  if (name.includes("implem") || name.includes("prototyp") || name.includes("ia") || name.includes("transition")) return "implementation";
                  return "amorcage";
                };

                // Filter servicesList (which includes dynamic DB services) belonging to this phase
                const phaseServices = servicesList.filter((s: any) => getServicePhase(s) === phase.id);
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
                      {/* Phase Header */}
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

                    {/* Services list in this phase */}
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

            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 text-[10px] font-medium flex items-center gap-2 max-w-4xl mx-auto text-center justify-center mt-2">
              <Info className="w-4 h-4" />
              <span>Cette vue analytique utilise les métadonnées de parcours cibles pour classifier dynamiquement l'offre territoriale wallonne (AdN, WE, AWEX, Mecatech) et révéler la couverture globale des besoins des PME.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. WIZARD STEP VIEW */}
      {activeTab === "encode" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-6 shadow-sm">
          <Wizard onSuccess={() => {
            setActiveTab("list");
            setRefreshTrigger(prev => prev + 1);
          }} />
        </div>
      )}

      {/* 4. BENEFICIARIES VIEW */}
      {activeTab === "beneficiaries" && (() => {
        const getPhaseDiagnostic = (phaseId: string, step: BeneficiaryJourneyInstance["steps"][keyof BeneficiaryJourneyInstance["steps"]]) => {
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
              bg: "bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20",
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
              bg: "bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20",
              desc: "Plusieurs services suivis pour un même objectif."
            };
          }
          return {
            status: "match",
            label: "Aligné",
            bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20",
            desc: "Le parcours recommandé a été respecté avec succès."
          };
        };

        const b = beneficiaries.find(x => x.id === selectedBeneficiaryId) || beneficiaries[0];
        const selectedJourney = b.journeys.find(j => j.id === selectedJourneyId) || b.journeys[0];

        const handleLocalAddProposed = () => {
          if (!simService) return;
          handleAddProposed(simPhase, simService);
        };

        const handleLocalAddRealized = () => {
          if (!simService) return;
          handleAddRealized(simPhase, simService, simStatus, simResult);
          setSimResult("");
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
                  Comparez les recommandations formulées (Proposé) aux actions réellement entreprises (Réalisé) par chaque PME wallonne, identifiez les zones blanches (gaps) et les redondances (doublons), et évaluez si le parcours a porté ses fruits.
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
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher une PME..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-gray-700 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
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
                      let badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20";
                      if (effStatus === "Succès Majeur") {
                        badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20";
                      } else if (effStatus === "En bonne voie") {
                        badgeColor = "bg-teal-500/10 text-teal-600 dark:text-teal-450 border-teal-500/20";
                      } else if (effStatus === "Mitigé") {
                        badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20";
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
                        <Building2 className="w-5 h-5 text-teal-600" />
                        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100">{b.name}</h2>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400">
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
                          // Reset local beneficiary data to seeds
                          const orig = initialBeneficiaries.find(o => o.id === b.id);
                          if (orig) {
                            setBeneficiaries(prev => prev.map(item => item.id === b.id ? JSON.parse(JSON.stringify(orig)) : item));
                          }
                        }}
                        title="Restaurer l'état initial de simulation"
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-750 text-gray-400 dark:text-gray-500 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Journey Switcher Tabs */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Parcours Actifs du Bénéficiaire (Cliquez pour basculer)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {b.journeys.map((j) => {
                        const isSelected = j.id === selectedJourneyId;
                        let jBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-450";
                        if (j.effectivenessStatus === "Succès Majeur") jBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-450";
                        else if (j.effectivenessStatus === "En bonne voie") jBadgeColor = "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-450";
                        else if (j.effectivenessStatus === "Mitigé") jBadgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-450";

                        return (
                          <div
                            key={j.id}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-xs",
                              isSelected
                                ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                            onClick={() => setSelectedJourneyId(j.id)}
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-bold leading-tight">{j.name}</span>
                              <span className={cn("text-[9px] mt-0.5 font-medium", isSelected ? "text-teal-100" : "text-gray-450 dark:text-gray-400")}>
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

                  {/* Bilan d'impact panel ("A porté ses fruits ?") */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Effectiveness score gauge */}
                    <div className="md:col-span-4 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-150 dark:border-gray-800/80 flex flex-col items-center justify-between text-center min-h-[140px]">
                      <div className="w-full">
                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                          Efficacité du Parcours
                        </span>
                        <div className="flex items-baseline justify-center gap-1 mt-2">
                          <span className="text-3xl font-black text-teal-600 dark:text-teal-400">{selectedJourney ? selectedJourney.effectivenessScore : 0}</span>
                          <span className="text-sm font-bold text-gray-400">/ 100</span>
                        </div>
                      </div>

                      <div className="w-full mt-3 space-y-1">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              (selectedJourney ? selectedJourney.effectivenessScore : 0) >= 90
                                ? "bg-emerald-500"
                                : (selectedJourney ? selectedJourney.effectivenessScore : 0) >= 70
                                  ? "bg-teal-500"
                                  : (selectedJourney ? selectedJourney.effectivenessScore : 0) >= 40
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                            )}
                            style={{ width: `${selectedJourney ? selectedJourney.effectivenessScore : 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-extrabold block text-gray-500 dark:text-gray-450 pt-1">
                          Jauge d'atteinte des objectifs S3
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
                        {selectedJourney ? selectedJourney.effectivenessExplanation : ""}
                      </div>

                      {/* Comparateur Avant vs Après */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Mesures & Retours d'Impact (Avant vs Après)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {selectedJourney ? selectedJourney.metrics.map((metric: any, mIdx: number) => (
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
                          )) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparative Gaps & Doublons Grid */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-5">
                  {/* Section Header */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        Analyse du Parcours : Gaps &amp; Doublons
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Cartographie des 6 phases pour <strong>{b.name}</strong>. Gaps = services recommandés non initiés · Doublons = chevauchements redondants.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />Gap
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />Doublon
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Match
                      </span>
                    </div>
                  </div>

                  {/* Phase Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {([
                      { id: "amorcage",      num: "1", label: "Amorçage",      desc: "Sensibilisation & mise en relation" },
                      { id: "diagnostic",    num: "2", label: "Diagnostic",    desc: "Évaluation maturité & TRL" },
                      { id: "coaching",      num: "3", label: "Coaching",      desc: "Conseils & cybersécurité" },
                      { id: "planification", num: "4", label: "Planification", desc: "Roadmap & stratégie" },
                      { id: "implementation",num: "5", label: "Mise en œuvre", desc: "Accompagnement & prototype" },
                      { id: "investissement",num: "6", label: "Investissement", desc: "Financements & subsides" }
                    ] as const).map((phase) => {
                      const stepData = selectedJourney ? selectedJourney.steps[phase.id] : { proposed: [], realized: [] };
                      const diag = getPhaseDiagnostic(phase.id, stepData);

                      return (
                        <div
                          key={phase.id}
                          className={cn(
                            "flex flex-col rounded-xl border overflow-hidden transition-all duration-300",
                            diag.status === "gap"
                              ? "border-rose-300 dark:border-rose-800"
                              : diag.status === "overlap"
                                ? "border-amber-300 dark:border-amber-800"
                                : diag.status === "opportunity"
                                  ? "border-blue-300 dark:border-blue-800"
                                  : diag.status === "match"
                                    ? "border-emerald-300 dark:border-emerald-800"
                                    : "border-gray-200 dark:border-gray-700"
                          )}
                        >
                          {/* Card Header — couleur de fond selon statut */}
                          <div className={cn(
                            "px-3 pt-3 pb-2",
                            diag.status === "gap"       ? "bg-rose-50 dark:bg-rose-950/20"
                            : diag.status === "overlap"   ? "bg-amber-50 dark:bg-amber-950/20"
                            : diag.status === "opportunity"? "bg-blue-50 dark:bg-blue-950/20"
                            : diag.status === "match"     ? "bg-emerald-50 dark:bg-emerald-950/20"
                            : "bg-gray-50 dark:bg-gray-900/50"
                          )}>
                            {/* Numéro + Badge statut sur la même ligne, bien séparés */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-[10px] font-black text-gray-600 dark:text-gray-300 shadow-sm">
                                {phase.num}
                              </span>
                              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap", diag.bg)}>
                                {diag.label}
                              </span>
                            </div>
                            {/* Label de la phase sur sa propre ligne */}
                            <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100 leading-tight">
                              {phase.label}
                            </p>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                              {phase.desc}
                            </p>
                          </div>

                          {/* Card Body */}
                          <div className="flex-1 flex flex-col gap-3 p-3 bg-white dark:bg-gray-800">
                            {/* Section Proposé */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                <span className="text-[9px] font-extrabold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                                  Proposé
                                </span>
                              </div>
                              {stepData.proposed.length > 0 ? (
                                <div className="space-y-1">
                                  {stepData.proposed.map((pSvc: string, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between gap-1 bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900">
                                      <span className="text-[10px] text-gray-700 dark:text-gray-300 font-medium truncate" title={pSvc}>{pSvc}</span>
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
                                <div className="space-y-1">
                                  {stepData.realized.map((rSvc: any, idx: number) => {
                                    const isCompleted = rSvc.status === "completed";
                                    return (
                                      <div key={idx} className="flex items-start gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
                                        <span className={cn(
                                          "w-1.5 h-1.5 rounded-full shrink-0 mt-1",
                                          isCompleted ? "bg-emerald-500" : "bg-teal-400 animate-pulse"
                                        )} />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate leading-tight" title={rSvc.serviceName}>
                                            {rSvc.serviceName}
                                          </p>
                                          <div className="flex items-center justify-between mt-0.5 gap-1">
                                            <span className="text-[8px] text-gray-400 truncate">{rSvc.org}</span>
                                            <span className={cn("text-[8px] font-bold px-1 rounded shrink-0", isCompleted ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" : "text-teal-600 bg-teal-100 dark:bg-teal-900/30")}>
                                              {isCompleted ? "✓ Fait" : "⟳ En cours"}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveRealized(phase.id, idx)}
                                          title="Retirer"
                                          className="text-gray-400 hover:text-rose-500 p-0.5 rounded transition shrink-0 cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
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

                            {/* Diagnostic */}
                            <p className="text-[8.5px] text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-2 mt-auto leading-snug">
                              {diag.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Simulator Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-650 dark:text-teal-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      Cockpit de Simulation de Parcours
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    Utilisez ce panneau pour ajouter des recommandations ou simuler des actions pour {b.name}. Les calculs d'efficacité, les statuts de gaps et de doublons se mettront à jour en temps réel.
                  </p>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 pt-2">
                    {/* simulator col 1: propose service */}
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
                          className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Ajouter aux Recommandations
                        </button>
                      </div>
                    </div>

                    {/* simulator col 2: record realized */}
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
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Enregistrer la Réalisation
                        </button>
                      </div>
                    </div>

                    {/* simulator col 3: enroll new journey */}
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

                        <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight italic bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                          <strong>Objectif :</strong> {journeyTemplates.find(t => t.name === simNewJourneyName)?.objective}
                        </div>

                        <button
                          onClick={() => handleEnrollJourney(simNewJourneyName)}
                          className="w-full py-1.5 bg-purple-650 hover:bg-purple-755 text-white bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Inscrire au Parcours
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. JOURNEY MANAGEMENT CATALOGUE */}
      {activeTab === "journeys" && (() => {
        // Filter templates based on beFilter, euStrategyFilter, localS3Filter, filiereFilter, and valueChainFilter
        const filteredTemplates = journeyTemplates.filter(t => {
          const matchBE = beFilter === "All" || t.businessEvent === beFilter;
          const matchEU = euStrategyFilter === "All" || t.euStrategy === euStrategyFilter;
          const matchS3 = localS3Filter === "All" || t.localS3 === localS3Filter;
          const matchFiliere = filiereFilter === "All" || t.filiere === filiereFilter;
          const matchValueChain = valueChainFilter === "All" || t.valueChainSegment === valueChainFilter;
          return matchBE && matchEU && matchS3 && matchFiliere && matchValueChain;
        });

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header description */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-600 dark:text-purple-450 flex items-center gap-1.5">
                  <Route className="w-5 h-5 text-purple-500" />
                  <span>Catalogue de Méthodes & Gestion des Parcours</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Définissez des parcours types (méthodes d'accompagnement) et associez-leur des services du catalogue régional (CPSV-AP). Ces modèles servent de gabarits lors de l'inscription des bénéficiaires.
                </p>
              </div>
              {!isCreatingTemplate && !editingTemplate && (
                <button
                  onClick={handleStartCreateTemplate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Parcours
                </button>
              )}
            </div>

            {/* Editing or Creating Mode */}
            { (isCreatingTemplate || editingTemplate) ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-md space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-purple-500">
                    {editingTemplate ? "Modifier le Modèle de Parcours" : "Créer un Modèle de Parcours"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Renseignez les métadonnées et associez des services du catalogue aux étapes clés.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Metadata */}
                  <div className="md:col-span-1 space-y-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                      Informations Générales
                    </span>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Nom du Parcours *
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Transition Énergétique PME"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Chef de file / Fournisseur *
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Cluster Tweed / WE"
                        value={formProvider}
                        onChange={(e) => setFormProvider(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Objectif Stratégique *
                      </label>
                      <textarea
                        placeholder="ex: Réduire l'empreinte carbone et optimiser l'énergie"
                        value={formObjective}
                        onChange={(e) => setFormObjective(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Taxonomies d'Alignement
                      </span>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Classification Européenne (CPSV-AP BE)
                        </label>
                        <select
                          value={formBE}
                          onChange={(e) => setFormBE(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Starting Business">Starting Business (Création)</option>
                          <option value="Financing Business">Financing Business (Financement)</option>
                          <option value="Operating Business">Operating Business (Exploitation & Innovation)</option>
                          <option value="Expanding Business">Expanding Business (Internationalisation)</option>
                          <option value="Closing Business">Closing Business (Cessation)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Priorité de la Stratégie Européenne
                        </label>
                        <select
                          value={formEU}
                          onChange={(e) => setFormEU(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Décennie Numérique">Décennie Numérique (IA / Cloud / Big Data)</option>
                          <option value="Pacte Vert (Green Deal)">Pacte Vert (Green Deal - Décarbonation)</option>
                          <option value="Souveraineté & Cyber-résilience">Souveraineté & Cyber-résilience</option>
                          <option value="Recherche & Collaboration S3">Recherche & Collaboration S3</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Thématique S3 Région Wallonne
                        </label>
                        <select
                          value={formS3}
                          onChange={(e) => setFormS3(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="IA & Algorithmes">IA & Algorithmes</option>
                          <option value="Industrie 4.0">Industrie 4.0 & IoT</option>
                          <option value="Cybersécurité">Cybersécurité</option>
                          <option value="Transition Énergétique">Transition Énergétique</option>
                          <option value="Recherche & Collaboration S3">Recherche & Collaboration S3</option>
                          <option value="Accompagnement Économique & Export">Accompagnement Économique & Export</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Filière Industrielle S3 Wallonie
                        </label>
                        <select
                          value={formFiliere}
                          onChange={(e) => setFormFiliere(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Agroalimentaire">Agroalimentaire</option>
                          <option value="Sciences de la Vie">Sciences de la Vie</option>
                          <option value="Industrie Manufacturière">Industrie Manufacturière</option>
                          <option value="Énergies Propres">Énergies Propres</option>
                          <option value="Technologies du Futur">Technologies du Futur</option>
                          <option value="Construction durable">Construction durable</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Segment de Chaîne de Valeurs S3
                        </label>
                        <select
                          value={formValueChainSegment}
                          onChange={(e) => setFormValueChainSegment(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Recherche & Développement">Recherche & Développement</option>
                          <option value="Approvisionnement & Conception">Approvisionnement & Conception</option>
                          <option value="Production & Industrialisation">Production & Industrialisation</option>
                          <option value="Logistique & Distribution">Logistique & Distribution</option>
                          <option value="Marketing & Export">Marketing & Export</option>
                          <option value="Économie Circulaire & Fin de vie">Économie Circulaire & Fin de vie</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Steps mapping selection */}
                  <div className="md:col-span-2 space-y-4">
                    <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block border-b border-gray-100 dark:border-gray-700 pb-2 mb-2 pl-1">
                      Association des Services aux 6 Étapes du Parcours
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 select-none">
                      {([
                        { id: "amorcage", label: "1. Amorçage" },
                        { id: "diagnostic", label: "2. Diagnostic" },
                        { id: "coaching", label: "3. Coaching" },
                        { id: "planification", label: "4. Planification" },
                        { id: "implementation", label: "5. Mise en œuvre" },
                        { id: "investissement", label: "6. Investissement" }
                      ] as const).map((phase) => {
                        const activeServices = formSteps[phase.id] || [];

                        return (
                          <div key={phase.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                              {phase.label} ({activeServices.length} associés)
                            </span>

                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 border border-gray-200/60 dark:border-gray-800 p-2 rounded-lg bg-white dark:bg-gray-950">
                              {servicesList.map((service) => {
                                const checked = activeServices.includes(service.name);
                                return (
                                  <label
                                    key={service.id}
                                    className={cn(
                                      "flex items-start gap-2 p-1.5 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-[10px] border",
                                      checked
                                        ? "border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-300"
                                        : "border-transparent text-gray-600 dark:text-gray-400"
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => handleToggleServiceInStep(phase.id, service.name)}
                                      className="mt-0.5 accent-purple-600 w-3 h-3 shrink-0"
                                    />
                                    <div className="leading-tight">
                                      <div className="font-semibold">{service.name}</div>
                                      <div className="text-[8px] text-gray-400">{service.organisationId}</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditingTemplate(null);
                      setIsCreatingTemplate(false);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
                  >
                    Enregistrer le Parcours
                  </button>
                </div>
              </div>
            ) : (
              // Journey List View
              <div className="space-y-6">
                {/* Taxonomy Filter Panel */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm space-y-4">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Filtres Multicritères (Alignements Sémantiques & Stratégiques)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Filter 1: BE */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Classification Européenne (CPSV-AP BE)
                      </label>
                      <select
                        value={beFilter}
                        onChange={(e) => setBeFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="All">Toutes les fonctions (All)</option>
                        <option value="Starting Business">Starting Business (Création)</option>
                        <option value="Financing Business">Financing Business (Financement)</option>
                        <option value="Operating Business">Operating Business (Exploitation & Innovation)</option>
                        <option value="Expanding Business">Expanding Business (Internationalisation)</option>
                        <option value="Closing Business">Closing Business (Cessation)</option>
                      </select>
                    </div>

                    {/* Filter 2: EU Strategy */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Priorité Stratégique Européenne
                      </label>
                      <select
                        value={euStrategyFilter}
                        onChange={(e) => setEuStrategyFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="All">Toutes les priorités EU Strategy</option>
                        <option value="Décennie Numérique">Décennie Numérique (AI & Cloud)</option>
                        <option value="Pacte Vert (Green Deal)">Pacte Vert (Green Deal)</option>
                        <option value="Souveraineté & Cyber-résilience">Souveraineté & Cyber-résilience</option>
                        <option value="Recherche & Collaboration S3">Recherche & Collaboration S3</option>
                      </select>
                    </div>

                    {/* Filter 3: RW S3 */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Thématique Locale S3 Wallonie
                      </label>
                      <select
                        value={localS3Filter}
                        onChange={(e) => setLocalS3Filter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="All">Toutes les thématiques S3</option>
                        <option value="IA & Algorithmes">IA & Algorithmes</option>
                        <option value="Industrie 4.0">Industrie 4.0</option>
                        <option value="Cybersécurité">Cybersécurité</option>
                        <option value="Transition Énergétique">Transition Énergétique</option>
                        <option value="Recherche & Collaboration S3">Recherche & Collaboration S3</option>
                        <option value="Accompagnement Économique & Export">Accompagnement Économique & Export</option>
                      </select>
                    </div>

                    {/* Filter 4: Filière S3 */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Filière Industrielle S3
                      </label>
                      <select
                        value={filiereFilter}
                        onChange={(e) => setFiliereFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="All">Toutes les filières (All)</option>
                        <option value="Agroalimentaire">Agroalimentaire</option>
                        <option value="Sciences de la Vie">Sciences de la Vie</option>
                        <option value="Industrie Manufacturière">Industrie Manufacturière</option>
                        <option value="Énergies Propres">Énergies Propres</option>
                        <option value="Technologies du Futur">Technologies du Futur</option>
                        <option value="Construction durable">Construction durable</option>
                      </select>
                    </div>

                    {/* Filter 5: Chaîne de Valeurs */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Chaîne de Valeurs
                      </label>
                      <select
                        value={valueChainFilter}
                        onChange={(e) => setValueChainFilter(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none text-gray-700 dark:text-gray-100 focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="All">Tous les segments (All)</option>
                        <option value="Recherche & Développement">Recherche & Développement</option>
                        <option value="Approvisionnement & Conception">Approvisionnement & Conception</option>
                        <option value="Production & Industrialisation">Production & Industrialisation</option>
                        <option value="Logistique & Distribution">Logistique & Distribution</option>
                        <option value="Marketing & Export">Marketing & Export</option>
                        <option value="Économie Circulaire & Fin de vie">Économie Circulaire & Fin de vie</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => {
                      const totalServicesCount = Object.values(template.steps).reduce((sum, list) => sum + list.length, 0);

                      return (
                        <div
                          key={template.id}
                          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition duration-205 space-y-4"
                        >
                          {/* Top part */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-bold text-gray-950 dark:text-gray-100 leading-tight">
                                {template.name}
                              </h4>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleStartEditTemplate(template)}
                                  title="Modifier ce parcours type"
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-purple-500 rounded transition cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  title="Supprimer ce parcours type"
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-rose-500 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-450 dark:text-gray-400">
                              Chef de file : <strong className="text-gray-700 dark:text-gray-300">{template.provider}</strong>
                            </p>

                            <p className="text-[10px] text-gray-450 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-900/40 p-2 rounded-lg border border-gray-100 dark:border-gray-800 italic">
                              "{template.objective}"
                            </p>

                            {/* Taxonomy Badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
                                {template.businessEvent}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 dark:text-purple-400">
                                {template.euStrategy}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-teal-500/10 text-teal-600 border border-teal-500/20 dark:text-teal-400">
                                {template.localS3}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-450">
                                {template.filiere}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400">
                                {template.valueChainSegment}
                              </span>
                            </div>
                          </div>

                          {/* Services mapping details */}
                          <div className="border-t border-gray-50 dark:border-gray-700/60 pt-3 space-y-2">
                            <span className="text-[8px] font-extrabold text-gray-455 uppercase tracking-wider block">
                              Mappage des Recommandations ({totalServicesCount} services)
                            </span>

                            <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                              {([
                                { id: "amorcage", label: "Amorçage" },
                                { id: "diagnostic", label: "Diagnostic" },
                                { id: "coaching", label: "Coaching" },
                                { id: "planification", label: "Planification" },
                                { id: "implementation", label: "Mise en œuvre" },
                                { id: "investissement", label: "Investissement" }
                              ] as const).map((p) => {
                                const svcList = template.steps[p.id] || [];
                                const count = svcList.length;
                                return (
                                  <div
                                    key={p.id}
                                    title={count > 0 ? svcList.join(", ") : "Aucun service recommandé"}
                                    className={cn(
                                      "flex items-center justify-between p-1 rounded border",
                                      count > 0
                                        ? "bg-purple-500/5 border-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold"
                                        : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-300 dark:text-gray-700"
                                    )}
                                  >
                                    <span className="truncate pr-1">{p.label}</span>
                                    <span className={cn("px-1 py-0.2 rounded text-[7px]", count > 0 ? "bg-purple-500/10 text-purple-650 font-bold border border-purple-500/20" : "bg-gray-100 dark:bg-gray-800")}>
                                      {count}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-12 py-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                      <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Aucun modèle de parcours trouvé</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Ajustez vos filtres taxonomiques ou créez un parcours type personnalisé.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 6. CRAFT ECOSYSTEM & OBSERVATORY */}
      {activeTab === "craft" && (
        <CraftEcosystem />
      )}

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
                          <span key={t} className="px-1.5 py-0.5 text-[9px] font-semibold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Impact Radar or Scores */}
                <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary-500" />
                    Impact Stratégique Régional (S3)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
                    {Object.entries(selectedService.impacts).map(([key, val]: any) => (
                      <div key={key} className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-800/80 shadow-xs">
                        <span className="text-[8px] text-gray-400 font-bold uppercase truncate w-full text-center">{key}</span>
                        <span className="font-extrabold text-primary-600 dark:text-primary-400 text-sm mt-1">{val}%</span>
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
                      className="text-[10px] font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition cursor-pointer"
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
