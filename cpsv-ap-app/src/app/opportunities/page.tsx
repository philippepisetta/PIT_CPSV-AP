// src/app/opportunities/page.tsx
"use client";

import { FileCode, Search } from "lucide-react";
import { useState } from "react";
import PITLayout from "@/design-system/PITLayout";
import { useV2OpportunitiesQuery } from "@/hooks/usePITQueries";

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const { data: oppsRes, isLoading } = useV2OpportunitiesQuery();
  const opportunities = oppsRes?.data || [];

  const filtered = opportunities.filter((o: any) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    (o.provider && o.provider.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PITLayout
      category="CATALOGUE TERRITORIAL"
      title="Aides & Financements (Opportunities)"
      description="Consultez les appels à projets, subventions et opportunités de financements d'innovation."
      pageIcon={FileCode}
      breadcrumb={[{ label: "Financements" }]}
    >
      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un financement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-glass border border-muted/30 rounded-xl text-xs font-bold text-text focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o: any) => (
              <div key={o.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-teal-605 block">
                    {o.type}
                  </span>
                  <h3 className="font-extrabold text-xs text-text">{o.title}</h3>
                  <span className="text-[10px] text-muted font-bold block">
                    Fournisseur: {o.provider || "Région Wallonne"}
                  </span>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600">
                    {o.status || "OPEN"}
                  </span>
                  {o.deadline && (
                    <span className="text-[10px] text-muted font-semibold">
                      Échéance: {new Date(o.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PITLayout>
  );
}
