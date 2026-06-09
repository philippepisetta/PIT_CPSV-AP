// src/app/journeys/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Compass, 
  Map, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Building2,
  ExternalLink
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  code: string;
}

interface PublicService {
  id: number;
  name: string;
  code: string;
  description: string;
  organization: Organization;
}

interface JourneyStage {
  id: number;
  name: string;
  position: number;
  services: PublicService[];
}

interface StrategicValueChain {
  id: number;
  name: string;
}

interface BusinessChallenge {
  id: number;
  name: string;
}

interface Journey {
  id: number;
  name: string;
  provider: string;
  objective: string;
  description?: string;
  targetAudience: string[];
  challenges: BusinessChallenge[];
  filieresS3: StrategicValueChain[];
  stages: JourneyStage[];
}

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJourneys() {
      try {
        setLoading(true);
        const response = await fetch("/api/journeys");
        if (!response.ok) throw new Error("Impossible de charger le catalogue des parcours.");
        const data = await response.json();
        setJourneys(data);
        if (data.length > 0) {
          setSelectedJourney(data[0]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadJourneys();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des parcours de transformation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold mb-2">Erreur de chargement</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
          Parcours de Transformation
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          Découvrez les chemins d'accompagnement thématiques inter-acteurs configurés pour guider les PME régionales de la sensibilisation jusqu'à l'industrialisation.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Liste des parcours (4/12 col) */}
        <section className="lg:col-span-4 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[70vh] overflow-y-auto" aria-label="Liste des parcours">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
            <Map className="h-4 w-4 text-primary" />
            Parcours de référence
          </h2>
          <div className="space-y-1">
            {journeys.map((j) => {
              const isSelected = selectedJourney?.id === j.id;
              return (
                <button
                  key={j.id}
                  onClick={() => setSelectedJourney(j)}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <Compass className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{j.name}</p>
                    <p className="text-xs text-muted/80 truncate">Fournisseur : {j.provider}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Timeline & Détail du parcours (8/12 col) */}
        <section className="lg:col-span-8 space-y-8" aria-label="Détail du parcours sélectionné">
          {selectedJourney ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Infos générales */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-amber-500 opacity-[0.02] blur-3xl" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    Propulsé par : {selectedJourney.provider}
                  </span>
                  <h2 className="text-2xl font-black text-text tracking-tight mt-2">{selectedJourney.name}</h2>
                  {selectedJourney.objective && (
                    <p className="text-sm text-text/90 mt-2 italic">
                      "Objectif : {selectedJourney.objective}"
                    </p>
                  )}
                  {selectedJourney.description && (
                    <p className="text-xs text-muted mt-2">
                      {selectedJourney.description}
                    </p>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="pt-4 border-t border-muted grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-bold text-muted flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Défis adressés :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJourney.challenges.map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-muted flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-amber-500" />
                      Filières S3 :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJourney.filieresS3.map(f => (
                        <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline verticale */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-6">
                <h3 className="font-bold text-text text-sm flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Étapes du chemin de transformation
                </h3>

                <div className="relative pl-8 space-y-8 border-l border-muted">
                  {selectedJourney.stages.map((stage, sIdx) => (
                    <div key={stage.id} className="relative animate-in fade-in duration-300" style={{ animationDelay: `${sIdx * 100}ms` }}>
                      {/* Timeline dot */}
                      <span className="absolute -left-[41px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-[10px] font-bold text-white shadow-md">
                        {stage.position}
                      </span>

                      <div className="space-y-3">
                        <h4 className="font-bold text-text text-sm tracking-tight">{stage.name}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {stage.services.map((service) => (
                            <div key={service.id} className="rounded-xl border border-muted bg-glass p-4 space-y-2 flex flex-col justify-between hover:border-primary/20 transition-all duration-200">
                              <div>
                                <div className="flex items-center justify-between text-[10px] text-muted">
                                  <span className="font-mono bg-muted/30 px-1.5 py-0.5 rounded">{service.code}</span>
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {service.organization.name}
                                  </span>
                                </div>
                                <h5 className="font-bold text-text text-xs mt-1.5 leading-snug">{service.name}</h5>
                                <p className="text-[11px] text-muted/90 line-clamp-2 mt-1 leading-normal">
                                  {service.description}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-muted/50 flex justify-end">
                                <a
                                  href={`/services?id=${service.id}`}
                                  className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                                >
                                  Fiche service
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Sélectionnez un parcours pour afficher sa timeline.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
