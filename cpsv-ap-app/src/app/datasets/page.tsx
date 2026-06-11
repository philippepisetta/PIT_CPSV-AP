// src/app/datasets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Database, 
  Plus, 
  X, 
  Building2, 
  Calendar, 
  Award, 
  Tag, 
  Hash
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITForm from "@/design-system/PITForm";
import SplitLayout from "@/components/ui/SplitLayout";
import ReferenceSelector from "@/components/ui/ReferenceSelector";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";

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
  const { isEntityTypeVisible } = usePerspective();

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
    if (!isEntityTypeVisible("dataset")) return false;

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
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
      <div className="text-xs font-bold text-muted uppercase tracking-wider px-1">
        Jeux de Données ({filteredDatasets.length})
      </div>
      <div className="space-y-2.5">
        {filteredDatasets.map((d) => (
          <PITEntityCard
            key={d.id}
            title={d.title}
            description={d.description}
            icon={Database}
            type="service"
            subtitle={d.ownerOrganization?.name || "Organisation inconnue"}
            isSelected={selectedDataset?.id === d.id}
            onClick={() => setSelectedDataset(d)}
          />
        ))}
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
              <Calendar className="h-4 w-4 text-teal-650" />
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
              <span className="text-teal-650 dark:text-teal-400 font-black">{d.qualityScore.toFixed(1)} / 5.0</span>
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
              <Tag className="h-3.5 w-3.5 text-teal-605" />
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
              <Hash className="h-3.5 w-3.5 text-amber-555" />
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
      <PITRelationsPanel
        sections={[
          {
            title: "Organisation éditeur / propriétaire",
            items: d.ownerOrganization ? [{
              id: d.ownerOrganization.id,
              title: d.ownerOrganization.name,
              relationType: d.ownerOrganization.type || "Opérateur Territorial",
              Icon: Building2
            }] : []
          }
        ]}
      />
    );

    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/dataset/{d.id}</span></p>
        <p className="text-text">Classe sémantique : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">dcat:Dataset</span></p>
        <p className="text-text">Conformité au profil : <span className="font-bold">DCAT-AP v2.1.1 (Europe)</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={d.title}
        subtitle={`Édité par ${d.ownerOrganization?.name}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Dataset DCAT-AP</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  const formSections = [
    {
      id: "general",
      title: "Informations Générales",
      subtitle: "Identifiez et décrivez le jeu de données",
      fields: (
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Titre du jeu de données *</label>
            <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Profils de maturité numérique wallonne" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Description</label>
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez le contenu et l'utilité du dataset..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text h-20" />
          </div>
        </div>
      )
    },
    {
      id: "metadata",
      title: "Métadonnées de Publication",
      subtitle: "Opérateur, fréquence de mise à jour et qualité",
      fields: (
        <div className="space-y-4 text-xs">
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
              <select value={newUpdateFrequency} onChange={e => setNewUpdateFrequency(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text">
                <option value="Journalier">Journalier</option>
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuel">Mensuel</option>
                <option value="Trimestriel">Trimestriel</option>
                <option value="Annuel">Annuel</option>
                <option value="Statique">Statique</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Score de Qualité Initial (0.0 à 5.0)</label>
            <input value={newQualityScore} onChange={e => setNewQualityScore(parseFloat(e.target.value) || 5.0)} type="number" min={0} max={5} step={0.1} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
        </div>
      )
    },
    {
      id: "semantics",
      title: "Indexation Sémantique",
      subtitle: "Thèmes DCAT-AP et mots-clés",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Thèmes (séparés par des virgules)</label>
            <input value={newThemesText} onChange={e => setNewThemesText(e.target.value)} type="text" placeholder="IA, Numérique, S3" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Mots-clés (séparés par des virgules)</label>
            <input value={newKeywordsText} onChange={e => setNewKeywordsText(e.target.value)} type="text" placeholder="PME, Maturité, Données" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
        </div>
      )
    }
  ];

  return (
    <PITLayout
      category="BACKOFFICE TERRITORIAL"
      title="Catalogues de Données (DCAT-AP)"
      description="Référentiel des jeux de données territoriaux et d'écosystèmes conformes aux standards d'interopérabilité européens."
      pageIcon={Database}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Données DCAT-AP" }
      ]}
      actions={
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" />
          Nouveau Dataset
        </button>
      }
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un dataset par titre ou description..."
        selectFilters={[
          {
            id: "theme",
            label: "Tous les thèmes",
            value: selectedThemeFilter,
            options: allThemes.map(t => ({ value: t, label: t })),
            onChange: setSelectedThemeFilter
          }
        ]}
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT DATASET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <PITForm
              title="Déclarer un Dataset DCAT-AP"
              sections={formSections}
              onSubmit={handleAddDataset}
              onCancel={() => setShowAddModal(false)}
              submitLabel="Créer"
              infoPanel={
                <>
                  <p className="font-bold text-text">Profil de Données Wallon (DCAT-AP)</p>
                  <p className="mt-2">L'indexation de vos jeux de données doit respecter la spécification européenne d'interopérabilité DCAT-AP pour les portails Open Data régionaux.</p>
                  <ul className="list-disc list-inside space-y-1.5 mt-3">
                    <li>Indiquez l'organisation officielle éditrice de la ressource.</li>
                    <li>Séparez les thématiques par des virgules pour faciliter le moissonnage RDF.</li>
                    <li>Visez un score de conformité élevé de métadonnées sémantiques.</li>
                  </ul>
                </>
              }
            />
          </div>
        </div>
      )}
    </PITLayout>
  );
}
