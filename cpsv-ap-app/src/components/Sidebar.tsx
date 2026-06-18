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
  Layers
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
    title: "Workspace Animation",
    allowedWorkspaces: ["animateur"],
    items: [
      { name: "Workspace Animation", href: "/animation", icon: Sparkles },
      { name: "Activity Explorer", href: "/activities", icon: Compass },
      { name: "Community Dashboard", href: "/communities", icon: Share2 },
    ]
  },
  {
    title: "Portefeuille Conseiller",
    allowedWorkspaces: ["conseiller"],
    items: [
      { name: "Workspace Bénéficiaires 360", href: "/beneficiaries", icon: Users },
      { name: "Opportunités d'Innovation", href: "/opportunities", icon: FileCode },
    ]
  },
  {
    title: "Workspace Interop",
    allowedWorkspaces: ["steward"],
    items: [
      { name: "Workspace Interop", href: "/interoperability", icon: Settings },
      { name: "Data Marketplace", href: "/marketplace", icon: Database },
    ]
  },
  {
    title: "Ecosystem CRM",
    allowedWorkspaces: ["animateur"],
    items: [
      { name: "Membres", href: "/members", icon: Users },
      { name: "Défis d'Écosystème", href: "/ecosystem-challenges", icon: Target },
      { name: "Consortiums", href: "/consortia", icon: Network },
      { name: "Projets", href: "/projects", icon: Activity },
      { name: "Audit Preuves", href: "/evidences", icon: ClipboardCheck },
    ]
  },
  {
    title: "Catalogue Territorial",
    allowedWorkspaces: ["animateur", "conseiller", "steward"],
    items: [
      { name: "Services (CPSV)", href: "/services", icon: FileText },
      { name: "Parcours d'Accompagnement", href: "/journeys", icon: Compass },
      { name: "Opportunités d'Innovation", href: "/opportunities", icon: FileCode },
      { name: "Acteurs Territoriaux", href: "/organizations", icon: Building },
      { name: "Filières S3", href: "/filieres", icon: Layers },
      { name: "Explorateur de Chaînes", href: "/value-chain-explorer", icon: Network },
    ]
  },
  {
    title: "Recommandations",
    allowedWorkspaces: ["conseiller", "entreprise"],
    items: [
      { name: "Moteur de Match", href: "/recommender", icon: Sparkles },
      { name: "Mode Histoire PIT", href: "/demo-mode", icon: Play },
    ]
  },
  {
    title: "Pilotage Stratégique",
    allowedWorkspaces: ["dg"],
    items: [
      { name: "Missions & Roadmaps", href: "/strategic", icon: LineChart },
      { name: "Politiques Publiques", href: "/strategic-frameworks", icon: Shield },
      { name: "Gap Analysis", href: "/gap-analysis", icon: Shield },
      { name: "Graph Explorer", href: "/graph-explorer", icon: BarChart2 },
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
            activeWorkspace === "animateur" && "bg-teal-500",
            activeWorkspace === "conseiller" && "bg-indigo-500",
            activeWorkspace === "entreprise" && "bg-emerald-500",
            activeWorkspace === "dg" && "bg-amber-500",
            activeWorkspace === "steward" && "bg-purple-500"
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

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-muted/10 space-y-1.5">
        <Link
          href="/value-proposition"
          className={cn(
            "flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-bold text-muted hover:bg-glass hover:text-text transition-all duration-200",
            pathname === "/value-proposition" && "bg-glass text-text"
          )}
        >
          <Zap className="h-4 w-4 shrink-0 text-amber-500" />
          <span>Pourquoi la PIT ?</span>
        </Link>
        <Link
          href="/guide"
          className={cn(
            "flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-bold text-muted hover:bg-glass hover:text-text transition-all duration-200"
          )}
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>Guide Interactif</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-bold text-muted hover:bg-glass hover:text-text transition-all duration-200"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Paramètres</span>
        </Link>
        <div className="text-center pt-2">
          <span className="text-[8px] font-bold text-muted/40 uppercase tracking-widest">
            PIT vNext • Wallonie
          </span>
        </div>
      </div>
    </aside>
  );
}
