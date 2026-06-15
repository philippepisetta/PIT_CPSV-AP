// src/app/opportunities/page.tsx
"use client";

import { FileCode, Search, Sparkles, Building2, Users, Plus, ArrowRight, Activity, Calendar, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITDetailLayout from "@/design-system/PITDetailLayout";
import PITRelationsPanel from "@/design-system/PITRelationsPanel";
import SplitLayout from "@/components/ui/SplitLayout";
import { Badge } from "@/components/ui/badge";
import { 
  useV2OpportunitiesQuery, 
  useV2MembersQuery, 
  useV2ProjectsQuery 
} from "@/hooks/usePITQueries";

interface Opportunity {
  id: number;
  title: string;
  type: string;
  provider: string;
  status: string;
  deadline?: string;
  description?: string;
  budget?: string;
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedOppId, setSelectedOppId] = useState<number | null>(null);

  // Queries
  const { data: oppsRes, isLoading } = useV2OpportunitiesQuery();
  const { data: membersRes } = useV2MembersQuery();
  const { data: projectsRes } = useV2ProjectsQuery();

  const opportunities: Opportunity[] = oppsRes?.data || [];
  const members = membersRes?.data || [];
  const projects = projectsRes?.data || [];

  const filtered = opportunities.filter((o: Opportunity) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    (o.provider && o.provider.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedOpp = opportunities.find(o => o.id === selectedOppId) || (filtered.length > 0 ? filtered[0] : null);

  const handleSelectOpp = (id: number) => {
    setSelectedOppId(id);
  };

  // Left pane: list of opportunities
  const leftPane = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
        <h3 className="text-xs font-black uppercase text-muted tracking-wider">
          Opportunités de Financement ({filtered.length})
        </h3>
      </div>
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {filtered.map((o: Opportunity) => {
          const isSelected = selectedOpp?.id === o.id;
          return (
            <div
              key={o.id}
              onClick={() => handleSelectOpp(o.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? "bg-teal-500/10 border-teal-500/40 shadow-md"
                  : "bg-glass/30 border-muted/15 hover:border-muted/30"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full w-max block">
                  {o.type}
                </span>
                <h4 className="font-extrabold text-xs text-text">{o.title}</h4>
                <p className="text-[10px] text-muted font-bold leading-tight">Fournisseur : {o.provider || "Région Wallonne"}</p>
              </div>

              <div className="flex justify-between items-center border-t border-muted/10 pt-2 text-[9px] font-bold text-muted">
                <span>Statut : {o.status || "OPEN"}</span>
                {o.deadline && <span>Échéance : {new Date(o.deadline).toLocaleDateString()}</span>}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-muted italic">
            Aucune opportunité trouvée.
          </div>
        )}
      </div>
    </div>
  );

  // Right pane: Detail layout
  const renderDetailPanel = () => {
    if (!selectedOpp) {
      return (
        <div className="text-center py-20 text-muted italic bg-glass/10 border-2 border-dashed border-muted/15 rounded-2xl">
          <FileCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
          Sélectionnez une opportunité pour charger son explorer.
        </div>
      );
    }

    const o = selectedOpp;

    // Filter eligible companies (e.g. Tremplin IA suggests companies with low IA maturity)
    const eligibleCompanies = members.filter((m: any) => {
      if (m.type !== "Entreprise") return false;
      if (o.title.toLowerCase().includes("ia")) {
        return m.iaMaturity && m.iaMaturity < 3; // Eligible for IA help
      }
      if (o.title.toLowerCase().includes("cyber")) {
        return m.cyberMaturity && m.cyberMaturity < 3; // Eligible for Cyber help
      }
      return true; // general eligibility
    }).slice(0, 4);

    // Filter projects linked to this opportunity/provider
    const linkedProjects = projects.filter((p: any) => 
      p.name.toLowerCase().includes(o.title.toLowerCase().split(" ")[0]) ||
      p.description?.toLowerCase().includes(o.provider.toLowerCase())
    );

    const overviewTab = (
      <div className="space-y-6">
        <div className="bg-glass/10 p-4 border border-muted/10 rounded-xl space-y-1.5">
          <span className="text-[9px] font-bold text-muted uppercase block">Description du Programme</span>
          <p className="text-xs text-text leading-relaxed">{o.description || "Appel à projet visant à soutenir les collaborations de recherche et de développement en Wallonie."}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-text">
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Budget Global</span>
            <span className="text-sm font-black text-teal-655">{o.budget || "500,000 €"}</span>
          </div>
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold text-muted uppercase block">Fournisseur</span>
            <span>{o.provider}</span>
          </div>
          <div className="bg-glass/5 p-3 rounded-xl border border-muted/10 space-y-1">
            <span className="text-[9px] font-bold uppercase text-muted block">Échéance</span>
            <span>{o.deadline ? new Date(o.deadline).toLocaleDateString() : "Non spécifiée"}</span>
          </div>
        </div>
      </div>
    );

    // Eligible Companies Tab
    const eligibleTab = (
      <div className="space-y-4">
        <div className="border-b border-muted/10 pb-2 flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-muted tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-650 animate-pulse" />
            Bénéficiaires Éligibles Recommandés (SoI Engine)
          </h4>
          <span className="text-[8px] font-black bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded border border-teal-500/20 uppercase">
            Auto-Match
          </span>
        </div>

        <div className="space-y-2.5">
          {eligibleCompanies.map((c: any) => (
            <div key={c.id} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text block">{c.name}</span>
                <span className="text-[9px] text-muted block">Localisation : {c.location} • N NACE : {c.nace}</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-teal-500/10 text-teal-655 text-[8px] font-bold uppercase">
                  Maturité IA : {c.iaMaturity}/4
                </Badge>
                <button
                  onClick={() => alert(`✅ Notification d'éligibilité envoyée au conseiller de "${c.name}".`)}
                  className="px-2 py-0.5 bg-teal-500 text-white rounded text-[9px] font-bold cursor-pointer"
                >
                  Qualifier
                </button>
              </div>
            </div>
          ))}
          {eligibleCompanies.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucune entreprise éligible trouvée dans la base de données.</p>
          )}
        </div>
      </div>
    );

    // Consortium Manager Tab
    const consortiumTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Constitution d&apos;un Consortium en Un Clic
        </h4>
        <p className="text-[10px] text-muted leading-tight font-semibold">Gérez les partenaires et soumettez la proposition de consortium au nom du pôle.</p>

        {eligibleCompanies.length >= 2 ? (
          <div className="bg-glass/35 border border-indigo-500/25 p-4 rounded-2xl space-y-4">
            <span className="text-[9px] font-black uppercase text-indigo-605">Consortium suggéré</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text bg-glass/20 p-2.5 border border-muted/10 rounded-xl">
                <Building2 className="h-4 w-4 text-teal-605" />
                <span>Porteur principal : {eligibleCompanies[0].name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-text bg-glass/20 p-2.5 border border-muted/10 rounded-xl">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Cogénérateur R&D : {eligibleCompanies[1].name}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`✅ Consortium sémantique constitué ! L'opportunité a été reliée aux deux bénéficiaires et enregistrée dans le CRM Fédéré.`)}
              className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-black text-[10px] uppercase rounded-xl cursor-pointer shadow hover:shadow-lg transition-all"
            >
              Enregistrer le Consortium & Connecter au Graphe
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted italic text-center py-4">Pas assez de candidats éligibles pour constituer un consortium suggéré.</p>
        )}
      </div>
    );

    // Linked Projects Tab
    const projectsTab = (
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-1">
          Projets Actifs Financés par cet Instrument
        </h4>
        <div className="space-y-2.5">
          {linkedProjects.map((p: any) => (
            <div key={p.id} className="p-3 bg-glass/35 border border-muted/15 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text block">{p.name}</span>
                <span className="text-[9px] text-muted block">Code : {p.code} • Statut : {p.status}</span>
              </div>
              <Badge className="bg-teal-500/10 text-teal-650 text-[8px] font-bold uppercase">
                Active Project
              </Badge>
            </div>
          ))}
          {linkedProjects.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">Aucun projet actif n&apos;est actuellement relié à ce financement.</p>
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
              <span className="font-mono text-[10px] text-text break-all">https://pit.wallonie.be/id/opportunity/{o.id}</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Système Source</span>
              <span className="font-semibold text-text">Wallonie Entreprendre (WE) / AWEX</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Statut Interop</span>
              <span className="font-semibold text-text">Synchronisé</span>
            </div>
            <div>
              <span className="block text-[10px] text-muted">Dernière Synchro</span>
              <span className="font-semibold text-text">Quotidien (04:00 AM)</span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <PITDetailLayout
        title={o.title}
        subtitle={`Instrument de Financement — Fournisseur : ${o.provider}`}
        badge={
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-655 bg-teal-500/10 px-2.5 py-0.5 rounded-full select-none">
            {o.type}
          </span>
        }
        overviewTab={overviewTab}
        relationsTab={eligibleTab}
        impactTab={consortiumTab}
        contributionsTab={projectsTab}
        metadataTab={metadataTab}
        overviewLabel="Vue d'ensemble"
        relationsLabel="Bénéficiaires Éligibles"
        impactLabel="Consortium Manager"
        contributionsLabel="Projets Liés"
      />
    );
  };

  return (
    <PITLayout
      category="CATALOGUE TERRITORIAL"
      title="Aides & Financements (Opportunities)"
      description="Consultez les appels à projets, subventions et opportunités de financements d&apos;innovation. Qualifiez les candidats éligibles et constituez des consortiums."
      pageIcon={FileCode}
      breadcrumb={[
        { label: "Tableau de bord", href: "/" },
        { label: "Financements" }
      ]}
    >
      <div className="space-y-4">
        <PITFilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher un financement par nom ou fournisseur..."
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
