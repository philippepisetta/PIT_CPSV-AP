

import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Page de configuration",
};

export default function SettingsPage() {
  return (
    <section className="p-4">
      <h1 className="mb-4 text-2xl font-semibold text-text">Paramètres</h1>
      <p className={cn("text-muted")}>Contenu des paramètres à venir...</p>
    </section>
  );
}
