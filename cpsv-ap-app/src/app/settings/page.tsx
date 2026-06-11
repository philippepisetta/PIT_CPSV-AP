// src/app/settings/page.tsx
"use client";

import PITLayout from "@/design-system/PITLayout";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <PITLayout
      category="CONFIGURATION"
      title="Paramètres de la Plateforme"
      description="Gérez les configurations globales du Territorial Knowledge Graph, les sources de données Airtable et les clés d'API."
      pageIcon={Settings}
      breadcrumb={[{ label: "Paramètres" }]}
    >
      <div className="rounded-2xl bg-glass border border-muted/20 p-6 shadow-xs max-w-2xl space-y-4">
        <h3 className="font-extrabold text-sm text-text uppercase tracking-wider text-muted">
          Configurations Générales
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          Le module de paramétrage de l'entrepôt sémantique et des connecteurs régionaux (SPW, AWEX, AdN) sera disponible dans la prochaine version.
        </p>
      </div>
    </PITLayout>
  );
}
