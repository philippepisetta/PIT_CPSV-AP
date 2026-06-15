// src/app/enterprise/page.tsx
"use client";

import React from "react";
import { 
  Compass, 
  Sparkles, 
  Home as HomeIcon,
  CheckCircle2,
  Layers,
  Activity,
  FolderGit
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { Badge } from "@/components/ui/badge";

export default function EnterprisePage() {
  return (
    <PITLayout
      category="ESPACE DE TRAVAIL"
      title="Mon Espace Innovation"
      description="Suivez votre parcours d'innovation, accédez aux aides recommandées et soumettez vos preuves."
      pageIcon={HomeIcon}
      breadcrumb={[{ label: "Accueil" }, { label: "Espace Entreprise" }]}
    >
      <div className="space-y-8">
        {/* Simulated Enterprise header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-teal-600 block">Votre compte</span>
            <h2 className="text-lg font-black text-text">MedTech Namur S.A.</h2>
            <p className="text-xs text-muted">Statut: PME • Province de Namur • Code NACE: 21.20 (Fabrication de préparations pharmaceutiques)</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-glass p-3 rounded-xl text-center border border-muted/10">
              <span className="text-xs text-muted block uppercase font-bold text-[9px]">Maturité Numérique</span>
              <span className="text-lg font-black text-teal-605">3/4</span>
            </div>
            <div className="bg-glass p-3 rounded-xl text-center border border-muted/10">
              <span className="text-xs text-muted block uppercase font-bold text-[9px]">Maturité Cyber</span>
              <span className="text-lg font-black text-rose-500">2/4</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Journey Progress */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-muted/10 pb-4">
              <Compass className="h-5 w-5 text-teal-605" />
              <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider">
                Mon Parcours de Transformation : e-Santé Pôle Wallonie
              </h3>
            </div>

            {/* Progress bar */}
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Progression générale</span>
                <span className="text-teal-605 font-extrabold">75% (Stage 3 de 4)</span>
              </div>
              <div className="h-3 bg-glass rounded-full overflow-hidden border border-muted/10">
                <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: "75%" }} />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black text-text block">Étape 1 : Diagnostic de maturité numérique</span>
                    <p className="text-[10px] text-muted">Complété le 10/02/2026. Score initial de 2/4.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black text-text block">Étape 2 : Élaboration du Plan d'Action</span>
                    <p className="text-[10px] text-muted">Complété le 03/03/2026. Intégration de 3 recommandations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-teal-500 shrink-0 flex items-center justify-center mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-teal-700 dark:text-teal-400 block">Étape 3 : Implémentation du projet IA</span>
                    <p className="text-[10px] text-text font-medium">En cours. Projet "MedTech IA Imagerie" actif. Preuve d'homologation CHU Liège soumise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-40">
                  <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black text-text block">Étape 4 : Évaluation d'impact final</span>
                    <p className="text-[10px] text-muted">Prévu d'ici fin 2026.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended for MedTech */}
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-muted/10 pb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider">
                Recommandé pour vous
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-teal-605">Service recommandé</span>
                <h4 className="text-xs font-bold text-text mt-1">Accompagnement Réglementaire MDR</h4>
                <p className="text-[10px] text-muted mt-0.5">Aide au marquage CE pour dispositifs logiciels.</p>
              </div>

              <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-indigo-650">Financement recommandé</span>
                <h4 className="text-xs font-bold text-text mt-1">Appel Tremplin IA 2026</h4>
                <p className="text-[10px] text-muted mt-0.5">Subvention jusqu'à 70% pour l'intégration de modèles d'IA.</p>
              </div>

              <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                <span className="text-[10px] font-black uppercase text-emerald-650">Expert recommandé</span>
                <h4 className="text-xs font-bold text-text mt-1">CETIC - Département Cybersécurité</h4>
                <p className="text-[10px] text-muted mt-0.5">Assistance technique pour NIS2 et sécurisation des données médicales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PITLayout>
  );
}
