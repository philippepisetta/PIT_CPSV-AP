// src/app/ecosystems/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Share2, 
  Globe, 
  Building2, 
  FileText, 
  Compass, 
  Layers, 
  Sparkles,
  AlertCircle
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  type: string;
  description?: string;
}

interface PublicService {
  id: number;
  name: string;
  code: string;
}

interface Journey {
  id: number;
  name: string;
  provider: string;
}

interface StrategicValueChain {
  id: number;
  name: string;
}

interface BusinessChallenge {
  id: number;
  name: string;
}

interface Ecosystem {
  id: number;
  name: string;
  description: string;
  mission?: string;
  territory?: string;
  actors: Organization[];
  services: PublicService[];
  journeys: Journey[];
  filieresS3: StrategicValueChain[];
  challenges: BusinessChallenge[];
}

export default function EcosystemsPage() {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [selectedEcosystem, setSelectedEcosystem] = useState<Ecosystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEcosystems() {
      try {
        setLoading(true);
        const response = await fetch("/api/ecosystems");
        if (!response.ok) throw new Error("Impossible de charger le catalogue des écosystèmes.");
        const data = await response.json();
        setEcosystems(data);
        if (data.length > 0) {
          setSelectedEcosystem(data[0]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadEcosystems();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des hubs régionaux et pôles...</p>
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
          Catalogue des Écosystèmes Wallons
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          Visualisez les réseaux régionaux, les pôles de compétitivité, les hubs numériques et l'ensemble de leurs acteurs (universités, centres de recherche, outils de financement).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Liste des écosystèmes (4/12 col) */}
        <section className="lg:col-span-4 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[70vh] overflow-y-auto" aria-label="Liste des écosystèmes">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-primary" />
            Écosystèmes Territoriaux
          </h2>
          <div className="space-y-1">
            {ecosystems.map((e) => {
              const isSelected = selectedEcosystem?.id === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedEcosystem(e)}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <Globe className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{e.name}</p>
                    <p className="text-xs text-muted/80 truncate">{e.territory || "Wallonie"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Détail de l'écosystème (8/12 col) */}
        <section className="lg:col-span-8 space-y-8" aria-label="Détail de l'écosystème sélectionné">
          {selectedEcosystem ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Infos générales */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-amber-500 opacity-[0.02] blur-3xl" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    Hub : {selectedEcosystem.territory || "Wallonie"}
                  </span>
                  <h2 className="text-2xl font-black text-text tracking-tight mt-2">{selectedEcosystem.name}</h2>
                  <p className="text-xs text-muted leading-relaxed mt-2">
                    {selectedEcosystem.description}
                  </p>
                  {selectedEcosystem.mission && (
                    <div className="bg-glass rounded-xl p-3 border border-muted/50 text-xs mt-3 flex gap-2">
                      <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                      <p className="italic text-text/95">"Mission : {selectedEcosystem.mission}"</p>
                    </div>
                  )}
                </div>

                {/* Métadonnées */}
                <div className="pt-4 border-t border-muted grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-bold text-muted flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Défis d'affaires adressés :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEcosystem.challenges.map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-muted flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-amber-500" />
                      Filières S3 couvertes :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEcosystem.filieresS3.map(f => (
                        <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 colonnes : Acteurs & Offre (Services/Parcours) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Acteurs impliqués */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm border-b border-muted pb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Acteurs de l'Écosystème
                  </h3>
                  <div className="space-y-3">
                    {selectedEcosystem.actors.map((actor) => (
                      <div key={actor.id} className="rounded-xl border border-muted bg-glass p-3 flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-primary shrink-0" />
                        <div className="truncate flex-1">
                          <p className="font-bold text-xs text-text truncate">{actor.name}</p>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted/95 bg-muted/20 px-1 py-0.5 rounded mt-1 inline-block">
                            {actor.type || "Acteur régional"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offre (Services & Parcours) */}
                <div className="rounded-2xl bg-surface border border-muted p-6 space-y-4">
                  <h3 className="font-bold text-text text-sm border-b border-muted pb-3 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-amber-500" />
                    Offre de Services & Parcours
                  </h3>

                  <div className="space-y-4">
                    {/* Services */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                        <FileText className="h-3 w-3 text-primary" />
                        Accompagnements CPSV
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {selectedEcosystem.services.map(s => (
                          <div key={s.id} className="px-2.5 py-1.5 bg-glass border border-muted/50 text-xs font-semibold text-text rounded flex items-center justify-between">
                            <span className="truncate">{s.name}</span>
                            <span className="text-[9px] font-mono bg-muted/40 text-muted px-1 py-0.5 rounded uppercase font-bold shrink-0 ml-1">
                              {s.code}
                            </span>
                          </div>
                        ))}
                        {selectedEcosystem.services.length === 0 && <span className="text-muted text-xs italic">Aucun service direct</span>}
                      </div>
                    </div>

                    {/* Parcours */}
                    <div className="space-y-2 pt-3 border-t border-muted/30">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                        <Compass className="h-3 w-3 text-amber-500" />
                        Parcours associés
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {selectedEcosystem.journeys.map(j => (
                          <div key={j.id} className="px-2.5 py-1.5 bg-glass border border-muted/50 text-xs font-semibold text-text rounded">
                            <p className="font-bold truncate">{j.name}</p>
                            <span className="text-[9px] text-muted block mt-0.5">Fourni par : {j.provider}</span>
                          </div>
                        ))}
                        {selectedEcosystem.journeys.length === 0 && <span className="text-muted text-xs italic">Aucun parcours associé</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Sélectionnez un écosystème territorial.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
