// src/components/ui/OutcomeEditor.tsx
"use client";

import React from "react";

interface OutcomeEditorProps {
  outputReal: string;
  onOutputChange: (val: string) => void;
  outcomeReal: string;
  onOutcomeChange: (val: string) => void;
  impactText: string;
  onImpactChange: (val: string) => void;
}

export default function OutcomeEditor({
  outputReal,
  onOutputChange,
  outcomeReal,
  onOutcomeChange,
  impactText,
  onImpactChange,
}: OutcomeEditorProps) {
  return (
    <div className="space-y-4 bg-glass border border-muted/20 p-4 rounded-xl">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5 mb-3">
        Livrables, Impact & Résultats Réels
      </h4>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
            Livrable produit (Output)
          </label>
          <textarea
            value={outputReal}
            onChange={(e) => onOutputChange(e.target.value)}
            placeholder="Ex: Rapport d'audit de sécurité remis avec 12 recommandations prioritaires..."
            className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors h-16"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
            Effet concret mesuré (Outcome)
          </label>
          <textarea
            value={outcomeReal}
            onChange={(e) => onOutcomeChange(e.target.value)}
            placeholder="Ex: Chiffrement des postes sensibles activé, formation de 10 personnes..."
            className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors h-16"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
            Impact territorial (Indicateurs / S3)
          </label>
          <textarea
            value={impactText}
            onChange={(e) => onImpactChange(e.target.value)}
            placeholder="Ex: Réduction du risque de rançongiciel de 80%, renforcement de la souveraineté..."
            className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text transition-colors h-16"
          />
        </div>
      </div>
    </div>
  );
}
