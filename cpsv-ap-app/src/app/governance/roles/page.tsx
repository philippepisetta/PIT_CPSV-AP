// src/app/governance/roles/page.tsx
"use client";

import React from "react";
import { Shield, Users, CheckCircle2 } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function RolesRightsPage() {
  const roles = [
    { name: "Directeur de Pôle (DG)", desc: "Pilotage stratégique global, consolidation des budgets, validation des roadmaps régionales et gap analysis.", permissions: ["Lecture globale", "Pilotage strategic", "Arbitrage budgétaire"] },
    { name: "Animateur Écosystème", desc: "Animation collective, gestion des événements, promotion des défis, suivi des consortiums et validation finale des justificatifs.", permissions: ["Gestion animation", "Création consortiums", "Audit des preuves (Evidence APPROVED)"] },
    { name: "Conseiller Technologique", desc: "Diagnostic individuel (DMAT), recommandation de services, enrôlement dans les parcours et dépôt des livrables.", permissions: ["Gestion portefeuille", "Formuler recommandations", "Soumission justificatifs (Evidence PENDING)"] },
    { name: "Dirigeant de PME", desc: "Consultation de sa frise de transformation, dépôt de défis technologiques individuels et transmission de livrables.", permissions: ["Auto-évaluation", "Déclaration défis", "Transmission fichiers"] },
    { name: "Data Steward / Architecte", desc: "Administration technique, configuration des Source Systems, cartographie des mappings sémantiques et monitoring qualité.", permissions: ["Gestion interop", "Edition mappings", "Configuration API"] }
  ];

  return (
    <PITLayout
      category="GOUVERNANCE"
      title="Rôles & Droits"
      description="Configurez les profils d'accès, habilitations de sécurité et politiques de validation des acteurs territoriaux."
      pageIcon={Shield}
      breadcrumb={[{ label: "Gouvernance" }, { label: "Rôles & droits" }]}
    >
      <div className="space-y-6">
        
        {/* Placeholder banner */}
        <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-2">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Habilitations Métier & Profils Utilisateurs</h3>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Le contenu détaillé de cette vue sera construit dans une prochaine étape. Les profils d'habilitation de l'action territoriale wallonne sont listés ci-dessous.
          </p>
        </div>

        {/* Roles list */}
        <div className="space-y-4">
          {roles.map((r, idx) => (
            <div key={idx} className="p-5 bg-glass/30 border border-muted/15 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h4 className="font-extrabold text-sm text-text leading-tight">{r.name}</h4>
                <p className="text-xs text-muted leading-snug font-semibold">{r.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0 max-w-sm justify-start md:justify-end">
                {r.permissions.map((p, i) => (
                  <span key={i} className="text-[9px] font-black text-indigo-650 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/15">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </PITLayout>
  );
}
