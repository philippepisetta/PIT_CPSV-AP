// src/app/evidences/page.tsx
"use client";

import { ClipboardCheck, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { useV2EvidencesQuery, useV2UpdateEvidenceStatusMutation } from "@/hooks/usePITQueries";

export default function EvidencesPage() {
  const { data: evidencesRes, isLoading } = useV2EvidencesQuery();
  const updateMutation = useV2UpdateEvidenceStatusMutation();
  const evidences = evidencesRes?.data || [];

  const handleAction = (id: number, status: "APPROVED" | "REJECTED" | "PENDING") => {
    updateMutation.mutate({ id, status });
  };

  return (
    <PITLayout
      category="WORKSPACE ANIMATION"
      title="Justificatifs & Preuves d’Impact"
      description="Consultez et validez les documents justificatifs d'accompagnement et les preuves de résultats territoriaux."
      pageIcon={ClipboardCheck}
      breadcrumb={[{ label: "Preuves" }]}
    >
      {/* Help Banner */}
      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-3 mb-6">
        <ClipboardCheck className="h-5 w-5 text-teal-655 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 dark:text-teal-350 space-y-1">
          <p className="font-bold uppercase tracking-wider text-[10px]">Aide Métier : Typologies de Preuves</p>
          <ul className="list-disc list-inside pl-1 space-y-0.5 font-medium">
            <li><strong>Justificatif métier</strong> : Document officiel (ex: diagnostic DMAT, livrable) certifiant la bonne réalisation d'une prestation.</li>
            <li><strong>Preuve d'impact</strong> : Justification d'un outcome mesurable (ex: attestation d'embauche, certificat NIS2).</li>
            <li><strong>Audit technique</strong> : Logs de traçabilité système des actions, disponibles uniquement dans le volet de gouvernance.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                  <th className="py-2">Justificatif</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Fichier URL</th>
                  <th className="py-2">Statut</th>
                  <th className="py-2 text-right">Audit</th>
                </tr>
              </thead>
              <tbody>
                {evidences.map((evi: any) => (
                  <tr key={evi.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                    <td className="py-3 pr-2">
                      <span className="font-bold text-text block">{evi.name}</span>
                      <span className="text-muted text-[10px] block max-w-lg truncate">{evi.description}</span>
                    </td>
                    <td className="py-3 font-semibold text-text uppercase">{evi.type || "Fichier"}</td>
                    <td className="py-3 font-mono text-muted">
                      {evi.url ? (
                        <a href={evi.url} target="_blank" rel="noopener noreferrer" className="text-teal-605 hover:underline">
                          Voir justificatif
                        </a>
                      ) : (
                        "Aucun lien"
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-max ${
                        evi.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600" :
                        evi.status === "REJECTED" ? "bg-rose-500/10 text-rose-600" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {evi.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                        {evi.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        {evi.status === "PENDING" && <AlertCircle className="h-3 w-3" />}
                        {evi.status}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      {evi.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAction(evi.id, "APPROVED")}
                            className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleAction(evi.id, "REJECTED")}
                            className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      {evi.status !== "PENDING" && (
                        <button
                          onClick={() => handleAction(evi.id, "PENDING")}
                          className="px-2.5 py-1 bg-glass border border-muted/20 text-muted rounded-lg text-[10px] font-black cursor-pointer hover:bg-glass/60 transition-all"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PITLayout>
  );
}
