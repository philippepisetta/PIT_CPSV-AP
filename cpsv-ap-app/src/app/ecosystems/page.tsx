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
  AlertCircle,
  HelpCircle,
  Network
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";

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
  const [searchQuery, setSearchQuery] = useState("");

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
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des écosystèmes régionaux...</p>
      </div>
    );
  }

  // Filtrer les écosystèmes
  const filteredEcosystems = ecosystems.filter(e => {
    const query = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(query) || 
           e.description.toLowerCase().includes(query) || 
           (e.territory && e.territory.toLowerCase().includes(query));
  });

  // --- PANNEAU GAUCHE : LISTE DES ECOSYSTEMES ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
        <Share2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        Écosystèmes Territoriaux ({filteredEcosystems.length})
      </h3>
      <div className="space-y-1.5">
        {filteredEcosystems.map((e) => {
          const isSelected = selectedEcosystem?.id === e.id;
          return (
            <button
              key={e.id}
              onClick={() => setSelectedEcosystem(e)}
              className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected 
                  ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" 
                  : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <Globe className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
              <div className="truncate flex-1">
                <p className="font-bold text-sm truncate">{e.name}</p>
                <p className="text-xs text-muted/80 truncate mt-0.5">{e.territory || "Wallonie"}</p>
              </div>
            </button>
          );
        })}
        {filteredEcosystems.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun écosystème ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedEcosystem) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un écosystème territorial pour afficher son profil.
        </div>
      );
    }

    const e = selectedEcosystem;

    // 1. Overview Tab : Description, mission, challenges and filieres covered
    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 text-xs text-text/95 leading-relaxed">
          {e.description}
        </div>

        {e.mission && (
          <div className="bg-glass/10 border border-muted/5 rounded-xl p-4 text-xs flex gap-2">
            <AlertCircle className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-muted text-[10px] uppercase block mb-0.5">Mission de l'écosystème</span>
              <p className="italic text-text/95">"{e.mission}"</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Challenges */}
          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Défis d'affaires adressés
            </span>
            <div className="flex flex-wrap gap-1.5">
              {e.challenges.map(c => (
                <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10 text-[10px]">
                  {c.name}
                </span>
              ))}
              {e.challenges.length === 0 && <span className="text-muted/65 italic">Aucun défi associé</span>}
            </div>
          </div>

          {/* Filières */}
          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-amber-500" />
              Filières S3 couvertes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {e.filieresS3.map(f => (
                <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10 text-[10px]">
                  {f.name}
                </span>
              ))}
              {e.filieresS3.length === 0 && <span className="text-muted/65 italic">Aucune filière S3</span>}
            </div>
          </div>
        </div>
      </div>
    );

    // 2. Relations Tab : Actors, public services, and journeys
    const relationsTab = (
      <div className="space-y-6">
        {/* Actors */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Membres & Acteurs du réseau</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {e.actors.map(actor => (
              <RelationshipCard
                key={actor.id}
                title={actor.name}
                relationType={actor.type}
                Icon={Building2}
              />
            ))}
            {e.actors.length === 0 && <p className="text-xs text-muted italic p-2">Aucun membre enregistré.</p>}
          </div>
        </div>

        {/* Services & Journeys */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Accompagnements (Services)</h4>
            <div className="space-y-2">
              {e.services.map(s => (
                <RelationshipCard
                  key={s.id}
                  title={s.name}
                  relationType={`Code : ${s.code}`}
                  Icon={FileText}
                  onClick={() => window.location.href = `/services?id=${s.id}`}
                />
              ))}
              {e.services.length === 0 && <p className="text-xs text-muted italic p-1">Aucun service direct.</p>}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Parcours d'innovation</h4>
            <div className="space-y-2">
              {e.journeys.map(j => (
                <RelationshipCard
                  key={j.id}
                  title={j.name}
                  relationType={`Fourni par ${j.provider}`}
                  Icon={Compass}
                  onClick={() => window.location.href = `/journeys?id=${j.id}`}
                />
              ))}
              {e.journeys.length === 0 && <p className="text-xs text-muted italic p-1">Aucun parcours lié.</p>}
            </div>
          </div>
        </div>
      </div>
    );

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/ecosystem/{e.id}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:Ecosystem</span></p>
        <p className="text-text">Territoire cible : <span className="font-bold">{e.territory || "Wallonie"}</span></p>
      </div>
    );

    return (
      <EntityDetailPanel
        title={e.name}
        subtitle={`Couverture : ${e.territory || "Wallonie"}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">Écosystème territorial</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Écosystèmes Territoriaux"
        description="Visualisez les réseaux régionaux, les pôles de compétitivité, les hubs numériques et l'ensemble de leurs acteurs (universités, centres de recherche, outils de financement)."
        Icon={Share2}
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un écosystème par nom, mission ou territoire..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </div>
  );
}
