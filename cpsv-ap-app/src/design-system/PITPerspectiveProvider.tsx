// src/design-system/PITPerspectiveProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PerspectiveType = "all" | "strategic" | "operational" | "territorial" | "data" | "transformation";

export interface Perspective {
  id: PerspectiveType;
  label: string;
  description: string;
  allowedTypes: string[];
}

export const PERSPECTIVES: Perspective[] = [
  {
    id: "all",
    label: "Graphe Complet",
    description: "Afficher l'ensemble du Territorial Knowledge Graph.",
    allowedTypes: ["strategy", "strategicpriority", "program", "measure", "initiative", "service", "journey", "journeystage", "ecosystem", "valuechain", "filiere", "beneficiary", "beneficiaryengagement", "organisation", "dataset", "knowledgeasset", "challenge", "impact", "outcomeindicator", "activity", "org"]
  },
  {
    id: "strategic",
    label: "Perspective Stratégique",
    description: "Focus sur les politiques publiques, programmes et indicateurs d'impact.",
    allowedTypes: ["strategy", "strategicpriority", "program", "measure", "initiative", "impact", "outcomeindicator"]
  },
  {
    id: "operational",
    label: "Perspective Opérationnelle",
    description: "Focus sur l'accompagnement des bénéficiaires et l'activité des services.",
    allowedTypes: ["beneficiary", "service", "journey", "journeystage", "beneficiaryengagement", "actioninstance", "activity"]
  },
  {
    id: "territorial",
    label: "Perspective Territoriale",
    description: "Focus sur l'ancrage régional, les filières S3 et les écosystèmes.",
    allowedTypes: ["ecosystem", "valuechain", "filiere", "organisation", "org", "territory", "beneficiary"]
  },
  {
    id: "data",
    label: "Perspective Data",
    description: "Focus sur les catalogues de données DCAT-AP et actifs de connaissance.",
    allowedTypes: ["dataset", "knowledgeasset", "eventresource"]
  },
  {
    id: "transformation",
    label: "Perspective Transformation",
    description: "Focus sur les thématiques d'innovation (IA, Cyber, Industrie 4.0).",
    allowedTypes: ["service", "journey", "challenge", "beneficiary", "program"]
  }
];

interface PerspectiveContextType {
  activePerspective: PerspectiveType;
  setPerspective: (perspective: PerspectiveType) => void;
  currentPerspective: Perspective;
  isEntityTypeVisible: (type: string) => boolean;
}

const PerspectiveContext = createContext<PerspectiveContextType | undefined>(undefined);

export function PITPerspectiveProvider({ children }: { children: React.ReactNode }) {
  const [activePerspective, setActivePerspective] = useState<PerspectiveType>("all");

  const currentPerspective = PERSPECTIVES.find(p => p.id === activePerspective) || PERSPECTIVES[0];

  const isEntityTypeVisible = (type: string) => {
    if (activePerspective === "all") return true;
    const cleanType = type.toLowerCase().replace(/[^a-z0-9]/g, "");
    return currentPerspective.allowedTypes.some(allowed => {
      const cleanAllowed = allowed.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanAllowed === cleanType || cleanType.includes(cleanAllowed) || cleanAllowed.includes(cleanType);
    });
  };

  return (
    <PerspectiveContext.Provider value={{ activePerspective, setPerspective: setActivePerspective, currentPerspective, isEntityTypeVisible }}>
      {children}
    </PerspectiveContext.Provider>
  );
}

export function usePerspective() {
  const context = useContext(PerspectiveContext);
  if (!context) {
    throw new Error("usePerspective must be used within a PITPerspectiveProvider");
  }
  return context;
}
