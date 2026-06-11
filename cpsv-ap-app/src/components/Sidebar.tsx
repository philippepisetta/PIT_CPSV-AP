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
  LineChart
} from "lucide-react";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: Home },
  { name: "Stratégies", href: "/strategies", icon: Target },
  { name: "Pilotage territorial", href: "/pilotage", icon: LineChart },
  { name: "Bénéficiaires", href: "/beneficiaries", icon: Users },
  { name: "Activités", href: "/activities", icon: Activity },
  { name: "Services (CPSV)", href: "/services", icon: FileText },
  { name: "Parcours", href: "/journeys", icon: Compass },
  { name: "Chaînes de valeur", href: "/value-chains", icon: Network },
  { name: "Écosystèmes", href: "/ecosystems", icon: Share2 },
  { name: "Données (DCAT-AP)", href: "/datasets", icon: Database },
  { name: "Actifs de connaissance", href: "/knowledge-assets", icon: BookOpen },
  { name: "Recommandations", href: "/recommender", icon: Sparkles },
  { name: "Graph Explorer", href: "/graph", icon: BarChart2 },
  { name: "Guide interactif", href: "/guide", icon: Compass },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activePerspective } = usePerspective();

  const filteredNavigation = navigation.filter(item => {
    if (activePerspective === "all") return true;
    if (["/", "/graph", "/guide", "/settings"].includes(item.href)) return true;
    
    if (activePerspective === "strategic") {
      return ["/strategies", "/pilotage"].includes(item.href);
    }
    if (activePerspective === "operational") {
      return ["/beneficiaries", "/activities", "/services", "/journeys", "/recommender"].includes(item.href);
    }
    if (activePerspective === "territorial") {
      return ["/beneficiaries", "/services", "/value-chains", "/ecosystems"].includes(item.href);
    }
    if (activePerspective === "data") {
      return ["/datasets", "/knowledge-assets"].includes(item.href);
    }
    if (activePerspective === "transformation") {
      return ["/beneficiaries", "/services", "/journeys", "/recommender"].includes(item.href);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-surface p-4 border-r border-muted/20 hidden md:flex flex-col h-screen sticky top-0">
      <div className="flex items-center justify-center border-b border-muted/10 mb-4 py-1.5">
        <img 
          src="/logo.png?v=3" 
          alt="PIT Wallonie" 
          className="w-full h-auto object-contain bg-transparent max-h-12"
        />
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
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
      </nav>
    </aside>
  );
}
