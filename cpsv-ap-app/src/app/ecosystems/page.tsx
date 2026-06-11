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

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { useEcosystemsQuery } from "@/hooks/usePITQueries";
import PITVirtualList from "@/design-system/PITVirtualList";

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
  const { data: ecosystemsData, isLoading: loading, error: queryError } = useEcosystemsQuery();
  const ecosystems = ecosystemsData || [];
  const [selectedEcosystem, setSelectedEcosystem] = useState<Ecosystem | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const { isEntityTypeVisible } = usePerspective();

  useEffect(() => {
    if (ecosystems.length > 0 && !selectedEcosystem) {
      setSelectedEcosystem(ecosystems[0]);
    }
  }, [ecosystems, selectedEcosystem]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des écosystèmes régionaux...</p>
      </div>
    );
  }

  // Filtrer les écosystèmes
  const filteredEcosystems = (ecosystems as Ecosystem[]).filter(e => {
    if (!isEntityTypeVisible("ecosystem")) return false;

    const query = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(query) || 
           e.description.toLowerCase().includes(query) || 
           (e.territory && e.territory.toLowerCase().includes(query));
  });

  // --- PANNEAU GAUCHE : LISTE DES ECOSYSTEMES ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] flex flex-col">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1 pb-2 border-b border-muted/10">
        Écosystèmes Territoriaux ({filteredEcosystems.length})
      </h3>
      <div className="flex-1 min-h-0">
        {filteredEcosystems.length > 0 ? (
          <PITVirtualList
            items={filteredEcosystems}
            itemHeight={110}
            maxHeight="60vh"
            renderItem={(e) => (
              <div className="py-1 pr-1" style={{ height: "110px" }}>
                <PITEntityCard
                  title={e.name}
                  description={e.description}
                  icon={Globe}
                  type="ecosystem"
                  subtitle={e.territory || "Wallonie"}
                  isSelected={selectedEcosystem?.id === e.id}
                  onClick={() => setSelectedEcosystem(e)}
                />
              </div>
            )}
          />
        ) : (
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
            <AlertCircle className="h-4.5 w-4.5 text-teal-650 dark:text-teal-400 shrink-0 mt-0.5" />
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
              <Sparkles className="h-3.5 w-3.5 text-teal-650" />
              Défis d'affaires adressés
            </span>
            <div className="flex flex-wrap gap-1.5">
              {e.challenges.map(c => (
                <span key={c.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-505 font-semibold border border-blue-500/10 text-[10px]">
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
                <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-550 font-semibold border border-amber-500/10 text-[10px]">
                  {f.name}
                </span>
              ))}
              {e.filieresS3.length === 0 && <span className="text-muted/65 italic">Aucune filière S3</span>}
            </div>
          </div>
        </div>
      </div>
    );

    // 2. Relations Tab using PITRelationsPanel
    const sections = [
      {
        title: "Membres & Acteurs du réseau",
        items: e.actors.map(actor => ({
          id: actor.id,
          title: actor.name,
          relationType: actor.type,
          Icon: Building2
        }))
      },
      {
        title: "Accompagnements (Services) associés",
        items: e.services.map(s => ({
          id: s.id,
          title: s.name,
          relationType: `Code : ${s.code}`,
          Icon: FileText,
          onClick: () => window.location.href = `/services?id=${s.id}`
        }))
      },
      {
        title: "Parcours d'innovation",
        items: e.journeys.map(j => ({
          id: j.id,
          title: j.name,
          relationType: `Fourni par ${j.provider}`,
          Icon: Compass,
          onClick: () => window.location.href = `/journeys?id=${j.id}`
        }))
      }
    ];

    const relationsTab = <PITRelationsPanel sections={sections} />;

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/ecosystem/{e.id}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:Ecosystem</span></p>
        <p className="text-text">Territoire cible : <span className="font-bold">{e.territory || "Wallonie"}</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={e.name}
        subtitle={`Couverture : ${e.territory || "Wallonie"}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Écosystème territorial</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Écosystèmes Territoriaux"
      description="Visualisez les réseaux régionaux, les pôles de compétitivité, les hubs numériques et l'ensemble de leurs acteurs (universités, centres de recherche, outils de financement)."
      pageIcon={Share2}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Écosystèmes" }
      ]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un écosystème par nom, mission ou territoire..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </PITLayout>
  );
}
