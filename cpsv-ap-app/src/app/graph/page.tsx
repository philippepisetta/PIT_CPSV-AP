// src/app/graph/page.tsx

"use client";

import GraphViewer from "@/components/GraphViewer";
import PITLayout from "@/design-system/PITLayout";
import { Network } from "lucide-react";

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
