// src/app/communities/page.tsx
"use client";

import { Share2, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import PITLayout from "@/design-system/PITLayout";
import { useV2CommunitiesQuery } from "@/hooks/usePITQueries";

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const { data: commsRes, isLoading } = useV2CommunitiesQuery();
  const communities = commsRes?.data || [];

  const filtered = communities.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Cercles d'Écosystèmes"
      description="Découvrez et rejoignez les communautés thématiques animées par les pôles régionaux."
      pageIcon={Share2}
      breadcrumb={[{ label: "Communautés" }]}
    >
      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher une communauté..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-glass border border-muted/30 rounded-xl text-xs font-bold text-text focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((c: any) => (
              <div key={c.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/30 hover:shadow-lg hover:border-teal-500/30 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-text">{c.name}</h3>
                    <span className="text-[9px] font-bold font-mono uppercase bg-teal-500/10 text-teal-605 px-2 py-0.5 rounded-full">
                      {c.code}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{c.description || "Aucune description fournie."}</p>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-text border-t border-muted/10 pt-3">
                  <div className="bg-glass p-1.5 rounded-lg">
                    <span className="block font-black text-xs">{c._count?.members || 0}</span>
                    <span className="text-[8px] text-muted uppercase">Membres</span>
                  </div>
                  <div className="bg-glass p-1.5 rounded-lg">
                    <span className="block font-black text-xs">{c._count?.projects || 0}</span>
                    <span className="text-[8px] text-muted uppercase">Projets</span>
                  </div>
                  <div className="bg-glass p-1.5 rounded-lg">
                    <span className="block font-black text-xs">{c._count?.opportunities || 0}</span>
                    <span className="text-[8px] text-muted uppercase">Opportunités</span>
                  </div>
                  <div className="bg-glass p-1.5 rounded-lg">
                    <span className="block font-black text-xs">{c._count?.events || 0}</span>
                    <span className="text-[8px] text-muted uppercase">Événements</span>
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
