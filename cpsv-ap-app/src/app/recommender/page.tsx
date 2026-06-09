// src/app/recommender/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Building2, 
  FileText, 
  Compass, 
  Share2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";

interface NaceSector {
  id: number;
  code: string;
  name: string;
}

interface StrategicValueChain {
  id: number;
  name: string;
}

interface ValueChainStage {
  id: number;
  name: string;
  category: string;
}

interface BusinessChallenge {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
}

interface PublicService {
  id: number;
  name: string;
  code: string;
  organization: Organization;
  challenges: BusinessChallenge[];
  filieresS3: StrategicValueChain[];
  matchedReason?: string;
}

interface JourneyStage {
  id: number;
  name: string;
  position: number;
  services: any[];
}

interface Journey {
  id: number;
  name: string;
  provider: string;
  objective?: string;
  description?: string;
  stages: JourneyStage[];
  matchedReason?: string;
}

interface Ecosystem {
  id: number;
  name: string;
  description: string;
  mission?: string;
  actors: Organization[];
  matchedReason?: string;
}

interface Beneficiary {
  id: number;
  name: string;
  bce: string;
  size: string;
  employees: number;
  revenue: number;
  location: string;
  province: string;
  primaryNaceSector?: NaceSector;
  challenges: BusinessChallenge[];
  filieresS3: StrategicValueChain[];
  stages: ValueChainStage[];
  maturityDigital: number;
  maturityIa: number;
  maturityCyber: number;
  maturityExport: number;
  maturityDurability: number;
}

export default function RecommenderPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBId, setSelectedBId] = useState<string>("");
  
  // Données de recommandation
  const [recData, setRecData] = useState<{
    beneficiary: Beneficiary | null;
    matchedNeeds: any[];
    recommendedServices: PublicService[];
    recommendedJourneys: Journey[];
    recommendedEcosystems: Ecosystem[];
    recommendedActors: Organization[];
  }>({
    beneficiary: null,
    matchedNeeds: [],
    recommendedServices: [],
    recommendedJourneys: [],
    recommendedEcosystems: [],
    recommendedActors: []
  });

  const [loadingList, setLoadingList] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger la liste des bénéficiaires
  useEffect(() => {
    async function loadBeneficiaries() {
      try {
        setLoadingList(true);
        const res = await fetch("/api/beneficiaries");
        if (!res.ok) throw new Error("Impossible de charger les bénéficiaires.");
        const data = await res.json();
        setBeneficiaries(data);
        if (data.length > 0) {
          setSelectedBId(String(data[0].id));
        }
        setLoadingList(false);
      } catch (err: any) {
        setError(err.message);
        setLoadingList(false);
      }
    }
    loadBeneficiaries();
  }, []);

  // Calculer les recommandations
  useEffect(() => {
    if (!selectedBId) return;

    async function loadRecommendations() {
      try {
        setLoadingRec(true);
        const res = await fetch(`/api/recommender/${selectedBId}`);
        if (!res.ok) throw new Error("Erreur lors du calcul des recommandations.");
        const data = await res.json();
        setRecData(data);
        setLoadingRec(false);
      } catch (err: any) {
        console.error(err);
        setLoadingRec(false);
      }
    }

    loadRecommendations();
  }, [selectedBId]);

  if (loadingList) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du cockpit de recommandations...</p>
      </div>
    );
  }

  const b = recData.beneficiary;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Moteur de Recommandations 360°
          </h1>
          <p className="text-muted text-sm max-w-2xl">
            Calculateur d'accompagnements et de parcours sémantiques fondé sur le profil économique, les défis et le profil de maturité du bénéficiaire.
          </p>
        </div>
        
        {/* Sélecteur de bénéficiaire */}
        <div className="flex items-center space-x-2 shrink-0">
          <label className="text-xs font-bold text-muted uppercase">Bénéficiaire :</label>
          <select
            value={selectedBId}
            onChange={(e) => setSelectedBId(e.target.value)}
            className="bg-surface border border-muted rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary text-text shadow-sm"
          >
            {beneficiaries.map((benef) => (
              <option key={benef.id} value={benef.id}>{benef.name}</option>
            ))}
          </select>
        </div>
      </header>

      {b ? (
        <div className="space-y-8">
          {/* Fiche Profil & Maturité */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Infos rapides (5/12 col) */}
            <div className="lg:col-span-5 rounded-2xl bg-surface border border-muted p-6 space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-amber-500 opacity-[0.02] blur-2xl" />
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {b.size}
                </span>
                <h2 className="text-xl font-black text-text tracking-tight">{b.name}</h2>
                <p className="text-xs text-muted flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {b.location} ({b.province})
                </p>
                {b.primaryNaceSector && (
                  <p className="text-xs text-muted/90 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    Secteur principal : <strong>{b.primaryNaceSector.code}</strong> — {b.primaryNaceSector.name}
                  </p>
                )}
              </div>

              {/* Badges de filières et défis */}
              <div className="pt-4 border-t border-muted/50 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-muted">Défis d'affaires :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.challenges.map(ch => (
                      <span key={ch.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10">
                        {ch.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-muted">Filières S3 :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.filieresS3.map(f => (
                      <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10">
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profil de maturité (7/12 col) */}
            <div className="lg:col-span-7 rounded-2xl bg-surface border border-muted p-6 space-y-4">
              <h3 className="font-bold text-text text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Profil de Maturité (Scores Actuels)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Numérique / Digital", val: b.maturityDigital, color: "from-blue-500 to-indigo-500" },
                  { label: "Intelligence Artificielle (IA)", val: b.maturityIa, color: "from-purple-500 to-pink-500" },
                  { label: "Cybersécurité", val: b.maturityCyber, color: "from-red-500 to-rose-500" },
                  { label: "Exportation", val: b.maturityExport, color: "from-amber-500 to-orange-500" },
                  { label: "Durabilité / Climat", val: b.maturityDurability, color: "from-emerald-500 to-teal-500" },
                ].map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-muted bg-glass p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted truncate">{m.label}</span>
                      <span className="text-text font-bold">{m.val} / 5</span>
                    </div>
                    <div className="h-1.5 w-full bg-glass rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${m.color} rounded-full`} 
                        style={{ width: `${(m.val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loadingRec ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              <p className="text-xs text-muted animate-pulse">Calcul des préconisations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Colonne Gauche : Services & Écosystèmes (8/12 col) */}
              <div className="xl:col-span-8 space-y-8">
                {/* 1. Services Recommandés */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Services prioritaires recommandés
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recData.recommendedServices.map((s) => (
                      <div key={s.id} className="rounded-xl border border-muted bg-glass p-4 flex flex-col justify-between hover:border-primary/20 transition-all duration-200 group">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] text-muted">
                            <span className="font-mono bg-muted/40 px-1.5 py-0.5 rounded uppercase font-bold">{s.code}</span>
                            <span className="flex items-center gap-1 font-semibold">
                              <Building2 className="h-3 w-3" />
                              {s.organization.name}
                            </span>
                          </div>
                          <h4 className="font-bold text-text text-xs leading-snug group-hover:text-primary transition-colors">{s.name}</h4>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-muted/50 text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{s.matchedReason}</span>
                        </div>
                      </div>
                    ))}
                    {recData.recommendedServices.length === 0 && (
                      <p className="col-span-2 text-center text-xs text-muted italic py-6">Aucun service recommandé pour le profil actuel.</p>
                    )}
                  </div>
                </div>

                {/* 2. Parcours Recommandés */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <Compass className="h-4 w-4 text-amber-500" />
                    Parcours complets recommandés
                  </h3>
                  <div className="space-y-4">
                    {recData.recommendedJourneys.map((j) => (
                      <div key={j.id} className="rounded-xl border border-muted bg-glass p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-muted/40 pb-3">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              Propulsé par : {j.provider}
                            </span>
                            <h4 className="font-bold text-text text-sm mt-1">{j.name}</h4>
                            <p className="text-xs text-text/80 italic mt-1">{j.objective}</p>
                          </div>
                          <span className="text-[10px] font-bold text-amber-500 shrink-0">{j.matchedReason}</span>
                        </div>

                        {/* Les étapes */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 justify-between relative pl-4 sm:pl-0">
                          {j.stages.map((stage, sIdx) => (
                            <div key={stage.id} className="flex-1 flex flex-col sm:items-center relative">
                              {/* Connector line */}
                              {sIdx < j.stages.length - 1 && (
                                <div className="hidden sm:block absolute top-3 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 bg-muted" />
                              )}
                              <span className="flex h-6 w-6 sm:mx-auto items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-[10px] font-bold text-white shadow-md z-10">
                                {stage.position}
                              </span>
                              <p className="text-[10px] font-bold text-text mt-1.5 text-left sm:text-center leading-tight">{stage.name}</p>
                              <div className="flex flex-col gap-1 mt-1.5 w-full">
                                {stage.services.map((ser: any) => (
                                  <span key={ser.id} className="px-1.5 py-0.5 bg-surface border border-muted rounded text-[9px] font-semibold text-text text-left sm:text-center truncate" title={ser.name}>
                                    {ser.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {recData.recommendedJourneys.length === 0 && (
                      <p className="text-center text-xs text-muted italic py-6">Aucun parcours recommandé pour le profil actuel.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Acteurs & Écosystèmes (4/12 col) */}
              <div className="xl:col-span-4 space-y-8">
                {/* Écosystèmes régionaux */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-purple-500" />
                    Hubs & Écosystèmes régionaux
                  </h3>
                  <div className="space-y-3">
                    {recData.recommendedEcosystems.map((eco) => (
                      <div key={eco.id} className="rounded-xl border border-muted bg-glass p-3.5 space-y-2">
                        <div>
                          <h4 className="font-bold text-xs text-text">{eco.name}</h4>
                          <p className="text-[10px] text-muted mt-1 leading-normal">{eco.description}</p>
                        </div>
                        <div className="pt-2 border-t border-muted/30 text-[9px] text-purple-500 font-bold uppercase tracking-wider">
                          {eco.matchedReason}
                        </div>
                      </div>
                    ))}
                    {recData.recommendedEcosystems.length === 0 && (
                      <p className="text-center text-xs text-muted italic py-6">Aucun hub recommandé.</p>
                    )}
                  </div>
                </div>

                {/* Acteurs à solliciter */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    Acteurs locaux à solliciter
                  </h3>
                  <div className="space-y-3">
                    {recData.recommendedActors.map((actor) => (
                      <div key={actor.id} className="rounded-xl border border-muted bg-glass p-3 flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div className="truncate flex-1">
                          <p className="font-bold text-xs text-text truncate">{actor.name}</p>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted/95 bg-muted/20 px-1 py-0.5 rounded mt-0.5 inline-block">
                            {actor.type || "Opérateur public"}
                          </span>
                        </div>
                      </div>
                    ))}
                    {recData.recommendedActors.length === 0 && (
                      <p className="text-center text-xs text-muted italic py-6">Aucun acteur recommandé.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Veuillez sélectionner ou enregistrer un bénéficiaire pour charger les recommandations.
        </div>
      )}
    </div>
  );
}
