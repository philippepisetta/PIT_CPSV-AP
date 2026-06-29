// cpsv-ap-app/src/app/analysis-views/resilience/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Shield, ArrowLeft, Eye, Activity, Heart, RefreshCw, Layers, Zap, 
  AlertTriangle, HelpCircle, Building2, Users2, Euro, ShieldAlert,
  ChevronRight, Compass, Info, CheckCircle, Network, ClipboardCheck
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import ResilienceRadarChart from "@/components/resilience/ResilienceRadarChart";
import { 
  useResilienceRisks, 
  useResilienceScenarios, 
  useResilienceProfiles,
  useResilienceImpacts,
  useResilienceMeasures,
  useResilienceDependencies,
  useResilienceVulnerabilities
} from "@/hooks/useResilienceQueries";

export default function Page() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de l'Espace Résilience...</p>
      </div>
    }>
      <ResiliencePerspectivePage />
    </React.Suspense>
  );
}

function ResiliencePerspectivePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab handling from URL search parameters (?tab=...)
  const activeTab = searchParams.get("tab") || "scenarios";

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`/resilience?${params.toString()}`);
  };

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
  const { data: dependenciesRes } = useResilienceDependencies();
  const { data: vulnerabilitiesRes } = useResilienceVulnerabilities();

  const dependencies = dependenciesRes?.data || [];
  const vulnerabilities = vulnerabilitiesRes?.data || [];

  const energyCrisisScenario = scenarios.find((s: any) => s.name.toLowerCase().includes("gaz") || s.name.toLowerCase().includes("gas") || s.name.toLowerCase().includes("éner"));

  // Dynamic filter for OECD Radar
  const getFilteredProfile = () => {
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

    const clamp = (v: number) => Math.min(10, Math.max(0, v));

    const finalExp = clamp(exp);
    const finalSens = clamp(sens);
    const finalVuln = clamp((finalExp + finalSens) / 2);
    const finalAbs = clamp(abs);
    const finalAdapt = clamp(adapt);
    const finalRec = clamp(rec);

    return {
      exposure: finalExp,
      sensitivity: finalSens,
      vulnerability: finalVuln,
      absorptionCapacity: finalAbs,
      adaptiveCapacity: finalAdapt,
      recoveryCapacity: finalRec
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
      category="VUE D'ANALYSE & STRATÉGIE"
      title="Espace Résilience Territoriale"
      description="Cartographiez les risques de crise, pilotez la résilience économique et anticipez les impacts territoriaux à l'aide des cadres de rebond et d'analyse."
      pageIcon={Shield}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Résilience" }]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          {[
            { id: "scenarios", label: "Scénarios & Crises", icon: AlertTriangle },
            { id: "oecd", label: "Indicateurs OCDE", icon: Activity },
            { id: "supply-chains", label: "Chaînes de valeur critiques", icon: Network },
            { id: "action-plans", label: "Plans de réponse & actions", icon: ClipboardCheck },
            { id: "vulnerabilities", label: "Vulnérabilités territoriales", icon: Shield }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer border-0 ${
                  isSelected 
                    ? "bg-red-600 text-white shadow-sm" 
                    : "text-muted hover:text-text hover:bg-glass/10"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="space-y-8">
        
        {/* Narrative Policy Banner */}
        <div className="p-6 rounded-2xl bg-glass border border-muted/20 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 opacity-[0.03] blur-3xl rounded-full" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-red-500/15 text-red-650 px-2 py-0.5 rounded-full border border-red-500/20">
              Cadre Analytique Stratégique
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-text">Politique de Préparation — PIT & CORTEX</h2>
          <p className="text-xs text-text leading-relaxed font-semibold">
            Cet espace modélise l&apos;impact structurel de crises majeures sur les écosystèmes et acteurs territoriaux wallons. Les risques de référence sont alignés avec la taxonomie nationale CORTEX, tandis que la PIT cartographie la résilience, qualifie l&apos;exposition et propose des services publics de rebond.
          </p>
        </div>

        {/* Disclaimer Notice Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-amber-800 dark:text-amber-400 block mb-0.5">Disclaimer important</strong>
            <p className="text-muted leading-relaxed font-semibold">
              La PIT ne constitue pas un outil de gestion opérationnelle de crise (qui relève des centres de crise régionaux ou nationaux), mais propose un outil de simulation analytique à des fins de préparation stratégique et de politique publique.
            </p>
          </div>
        </div>

        {/* OECD Dimensions Grid */}
        <div className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center border-b border-muted/10 pb-1.5">
            <h3 className="text-xs font-black uppercase text-muted tracking-wider">Dimensions de Résilience OCDE</h3>
            <span className="text-[10px] text-muted italic font-bold">Cadre stratégique de rebond</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {oecdFramework.map((item, idx) => (
              <div key={idx} className="bg-glass/20 border border-muted/10 p-2.5 rounded-lg text-center space-y-1">
                <span className="text-[9px] font-black text-muted uppercase block">{item.title}</span>
                <span className={`text-xs font-black px-1.5 py-0.5 rounded inline-block ${item.color}`}>
                  {item.val.toFixed(1)} / 10
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 1. SCÉNARIOS & CRISES */}
        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-glass/20 border border-muted/10 p-5 rounded-2xl">
              {/* Left: Use Case Selection & Navigation */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-rose-650">Risque CORTEX Actif</span>
                  <span className="text-sm font-black text-text block">Crise Énergétique</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-amber-650">Scénario de simulation</span>
                  <span className="text-xs font-bold text-text block leading-tight">Hausse des prix du gaz ×3 pendant 6 mois</span>
                </div>

                <div className="pt-2">
                  <span className="text-[9px] font-black text-muted block uppercase mb-1">Détails de la Chaîne d&apos;Impact</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: "risk", label: "⚠️ Risque & Alignement" },
                      { id: "impact", label: "📊 Conséquences Économiques" },
                      { id: "actors", label: "🏢 Acteurs & Écosystèmes" },
                      { id: "response", label: "🛡️ Réponse & Soutien" }
                    ].map(step => (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                          activeStep === step.id ? "bg-red-500/10 text-red-650 border border-red-500/15" : "text-muted hover:text-text border border-transparent"
                        }`}
                      >
                        <span>{step.label}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Step Content */}
              <div className="lg:col-span-3 min-h-[280px] bg-glass/40 border border-muted/10 p-5 rounded-xl flex flex-col justify-between">
                {activeStep === "risk" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-rose-650" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-text">Détail du Risque & Alignement CORTEX</h4>
                    </div>
                    <p className="text-xs text-text font-semibold leading-relaxed">
                      Ce scénario simule une rupture structurelle de l&apos;approvisionnement gazier européen entraînant un triplement du prix du gaz de marché pour les industriels wallons. La PIT cartographie la répercussion de ce choc.
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
                      <h4 className="text-xs font-black uppercase tracking-wider text-text">Conséquences Économiques Estimées</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-650">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted block uppercase">PMEs Exposées</span>
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
                          <span className="text-[9px] font-black text-muted block uppercase">Chiffre d&apos;Affaires</span>
                          <span className="text-sm font-black text-text">4.2 Mrds €</span>
                        </div>
                      </div>
                      <div className="p-4 bg-teal-500/5 border border-teal-500/15 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-650">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-muted block uppercase">Budget Rebond</span>
                          <span className="text-sm font-black text-text">120 M €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === "actors" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-indigo-650" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-text">Acteurs & Écosystèmes affectés</h4>
                    </div>
                    <div className="space-y-3 text-xs">
                      <p className="font-semibold text-text">Filières S3 Métallurgie & Chimie (ex: Aperam, Industeel). Ces acteurs dépendent structurellement du gaz comme intrant ou énergie.</p>
                      <p className="font-semibold text-text">Écosystème TWEED (Clusters Énergétiques). Acteurs mobilisés pour concevoir des plans d&apos;efficacité énergétique rapide.</p>
                    </div>
                  </div>
                )}

                {activeStep === "response" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-650" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-text">Dispositifs de Réponses & Soutien Actifs</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl space-y-1">
                        <strong className="text-teal-700 dark:text-teal-400">Diagnostic Efficacité Énergétique EDIH</strong>
                        <p className="text-[10px] text-muted leading-relaxed">Aide technique de l&apos;Agence du Numérique (ADN) pour réduire la dépendance thermique.</p>
                      </div>
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                        <strong className="text-emerald-700 dark:text-emerald-400">Enveloppe d&apos;Aide Conjoncturelle Wallonie</strong>
                        <p className="text-[10px] text-muted leading-relaxed">Prêts d&apos;urgence octroyés par Wallonie Entreprendre pour stabiliser les coûts énergétiques.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-muted/10 pt-4 mt-auto">
                  <span className="text-[9px] text-muted font-black tracking-widest uppercase">Navigation : {activeStep.toUpperCase()}</span>
                  <Link href="/resilience/demonstrator" className="text-[10px] font-black text-red-605 hover:underline flex items-center gap-1">
                    <span>Ouvrir Démonstrateur Cabinet (Caroline) →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Questions PIT Can Answer */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-red-600" />
                <span>Questions préparatoires aux crises</span>
              </h3>
              <div className="flex gap-2 border-b border-muted/10 pb-3">
                <button onClick={() => setActiveQuestionTab("energy")} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${activeQuestionTab === "energy" ? "bg-red-500/10 text-red-750 border border-red-500/20" : "text-muted hover:text-text border border-transparent"}`}>🔥 Crise Énergétique</button>
                <button onClick={() => setActiveQuestionTab("flood")} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${activeQuestionTab === "flood" ? "bg-red-500/10 text-red-750 border border-red-500/20" : "text-muted hover:text-text border border-transparent"}`}>🌊 Inondations</button>
                <button onClick={() => setActiveQuestionTab("pandemic")} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${activeQuestionTab === "pandemic" ? "bg-red-500/10 text-red-750 border border-red-500/20" : "text-muted hover:text-text border border-transparent"}`}>🦠 Pandémie</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeQuestionTab === "energy" && (
                  <>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">1. Vulnérabilité Sectorielle</span>
                      <p className="text-xs font-bold text-text">Quels secteurs consomment le plus de gaz ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">La sidérurgie et la chimie concentrent plus de 70% de la consommation industrielle régionale.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">2. Risque sur l&apos;Emploi</span>
                      <p className="text-xs font-bold text-text">Combien d&apos;emplois sont menacés par la crise ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Près de 18 500 ETP industriels se situent dans la première ligne d&apos;impact de coût.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">3. Dispositifs de Soutien</span>
                      <p className="text-xs font-bold text-text">Quelles solutions financières existent ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Le prêt d&apos;urgence trésorerie de Wallonie Entreprendre et le conseil de l&apos;EDIH.</p>
                    </div>
                  </>
                )}
                {activeQuestionTab === "flood" && (
                  <>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">1. Exposition Géospatiale</span>
                      <p className="text-xs font-bold text-text">Quelles entreprises sont en zone inondable ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Lignage géospatial croisant les cartes d&apos;aléa SPW et les adresses du Graphe Territorial.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">2. Secteurs Impactés</span>
                      <p className="text-xs font-bold text-text">Quels bassins industriels sont touchés ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Le bassin de la Vesdre et la basse Sambre concentrent de nombreuses PME industrielles.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">3. Infrastructure de Secours</span>
                      <p className="text-xs font-bold text-text">Où délocaliser les stocks ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Recherche dans le Graphe d&apos;entrepôts logistiques non inondables à proximité.</p>
                    </div>
                  </>
                )}
                {activeQuestionTab === "pandemic" && (
                  <>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">1. Impact RDI</span>
                      <p className="text-xs font-bold text-text">Comment réorienter la production ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Soutien aux consortia de recherche biotechnologique pour le développement de vaccins ou matériel médical.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">2. Télétravail & Numérique</span>
                      <p className="text-xs font-bold text-text">Quels secteurs sont compatibles ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Évaluation de la maturité DMAT pour adapter le travail à distance.</p>
                    </div>
                    <div className="bg-glass/35 border border-muted/15 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-red-650 block uppercase">3. Continuité de Service</span>
                      <p className="text-xs font-bold text-text">Quelles sont les aides maintenues ?</p>
                      <p className="text-[10px] text-muted font-semibold mt-1">Numérisation et automatisation de l'instruction des dossiers d'aides.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. INDICATEURS OCDE */}
        {activeTab === "oecd" && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="p-4 bg-glass border border-muted/15 rounded-xl flex flex-wrap gap-4 items-center">
              <div className="flex flex-col gap-1 text-xs">
                <label className="text-[9px] font-black text-muted uppercase">Territoire</label>
                <select value={selectedTerritory} onChange={(e) => setSelectedTerritory(e.target.value)} className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg">
                  <option value="wallonia">Wallonie (Région)</option>
                  <option value="bassin-sambre">Bassin de la Sambre</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <label className="text-[9px] font-black text-muted uppercase">Filière S3</label>
                <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)} className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg">
                  <option value="all">Toutes les filières</option>
                  <option value="metallurgy">Métallurgie</option>
                  <option value="digital">Technologies Numériques</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <label className="text-[9px] font-black text-muted uppercase">Écosystème</label>
                <select value={selectedEcosystem} onChange={(e) => setSelectedEcosystem(e.target.value)} className="bg-muted/10 border border-muted/20 text-xs font-bold text-text px-2 py-1 rounded-lg">
                  <option value="all">Tous</option>
                  <option value="tweed">TWEED (Énergie)</option>
                  <option value="biowin">BioWin (Santé)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Radar Chart */}
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

              {/* Framework details */}
              <div className="grid grid-cols-2 gap-3">
                {oecdFramework.map((item, idx) => (
                  <div key={idx} className="bg-glass/30 border border-muted/10 p-4 rounded-xl flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-muted uppercase">{item.title}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.color}`}>
                        {item.val.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[9px] leading-normal text-muted font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. CHAÎNES DE VALEUR CRITIQUES */}
        {activeTab === "supply-chains" && (
          <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Dépendances critiques & Souveraineté industrielle</h3>
              <p className="text-xs text-muted leading-relaxed font-semibold">Identifiez les matériaux critiques de premier rang requis par les filières technologiques wallonnes, et les sources d&apos;approvisionnement vulnérables.</p>
            </div>

            {dependencies.length === 0 ? (
              <p className="text-xs text-muted italic text-center py-6">Aucune dépendance critique répertoriée.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-muted/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-glass/10 border-b border-muted/10 font-bold uppercase text-[9px] text-muted">
                      <th className="p-3">Matériau / Composant</th>
                      <th className="p-3">Filière S3 concernée</th>
                      <th className="p-3">Pays Source Critique</th>
                      <th className="p-3">Fournisseur alternatif</th>
                      <th className="p-3">Niveau de risque</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/10 font-semibold text-text">
                    {dependencies.map((d: any) => (
                      <tr key={d.id} className="hover:bg-glass/5">
                        <td className="p-3 font-bold">{d.materialName}</td>
                        <td className="p-3 text-red-650">{d.filiereName || "Multi-filières"}</td>
                        <td className="p-3 font-mono">{d.criticalSourceCountry || "Hors-UE"}</td>
                        <td className="p-3">{d.alternativeSupplier || "Recherche en cours"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            d.criticalityLevel === "HAUT" 
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" 
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}>
                            {d.criticalityLevel || "MOYEN"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. PLANS DE RÉPONSE & ACTIONS */}
        {activeTab === "action-plans" && (
          <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Mesures d&apos;atténuation & Services de rebond</h3>
              <p className="text-xs text-muted leading-relaxed font-semibold">Consultez les dispositifs d&apos;urgence régionaux déployés pour atténuer l&apos;exposition économique face aux chocs d&apos;autorité.</p>
            </div>

            {measures.length === 0 ? (
              <p className="text-xs text-muted italic text-center py-6">Aucun plan de réponse répertorié dans la base.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {measures.map((m: any) => (
                  <div key={m.id} className="p-5 bg-glass/20 border border-muted/15 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-wider text-red-605 bg-red-500/10 px-2 py-0.5 rounded-full">
                        {m.status || "Actif"}
                      </span>
                      <span className="text-xs font-bold text-text">{m.budget ? `${m.budget.toLocaleString()} €` : "Budget non-défini"}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-text leading-snug">{m.name}</h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">{m.description}</p>
                    <div className="pt-2 border-t border-muted/5 flex justify-between items-center text-[9px] text-muted">
                      <span>Responsable : {m.responsibleOperator || "SPW"}</span>
                      <span>Risque lié : {m.riskCategory || "Général"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. VULNÉRABILITÉS TERRITORIALES */}
        {activeTab === "vulnerabilities" && (
          <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-purple-650 tracking-wider">Cartographie des Vulnérabilités Locales</h3>
              <p className="text-xs text-muted leading-relaxed font-semibold">Analysez les indices d&apos;exposition géographiques par sous-régions ou par bassins d&apos;emploi wallons.</p>
            </div>

            {vulnerabilities.length === 0 ? (
              <p className="text-xs text-muted italic text-center py-6">Aucun indicateur de vulnérabilité géographique enregistré.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vulnerabilities.map((v: any) => (
                  <div key={v.id} className="bg-glass/25 border border-muted/15 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-text uppercase">{v.regionName || "Région"}</span>
                      <span className="text-xs font-black text-red-605">{v.scoreIndex || 5.0} / 10</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{v.description || "Indice calculé sur la densité d'acteurs exposés."}</p>
                    <div className="pt-2 border-t border-muted/5 text-[9px] text-muted">
                      <span>Facteur principal : {v.mainFactor || "Dépendance énergétique"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </PITLayout>
  );
}
