// src/app/members/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Users, Search, Building, MapPin, BarChart2 } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { useV2MembersQuery } from "@/hooks/usePITQueries";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const { data: membersRes, isLoading } = useV2MembersQuery();
  const members = membersRes?.data || [];

  // Filter members
  const filtered = useMemo(() => {
    return members.filter((m: any) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                            m.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || m.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [members, search, filterType]);

  const stats = useMemo(() => {
    return {
      total: members.length,
      companies: members.filter((m: any) => m.type === "Entreprise").length,
      uni: members.filter((m: any) => m.type === "Université" || m.type === "Centre de recherche").length,
      others: members.filter((m: any) => m.type !== "Entreprise" && m.type !== "Université" && m.type !== "Centre de recherche").length,
    };
  }, [members]);

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Répertoire des Membres"
      description="Consultez et filtrez tous les acteurs enregistrés dans l'écosystème de compétitivité wallon."
      pageIcon={Users}
      breadcrumb={[{ label: "Membres" }]}
    >
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 w-full mb-6">
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-muted">Total Acteurs</span>
          <span className="text-xl font-black text-text block">{stats.total}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-teal-605">Entreprises / PME</span>
          <span className="text-xl font-black text-teal-605 block">{stats.companies}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-indigo-500">R&D / Universités</span>
          <span className="text-xl font-black text-indigo-500 block">{stats.uni}</span>
        </div>
        <div className="bg-glass p-4 rounded-xl border border-muted/10">
          <span className="text-[10px] font-black uppercase text-amber-500">Autres Acteurs</span>
          <span className="text-xl font-black text-amber-500 block">{stats.others}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Rechercher par nom ou localisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-glass border border-muted/30 rounded-xl text-xs font-bold text-text focus:outline-none focus:border-teal-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text cursor-pointer focus:outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="Entreprise">Entreprises</option>
            <option value="Université">Universités</option>
            <option value="Centre de recherche">Centres de recherche</option>
            <option value="Expert">Experts</option>
            <option value="Institution publique">Institutions publiques</option>
          </select>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl border border-muted/10 bg-glass/30 hover:shadow-md transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-xs text-text">{m.name}</h3>
                    <span className="text-[9px] font-bold text-muted uppercase">{m.type}</span>
                  </div>
                  <Building className="h-4 w-4 text-teal-650" />
                </div>
                
                <div className="space-y-1 text-[10px] text-muted">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{m.location}</span>
                  </div>
                  {m.nace && <div>NACE: <span className="font-mono">{m.nace}</span></div>}
                </div>

                {/* Maturities */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-muted/10 text-center text-[9px] font-bold">
                  <div className="bg-teal-500/10 text-teal-700 py-1 rounded">
                    Num: {m.digitalMaturity}/4
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-700 py-1 rounded">
                    IA: {m.iaMaturity}/4
                  </div>
                  <div className="bg-rose-500/10 text-rose-700 py-1 rounded">
                    Cyber: {m.cyberMaturity}/4
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PITLayout>
  );
}
