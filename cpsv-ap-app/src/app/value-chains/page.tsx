// src/app/value-chains/page.tsx

"use client";

import { useEffect, useState } from "react";
import { 
  Network, 
  Layers, 
  Building2, 
  FileText,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Share2,
  Compass
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";

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
  const [valueChains, setValueChains] = useState<StrategicValueChain[]>([]);
  const [selectedChain, setSelectedChain] = useState<StrategicValueChain | null>(null);
  const [stages, setStages] = useState<ValueChainStage[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [vcRes, stRes, bRes] = await Promise.all([
          fetch("/api/value-chains"),
          fetch("/api/stages"),
          fetch("/api/beneficiaries")
        ]);

        if (!vcRes.ok || !stRes.ok || !bRes.ok) {
          throw new Error("Impossible de charger les chaînes de valeur.");
        }

        const vcData = await vcRes.json();
        const stData = await stRes.json();
        const bData = await bRes.json();
        
        const sResFull = await fetch("/api/meta");
        const metaFull = await sResFull.json();

        setValueChains(vcData);
        setStages(stData);
        setServices(metaFull.services || []);
        setBeneficiaries(bData);

        if (vcData.length > 0) {
          setSelectedChain(vcData[0]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
    <div className="rounded-2xl bg-glass border border-muted/20 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
        <Network className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        Filières Stratégiques ({filteredValueChains.length})
      </h3>
      <div className="space-y-1.5">
        {filteredValueChains.map((vc) => {
          const isSelected = selectedChain?.id === vc.id;
          return (
            <button
              key={vc.id}
              onClick={() => setSelectedChain(vc)}
              className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected 
                  ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" 
                  : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <Network className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
              <div className="truncate flex-1">
                <p className="font-bold text-sm truncate">{vc.name}</p>
                <p className="text-xs text-muted/80 truncate mt-0.5">{vc.description || "Pas de description"}</p>
              </div>
            </button>
          );
        })}
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
              // Trouver les services et bénéficiaires liés à ce maillon précis dans la filière
              const catStages = stages.filter(st => st.category === cat.name);
              const stageIds = catStages.map(st => st.id);

              const catServices = filiereServices.filter(s => s.stages.some(st => stageIds.includes(st.id)));
              const catBenefs = filiereBenefs.filter(b => b.stages.some(st => stageIds.includes(st.id)));

              return (
                <div key={idx} className="bg-glass/20 border border-muted/10 rounded-xl p-4 space-y-3 shadow-sm hover:shadow transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h5 className="text-xs font-black text-text">{cat.name}</h5>
                      <p className="text-[10px] text-muted">{cat.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full self-start sm:self-center">
                      Étape {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-muted/5 text-xs">
                    {/* Services */}
                    <div className="space-y-1.5">
                      <span className="font-semibold text-muted text-[10px] flex items-center gap-1">
                        <FileText className="h-3 w-3 text-primary" />
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
                      <span className="font-semibold text-muted text-[10px] flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-amber-500" />
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

    // 2. Relations Tab : Public services and listed active PMEs
    const relationsTab = (
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Services de support de la filière</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filiereServices.map(s => (
              <RelationshipCard
                key={s.id}
                title={s.name}
                relationType={`Code : ${s.code}`}
                Icon={FileText}
                onClick={() => window.location.href = `/services?id=${s.id}`}
              />
            ))}
            {filiereServices.length === 0 && <p className="text-xs text-muted italic p-2">Aucun service public spécifiquement affecté à cette filière S3.</p>}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Membres et acteurs économiques territoriaux</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filiereBenefs.map(b => (
              <RelationshipCard
                key={b.id}
                title={b.name}
                relationType={`Taille : ${b.size}`}
                Icon={Building2}
                onClick={() => window.location.href = `/beneficiaries?id=${b.id}`}
              />
            ))}
            {filiereBenefs.length === 0 && <p className="text-xs text-muted italic p-2">Aucun bénéficiaire déclaré dans cette filière.</p>}
          </div>
        </div>
      </div>
    );

    // 3. Metadata Tab
    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">{vc.uri || `https://pit.wallonie.be/id/value-chain/${vc.id}`}</span></p>
        <p className="text-text">Classe : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:StrategicValueChain</span></p>
        <p className="text-text">Filière S3 ID : <span className="font-bold">{vc.id}</span></p>
      </div>
    );

    return (
      <EntityDetailPanel
        title={vc.name}
        subtitle="Spécialisation Intelligente (S3) Wallonie"
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">Filière S3 Régionale</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Filières & Chaînes de Valeur S3"
        description="Visualisez la structure des filières industrielles stratégiques wallonnes et l'ancrage territorial des PME et des accompagnements publics à chaque phase de valeur."
        Icon={Network}
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une filière stratégique S3 par nom ou description..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />
    </div>
  );
}
