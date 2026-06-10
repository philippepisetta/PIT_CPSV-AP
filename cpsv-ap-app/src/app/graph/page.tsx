// src/app/graph/page.tsx

"use client";

import GraphViewer from "@/components/GraphViewer";
import PageHeader from "@/components/ui/PageHeader";
import { Network } from "lucide-react";

export default function GraphPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Explorateur de Graphe Sémantique"
        description="Visualisez et explorez interactivement les interconnexions territoriales : bénéficiaires, services CPSV-AP, écosystèmes, parcours types, livrables et filières S3."
        Icon={Network}
      />
      <GraphViewer />
    </div>
  );
}
