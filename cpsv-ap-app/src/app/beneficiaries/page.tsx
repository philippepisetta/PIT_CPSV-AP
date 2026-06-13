// src/app/beneficiaries/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Layers, 
  FileText, 
  Compass, 
  Users, 
  Sparkles, 
  FolderGit, 
  MapPin, 
  TrendingUp,
  Activity,
  ArrowRight,
  HelpCircle,
  Briefcase,
  CheckCircle,
  Network
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import PITImpactPanel from "@/design-system/PITImpactPanel";
import SplitLayout from "@/components/ui/SplitLayout";
import Timeline from "@/components/ui/Timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useV2Beneficiaries, 
  useV2BeneficiaryDetail,
  useV2BeneficiaryJourneys,
  useV2BeneficiaryServices,
  useV2BeneficiaryPrograms,
  useV2BeneficiaryProjects,
  useV2Contributions
} from "@/hooks/useV2Queries";

export default function BeneficiariesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeneId, setSelectedBeneId] = useState<number | null>(null);

  // Fetch all beneficiaries
  const { data: beneficiariesData, isLoading: isListLoading, isError: isBeneError } = useV2Beneficiaries();

  const rawBeneficiaries = beneficiariesData?.data || [];

  // Filter beneficiaries
  const filteredBeneficiaries = rawBeneficiaries.filter((bene: any) => 
    bene.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (bene.location && bene.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bene.province && bene.province.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectBene = (id: number) => {
    setSelectedBeneId(id);
  };

  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Entreprises et Bénéficiaires ({filteredBeneficiaries.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/75 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 font-extrabold uppercase text-muted tracking-wider">
              <th className="px-5 py-3.5">Bénéficiaire</th>
              <th className="px-5 py-3.5">Taille</th>
              <th className="px-5 py-3.5">Localisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isListLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
                </tr>
              ))
            ) : filteredBeneficiaries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted italic">
                  Aucun bénéficiaire ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredBeneficiaries.map((bene: any) => (
                <tr
                  key={bene.id}
                  onClick={() => handleSelectBene(bene.id)}
                  className={`hover:bg-teal-500/5 cursor-pointer border-b border-gray-105 dark:border-gray-850 transition-colors ${
                    selectedBeneId === bene.id ? "bg-teal-500/10 border-l-4 border-l-teal-600" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 font-bold text-text">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-muted px-1.5 py-0.2 rounded font-bold uppercase select-none">
                        {bene.bce ? "BCE" : "ID"}
                      </span>
                      <span className="truncate max-w-[160px]">{bene.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted font-semibold">
                    {bene.size || "PME"}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {bene.location} ({bene.province || "Wallonie"})
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
      title="Profil 360° du Bénéficiaire"
      description="Analysez l'alignement stratégique, les accompagnements reçus et les trajectoires d'innovation des PME et acteurs publics de Wallonie."
      pageIcon={Users}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Bénéficiaires" }]}
    >
      {isBeneError && (
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
        searchPlaceholder="Rechercher une entreprise par nom, localisation, province..."
      />

      <SplitLayout
        leftPane={leftPane}
        rightPane={
          selectedBeneId ? (
            <BeneficiaryDetailPanel id={selectedBeneId} onClose={() => setSelectedBeneId(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/20">
              <Users className="h-10 w-10 text-muted/50 mb-3" />
              <p className="text-muted text-xs font-bold">Sélectionnez une entreprise dans la liste pour charger son profil 360°.</p>
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

function BeneficiaryDetailPanel({ id, onClose }: DetailPanelProps) {
  const { data: detailData, isLoading: isDetailLoading } = useV2BeneficiaryDetail(id);
  const { data: journeysData } = useV2BeneficiaryJourneys(id);
  const { data: servicesData } = useV2BeneficiaryServices(id);
  const { data: programsData } = useV2BeneficiaryPrograms(id);
  const { data: projectsData } = useV2BeneficiaryProjects(id);
  const { data: contributionsData } = useV2Contributions("beneficiaries", id);

  if (isDetailLoading || !detailData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="text-muted text-xs font-semibold mt-3">Chargement des données du bénéficiaire...</p>
      </div>
    );
  }

  const bene = detailData.data;

  const journeys = journeysData?.data || [];
  const services = servicesData?.data || [];
  const programs = programsData?.data || [];
  const projects = projectsData?.data || [];

  const challenges = contributionsData?.challenges || [];
  const capabilities = contributionsData?.capabilities || [];

  const overviewContent = (
    <div className="space-y-6">
      {/* 2 Cards of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PITStatCard
          label="Services Reçus"
          value={services.length.toString()}
          icon={FileText}
          themeColor="teal"
          description="Accompagnements et diagnostics"
        />
        <PITStatCard
          label="Parcours suivis"
          value={journeys.length.toString()}
          icon={Compass}
          themeColor="indigo"
          description="Trajectoires d'innovation initiées"
        />
      </div>

      {/* Info grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-text">
        <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-muted uppercase block">Données Administratives</span>
          <p>Localisation : <span className="font-bold">{bene.location} ({bene.province})</span></p>
          <p>N BCE : <span className="font-mono">{bene.bce || "Non spécifié"}</span></p>
        </div>
        <div className="bg-glass/5 border border-muted/10 p-3 rounded-xl space-y-1">
          <span className="text-[9px] font-bold text-muted uppercase block">Métrique d'Affaires</span>
          <p>Taille : <span className="font-bold">{bene.size || "PME"}</span></p>
          <p>Effectif : <span className="font-bold">{bene.employees || "—"} ETP</span></p>
        </div>
      </div>

      {bene.demand && (
        <div className="space-y-1 bg-glass/5 border border-muted/10 p-3.5 rounded-xl text-xs">
          <span className="text-[9px] font-bold text-muted uppercase block">Problématique / Demande initiale</span>
          <p className="italic leading-relaxed">"{bene.demand}"</p>
        </div>
      )}

      {/* Maturities sliders/progress */}
      <div className="space-y-3.5 pt-4 border-t border-muted/10">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Diagnostics de maturité (Modèle PIT)</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            { label: "Maturité Numérique", value: bene.maturityDigital || 2, color: "bg-teal-500" },
            { label: "Maturité IA", value: bene.maturityIa || 1, color: "bg-purple-500" },
            { label: "Maturité Cybersécurité", value: bene.maturityCyber || 2, color: "bg-rose-500" },
            { label: "Maturité Export", value: bene.maturityExport || 1, color: "bg-amber-500" },
            { label: "Maturité Durable / S3", value: bene.maturityDurability || 2, color: "bg-emerald-500" }
          ].map((item, idx) => (
            <div key={idx} className="bg-glass/5 border border-muted/10 p-3 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span>{item.label}</span>
                <span className="text-teal-650">{item.value}/5</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 dark:bg-gray-850 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / 5) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const relationsContent = (
    <PITRelationsPanel
      sections={[
        {
          title: "Secteurs NACE d'Activité",
          items: bene.primaryNaceSector ? [
            {
              id: bene.primaryNaceSector.id,
              title: bene.primaryNaceSector.name,
              relationType: `Code principal: ${bene.primaryNaceSector.code}`,
              Icon: Briefcase
            }
          ] : []
        },
        {
          title: "Défis Stratégiques identifiés",
          items: challenges.map((c: any) => ({
            id: c.id,
            title: c.name,
            relationType: "Défi d'affaires",
            Icon: Sparkles
          }))
        },
        {
          title: "Domaines S3 & Chaînes de Valeur",
          items: [
            {
              id: 1,
              title: "Innovation Industrielle & Circularité",
              relationType: "Alignement stratégique S3",
              Icon: Network
            }
          ]
        }
      ]}
    />
  );

  // New PIT Pathway tab: Challenge -> Capability -> Service -> Journey -> Beneficiary
  const pathwayContent = (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Chaîne de Parcours Semantique (Alignement PIT)
      </h4>
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <p className="text-xs text-muted italic text-center py-4">Aucun parcours d'alignement détecté.</p>
        ) : (
          challenges.slice(0, 2).map((ch: any, idx: number) => {
            const cap = capabilities[idx] || { id: 1, name: "Diagnostic d'opportunités numériques" };
            const svc = services[idx] || { id: 1, name: "Audit de maturité IA", code: "S-IA-AUD" };
            const jry = journeys[idx] || { id: 1, name: "Parcours Transition Numérique", provider: "BioWin" };

            return (
              <div key={ch.id} className="p-4 bg-glass/5 border border-muted/10 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/25 uppercase text-[8px] font-bold">
                    Axe d'alignement #{idx + 1}
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-xs font-semibold text-text">
                  {/* Challenge */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex-1 w-full text-center">
                    <span className="text-[8px] font-bold text-muted uppercase block mb-1">Challenge</span>
                    <span className="text-indigo-650">{ch.name}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted hidden md:block shrink-0" />

                  {/* Capability */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex-1 w-full text-center cursor-pointer hover:border-teal-500/30" onClick={() => window.location.href = `/capabilities?id=${cap.id}`}>
                    <span className="text-[8px] font-bold text-muted uppercase block mb-1">Capability</span>
                    <span className="text-teal-650">{cap.name}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted hidden md:block shrink-0" />

                  {/* Service */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex-1 w-full text-center cursor-pointer hover:border-emerald-500/30" onClick={() => window.location.href = `/services?id=${svc.id}`}>
                    <span className="text-[8px] font-bold text-muted uppercase block mb-1">Service</span>
                    <span className="text-emerald-650 font-bold">{svc.name}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted hidden md:block shrink-0" />

                  {/* Journey */}
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex-1 w-full text-center cursor-pointer hover:border-amber-500/30" onClick={() => window.location.href = `/journeys?id=${jry.id}`}>
                    <span className="text-[8px] font-bold text-muted uppercase block mb-1">Journey</span>
                    <span className="text-amber-600">{jry.name}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted hidden md:block shrink-0" />

                  {/* Beneficiary */}
                  <div className="p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 flex-1 w-full text-center">
                    <span className="text-[8px] font-bold text-teal-650 uppercase block mb-1">Bénéficiaire</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">{bene.name}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // New Program & Project Tab
  const projectsContent = (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Hiérarchie d'Exécution : Programme ➔ Projet ➔ Action ➔ Activité
      </h4>
      <div className="space-y-4">
        {programs.length === 0 ? (
          <p className="text-xs text-muted italic text-center py-4">Aucun projet ou programme d'innovation rattaché.</p>
        ) : (
          programs.map((prog: any, idx: number) => {
            const proj = projects[idx] || { id: 1, name: "Digitalisation Agroalimentaire" };
            return (
              <div key={prog.id} className="border border-muted/15 rounded-2xl overflow-hidden bg-glass/5 p-4 space-y-3.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-teal-650" />
                    <span className="text-xs font-bold text-text">{prog.name}</span>
                  </div>
                  <Badge className="bg-teal-500/10 text-teal-600 border-teal-500/25 uppercase text-[9px] font-bold">
                    Programme Porteur
                  </Badge>
                </div>

                <div className="pl-6 border-l-2 border-l-teal-600 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <FolderGit className="h-4 w-4 text-indigo-500" />
                      <span>{proj.name}</span>
                    </div>
                    <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/25 uppercase text-[8px] font-bold">
                      Projet Relie
                    </Badge>
                  </div>

                  <div className="pl-6 border-l-2 border-l-indigo-500 space-y-2">
                    <div className="flex justify-between items-center text-[11px] bg-white dark:bg-gray-800 p-2 rounded-xl border border-muted/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Action : Déploiement des capteurs IoT</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 uppercase text-[8px] font-bold">Terminé</Badge>
                    </div>

                    <div className="pl-6 border-l-2 border-l-emerald-500 text-[10px] text-muted space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-muted" />
                        <span>Activité : Installation matérielle (12 ETP)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const impactContent = (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
        Impact & Diagnostics du Bénéficiaire
      </h4>
      <PITImpactPanel data={contributionsData} />
    </div>
  );

  const metadataContent = (
    <div className="space-y-4 text-xs font-semibold text-text">
      <div className="bg-glass/10 p-3 rounded-xl border border-muted/10 space-y-1">
        <span className="text-[9px] font-bold text-muted uppercase block">URI sémantique</span>
        <span className="font-mono text-[10px] break-all select-all block text-teal-650 dark:text-teal-400">
          {bene.uri || `https://pit.wallonie.be/id/beneficiary/${bene.id}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">ID Prisma</span>
          <span className="font-mono">{bene.id}</span>
        </div>
        <div className="bg-glass/10 p-3 rounded-xl border border-muted/10">
          <span className="text-[9px] font-bold text-muted uppercase block">Province</span>
          <span>{bene.province || "N/A"}</span>
        </div>
      </div>
    </div>
  );

  const combinedContributionsContent = (
    <div className="space-y-6">
      {projectsContent}
      <div className="pt-4 border-t border-muted/10">
        {impactContent}
      </div>
    </div>
  );

  return (
    <PITDetailLayout
      title={bene.name}
      subtitle={`${bene.size} — Arrondissement de ${bene.arrondissement || "Namur"}`}
      badge={
        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-650 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
          {bene.bce || "BENEFICIARY"}
        </span>
      }
      actions={
        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-[11px] font-bold">
          Fermer
        </Button>
      }
      overviewTab={overviewContent}
      relationsTab={relationsContent}
      impactTab={pathwayContent}
      contributionsTab={combinedContributionsContent}
      metadataTab={metadataContent}
      overviewLabel="Vue d'ensemble"
      relationsLabel="Taxonomies & NACE"
      impactLabel="Parcours PIT"
      contributionsLabel="Programmes, Projets & Impact"
      metadataLabel="Identité"
    />
  );
}
