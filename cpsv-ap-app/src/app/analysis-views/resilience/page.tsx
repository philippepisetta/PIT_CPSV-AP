// cpsv-ap-app/src/app/analysis-views/resilience/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, ArrowLeft, Eye, Activity, Heart, RefreshCw, Layers, Zap, 
  AlertTriangle, HelpCircle, Building2, Users2, Euro, ShieldAlert,
  ChevronRight, Compass, Info, CheckCircle
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import ResilienceRadarChart from "@/components/resilience/ResilienceRadarChart";
import { 
  useResilienceRisks, 
  useResilienceScenarios, 
  useResilienceProfiles,
  useResilienceImpacts,
  useResilienceMeasures
} from "@/hooks/useResilienceQueries";
import { useMetaQuery } from "@/hooks/usePITQueries";

export default function ResiliencePerspectivePage() {
  const [activeQuestionTab, setActiveQuestionTab] = useState<string>("energy");
  const [selectedTerritory, setSelectedTerritory] = useState<string>("wallonia");
  const [selectedFiliere, setSelectedFiliere] = useState<string>("all");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>("all");
  const [selectedBeneType, setSelectedBeneType] = useState<string>("all");

  const [activeStep, setActiveStep] = useState<string>("risk");

  // Fetch data
  const { data: risks = [] } = useResilienceRisks();
  const { data: scenarios = [] } = useResilienceScenarios();
  const { data: profiles = [] } = useResilienceProfiles();
  const { data: impacts = [] } = useResilienceImpacts();
  const { data: measures = [] } = useResilienceMeasures();
  const { data: meta = {} } = useMetaQuery();

  const energyCrisisRisk = risks.find((r: any) => r.category === "NATURAL" || r.name.toLowerCase().includes("éner") || r.name.toLowerCase().includes("energy"));
  const energyCrisisScenario = scenarios.find((s: any) => s.name.toLowerCase().includes("gaz") || s.name.toLowerCase().includes("gas"));

  // Dynamic filter for OECD Radar
  // In a real application we fetch/calculate this, here we map to database profiles or calculate realistic variations
  const getFilteredProfile = () => {
    // Default Wallonia structural profile (Seeded ID 9 or fallback)
    const walloniaProfile = profiles.find((p: any) => p.territoryId !== null) || {
      exposure: 6.0,
      sensitivity: 5.0,
      vulnerability: 5.5,
      absorptionCapacity: 6.0,
      adaptiveCapacity: 7.0,
      recoveryCapacity: 6.5,
      overallResilience: 6.5
    };

    let exp = walloniaProfile.exposure;
    let sens = walloniaProfile.sensitivity;
    let abs = walloniaProfile.absorptionCapacity;
    let adapt = walloniaProfile.adaptiveCapacity;
    let rec = walloniaProfile.recoveryCapacity;

    // Apply mock dynamic modifiers based on filter selections for demo reactivity
    if (selectedTerritory === "bassin-sambre") {
      exp += 1.5; sens += 1.0; abs -= 1.0;
    }
    if (selectedFiliere === "metallurgy") {
      exp += 2.0; sens += 1.5; abs -= 1.5; adapt -= 0.5;
    } else if (selectedFiliere === "digital") {
      exp -= 2.0; sens -= 1.0; abs += 1.0; adapt += 1.5;
    }
    if (selectedEcosystem === "tweed") {
      adapt += 1.0; rec += 1.0;
    }
    if (selectedBeneType === "pme") {
      abs -= 1.5; adapt -= 1.0;
    } else if (selectedBeneType === "large") {
      abs += 1.5; adapt += 0.5;
    }

    // Clamp values 0-10
    const clamp = (v: number) => Math.min(10, Math.max(0, v));

    const finalExp = clamp(exp);
    const finalSens = clamp(sens);
    const finalVuln = clamp((finalExp + finalSens) / 2);
    const finalAbs = clamp(abs);
    const finalAdapt = clamp(adapt);
    const finalRec = clamp(rec);
    const finalOverall = clamp((finalAbs + finalAdapt + finalRec) / 3);

    return {
      exposure: finalExp,
      sensitivity: finalSens,
      vulnerability: finalVuln,
      absorptionCapacity: finalAbs,
      adaptiveCapacity: finalAdapt,
      recoveryCapacity: finalRec,
      overallResilience: finalOverall
    };
  };

  const currentProfile = getFilteredProfile();

  const oecdFramework = [
    { title: "Exposition", val: currentProfile.exposure, color: "text-rose-650 bg-rose-500/10", desc: "Localisation, zones sensibles, dépendance énergétique." },
    { title: "Sensibilité", val: currentProfile.sensitivity, color: "text-amber-650 bg-amber-500/10", desc: "Structure de coûts, fragilité financière intrinsèque." },
    { title: "Vulnérabilité", val: currentProfile.vulnerability, color: "text-orange-650 bg-orange-500/10", desc: "Indice global net (Exposition × Sensibilité)." },
    { title: "Absorption", val: currentProfile.absorptionCapacity, color: "text-teal-650 bg-teal-500/10", desc: "Capacité à amortir le choc (fonds propres, réserves)." },
    { title: "Adaptation", val: currentProfile.adaptiveCapacity, color: "text-indigo-650 bg-indigo-500/10", desc: "Flexibilité opérationnelle (alternatives, réseaux)." },
    { title: "Rebond", val: currentProfile.recoveryCapacity, color: "text-emerald-650 bg-emerald-500/10", desc: "Assurances, financements et services publics disponibles." }
  ];

  return (
    <PITLayout
      category="VUE D'ANALYSE"
      title="Résilience territoriale"
      description="Tableau de bord stratégique pour l’analyse d’impact, de vulnérabilité et de rebond territorial."
      pageIcon={Shield}
      breadcrumb={[{ label: "Vues d'analyse", href: "/analysis-views" }, { label: "Résilience territoriale" }]}
    >
      <div className="space-y-8">
        
        {/* CORTEX Narrative Banner */}
        <div className="p-6 rounded-2xl bg-glass border border-muted/20 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500 opacity-[0.03] blur-3xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-teal-500/15 text-teal-650 px-2 py-0.5 rounded-full border border-teal-500/20">
              Cadre Analytique Stratégique
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-text">Narration Politique — PIT & CORTEX</h2>
          <p className="text-xs text-text leading-relaxed font-semibold">
            La PIT ne constitue pas un outil de gestion opérationnelle de crise. Elle constitue un socle informationnel et analytique permettant de mieux préparer les décisions, cibler les aides, identifier les vulnérabilités et mobiliser les services de soutien disponibles.
          </p>
          <div className="text-[11px] text-muted font-semibold bg-muted/5 border border-muted/10 p-3 rounded-xl flex flex-col md:flex-row gap-4">
            <div>
              <strong className="text-rose-650">CORTEX</strong> qualifie et centralise les <strong className="text-text">Risques</strong> (ex: Crise Énergétique, Inondation).
            </div>
            <div className="hidden md:block border-r border-muted/20" />
            <div>
              <strong className="text-teal-650">La PIT</strong> matérialise l'<strong className="text-text">Impact structurel</strong> (Acteurs affectés, Filières vulnérables, et Dispositifs de Rebond disponibles).
            </div>
          </div>
        </div>

        {/* Section 1: Questions PIT Can Answer */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-teal-650" />
            <span>Questions auxquelles la PIT peut répondre</span>
          </h3>

          <div className="flex gap-2 border-b border-muted/10 pb-3 overflow-x-auto">
            <button 
              onClick={() => setActiveQuestionTab("energy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeQuestionTab === "energy" ? "bg-amber-500/10 text-amber-700 border border-amber-500/20" : "text-muted hover:text-text border border-transparent"
              }`}
            >
              🔥 Crise Énergétique
            </button>
            <button 
              onClick={() => setActiveQuestionTab("flood")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeQuestionTab === "flood" ? "bg-blue-500/10 text-blue-700 border border-blue-500/20" : "text-muted hover:text-text border border-transparent"
              }`}
            >
              🌊 Inondations
            </button>
            <button 
              onClick={() => setActiveQuestionTab("pandemic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeQuestionTab === "pandemic" ? "bg-rose-500/10 text-rose-700 border border-rose-500/20" : "text-muted hover:text-text border border-transparent"
              }`}
            >
              🦠 Pandémie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeQuestionTab === "energy" && (
              <>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-amber-700 block uppercase">1. Vulnérabilité Sectorielle</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quelles filières S3 et secteurs sont les plus exposés ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    La métallurgie, la chimie et le ciment représentent 72% de la consommation de gaz industriel wallon.
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-amber-700 block uppercase">2. Impact Entreprises & Emplois</span>
                  <span className="text-xs font-bold text-text block leading-tight">Combien d'acteurs et d'emplois sont potentiellement affectés ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Environ 142 structures clés et 18 500 emplois ETP se situent dans la zone d'impact de premier rang.
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-amber-700 block uppercase">3. Dispositifs de Soutien</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quels programmes de soutien financiers ou services publics sont mobilisables ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Le programme régional d'aide conjoncturelle gaz/électricité et les services de diagnostic de l'EDIH.
                  </p>
                </div>
              </>
            )}

            {activeQuestionTab === "flood" && (
              <>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-blue-750 block uppercase">1. Exposition Géospatiale</span>
                  <span className="text-xs font-bold text-text block leading-tight">Combien d'entreprises sont situées dans les zones d'aléa d'inondation ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Lignage croisé entre les zonages géographiques SPW et la base des bénéficiaires actifs de la PIT.
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-blue-750 block uppercase">2. Impact sur l'Activité</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quelles sont les activités économiques touchées à court terme ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Forte concentration d'ateliers industriels et de plateformes logistiques exposés dans les bassins de la Vesdre et de la Sambre.
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-blue-750 block uppercase">3. Plan de Rebond</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quels services de logistique et d'infrastructure de secours sont disponibles ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Accès aux infrastructures critiques résilientes (hubs logistiques de délestage) et aides WE.
                  </p>
                </div>
              </>
            )}

            {activeQuestionTab === "pandemic" && (
              <>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-rose-700 block uppercase">1. Ruptures de Chaînes de Valeur</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quelles chaînes d'approvisionnement sont menacées ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Cartographie des dépendances critiques (matières premières, composants électroniques imports).
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-rose-700 block uppercase">2. Sensibilité Humaine</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quelles structures requièrent du télétravail ou de l'adaptation immédiate ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Analyse de maturité numérique pour cibler les diagnostics urgents de l'EDIH.
                  </p>
                </div>
                <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-rose-700 block uppercase">3. Mobilisation de Trésorerie</span>
                  <span className="text-xs font-bold text-text block leading-tight">Quelles aides financières et prêts garantis par la Région sont actifs ?</span>
                  <p className="text-[10px] text-muted font-semibold leading-normal">
                    Dispositifs de prêts d'urgence wallons (WE) et exonérations temporaires.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Energy Crisis Use Case & Navigation Path */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-2">
            <Compass className="h-4 w-4 text-teal-650" />
            <span>Cas d'usage Actif : Crise Énergétique (Démonstrateur CORTEX / Caroline)</span>
          </h3>

          {/* Demonstrator Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-glass/20 border border-muted/10 p-5 rounded-2xl">
            
            {/* Left: Use Case Selection & Metadata */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-rose-650">Risque CORTEX</span>
                <span className="text-sm font-black text-text block">Crise Énergétique</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-amber-650">Scénario Testé</span>
                <span className="text-xs font-bold text-text block leading-tight">Hausse des prix du gaz ×3 pendant 6 mois</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-muted">Territoire cible</span>
                <span className="text-xs font-semibold text-muted block">Wallonie (Région)</span>
              </div>

              <div className="pt-2">
                <span className="text-[9px] font-black text-muted block uppercase mb-1">Navigation dans la Chaîne d'Impact</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: "risk", label: "⚠️ Risque & Scénario" },
                    { id: "impact", label: "📊 Conséquences Économiques" },
                    { id: "actors", label: "🏢 Acteurs & Écosystèmes" },
                    { id: "response", label: "🛡️ Réponse & Soutien" }
                  ].map(step => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                        activeStep === step.id ? "bg-teal-500/10 text-teal-650 border border-teal-500/15" : "text-muted hover:text-text border border-transparent"
                      }`}
                    >
                      <span>{step.label}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Active Step Visualizations */}
            <div className="lg:col-span-3 min-h-[280px] bg-glass/40 border border-muted/10 p-5 rounded-xl flex flex-col justify-between">
              
              {activeStep === "risk" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-rose-650" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-text">Détail du Risque & Alignement CORTEX</h4>
                  </div>
                  <p className="text-xs text-text font-semibold leading-relaxed">
                    Ce scénario simule une rupture structurelle de l'approvisionnement gazier européen entraînant un triplement du prix du gaz de marché pour les industriels wallons. La PIT cartographie la répercussion de ce choc.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl text-center">
                      <span className="text-[10px] font-black text-muted block">SÉVÉRITÉ</span>
                      <span className="text-sm font-black text-rose-650">4 / 5</span>
                    </div>
                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl text-center">
                      <span className="text-[10px] font-black text-muted block">PROBABILITÉ</span>
                      <span className="text-sm font-black text-amber-650">Élevée (0.7)</span>
                    </div>
                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl text-center">
                      <span className="text-[10px] font-black text-muted block">HORIZON</span>
                      <span className="text-sm font-black text-text">Moyen Terme</span>
                    </div>
                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl text-center">
                      <span className="text-[10px] font-black text-muted block">ALÉAS LIÉS</span>
                      <span className="text-sm font-black text-text">DROUGHT, WILDFIRE</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "impact" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-650" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-text">Conséquences Économiques Estimées (Décideur-Orienté)</h4>
                  </div>
                  
                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-rose-500/10 rounded-lg text-rose-650">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-muted block uppercase">Structures Exposées</span>
                        <span className="text-sm font-black text-text">142</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-650">
                        <Users2 className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-muted block uppercase">Emplois Menacés</span>
                        <span className="text-sm font-black text-text">18 500 ETP</span>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-650">
                        <Euro className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-muted block uppercase">Chiffre d'Affaires</span>
                        <span className="text-sm font-black text-text">4.2 Mrds €</span>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-500/5 border border-teal-500/15 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-teal-500/10 rounded-lg text-teal-650">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-muted block uppercase">Budget Estimé</span>
                        <span className="text-sm font-black text-text">120 M €</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted italic font-semibold mt-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-muted" />
                    <span>Valeurs illustratives à des fins de démonstration Cabinet.</span>
                  </div>
                </div>
              )}

              {activeStep === "actors" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-650" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-text">Acteurs, Filières & Écosystèmes Impactés</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-text">Filière S3 Métallurgie & Chimie (Wallonie)</span>
                        <p className="text-[10px] text-muted font-semibold">Choc de coût de production immédiat sur les fonderies.</p>
                      </div>
                      <span className="text-[9px] font-black bg-rose-500/10 text-rose-650 px-2 py-0.5 rounded border border-rose-500/20 uppercase">Critique</span>
                    </div>

                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-text">Écosystème TWEED (Clusters Énergie)</span>
                        <p className="text-[10px] text-muted font-semibold">Mobilisation requise des technologies d'efficacité énergétique.</p>
                      </div>
                      <span className="text-[9px] font-black bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/20 uppercase">Moyen</span>
                    </div>

                    <div className="p-3 bg-muted/5 border border-muted/10 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-text">Grands Bénéficiaires (ex: Aperam, Industeel, ADN)</span>
                        <p className="text-[10px] text-muted font-semibold">Identifiés via le Graphe de Connaissances comme dépendants du gaz.</p>
                      </div>
                      <span className="text-[9px] font-black bg-rose-500/10 text-rose-650 px-2 py-0.5 rounded border border-rose-500/20 uppercase">Critique</span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "response" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-650" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-text">Dispositifs de Réponses & Soutien Public Existants</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl space-y-2">
                      <span className="text-[10px] font-black text-teal-650 block uppercase">1. Services Publics Relais (CPSV-AP)</span>
                      <span className="text-xs font-bold text-text block">Diagnostic Efficacité Énergétique EDIH</span>
                      <p className="text-[10px] text-muted font-semibold">
                        Aide technique fournie par l'Agence du Numérique (ADN) pour cartographier et réduire les consommations.
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                      <span className="text-[10px] font-black text-emerald-650 block uppercase">2. Programmes Financiers (S3)</span>
                      <span className="text-xs font-bold text-text block">Enveloppe d'Aide Conjoncturelle Régionale</span>
                      <p className="text-[10px] text-muted font-semibold">
                        Subventions directes et prêts d'urgence WE pour stabiliser la trésorerie des PME sidérurgiques et chimiques.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              <div className="flex justify-between items-center border-t border-muted/10 pt-4 mt-auto">
                <span className="text-[9px] text-muted font-black tracking-widest uppercase">Étape active : {activeStep.toUpperCase()}</span>
                <Link
                  href="/strategic"
                  className="text-[10px] font-black text-teal-655 hover:underline flex items-center gap-1"
                >
                  <span>Voir le Démonstrateur Exécutif</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Section 3: OECD Resilience View (Radar Chart + Filters) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-650" />
            <span>Visualisation Analytique de la Résilience (Cadre OCDE)</span>
          </h3>

          {/* Filters Bar */}
          <div className="p-4 bg-glass border border-muted/15 rounded-xl flex flex-wrap gap-4 items-center">
            
            {/* Territory */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-muted uppercase">Territoire</label>
              <select 
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
                className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="wallonia">Wallonie (Région)</option>
                <option value="bassin-sambre">Bassin de la Sambre</option>
              </select>
            </div>

            {/* Filiere */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-muted uppercase">Filière S3</label>
              <select 
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="all">Toutes les Filières</option>
                <option value="metallurgy">Métallurgie</option>
                <option value="digital">Technologies Numériques</option>
              </select>
            </div>

            {/* Ecosystem */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-muted uppercase">Écosystème</label>
              <select 
                value={selectedEcosystem}
                onChange={(e) => setSelectedEcosystem(e.target.value)}
                className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="all">Tous les Écosystèmes</option>
                <option value="tweed">TWEED (Énergie)</option>
                <option value="biowin">BioWin (Santé)</option>
              </select>
            </div>

            {/* Beneficiary Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-muted uppercase">Type de Structure</label>
              <select 
                value={selectedBeneType}
                onChange={(e) => setSelectedBeneType(e.target.value)}
                className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value="all">Tous types</option>
                <option value="pme">PME / TPE</option>
                <option value="large">Grandes Entreprises</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Radar Chart */}
            <div className="lg:col-span-2">
              <ResilienceRadarChart
                exposure={currentProfile.exposure}
                sensitivity={currentProfile.sensitivity}
                vulnerability={currentProfile.vulnerability}
                absorptionCapacity={currentProfile.absorptionCapacity}
                adaptiveCapacity={currentProfile.adaptiveCapacity}
                recoveryCapacity={currentProfile.recoveryCapacity}
              />
            </div>

            {/* Right: Scores Cards */}
            <div className="grid grid-cols-2 gap-3">
              {oecdFramework.map((item, idx) => (
                <div key={idx} className="bg-glass/30 border border-muted/10 p-4 rounded-xl flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-muted uppercase">{item.title}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.color}`}>
                      {item.val.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[9px] leading-normal text-muted font-semibold">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link 
            href="/analysis-views"
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-muted/30 hover:bg-glass/50 text-xs font-bold rounded-xl transition-all text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux Vues d'analyse</span>
          </Link>
        </div>

      </div>
    </PITLayout>
  );
}
