// src/app/resilience/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass, ArrowLeft, Target, ShieldAlert, Activity, CheckCircle, 
  HelpCircle, ChevronRight, Info, ShieldCheck, Landmark, BarChart3,
  TrendingUp, Users, Coins, Layers, Settings, Database, FileText,
  AlertTriangle, Shield, Play, HelpCircle as HelpIcon, ArrowRight,
  Lock, Brain, RefreshCw, Waves, Flame, Zap
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
  decisionQuestion: string;
  vulnerabilityCode: string;
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
  knownData: string[];
  missingData: string[];
  potentialSources: string[];
  proposed_services: ResponseService[];
  proposed_programs: string[];
  proposed_funding: string[];
  recommended_action: string;
}

// Complete mock dataset for the 6 policy questions (hardened for Phase 5.1)
const SCENARIOS: Record<string, ScenarioData> = {
  energy: {
    id: "energy",
    title: "Crise Énergétique",
    decisionQuestion: "Quelles filières S3 sont les plus exposées à la dépendance au gaz naturel importé ?",
    vulnerabilityCode: "VULN-GAS-NET",
    icon: Flame,
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    bgGrad: "from-amber-500/5 to-orange-500/5",
    description: "Simulation d'une hausse tarifaire extrême et prolongée subie par les industries wallonnes fortement dépendantes du gaz de process thermique.",
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
    knownData: [
      "Codes NACE sectoriels des PME (sidérurgie, ciment, chimie)",
      "Adresses et localisations géographiques BCE",
      "Effectifs déclarés (ONSS)"
    ],
    missingData: [
      "Consommation mensuelle réelle de gaz par site",
      "Type de contrat d'énergie (fixe ou indexé, date d'échéance)",
      "Couverture de hedging d'énergie sur site"
    ],
    potentialSources: [
      "Gestionnaires de Réseaux de Distribution (ORES / RESA)",
      "Gestionnaire de Réseau de Transport de Gaz (Fluxys)",
      "Direction Générale Énergie du SPF Économie"
    ],
    proposed_services: [
      { name: "Diagnostic Efficacité Énergétique Express", provider: "EDIH WallonIA / AdN", type: "Service Technique" },
      { name: "Optimisation Énergétique des Procédés", provider: "Sirris", type: "Service Technique" },
      { name: "Recherche Financement Transition", provider: "Wallonie Entreprendre", type: "Service Conseil" }
    ],
    proposed_programs: ["Plan de Transition Énergétique Industrielle", "Chèques Entreprises - Volet Transition"],
    proposed_funding: ["Garantie publique de crise", "Subvention de transition énergétique de Wallonie Entreprendre", "Subvention conjoncturelle gaz/électricité"],
    recommended_action: "Activer en urgence le guichet de subvention de transition, prioriser l'enrôlement des 142 structures sidérurgiques ciblées dans le diagnostic d'efficacité de l'EDIH, et initier la négociation de données avec les GRD (ORES/RESA) pour affiner les prochaines estimations."
  },
  cyber: {
    id: "cyber",
    title: "Résilience Cyber",
    decisionQuestion: "Quelles organisations critiques dépendent d'un unique fournisseur Cloud ?",
    vulnerabilityCode: "VULN-CLOUD-SINGLE",
    icon: Lock,
    color: "text-indigo-650 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    bgGrad: "from-indigo-500/5 to-blue-500/5",
    description: "Attaque par ransomware à grande échelle ciblant un fournisseur cloud majeur utilisé par les PME wallonnes.",
    territory: "Province du Brabant Wallon (ZAE Wavre)",
    affectedSectors: "Services Numériques (NACE 62), Logistique (NACE 52), Sous-traitance stratégique",
    horizon: "Court Terme (72 heures)",
    severity: "Majeure (4/5)",
    assumptions: [
      { name: "Indisponibilité du Cloud principal", value: "72 heures consécutives", type: "CHOC" },
      { name: "Taux de PME affectées", value: "45% dans les zones industrielles", type: "PARAMÈTRE" },
      { name: "Perte de données définitive", value: "5% (défaut de sauvegarde)", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Dépendance à une infrastructure unique", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "58 structures",
        confidence: "MEDIUM",
        confidence_score: 65,
        description: "Entreprises du Brabant Wallon dépendant d'un unique hébergeur ciblé.",
        sources: ["AdN (Enquêtes de maturité)", "Filière Numérique S3"],
        method: "Estimation basée sur le croisement sectoriel et le profil de dépendance Cloud déclaré."
      },
      exposed_etp: {
        value: "3 400 ETP",
        confidence: "MEDIUM",
        confidence_score: 60,
        description: "Emplois de bureau et logistiques paralysés par l'indisponibilité logicielle.",
        sources: ["ONSS", "Enquêtes de maturité IT"],
        method: "Comptage des effectifs des structures classées comme dépendantes à 100% de l'hébergeur."
      },
      exposed_revenue: {
        value: "185 M €",
        confidence: "LOW",
        confidence_score: 40,
        description: "Chiffre d'affaires mensuel exposé au blocage d'activité numérique.",
        sources: ["Comptes annuels BNB"],
        method: "Pro-rata du CA des entreprises impactées sur la durée moyenne estimée de reprise (72h)."
      },
      required_budget: {
        value: "15 M €",
        confidence: "LOW",
        confidence_score: 30,
        description: "Coût estimé pour le support d'urgence et le déploiement de sauvegardes.",
        sources: ["Historique des sinistres cyber", "Cyber Coalition"],
        method: "Estimation forfaitaire par PME pour l'intervention d'équipes de réponse sur incident."
      }
    },
    data_gaps: [
      { name: "Cartographie réelle des hébergeurs par entreprise", status: "MISSING", impact: "CRITICAL" },
      { name: "Niveau effectif de sauvegarde décentralisée (backup DRP)", status: "MISSING", impact: "HIGH" },
      { name: "Taux d'assurance cyber souscrit par les PME", status: "PARTIAL", impact: "MEDIUM" },
      { name: "Segmentation réseau interne des sous-traitants", status: "MISSING", impact: "LOW" }
    ],
    knownData: [
      "Infrastructures logiques déclarées de la PIT",
      "Coordonnées de sécurité des délégués NIS2",
      "Chiffre d'affaires sectoriel exposé"
    ],
    missingData: [
      "Emplacement et architecture des sauvegardes de données",
      "Présence d'un plan de reprise d'activité (DRP) testé",
      "Contrats de niveau de service (SLA) effectifs des hébergeurs"
    ],
    potentialSources: [
      "Audits réglementaires NIS2 de l'administration wallonne",
      "Évaluations de vulnérabilités CORTEX",
      "Enquêtes de cybersécurité de l'Agence du Numérique"
    ],
    proposed_services: [
      { name: "Diagnostic Cybersécurité PME", provider: "CETIC", type: "Service Technique" },
      { name: "AI Cyber Assessment", provider: "CETIC", type: "Service Technique" },
      { name: "Support Réponse sur Incident Cyber", provider: "CETIC / AdN", type: "Service d'Urgence" }
    ],
    proposed_programs: ["Programme Cyber Résilience Wallonie", "Chèques Cybersécurité"],
    proposed_funding: ["Co-financement DRP de Wallonie Entreprendre", "Subventions chèques cybersécurité SPW"],
    recommended_action: "Lancer en priorité le guichet de cofinancement DRP, initier des audits cyber pour les 58 structures identifiées, et négocier l'accès aux fiches de conformité NIS2 avec les autorités fédérales."
  },
  skills: {
    id: "skills",
    title: "AI Skills Shortage",
    decisionQuestion: "Où se situent les plus fortes pénuries de compétences en intelligence artificielle ?",
    vulnerabilityCode: "VULN-AI-SKILLS",
    icon: Brain,
    color: "text-rose-650 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    bgGrad: "from-rose-500/5 to-pink-500/5",
    description: "Pénurie sévère de profils qualifiés en intelligence artificielle limitant l'adoption technologique et l'innovation au sein des PME wallonnes.",
    territory: "Wallonie (Pôles universitaires LLN/Liège)",
    affectedSectors: "Programmation (NACE 62.01), R&D (NACE 72.19), Conseil informatique",
    horizon: "Long Terme (12 mois)",
    severity: "Modérée (3/5)",
    assumptions: [
      { name: "Taux de postes non pourvus en IA", value: "35% pendant plus de 6 mois", type: "CHOC" },
      { name: "Exode des data scientists", value: "20% vers Bruxelles ou l'étranger", type: "PARAMÈTRE" },
      { name: "Taux d'intégration IA PME", value: "< 10% d'adoption réelle", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Pénurie de main d'œuvre spécialisée", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "420 structures",
        confidence: "HIGH",
        confidence_score: 80,
        description: "PMEs technologiques et industrielles cherchant activement à adopter l'IA.",
        sources: ["DMAT (AdN)", "Forem Offres d'emploi"],
        method: "Sélection des entreprises ayant manifesté un besoin d'intégration IA ou recrutant activement."
      },
      exposed_etp: {
        value: "1 200 data scientists",
        confidence: "MEDIUM",
        confidence_score: 70,
        description: "Déficit d'effectifs spécialisés requis pour combler la demande régionale.",
        sources: ["Universités", " ONSS"],
        method: "Croisement entre le nombre de diplômés annuels et les déclarations d'embauche Forem."
      },
      exposed_revenue: {
        value: "650 M €",
        confidence: "MEDIUM",
        confidence_score: 65,
        description: "Valeur ajoutée de projets d'innovation retardés ou bloqués par manque de talents.",
        sources: ["Statistiques S3", "WE Research"],
        method: "Estimation du chiffre d'affaires R&D non réalisé par les entreprises du secteur."
      },
      required_budget: {
        value: "8 M €",
        confidence: "HIGH",
        confidence_score: 85,
        description: "Budget requis pour financer les formations et les chaires industrielles.",
        sources: ["CETIC budget", "EDIH Wallonia"],
        method: "Coût unitaire d'un plan de formation accélérée de 500 ingénieurs sur 12 mois."
      }
    },
    data_gaps: [
      { name: "Compétences techniques réelles des développeurs internes", status: "MISSING", impact: "HIGH" },
      { name: "Taux d'exode effectif des diplômés universitaires", status: "PARTIAL", impact: "MEDIUM" },
      { name: "Besoins futurs détaillés par secteur d'activité", status: "PARTIAL", impact: "MEDIUM" },
      { name: "Dépenses effectives en formation IA des PME", status: "MISSING", impact: "LOW" }
    ],
    knownData: [
      "Nombre d'offres d'emploi IA actives sur le portail du Forem",
      "Nombre annuel de diplômés en Master Data Science/IA",
      "Scores DMAT déclarés des entreprises"
    ],
    missingData: [
      "Niveau réel de compétences internes des développeurs wallons",
      "Proportion exacte de diplômés quittant la Wallonie à l'embauche",
      "Budget réel alloué à la formation continue en entreprise"
    ],
    potentialSources: [
      "Forem (Statistiques de recrutement et pénuries)",
      "Bureaux de recrutement privés et portails d'emploi",
      "Universités wallonnes (statistiques d'insertion des diplômés)"
    ],
    proposed_services: [
      { name: "Diagnostic IA & Opportunités", provider: "CETIC", type: "Service Technique" },
      { name: "AI Readiness Diagnostic", provider: "CETIC", type: "Service Technique" },
      { name: "Test Before Invest - IA", provider: "Sirris", type: "Service Expérimentation" }
    ],
    proposed_programs: ["EDIH Wallonia", "Digital Wallonia - Plan Talents"],
    proposed_funding: ["Chèque Formation Cyber/IA", "Financement de démonstrateurs de l'EDIH"],
    recommended_action: "Soutenir la création de bootcamps de requalification, renforcer la dotation du service 'Test Before Invest' de Sirris, et lier la PIT aux flux de diplômés des universités."
  },
  circular: {
    id: "circular",
    title: "Circular Wallonia",
    decisionQuestion: "Quelles dépendances matières menacent la compétitivité de la manufacture ?",
    vulnerabilityCode: "VULN-RAW-MAT",
    icon: RefreshCw,
    color: "text-teal-650 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
    bgGrad: "from-teal-500/5 to-emerald-500/5",
    description: "Rupture de la chaîne globale d'approvisionnement en métaux critiques requis pour les batteries et l'électronique verte.",
    territory: "Bassin de Charleroi (Hainaut)",
    affectedSectors: "Équipements Électriques (NACE 27), Recyclage (NACE 38.3), Métallurgie (NACE 24)",
    horizon: "Moyen Terme (6 mois)",
    severity: "Élevée (4/5)",
    assumptions: [
      { name: "Baisse d'importation de métaux critiques", value: "-50% d'approvisionnement", type: "CHOC" },
      { name: "Durée de la perturbation logistique", value: "9 mois", type: "PARAMÈTRE" },
      { name: "Taux de substitution locale", value: "10% max (technologie figée)", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Dépendance aux importations critiques", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "62 structures",
        confidence: "HIGH",
        confidence_score: 90,
        description: "Nombre d'usines wallonnes dépendantes des métaux et composants critiques.",
        sources: ["AWEX export", "Value Chain database"],
        method: "Filtre douanier et croisement avec les fiches de flux matières de Sirris."
      },
      exposed_etp: {
        value: "8 200 ETP",
        confidence: "HIGH",
        confidence_score: 85,
        description: "Emplois industriels directs menacés par les arrêts d'assemblage.",
        sources: ["ONSS", "Value Chain PMEs"],
        method: "Somme des effectifs salariés des structures dépendantes."
      },
      exposed_revenue: {
        value: "2.1 Mrds €",
        confidence: "MEDIUM",
        confidence_score: 70,
        description: "Chiffre d'affaires industriel à risque sur la période d'approvisionnement.",
        sources: ["BNB Comptes", "AWEX"],
        method: "Chiffre d'affaires cumulé des exportateurs d'équipements de stockage d'énergie."
      },
      required_budget: {
        value: "35 M €",
        confidence: "MEDIUM",
        confidence_score: 60,
        description: "Budget d'aide d'urgence pour la substitution et la relocalisation des flux.",
        sources: ["Plan de Relance", "WE funding logs"],
        method: "Estimation forfaitaire pour soutenir la R&D d'éco-conception de substitution."
      }
    },
    data_gaps: [
      { name: "Niveaux réels de stocks stratégiques sur site", status: "MISSING", impact: "CRITICAL" },
      { name: "Taux de recyclage effectif par composant", status: "PARTIAL", impact: "HIGH" },
      { name: "Origine précise des métaux importés (sous-traitants)", status: "MISSING", impact: "MEDIUM" },
      { name: "Disponibilité de substituts certifiés", status: "PARTIAL", impact: "LOW" }
    ],
    knownData: [
      "Flux d'importation généraux des métaux et terres rares",
      "Liste nominative des fabricants d'équipements électriques",
      "Programmes d'aide à l'éco-conception actifs"
    ],
    missingData: [
      "Stocks physiques réels détenus dans les entrepôts privés",
      "Origine exacte du métal brut utilisé par les sous-traitants",
      "Capacité d'adaptation technique immédiate sans refonte de produit"
    ],
    potentialSources: [
      "AWEX (Fichiers import/export détaillés)",
      "Douanes fédérales (Déclarations d'importation)",
      "Études de cycle de vie et flux de matières de Sirris"
    ],
    proposed_services: [
      { name: "Analyse des Flux de Matières critiques", provider: "Sirris", type: "Service Technique" },
      { name: "Coaching Éco-design & Substitution", provider: "Sirris", type: "Service Technique" },
      { name: "Diagnostic Économie Circulaire Global", provider: "Wallonie Entreprendre", type: "Service Conseil" }
    ],
    proposed_programs: ["Circular Design & Materials", "Plan de Relance de la Wallonie"],
    proposed_funding: ["Subvention d'éco-conception", "Prêt d'innovation pour la relocalisation des intrants"],
    recommended_action: "Soutenir massivement la constitution de boucles de recyclage locales, déployer l'analyse de flux de Sirris pour les 62 structures, et négocier l'accès aux données douanières détaillées."
  },
  s3: {
    id: "s3",
    title: "S3 Specialisation",
    decisionQuestion: "Quels programmes régionaux génèrent le plus fort impact stratégique ?",
    vulnerabilityCode: "VULN-S3-ALIGNMENT",
    icon: Target,
    color: "text-purple-650 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    bgGrad: "from-purple-500/5 to-indigo-500/5",
    description: "Évaluation de la performance, de l'impact socio-économique et de l'alignement des programmes de spécialisation intelligente S3 (BioWin, MecaTech).",
    territory: "Wallonie (Région)",
    affectedSectors: "Sciences du Vivant (NACE 21), Industrie du Futur (NACE 28), CleanTech",
    horizon: "Long Terme (2 ans)",
    severity: "Stratégique (3/5)",
    assumptions: [
      { name: "Indice d'impact S3 visé", value: "Hausse de 15% d'innovation", type: "CHOC" },
      { name: "Période d'évaluation", value: "Bilan intermédiaire 2021-2026", type: "PARAMÈTRE" },
      { name: "Taux de transfert technologique", value: "Objectif de 25% de brevets licenciés", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Désalignement de la R&D régionale", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "850 structures",
        confidence: "HIGH",
        confidence_score: 95,
        description: "Bénéficiaires de subventions S3 actifs dans le graphe.",
        sources: ["Comptes régionaux SPW Recherche", "WE portfolios"],
        method: "Extraction de tous les enrôlements dans les programmes S3 (BioWin, MecaTech, Tweed)."
      },
      exposed_etp: {
        value: "12 400 chercheurs",
        confidence: "HIGH",
        confidence_score: 90,
        description: "Emplois de recherche et d'ingénierie financés par la S3.",
        sources: ["ONSS (Déclarations des universités et centres)", "PIT Database"],
        method: "Agrégation des effectifs R&D directs rattachés aux projets S3."
      },
      exposed_revenue: {
        value: "3.5 Mrds €",
        confidence: "MEDIUM",
        confidence_score: 75,
        description: "Chiffre d'affaires cumulé des entreprises wallonnes de la S3.",
        sources: ["BNB Comptes", "Rapports financiers SPW"],
        method: "Chiffre d'affaires historique des entreprises associées aux pôles."
      },
      required_budget: {
        value: "140 M € / an",
        confidence: "HIGH",
        confidence_score: 95,
        description: "Budget annuel de subventions de recherche collaborative.",
        sources: ["Budget initial SPW", "Plan de Relance S3"],
        method: "Fiche budgétaire officielle S3 issue de l'administration."
      }
    },
    data_gaps: [
      { name: "Taux d'industrialisation réel (TRL) des prototypes", status: "MISSING", impact: "CRITICAL" },
      { name: "Emplois créés indirectement à 3 ans post-projet", status: "PARTIAL", impact: "HIGH" },
      { name: "Taux de transfert technologique vers le marché", status: "MISSING", impact: "HIGH" },
      { name: "Co-investissements privés effectifs", status: "AVAILABLE", impact: "LOW" }
    ],
    knownData: [
      "Enveloppes de subventions allouées par projet",
      "Consortia d'acteurs de recherche (centres, universités, PME)",
      "Brevets et publications scientifiques générés"
    ],
    missingData: [
      "Niveau de maturité technologique (TRL) réel à la clôture",
      "Chiffre d'affaires généré par la commercialisation du prototype",
      "Nombre d'emplois indirects créés dans la chaîne de sous-traitance"
    ],
    potentialSources: [
      "Rapports d'activité annuels des pôles de compétitivité (BioWin/MecaTech)",
      "SPW Économie Emploi Recherche (suivi des dossiers)",
      "Enquêtes de valorisation de l'IWEPS"
    ],
    proposed_services: [
      { name: "Prototype Médical IA", provider: "CETIC", type: "Service Expérimentation" },
      { name: "Validation Mécanique & Machine", provider: "Sirris", type: "Service Technique" },
      { name: "Financement Innovation Santé", provider: "Wallonie Entreprendre", type: "Service Conseil" }
    ],
    proposed_programs: ["S3 Innovation Santé", "TART IA", "S3 Mobilité Logistique"],
    proposed_funding: ["Subvention R&D collaborative SPW", "Prêt d'amorçage de Wallonie Entreprendre"],
    recommended_action: "Améliorer le suivi du TRL en l'intégrant dans le cockpit de la PIT, financer en priorité les transferts technologiques certifiés, et structurer un canal de feedback avec les universités."
  },
  flood: {
    id: "flood",
    title: "Inondations Vesdre",
    decisionQuestion: "Quel impact économique anticiper suite à une crue majeure et quel budget mobiliser ?",
    vulnerabilityCode: "VULN-FLOODPLAIN-EXP",
    icon: Waves,
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    bgGrad: "from-blue-500/5 to-cyan-500/5",
    description: "Épisode de précipitations extrêmes provoquant le débordement de la Vesdre et la paralysie mécanique et logistique des parcs industriels.",
    territory: "Vallée de la Vesdre (Chaudfontaine, Pepinster, Verviers)",
    affectedSectors: "Métallurgie (NACE 24), Logistique (NACE 52), Transport routier (NACE 49)",
    horizon: "Court Terme (15 jours)",
    severity: "Critique (5/5)",
    assumptions: [
      { name: "Hauteur de crue moyenne", value: "+1.8m par rapport au lit majeur", type: "CHOC" },
      { name: "Arrêt des infrastructures de transport", value: "5 jours complets", type: "PARAMÈTRE" },
      { name: "Délai de remise en état des sites", value: "15 jours consécutifs", type: "HYPOTHÈSE" },
      { name: "Seuil de vulnérabilité", value: "Zone d'aléa de crue élevé", type: "SEUIL" }
    ],
    metrics: {
      exposed_structures: {
        value: "32 structures",
        confidence: "HIGH",
        confidence_score: 95,
        description: "Nombre d'usines et d'établissements industriels situés dans la zone inondable.",
        sources: ["GéoPortail Wallonie (Aléa crue)", "BCE"],
        method: "Croisement géographique précis des adresses et polygones de sites avec la couche d'aléa."
      },
      exposed_etp: {
        value: "2 800 ETP",
        confidence: "HIGH",
        confidence_score: 90,
        description: "Salariés des usines et parcs logistiques paralysés par l'eau.",
        sources: ["ONSS", "Base des bénéficiaires PIT"],
        method: "Comptage des effectifs déclarés à l'adresse exacte des sites sinistrés."
      },
      exposed_revenue: {
        value: "450 M €",
        confidence: "MEDIUM",
        confidence_score: 70,
        description: "Volume d'affaires menacé par l'arrêt temporaire d'activité (15 jours).",
        sources: ["Comptes BNB", "Historiques des crues"],
        method: "Pro-rata du CA annuel sur les 15 jours de paralysie."
      },
      required_budget: {
        value: "25 M €",
        confidence: "MEDIUM",
        confidence_score: 65,
        description: "Budget d'indemnisation et d'avances sur sinistre recommandé.",
        sources: ["Fonds des Calamités", "WE budget logs"],
        method: "Estimation forfaitaire pour couvrir 5% du CA annuel des structures ciblées."
      }
    },
    data_gaps: [
      { name: "Niveau réel de couverture d'assurance", status: "MISSING", impact: "CRITICAL" },
      { name: "Présence de plans de continuité d'activité (PCA)", status: "MISSING", impact: "HIGH" },
      { name: "État des vannes de protection locales", status: "TO_BE_NEGOTIATED", impact: "MEDIUM" },
      { name: "Itinéraires de transport alternatifs", status: "PARTIAL", impact: "LOW" }
    ],
    knownData: [
      "Géolocalisation précise des PME wallonnes",
      "Cartographie d'aléa de crue de la Région (SPW)",
      "Effectifs ONSS déclarés par établissement"
    ],
    missingData: [
      "Niveau de couverture d'assurance contre les inondations",
      "Plan de Continuité d'Activité (PCA) opérationnel sur site",
      "Hauteur exacte d'installation des transformateurs électriques"
    ],
    potentialSources: [
      "Assureurs et courtiers de la Région Wallonne",
      "Services d'urbanisme municipaux de Chaudfontaine, Pepinster et Verviers",
      "Direction de la gestion des Voies Hydrauliques du SPW"
    ],
    proposed_services: [
      { name: "Aide au Plan de Continuité (PCA)", provider: "SPW Économie", type: "Service Technique" },
      { name: "Conseil en Reconstruction Industrielle Résiliente", provider: "Sirris", type: "Service Technique" },
      { name: "Support Financement d'Urgence Calamités", provider: "Wallonie Entreprendre", type: "Service Financier" }
    ],
    proposed_programs: ["Plan de Relance wallon - Résilience", "Fonds des Calamités de la Région"],
    proposed_funding: ["Prêt d'urgence de trésorerie WE", "Indemnité directe Fonds Calamités"],
    recommended_action: "Activer immédiatement le guichet de subvention d'urgence calamités, prioriser l'accompagnement des 32 structures de la Vesdre dans la mise en place de plans de continuité d'activité (PCA), et intégrer les données d'assurances."
  }
};

export default function ResilienceDemonstratorPage() {
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
      category="RÉSILIENCE STRATÉGIQUE"
      title="Démonstrateur Politique Exécutif"
      description="Parcours de simulation et d'aide à la décision stratégique pour le Cabinet et la Direction Générale."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Cockpit", href: "/strategic" },
        { label: "Questions Décideur" }
      ]}
    >
      <div className="space-y-8">
        
        {/* Workstream 7: Executive Storytelling & Positioning Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 opacity-[0.04] blur-2xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-teal-500/15 text-teal-605 px-2 py-0.5 rounded-full border border-teal-500/20">
              Cadre Méthodologique Officiel
            </span>
          </div>
          <h2 className="text-xs font-black text-text uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-605" />
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
              {Object.values(SCENARIOS).map((scenario) => {
                const IconComponent = scenario.icon;
                return (
                  <div 
                    key={scenario.id}
                    onClick={() => handleSelectQuestion(scenario.id)}
                    className="bg-glass/25 hover:bg-glass/40 border border-muted/15 hover:border-teal-500/30 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 opacity-10 blur-xl group-hover:scale-125 transition-transform" />
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className={`p-3 rounded-xl ${scenario.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${scenario.color}`}>
                          {scenario.id === "flood" ? "Calamités" : scenario.id === "energy" ? "Cabinet" : "Transition"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-text group-hover:text-teal-605 dark:group-hover:text-teal-400 transition-colors">
                          {scenario.title}
                        </h4>
                        <p className="text-[11px] text-muted font-semibold leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                      <div className="border-t border-muted/10 pt-3 space-y-1">
                        <span className="text-[9px] font-black text-muted uppercase block">Question Décideur :</span>
                        <p className="text-[10px] text-text font-black leading-normal italic">
                          "{scenario.decisionQuestion}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-teal-650 dark:text-teal-400 mt-4 group-hover:translate-x-1 transition-transform">
                      <span>Lancer la simulation</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                );
              })}
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

                    <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-1.5 text-left">
                      <span className="text-[9px] font-black text-teal-650 uppercase block">Question Décideur :</span>
                      <p className="text-[12px] text-text font-black leading-relaxed italic">
                        "{data.decisionQuestion}"
                      </p>
                      <span className="text-[8px] font-black text-muted uppercase block">
                        Vulnérabilité associée : {data.vulnerabilityCode}
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
                        <div className="space-y-2 font-bold">
                          {data.assumptions.map((a, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px]">
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
                            className="text-[9px] font-black text-teal-605 hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer"
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
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">Étape 3 : Cartographie des Manques</span>
                      <h4 className="text-sm font-black text-text uppercase tracking-wider mt-0.5">Comment affiner cette estimation ? (Data Gaps Panel)</h4>
                      <p className="text-[10px] text-muted font-bold mt-1 leading-relaxed">
                        L'identification des données manquantes est stratégique pour orienter la politique de gouvernance des données de la Région et cibler les accords d'acquisition.
                      </p>
                    </div>

                    {/* Three Columns of Data Gaps Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      {/* Card 1: Données Connues */}
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block border-b border-emerald-500/15 pb-1">
                          ✓ Données Connues (Known)
                        </span>
                        <ul className="text-[10px] text-text font-bold space-y-1.5 list-disc pl-3">
                          {data.knownData.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Card 2: Données Manquantes */}
                      <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider block border-b border-rose-500/15 pb-1">
                          ✗ Données Manquantes (Missing)
                        </span>
                        <ul className="text-[10px] text-text font-bold space-y-1.5 list-disc pl-3">
                          {data.missingData.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Card 3: Sources Potentielles */}
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider block border-b border-blue-500/15 pb-1">
                          📡 Sources Futures Potentielles
                        </span>
                        <ul className="text-[10px] text-text font-bold space-y-1.5 list-disc pl-3">
                          {data.potentialSources.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="overflow-x-auto border-t border-muted/10 pt-4 text-left">
                      <table className="w-full text-left text-xs border-collapse font-bold">
                        <thead>
                          <tr className="border-b border-muted/10 text-muted font-black uppercase text-[9px] tracking-wider">
                            <th className="py-2.5">Donnée Requise</th>
                            <th className="py-2.5 text-center">Niveau de Criticité</th>
                            <th className="py-2.5 text-right">Statut de Disponibilité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data_gaps.map((gap, idx) => (
                            <tr key={idx} className="border-b border-muted/5 hover:bg-glass/5 transition-colors">
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
                                  gap.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" :
                                  gap.status === "PARTIAL" ? "bg-amber-500/10 text-amber-705 border border-amber-500/15" :
                                  gap.status === "MISSING" ? "bg-rose-500/10 text-rose-600 border border-rose-500/15" :
                                  "bg-blue-500/10 text-blue-700 border border-blue-500/15"
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
                      <div className="space-y-4 font-bold">
                        <div className="p-4 bg-glass border border-muted/15 rounded-xl space-y-3">
                          <span className="text-[9px] font-black text-muted uppercase block border-b border-muted/10 pb-1">Services d'Accompagnement</span>
                          {data.proposed_services.map((s, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px]">
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
                            <div key={idx} className="flex items-center gap-2 text-[10px] text-text">
                              <Landmark className="h-3.5 w-3.5 text-indigo-500" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Funding & Recommended actions */}
                      <div className="space-y-4 font-bold">
                        <div className="p-4 bg-glass border border-muted/15 rounded-xl space-y-2">
                          <span className="text-[9px] font-black text-muted uppercase block border-b border-muted/10 pb-1">Instruments Financiers Mobilisés</span>
                          {data.proposed_funding.map((f, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[10px] text-text">
                              <Coins className="h-3.5 w-3.5 text-emerald-500" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-black text-teal-605 uppercase block">Arbitrage Métier / Avis de la PIT :</span>
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
                      className="text-[9px] font-black text-teal-655 hover:underline border-0 bg-transparent cursor-pointer font-bold"
                    >
                      {showTraceability ? "Masquer" : "Afficher"}
                    </button>
                  </div>

                  <p className="text-[10px] text-muted font-bold leading-normal">
                    La PIT garantit la traçabilité des indicateurs de la question initiale jusqu'au résultat pour assurer l'auditoire de la donnée.
                  </p>

                  {showTraceability && (
                    <div className="space-y-3.5 pt-2 animate-fadeIn font-semibold">
                      <div className="space-y-2.5">
                        
                        {/* Box 1 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] text-text">
                          <span className="text-muted block text-[8px] uppercase font-black">1. Question Cabinets</span>
                          <span className="block leading-tight mt-0.5">Estimer l'impact de la crise : {data.title}</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 2 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] text-text font-bold">
                          <span className="text-muted block text-[8px] uppercase font-black">2. Jeux de données (DCAT-AP)</span>
                          <div className="flex flex-wrap gap-1 mt-1 font-mono font-black">
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px]">BCE</span>
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px]">ONSS</span>
                            <span className="bg-muted/10 border border-muted/15 px-1.5 py-0.2 rounded text-[8px]">BNB</span>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 3 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] text-text">
                          <span className="text-muted block text-[8px] uppercase font-black">3. Indicateurs de structure</span>
                          <span className="block leading-tight mt-0.5">Effectifs ETP / Secteur NACE</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 4 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] text-text">
                          <span className="text-muted block text-[8px] uppercase font-black">4. Hypothèses actives</span>
                          <span className="block leading-tight mt-0.5">
                            {data.assumptions.find(a => a.type === "HYPOTHÈSE")?.value || "Baisse de 20%"}
                          </span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 5 */}
                        <div className="p-2.5 bg-glass border border-muted/15 rounded-xl text-[10px] text-text">
                          <span className="text-muted block text-[8px] uppercase font-black">5. Algorithme de calcul</span>
                          <span className="block font-mono text-[8px] bg-muted/10 p-1 rounded mt-0.5 font-bold">SOMME (ETP * Coef_secteur)</span>
                        </div>

                        <div className="flex justify-center">
                          <span className="text-muted font-black text-[9px]">↓</span>
                        </div>

                        {/* Box 6 */}
                        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[10px] text-text flex justify-between items-center">
                          <div>
                            <span className="text-teal-655 block text-[8px] uppercase font-black font-semibold">6. Résultat et Confiance</span>
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
