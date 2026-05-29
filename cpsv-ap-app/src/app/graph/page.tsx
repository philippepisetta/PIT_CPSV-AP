// src/app/graph/page.tsx

import GraphViewer from "@/components/GraphViewer";

export default function GraphPage() {
  return (
    <section className="p-4">
      <h1 className="mb-4 text-2xl font-semibold text-text">Knowledge Graph</h1>
      <GraphViewer />
    </section>
  );
}
