// src/app/datasets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Database, 
  Plus, 
  Search, 
  X, 
  Building2, 
  Calendar, 
  Award, 
  Tag, 
  Hash, 
  Info,
  Filter
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  type: string;
}

interface Dataset {
  id: number;
  title: string;
  description: string;
  themes: string[] | any;
  keywords: string[] | any;
  qualityScore: number;
  updateFrequency: string;
  ownerOrganizationId: number;
  ownerOrganization: Organization;
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState("");

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newThemesText, setNewThemesText] = useState("");
  const [newKeywordsText, setNewKeywordsText] = useState("");
  const [newQualityScore, setNewQualityScore] = useState(5.0);
  const [newUpdateFrequency, setNewUpdateFrequency] = useState("Mensuel");
  const [newOwnerOrgId, setNewOwnerOrgId] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [dRes, mRes] = await Promise.all([
        fetch("/api/datasets"),
        fetch("/api/meta")
      ]);

      if (!dRes.ok || !mRes.ok) throw new Error("Erreur de récupération des données.");
      
      const dData = await dRes.json();
      const mData = await mRes.json();

      setDatasets(dData);
      setOrganizations(mData.organizations || []);

      if (dData.length > 0 && !selectedDataset) {
        setSelectedDataset(dData[0]);
      } else if (selectedDataset) {
        const updated = dData.find((d: Dataset) => d.id === selectedDataset.id);
        if (updated) setSelectedDataset(updated);
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

  async function handleAddDataset(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newOwnerOrgId) {
      alert("Le titre et l'organisation propriétaire sont requis.");
      return;
    }

    const themesArray = newThemesText.split(",").map(t => t.trim()).filter(Boolean);
    const keywordsArray = newKeywordsText.split(",").map(k => k.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          themes: themesArray,
          keywords: keywordsArray,
          qualityScore: parseFloat(String(newQualityScore)),
          updateFrequency: newUpdateFrequency,
          ownerOrganizationId: parseInt(newOwnerOrgId)
        })
      });

      if (!response.ok) throw new Error("Erreur lors de la création du dataset.");
      
      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewThemesText("");
      setNewKeywordsText("");
      setNewQualityScore(5.0);
      setNewUpdateFrequency("Mensuel");
      setNewOwnerOrgId("");
      setShowAddModal(false);
      
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Parse themes & keywords safely (Prisma Json field)
  const getArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return typeof field === "string" ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  };

  // Filter datasets
  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const themes = getArrayField(d.themes);
    const matchesTheme = !selectedThemeFilter || themes.some(t => t.toLowerCase() === selectedThemeFilter.toLowerCase());
    
    return matchesSearch && matchesTheme;
  });

  // Extract all unique themes for filter dropdown
  const allThemes = Array.from(new Set(
    datasets.flatMap(d => getArrayField(d.themes))
  ));

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du catalogue des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
            Catalogues de Données (DCAT-AP)
          </h1>
          <p className="text-muted text-sm">
            Référentiel des jeux de données territoriaux et d'écosystèmes conformes aux standards d'interopérabilité européens.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-primary/95 transition-all text-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nouveau Dataset
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary to-teal-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Jeux de données catalogués</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">{datasets.length}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Qualité moyenne</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">
                {datasets.length > 0 
                  ? (datasets.reduce((acc, d) => acc + d.qualityScore, 0) / datasets.length).toFixed(1) 
                  : "0.0"} / 5
              </p>
            </div>
            <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-500">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-5 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.03] blur-xl" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Fréquences d'actualisation</span>
              <p className="text-2xl font-extrabold text-text tracking-tight mt-1">Dynamique</p>
            </div>
            <div className="rounded-lg p-2.5 bg-blue-500/10 text-blue-500">
              <Calendar className="h-5 w-5" />
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
            placeholder="Rechercher un dataset (nom, description)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-glass border border-muted rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary text-text placeholder-muted"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          <select 
            value={selectedThemeFilter}
            onChange={e => setSelectedThemeFilter(e.target.value)}
            className="w-full bg-glass border border-muted rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary text-text"
          >
            <option value="">Tous les thèmes</option>
            {allThemes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List Pane (5/12 col) */}
        <section className="lg:col-span-5 rounded-2xl bg-surface border border-muted p-4 space-y-4 max-h-[60vh] overflow-y-auto" aria-label="Liste des datasets">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2">Datasets du territoire</h2>
          <div className="space-y-1.5">
            {filteredDatasets.map((d) => {
              const isSelected = selectedDataset?.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDataset(d)}
                  className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-l-4 border-primary text-text shadow-sm" 
                      : "hover:bg-glass text-muted hover:text-text"
                  }`}
                >
                  <Database className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
                  <div className="truncate flex-1">
                    <p className="font-bold text-sm truncate">{d.title}</p>
                    <p className="text-xs text-muted/80 truncate mt-0.5">{d.ownerOrganization?.name || "Organisation inconnue"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-glass border border-muted/50 rounded text-text">
                        Qualité : {d.qualityScore.toFixed(1)}/5
                      </span>
                      <span className="text-[10px] font-semibold text-muted">
                        • {d.updateFrequency}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredDatasets.length === 0 && (
              <div className="text-center py-8 text-xs text-muted italic">
                Aucun dataset ne correspond à la recherche.
              </div>
            )}
          </div>
        </section>

        {/* Right Detail Pane (7/12 col) */}
        <section className="lg:col-span-7" aria-label="Détail du dataset">
          {selectedDataset ? (
            <div className="space-y-6 bg-surface border border-muted rounded-2xl p-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Dataset DCAT-AP
                </span>
                <h2 className="text-xl font-black text-text tracking-tight mt-2">{selectedDataset.title}</h2>
                
                <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
                  <Building2 className="h-3.5 w-3.5" />
                  Propriétaire : <span className="font-semibold text-text">{selectedDataset.ownerOrganization?.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Description</h3>
                <p className="text-sm text-text leading-relaxed bg-glass p-4 rounded-xl border border-muted/50">
                  {selectedDataset.description || "Aucune description fournie."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metadata Column */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-b border-muted pb-1.5">Métadonnées DCAT</h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Actualisation</span>
                      <span className="font-bold text-text">{selectedDataset.updateFrequency}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-muted flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Thèmes sémantiques</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getArrayField(selectedDataset.themes).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10 text-[10px]">
                            {t}
                          </span>
                        ))}
                        {getArrayField(selectedDataset.themes).length === 0 && <span className="italic text-muted/60">Aucun thème</span>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Mots-clés</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getArrayField(selectedDataset.keywords).map(k => (
                          <span key={k} className="px-2 py-0.5 rounded bg-surface border border-muted text-muted font-semibold text-[10px]">
                            {k}
                          </span>
                        ))}
                        {getArrayField(selectedDataset.keywords).length === 0 && <span className="italic text-muted/60">Aucun mot-clé</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Score & Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-b border-muted pb-1.5">Score de Qualité</h3>
                  
                  <div className="rounded-xl bg-glass border border-muted/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text">Indice de complétude</span>
                      <span className="text-xs font-black text-primary">{selectedDataset.qualityScore.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full" 
                        style={{ width: `${(selectedDataset.qualityScore / 5.0) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed flex items-start gap-1.5 mt-2">
                      <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                      Ce score évalue la conformité du schéma de données, la présence d'URIs persistants, la complétude des métadonnées obligatoires de DCAT-AP et la validité sémantique des taxonomies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted border-dashed rounded-2xl bg-glass p-6 text-muted italic">
              Veuillez sélectionner ou ajouter un dataset.
            </div>
          )}
        </section>
      </div>

      {/* Modal Add Dataset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted pb-4">
              <h3 className="text-lg font-bold text-text">Ajouter un Dataset DCAT-AP</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDataset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Titre du jeu de données *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Profils de maturité numérique wallonne" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Description</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez le contenu et l'utilité du dataset..." className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text h-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Organisation propriétaire *</label>
                  <select required value={newOwnerOrgId} onChange={e => setNewOwnerOrgId(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="">Sélectionnez...</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Fréquence d'actualisation</label>
                  <select value={newUpdateFrequency} onChange={e => setNewUpdateFrequency(e.target.value)} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text">
                    <option value="Journalier">Journalier</option>
                    <option value="Hebdomadaire">Hebdomadaire</option>
                    <option value="Mensuel">Mensuel</option>
                    <option value="Trimestriel">Trimestriel</option>
                    <option value="Annuel">Annuel</option>
                    <option value="Statique">Statique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Thèmes (séparés par des virgules)</label>
                  <input value={newThemesText} onChange={e => setNewThemesText(e.target.value)} type="text" placeholder="IA, Numérique, S3" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">Mots-clés (séparés par des virgules)</label>
                  <input value={newKeywordsText} onChange={e => setNewKeywordsText(e.target.value)} type="text" placeholder="PME, Maturité, Données" className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Score de Qualité Initial (0.0 à 5.0)</label>
                <input value={newQualityScore} onChange={e => setNewQualityScore(parseFloat(e.target.value) || 5.0)} type="number" min={0} max={5} step={0.1} className="w-full bg-glass border border-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-text" />
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
