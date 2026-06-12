// src/components/Topbar.tsx

"use client";

import { cn } from "@/lib/utils";
import { Search, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-muted pb-2 mb-4">
      {/* Recherche */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted" />
        <input
          type="text"
          placeholder="Recherche…"
          className={cn(
            "rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          )}
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors",
        )} aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors",
        )} aria-label="Profil">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
