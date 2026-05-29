// src/lib/mock/kpis.ts

export interface Kpi {
  id: string;
  label: string;
  value: string | number;
  icon: string;
}

export const kpis: Kpi[] = [
  { id: "services", label: "Services", value: 35, icon: "FolderIcon" },
  { id: "organisations", label: "Organisations", value: 12, icon: "UsersIcon" },
  { id: "parcours", label: "Parcours clients", value: 8, icon: "FileIcon" },
  { id: "relations", label: "Relations (edges)", value: 124, icon: "Link2Icon" },
  { id: "recommandations", label: "Recommandations IA", value: 27, icon: "RocketIcon" },
  { id: "uptime", label: "Uptime %", value: "99.9%", icon: "CheckIcon" },
];
