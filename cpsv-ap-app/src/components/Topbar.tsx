// src/components/Topbar.tsx

"use client";

import { cn } from "@/lib/utils";
import { Bell, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePerspective, PERSPECTIVES } from "@/design-system/PITPerspectiveProvider";

export default function Topbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { activePerspective, setPerspective } = usePerspective();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex items-center justify-between border-b border-muted/20 pb-4 mb-6">
      {/* Perspective Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted hidden sm:inline select-none">
          Perspective :
        </span>
        <select
          value={activePerspective}
          onChange={(e) => setPerspective(e.target.value as any)}
          className="bg-glass border border-muted/30 rounded-xl px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-teal-700 dark:focus:border-teal-400 transition-colors cursor-pointer"
        >
          {PERSPECTIVES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent",
          )}
          aria-label="Changer de thème"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-500 animate-in spin-in-45 duration-300" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-in spin-in-45 duration-300" />
          )}
        </button>

        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent text-text",
        )} aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <button className={cn(
          "rounded-full p-2 hover:bg-glass hover:text-primary transition-colors cursor-pointer border-0 bg-transparent text-text",
        )} aria-label="Profil">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

