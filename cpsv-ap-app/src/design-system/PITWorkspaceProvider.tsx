// src/design-system/PITWorkspaceProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type WorkspaceType = "animateur" | "conseiller" | "entreprise" | "dg" | "steward";

export interface Workspace {
  id: WorkspaceType;
  label: string;
  description: string;
  themeColor: string;
}

export const WORKSPACES: Workspace[] = [
  {
    id: "animateur",
    label: "Workspace Animation",
    description: "Animer l'écosystème, piloter les communautés, activités et funnels d'animation.",
    themeColor: "teal",
  },
  {
    id: "conseiller",
    label: "Workspace Conseiller 360",
    description: "Gérer le portefeuille d'entreprises, les diagnostics et les recommandations.",
    themeColor: "indigo",
  },
  {
    id: "entreprise",
    label: "Workspace Entreprise",
    description: "Suivre mon parcours d'innovation, mes projets, financements et résultats.",
    themeColor: "emerald",
  },
  {
    id: "dg",
    label: "Cockpit Exécutif (DG)",
    description: "Pilotage stratégique de la vision à l'impact et analyse de gaps territoriaux.",
    themeColor: "amber",
  },
  {
    id: "steward",
    label: "Workspace Interopérabilité",
    description: "Gérer les Source Systems, les Data Products, et la qualité du Knowledge Graph.",
    themeColor: "purple",
  },
];

interface WorkspaceContextType {
  activeWorkspace: WorkspaceType;
  setWorkspace: (workspace: WorkspaceType) => void;
  currentWorkspace: Workspace;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function PITWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>("animateur");

  // Keep it synced to localStorage for session persistence if desired
  useEffect(() => {
    const saved = localStorage.getItem("pit-active-workspace") as WorkspaceType;
    if (saved && WORKSPACES.some(w => w.id === saved)) {
      setActiveWorkspace(saved);
    }
  }, []);

  const handleSetWorkspace = (ws: WorkspaceType) => {
    setActiveWorkspace(ws);
    localStorage.setItem("pit-active-workspace", ws);
  };

  const currentWorkspace = WORKSPACES.find(w => w.id === activeWorkspace) || WORKSPACES[0];

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, setWorkspace: handleSetWorkspace, currentWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a PITWorkspaceProvider");
  }
  return context;
}
