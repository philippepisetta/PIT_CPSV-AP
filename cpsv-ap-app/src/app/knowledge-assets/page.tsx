// src/app/knowledge-assets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  X, 
  Link as LinkIcon, 
  FileText, 
  Share2, 
  Calendar, 
  ExternalLink,
  Filter,
  Info
} from "lucide-react";

interface PublicService {
  id: number;
  name: string;
  code: string;
}

interface Ecosystem {
  id: number;
  name: string;
}

interface EventResource {
  id: number;
  title: string;
}

interface KnowledgeAsset {
  id: number;
  title: string;
  type: string;
  description: string;
  file?: string;
  url?: string;
  publicServices: PublicService[];
  ecosystems: Ecosystem[];
  eventResources: EventResource[];
}

export default function KnowledgeAssetsPage() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<KnowledgeAsset | null>(null);
  
  // Meta cache
  const [services, setServices] = useState<PublicService[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [events, setEvents] = useState<EventResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Guide");
  const [newDescription, setNewDescription] = useState("");
  const [newFile, setNewFile] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [selectedEcosystemIds, setSelectedEcosystemIds] = useState<number[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      const [aRes, mRes] = await Promise.all([
        fetch("/api/knowledge-assets"),
        fetch("/api/meta")
      ]);

      if (!aRes.ok || !mRes.ok) throw new Error("Erreur de récupération des données.");
      
      const aData = await aRes.json();
      const mData = await mRes.json();

      setAssets(aData);
      setServices(mData.services || []);
      setEcosystems(mData.ecosystems || []);
      setEvents(mData.eventResources || []);

      if (aData.length > 0 && !selectedAsset) {
        setSelectedAsset(aData[0]);
      } else if (selectedAsset) {
        const updated = aData.find((a: KnowledgeAsset) => a.id === selectedAsset.id);
        if (updated) setSelectedAsset(updated);
      }

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) {
      alert("Le titre est obligatoire.");
      return;
    }

    try {
      const response = await fetch("/api/knowledge-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          description: newDescription,
          file: newFile || null,
          url: newUrl || null,
          serviceIds: selectedServiceIds,
          ecosystemIds: selectedEcosystemIds,
          eventResourceIds: selectedEventIds
        })
      });

      if (!response.ok) throw new Error("Erreur lors de la création de l'actif de connaissance.");
      
      // Reset form
      setNewTitle("");
      setNewType("Guide");
      setNewDescription("");
      setNewFile("");
      setNewUrl("");
      setSelectedServiceIds([]);
      setSelectedEcosystemIds([]);
      setSelectedEventIds([]);
      setShowAddModal(false);
      
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Filter assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const assetTypes = [
    "Guide", 
    "Référentiel", 
    "Benchmark", 
    "Étude", 
    "Méthodologie", 
    "Toolkit", 
    "Livre blanc"
  ];

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des actifs de connaissance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
            Actifs de Connaissance (Knowledge Assets)
          </h1>
          <p className="text-muted text-sm">
            Gérez les guides méthodologiques, études sectorielles et livrables d'écosystèmes produits pour le territoire.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-primary/95 transition-all text-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nouvel Actif
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary to-teal-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Actifs répertoriés</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">{assets.length}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Services documentés</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">
                {Array.from(new Set(assets.flatMap(a => a.publicServices.map(s => s.id)))).length}
              </p>
            </div>
            <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Liaisons écosystèmes</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">
                {Array.from(new Set(assets.flatMap(a => a.ecosystems.map(e => e.id)))).length}
              </p>
            </div>
            <div className="rounded-lg p-2.5 bg-blue-500/10 text-blue-500">
              <Share2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar Search / Filter */}
      <section className="flex flex-col sm:flex-row gap-4 bg-surface border border-muted p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted" />
          <input 
            type="text"
            placeholder="Rechercher un livrable (titre, description)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-glass border border-muted rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary text-text placeholder-muted"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full bg-glass border border-muted rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-text"
          >
            <option value="">Tous les types</option>
            {assetTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List Pane (5/12 col) */}
        <section className="lg:col-span-5 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[60vh] overflow-y-auto" aria-label="Liste des actifs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2">Actifs disponibles</h2>
          <div className="space-y-1.5">
            {filteredAssets.map((a) => {
              const isSelected = selectedAsset?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAsset(a)}
                  className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <BookOpen className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-glass border border-muted/50 rounded text-primary uppercase tracking-wide">
                        {a.type}
                      </span>
                      {a.url && (
                        <span className="text-[10px] text-muted flex items-center gap-0.5">
                          <LinkIcon className="h-3 w-3" /> En ligne
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-xs text-muted italic">
                Aucun livrable ne correspond à la recherche.
              </div>
            )}
          </div>
        </section>

        {/* Right Detail Pane (7/12 col) */}
        <section className="lg:col-span-7" aria-label="Détail de l'actif">
          {selectedAsset ? (
            <div className="space-y-6 bg-surface border border-muted rounded-2xl p-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {selectedAsset.type}
                </span>
                <h2 className="text-xl font-black text-text tracking-tight mt-2">{selectedAsset.title}</h2>
                
                {selectedAsset.url && (
                  <a 
                    href={selectedAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline mt-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Consulter la ressource
                  </a>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Présentation / Résumé</h3>
                <p className="text-sm text-text leading-relaxed bg-glass p-4 rounded-xl border border-muted/50">
                  {selectedAsset.description || "Aucune description de l'actif de connaissance."}
                </p>
              </div>

              {/* Connected relations */}
              <div className="space-y-5 border-t border-muted/50 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Liaisons du Territorial Knowledge Graph</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Public Services */}
                  <div className="space-y-2 rounded-xl bg-glass border border-muted/30 p-3">
                    <p className="font-bold text-muted flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-primary" /> Services liés</p>
                    <div className="space-y-1 mt-1.5">
                      {selectedAsset.publicServices.map(s => (
                        <div key={s.id} className="p-1 rounded bg-surface border border-muted/30 font-semibold truncate" title={s.name}>
                          {s.name}
                        </div>
                      ))}
                      {selectedAsset.publicServices.length === 0 && <p className="italic text-muted/60">Aucun service public</p>}
                    </div>
                  </div>

                  {/* Ecosystems */}
                  <div className="space-y-2 rounded-xl bg-glass border border-muted/30 p-3">
                    <p className="font-bold text-muted flex items-center gap-1.5"><Share2 className="h-3.5 w-3.5 text-amber-500" /> Écosystèmes</p>
                    <div className="space-y-1 mt-1.5">
                      {selectedAsset.ecosystems.map(eco => (
                        <div key={eco.id} className="p-1 rounded bg-surface border border-muted/30 font-semibold truncate" title={eco.name}>
                          {eco.name}
                        </div>
                      ))}
                      {selectedAsset.ecosystems.length === 0 && <p className="italic text-muted/60">Aucun écosystème</p>}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="space-y-2 rounded-xl bg-glass border border-muted/30 p-3">
                    <p className="font-bold text-muted flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-emerald-500" /> Événements</p>
                    <div className="space-y-1 mt-1.5">
                      {selectedAsset.eventResources.map(evt => (
                        <div key={evt.id} className="p-1 rounded bg-surface border border-muted/30 font-semibold truncate" title={evt.title}>
                          {evt.title}
                        </div>
                      ))}
                      {selectedAsset.eventResources.length === 0 && <p className="italic text-muted/60">Aucun événement lié</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Veuillez sélectionner ou ajouter un actif de connaissance.
            </div>
          )}
        </section>
      </div>

      {/* Modal Add Knowledge Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text">Ajouter un Actif de Connaissance</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Titre de la ressource *</label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Méthodologie IA sectorielle" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Type d'actif</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    {assetTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Description / Résumé</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez l'apport ou le contenu de ce document..." className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Fichier local (nom)</label>
                  <input value={newFile} onChange={e => setNewFile(e.target.value)} type="text" placeholder="ex: guide_ia_manufacture.pdf" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">URL externe</label>
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} type="url" placeholder="https://example.com/guide.pdf" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              {/* Relations links */}
              <div className="space-y-3 pt-2 border-t border-muted">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Liaisons Sémantiques</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Select Services */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted">Services CPSV</label>
                    <div className="border border-muted rounded-lg p-2 max-h-24 overflow-y-auto space-y-1 bg-glass">
                      {services.map(s => (
                        <label key={s.id} className="flex items-center space-x-1.5 text-[11px]">
                          <input 
                            type="checkbox"
                            checked={selectedServiceIds.includes(s.id)}
                            onChange={e => {
                              if (e.target.checked) setSelectedServiceIds([...selectedServiceIds, s.id]);
                              else setSelectedServiceIds(selectedServiceIds.filter(id => id !== s.id));
                            }}
                          />
                          <span className="truncate">{s.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Select Ecosystems */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted">Écosystèmes</label>
                    <div className="border border-muted rounded-lg p-2 max-h-24 overflow-y-auto space-y-1 bg-glass">
                      {ecosystems.map(eco => (
                        <label key={eco.id} className="flex items-center space-x-1.5 text-[11px]">
                          <input 
                            type="checkbox"
                            checked={selectedEcosystemIds.includes(eco.id)}
                            onChange={e => {
                              if (e.target.checked) setSelectedEcosystemIds([...selectedEcosystemIds, eco.id]);
                              else setSelectedEcosystemIds(selectedEcosystemIds.filter(id => id !== eco.id));
                            }}
                          />
                          <span className="truncate">{eco.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Select Events */}
                  <div className="space-y-1">
                    <label className="font-semibold text-muted">Événements</label>
                    <div className="border border-muted rounded-lg p-2 max-h-24 overflow-y-auto space-y-1 bg-glass">
                      {events.map(evt => (
                        <label key={evt.id} className="flex items-center space-x-1.5 text-[11px]">
                          <input 
                            type="checkbox"
                            checked={selectedEventIds.includes(evt.id)}
                            onChange={e => {
                              if (e.target.checked) setSelectedEventIds([...selectedEventIds, evt.id]);
                              else setSelectedEventIds(selectedEventIds.filter(id => id !== evt.id));
                            }}
                          />
                          <span className="truncate">{evt.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-muted pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/95 transition-all">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
