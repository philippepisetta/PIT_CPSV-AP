import type { Metadata } from "next";
import ProgramsContainer from "@/components/programs/ProgramsContainer";

export const metadata: Metadata = {
  title: "Cockpit Programmes PIT",
  description: "Cockpit de gestion et d'alignement des programmes d'innovation territoriaux de la Région Wallonne.",
};

export default function ProgramsPage() {
  return <ProgramsContainer />;
}
