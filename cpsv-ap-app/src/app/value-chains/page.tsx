// src/app/value-chains/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Network, 
  Building2, 
  FileText 
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import SplitLayout from "@/components/ui/SplitLayout";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { useMetaQuery, useBeneficiariesQuery } from "@/hooks/usePITQueries";

interface ValueChainStage {
  id: number;
  name: string;
  category: string;
  description?: string;
}

interface StrategicValueChain {
  id: number;
  name: string;
  uri?: string;
  description?: string;
}

interface PublicService {
  id: number;
  name: string;
  code: string;
  organization: { name: string };
  stages: { id: number }[];
  filieresS3: { id: number }[];
}

interface Beneficiary {
  id: number;
  name: string;
  location: string;
  size: string;
  stages: { id: number }[];
  filieresS3: { id: number }[];
}

export default function ValueChainsPage() {
  const { data: metaData, isLoading: metaLoading, error: metaError } = useMetaQuery();
  const { data: beneficiariesData, isLoading: beneficiariesLoading, error: beneficiariesError } = useBeneficiariesQuery();
  
  const loading = metaLoading || beneficiariesLoading;
  const [selectedChain, setSelectedChain] = useState<StrategicValueChain | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const { isEntityTypeVisible } = usePerspective();

  const valueChains = (metaData?.strategicValueChains || []) as StrategicValueChain[];
  const stages = (metaData?.stages || []) as ValueChainStage[];
  const services = (metaData?.services || []) as PublicService[];
  const beneficiaries = (beneficiariesData || []) as Beneficiary[];

  useEffect(() => {
    if (valueChains.length > 0 && !selectedChain) {
      setSelectedChain(valueChains[0]);
    }
  }, [valueChains, selectedChain]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des chaînes de valeur S3...</p>
      </div>
    );
  }

  // Filtrer les chaînes de valeur
  const filteredValueChains = valueChains.filter(vc => {
    if (!isEntityTypeVisible("valuechain")) return false;

    const query = searchQuery.toLowerCase();
    return vc.name.toLowerCase().includes(query) || 
           (vc.description && vc.description.toLowerCase().includes(query));
  });

  const categories = [
    { name: "Innovation", desc: "Recherche fondamentale, R&D, conception avancée" },
    { name: "Industrialisation", desc: "Prototypage, validation, essais et certifications" },
    { name: "Production", desc: "Fabrication industrielle, assemblage et intégration" },
    { name: "Go-To-Market", desc: "Commercialisation, distribution locale et exportations" },
    { name: "Exploitation", desc: "Support client, maintenance technique et services après-vente" },
    { name: "Circularité", desc: "Réemploi de composants, réparation locale et recyclage" }
  ];

  // --- PANNEAU GAUCHE : LISTE DES FILIERES ---
  const leftPane = (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
      <div className="text-xs font-bold text-muted uppercase tracking-wider px-1">
        Filières Stratégiques ({filteredValueChains.length})
      </div>
      <div className="space-y-2.5">
        {filteredValueChains.map((vc) => (
          <PITEntityCard
            key={vc.id}
            title={vc.name}
            description={vc.description}
            icon={Network}
            type="filiere"
            isSelected={selectedChain?.id === vc.id}
            onClick={() => setSelectedChain(vc)}
          />
        ))}
        {filteredValueChains.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucune filière ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedChain) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez une filière stratégique pour afficher son ancrage.
        </div>
      );
    }

    const vc = selectedChain;

    // Filtrer les services et PME liés globalement à cette filière S3
    const filiereServices = services.filter(s => s.filieresS3.some(f => f.id === vc.id));
    const filiereBenefs = beneficiaries.filter(b => b.filieresS3.some(f => f.id === vc.id));

    // 1. Overview Tab : Maillons transversaux de la chaîne de valeur
    const overviewTab = (
      <div className="space-y-6">
        {vc.description && (
          <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 text-xs text-text/95 leading-relaxed">
            {vc.description}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-muted/10 pb-1.5">
            Cartographie des 6 Maillons de la Filière
          </h4>
          
          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const catStages = stages.filter(st => st.category === cat.name);
              const stageIds = catStages.map(st => st.id);

              const catServices = filiereServices.filter(s => s.stages.some(st => stageIds.includes(st.id)));
              const catBenefs = filiereBenefs.filter(b => b.stages.some(st => stageIds.includes(st.id)));

              return (
                <div key={idx} className="bg-glass/20 border border-muted/10 rounded-xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h5 className="text-xs font-black text-text">{cat.name}</h5>
                      <p className="text-[10px] text-muted">{cat.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2.5 py-0.5 bg-teal-500/10 text-teal-650 dark:text-teal-400 rounded-full self-start sm:self-center">
                      Étape {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-muted/10 text-xs">
                    {/* Services */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-muted text-[9px] uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-teal-605" />
                        Accompagnements ({catServices.length}) :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {catServices.map(s => (
                          <span key={s.id} className="px-2 py-0.5 bg-glass border border-muted/30 text-[9px] font-bold text-text rounded" title={s.name}>
                            {s.code}
                          </span>
                        ))}
                        {catServices.length === 0 && <span className="text-muted/65 italic text-[10px]">Aucun service direct</span>}
                      </div>
                    </div>

                    {/* Bénéficiaires */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-muted text-[9px] uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-amber-500" />
                        Entreprises actives ({catBenefs.length}) :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {catBenefs.map(b => (
                          <span key={b.id} className="px-2 py-0.5 bg-glass border border-muted/30 text-[9px] font-bold text-text rounded">
                            {b.name}
                          </span>
                        ))}
                        {catBenefs.length === 0 && <span className="text-muted/65 italic text-[10px]">Aucune entreprise</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // 2. Relations Tab using PITRelationsPanel
    const sections = [
      {
        title: "Services de support de la filière",
        items: filiereServices.map(s => ({
          id: s.id,
          title: s.name,
          relationType: `Code : ${s.code}`,
          Icon: FileText,
          onClick: () => window.location.href = `/services?id=${s.id}`
        }))
      },
      {
        title: "Membres et acteurs économiques territoriaux",
        items: filiereBenefs.map(b => ({
          id: b.id,
          title: b.name,
          relationType: `Taille : ${b.size}`,
          Icon: Building2,
          onClick: () => window.location.href = `/beneficiaries?id=${b.id}`
        }))
      }
    ];

    const relationsTab = <PITRelationsPanel sections={sections} />;

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">{vc.uri || `https://pit.wallonie.be/id/value-chain/${vc.id}`}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:StrategicValueChain</span></p>
        <p className="text-text">Filière S3 ID : <span className="font-bold">{vc.id}</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={vc.name}
        subtitle="Spécialisation Intelligente (S3) Wallonie"
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Filière S3 Régionale</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Filières & Chaînes de Valeur S3"
      description="Visualisez la structure des filières industrielles stratégiques wallonnes et l'ancrage territorial des PME et des accompagnements publics à chaque phase de valeur."
      pageIcon={Network}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Filières S3" }
      ]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une filière stratégique S3 par nom ou description..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </PITLayout>
  );
}
