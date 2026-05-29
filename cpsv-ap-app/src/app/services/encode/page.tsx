// src/app/services/encode/page.tsx
import React from "react";
import Wizard from "@/components/encode/Wizard";

export const metadata = {
  title: "Encodage de service CPSV‑AP",
  description: "Wizard premium pour créer et encoder un service public selon le modèle CPSV‑AP.",
};

export default function EncodeServicePage() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Encodage d’un service public (CPSV‑AP)
      </h1>
      <Wizard />
    </section>
  );
}
