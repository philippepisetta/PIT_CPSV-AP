// src/design-system/PITWorkspaceProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type WorkspaceType = "accompaniment" | "pilotage" | "data";

export interface Workspace {
  id: WorkspaceType;
  label: string;
  description: string;
  themeColor: string;
}

export const WORKSPACES: Workspace[] = [
  {
    id: "accompaniment",
    label: "Espace Accompagnement",
    description: "Gérer le portefeuille de bénéficiaires, planifier les parcours et animer la filière.",
    themeColor: "teal",
  },
  {
    id: "pilotage",
    label: "Espace Pilotage",
    description: "Suivre les KPIs d'impact, le ROI territorial, la résilience régionale et le registre des preuves.",
    themeColor: "amber",
  },
  {
    id: "data",
    label: "Espace Données",
    description: "Gérer les connecteurs de systèmes SoR, le catalogue DCAT-AP, et évaluer la qualité.",
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
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>("accompaniment");

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
