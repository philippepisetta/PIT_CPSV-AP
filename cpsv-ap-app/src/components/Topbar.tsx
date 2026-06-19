// src/components/Topbar.tsx

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bell, User, Briefcase, Settings } from "lucide-react";
import { useWorkspace, WORKSPACES } from "@/design-system/PITWorkspaceProvider";

export default function Topbar() {
  const { activeWorkspace, setWorkspace } = useWorkspace();

  return (
    <header className="flex items-center justify-between border-b border-muted/20 pb-4 mb-6">
      {/* Workspace Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted hidden sm:inline select-none">
            Espace :
          </span>
          <select
            value={activeWorkspace}
            onChange={(e) => setWorkspace(e.target.value as any)}
            className="bg-teal-500/10 border border-teal-500/30 rounded-xl px-3 py-1.5 text-xs font-black text-teal-700 dark:text-teal-400 focus:outline-none focus:border-teal-750 transition-colors cursor-pointer"
          >
            {WORKSPACES.map((w) => (
              <option key={w.id} value={w.id} className="bg-background text-text">
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent text-text",
        )} aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <Link href="/settings" className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent text-text flex items-center justify-center",
        )} aria-label="Paramètres">
          <Settings className="h-4 w-4" />
        </Link>
        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent text-text",
        )} aria-label="Profil">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

