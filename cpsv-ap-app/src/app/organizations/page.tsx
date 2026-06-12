// src/app/organizations/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  Layers, 
  FileText, 
  FolderGit, 
  Globe, 
  MapPin, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Network
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
  useV2Organizations, 
  useV2OrganizationDetail,
  useV2OrganizationServices,
  useV2OrganizationPrograms,
  useV2OrganizationProjects,
  useV2OrganizationEcosystems,
  useV2OrganizationTerritories,
  useV2Contributions
} from "@/hooks/useV2Queries";

// Helper components for relational totals inside the table
function RelationCount({ hook, orgId }: { hook: any, orgId: number }) {
  const { data } = hook(orgId);
  return <span>{data?.data?.length ?? 0}</span>;
}

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  // Fetch organizations
  const { data: orgsData, isLoading: isOrgsLoading } = useV2Organizations();

  // Selected Organization Detail
  const { data: orgDetailData, isLoading: isDetailLoading } = useV2OrganizationDetail(selectedOrgId);

  const rawOrgs = orgsData?.data || [];

  // Filter organizations by search query and role PIT
  const filteredOrgs = rawOrgs.filter((org: any) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (org.code && org.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = 
      !selectedRole || 
      (org.type && org.type.toLowerCase().includes(selectedRole.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  const handleSelectOrg = (id: number) => {
    setSelectedOrgId(id);
  };

  const roleOptions = [
    { value: "Opérateur", label: "Opérateur" },
    { value: "Partenaire", label: "Partenaire" },
    { value: "Financeur", label: "Financeur" },
    { value: "Bénéficiaire", label: "Bénéficiaire" },
    { value: "Cluster", label: "Cluster" },
    { value: "Pôle", label: "Pôle de compétitivité" },
    { value: "Recherche", label: "Centre de recherche / Université" },
    { value: "Administration", label: "Administration" },
    { value: "Incubateur", label: "Incubateur" },
    { value: "Accélérateur", label: "Accélérateur" }
  ];

  // Table side
  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Acteurs et Organisations ({filteredOrgs.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
              <th className="px-5 py-3.5">Organisation</th>
              <th className="px-5 py-3.5">Rôle / Type</th>
              <th className="px-5 py-3.5 text-center">Services</th>
              <th className="px-5 py-3.5 text-center">Programmes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isOrgsLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                  <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6 mx-auto"></div></td>
                  <td className="px-5 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6 mx-auto"></div></td>
                </tr>
              ))
            ) : filteredOrgs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted italic">
                  Aucun acteur ne correspond à vos filtres.
                </td>
              </tr>
            ) : (
              filteredOrgs.map((org: any) => (
                <tr
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id)}
                  className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-105 dark:border-gray-850 transition-colors ${
                    selectedOrgId === org.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold text-text">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                        {org.code || `ORG-${org.id}`}
                      </span>
                      <span className="truncate max-w-[180px]">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-semibold">
                    {org.type || "Opérateur Public"}
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-teal-600 dark:text-teal-400">
                    <RelationCount hook={useV2OrganizationServices} orgId={org.id} />
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-indigo-500">
                    <RelationCount hook={useV2OrganizationPrograms} orgId={org.id} />
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
      category="GOUVERNANCE STRATEGIQUE"
      title="Cockpit Acteurs & Organisations"
      description="Gérez les administrations, opérateurs sémantiques, universités, financeurs et clusters pilotant l'innovation en Région Wallonne."
      pageIcon={Building2}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Organisations" }]}
    >
      <PITFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Rechercher une organisation par nom ou code..."
        selectFilters={[
          {
            id: "role-filter",
            label: "Filtrer par Rôle PIT",
            value: selectedRole,
            options: roleOptions,
            onChange: setSelectedRole
          }
        ]}
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={
          selectedOrgId ? (
            isDetailLoading || !orgDetailData ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                <p className="text-muted text-xs font-semibold mt-3">Chargement du profil de l'acteur...</p>
              </div>
            ) : (
              <OrganizationDetailPanel org={orgDetailData.data} onClose={() => setSelectedOrgId(null)} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/20">
              <Building2 className="h-10 w-10 text-muted/50 mb-3" />
              <p className="text-muted text-xs font-bold">Sélectionnez une organisation pour afficher son profil 360°.</p>
            </div>
          )
        }
        leftColSpan={5}
      />
    </PITLayout>
  );
}

interface OrganizationDetailPanelProps {
  org: any;
  onClose: () => void;
}

function OrganizationDetailPanel({ org, onClose }: OrganizationDetailPanelProps) {
  const { data: servicesData } = useV2OrganizationServices(org.id);
  const { data: programsData } = useV2OrganizationPrograms(org.id);
  const { data: projectsData } = useV2OrganizationProjects(org.id);
  const { data: ecosystemsData } = useV2OrganizationEcosystems(org.id);
  const { data: territoriesData } = useV2OrganizationTerritories(org.id);
  const { data: contributionsData } = useV2Contributions("organizations", org.id);

  const services = servicesData?.data || [];
  const programs = programsData?.data || [];
  const projects = projectsData?.data || [];
  const ecosystems = ecosystemsData?.data || [];
  const territories = territoriesData?.data || [];

  const overviewContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Services actifs"
          value={services.length.toString()}
          icon={FileText}
          themeColor="teal"
          description="Accompagnements proposés aux PME"
        />
        <PITStatCard
          label="Programmes associés"
          value={programs.length.toString()}
          icon={Layers}
          themeColor="indigo"
          description="Fonds d'innovation gérés"
        />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Description</h4>
        <p className="text-xs text-text leading-relaxed">
          {org.description || "Aucune description détaillée n'est disponible pour cet acteur régional."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-muted/10 text-xs">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider block">Code Référence</span>
          <span className="font-mono font-bold">{org.code || "N/A"}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase text-muted tracking-wider block">Rôle Institutionnel</span>
          <span className="font-bold">{org.type || "Opérateur de terrain"}</span>
        </div>
      </div>
    </div>
  );

  const relationsContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Accompagnements & Services",
          items: services.map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: s.code || `SVC-${s.id}`,
            Icon: FileText,
            onClick: () => window.location.href = `/services?id=${s.id}`
          }))
        },
        {
          title: "Programmes Territoriaux",
          items: programs.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: p.code || `PRG-${p.id}`,
            Icon: Layers,
            onClick: () => window.location.href = `/programs?id=${p.id}`
          }))
        },
        {
          title: "Projets Rattachés",
          items: projects.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: "Projet d'Innovation",
            Icon: FolderGit
          }))
        },
        {
          title: "Écosystèmes Membres",
          items: ecosystems.map((e: any) => ({
            id: e.id,
            title: e.name,
            relationType: e.territory || "Réseau Wallon",
            Icon: Globe,
            onClick: () => window.location.href = `/ecosystems?id=${e.id}`
          }))
        },
        {
          title: "Territoires d'impact",
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
        Contributions de l'organisation
      </h4>
      <PITImpactPanel data={contributionsData} />
    </div>
  );

  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="bg-glass/10 p-3 rounded-xl border border-muted/10 space-y-1">
        <span className="text-[9px] font-bold text-muted uppercase block">URI sémantique</span>
        <span className="font-mono text-[10px] break-all select-all block text-teal-600 dark:text-teal-400">
          {org.uri || `https://pit.wallonie.be/id/organization/${org.id}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma</span>
          <span className="font-mono">{org.id}</span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Créé le</span>
          <span>{org.createdAt ? new Date(org.createdAt).toLocaleDateString("fr-BE") : "N/A"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={org.name}
      subtitle={org.type || "Profil institutionnel"}
      badge={
        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
          {org.code || "ORG"}
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
      overviewLabel="Profil"
      relationsLabel="Relations & Réseau"
      contributionsLabel="Mesure d'impact"
      metadataLabel="Identité"
    />
  );
}
