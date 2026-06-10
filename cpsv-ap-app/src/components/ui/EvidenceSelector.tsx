// src/components/ui/EvidenceSelector.tsx
"use client";

import React from "react";
import { Link2, FileCode } from "lucide-react";

interface EvidenceSelectorProps {
  fileName: string;
  onFileNameChange: (val: string) => void;
  fileUrl: string;
  onFileUrlChange: (val: string) => void;
  evidenceType: string;
  onEvidenceTypeChange: (val: string) => void;
}

export default function EvidenceSelector({
  fileName,
  onFileNameChange,
  fileUrl,
  onFileUrlChange,
  evidenceType,
  onEvidenceTypeChange,
}: EvidenceSelectorProps) {
  return (
    <div className="space-y-4 bg-glass border border-muted/20 p-4 rounded-xl">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5 mb-3 flex items-center gap-1.5">
        <FileCode className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
        Preuve de Réalisation & Livrables
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
            Nom du fichier / preuve
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Ex: rapport_audit_cyber_biscuiterie.pdf"
            className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
            Type de livrable
          </label>
          <select
            value={evidenceType}
            onChange={(e) => onEvidenceTypeChange(e.target.value)}
            className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
          >
            <option value="REPORT">Rapport d'audit / Diagnostic</option>
            <option value="CERTIFICATE">Attestation / Certificat</option>
            <option value="CONTRACT">Contrat / Convention</option>
            <option value="DELIVERABLE">Livrable technique</option>
            <option value="OTHER">Autre document de preuve</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted block flex items-center gap-1.5">
          <Link2 className="h-3 w-3 text-muted" />
          Lien de stockage (URL / Chemin réseau)
        </label>
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => onFileUrlChange(e.target.value)}
          placeholder="Ex: https://storage.wallonie.be/pit/evidences/audit-biscuiterie-dupont.pdf"
          className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors"
        />
      </div>
    </div>
  );
}
