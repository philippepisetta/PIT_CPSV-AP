// src/app/strategic-frameworks/page.tsx
"use client";

import { useState } from "react";
import { 
  Shield, 
  Target, 
  Layers, 
  ArrowRight, 
  FileText, 
  Activity, 
  TrendingUp, 
  ClipboardCheck,
  CheckCircle,
  HelpCircle,
  Award
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";

// Scenarios data for Priority 3 Strategic Framework Explorer
interface PolicyChain {
  framework: string;
  priority: string;
  objective: string;
  measure: string;
  service: string;
  project: string;
  outcome: string;
  indicator: string;
  evidence: string;
}

const POLICY_DATA: Record<string, PolicyChain> = {
  S3: {
    framework: "Smart Specialisation Strategy (S3) Wallonie",
    priority: "Priorité 1 : Santé et Sciences du vivant",
    objective: "Objectif 1.2 : Diagnostics précoces par IA",
    measure: "Mesure 1.2.4 : Subventionnement de dispositifs logiciels e-Santé",
    service: "Diagnostic Clinique IA (SRV-IA-DIAG)",
    project: "MedTech IA Imagerie (Actif)",
    outcome: "Algorithme clinique certifié MDR",
    indicator: "Nombre d'outils médicaux IA certifiés (Aggregation: SUM)",
    evidence: "Rapport de validation du CHU Liège (APPROVED)"
  },
  Circular: {
    framework: "Circular Wallonia (Économie Circulaire)",
    priority: "Priorité 3 : Chimie & Matériaux Circulaires",
    objective: "Objectif 3.1 : Conception et réintégration de plastiques biosourcés",
    measure: "Mesure 3.1.2 : Accompagnement technique à l'éco-conception d'emballages",
    service: "Audit Éco-Design (SRV-ECO-DESIGN)",
    project: "CircularPack (Actif)",
    outcome: "42% de taux de réintégration de polymère biosourcé",
    indicator: "Taux moyen de plastique réintégré (Aggregation: AVG)",
    evidence: "Rapport de validation d'impact CO2 - GreenWin (APPROVED)"
  },
  Digital: {
    framework: "Digital Wallonia (Transformation Numérique)",
    priority: "Priorité 2 : Résilience numérique & Cybersécurité",
    objective: "Objectif 2.3 : Conformité cyber et résilience NIS2 des PME",
    measure: "Mesure 2.3.1 : Chèques Cybersécurité d'audit et remédiation",
    service: "Cyber Diagnostic (SRV-CYBER-DIAG)",
    project: "LogiTrans Fret Vert (Actif)",
    outcome: "Dispatch logistique conforme NIS2 et chiffré",
    indicator: "Nombre d'acteurs de fret cyber-sécurisés (Aggregation: COUNT)",
    evidence: "Rapport d'audit de sécurité formel NIS2 CETIC (APPROVED)"
  }
};

export default function StrategicFrameworksPage() {
  const [selectedFw, setSelectedFw] = useState<string>("S3");
  const data = POLICY_DATA[selectedFw] || POLICY_DATA.S3;

  return (
    <PITLayout
      category="PILOTAGE DES POLITIQUES"
      title="Strategic Framework Explorer"
      description="Naviguez de manière ascendante ou descendante le long de la hiérarchie de pilotage wallonne, du cadre de référence jusqu'à la preuve d'impact."
      pageIcon={Shield}
      breadcrumb={[{ label: "Strategic Frameworks" }]}
    >
      <div className="space-y-6">
        {/* Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Cadres Politiques</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Sélectionner un cadre stratégique</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(POLICY_DATA).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFw(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  selectedFw === key 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md" 
                    : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                }`}
              >
                {key === "S3" ? "S3 Wallonie" : 
                 key === "Circular" ? "Circular Wallonia" : "Digital Wallonia"}
              </button>
            ))}
          </div>
        </div>

        {/* Tree flow visualization */}
        <div className="rounded-2xl border border-muted/20 bg-glass/20 p-8 space-y-6">
          <h4 className="text-xs font-black text-text uppercase border-b border-muted/10 pb-2">
            Lignage de la Politique Publique à la Preuve d'Impact
          </h4>

          <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-indigo-500/30">
            {/* Framework */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-amber-600 uppercase block">1. Cadre Stratégique</span>
                <span className="text-xs font-black text-text">{data.framework}</span>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-650 rounded-lg shrink-0 mt-0.5">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-indigo-650 uppercase block">2. Priorité Stratégique</span>
                <span className="text-xs font-black text-text">{data.priority}</span>
              </div>
            </div>

            {/* Objective */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-teal-500/10 text-teal-650 rounded-lg shrink-0 mt-0.5">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-teal-650 uppercase block">3. Objectif Politique</span>
                <span className="text-xs font-black text-text">{data.objective}</span>
              </div>
            </div>

            {/* Measure */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-cyan-500/10 text-cyan-600 rounded-lg shrink-0 mt-0.5">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-cyan-600 uppercase block">4. Mesure opérationnelle</span>
                <span className="text-xs font-black text-text">{data.measure}</span>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase block">5. Service Public Associé (CPSV-AP)</span>
                <span className="text-xs font-black text-text">{data.service}</span>
              </div>
            </div>

            {/* Project */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-purple-500/10 text-purple-600 rounded-lg shrink-0 mt-0.5">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-purple-600 uppercase block">6. Projet d'Innovation</span>
                <span className="text-xs font-black text-text">{data.project}</span>
              </div>
            </div>

            {/* Outcome */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-orange-500/10 text-orange-600 rounded-lg shrink-0 mt-0.5">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-orange-600 uppercase block">7. Outcome / Résultat</span>
                <span className="text-xs font-black text-text">{data.outcome}</span>
              </div>
            </div>

            {/* Indicator */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-emerald-600 uppercase block">8. Indicateur d'Impact</span>
                <span className="text-xs font-black text-text">{data.indicator}</span>
              </div>
            </div>

            {/* Evidence */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-700 rounded-lg shrink-0 mt-0.5 border border-emerald-500/30 animate-pulse">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-emerald-700 uppercase block">9. Preuve Validée d'Impact (Justificatif)</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{data.evidence}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PITLayout>
  );
}
