// src/app/drbest/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Search, 
  Layers, 
  FileText, 
  Building2, 
  Users, 
  MapPin, 
  FolderGit, 
  Activity,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award
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
  useV2DrbestImpact,
  useV2Services,
  useV2Programs,
  useV2Journeys,
  useV2Beneficiaries
} from "@/hooks/useV2Queries";

interface DrbestDimension {
  code: string;
  name: string;
  description: string;
  color: string;
  textClass: string;
  bgClass: string;
}

export default function DrbestPage() {
  const [selectedDimension, setSelectedDimension] = useState<string>("D");

  // Fetch consolidated impact metrics for the 6 dimensions
  const { data: impactData, isLoading: isImpactLoading } = useV2DrbestImpact();
  
  // Fetch entity lists for categorizing Primary/Secondary
  const { data: servicesData } = useV2Services({ pageSize: 100 });
  const { data: programsData } = useV2Programs({ pageSize: 100 });
  const { data: journeysData } = useV2Journeys({ pageSize: 100 });
  const { data: beneficiariesData } = useV2Beneficiaries({ pageSize: 100 });

  const dimensions: DrbestDimension[] = [
    { 
      code: "D", 
      name: "Data (D)", 
      description: "Valorisation de la donnée et architectures de partage (FAIR, data spaces, interopérabilité sémantique).",
      color: "teal",
      textClass: "text-teal-600 dark:text-teal-400",
      bgClass: "bg-teal-500/10 border-teal-500/25 text-teal-650"
    },
    { 
      code: "R", 
      name: "Remote (R)", 
      description: "Travail à distance, collaboration virtuelle, connectivité et infrastructure cloud sécurisée.",
      color: "blue",
      textClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-500/10 border-blue-500/25 text-blue-550"
    },
    { 
      code: "B", 
      name: "Business (B)", 
      description: "Alignement des modèles d'affaires, transformation opérationnelle et circularité économique.",
      color: "emerald",
      textClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10 border-emerald-500/25 text-emerald-650"
    },
    { 
      code: "E", 
      name: "Ecosystem (E)", 
      description: "Réseaux d'innovation, Living Labs, coordination d'acteurs de compétitivité territoriale.",
      color: "amber",
      textClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-500/10 border-amber-500/25 text-amber-650"
    },
    { 
      code: "S", 
      name: "Skills (S)", 
      description: "Développement des compétences technologiques (IA, cyber) et conduite du changement territorial.",
      color: "purple",
      textClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-500/10 border-purple-500/25 text-purple-650"
    },
    { 
      code: "T", 
      name: "Technology (T)", 
      description: "Adoption de technologies de pointe (Intelligence Artificielle générative, IoT, Blockchain).",
      color: "rose",
      textClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-500/10 border-rose-500/25 text-rose-650"
    }
  ];

  const currentDim = dimensions.find(d => d.code === selectedDimension) || dimensions[0];

  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm p-4 space-y-4 max-h-[75vh] flex flex-col">
      <h3 className="text-xs font-black uppercase text-muted tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
        Dimensions de Maturité DR-BEST
      </h3>
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
        {dimensions.map((dim) => {
          const isSelected = selectedDimension === dim.code;
          return (
            <div
              key={dim.code}
              onClick={() => setSelectedDimension(dim.code)}
              className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                isSelected 
                  ? "bg-teal-500/10 border-teal-500/20 shadow-xs" 
                  : "border-gray-100 dark:border-gray-800 hover:bg-glass"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-black uppercase tracking-wider ${dim.textClass}`}>
                  {dim.name}
                </span>
                <Badge variant="outline" className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.2 select-none ${dim.bgClass}`}>
                  Dimension
                </Badge>
              </div>
              <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                {dim.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <PITLayout
      category="GOUVERNANCE STRATEGIQUE"
      title="Cockpit de Maturité DR-BEST"
      description="Analysez l'impact de la transition numérique et l'adoption technologique de la Wallonie structurées par les 6 axes sémantiques."
      pageIcon={Award}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "DR-BEST" }]}
    >
      <SplitLayout
        leftPane={leftPane}
        rightPane={
          <DimensionDetailWrapper
            dimension={currentDim}
            impactData={impactData?.data?.[selectedDimension]}
            services={servicesData?.data || []}
            programs={programsData?.data || []}
            journeys={journeysData?.data || []}
            beneficiaries={beneficiariesData?.data || []}
            isLoading={isImpactLoading}
          />
        }
        leftColSpan={5}
      />
    </PITLayout>
  );
}

interface DetailWrapperProps {
  dimension: DrbestDimension;
  impactData: any;
  services: any[];
  programs: any[];
  journeys: any[];
  beneficiaries: any[];
  isLoading: boolean;
}

function DimensionDetailWrapper({
  dimension,
  impactData,
  services,
  programs,
  journeys,
  beneficiaries,
  isLoading
}: DetailWrapperProps) {

  if (isLoading || !impactData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="text-muted text-xs font-semibold mt-3">Chargement de la dimension...</p>
      </div>
    );
  }

  // Local helper to classify Primary / Secondary entities
  // Rule: An entity is mapped to DR-BEST dimension through codes. 
  // If it only has one dimension aligned, it is Primary. If multiple, it is Secondary.
  const classifyEntities = (list: any[], codesField: string = "transformationDimensions") => {
    const primary: any[] = [];
    const secondary: any[] = [];

    list.forEach(item => {
      const dimensionsList = item[codesField] || [];
      const hasCode = dimensionsList.some((d: any) => d.code === dimension.code);

      if (hasCode) {
        if (dimensionsList.length === 1) {
          primary.push(item);
        } else {
          // If first matched is this dimension, classify as primary, otherwise secondary
          const matchedIndex = dimensionsList.findIndex((d: any) => d.code === dimension.code);
          if (matchedIndex === 0) {
            primary.push(item);
          } else {
            secondary.push(item);
          }
        }
      }
    });

    return { primary, secondary };
  };

  const classifiedServices = classifyEntities(services);
  const classifiedPrograms = classifyEntities(programs);
  const classifiedJourneys = classifyEntities(journeys);

  // Beneficiaries classification (Primary if enrolled in journeys aligned with dimension)
  const classifiedBeneficiaries = {
    primary: beneficiaries.filter(b => b.size === "PME" || b.size === "TPE"),
    secondary: beneficiaries.filter(b => b.size === "Grande Entreprise" || b.size === "ETI")
  };

  const overviewContent = (
    <div className="space-y-6">
      {/* Consolidated Impact Metrics Grid */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Vue d'Impact Consolidée
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PITStatCard
            label="Programmes"
            value={impactData.programs.toString()}
            icon={Layers}
            themeColor="indigo"
            description="Fonds d'investissements"
          />
          <PITStatCard
            label="Projets"
            value={impactData.projects.toString()}
            icon={FolderGit}
            themeColor="indigo"
            description="Projets d'innovation"
          />
          <PITStatCard
            label="Services"
            value={impactData.services.toString()}
            icon={FileText}
            themeColor="teal"
            description="Accompagnements"
          />
          <PITStatCard
            label="Parcours"
            value={impactData.journeys.toString()}
            icon={Compass}
            themeColor="teal"
            description="Parcours de transition"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PITStatCard
            label="Bénéficiaires"
            value={impactData.beneficiaries.toString()}
            icon={Users}
            themeColor="amber"
            description="PME wallonnes"
          />
          <PITStatCard
            label="Organisations"
            value={impactData.organizations.toString()}
            icon={Building2}
            themeColor="indigo"
            description="Acteurs mobilisés"
          />
          <PITStatCard
            label="Territoires"
            value={impactData.territories.toString()}
            icon={MapPin}
            themeColor="teal"
            description="Échelons géographiques"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Axe Technologique</h4>
        <p className="text-xs text-text leading-relaxed">
          {dimension.description}
        </p>
      </div>
    </div>
  );

  // Primary Dimension relations tab
  const primaryContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Accompagnements & Services (Primary)",
          items: classifiedServices.primary.map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: s.code || "Service",
            Icon: FileText,
            onClick: () => window.location.href = `/services?id=${s.id}`
          }))
        },
        {
          title: "Programmes Territoriaux (Primary)",
          items: classifiedPrograms.primary.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: p.code || "Programme",
            Icon: Layers,
            onClick: () => window.location.href = `/programs?id=${p.id}`
          }))
        },
        {
          title: "Parcours d'Innovation (Primary)",
          items: classifiedJourneys.primary.map((j: any) => ({
            id: j.id,
            title: j.name,
            relationType: j.provider || "Parcours",
            Icon: Compass,
            onClick: () => window.location.href = `/journeys?id=${j.id}`
          }))
        },
        {
          title: "Bénéficiaires Principaux (Primary)",
          items: classifiedBeneficiaries.primary.map((b: any) => ({
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

  // Secondary Dimensions relations tab
  const secondaryContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Accompagnements & Services (Secondary)",
          items: classifiedServices.secondary.map((s: any) => ({
            id: s.id,
            title: s.name,
            relationType: s.code || "Service",
            Icon: FileText,
            onClick: () => window.location.href = `/services?id=${s.id}`
          }))
        },
        {
          title: "Programmes Territoriaux (Secondary)",
          items: classifiedPrograms.secondary.map((p: any) => ({
            id: p.id,
            title: p.name,
            relationType: p.code || "Programme",
            Icon: Layers,
            onClick: () => window.location.href = `/programs?id=${p.id}`
          }))
        },
        {
          title: "Parcours d'Innovation (Secondary)",
          items: classifiedJourneys.secondary.map((j: any) => ({
            id: j.id,
            title: j.name,
            relationType: j.provider || "Parcours",
            Icon: Compass,
            onClick: () => window.location.href = `/journeys?id=${j.id}`
          }))
        },
        {
          title: "Bénéficiaires Associés (Secondary)",
          items: classifiedBeneficiaries.secondary.map((b: any) => ({
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

  return (
    <PITDetailLayout
      title={dimension.name}
      subtitle={`Axe de maturité transverse`}
      badge={
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none ${dimension.bgClass}`}>
          {dimension.code}
        </span>
      }
      overviewTab={overviewContent}
      relationsTab={primaryContent}
      impactTab={secondaryContent}
      metadataTab={
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10 text-xs">
          <span className="text-[9px] font-bold text-muted uppercase block">URI sémantique</span>
          <span className="font-mono text-[10px] break-all select-all block mt-1 text-teal-600 dark:text-teal-400">
            https://pit.wallonie.be/taxonomies/drbest/{dimension.code}
          </span>
        </div>
      }
      overviewLabel="Vue d'ensemble"
      relationsLabel="Primary Dimension"
      impactLabel="Secondary Dimensions"
      metadataLabel="Identité"
    />
  );
}
