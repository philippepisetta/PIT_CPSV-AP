// src/components/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  FileText, 
  Compass, 
  Network, 
  Share2, 
  Sparkles, 
  BarChart2, 
  Settings,
  Activity,
  Database,
  BookOpen,
  Target,
  LineChart,
  ClipboardCheck,
  Shield,
  HelpCircle,
  FileCode,
  Zap,
  Building,
  Play,
  Layers,
  CheckCircle2
} from "lucide-react";
import { useWorkspace } from "@/design-system/PITWorkspaceProvider";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavBlock {
  title: string;
  items: NavItem[];
  allowedWorkspaces: string[];
}

const navBlocks: NavBlock[] = [
  {
    title: "Accompagnement",
    allowedWorkspaces: ["accompaniment"],
    items: [
      { name: "Parcours", href: "/accompaniment/journeys", icon: Compass },
      { name: "Bénéficiaires (Vue 360°)", href: "/accompaniment/beneficiaries", icon: Users },
      { name: "Prestations réalisées", href: "/accompaniment/prestations", icon: ClipboardCheck },
      { name: "Services & Matchmaking", href: "/accompaniment/services", icon: Sparkles },
      { name: "Activités", href: "/accompaniment/activities", icon: Compass },
      { name: "Communautés & Affiliations", href: "/accompaniment/communities", icon: Share2 },
      { name: "Consortiums", href: "/accompaniment/consortia", icon: Network },
    ]
  },
  {
    title: "Défis & Programmes",
    allowedWorkspaces: ["accompaniment", "pilotage"],
    items: [
      { name: "Défis territoriaux", href: "/challenges", icon: Target },
      { name: "Programmes", href: "/programs", icon: Layers },
      { name: "Projets", href: "/projects", icon: FileText },
      { name: "Financements", href: "/accompaniment/funding?tab=awards", icon: Zap },
    ]
  },
  {
    title: "Résilience",
    allowedWorkspaces: ["pilotage"],
    items: [
      { name: "Risques", href: "/resilience?tab=risks", icon: Shield },
      { name: "Scénarios", href: "/resilience?tab=scenarios", icon: Play },
      { name: "Impacts", href: "/resilience?tab=impacts", icon: LineChart },
      { name: "Résilience territoriale", href: "/resilience", icon: Shield },
      { name: "Démonstrateur Cabinet", href: "/resilience/demonstrator", icon: Play },
    ]
  },
  {
    title: "Pilotage",
    allowedWorkspaces: ["pilotage"],
    items: [
      { name: "KPIs d'impact", href: "/pilotage", icon: LineChart },
      { name: "ROI territorial", href: "/pilotage?tab=roi", icon: LineChart },
      { name: "Alignement S3", href: "/s3", icon: Shield },
      { name: "Gap Analysis", href: "/gap-analysis", icon: Shield },
      { name: "Registre des Preuves", href: "/pilotage/evidences", icon: ClipboardCheck },
    ]
  },
  {
    title: "Intelligence Territoriale",
    allowedWorkspaces: ["accompaniment", "pilotage"],
    items: [
      { name: "Territoires", href: "/territories", icon: Compass },
      { name: "Filières", href: "/filieres", icon: Layers },
      { name: "Chaînes de valeur", href: "/value-chain-explorer", icon: Network },
      { name: "Vulnérabilités", href: "/vulnerabilities", icon: Shield },
      { name: "Écosystèmes", href: "/organizations", icon: Building },
      { name: "Graph Explorer", href: "/intelligence/graph", icon: BarChart2 },
    ]
  },
  {
    title: "Données",
    allowedWorkspaces: ["data"],
    items: [
      { name: "Datasets", href: "/data/marketplace", icon: Database },
      { name: "Sources", href: "/data", icon: Settings },
      { name: "Qualité des données", href: "/data/quality", icon: CheckCircle2 },
      { name: "Mappings & API", href: "/data/api-exports", icon: Zap },
    ]
  },
  {
    title: "Référentiels",
    allowedWorkspaces: ["accompaniment", "pilotage", "data"],
    items: [
      { name: "Référentiels S3 / DIS", href: "/governance/referentiels?tab=s3-dis", icon: Database },
      { name: "Taxonomies S3", href: "/governance/referentiels?tab=taxonomies-s3", icon: BookOpen },
      { name: "Référentiels Data Spaces", href: "/governance/referentiels?tab=dataspaces", icon: Network },
      { name: "Standards d'interopérabilité", href: "/governance/referentiels?tab=interop", icon: Share2 },
      { name: "Référentiels sectoriels", href: "/governance/referentiels?tab=sectors", icon: Layers },
      { name: "Référentiels RDI / Juridiques", href: "/governance/referentiels?tab=legal", icon: Shield },
      { name: "Sources internes", href: "/governance/referentiels?tab=internal", icon: FileText },
      { name: "Mappings", href: "/governance/referentiels?tab=mappings", icon: Network },
    ]
  },
  {
    title: "Gouvernance",
    allowedWorkspaces: ["accompaniment", "pilotage", "data"],
    items: [
      { name: "Audit technique", href: "/governance/audit-technical", icon: Shield },
      { name: "Documentation", href: "/guide", icon: BookOpen },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeWorkspace, currentWorkspace } = useWorkspace();

  // Filter blocks based on active workspace
  const visibleBlocks = navBlocks.filter(block => 
    block.allowedWorkspaces.includes(activeWorkspace)
  );

  return (
    <aside className="w-64 bg-surface p-4 border-r border-muted/20 hidden md:flex flex-col h-screen sticky top-0 justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin">
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-muted/10 mb-4 py-1.5">
          <img 
            src="/logo.png?v=3" 
            alt="PIT Wallonie" 
            className="w-full h-auto object-contain bg-transparent max-h-12"
          />
        </div>

        {/* Active Workspace Tag */}
        <div className="px-3 py-2 mb-4 rounded-xl bg-glass border border-muted/10 flex items-center gap-2">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full animate-pulse",
            activeWorkspace === "accompaniment" && "bg-teal-500",
            activeWorkspace === "pilotage" && "bg-amber-500",
            activeWorkspace === "data" && "bg-purple-500"
          )} />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-text">
              {currentWorkspace.label}
            </span>
            <span className="text-[8px] text-muted font-bold truncate max-w-[180px]">
              {currentWorkspace.description}
            </span>
          </div>
        </div>

        {/* Global Home link */}
        <div className="mb-4">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200",
              pathname === "/" 
                ? "bg-gradient-to-r from-teal-500/10 to-amber-500/5 border-l-2 border-teal-605 text-text" 
                : "text-muted hover:bg-glass hover:text-text"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            <span>Tableau de bord</span>
          </Link>
        </div>

        {/* Blocks navigation */}
        <nav className="space-y-6 flex-1">
          {visibleBlocks.map((block) => (
            <div key={block.title} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-muted/60 select-none">
                {block.title}
              </h3>
              <div className="space-y-1">
                {block.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-teal-500/10 to-amber-500/5 border-l-2 border-teal-605 text-text shadow-xs" 
                          : "text-muted hover:bg-glass hover:text-text"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-teal-600 dark:text-teal-400" : "text-muted")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

    </aside>
  );
}
