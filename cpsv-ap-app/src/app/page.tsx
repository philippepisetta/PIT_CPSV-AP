// src/app/page.tsx
"use client";

import { useWorkspace } from "@/design-system/PITWorkspaceProvider";
import AccompanimentPage from "./accompaniment/page";
import StrategicPage from "./strategic/page";
import InteroperabilityPage from "./interoperability/page";

export default function Home() {
  const { activeWorkspace } = useWorkspace();

  if (activeWorkspace === "pilotage") {
    return <StrategicPage />;
  }
  if (activeWorkspace === "data") {
    return <InteroperabilityPage />;
  }
  // Default fallback is Espace Accompagnement
  return <AccompanimentPage />;
}
