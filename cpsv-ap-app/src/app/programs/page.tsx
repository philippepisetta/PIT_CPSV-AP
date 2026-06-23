// src/app/programs/page.tsx
"use client";

import React from "react";
import { 
  Layers, 
  Search, 
  Building2, 
  MapPin, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import PITLayout from "@/design-system/PITLayout";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ProgramsPage() {
  // Fetch programs list
  const { data: programsRes, isLoading } = useQuery({
    queryKey: ["v2-programs-list"],
    queryFn: () => fetcher("/api/v2/programs"),
    staleTime: 30 * 1000,
  });

  const programs = programsRes?.data || [];

  const formatBudget = (value?: number | null) => {
    if (value === undefined || value === null) return "Non spécifié";
    return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "ACTIF":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
      case "COMPLETED":
      case "TERMINÉ":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <PITLayout
      category="GOUVERNANCE & POLITIQUES PUBLIQUES"
      title="Cockpit des Programmes Régionaux"
      description="Supervisez les programmes régionaux, les budgets alloués et cartographiez leur efficacité face aux vulnérabilités industrielles."
      pageIcon={Layers}
      breadcrumb={[{ label: "Programmes" }]}
    >
      <div className="space-y-6">

        {/* 1. Header metrics / introduction */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-glass border border-muted/20 bg-glass/20 p-5 rounded-2xl gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-605 uppercase">Programmes Publics (S3 & Wallonie)</span>
            <h3 className="font-extrabold text-sm text-text leading-tight">Gouvernance Stratégique</h3>
          </div>
          <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded font-black">
            Total : {programs.length} Programmes Enregistrés
          </span>
        </div>

        {/* 2. Programs grid list */}
        {isLoading ? (
          <div className="text-center py-20 text-muted font-bold text-xs">
            Chargement du Cockpit Programmes...
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 text-muted text-xs italic">
            Aucun programme n'est répertorié dans la base de données.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {programs.map((p: any) => (
              <div 
                key={p.id}
                className="bg-surface border border-muted/20 bg-glass/25 hover:border-teal-500/40 p-5 rounded-2xl transition-all flex flex-col justify-between shadow-xs group"
              >
                <div className="space-y-3.5">
                  
                  {/* Top line: Code and Status */}
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono bg-muted/15 text-muted px-2 py-0.5 rounded font-black uppercase">
                      {p.code || `PROG-${p.id}`}
                    </span>
                    <Badge className={`text-[8px] font-black ${getStatusBadgeColor(p.status)}`}>
                      {p.status === "ACTIVE" ? "Actif" : p.status === "COMPLETED" ? "Terminé" : "Planifié"}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-text leading-tight group-hover:text-teal-650 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-muted line-clamp-3 leading-relaxed">
                      {p.description || "Aucune description fournie pour ce programme."}
                    </p>
                  </div>

                  {/* Program stats */}
                  <div className="grid grid-cols-2 gap-3 border-t border-muted/10 pt-3 text-[10px] font-extrabold text-muted">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-teal-650 shrink-0" />
                      <span>Budget : <strong className="text-text">{formatBudget(p.budget)}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-teal-650 shrink-0" />
                      <span>Porteur : <strong className="text-text">{p.ownerOrganization?.name || "SPW"}</strong></span>
                    </div>
                  </div>

                </div>

                {/* Card Action Link */}
                <div className="border-t border-muted/10 pt-3 mt-4 flex justify-between items-center text-[10px] font-black text-muted">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Vulnérabilités Atténuées : <strong className="text-text">{p.mitigatedVulnerabilities?.length || 0}</strong></span>
                  </div>

                  <Link 
                    href={`/programs/${p.id}`}
                    className="flex items-center gap-1 text-teal-605 group-hover:text-teal-600 transition-colors font-black uppercase text-[10px]"
                  >
                    Ouvrir Cockpit
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PITLayout>
  );
}
