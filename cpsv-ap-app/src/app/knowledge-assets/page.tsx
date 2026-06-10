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
  Info,
  Building2
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PageToolbar from "@/components/ui/PageToolbar";
import SplitLayout from "@/components/ui/SplitLayout";
import EntityDetailPanel from "@/components/ui/EntityDetailPanel";
import RelationshipCard from "@/components/ui/RelationshipCard";
import MultiTagSelector from "@/components/ui/MultiTagSelector";

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

  // --- PANNEAU GAUCHE : LISTE DES ACTIFS ---
  const leftPane = (
    <div className="rounded-2xl bg-glass border border-muted/20 p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-2 flex items-center gap-1.5">
        <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        Actifs de Connaissance ({filteredAssets.length})
      </h3>
      <div className="space-y-1.5">
        {filteredAssets.map((a) => {
          const isSelected = selectedAsset?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setSelectedAsset(a)}
              className={`w-full text-left flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent ${
                isSelected 
                  ? "bg-primary/10 border-l-4 border-primary text-text shadow-sm" 
                  : "hover:bg-glass text-muted hover:text-text"
              }`}
            >
              <BookOpen className={`h-5 w-5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted"}`} />
              <div className="truncate flex-1">
                <p className="font-bold text-sm truncate">{a.title}</p>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded mt-2 inline-block uppercase tracking-wider">
                  {a.type}
                </span>
              </div>
            </button>
          );
        })}
        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucun livrable ne correspond.
          </div>
        )}
      </div>
    </div>
  );

  // --- PANNEAU DROIT : DETAILS ET TABS ---
  const renderDetailPanel = () => {
    if (!selectedAsset) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-[40vh] border border-muted/20 border-dashed rounded-2xl bg-glass p-6 text-muted italic">
          Sélectionnez un livrable ou actif de connaissance dans la liste.
        </div>
      );
    }

    const a = selectedAsset;

    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/20 border border-muted/10 rounded-xl p-4 text-xs text-text/95 leading-relaxed">
          {a.description || "Aucune description de l'actif de connaissance."}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {a.file && (
            <div className="space-y-2 bg-glass/20 border border-muted/10 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Fichier associé</span>
              <span className="font-mono text-text flex items-center gap-1.5 mt-1 font-bold">
                <FileText className="h-4 w-4 text-primary" />
                {a.file}
              </span>
            </div>
          )}

          {a.url && (
            <div className="space-y-2 bg-glass/20 border border-muted/10 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Consultation externe</span>
              <a 
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline mt-1"
              >
                <ExternalLink className="h-4 w-4" />
                Accéder au document
              </a>
            </div>
          )}
        </div>
      </div>
    );

    const relationsTab = (
      <div className="space-y-6">
        {/* Public Services */}
        {a.publicServices && a.publicServices.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Services documentés ou liés</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {a.publicServices.map(s => (
                <RelationshipCard
                  key={s.id}
                  title={s.name}
                  relationType={`Code : ${s.code}`}
                  Icon={FileText}
                  onClick={() => window.location.href = `/services?id=${s.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ecosystems */}
        {a.ecosystems && a.ecosystems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Écosystèmes valorisés</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {a.ecosystems.map(eco => (
                <RelationshipCard
                  key={eco.id}
                  title={eco.name}
                  relationType="Écosystème"
                  Icon={Share2}
                  onClick={() => window.location.href = `/ecosystems?id=${eco.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {a.eventResources && a.eventResources.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted">Événements territoriaux liés</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {a.eventResources.map(evt => (
                <RelationshipCard
                  key={evt.id}
                  title={evt.title}
                  relationType="Événement"
                  Icon={Calendar}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-600 dark:text-teal-400">https://pit.wallonie.be/id/knowledge-asset/{a.id}</span></p>
        <p className="text-text">Classe sémantique : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:KnowledgeAsset</span></p>
      </div>
    );

    return (
      <EntityDetailPanel
        title={a.title}
        subtitle={`Type de ressource : ${a.type}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded">Actif de Connaissance</span>}
        overviewTab={overviewTab}
        relationsTab={relationsTab}
        metadataTab={metadataTab}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actifs de Connaissance (Knowledge Assets)"
        description="Gérez les guides méthodologiques, études sectorielles et livrables d'écosystèmes produits pour le territoire."
        Icon={BookOpen}
        actions={
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border-0"
          >
            <Plus className="h-4 w-4" />
            Nouvel Actif
          </button>
        }
      />

      <PageToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un actif de connaissance par nom ou description..."
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
        filterLabel="Tous les types"
        filterOptions={assetTypes.map(t => ({ value: t, label: t }))}
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT KNOWLEDGE ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-muted rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-muted/20 pb-4">
              <h3 className="text-lg font-bold text-text">Déclarer un Actif de Connaissance</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-glass text-muted hover:text-text border-0 bg-transparent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Titre de la ressource *</label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Méthodologie IA sectorielle" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Type d'actif</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text">
                    {assetTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Description / Résumé</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez l'apport ou le contenu de ce document..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text h-20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Fichier local (nom)</label>
                  <input value={newFile} onChange={e => setNewFile(e.target.value)} type="text" placeholder="ex: guide_ia_manufacture.pdf" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted">URL externe</label>
                  <input value={newUrl} onChange={e => setNewUrl(e.target.value)} type="url" placeholder="https://example.com/guide.pdf" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 text-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-muted/20">
                <MultiTagSelector
                  label="Services liés"
                  options={services}
                  selectedIds={selectedServiceIds}
                  onChange={setSelectedServiceIds}
                  color="teal"
                />
                <MultiTagSelector
                  label="Écosystèmes"
                  options={ecosystems}
                  selectedIds={selectedEcosystemIds}
                  onChange={setSelectedEcosystemIds}
                  color="blue"
                />
                <MultiTagSelector
                  label="Événements"
                  options={events.map(ev => ({ id: ev.id, name: ev.title }))}
                  selectedIds={selectedEventIds}
                  onChange={setSelectedEventIds}
                  color="purple"
                />
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
