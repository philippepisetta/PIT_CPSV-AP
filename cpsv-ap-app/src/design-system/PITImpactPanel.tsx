// src/design-system/PITImpactPanel.tsx
"use client";

import React, { useState } from "react";
import {
  Users,
  Building,
  MapPin,
  Compass,
  Award,
  Lightbulb,
  Database,
  Activity,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Shield,
  Percent,
  CheckCircle,
  FileText
} from "lucide-react";
import PITStatCard from "./PITStatCard";

interface ContributionsResponse {
  services: any[];
  capabilities: any[];
  challenges: any[];
  journeys: any[];
  beneficiaries: any[];
  organizations: any[];
  territories: any[];
  ecosystems: any[];
  programs: any[];
  projects: any[];
  
  metadata: {
    organizationImpact: {
      total: number;
      byRole: {
        operator: any[];
        partner: any[];
        funder: any[];
        beneficiary: any[];
        cluster: any[];
        pole: any[];
        researchCenter: any[];
        administration: any[];
        incubator: any[];
        accelerator: any[];
      };
    };
    territoryImpact: {
      total: number;
      byScale: {
        europe: any[];
        country: any[];
        region: any[];
        province: any[];
        arrondissement: any[];
        commune: any[];
        bassin: any[];
        sciencePark: any[];
        activityZone: any[];
      };
    };
    drbestImpact: {
      data: { score: number; weight: number; count: number };
      remote: { score: number; weight: number; count: number };
      business: { score: number; weight: number; count: number };
      ecosystem: { score: number; weight: number; count: number };
      skills: { score: number; weight: number; count: number };
      technology: { score: number; weight: number; count: number };
    };
    s3Alignment: {
      domains: { id: number; name: string; code?: string; count: number }[];
      valueChains: { id: number; name: string; code?: string; count: number }[];
      stages: { id: number; name: string; code?: string; count: number }[];
    };
    beneficiaryImpact: {
      total: number;
      bySize: {
        independant: number;
        tpe: number;
        pme: number;
        eti: number;
        grande: number;
      };
      bySector: {
        nace: Record<string, number>;
        adn: Record<string, number>;
        s3: Record<string, number>;
      };
      byProvince: Record<string, number>;
    };
    assessmentReadiness: {
      assessmentStatus: "planned" | "active" | "completed";
      framework: string | null;
      questionnaire: string | null;
      benchmark: string | null;
      score: number | null;
      maturity: string | null;
    };
    innovationReadiness: {
      trl: number | null;
      irl: number | null;
      mrl: number | null;
      status: "planned" | "active" | "completed";
    };
    dataGovernance: {
      fairScore: number | null;
      qualityScore: number | null;
      completeness: number | null;
      status: "planned" | "active" | "completed";
    };
    maturityIndicators: {
      digital?: number | null;
      data?: number | null;
      ai?: number | null;
      cybersecurity?: number | null;
      status?: "planned" | "active" | "completed";
    };
  };
}

interface PITImpactPanelProps {
  data: ContributionsResponse | null | undefined;
}

export default function PITImpactPanel({ data }: PITImpactPanelProps) {
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    beneficiaries: true,
    organizations: false,
    territories: false,
    drbest: true,
    s3: true,
    innovation: false,
    governance: true,
    maturity: true,
    assessment: false
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-muted border border-muted/10 border-dashed rounded-2xl bg-white/50 dark:bg-gray-800/30">
        <Activity className="h-8 w-8 text-teal-500 animate-pulse mb-3" />
        <p className="font-semibold">Chargement des données d'impact...</p>
      </div>
    );
  }

  const { metadata } = data;
  if (!metadata) {
    return (
      <div className="text-center py-8 text-xs text-muted italic border border-muted/10 border-dashed rounded-xl">
        Aucune donnée d'impact ou de contribution n'est disponible.
      </div>
    );
  }

  const getMaturityDots = (val: number | null | undefined) => {
    const value = val || 1;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((idx) => (
          <span
            key={idx}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              idx <= value
                ? "bg-teal-500 shadow-sm shadow-teal-500/20"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. KPIs Génériques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PITStatCard
          label="Bénéficiaires Impactés"
          value={metadata.beneficiaryImpact?.total || 0}
          icon={Users}
          themeColor="teal"
          description="Entreprises accompagnées"
        />
        <PITStatCard
          label="Acteurs Mobilisés"
          value={metadata.organizationImpact?.total || 0}
          icon={Building}
          themeColor="purple"
          description="Opérateurs & partenaires"
        />
        <PITStatCard
          label="Territoires Couverts"
          value={metadata.territoryImpact?.total || 0}
          icon={MapPin}
          themeColor="indigo"
          description="Échelles géographiques"
        />
        <PITStatCard
          label="Services & Projets"
          value={(data.services?.length || 0) + (data.projects?.length || 0)}
          icon={Compass}
          themeColor="blue"
          description="Dispositifs d'accompagnement"
        />
      </div>

      {/* Accordion Panels */}

      {/* A. BENEFICIARY IMPACT */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("beneficiaries")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Users className="h-4.5 w-4.5 text-teal-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              1. Beneficiary Impact ({metadata.beneficiaryImpact?.total || 0})
            </span>
          </div>
          {openSections.beneficiaries ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.beneficiaries && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Size breakdown */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                Répartition par Taille
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: "Indépendants", count: metadata.beneficiaryImpact?.bySize?.independant || 0 },
                  { label: "TPE (< 10 ETP)", count: metadata.beneficiaryImpact?.bySize?.tpe || 0 },
                  { label: "PME", count: metadata.beneficiaryImpact?.bySize?.pme || 0 },
                  { label: "ETI", count: metadata.beneficiaryImpact?.bySize?.eti || 0 },
                  { label: "Grande Entreprise", count: metadata.beneficiaryImpact?.bySize?.grande || 0 }
                ].map((item, idx) => {
                  const max = Math.max(
                    1,
                    metadata.beneficiaryImpact?.total || 1
                  );
                  const pct = Math.round((item.count / max) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-text">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sector breakdown */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                Secteurs d'Activité (Codes NACE)
              </h4>
              {Object.keys(metadata.beneficiaryImpact?.bySector?.nace || {}).length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {Object.entries(metadata.beneficiaryImpact.bySector.nace).map(([nace, count], idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-850/40 border border-gray-100/30 dark:border-gray-800/30 text-[11px]"
                    >
                      <span className="font-semibold text-text select-all">{nace}</span>
                      <span className="bg-teal-500/10 text-teal-650 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded">
                        {count} {count > 1 ? "bénéficiaires" : "bénéficiaire"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-muted italic">Aucun secteur répertorié</p>
              )}
            </div>

            {/* Geographical breakdown */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                Répartition Géographique
              </h4>
              {Object.keys(metadata.beneficiaryImpact?.byProvince || {}).length > 0 ? (
                <div className="space-y-2.5">
                  {Object.entries(metadata.beneficiaryImpact.byProvince).map(([province, count], idx) => {
                    const max = Math.max(1, metadata.beneficiaryImpact.total);
                    const pct = Math.round((count / max) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium text-text">
                          <span>{province}</span>
                          <span className="font-bold">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-muted italic">Aucune province spécifiée</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* B. ORGANIZATION IMPACT */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("organizations")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Building className="h-4.5 w-4.5 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              2. Organization Impact ({metadata.organizationImpact?.total || 0} acteurs)
            </span>
          </div>
          {openSections.organizations ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.organizations && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "Opérateurs", list: metadata.organizationImpact?.byRole?.operator || [] },
                { label: "Financeurs", list: metadata.organizationImpact?.byRole?.funder || [] },
                { label: "Partenaires", list: metadata.organizationImpact?.byRole?.partner || [] },
                { label: "Clusters", list: metadata.organizationImpact?.byRole?.cluster || [] },
                { label: "Pôles", list: metadata.organizationImpact?.byRole?.pole || [] },
                { label: "Recherche", list: metadata.organizationImpact?.byRole?.researchCenter || [] },
                { label: "Administration", list: metadata.organizationImpact?.byRole?.administration || [] },
                { label: "Incubateurs", list: metadata.organizationImpact?.byRole?.incubator || [] },
                { label: "Accélérateurs", list: metadata.organizationImpact?.byRole?.accelerator || [] }
              ].map((role, idx) => {
                if (role.list.length === 0) return null;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block select-none">
                      {role.label}
                    </span>
                    <span className="text-lg font-black text-text block">
                      {role.list.length}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar border border-gray-100 dark:border-gray-800 rounded-xl p-3 bg-gray-50/20">
              {data.organizations?.map((org: any, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] p-2 bg-white dark:bg-gray-900 border border-gray-100/50 dark:border-gray-850/50 rounded-lg shadow-sm">
                  <span className="font-semibold text-text select-all">{org.name}</span>
                  {org.type && (
                    <span className="bg-purple-500/10 text-purple-650 dark:text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                      {org.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* C. TERRITORY IMPACT */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("territories")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4.5 w-4.5 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              3. Territory Impact ({metadata.territoryImpact?.total || 0} échelles)
            </span>
          </div>
          {openSections.territories ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.territories && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              {[
                { label: "Régional", list: metadata.territoryImpact?.byScale?.region || [] },
                { label: "Provinces", list: metadata.territoryImpact?.byScale?.province || [] },
                { label: "Arrondissements", list: metadata.territoryImpact?.byScale?.arrondissement || [] },
                { label: "Communes", list: metadata.territoryImpact?.byScale?.commune || [] },
                { label: "Bassins Éco", list: metadata.territoryImpact?.byScale?.bassin || [] },
                { label: "Parcs/ZAE", list: metadata.territoryImpact?.byScale?.sciencePark || [] }
              ].map((scale, idx) => {
                if (scale.list.length === 0) return null;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block select-none mb-1">
                      {scale.label}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scale.list.map((t: any, tid: number) => (
                        <span key={tid} className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded-full select-all">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* D. DR-BEST CLASSIFICATION */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("drbest")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Award className="h-4.5 w-4.5 text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              4. DR-BEST Classification
            </span>
          </div>
          {openSections.drbest ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.drbest && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Data (D)", code: "D", data: metadata.drbestImpact?.data, color: "bg-teal-500" },
                { label: "Remote (R)", code: "R", data: metadata.drbestImpact?.remote, color: "bg-blue-500" },
                { label: "Business (B)", code: "B", data: metadata.drbestImpact?.business, color: "bg-emerald-500" },
                { label: "Ecosystem (E)", code: "E", data: metadata.drbestImpact?.ecosystem, color: "bg-amber-500" },
                { label: "Skills (S)", code: "S", data: metadata.drbestImpact?.skills, color: "bg-purple-500" },
                { label: "Technology (T)", code: "T", data: metadata.drbestImpact?.technology, color: "bg-rose-500" }
              ].map((item, idx) => {
                if (!item.data) return null;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-text">{item.label}</span>
                      <span className="text-muted">{item.data.count} services</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>Poids</span>
                      <span className="font-bold text-text">{item.data.weight}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.data.weight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* E. S3 ALIGNMENT */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("s3")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4.5 w-4.5 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              5. S3 Alignment
            </span>
          </div>
          {openSections.s3 ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.s3 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="space-y-4">
              {/* Domains */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                  Domaines S3
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metadata.s3Alignment?.domains?.map((d: any, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-650 dark:text-blue-400 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {d.code && <span className="font-bold select-none">{d.code} :</span>}
                      <span className="select-all">{d.name}</span>
                      <span className="bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold px-1 rounded-full text-[9px]">
                        {d.count}
                      </span>
                    </span>
                  ))}
                  {(!metadata.s3Alignment?.domains || metadata.s3Alignment.domains.length === 0) && (
                    <span className="text-[10px] text-muted italic">Aucun domaine S3 lié</span>
                  )}
                </div>
              </div>

              {/* Value Chains */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                  Chaînes de Valeur
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metadata.s3Alignment?.valueChains?.map((vc: any, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {vc.code && <span className="font-bold select-none">{vc.code} :</span>}
                      <span className="select-all">{vc.name}</span>
                      <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-1 rounded-full text-[9px]">
                        {vc.count}
                      </span>
                    </span>
                  ))}
                  {(!metadata.s3Alignment?.valueChains || metadata.s3Alignment.valueChains.length === 0) && (
                    <span className="text-[10px] text-muted italic">Aucune chaîne de valeur liée</span>
                  )}
                </div>
              </div>

              {/* Stages */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">
                  Maillons (Stages)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metadata.s3Alignment?.stages?.map((st: any, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-650 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {st.code && <span className="font-bold select-none">{st.code} :</span>}
                      <span className="select-all">{st.name}</span>
                      <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-1 rounded-full text-[9px]">
                        {st.count}
                      </span>
                    </span>
                  ))}
                  {(!metadata.s3Alignment?.stages || metadata.s3Alignment.stages.length === 0) && (
                    <span className="text-[10px] text-muted italic">Aucun maillon lié</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* F. INNOVATION READINESS */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("innovation")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Lightbulb className="h-4.5 w-4.5 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              6. Innovation Readiness (TRL / IRL / MRL)
            </span>
          </div>
          {openSections.innovation ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.innovation && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Technology Readiness Level (TRL)", val: metadata.innovationReadiness?.trl, max: 9, color: "bg-yellow-500", desc: "Maturité technologique" },
                { label: "Innovation Readiness Level (IRL)", val: metadata.innovationReadiness?.irl, max: 9, color: "bg-orange-500", desc: "Maturité commerciale/marché" },
                { label: "Manufacturing Readiness Level (MRL)", val: metadata.innovationReadiness?.mrl, max: 10, color: "bg-red-500", desc: "Maturité industrielle" }
              ].map((item, idx) => {
                const pct = item.val ? Math.round((item.val / item.max) * 100) : 0;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block select-none">
                      {item.label}
                    </span>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-2xl font-black text-text">{item.val || "-"}</span>
                      <span className="text-[10px] font-semibold text-muted">max {item.max}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted italic block select-none">
                      {item.desc}
                    </span>
                  </div>
                );
              })}
            </div>
            {metadata.innovationReadiness?.status && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-text bg-gray-50 dark:bg-gray-850/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Statut d'industrialisation :</span>
                <span className="font-bold uppercase bg-green-500/10 text-green-650 dark:text-green-400 px-1.5 py-0.5 rounded">
                  {metadata.innovationReadiness.status}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* G. DATA GOVERNANCE */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("governance")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Database className="h-4.5 w-4.5 text-teal-650 dark:text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              7. Data Governance & Qualité
            </span>
          </div>
          {openSections.governance ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.governance && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Score Principes FAIR", val: metadata.dataGovernance?.fairScore, color: "bg-teal-500", desc: "Findable, Accessible, Interoperable, Reusable" },
                { label: "Qualité de Données Globale", val: metadata.dataGovernance?.qualityScore, color: "bg-emerald-500", desc: "Exactitude, Intégrité et Validité" },
                { label: "Taux de Complétude", val: metadata.dataGovernance?.completeness, color: "bg-blue-500", desc: "Champs obligatoires renseignés" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block select-none">
                    {item.label}
                  </span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-2xl font-black text-text">{item.val !== null ? `${item.val}%` : "-"}</span>
                    <Percent className="h-3.5 w-3.5 text-muted/60" />
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.val || 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted italic block select-none">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* H. MATURITY INDICATORS */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("maturity")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BarChart2 className="h-4.5 w-4.5 text-purple-650 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              8. Maturity Indicators (Convergence PIT)
            </span>
          </div>
          {openSections.maturity ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.maturity && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Maturité Numérique", val: metadata.maturityIndicators?.digital, desc: "Processus & usages IT" },
                { label: "Maturité Données (Data)", val: metadata.maturityIndicators?.data, desc: "Gouvernance & valorisation" },
                { label: "Maturité IA (Artificial Intelligence)", val: metadata.maturityIndicators?.ai, desc: "Algorithmes & industrialisation" },
                { label: "Posture Cybersécurité", val: metadata.maturityIndicators?.cybersecurity, desc: "NIS2 & protections critiques" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850/30 border border-gray-100 dark:border-gray-800 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block select-none">
                    {item.label}
                  </span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xl font-black text-text">
                      {item.val !== null && item.val !== undefined ? `${item.val} / 5` : "-"}
                    </span>
                    {getMaturityDots(item.val)}
                  </div>
                  <span className="text-[10px] text-muted italic block select-none">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* I. ASSESSMENT READINESS */}
      <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm transition-all">
        <button
          onClick={() => toggleSection("assessment")}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-850/20 hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-4.5 w-4.5 text-blue-650 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text dark:text-gray-200">
              9. Assessment Readiness
            </span>
          </div>
          {openSections.assessment ? (
            <ChevronDown className="h-4 w-4 text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </button>

        {openSections.assessment && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-medium text-text">
              <div className="p-3 bg-gray-50 dark:bg-gray-850/30 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-[9px] uppercase tracking-wider text-muted block select-none">Framework Cible</span>
                <span className="font-bold select-all">{metadata.assessmentReadiness?.framework || "-"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-850/30 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-[9px] uppercase tracking-wider text-muted block select-none">Questionnaire</span>
                <span className="font-bold select-all">{metadata.assessmentReadiness?.questionnaire || "-"}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-850/30 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-[9px] uppercase tracking-wider text-muted block select-none">Benchmark Utilisé</span>
                <span className="font-bold select-all">{metadata.assessmentReadiness?.benchmark || "-"}</span>
              </div>
            </div>
            {metadata.assessmentReadiness?.score !== null && (
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-text bg-gray-50 dark:bg-gray-850/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  <span>Statut :</span>
                  <span className="font-bold uppercase bg-teal-500/10 text-teal-650 dark:text-teal-400 px-1.5 py-0.5 rounded">
                    {metadata.assessmentReadiness.assessmentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Score Moyen :</span>
                  <span className="font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                    {metadata.assessmentReadiness.score}%
                  </span>
                </div>
                {metadata.assessmentReadiness.maturity && (
                  <div className="flex items-center gap-1">
                    <span>Maturité :</span>
                    <span className="font-bold bg-purple-500/10 text-purple-650 dark:text-purple-400 px-1.5 py-0.5 rounded">
                      {metadata.assessmentReadiness.maturity}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
