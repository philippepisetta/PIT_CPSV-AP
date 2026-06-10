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
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  HelpCircle,
  Users,
  Search,
  BookOpen,
  Activity,
  Award
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import StatCard from "@/components/ui/StatCard";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import { cn } from "@/lib/utils";

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
  const [searchQuery, setSearchQuery] = useState("");
  
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du cockpit de recommandations...</p>
      </div>
    );
  }

  const leftPane = (
    <div className="space-y-3">
      <div className="text-xs font-bold text-muted uppercase tracking-wider px-1">
        Bénéficiaires ({filteredBeneficiaries.length})
      </div>
      <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
        {filteredBeneficiaries.map((benef) => {
          const isSelected = String(benef.id) === selectedBId;
          return (
            <div
              key={benef.id}
              onClick={() => setSelectedBId(String(benef.id))}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted/20 bg-glass/40 hover:bg-glass hover:border-muted"
              )}
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-xs text-text leading-snug truncate max-w-[170px]">{benef.name}</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded shrink-0">
                  {benef.size}
                </span>
              </div>
              <p className="text-[10px] text-muted mt-1 leading-normal truncate">{benef.location} ({benef.province})</p>
              <div className="mt-2.5 pt-2 border-t border-muted/10 flex justify-between items-center text-[9px] text-muted">
                <span>Maturité Digitale:</span>
                <span className="font-bold text-text">{benef.maturityDigital}/5</span>
              </div>
            </div>
          );
        })}
        {filteredBeneficiaries.length === 0 && (
          <p className="text-center text-xs text-muted italic py-6">Aucun bénéficiaire trouvé.</p>
        )}
      </div>
    </div>
  );

  const renderDetailPanel = () => {
    const b = recData.beneficiary;
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xs font-semibold text-muted animate-pulse">Calcul des préconisations 360° en cours...</p>
        </div>
      );
    }

    // 1. Overview tab
    const overviewTab = (
      <div className="space-y-6">
        {/* KPI / Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Taille"
            value={b.size}
            Icon={Building2}
            color="teal"
            description="Segment d'entreprise"
          />
          <StatCard
            label="Effectif"
            value={`${b.employees || 0} ETP`}
            Icon={Users}
            color="blue"
            description="Emplois déclarés"
          />
          <StatCard
            label="C.A. estimé"
            value={b.revenue ? new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(b.revenue) : 'N/A'}
            Icon={TrendingUp}
            color="emerald"
            description="Revenu annuel"
          />
        </div>

        {/* Business challenges and Filières S3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Défis d'affaires déclarés
            </span>
            <div className="flex flex-wrap gap-1.5">
              {b.challenges && b.challenges.map(ch => (
                <span key={ch.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10 text-[10px]">
                  {ch.name}
                </span>
              ))}
              {(!b.challenges || b.challenges.length === 0) && (
                <span className="text-xs text-muted/65 italic">Aucun défi spécifique</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-muted flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-amber-500" />
              Filières S3 stratégiques
            </span>
            <div className="flex flex-wrap gap-1.5">
              {b.filieresS3 && b.filieresS3.map(f => (
                <span key={f.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/10 text-[10px]">
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
            <Activity className="h-4 w-4 text-primary" />
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
    const relationsTab = (
      <div className="space-y-6">
        {/* Recommended Services */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Accompagnements (Services) Prioritaires
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recData.recommendedServices.map(s => (
              <RelationshipCard
                key={s.id}
                title={s.name}
                relationType={s.organization?.name || "Opérateur Territorial"}
                Icon={FileText}
                badge={s.code}
                description={s.matchedReason}
                onClick={() => window.location.href = `/services?id=${s.id}`}
              />
            ))}
            {recData.recommendedServices.length === 0 && (
              <p className="text-xs text-muted italic p-2 border border-muted/10 border-dashed rounded-lg">Aucun service recommandé.</p>
            )}
          </div>
        </div>

        {/* Recommended Journeys */}
        <div className="space-y-3 pt-4 border-t border-muted/10">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-amber-500" />
            Parcours Recommandés & Étapes Types
          </h4>
          <div className="space-y-4">
            {recData.recommendedJourneys.map(j => {
              // Convert stages to TimelineItems
              const timelineItems: TimelineItem[] = j.stages.map(stage => ({
                id: stage.id,
                title: stage.name,
                subtitle: `Étape ${stage.position}`,
                color: "amber",
                description: (
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-muted">Services associés :</span>
                    <div className="flex flex-wrap gap-1">
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
                <div key={j.id} className="p-4 rounded-xl border border-muted/20 bg-glass/20 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
                        Parcours : {j.provider}
                      </span>
                      <h5 className="font-bold text-xs text-text mt-1">{j.name}</h5>
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
            {recData.recommendedJourneys.length === 0 && (
              <p className="text-xs text-muted italic p-2 border border-muted/10 border-dashed rounded-lg">Aucun parcours recommandé.</p>
            )}
          </div>
        </div>

        {/* Recommended Ecosystems & Organizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-muted/10">
          {/* Ecosystems */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-purple-500" />
              Clusters & Écosystèmes Recommandés
            </h4>
            <div className="space-y-2">
              {recData.recommendedEcosystems.map(eco => (
                <RelationshipCard
                  key={eco.id}
                  title={eco.name}
                  relationType="Écosystème S3"
                  Icon={Share2}
                  description={eco.description}
                  onClick={() => window.location.href = `/ecosystems?id=${eco.id}`}
                />
              ))}
              {recData.recommendedEcosystems.length === 0 && (
                <p className="text-xs text-muted italic p-2 border border-muted/10 border-dashed rounded-lg">Aucun écosystème recommandé.</p>
              )}
            </div>
          </div>

          {/* Local Actors */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-500" />
              Opérateurs Locaux à Contacter
            </h4>
            <div className="space-y-2">
              {recData.recommendedActors.map(actor => (
                <RelationshipCard
                  key={actor.id}
                  title={actor.name}
                  relationType={actor.type || "Opérateur Public"}
                  Icon={Building2}
                />
              ))}
              {recData.recommendedActors.length === 0 && (
                <p className="text-xs text-muted italic p-2 border border-muted/10 border-dashed rounded-lg">Aucun opérateur recommandé.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">ID Interne : <span className="font-mono text-teal-600 dark:text-teal-400">{b.id}</span></p>
        <p className="text-text">N° BCE : <span className="font-mono">{b.bce || "Non renseigné"}</span></p>
        <p className="text-text">Territoire : <span className="font-semibold">{b.location} ({b.province})</span></p>
        <p className="text-text">Classe RDF : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20 text-[11px]">d4wmo:Beneficiary</span></p>
      </div>
    );

    return (
      <EntityDetailPanel
        title={b.name}
        subtitle={b.primaryNaceSector ? `NACE : ${b.primaryNaceSector.code} — ${b.primaryNaceSector.name}` : `Localisation : ${b.location}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">Préconisations 360°</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommandations 360°"
        description="Moteur de recommandation d'accompagnements et de parcours sémantiques fondé sur le profil de maturité, les défis d'affaires et la filière S3 du bénéficiaire."
        Icon={Sparkles}
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un bénéficiaire (PME) par son nom, sa localisation ou sa province..."
      />

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </div>
  );
}
