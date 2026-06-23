// src/app/programs/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Layers, 
  Building2, 
  MapPin, 
  Shield, 
  Zap, 
  ArrowLeft, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  FolderOpen,
  Play,
  Activity,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import PITLayout from "@/design-system/PITLayout";
import PITStatCard from "@/design-system/PITStatCard";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ProgramDetailPage() {
  const params = useParams();
  const idStr = params.id as string;
  const id = idStr ? parseInt(idStr) : null;

  // 1. Fetch Program Detail (includes mitigatedVulnerabilities)
  const { data: programRes, isLoading: isProgLoading } = useQuery({
    queryKey: ["v2-program-detail", id],
    queryFn: () => fetcher(`/api/v2/programs/${id}`),
    enabled: id !== null && !isNaN(id),
  });
  const program = programRes?.data;

  // 2. Fetch Contributions / Nested entities (services, projects, beneficiaries, etc.)
  const { data: contributionsRes, isLoading: isContribLoading } = useQuery({
    queryKey: ["v2-program-contributions", id],
    queryFn: () => fetcher(`/api/v2/programs/${id}/contributions`),
    enabled: id !== null && !isNaN(id),
  });

  const services = contributionsRes?.services || [];
  const projects = contributionsRes?.projects || [];
  const beneficiaries = contributionsRes?.beneficiaries || [];
  const ecosystems = contributionsRes?.ecosystems || [];

  const formatBudget = (value?: number | null) => {
    if (value === undefined || value === null) return "Non spécifié";
    return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case "CRITICAL":
      case "CRITIQUE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "HIGH":
      case "HAUT":
      case "ÉLEVÉ":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "MEDIUM":
      case "MOYEN":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      default:
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
    }
  };

  if (isProgLoading || isContribLoading) {
    return (
      <PITLayout
        category="GOUVERNANCE PROGRAMME"
        title="Chargement..."
        description="Récupération des données d'alignement stratégique..."
        pageIcon={Layers}
        breadcrumb={[{ label: "Programmes", href: "/programs" }, { label: "Détails" }]}
      >
        <div className="text-center py-20 text-muted font-bold text-xs">
          Chargement du cockpit de pilotage du programme...
        </div>
      </PITLayout>
    );
  }

  if (!program) {
    return (
      <PITLayout
        category="GOUVERNANCE PROGRAMME"
        title="Erreur"
        description="Impossible de charger le programme."
        pageIcon={Layers}
        breadcrumb={[{ label: "Programmes", href: "/programs" }]}
      >
        <div className="text-center py-20 text-rose-500 font-bold text-xs">
          Ce programme n'existe pas ou a été archivé.
        </div>
      </PITLayout>
    );
  }

  return (
    <PITLayout
      category="PILOTAGE & ALIGNEMENT S3"
      title={`Cockpit Programme : ${program.name}`}
      description="Visualisation des alignements stratégiques S3, des vulnérabilités régionales atténuées et des maillons d'innovation."
      pageIcon={Layers}
      breadcrumb={[{ label: "Programmes", href: "/programs" }, { label: program.code || `Prog #${program.id}` }]}
    >
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link 
          href="/programs"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-text font-bold transition-all w-max cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux programmes
        </Link>

        {/* 1. Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <PITStatCard
            label="Budget alloué"
            value={program.budget ? `${(program.budget / 1000000).toFixed(1)}M€` : "N/A"}
            icon={DollarSign}
            themeColor="teal"
            description={formatBudget(program.budget)}
          />

          <PITStatCard
            label="Statut"
            value={program.status === "ACTIVE" ? "Actif" : program.status === "COMPLETED" ? "Terminé" : "Planifié"}
            icon={CheckCircle}
            themeColor="indigo"
            description="Exécution Régionale"
          />

          <PITStatCard
            label="Vulnérabilités Atténuées"
            value={program.mitigatedVulnerabilities?.length || 0}
            icon={Shield}
            themeColor="amber"
            description="Liaisons de mitigation directes"
          />

          <PITStatCard
            label="Services Associés"
            value={services.length}
            icon={Zap}
            themeColor="emerald"
            description="Services CPSV-AP actifs"
          />
        </div>

        {/* 2. Split layout Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Info & Vulnerabilities (2 cols width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">
                Fiche d'identité
              </h3>
              <p className="text-xs text-text leading-relaxed">
                {program.description || "Aucune description détaillée n'est renseignée pour ce programme."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted block">Lead Operator</span>
                  <div className="flex items-center gap-1.5 font-bold text-text">
                    <Building2 className="h-4 w-4 text-teal-650 shrink-0" />
                    <span>{program.ownerOrganization?.name || "SPW Économie, Emploi, Recherche"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted block">Code Programme</span>
                  <Badge className="font-mono text-[9px] font-black bg-muted/15 text-muted uppercase">
                    {program.code || `PROG-${program.id}`}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Mitigated Vulnerabilities (OECD-aligned) */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-text tracking-wider border-b border-muted/10 pb-2 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-rose-500" />
                Vulnérabilités Atténuées par ce Programme ({program.mitigatedVulnerabilities?.length || 0})
              </h3>

              {(!program.mitigatedVulnerabilities || program.mitigatedVulnerabilities.length === 0) ? (
                <div className="text-center py-6 text-muted text-xs italic">
                  Aucune vulnérabilité territoriale n'est formellement atténuée par ce programme.
                </div>
              ) : (
                <div className="space-y-3">
                  {program.mitigatedVulnerabilities.map((v: any) => (
                    <div key={v.id} className="p-4 rounded-xl border border-muted/10 bg-glass/25 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono bg-muted/10 text-muted px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                            {v.code}
                          </span>
                          <h4 className="font-extrabold text-xs text-text mt-1">{v.name}</h4>
                        </div>
                        <Badge className={`text-[8px] font-black ${getSeverityBadgeColor(v.severity)}`}>
                          {v.severity}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        {v.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-muted/10 pt-2 text-[10px] font-bold text-muted mt-1">
                        <div>Score de Criticité : <strong className="text-text">{v.criticalityScore}/100</strong></div>
                        <Link 
                          href="/vulnerabilities"
                          className="text-teal-605 hover:underline flex items-center gap-0.5"
                        >
                          Voir dans le Cockpit Vulnérabilités
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects list hierarchy */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2 flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4 text-indigo-500" />
                Hiérarchie des Projets ({projects.length})
              </h3>

              {projects.length === 0 ? (
                <div className="text-center py-6 text-muted text-xs italic">
                  Aucun projet de recherche ou collaboration active sous ce programme.
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((p: any) => (
                    <div key={p.id} className="p-3 bg-glass/10 border border-muted/10 rounded-xl text-xs flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-muted font-bold block uppercase">{p.code || 'PROJ'}</span>
                        <span className="font-bold text-text">{p.name}</span>
                      </div>
                      <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-black uppercase text-[9px]">
                        {p.status || 'ACTIVE'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Services & S3 Domains (1 col width) */}
          <div className="space-y-6">
            
            {/* S3 Alignments & Ecosystems */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">
                Spécialisation Intelligente (S3)
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-muted block uppercase">Domaines Technologiques</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="bg-teal-500/10 text-teal-600 border border-teal-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
                      S3: Transition Industrielle
                    </Badge>
                    <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/25 font-bold uppercase text-[9px] px-2 py-0.5">
                      DR-BEST: TECHNOLOGY (T)
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-muted/10 pt-3">
                  <span className="text-[10px] font-black text-muted block uppercase">Écosystèmes Mobilisés ({ecosystems.length})</span>
                  {ecosystems.length === 0 ? (
                    <span className="text-xs text-muted italic">Aucun pôle ou cluster lié</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {ecosystems.map((eco: any) => (
                        <span key={eco.id} className="px-2 py-0.5 bg-glass border border-muted/20 rounded text-[10px] font-extrabold text-text">
                          {eco.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Public Service Outcomes */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/25 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase text-text tracking-wider border-b border-muted/10 pb-2 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-500" />
                Services Deployés (CPSV-AP)
              </h3>

              {services.length === 0 ? (
                <div className="text-center py-6 text-muted text-xs italic">
                  Aucun service public n'est actif sous ce programme.
                </div>
              ) : (
                <div className="space-y-2">
                  {services.map((s: any) => (
                    <div key={s.id} className="p-3 bg-glass/10 border border-muted/15 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-text leading-tight">{s.name}</span>
                      </div>
                      {s.organization && (
                        <span className="text-[9px] text-muted font-bold block uppercase">
                          Fourni par : {s.organization.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </PITLayout>
  );
}
