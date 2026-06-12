import type { Metadata } from "next";
import CapabilitiesContainer from "@/components/capabilities/CapabilitiesContainer";

export const metadata: Metadata = {
  title: "Cockpit Capabilités PIT",
  description: "Référentiel sémantique des compétences et capabilités technologiques régionales.",
};

export default function CapabilitiesPage() {
  return <CapabilitiesContainer />;
}
