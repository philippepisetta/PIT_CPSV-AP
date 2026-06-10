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
  Filter,
  Layers,
  FileCode
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import ReferenceSelector from "@/components/ui/ReferenceSelector";

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

  const getArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return typeof field === "string" ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  };

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const themes = getArrayField(d.themes);
    const matchesTheme = !selectedThemeFilter || themes.some(t => t.toLowerCase() === selectedThemeFilter.toLowerCase());
    
    return matchesSearch && matchesTheme;
  });

  const allThemes = Array.from(new Set(
    datasets.flatMap(d => getArrayField(d.themes))
  ));

  // --- PANNEAU GAUCHE : LISTE DES DATASETS ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
        <Database className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        Jeux de Données ({filteredDatasets.length})
      </h3>
      <div className="space-y-1.5">
        {filteredDatasets.map((d) => {
          const isSelected = selectedDataset?.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDataset(d)}
              className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected 
                  ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" 
                  : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <Database className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
              <div className="truncate flex-1">
                <p className="font-bold text-sm truncate">{d.title}</p>
                <p className="text-xs text-muted/80 truncate mt-0.5">{d.ownerOrganization?.name || "Organisation inconnue"}</p>
              </div>
            </button>
          );
        })}
        {filteredDatasets.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun dataset ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedDataset) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un dataset dans la liste.
        </div>
      );
    }

    const d = selectedDataset;

    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 text-xs text-text/95 leading-relaxed">
          {d.description || "Aucune description fournie."}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-glass/20 border border-muted/10 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Fréquence d'actualisation</span>
            <span className="font-bold text-text flex items-center gap-1.5 mt-1">
              <Calendar className="h-4 w-4 text-primary" />
              {d.updateFrequency}
            </span>
          </div>

          <div className="space-y-2 bg-glass/20 border border-muted/10 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Indice de conformité</span>
            <div className="flex items-center justify-between font-bold text-text mt-1">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                Qualité DCAT-AP
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-black">{d.qualityScore.toFixed(1)} / 5.0</span>
            </div>
            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(d.qualityScore / 5) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Thèmes */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold uppercase text-muted flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-primary" />
              Thèmes sémantiques
            </span>
            <div className="flex flex-wrap gap-1.5">
              {getArrayField(d.themes).map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/10 text-[9px]">
                  {t}
                </span>
              ))}
              {getArrayField(d.themes).length === 0 && <span className="text-muted/65 italic">Aucun thème</span>}
            </div>
          </div>

          {/* Mots-clés */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold uppercase text-muted flex items-center gap-1">
              <Hash className="h-3.5 w-3.5 text-amber-500" />
              Mots-clés
            </span>
            <div className="flex flex-wrap gap-1.5">
              {getArrayField(d.keywords).map(k => (
                <span key={k} className="px-2 py-0.5 rounded bg-surface border border-muted/20 text-muted font-semibold text-[9px]">
                  {k}
                </span>
              ))}
              {getArrayField(d.keywords).length === 0 && <span className="text-muted/65 italic">Aucun mot-clé</span>}
            </div>
          </div>
        </div>
      </div>
    );

    const relationsTab = (
      <div className="space-y-4">
        <RelationshipCard
          title={d.ownerOrganization?.name || "Organisation inconnue"}
          relationType="Organisme éditeur / propriétaire"
          Icon={Building2}
        />
      </div>
    );

    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/dataset/{d.id}</span></p>
        <p className="text-text">Classe sémantique : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">dcat:Dataset</span></p>
        <p className="text-text">Conformité au profil : <span className="font-bold">DCAT-AP v2.1.1 (Europe)</span></p>
      </div>
    );

    return (
      <EntityDetailPanel
        title={d.title}
        subtitle={`Édité par ${d.ownerOrganization?.name}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">Dataset DCAT-AP</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalogues de Données (DCAT-AP)"
        description="Référentiel des jeux de données territoriaux et d'écosystèmes conformes aux standards d'interopérabilité européens."
        Icon={Database}
        actions={
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            Nouveau Dataset
          </button>
        }
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un dataset par titre ou description..."
        filterValue={selectedThemeFilter}
        onFilterChange={setSelectedThemeFilter}
        filterLabel="Tous les thèmes"
        filterOptions={allThemes.map(t => ({ value: t, label: t }))}
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT DATASET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text">Déclarer un Dataset DCAT-AP</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDataset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Titre du jeu de données *</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Profils de maturité numérique wallonne" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Description</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez le contenu et l'utilité du dataset..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text h-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReferenceSelector
                  label="Organisation propriétaire *"
                  value={newOwnerOrgId}
                  onChange={setNewOwnerOrgId}
                  options={organizations}
                  required
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Fréquence d'actualisation</label>
                  <select value={newUpdateFrequency} onChange={e => setNewUpdateFrequency(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Thèmes (séparés par des virgules)</label>
                  <input value={newThemesText} onChange={e => setNewThemesText(e.target.value)} type="text" placeholder="IA, Numérique, S3" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Mots-clés (séparés par des virgules)</label>
                  <input value={newKeywordsText} onChange={e => setNewKeywordsText(e.target.value)} type="text" placeholder="PME, Maturité, Données" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Score de Qualité Initial (0.0 à 5.0)</label>
                <input value={newQualityScore} onChange={e => setNewQualityScore(parseFloat(e.target.value) || 5.0)} type="number" min={0} max={5} step={0.1} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
              </div>

              <div className="border-t border-muted/20 pt-4 flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-muted hover:bg-glass rounded-xl font-semibold text-muted hover:text-text transition-all cursor-pointer bg-transparent">
                  Annuler
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-md hover:bg-teal-750 transition-all cursor-pointer border-0">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
