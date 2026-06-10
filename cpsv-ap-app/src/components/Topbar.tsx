// src/components/Topbar.tsx

"use client";

import { cn } from "@/lib/utils";
import { Search, Bell, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Topbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex items-center justify-between border-b border-muted pb-2 mb-4">
      {/* Recherche */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted" />
        <input
          type="text"
          placeholder="Recherche…"
          className={cn(
            "rounded-md border border-muted bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text",
          )}
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer",
          )}
          aria-label="Changer de thème"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-500 animate-in spin-in-45 duration-300" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-in spin-in-45 duration-300" />
          )}
        </button>

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

