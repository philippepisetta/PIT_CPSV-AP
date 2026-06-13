// src/app/ecosystems/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  Building2, 
  Layers, 
  FileText, 
  Compass, 
  Users, 
  FolderGit, 
  MapPin, 
  Sparkles, 
  TrendingUp,
  Share2
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
  useV2Ecosystems, 
  useV2EcosystemDetail,
  useV2Contributions
} from "@/hooks/useV2Queries";

export default function EcosystemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEcoId, setSelectedEcoId] = useState<number | null>(null);

  // Fetch all ecosystems
  const { data: ecosystemsData, isLoading: isListLoading, isError: isEcoError } = useV2Ecosystems();

  const rawEcosystems = ecosystemsData?.data || [];

  // Filter ecosystems
  const filteredEcosystems = rawEcosystems.filter((eco: any) => 
    eco.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (eco.description && eco.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectEco = (id: number) => {
    setSelectedEcoId(id);
  };

  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Écosystèmes Territoriaux ({filteredEcosystems.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
              <th className="px-5 py-3.5">Nom / Label</th>
              <th className="px-5 py-3.5">Échelle Territoire</th>
              <th className="px-5 py-3.5">Catégorie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isListLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                  <td className="px-5 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                </tr>
              ))
            ) : filteredEcosystems.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted italic">
                  Aucun écosystème ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredEcosystems.map((eco: any) => (
                <tr
                  key={eco.id}
                  onClick={() => handleSelectEco(eco.id)}
                  className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-105 dark:border-gray-850 transition-colors ${
                    selectedEcoId === eco.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold text-text">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                        {eco.type?.code || "ECO"}
                      </span>
                      <span className="truncate max-w-[180px]">{eco.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-semibold">
                    {eco.territory || "Wallonie"}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase bg-teal-500/10 border-teal-500/25 text-teal-650">
                      {eco.type?.name || "Réseau"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <PITLayout
      category="OBSERVATOIRE TERRITORIAL"
      title="Écosystèmes Innovants"
      description="Visualisez les réseaux régionaux, les pôles de compétitivité, les hubs numériques et l'ensemble de leurs acteurs."
      pageIcon={Share2}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Écosystèmes" }]}
    >
      {isEcoError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 rounded-xl flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            ⚠️
          </span>
          <div>
            <p className="font-bold">API v2 Hors Ligne (Erreur HTTP 404)</p>
            <p className="text-[11px] text-muted-foreground font-normal mt-0.5">
              Le service d'API v2 (Render) n'est pas disponible ou exécute une version obsolète. Les données temps réel ne peuvent pas être récupérées.
            </p>
          </div>
        </div>
      )}

      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher un écosystème par nom, description..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={
          selectedEcoId ? (
            <EcosystemDetailPanel id={selectedEcoId} onClose={() => setSelectedEcoId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/20">
              <Globe className="h-10 w-10 text-muted/50 mb-3" />
              <p className="text-muted text-xs font-bold">Sélectionnez un écosystème pour afficher ses dimensions.</p>
            </div>
          )
        }
        leftColSpan={5}
      />
    </PITLayout>
  );
}

interface DetailPanelProps {
  id: number;
  onClose: () => void;
}

function EcosystemDetailPanel({ id, onClose }: DetailPanelProps) {
  const { data: detailData, isLoading: isDetailLoading } = useV2EcosystemDetail(id);
  const { data: contributionsData } = useV2Contributions("ecosystems", id);

  if (isDetailLoading || !detailData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="text-muted text-xs font-semibold mt-3">Chargement des détails de l'écosystème...</p>
      </div>
    );
  }

  const eco = detailData.data;

  const actors = contributionsData?.organizations || [];
  const services = contributionsData?.services || [];
  const journeys = contributionsData?.journeys || [];
  const programs = contributionsData?.programs || [];
  const projects = contributionsData?.projects || [];
  const territories = contributionsData?.territories || [];
  const beneficiaries = contributionsData?.beneficiaries || [];
  const capabilities = contributionsData?.capabilities || [];
  const challenges = contributionsData?.challenges || [];

  const overviewContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Membres du réseau"
          value={actors.length.toString()}
          icon={Building2}
          themeColor="indigo"
          description="Organisations actives recensées"
        />
        <PITStatCard
          label="Accompagnements"
          value={services.length.toString()}
          icon={FileText}
          themeColor="teal"
          description="Services publics catalogués"
        />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Mission de l'écosystème</h4>
        <p className="text-xs text-text leading-relaxed italic bg-glass/5 p-3 rounded-xl border border-muted/5">
          "{eco.mission || "Favoriser l'émergence de projets d'innovation territoriaux et accompagner le tissu industriel."}"
        </p>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description</h4>
        <p className="text-xs text-text leading-relaxed">
          {eco.description || "Aucune description sémantique additionnelle renseignée."}
        </p>
      </div>

      {/* S3 alignment info */}
      <div className="space-y-3 pt-4 border-t border-muted/10">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Alignements Stratégiques S3</span>
        <div className="flex flex-wrap gap-1.5">
          <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
            S3: Innovation Industrielle
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
            Chaîne de valeur : Digital
          </Badge>
        </div>
      </div>
    </div>
  );

  const relationsContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Défis d'affaires (Challenges)",
          items: challenges.map((c: any) => ({
            id: c.id,
            title: c.name,
            relationType: "Défi adressé",
            Icon: Sparkles
          }))
        },
        {
          title: "Capabilités de l'écosystème",
          items: capabilities.map((c: any) => ({
            id: c.id,
            title: c.name,
            relationType: "Aptitude technique",
            Icon: Layers,
            onClick: () => window.location.href = `/capabilities?id=${c.id}`
          }))
        },
        {
          title: "Services et Accompagnements",
          items: services.map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: s.code || `SVC-${s.id}`,
            Icon: FileText,
            onClick: () => window.location.href = `/services?id=${s.id}`
          }))
        },
        {
          title: "Parcours sémantiques (Journeys)",
          items: journeys.map((j: any) => ({
            id: j.id,
            title: j.name,
            relationType: j.provider || "Parcours",
            Icon: Compass,
            onClick: () => window.location.href = `/journeys?id=${j.id}`
          }))
        },
        {
          title: "Bénéficiaires associés",
          items: beneficiaries.map((b: any) => ({
            id: b.id,
            title: b.name,
            relationType: b.size || "Entreprise",
            Icon: Users,
            onClick: () => window.location.href = `/beneficiaries?id=${b.id}`
          }))
        },
        {
          title: "Acteurs & Membres du réseau",
          items: actors.map((a: any) => ({
            id: a.id,
            title: a.name,
            relationType: a.type || "Acteur",
            Icon: Building2,
            onClick: () => window.location.href = `/organizations?id=${a.id}`
          }))
        },
        {
          title: "Programmes Porteurs",
          items: programs.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: p.code || "Programme",
            Icon: Layers,
            onClick: () => window.location.href = `/programs?id=${p.id}`
          }))
        },
        {
          title: "Projets Rattachés",
          items: projects.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: "Projet d'innovation",
            Icon: FolderGit
          }))
        },
        {
          title: "Territoires d'intervention",
          items: territories.map((t: any) => ({
            id: t.id,
            title: t.name,
            relationType: t.type,
            Icon: MapPin,
            onClick: () => window.location.href = `/territories?id=${t.id}`
          }))
        }
      ]}
    />
  );

  const impactContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Mesure d'impact de l'Écosystème
      </h4>
      <PITImpactPanel data={contributionsData} />
    </div>
  );

  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="bg-glass/10 p-3 rounded-xl border border-muted/10 space-y-1">
        <span className="text-[9px] font-bold text-muted uppercase block">URI de référence</span>
        <span className="font-mono text-[10px] break-all select-all block text-teal-650 dark:text-teal-400">
          {eco.uri || `https://pit.wallonie.be/id/ecosystem/${eco.id}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma</span>
          <span className="font-mono">{eco.id}</span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Type d'Écosystème</span>
          <span>{eco.type?.name || "Réseau Territorial"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={eco.name}
      subtitle={eco.type?.name || "Réseau régional"}
      badge={
        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
          {eco.type?.code || "ECOSYSTEM"}
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
      relationsLabel="Dimensions & Alignement"
      contributionsLabel="Mesure d'impact"
      metadataLabel="Identité"
    />
  );
}
