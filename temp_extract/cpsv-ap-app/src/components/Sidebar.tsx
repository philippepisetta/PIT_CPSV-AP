// src/components/Sidebar.tsx

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; // utility for classNames (we'll add later if missing)
import { Home, BarChart2, Settings, File, Bell, User } from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: File },
  { name: "Graph", href: "/graph", icon: BarChart2 },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-surface p-4 border-r border-muted hidden md:block">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-glass hover:text-text transition-all",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
