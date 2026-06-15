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
  CheckCircle2,
  Network,
  Clock,
  Coins,
  ArrowDown
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
  useV2Beneficiaries, 
  useV2BeneficiaryDetail,
  useV2BeneficiaryJourneys,
  useV2BeneficiaryServices,
  useV2BeneficiaryPrograms,
  useV2BeneficiaryProjects,
  useV2Contributions,
  useV2BeneficiaryActivities,
  useV2BeneficiaryFinancements,
  useV2BeneficiaryOutcomes
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
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
                        BCE
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
      category="PORTFOLIO DE L'ACCOMPAGNATEUR"
      title="Beneficiary 360 Workspace"
      description="Analysez la fiche d'identité sémantique consolidée, les diagnostics BCE/DMAT, le lignage stratégique complet et l'historique d'accompagnement des entreprises."
      pageIcon={Users}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Bénéficiaires" }]}
    >
      {isBeneError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300 rounded-xl flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            ⚠️
          </span>
          <div>
            <p className="font-bold">API v2 Hors Ligne</p>
            <p className="text-[11px] text-muted-foreground font-normal mt-0.5">
              Le service d'API v2 n'est pas disponible.
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

  // New sub-resource queries
  const { data: activitiesRes } = useV2BeneficiaryActivities(id);
  const { data: financementsRes } = useV2BeneficiaryFinancements(id);
  const { data: outcomesRes } = useV2BeneficiaryOutcomes(id);

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
  const activities = activitiesRes?.data || [];
  const financements = financementsRes?.data || [];
  const outcomes = outcomesRes?.data || [];

  const challenges = contributionsData?.challenges || [];
  const capabilities = contributionsData?.capabilities || [];

  // Provenance tag component helper
  const ProvenanceTag = ({ source }: { source: string }) => (
    <span className="text-[8px] font-black tracking-widest text-teal-605 bg-teal-500/10 border border-teal-500/20 rounded-md px-1.5 py-0.2 uppercase select-none">
      Source: {source}
    </span>
  );

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
        <div className="bg-glass/5 border border-muted/10 p-3.5 rounded-xl space-y-1 relative">
          <div className="absolute top-2 right-2">
            <ProvenanceTag source="BCE" />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Données Administratives</span>
          <p>Localisation : <span className="font-bold">{bene.location} ({bene.province})</span></p>
          <p>N BCE : <span className="font-mono">{bene.bce || "Non spécifié"}</span></p>
        </div>
        <div className="bg-glass/5 border border-muted/10 p-3.5 rounded-xl space-y-1 relative">
          <div className="absolute top-2 right-2">
            <ProvenanceTag source="BCE" />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Métrique d'Affaires</span>
          <p>Taille : <span className="font-bold">{bene.size || "PME"}</span></p>
          <p>Effectif : <span className="font-bold">{bene.employees || "—"} ETP</span></p>
        </div>
      </div>

      {bene.demand && (
        <div className="space-y-1 bg-glass/5 border border-muted/10 p-3.5 rounded-xl text-xs relative">
          <div className="absolute top-2 right-2">
            <ProvenanceTag source="EDIH" />
          </div>
          <span className="text-[9px] font-bold text-muted uppercase block">Problématique / Demande initiale</span>
          <p className="italic leading-relaxed">"{bene.demand}"</p>
        </div>
      )}

      {/* Maturities sliders/progress */}
      <div className="space-y-3.5 pt-4 border-t border-muted/10">
        <span className="text-[10px] font-black uppercase text-muted tracking-wider block">Diagnostics de maturité (Modèles Fédérés)</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            { label: "Maturité Numérique", value: bene.maturityDigital || 2, color: "bg-teal-500", source: "DMAT" },
            { label: "Maturité IA", value: bene.maturityIa || 1, color: "bg-purple-500", source: "DMAT" },
            { label: "Maturité Cybersécurité", value: bene.maturityCyber || 2, color: "bg-rose-500", source: "DMAT" },
            { label: "Maturité Export", value: bene.maturityExport || 1, color: "bg-amber-500", source: "AWEX" },
            { label: "Maturité Durable / S3", value: bene.maturityDurability || 2, color: "bg-emerald-500", source: "DMAT" }
          ].map((item, idx) => (
            <div key={idx} className="bg-glass/5 border border-muted/10 p-3 rounded-xl space-y-1.5 text-xs relative">
              <div className="absolute top-2 right-2">
                <ProvenanceTag source={item.source} />
              </div>
              <div className="flex justify-between items-center font-bold pr-16">
                <span>{item.label}</span>
                <span className="text-teal-655">{item.value}/5</span>
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
        }
      ]}
    />
  );

  // Timeline 360° Tab (Chronological)
  const timelineContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-muted/10 pb-2">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Timeline 360° des Interactions Historiques
        </h4>
        <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded border border-teal-500/20">
          Chronologique
        </span>
      </div>

      <div className="relative border-l border-muted/30 ml-4 pl-6 space-y-6">
        {activities.length === 0 && services.length === 0 && financements.length === 0 && projects.length === 0 ? (
          <p className="text-xs text-muted italic text-center py-4">Aucune interaction chronologique enregistrée.</p>
        ) : (
          [
            ...(activities || []).map((a: any) => ({ type: "activity", date: a.date ? new Date(a.date) : new Date(), label: a.title || a.notes, extra: a.activityType, source: a.operator?.name?.includes("AWEX") ? "AWEX" : "EDIH" })),
            ...(services || []).map((s: any) => ({ type: "service", date: s.createdAt ? new Date(s.createdAt) : new Date(), label: s.name, extra: s.code, source: "EDIH" })),
            ...(financements || []).map((f: any) => ({ type: "funding", date: f.createdAt ? new Date(f.createdAt) : new Date(), label: f.name, extra: f.type, source: "WE" })),
            ...(projects || []).map((p: any) => ({ type: "project", date: p.startDate ? new Date(p.startDate) : new Date(), label: p.name, extra: p.status, source: "PIT" }))
          ]
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())
          .map((item, idx) => (
            <div key={idx} className="relative space-y-1">
              {/* Dot */}
              <div className="absolute -left-9 top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white dark:border-gray-800" />
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted">{item.date.toLocaleDateString()}</span>
                <Badge className={`uppercase text-[8px] font-bold ${
                  item.type === "activity" ? "bg-indigo-500/15 text-indigo-600" :
                  item.type === "service" ? "bg-teal-500/15 text-teal-650" :
                  item.type === "funding" ? "bg-emerald-500/15 text-emerald-600" :
                  "bg-amber-500/15 text-amber-600"
                }`}>
                  {item.type}
                </Badge>
                <ProvenanceTag source={item.source} />
              </div>

              <p className="text-xs font-bold text-text leading-tight">{item.label}</p>
              <p className="text-[10px] text-muted font-semibold leading-none">{item.extra}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Lignage 360° Tab (Vertical cascade)
  const lineage360Content = (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-muted/10 pb-2">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">
          Cascade de Lignage Sémantique 360° (PIT Architecture)
        </h4>
        <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">
          Lineage Trace
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 text-center max-w-xl mx-auto">
        {/* 1. Entreprise */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">1. Entreprise (Bénéficiaire)</span>
            <ProvenanceTag source="BCE" />
          </div>
          <span className="text-xs font-bold text-text">{bene.name}</span>
        </div>

        <ArrowDown className="h-4 w-4 text-muted animate-pulse" />

        {/* 2. Défis */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">2. Défis d&apos;affaires</span>
            <ProvenanceTag source="PIT" />
          </div>
          {challenges.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {challenges.map((c: any) => (
                <span key={c.id} className="text-[10px] font-bold text-indigo-650 bg-indigo-500/10 px-2 py-0.5 rounded">{c.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun défi</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 3. Parcours */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">3. Parcours (Journeys)</span>
            <ProvenanceTag source="PIT" />
          </div>
          {journeys.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {journeys.map((j: any) => (
                <span key={j.id} className="text-[10px] font-bold text-teal-650 bg-teal-500/10 px-2 py-0.5 rounded">{j.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun parcours</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 4. Services */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">4. Services sémantiques reçus</span>
            <ProvenanceTag source="EDIH" />
          </div>
          {services.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {services.map((s: any) => (
                <span key={s.id} className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">{s.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun service</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 5. Activités */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">5. Activités d&apos;Animation</span>
            <ProvenanceTag source="EDIH/AWEX" />
          </div>
          {activities.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {activities.map((a: any) => (
                <span key={a.id} className="text-[10px] font-bold text-purple-650 bg-purple-500/10 px-2 py-0.5 rounded truncate max-w-[200px]">{a.title || a.notes}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucune activité</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 6. Financements */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">6. Financements octroyés</span>
            <ProvenanceTag source="WE" />
          </div>
          {financements.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {financements.map((f: any) => (
                <span key={f.id} className="text-[10px] font-bold text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Coins className="h-3 w-3" /> {f.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun financement</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 7. Projets */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">7. Projets R&D / Innovation</span>
            <ProvenanceTag source="PIT" />
          </div>
          {projects.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {projects.map((p: any) => (
                <span key={p.id} className="text-[10px] font-bold text-blue-650 bg-blue-500/10 px-2 py-0.5 rounded">{p.name}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun projet</span>
          )}
        </div>

        <ArrowDown className="h-4 w-4 text-muted" />

        {/* 8. Outcomes */}
        <div className="p-3 bg-glass/35 border border-muted/20 rounded-xl w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase text-muted">8. Résultats réels (Outcomes & Impacts)</span>
            <ProvenanceTag source="PIT" />
          </div>
          {outcomes.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {outcomes.map((o: any) => (
                <span key={o.id} className="text-[10px] font-bold text-rose-650 bg-rose-500/10 px-2 py-0.5 rounded">{o.name || o.textValue}</span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-muted italic">Aucun outcome mesuré</span>
          )}
        </div>
      </div>
    </div>
  );

  const combinedContributionsContent = (
    <div className="space-y-6">
      {/* Projects cascade */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Hiérarchie d&apos;Exécution : Programme ➔ Projet ➔ Action ➔ Activité
        </h4>
        <div className="space-y-4">
          {programs.length === 0 ? (
            <p className="text-xs text-muted italic text-center py-4">Aucun projet ou programme d&apos;innovation rattaché.</p>
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
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Action : Déploiement des capteurs IoT</span>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 uppercase text-[8px] font-bold">Terminé</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-muted/10">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider pb-1 border-b border-muted/10">
          Impact & Diagnostics du Bénéficiaire
        </h4>
        <PITImpactPanel data={contributionsData} />
      </div>
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

  return (
    <PITDetailLayout
      title={bene.name}
      subtitle={`${bene.size} — Arrondissement de ${bene.arrondissement || "Namur"}`}
      badge={
        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-655 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
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
      impactTab={lineage360Content}
      contributionsTab={combinedContributionsContent}
      metadataTab={timelineContent}
      overviewLabel="Vue d'ensemble"
      relationsLabel="Taxonomies & NACE"
      impactLabel="Lignage 360°"
      contributionsLabel="Programmes, Projets & Impact"
      metadataLabel="Timeline 360°"
    />
  );
}
