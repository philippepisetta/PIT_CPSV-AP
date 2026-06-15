// src/app/page.tsx
"use client";

import { useWorkspace } from "@/design-system/PITWorkspaceProvider";
import BeneficiariesPage from "./beneficiaries/page";
import StrategicPage from "./strategic/page";
import AnimationPage from "./animation/page";
import InteroperabilityPage from "./interoperability/page";
import EnterprisePage from "./enterprise/page";

export default function Home() {
  const { activeWorkspace } = useWorkspace();

  if (activeWorkspace === "conseiller") {
    return <BeneficiariesPage />;
  }
  if (activeWorkspace === "dg") {
    return <StrategicPage />;
  }
  if (activeWorkspace === "steward") {
    return <InteroperabilityPage />;
  }
  if (activeWorkspace === "entreprise") {
    return <EnterprisePage />;
  }
  // Fallback to Workspace Animation
  return <AnimationPage />;
}
