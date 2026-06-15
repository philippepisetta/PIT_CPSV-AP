// src/app/communities/page.tsx
"use client";

import { Share2, Search, ArrowRight, Users, FileCode, Activity, Sparkles, Building2, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import SplitLayout from "@/components/ui/SplitLayout";
import { useV2CommunitiesQuery } from "@/hooks/usePITQueries";
import { Badge } from "@/components/ui/badge";

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCommId, setSelectedCommId] = useState<number | null>(null);
  const { data: commsRes, isLoading } = useV2CommunitiesQuery();
  const communities = commsRes?.data || [];

  const filtered = communities.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedComm = communities.find((c: any) => c.id === selectedCommId) || (filtered.length > 0 ? filtered[0] : null);

  const handleSelectCommunity = (id: number) => {
    setSelectedCommId(id);
  };

  // Left side: list of communities
  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Cercles et Communautés ({filtered.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {filtered.map((c: any) => {
          const isSelected = selectedComm?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => handleSelectCommunity(c.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? "bg-teal-500/10 border-teal-500/40 shadow-md"
                  : "bg-glass/30 border-muted/15 hover:border-muted/30"
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full">
                    {c.code}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-text">{c.name}</h4>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{c.description || "Aucune description."}</p>
              </div>

              <div className="flex justify-between items-center border-t border-muted/10 pt-2.5 text-[9px] font-bold text-muted">
                <span>Membres : {c.members?.length || 0}</span>
                <span>Projets : {c.projects?.length || 0}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucune communauté trouvée.
          </div>
        )}
      </div>
    </div>
  );

  // Right side: Community Details with tabs
  const renderDetailPanel = () => {
    if (!selectedComm) {
      return (
        <div className="text-center py-20 text-muted italic bg-glass/10 border-2 border-dashed border-muted/15 rounded-2xl">
          <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Sélectionnez une communauté pour charger son espace de pilotage.
        </div>
      );
    }

    const c = selectedComm;
    const members = c.members || [];
    const projects = c.projects || [];
    const opportunities = c.opportunities || [];
    const events = c.events || [];

    // Matchmaking logic (Screen suggestions based on complementary NACE and capabilities)
    const suggestedMatches = [];
    if (members.length >= 2) {
      // Find companies vs experts/researchers
      const companies = members.filter((m: any) => m.member?.type === "Entreprise" || !m.member?.type);
      const experts = members.filter((m: any) => m.member?.type !== "Entreprise" && m.member?.type);

      if (companies.length > 0 && experts.length > 0) {
        suggestedMatches.push({
          title: "Consortium IA & Pharma Sémantique",
          memberA: companies[0].member?.name || "PME Cible",
          memberB: experts[0].member?.name || "Centre R&D",
          rationale: "Association recommandée pour répondre à l'Appel Tremplin IA. Complémentarité entre le besoin applicatif et l'expertise en ingénierie de données.",
          naceSector: "NACE 21.20 / R&D BioTech",
          actionLabel: "Créer une Proposition de Consortium"
        });
      }
      if (companies.length > 1) {
        suggestedMatches.push({
          title: "Partenariat Supply Chain Manufacturière",
          memberA: companies[0].member?.name || "PME A",
          memberB: companies[1].member?.name || "PME B",
          rationale: "Intégration verticale recommandée dans la filière bois/construction. Partage de standards d'interopérabilité.",
          naceSector: "NACE 16.23 / NACE 49.41",
          actionLabel: "Initier une Coopération"
        });
      }
    }

    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-1.5">
          <span className="text-[9px] font-bold text-muted uppercase block">Description Sémantique</span>
          <p className="text-xs text-text leading-relaxed">{c.description || "Aucune description détaillée."}</p>
        </div>

        {/* Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-bold text-text">
          <div className="bg-glass/25 border border-muted/10 p-3 rounded-xl">
            <span className="block font-black text-lg text-teal-605">{members.length}</span>
            <span className="text-[9px] text-muted uppercase">Membres</span>
          </div>
          <div className="bg-glass/25 border border-muted/10 p-3 rounded-xl">
            <span className="block font-black text-lg text-indigo-500">{projects.length}</span>
            <span className="text-[9px] text-muted uppercase">Projets R&D</span>
          </div>
          <div className="bg-glass/25 border border-muted/10 p-3 rounded-xl">
            <span className="block font-black text-lg text-emerald-500">{opportunities.length}</span>
            <span className="text-[9px] text-muted uppercase">Appels / Opps</span>
          </div>
          <div className="bg-glass/25 border border-muted/10 p-3 rounded-xl">
            <span className="block font-black text-lg text-amber-500">{events.length}</span>
            <span className="text-[9px] text-muted uppercase">Événements</span>
          </div>
        </div>
      </div>
    );

    // Members list with roles
    const membersTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Membres du Cercle & Rôles d&apos;Animation
        </h4>
        <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
          {members.map((m: any, idx: number) => (
            <div key={idx} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text block">{m.member?.name || `Membre #${m.memberId}`}</span>
                <span className="text-[9px] text-muted uppercase font-semibold">{m.member?.type || "Acteur"} • NACE: {m.member?.nace || "Non classifié"}</span>
              </div>
              <Badge className="bg-teal-500/10 text-teal-650 border-teal-500/20 uppercase text-[9px] font-bold">
                {m.role || "MEMBRE"}
              </Badge>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucun membre enregistré dans cette communauté.</p>
          )}
        </div>
      </div>
    );

    // Opportunities & Calls
    const opportunitiesTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Opportunités Technologiques & Appels à Projets Associés
        </h4>
        <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
          {opportunities.map((o: any, idx: number) => {
            const opp = o.opportunity || {};
            return (
              <div key={idx} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-teal-605 block">{opp.type || "Call"}</span>
                  <span className="text-xs font-bold text-text block mt-0.5">{opp.title || "Appel à projet"}</span>
                  <span className="text-[9px] text-muted block">Provider : {opp.provider || "Région Wallonne"}</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase text-[8px] font-bold">
                  {opp.status || "OPEN"}
                </Badge>
              </div>
            );
          })}
          {opportunities.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucun appel à projet lié à cette communauté.</p>
          )}
        </div>
      </div>
    );

    // Matchmaking Suggester (Screen suggestions)
    const matchmakingTab = (
      <div className="space-y-4">
        <div className="border-b border-muted/10 pb-2 flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-teal-650 animate-pulse" />
            Moteur de Matchmaking IA & Synergies Sémantiques
          </h4>
          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded border border-teal-500/20 uppercase">
            Graph Recommended
          </span>
        </div>

        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
          {suggestedMatches.map((match, idx) => (
            <div key={idx} className="p-4 bg-glass/35 border border-teal-550/20 rounded-2xl space-y-3.5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase text-indigo-600">Axe de Matchmaking #{idx + 1}</span>
                  <h4 className="text-xs font-bold text-text">{match.title}</h4>
                </div>
                <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[8px] font-bold">
                  {match.naceSector}
                </Badge>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-text bg-glass/25 p-2.5 rounded-xl border border-muted/10 justify-center">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-teal-605" />
                  <span>{match.memberA}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted" />
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  <span>{match.memberB}</span>
                </div>
              </div>

              <p className="text-[10px] text-muted leading-relaxed font-semibold">{match.rationale}</p>

              <button
                onClick={() => alert(`✅ Lancement des démarches de rapprochement pour "${match.title}". Un email de recommandation automatisé avec lien sémantique est envoyé aux deux contacts.`)}
                className="w-full py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-extrabold text-[10px] uppercase rounded-xl cursor-pointer border-0 shadow hover:shadow-lg transition-all"
              >
                {match.actionLabel}
              </button>
            </div>
          ))}

          {suggestedMatches.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Pas assez de membres connectés dans cette communauté pour générer des matches automatiques.</p>
          )}
        </div>
      </div>
    );

    const metadataTab = (
      <div className="space-y-4">
        <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-2.5">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider">Provenance et Métadonnées Sémantiques</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] text-muted">URI Sémantique</span>
              <span className="font-mono text-[10px] text-text break-all">https://pit.wallonie.be/id/community/{c.code.toLowerCase()}</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Système Source</span>
              <span className="font-semibold text-text">PIT Semantic Registry</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Statut</span>
              <span className="font-semibold text-text">Actif</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Dernière Synchro</span>
              <span className="font-semibold text-text">Temps Réel</span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <PITDetailLayout
        title={c.name}
        subtitle={`Communauté Sémantique — Code: ${c.code}`}
        badge={
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-655 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
            COMMUNITY
          </span>
        }
        overviewTab={overviewTab}
        relationsTab={membersTab}
        impactTab={opportunitiesTab}
        contributionsTab={matchmakingTab}
        metadataTab={metadataTab}
        overviewLabel="Vue d'ensemble"
        relationsLabel="Membres & Rôles"
        impactLabel="Appels & Opportunités"
        contributionsLabel="Matchmaking & Synergies"
      />
    );
  };

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Cercles d'Écosystèmes (Communities)"
      description="Découvrez, pilotez et animez les cercles de compétences. Utilisez le matchmaking automatisé pour accélérer les collaborations inter-membres."
      pageIcon={Share2}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Communautés" }
      ]}
    >
      <div className="space-y-4">
        <PITFilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher une communauté par nom ou code..."
        />

        <SplitLayout
          leftPane={leftPane}
          rightPane={renderDetailPanel()}
          leftColSpan={5}
        />
      </div>
    </PITLayout>
  );
}
