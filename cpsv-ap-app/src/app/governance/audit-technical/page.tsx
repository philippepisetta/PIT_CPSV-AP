// src/app/governance/audit-technical/page.tsx
"use client";

import React from "react";
import { ClipboardCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function AuditTechnicalPage() {
  const logs = [
    { timestamp: "2026-06-19T14:45:00Z", actor: "Data Steward", event: "Synchronisation automatique BCE", status: "SUCCESS", detail: "Mise à jour de 12 fiches bénéficiaires" },
    { timestamp: "2026-06-19T13:30:12Z", actor: "Conseiller Wallonie Entreprendre", event: "Dépôt de justificatif de service", status: "PENDING", detail: "Justificatif 'audit_cyber_pme.pdf' rattaché à MedTech Namur" },
    { timestamp: "2026-06-19T12:00:05Z", actor: "Animateur BioWin", event: "Validation de preuve d'impact", status: "APPROVED", detail: "Preuve validée pour le projet 'BioSensors v1'" },
    { timestamp: "2026-06-19T10:15:22Z", actor: "System Router", event: "Recalcul du radar de maturité", status: "SUCCESS", detail: "Mise à jour des profils sémantiques (+2 Cyber)" }
  ];

  return (
    <PITLayout
      category="GOUVERNANCE"
      title="Journal d'Audit Technique"
      description="Consultez les journaux d'événements techniques, les rapports de synchronisation système et les actions de gouvernance de données."
      pageIcon={ClipboardCheck}
      breadcrumb={[{ label: "Gouvernance" }, { label: "Audit technique" }]}
    >
      <div className="space-y-6">
        
        {/* Help Banner */}
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-indigo-650 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 dark:text-indigo-350">
            <p className="font-bold uppercase tracking-wider text-[10px]">Note Fonctionnelle : Distinction des Preuves</p>
            <p className="mt-1 leading-relaxed">
              Le <strong>Journal d'Audit Technique</strong> enregistre l'historique système des actions et des synchronisations (réservé à l'administration). Il se distingue des <strong>Justificatifs métiers</strong> (qui prouvent qu'un service a été réalisé) et des <strong>Preuves d'impact</strong> (qui certifient un outcome ou un résultat de politique publique).
            </p>
          </div>
        </div>

        {/* Placeholder info */}
        <div className="p-5 rounded-2xl bg-glass border border-muted/20 space-y-2">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider">Événements de Gouvernance Récents</h3>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Le contenu détaillé de cette vue sera construit dans une prochaine étape. Les logs système récents sont récapitulés ci-dessous pour vérification d'audit.
          </p>
        </div>

        {/* List of events */}
        <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
                  <th className="px-5 py-3">Horodatage (UTC)</th>
                  <th className="px-5 py-3">Acteur</th>
                  <th className="px-5 py-3">Événement</th>
                  <th className="px-5 py-3">Détail</th>
                  <th className="px-5 py-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-semibold text-muted">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-indigo-500/5 border-b border-gray-105 dark:border-gray-850 transition-colors">
                    <td className="px-5 py-4 font-mono text-[11px] text-text">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-bold text-text">
                      {log.actor}
                    </td>
                    <td className="px-5 py-4 font-bold text-teal-605">
                      {log.event}
                    </td>
                    <td className="px-5 py-4 text-[11px] leading-relaxed">
                      {log.detail}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        log.status === "SUCCESS" || log.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
