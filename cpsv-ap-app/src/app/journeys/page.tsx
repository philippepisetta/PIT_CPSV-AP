// src/app/journeys/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Compass, 
  Map, 
  Building2, 
  ExternalLink, 
  HelpCircle, 
  Network, 
  FileText 
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { useJourneysQuery } from "@/hooks/usePITQueries";
import PITVirtualList from "@/design-system/PITVirtualList";

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
  const { data: journeysData, isLoading: loading, error: queryError } = useJourneysQuery();
  const journeys = journeysData || [];
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const { isEntityTypeVisible } = usePerspective();

  useEffect(() => {
    if (journeys.length > 0 && !selectedJourney) {
      setSelectedJourney(journeys[0]);
    }
  }, [journeys, selectedJourney]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des parcours de transformation...</p>
      </div>
    );
  }

  // Filtrer les parcours
  const filteredJourneys = (journeys as Journey[]).filter(j => {
    // Verifier la perspective
    if (!isEntityTypeVisible("journey")) return false;

    const term = searchQuery.toLowerCase();
    return j.name.toLowerCase().includes(term) || 
           j.provider.toLowerCase().includes(term) || 
           j.objective.toLowerCase().includes(term);
  });

  // --- PANNEAU GAUCHE : LISTE DES PARCOURS ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] flex flex-col">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1 pb-2 border-b border-muted/10">
        Parcours de référence ({filteredJourneys.length})
      </h3>
      <div className="flex-1 min-h-0">
        {filteredJourneys.length > 0 ? (
          <PITVirtualList
            items={filteredJourneys}
            itemHeight={110}
            maxHeight="60vh"
            renderItem={(j) => (
              <div className="py-1 pr-1" style={{ height: "110px" }}>
                <PITEntityCard
                  title={j.name}
                  description={j.objective}
                  icon={Compass}
                  type="parcours"
                  subtitle={`Fournisseur : ${j.provider}`}
                  isSelected={selectedJourney?.id === j.id}
                  onClick={() => setSelectedJourney(j)}
                />
              </div>
            )}
          />
        ) : (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun parcours ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedJourney) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un parcours pour afficher sa structure.
        </div>
      );
    }

    const j = selectedJourney;

    // 1. Overview Tab : Objective, Description, and vertical Timeline of Stages
    const timelineItems: TimelineItem[] = j.stages.map((stage) => {
      const servicesContent = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {stage.services.map((service) => (
            <div 
              key={service.id} 
              className="rounded-xl border border-muted/20 bg-glass/25 p-3.5 space-y-2 flex flex-col justify-between hover:border-teal-500/20 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-[9px] text-muted">
                  <span className="font-mono bg-muted/10 px-1.5 py-0.2 rounded font-bold uppercase">{service.code}</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {service.organization.name}
                  </span>
                </div>
                <h5 className="font-bold text-text text-[11px] mt-1.5 leading-snug">{service.name}</h5>
                <p className="text-[10px] text-muted/80 line-clamp-2 mt-1 leading-normal">
                  {service.description}
                </p>
              </div>
              
              <div className="pt-2 border-t border-muted/10 flex justify-end">
                <a
                  href={`/services?id=${service.id}`}
                  className="text-[9px] font-bold text-teal-650 dark:text-teal-400 flex items-center gap-1 hover:underline"
                >
                  Fiche service
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      );

      return {
        id: stage.id,
        title: stage.name,
        subtitle: `Étape ${stage.position}`,
        description: servicesContent,
        Icon: Compass,
        color: "teal",
      };
    });

    const overviewTab = (
      <div className="space-y-6">
        {j.objective && (
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Objectif métier</h4>
            <p className="text-xs text-text italic">"{j.objective}"</p>
          </div>
        )}

        {j.description && (
          <div className="bg-glass/10 border border-muted/5 rounded-xl p-4 text-xs text-muted/95 leading-relaxed">
            {j.description}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5">
            Chemin de transformation
          </h4>
          <Timeline
            items={timelineItems}
            emptyMessage="Aucune étape n'est configurée pour ce parcours."
          />
        </div>
      </div>
    );

    // 2. Relations Tab using PITRelationsPanel
    const sections = [
      {
        title: "Défis d'affaires adressés",
        items: (j.challenges || []).map(c => ({
          id: c.id,
          title: c.name,
          relationType: "Défi",
          Icon: HelpCircle
        }))
      },
      {
        title: "Filières S3 couvertes",
        items: (j.filieresS3 || []).map(f => ({
          id: f.id,
          title: f.name,
          relationType: "Filière S3",
          Icon: Network
        }))
      },
      {
        title: "Services de support inclus",
        items: j.stages.flatMap(st => st.services).map(s => ({
          id: s.id,
          title: s.name,
          relationType: `Code : ${s.code}`,
          Icon: FileText,
          onClick: () => window.location.href = `/services?id=${s.id}`
        }))
      }
    ];

    const relationsTab = <PITRelationsPanel sections={sections} />;

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/journey/{j.id}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:JourneyTemplate</span></p>
        <p className="text-text">Propulsé par : <span className="font-bold">{j.provider}</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={j.name}
        subtitle={`Fournisseur de parcours : ${j.provider}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Parcours type CPSV</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <PITLayout
      category="BACKOFFICE TERRITORIAL"
      title="Parcours de Transformation"
      description="Découvrez les chemins d'accompagnement thématiques inter-acteurs configurés pour guider les PME régionales de la sensibilisation jusqu'à l'industrialisation."
      pageIcon={Compass}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Parcours" }
      ]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un parcours par nom, fournisseur ou objectif..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </PITLayout>
  );
}
