// src/app/territories/page.tsx
"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Layers, 
  FileText, 
  Compass, 
  Users, 
  Map,
  TrendingUp,
  Globe
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITImpactPanel from "@/design-system/PITImpactPanel";
import SplitLayout from "@/components/ui/SplitLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2Territories, 
  useV2TerritoryDetail,
  useV2Contributions
} from "@/hooks/useV2Queries";

interface TerritoryTreeNodeProps {
  node: any;
  allTerritories: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  level: number;
}

function TerritoryTreeNode({ node, allTerritories, selectedId, onSelect, level }: TerritoryTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(level < 2); // Open top levels by default
  const children = allTerritories.filter((t: any) => t.parentTerritoryId === node.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === node.id;

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "REGION": return "bg-teal-500/10 text-teal-600 border-teal-500/25";
      case "PROVINCE": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/25";
      case "ARRONDISSEMENT": return "bg-purple-500/10 text-purple-600 border-purple-500/25";
      case "COMMUNE": return "bg-amber-500/10 text-amber-600 border-amber-500/25";
      case "ECONOMIC_BASIN": return "bg-blue-500/10 text-blue-600 border-blue-500/25";
      case "INNOVATION_DISTRICT": return "bg-rose-500/10 text-rose-600 border-rose-500/25";
      default: return "bg-muted text-muted";
    }
  };

  const getFriendlyType = (type: string) => {
    switch (type) {
      case "REGION": return "Région";
      case "PROVINCE": return "Province";
      case "ARRONDISSEMENT": return "Arrondissement";
      case "COMMUNE": return "Commune";
      case "ECONOMIC_BASIN": return "Bassin Économique";
      case "INNOVATION_DISTRICT": return "Innovation District";
      default: return type;
    }
  };

  return (
    <div className="space-y-1">
      <div 
        onClick={() => onSelect(node.id)}
        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer hover:bg-glass transition-all ${
          isSelected ? "bg-teal-500/10 border-l-4 border-l-teal-650" : ""
        }`}
        style={{ paddingLeft: `${Math.max(8, level * 16)}px` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border-0 bg-transparent cursor-pointer"
            >
              {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted" /> : <ChevronRight className="h-3.5 w-3.5 text-muted" />}
            </button>
          ) : (
            <div className="w-5.5" />
          )}
          <MapPin className={`h-4 w-4 shrink-0 ${isSelected ? "text-teal-650" : "text-muted"}`} />
          <span className="text-xs font-bold text-text truncate">{node.name}</span>
        </div>
        <Badge variant="outline" className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 select-none shrink-0 ${getBadgeColor(node.type)}`}>
          {getFriendlyType(node.type)}
        </Badge>
      </div>

      {isOpen && hasChildren && (
        <div className="space-y-1">
          {children.map((child: any) => (
            <TerritoryTreeNode 
              key={child.id} 
              node={child} 
              allTerritories={allTerritories} 
              selectedId={selectedId} 
              onSelect={onSelect} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TerritoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<number | null>(null);

  // Fetch territories
  const { data: territoriesData, isLoading } = useV2Territories();

  const allTerritories = territoriesData?.data || [];

  // Find root territories (without parentTerritoryId)
  const rootTerritories = allTerritories.filter(
    (t: any) => !t.parentTerritoryId || !allTerritories.some((pt: any) => pt.id === t.parentTerritoryId)
  );

  // Filter root list if search query is active
  const displayedRoots = searchQuery
    ? allTerritories.filter((t: any) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rootTerritories;

  const handleSelectTerritory = (id: number) => {
    setSelectedTerritoryId(id);
  };

  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm p-4 space-y-4 max-h-[75vh] flex flex-col">
      <h3 className="text-xs font-black uppercase text-muted tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
        Hiérarchie des Territoires ({allTerritories.length})
      </h3>
      <div className="overflow-y-auto flex-1 space-y-1.5 pr-1.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-8 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse w-full"></div>
          ))
        ) : displayedRoots.length === 0 ? (
          <p className="text-xs text-muted italic text-center py-4">Aucun territoire trouvé.</p>
        ) : (
          displayedRoots.map((root: any) => (
            <TerritoryTreeNode 
              key={root.id} 
              node={root} 
              allTerritories={allTerritories} 
              selectedId={selectedTerritoryId} 
              onSelect={handleSelectTerritory} 
              level={0} 
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Territoires et Bassins de Vie"
      description="Visualisez la couverture géographique de la Wallonie structurée de l'échelle régionale jusqu'aux parcs d'activités économiques."
      pageIcon={Map}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Territoires" }]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un territoire par nom..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={
          selectedTerritoryId ? (
            <TerritoryDetailWrapper id={selectedTerritoryId} onClose={() => setSelectedTerritoryId(null)} allTerritories={allTerritories} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/20">
              <Map className="h-10 w-10 text-muted/50 mb-3" />
              <p className="text-muted text-xs font-bold">Sélectionnez un échelon territorial pour analyser son impact.</p>
            </div>
          )
        }
        leftColSpan={5}
      />
    </PITLayout>
  );
}

interface DetailWrapperProps {
  id: number;
  onClose: () => void;
  allTerritories: any[];
}

function TerritoryDetailWrapper({ id, onClose, allTerritories }: DetailWrapperProps) {
  const { data: detailData, isLoading: isDetailLoading } = useV2TerritoryDetail(id);
  const { data: contributionsData } = useV2Contributions("territories", id);

  if (isDetailLoading || !detailData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="text-muted text-xs font-semibold mt-3">Chargement des données du territoire...</p>
      </div>
    );
  }

  const territory = detailData.data;

  // Compute local sub-metrics for "Couverture territoriale"
  const childCommunes = allTerritories.filter(
    (t: any) => t.parentTerritoryId === id && t.type === "COMMUNE"
  );
  
  // Recursively find all nested communes
  const findAllCommunes = (parent: number): any[] => {
    let result = allTerritories.filter((t: any) => t.parentTerritoryId === parent && t.type === "COMMUNE");
    const childBranches = allTerritories.filter((t: any) => t.parentTerritoryId === parent && t.type !== "COMMUNE");
    childBranches.forEach(branch => {
      result = [...result, ...findAllCommunes(branch.id)];
    });
    return result;
  };
  const totalCommunes = territory.type === "COMMUNE" ? 1 : findAllCommunes(id).length;

  const organizations = contributionsData?.organizations || [];
  const beneficiaries = contributionsData?.beneficiaries || [];
  const services = contributionsData?.services || [];
  const programs = contributionsData?.programs || [];
  const journeys = contributionsData?.journeys || [];

  const overviewContent = (
    <div className="space-y-6">
      {/* Couverture territoriale Metrics Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Couverture Territoriale
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Communes</span>
            <span className="text-base font-extrabold text-teal-650">{totalCommunes}</span>
          </div>
          <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Acteurs</span>
            <span className="text-base font-extrabold text-indigo-600">{organizations.length}</span>
          </div>
          <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Bénéficiaires</span>
            <span className="text-base font-extrabold text-amber-500">{beneficiaries.length}</span>
          </div>
          <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Services</span>
            <span className="text-base font-extrabold text-emerald-500">{services.length}</span>
          </div>
          <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl text-center space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Programmes</span>
            <span className="text-base font-extrabold text-purple-600">{programs.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description</h4>
        <p className="text-xs text-text leading-relaxed">
          {territory.description || "Aucune description détaillée n'est enregistrée pour ce territoire."}
        </p>
      </div>
    </div>
  );

  const relationsContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Organisations & Acteurs actifs",
          items: organizations.map((o: any) => ({
            id: o.id,
            title: o.name,
            relationType: o.type || "Opérateur",
            Icon: Building2,
            onClick: () => window.location.href = `/organizations?id=${o.id}`
          }))
        },
        {
          title: "Programmes Territoriaux",
          items: programs.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: p.code || "Programme",
            Icon: Layers,
            onClick: () => window.location.href = `/programs?id=${p.id}`
          }))
        },
        {
          title: "Accompagnements (Services) délivrés",
          items: services.map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: s.code || "Service",
            Icon: FileText,
            onClick: () => window.location.href = `/services?id=${s.id}`
          }))
        },
        {
          title: "Parcours suivis",
          items: journeys.map((j: any) => ({
            id: j.id,
            title: j.name,
            relationType: j.provider || "Parcours",
            Icon: Compass,
            onClick: () => window.location.href = `/journeys?id=${j.id}`
          }))
        },
        {
          title: "Bénéficiaires implantés",
          items: beneficiaries.map((b: any) => ({
            id: b.id,
            title: b.name,
            relationType: b.size || "Entreprise",
            Icon: Users,
            onClick: () => window.location.href = `/beneficiaries?id=${b.id}`
          }))
        }
      ]}
    />
  );

  const impactContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Mesure d'impact & Alignement S3 / DR-BEST du Territoire
      </h4>
      <PITImpactPanel data={contributionsData} />
    </div>
  );

  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="bg-glass/10 p-3 rounded-xl border border-muted/10 space-y-1">
        <span className="text-[9px] font-bold text-muted uppercase block">URI sémantique</span>
        <span className="font-mono text-[10px] break-all select-all block text-teal-650 dark:text-teal-400">
          {territory.uri || `https://pit.wallonie.be/id/territory/${territory.id}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma</span>
          <span className="font-mono">{territory.id}</span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Type d'Échelon</span>
          <span>{territory.type}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={territory.name}
      subtitle={`Échelon : ${territory.type}`}
      badge={
        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
          {territory.code || "TERRITOIRE"}
        </span>
      }
      actions={
        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-[11px] font-bold">
          Fermer
        </Button>
      }
      overviewTab={overviewContent}
      relationsTab={relationsContent}
      contributionsTab={impactContent}
      metadataTab={metadataContent}
      overviewLabel="Vue d'ensemble"
      relationsLabel="Relations & Couverture"
      contributionsLabel="Mesure d'impact"
      metadataLabel="Métadonnées"
    />
  );
}
