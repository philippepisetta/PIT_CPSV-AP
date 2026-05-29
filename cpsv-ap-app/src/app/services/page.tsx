import type { Metadata } from "next";
import ServicesContainer from "@/components/services/ServicesContainer";

export const metadata: Metadata = {
  title: "Cockpit Services CPSV-AP",
  description: "Cockpit premium d'encodage et d'interopérabilité des services publics.",
};

export default function ServicesPage() {
  return <ServicesContainer />;
}

