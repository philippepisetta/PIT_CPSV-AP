// src/app/value-proposition/page.tsx
"use client";

import { Info, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Shield, Layers, Users, Zap, TrendingUp, Building } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

export default function ValuePropositionPage() {
  return (
    <PITLayout
      category="VALEUR ET IMPACT"
      title="Pourquoi la PIT ? (Proposition de Valeur)"
      description="Découvrez comment la PIT unifie les données opérationnelles des pôles et des opérateurs économiques pour piloter les politiques publiques régionales."
      pageIcon={Zap}
      breadcrumb={[{ label: "Proposition de Valeur" }]}
    >
      <div className="space-y-8">
        
        {/* Before vs After Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Avant PIT */}
          <div className="p-6 rounded-2xl border border-rose-500/25 bg-rose-500/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-rose-500/10 pb-3">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <h3 className="font-extrabold text-sm text-rose-600 dark:text-rose-400 uppercase tracking-wider">Avant la PIT (Silos et dispersion)</h3>
            </div>
            <ul className="space-y-3 text-xs leading-relaxed text-text font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span><strong>Bases de données isolées :</strong> Chaque pôle utilise ses propres fichiers Excel et bases de données sans partage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span><strong>Pas de suivi de parcours :</strong> Incapacité de suivre le cheminement d'une PME d'un opérateur à un autre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span><strong>Aucun lignage d'impact :</strong> Pas de lien formel entre les aides distribuées, les projets et l'impact S3 réel.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span><strong>Données de pilotage manuelles :</strong> Rapports de fin d'année longs, complexes et basés sur des approximations.</span>
              </li>
            </ul>
          </div>

          {/* Avec PIT */}
          <div className="p-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h3 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Avec la PIT (Plateforme Unifiée)</h3>
            </div>
            <ul className="space-y-3 text-xs leading-relaxed text-text font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span><strong>Profil unique de l'entreprise :</strong> Vision 360° du bénéficiaire (maturités, défis, participations).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span><strong>Parcours partagé d'innovation :</strong> Suivi transversal et coordonné des étapes d'accompagnement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span><strong>Graphe Territorial complet :</strong> Lien instantané et audité de l'activité terrain jusqu'à la stratégie S3.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span><strong>Pilotage automatisé en temps réel :</strong> Indicateurs d'impact consolidés dès la validation des preuves de résultats.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Value created per stakeholder */}
        <div className="space-y-4 pt-4 border-t border-muted/10">
          <h3 className="text-sm font-black uppercase text-muted tracking-wider">Valeur créée pour l'écosystème</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Entreprise */}
            <div className="bg-glass/25 border border-muted/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text uppercase">Pour la PME</span>
                <Building className="h-5 w-5 text-teal-605" />
              </div>
              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                Accès direct au catalogue de services, recommandations automatiques et suivi transparent de son parcours.
              </p>
            </div>

            {/* Conseiller */}
            <div className="bg-glass/25 border border-muted/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text uppercase">Pour le Conseiller</span>
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                Outils de diagnostic, matching de partenaires académiques/R&D et historique complet des interventions.
              </p>
            </div>

            {/* Pôle / Cluster */}
            <div className="bg-glass/25 border border-muted/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text uppercase">Pour l'Animateur</span>
                <Layers className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                Animation de communautés thématiques, montage de consortiums pour appels d'offres et audit des preuves d'impact.
              </p>
            </div>

            {/* DG / Décideurs */}
            <div className="bg-glass/25 border border-muted/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text uppercase">Pour le Décideur (DG)</span>
                <Shield className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                Cockpit exécutif temps réel, analyse automatisée des gaps régionaux et preuve de l'utilisation des deniers publics.
              </p>
            </div>

          </div>
        </div>

        {/* Ecosystem Value Loop (Priority 3 block 4) */}
        <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
          <div className="border-b border-muted/10 pb-3">
            <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
              La Chaîne de Valeur Sémantique PIT
            </h3>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center font-black text-xs text-text py-4">
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Entreprise</div>
            <ArrowRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Défi d'écosystème</div>
            <ArrowRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Service Public</div>
            <ArrowRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Projet R&D</div>
            <ArrowRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Impact Validé</div>
            <ArrowRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
            <div className="bg-glass border border-muted/15 px-4 py-2.5 rounded-xl flex-1 w-full">Stratégie S3</div>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
