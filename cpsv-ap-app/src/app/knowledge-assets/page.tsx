// src/app/knowledge-assets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Share2, 
  Calendar, 
  ExternalLink
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITEntityCard from "@/design-system/PITEntityCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITForm from "@/design-system/PITForm";
import SplitLayout from "@/components/ui/SplitLayout";
import MultiTagSelector from "@/components/ui/MultiTagSelector";
import { usePerspective } from "@/design-system/PITPerspectiveProvider";
import { useKnowledgeAssetsQuery, useMetaQuery } from "@/hooks/usePITQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import PITVirtualList from "@/design-system/PITVirtualList";

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
  const queryClient = useQueryClient();
  const { data: assetsData, isLoading: assetsLoading, error: assetsError } = useKnowledgeAssetsQuery();
  const { data: metaData, isLoading: metaLoading, error: metaError } = useMetaQuery();

  const loading = assetsLoading || metaLoading;
  const error = (assetsError?.message || metaError?.message) || null;

  const assets = (assetsData || []) as KnowledgeAsset[];

  const services = useMemo(() => (metaData?.services || []) as PublicService[], [metaData]);
  const ecosystems = useMemo(() => (metaData?.ecosystems || []) as Ecosystem[], [metaData]);
  const events = useMemo(() => (metaData?.eventResources || []) as EventResource[], [metaData]);

  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  const selectedAsset = useMemo(() => {
    if (assets.length === 0) return null;
    if (selectedAssetId !== null) {
      return assets.find(a => a.id === selectedAssetId) || assets[0];
    }
    return assets[0];
  }, [assets, selectedAssetId]);

  const setSelectedAsset = (a: KnowledgeAsset | null) => {
    setSelectedAssetId(a ? a.id : null);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { isEntityTypeVisible } = usePerspective();

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Guide");
  const [newDescription, setNewDescription] = useState("");
  const [newFile, setNewFile] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [selectedEcosystemIds, setSelectedEcosystemIds] = useState<number[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  const loadData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["knowledge-assets"] });
    await queryClient.invalidateQueries({ queryKey: ["meta"] });
  };

  useEffect(() => {
    // Selection initialization is handled by selectedAsset useMemo
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
    if (!isEntityTypeVisible("knowledgeasset")) return false;

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
    <div className="rounded-2xl bg-glass border border-muted/20 p-5 space-y-4 max-h-[70vh] flex flex-col">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted px-1 pb-2 border-b border-muted/10">
        Actifs de Connaissance ({filteredAssets.length})
      </h3>
      <div className="flex-1 min-h-0">
        {filteredAssets.length > 0 ? (
          <PITVirtualList
            items={filteredAssets}
            itemHeight={110}
            maxHeight="60vh"
            renderItem={(a) => (
              <div className="py-1 pr-1" style={{ height: "110px" }}>
                <PITEntityCard
                  title={a.title}
                  description={a.description}
                  icon={BookOpen}
                  type="knowledge-asset"
                  subtitle={a.type}
                  isSelected={selectedAsset?.id === a.id}
                  onClick={() => setSelectedAsset(a)}
                />
              </div>
            )}
          />
        ) : (
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
                <FileText className="h-4 w-4 text-teal-650" />
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
                className="inline-flex items-center gap-1.5 text-xs text-teal-650 dark:text-teal-400 font-bold hover:underline mt-1"
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
      <PITRelationsPanel
        sections={[
          {
            title: "Services documentés ou liés",
            items: (a.publicServices || []).map(s => ({
              id: s.id,
              title: s.name,
              relationType: `Code : ${s.code}`,
              Icon: FileText,
              onClick: () => window.location.href = `/services?id=${s.id}`
            }))
          },
          {
            title: "Écosystèmes valorisés",
            items: (a.ecosystems || []).map(eco => ({
              id: eco.id,
              title: eco.name,
              relationType: "Écosystème S3",
              Icon: Share2,
              onClick: () => window.location.href = `/ecosystems?id=${eco.id}`
            }))
          },
          {
            title: "Événements territoriaux liés",
            items: (a.eventResources || []).map(evt => ({
              id: evt.id,
              title: evt.title,
              relationType: "Événement",
              Icon: Calendar
            }))
          }
        ]}
      />
    );

    const metadataTab = (
      <div className="bg-glass/20 border border-muted/10 p-4 rounded-xl text-xs space-y-3">
        <p className="text-text">URI : <span className="font-mono text-teal-650 dark:text-teal-400">https://pit.wallonie.be/id/knowledge-asset/{a.id}</span></p>
        <p className="text-text">Classe sémantique : <span className="font-mono bg-glass px-1.5 py-0.5 rounded border border-muted/20">d4wmo:KnowledgeAsset</span></p>
      </div>
    );

    return (
      <PITDetailLayout
        title={a.title}
        subtitle={`Type de ressource : ${a.type}`}
        badge={<span className="text-[10px] font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">Actif de Connaissance</span>}
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
      subtitle: "Identifiez le livrable et son format",
      fields: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Titre de la ressource *</label>
              <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" placeholder="ex: Méthodologie IA sectorielle" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Type d'actif</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text">
                {assetTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">Description / Résumé</label>
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Décrivez l'apport ou le contenu de ce document..." className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text h-20" />
          </div>
        </div>
      )
    },
    {
      id: "files",
      title: "Fichiers & Liens",
      subtitle: "Uploader local ou lien Web",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Fichier local (nom)</label>
            <input value={newFile} onChange={e => setNewFile(e.target.value)} type="text" placeholder="ex: guide_ia_manufacture.pdf" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">URL externe</label>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} type="url" placeholder="https://example.com/guide.pdf" className="w-full bg-glass border border-muted/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-700 text-text" />
          </div>
        </div>
      )
    },
    {
      id: "alignment",
      title: "Alignement Sémantique",
      subtitle: "Associez les services, écosystèmes et événements",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary animate-pulse"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement des actifs de connaissance...</p>
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

  return (
    <PITLayout
      category="BACKOFFICE TERRITORIAL"
      title="Actifs de Connaissance"
      description="Gérez les guides méthodologiques, études sectorielles et livrables d'écosystèmes produits pour le territoire."
      pageIcon={BookOpen}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Actifs de connaissance" }
      ]}
      actions={
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" />
          Nouvel Actif
        </button>
      }
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un actif de connaissance par nom ou description..."
        selectFilters={[
          {
            id: "type",
            label: "Tous les types",
            value: typeFilter,
            options: assetTypes.map(t => ({ value: t, label: t })),
            onChange: setTypeFilter
          }
        ]}
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={renderDetailPanel()}
        leftColSpan={4}
      />

      {/* MODAL AJOUT KNOWLEDGE ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <PITForm
              title="Déclarer un Actif de Connaissance"
              sections={formSections}
              onSubmit={handleAddAsset}
              onCancel={() => setShowAddModal(false)}
              submitLabel="Créer"
              infoPanel={
                <>
                  <p className="font-bold text-text">Livrables & Actifs de Connaissance</p>
                  <p className="mt-2">Gérez les études de maturité technologique, toolkits opérationnels et guides de bonnes pratiques partagés.</p>
                  <ul className="list-disc list-inside space-y-1.5 mt-3">
                    <li>Indiquez clairement le fichier PDF ou le lien externe de consultation.</li>
                    <li>Liez les services et parcours pour que les livrables apparaissent sur le Graph Explorer.</li>
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
