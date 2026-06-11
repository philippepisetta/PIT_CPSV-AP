// src/app/recommender/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Sparkles, 
  Building2, 
  FileText, 
  Compass, 
  Share2, 
  Layers, 
  TrendingUp,
  Activity,
  Users
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITStatCard from "@/design-system/PITStatCard";
import SplitLayout from "@/components/ui/SplitLayout";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import { cn } from "@/lib/utils";
import { useBeneficiariesQuery, useRecommenderQuery } from "@/hooks/usePITQueries";
import PITVirtualList from "@/design-system/PITVirtualList";

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
  const { data: beneficiariesData, isLoading: loadingList, error: listError } = useBeneficiariesQuery();
  const beneficiaries = (beneficiariesData || []) as Beneficiary[];

  const [selectedBId, setSelectedBId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync selectedBId once the list loads
  useEffect(() => {
    if (beneficiaries.length > 0 && !selectedBId) {
      setSelectedBId(String(beneficiaries[0].id));
    }
  }, [beneficiaries, selectedBId]);

  const { data: recDataResult, isLoading: loadingRec, error: recError } = useRecommenderQuery(selectedBId || undefined);

  const error = (listError?.message || recError?.message) || null;

  const recData = useMemo(() => {
    if (!recDataResult) {
      return {
        beneficiary: null,
        matchedNeeds: [],
        recommendedServices: [],
        recommendedJourneys: [],
        recommendedEcosystems: [],
        recommendedActors: []
      };
    }
    return recDataResult;
  }, [recDataResult]);

  // Filtrage des bénéficiaires sur la gauche
  const filteredBeneficiaries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return beneficiaries;
    return beneficiaries.filter(b => 
      b.name.toLowerCase().includes(q) ||
      (b.bce && b.bce.toLowerCase().includes(q)) ||
      (b.location && b.location.toLowerCase().includes(q)) ||
      (b.province && b.province.toLowerCase().includes(q))
    );
  }, [beneficiaries, searchQuery]);

  if (loadingList) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary animate-pulse"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du cockpit de recommandations...</p>
      </div>
    );
  }

  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] flex flex-col">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1 pb-2 border-b border-muted/10">
        Bénéficiaires ({filteredBeneficiaries.length})
      </h3>
      <div className="flex-1 min-h-0">
        {filteredBeneficiaries.length > 0 ? (
          <PITVirtualList
            items={filteredBeneficiaries}
            itemHeight={110}
            maxHeight="60vh"
            renderItem={(benef) => (
              <div className="py-1 pr-1" style={{ height: "110px" }}>
                <PITEntityCard
                  title={benef.name}
                  description={`${benef.location} (${benef.province})`}
                  icon={Building2}
                  type="beneficiary"
                  isSelected={String(benef.id) === selectedBId}
                  onClick={() => setSelectedBId(String(benef.id))}
                />
              </div>
            )}
          />
        ) : (
          <p className="text-center text-xs text-muted italic py-6">Aucun bénéficiaire trouvé.</p>
        )}
      </div>
    </div>
  );

  const renderDetailPanel = () => {
    const b = recData.beneficiary as Beneficiary | null;
    if (!b) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un bénéficiaire dans la liste de gauche pour générer ses préconisations.
        </div>
      );
    }

    if (loadingRec) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-700 animate-pulse"></div>
          <p className="text-xs font-semibold text-muted animate-pulse">Calcul des préconisations 360° en cours...</p>
        </div>
      );
    }

    // 1. Overview tab
    const overviewTab = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PITStatCard
            label="Taille"
            value={b.size}
            icon={Building2}
            themeColor="teal"
            description="Segment d'entreprise"
          />
          <PITStatCard
            label="Effectif"
            value={`${b.employees || 0} ETP`}
            icon={Users}
            themeColor="indigo"
            description="Emplois déclarés"
          />
          <PITStatCard
            label="C.A. estimé"
            value={b.revenue ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(b.revenue) : 'N/A'}
            icon={TrendingUp}
            themeColor="emerald"
            description="Revenu annuel"
          />
        </div>

        {/* Business challenges and Filières S3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-teal-650" />
              Défis d'affaires déclarés
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {b.challenges && b.challenges.map(ch => (
                <span key={ch.id} className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 font-semibold border border-teal-100 dark:border-teal-900 text-[10px]">
                  {ch.name}
                </span>
              ))}
              {(!b.challenges || b.challenges.length === 0) && (
                <span className="text-xs text-muted/65 italic">Aucun défi spécifique</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-purple-500" />
              Filières S3 stratégiques
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {b.filieresS3 && b.filieresS3.map(f => (
                <span key={f.id} className="px-2 py-0.5 rounded bg-purple-50/10 text-purple-650 font-semibold border border-purple-500/10 text-[10px]">
                  {f.name}
                </span>
              ))}
              {(!b.filieresS3 || b.filieresS3.length === 0) && (
                <span className="text-xs text-muted/65 italic">Aucune filière alignée</span>
              )}
            </div>
          </div>
        </div>

        {/* Maturity axes */}
        <div className="space-y-4 pt-4 border-t border-muted/10">
          <h3 className="font-bold text-text text-xs flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-650" />
            Scores de Maturité Diagnostiqués
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Numérique / Digital", val: b.maturityDigital, color: "from-blue-500 to-indigo-500" },
              { label: "Intelligence Artificielle (IA)", val: b.maturityIa, color: "from-purple-500 to-pink-500" },
              { label: "Cybersécurité", val: b.maturityCyber, color: "from-red-500 to-rose-500" },
              { label: "Exportation", val: b.maturityExport, color: "from-amber-500 to-orange-500" },
              { label: "Durabilité / Climat", val: b.maturityDurability, color: "from-emerald-500 to-teal-500" },
            ].map((m, idx) => (
              <div key={idx} className="rounded-xl border border-muted bg-glass/20 p-3 space-y-1.5">
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
    );

    // 2. Relations Tab (Computed Recommendations)
    const relationSections = [
      {
        title: "Accompagnements (Services) Prioritaires",
        items: (recData.recommendedServices || []).map(s => ({
          id: s.id,
          title: s.name,
          relationType: s.organization?.name || "Opérateur",
          Icon: FileText,
          badge: s.code,
          description: s.matchedReason,
          onClick: () => window.location.href = `/services?id=${s.id}`
        }))
      },
      {
        title: "Clusters & Écosystèmes Recommandés",
        items: (recData.recommendedEcosystems || []).map(eco => ({
          id: eco.id,
          title: eco.name,
          relationType: "Écosystème S3",
          Icon: Share2,
          description: eco.description,
          onClick: () => window.location.href = `/ecosystems?id=${eco.id}`
        }))
      },
      {
        title: "Opérateurs Locaux à Contacter",
        items: (recData.recommendedActors || []).map(actor => ({
          id: actor.id,
          title: actor.name,
          relationType: actor.type || "Opérateur Public",
          Icon: Building2
        }))
      }
    ];

    const relationsTab = (
      <div className="space-y-6">
        <PITRelationsPanel sections={relationSections} />

        {/* Recommended Journeys (special timeline rendering) */}
        {recData.recommendedJourneys && recData.recommendedJourneys.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-muted/10">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-amber-500" />
              Parcours Recommandés & Étapes Types
            </h4>
            <div className="space-y-4">
              {recData.recommendedJourneys.map(j => {
                const timelineItems: TimelineItem[] = j.stages.map(stage => ({
                  id: stage.id,
                  title: stage.name,
                  subtitle: `Étape ${stage.position}`,
                  color: "amber",
                  description: (
                    <div className="space-y-1.5 mt-1">
                      <span className="text-[9px] uppercase font-bold text-muted">Services associés :</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stage.services.map((ser: any) => (
                          <span 
                            key={ser.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/services?id=${ser.id}`;
                            }}
                            className="px-1.5 py-0.5 bg-background border border-muted/20 hover:border-primary hover:text-primary transition-colors rounded text-[9px] font-semibold text-text cursor-pointer"
                          >
                            {ser.name}
                          </span>
                        ))}
                        {stage.services.length === 0 && <span className="text-[9px] italic text-muted">Aucun service direct</span>}
                      </div>
                    </div>
                  )
                }));

                return (
                  <div key={j.id} className="p-4 rounded-xl border border-muted/20 bg-glass/25 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                          Parcours : {j.provider}
                        </span>
                        <h5 className="font-bold text-xs text-text mt-1.5">{j.name}</h5>
                        {j.objective && <p className="text-[10px] text-muted italic mt-0.5">{j.objective}</p>}
                      </div>
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                        {j.matchedReason}
                      </span>
                    </div>
                    <div className="pl-2 border-l border-muted/10 pt-2">
                      <Timeline items={timelineItems} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">ID Interne : <span className="font-mono text-teal-650 dark:text-teal-400">{b.id}</span></p>
        <p className="text-text">N° BCE : <span className="font-mono">{b.bce || "Non renseigné"}</span></p>
        <p className="text-text">Territoire : <span className="font-semibold">{b.location} ({b.province})</span></p>
        <p className="text-text">Classe RDF : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20 text-[11px]">d4wmo:Beneficiary</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={b.name}
        subtitle={b.primaryNaceSector ? `NACE : ${b.primaryNaceSector.code} — ${b.primaryNaceSector.name}` : `Localisation : ${b.location}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Préconisations 360°</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <PITLayout
      category="INTELLIGENCE ARTIFICIELLE"
      title="Recommandations 360°"
      description="Moteur de recommandation d'accompagnements et de parcours sémantiques fondé sur le profil de maturité, les défis d'affaires et la filière S3 du bénéficiaire."
      pageIcon={Sparkles}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Recommandations" }
      ]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un bénéficiaire (PME) par son nom, sa localisation ou sa province..."
      />

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl text-sm font-semibold mb-6">
          ⚠️ {error}
        </div>
      )}

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </PITLayout>
  );
}
