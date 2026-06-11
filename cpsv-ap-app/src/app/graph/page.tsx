// src/app/graph/page.tsx

"use client";

import dynamic from "next/dynamic";
import PITLayout from "@/design-system/PITLayout";
import { Network } from "lucide-react";

const GraphViewer = dynamic(() => import("@/components/GraphViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-glass border border-muted/20 rounded-2xl p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted text-sm font-medium animate-pulse">Chargement de l'explorateur de graphe...</p>
    </div>
  ),
});

export default function GraphPage() {
  return (
    <PITLayout
      category="EXPLORATEUR"
      title="Explorateur de Graphe Sémantique"
      description="Visualisez et explorez interactivement les interconnexions territoriales : bénéficiaires, services CPSV-AP, écosystèmes, parcours types, livrables et filières S3."
      pageIcon={Network}
      breadcrumb={[{ label: "Graphe Explorer" }]}
    >
      <GraphViewer />
    </PITLayout>
  );
}
