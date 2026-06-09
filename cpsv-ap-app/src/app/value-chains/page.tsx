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
  ArrowRight
} from "lucide-react";

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

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [vcRes, stRes, sRes, bRes] = await Promise.all([
          fetch("/api/value-chains"),
          fetch("/api/stages"),
          fetch("/api/services"), // GET général
          fetch("/api/beneficiaries")
        ]);

        if (!vcRes.ok || !stRes.ok || !sRes.ok || !bRes.ok) {
          throw new Error("Impossible de charger les chaînes de valeur.");
        }

        const vcData = await vcRes.json();
        const stData = await stRes.json();
        const bData = await bRes.json();
        
        // Charger tous les détails des services et bénéficiaires pour pouvoir faire le filtrage local !
        // C'est beaucoup plus robuste que de multiplier les API pour le prototype de lab
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
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des chaînes de valeur...</p>
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

  // Les 6 grandes catégories demandées par l'utilisateur
  const categories = [
    { name: "Innovation", desc: "Recherche fondamentales, R&D, conception avancée" },
    { name: "Industrialisation", desc: "Prototypage, validation, essais et certifications" },
    { name: "Production", desc: "Fabrication industrielle, assemblage et intégration" },
    { name: "Go-To-Market", desc: "Commercialisation, distribution locale et exportations" },
    { name: "Exploitation", desc: "Support client, maintenance technique et services après-vente" },
    { name: "Circularité", desc: "Réemploi de composants, réparation locale et recyclage" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
          Cartographie des Chaînes de Valeur S3
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          Visualisez la structure des filières industrielles stratégiques wallonnes et l'ancrage territorial des PME et des accompagnements publics à chaque phase de valeur.
        </p>
      </header>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filières (3/12 col) */}
        <section className="lg:col-span-3 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[70vh] overflow-y-auto" aria-label="Liste des filières">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
            <Network className="h-4 w-4 text-primary" />
            Filières Stratégiques
          </h2>
          <div className="space-y-1">
            {valueChains.map((vc) => {
              const isSelected = selectedChain?.id === vc.id;
              return (
                <button
                  key={vc.id}
                  onClick={() => setSelectedChain(vc)}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <Layers className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{vc.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Chaîne de Valeur (9/12 col) */}
        <section className="lg:col-span-9 space-y-8" aria-label="Visualisation de la chaîne de valeur">
          {selectedChain ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Infos filière */}
              <div className="rounded-2xl bg-surface border border-muted p-6 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-amber-500 opacity-[0.02] blur-3xl" />
                <span className="text-[10px] font-mono bg-muted/40 text-muted px-2 py-0.5 rounded">
                  {selectedChain.uri || "https://pit.wallonie.be/id/value-chain/"}
                </span>
                <h2 className="text-2xl font-black text-text tracking-tight">{selectedChain.name}</h2>
                <p className="text-xs text-muted leading-relaxed">
                  {selectedChain.description || "Filière économique structurée au sein de la Plateforme d’Intelligence Territoriale."}
                </p>
              </div>

              {/* Les 6 Colonnes Stratégiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, cIdx) => {
                  // Filtrer les maillons transverses de cette catégorie
                  const catStages = stages.filter(st => st.category === cat.name);

                  return (
                    <div 
                      key={cat.name} 
                      className="rounded-2xl bg-surface border border-muted p-5 flex flex-col space-y-4 hover:border-primary/10 transition-all duration-300 relative group"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-wider text-primary">{cat.name}</span>
                        <p className="text-[10px] text-muted leading-normal">{cat.desc}</p>
                      </div>

                      {/* Maillons et acteurs */}
                      <div className="space-y-4 flex-1 overflow-y-auto">
                        {catStages.map(stage => {
                          // Filtrer les services publics associés à ce maillon pour cette filière
                          const stageServices = services.filter(s => 
                            s.stages.some(st => st.id === stage.id) &&
                            s.filieresS3.some(f => f.id === selectedChain.id)
                          );

                          // Filtrer les entreprises associées à ce maillon pour cette filière
                          const stageBeneficiaries = beneficiaries.filter(b => 
                            b.stages.some(st => st.id === stage.id) &&
                            b.filieresS3.some(f => f.id === selectedChain.id)
                          );

                          return (
                            <div key={stage.id} className="rounded-xl bg-glass border border-muted/50 p-3.5 space-y-2">
                              <h4 className="font-bold text-text text-xs tracking-tight">{stage.name}</h4>
                              
                              {/* Services */}
                              {stageServices.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted/80 flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-primary" />
                                    Accompagnements
                                  </p>
                                  <div className="flex flex-col gap-1">
                                    {stageServices.map(s => (
                                      <span key={s.id} className="px-2 py-1 bg-surface border border-muted text-[10px] font-semibold text-text rounded flex items-center justify-between">
                                        <span className="truncate">{s.name}</span>
                                        <span className="text-[8px] text-muted uppercase font-bold shrink-0 ml-1">
                                          {s.organization?.name}
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Bénéficiaires */}
                              {stageBeneficiaries.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted/80 flex items-center gap-1 pt-1.5 border-t border-muted/30">
                                    <Building2 className="h-3 w-3 text-amber-500" />
                                    Entreprises
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {stageBeneficiaries.map(b => (
                                      <span key={b.id} className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/10 text-[9px] font-bold rounded">
                                        {b.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {stageServices.length === 0 && stageBeneficiaries.length === 0 && (
                                <p className="text-[10px] text-muted/60 italic pt-1 border-t border-muted/10">Aucun acteur ou service actif</p>
                              )}
                            </div>
                          );
                        })}
                        {catStages.length === 0 && (
                          <div className="text-center py-6 text-[10px] text-muted italic">Aucun maillon défini</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Sélectionnez une filière stratégique pour afficher la chaîne de valeur.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
