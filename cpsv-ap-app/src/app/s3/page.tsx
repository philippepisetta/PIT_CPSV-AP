import type { Metadata } from "next";
import S3Container from "@/components/s3/S3Container";

export const metadata: Metadata = {
  title: "Observatoire S3 Wallonie",
  description: "Observatoire de Spécialisation Intelligente (S3) et alignement des filières économiques wallonnes.",
};

export default function S3Page() {
  return <S3Container />;
}
