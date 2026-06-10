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
  BookOpen
} from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: Home },
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
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface p-4 border-r border-muted hidden md:flex flex-col h-screen sticky top-0">
      <div className="flex items-center justify-center px-3 py-4 border-b border-muted mb-6">
        <img 
          src="/logo.png" 
          alt="PIT Wallonie" 
          className="h-24 w-auto max-w-[220px] object-contain bg-transparent"
        />
      </div>
      <nav className="space-y-1.5 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-2 border-primary text-text shadow-sm" 
                  : "text-muted hover:bg-glass hover:text-text"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
