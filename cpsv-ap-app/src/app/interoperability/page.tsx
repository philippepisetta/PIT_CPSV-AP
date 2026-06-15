// src/app/interoperability/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Network, 
  FileCode, 
  Activity, 
  RefreshCw,
  Plus
} from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import PITFilterBar from "@/design-system/PITFilterBar";
import PITStatCard from "@/design-system/PITStatCard";
import SplitLayout from "@/components/ui/SplitLayout";
import PITForm, { FormSection } from "@/design-system/PITForm";
import { 
  useV2SourceSystemsQuery, 
  useV2CreateSourceSystemMutation 
} from "@/hooks/useV2Queries";

interface SourceSystem {
  id: string;
  name: string;
  type: string;
  owner: string;
  syncFrequency: string;
  apiEndpoint: string;
  confidenceLevel: number;
  status: string;
  lastSync: string;
}

export default function InteroperabilityPage() {
  const [activeTab, setActiveTab] = useState<"catalogue" | "flows" | "mappings" | "create">("catalogue");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: systemsRes, isLoading } = useV2SourceSystemsQuery();
  const createSystemMutation = useV2CreateSourceSystemMutation();

  const systems: SourceSystem[] = systemsRes?.data || [];

  // Form states
  const [sysId, setSysId] = useState("");
  const [sysName, setSysName] = useState("");
  const [sysType, setSysType] = useState("CRM Écosystème");
  const [sysOwner, setSysOwner] = useState("");
  const [sysFreq, setSysFreq] = useState("Quotidienne");
  const [sysEndpoint, setSysEndpoint] = useState("");
  const [sysConfidence, setSysConfidence] = useState("90");
  const [sysStatus, setSysStatus] = useState("ACTIVE");

  const handleCreateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sysId || !sysName) {
      alert("L'identifiant et le nom sont requis.");
      return;
    }

    const payload = {
      id: sysId,
      name: sysName,
      type: sysType,
      owner: sysOwner,
      syncFrequency: sysFreq,
      apiEndpoint: sysEndpoint,
      confidenceLevel: parseInt(sysConfidence) || 90,
      status: sysStatus,
      lastSync: new Date().toISOString()
    };

    createSystemMutation.mutate(payload, {
      onSuccess: () => {
        alert("✅ Source System enregistré avec succès dans le registre d'interopérabilité !");
        setActiveTab("catalogue");
        setSysId("");
        setSysName("");
        setSysOwner("");
        setSysEndpoint("");
      }
    });
  };

  const filteredSystems = systems.filter(sys => 
    sys.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sys.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sys.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mappings data (Screen 3)
  const semanticMappings = [
    { sourceField: "bce.entreprise.num_entreprise", system: "BCE", targetClass: "d4wmo:Beneficiary", targetProperty: "dct:identifier", status: "ALIGNED" },
    { sourceField: "bce.entreprise.raison_sociale", system: "BCE", targetClass: "d4wmo:Beneficiary", targetProperty: "dct:title", status: "ALIGNED" },
    { sourceField: "dmat.diagnostic.score_digital", system: "DMAT", targetClass: "d4wmo:Beneficiary", targetProperty: "d4wmo:maturityDigital", status: "ALIGNED" },
    { sourceField: "dmat.diagnostic.score_ia", system: "DMAT", targetClass: "d4wmo:Beneficiary", targetProperty: "d4wmo:maturityIa", status: "ALIGNED" },
    { sourceField: "awex.company.export_maturity", system: "CRM AWEX", targetClass: "d4wmo:Beneficiary", targetProperty: "d4wmo:maturityExport", status: "ALIGNED" },
    { sourceField: "we.subvention.montant", system: "CRM WE", targetClass: "d4wmo:FundingAward", targetProperty: "d4wmo:grantedAmount", status: "IN_PROGRESS" },
    { sourceField: "biowin.member.role_ecosystem", system: "Salesforce BioWin", targetClass: "d4wmo:EcosystemRole", targetProperty: "d4wmo:roleName", status: "ALIGNED" },
    { sourceField: "greenwin.consortium.code", system: "CRM GreenWin", targetClass: "d4wmo:Consortium", targetProperty: "dct:identifier", status: "IN_PROGRESS" }
  ];

  // Forms definition
  const formSections: FormSection[] = [
    {
      id: "general",
      title: "Système Source",
      subtitle: "Identité et caractéristiques du système de record",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Identifiant unique *</label>
              <input required value={sysId} onChange={e => setSysId(e.target.value)} type="text" placeholder="ex: sf-biowin" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Nom du Système *</label>
              <input required value={sysName} onChange={e => setSysName(e.target.value)} type="text" placeholder="ex: Salesforce BioWin" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Type *</label>
              <select value={sysType} onChange={e => setSysType(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none">
                <option value="Registre Administratif">Registre Administratif</option>
                <option value="CRM Écosystème">CRM Écosystème</option>
                <option value="Plateforme d'Évaluation">Plateforme d'Évaluation</option>
                <option value="CRM Exportateur">CRM Exportateur</option>
                <option value="CRM Financement">CRM Financement</option>
                <option value="Partenaire Hub">Partenaire Hub</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Propriétaire / Organisme *</label>
              <input required value={sysOwner} onChange={e => setSysOwner(e.target.value)} type="text" placeholder="ex: SPW Économie" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Fréquence</label>
              <select value={sysFreq} onChange={e => setSysFreq(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none">
                <option value="Temps Réel">Temps Réel</option>
                <option value="Quotidienne">Quotidienne</option>
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuelle">Mensuelle</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Niveau Confiance (0-100)</label>
              <input value={sysConfidence} onChange={e => setSysConfidence(e.target.value)} type="number" min="0" max="100" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Statut</label>
              <select value={sysStatus} onChange={e => setSysStatus(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg p-2 text-xs text-text outline-none">
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Endpoint d'intégration sémantique (API)</label>
            <input value={sysEndpoint} onChange={e => setSysEndpoint(e.target.value)} type="text" placeholder="https://..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-text outline-none" />
          </div>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de l'Espace Interopérabilité...</p>
      </div>
    );
  }

  return (
    <PITLayout
      category="GOUVERNANCE DES DONNÉES"
      title="Workspace Interopérabilité & Alignement Sémantique"
      description="Gérez les Source Systems, configurez les flux d'intégration et pilotez l'alignement sémantique du Knowledge Graph Territorial wallon."
      pageIcon={Settings}
      breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Interopérabilité" }]}
      actions={
        <div className="flex bg-glass/25 p-1 rounded-xl border border-muted/15 gap-1 shrink-0">
          {[
            { id: "catalogue", label: "Systèmes Sources", icon: Database },
            { id: "flows", label: "Flux de Données (Flows)", icon: Network },
            { id: "mappings", label: "Mappings Sémantiques", icon: FileCode },
            { id: "create", label: "Enregistrer Système", icon: Plus }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border-0 bg-transparent ${
                  activeTab === t.id 
                    ? "bg-teal-500 text-white font-extrabold" 
                    : "text-muted hover:text-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Screen 1: Catalogue des systèmes */}
        {activeTab === "catalogue" && (
          <div className="space-y-4">
            <PITFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Rechercher un système source par nom, propriétaire, type..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSystems.map((sys) => (
                <div key={sys.id} className="bg-glass/30 border border-muted/15 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-wider text-teal-605 bg-teal-500/10 px-2 py-0.5 rounded-full">
                        {sys.type}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold">
                        {sys.status === "ACTIVE" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-extrabold">CONNECTÉ</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-rose-500" />
                            <span className="text-rose-500 font-extrabold">HORS LIGNE</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-text leading-tight">{sys.name}</h3>
                    <p className="text-xs text-muted leading-tight font-semibold">Organisme : {sys.owner}</p>
                    <p className="text-[10px] text-muted font-mono leading-tight truncate">Endpoint : {sys.apiEndpoint}</p>
                  </div>

                  <div className="border-t border-muted/10 pt-3 flex justify-between items-center text-[9px] font-bold text-muted">
                    <span>Fréquence : {sys.syncFrequency}</span>
                    <span>Dernière synchro : {new Date(sys.lastSync).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screen 2: Data Flows flowchart */}
        {activeTab === "flows" && (
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
            <h3 className="text-xs font-black uppercase text-muted tracking-wider mb-8 border-b border-muted/10 pb-2 self-start w-full">
              Diagramme de Flux d&apos;Intégration Sémantique
            </h3>

            {/* flowchart diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full relative z-10">
              {/* Column 1: Source Systems */}
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-black uppercase text-center text-muted">1. Source Systems (SoR)</span>
                {["BCE (Données admin)", "DMAT (Maturité)", "CRM WE (Aides)"].map(sys => (
                  <div key={sys} className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/25 text-xs font-extrabold text-indigo-750 dark:text-indigo-400 rounded-xl text-center w-48 shadow-sm">
                    {sys}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center shrink-0 rotate-95 md:rotate-0">
                <Network className="h-6 w-6 text-muted animate-pulse" />
              </div>

              {/* Column 2: Data Products */}
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-black uppercase text-center text-muted">2. Data Products Registry</span>
                {["dp-bce-companies", "dp-dmat-scores", "dp-we-subventions"].map(dp => (
                  <div key={dp} className="px-4 py-3 bg-teal-500/10 border border-teal-500/25 text-xs font-extrabold text-teal-750 dark:text-teal-400 rounded-xl text-center w-48 shadow-sm">
                    {dp}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center shrink-0 rotate-95 md:rotate-0">
                <ArrowRight className="h-6 w-6 text-muted" />
              </div>

              {/* Column 3: Semantic Graphe */}
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-black uppercase text-center text-muted">3. Knowledge Graph PIT</span>
                <div className="px-5 py-8 bg-fuchsia-500/15 border-2 border-fuchsia-500/35 text-xs font-black text-fuchsia-700 dark:text-fuchsia-405 rounded-full text-center w-40 h-40 flex flex-col justify-center items-center shadow-lg relative">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-fuchsia-500/30 animate-spin" style={{ animationDuration: "12s" }} />
                  <Database className="h-5 w-5 mb-1 text-fuchsia-605" />
                  <span>PIT Knowledge Graph</span>
                  <span className="text-[8px] text-muted font-bold mt-1">RDF / Triples Store</span>
                </div>
              </div>

              <div className="flex items-center justify-center shrink-0 rotate-95 md:rotate-0">
                <ArrowRight className="h-6 w-6 text-muted" />
              </div>

              {/* Column 4: Consumer Workspaces */}
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-black uppercase text-center text-muted">4. Systems of engagement</span>
                {["Workspace Conseiller 360", "Cockpit Strategique DG", "Workspace Animation"].map(ws => (
                  <div key={ws} className="px-4 py-3 bg-amber-500/10 border border-amber-500/25 text-xs font-extrabold text-amber-700 dark:text-amber-400 rounded-xl text-center w-48 shadow-sm">
                    {ws}
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing flowing lines background using CSS */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-teal-500 to-fuchsia-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Screen 3: Semantic Mappings */}
        {activeTab === "mappings" && (
          <div className="bg-glass/30 border border-muted/20 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-muted tracking-wider border-b border-muted/10 pb-2">
              Registre de Mapping Sémantique Source-vers-Graphe
            </h3>

            <div className="overflow-x-auto rounded-xl border border-muted/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-glass/10 border-b border-muted/10 font-bold uppercase text-[9px] text-muted tracking-wider">
                    <th className="p-3">Champ Source</th>
                    <th className="p-3">Système Source</th>
                    <th className="p-3">Classe Cible (Ontologie)</th>
                    <th className="p-3">Propriété Cible (Predicate)</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10 font-semibold text-text">
                  {semanticMappings.map((m, i) => (
                    <tr key={i} className="hover:bg-glass/5">
                      <td className="p-3 font-mono text-xs">{m.sourceField}</td>
                      <td className="p-3">{m.system}</td>
                      <td className="p-3 text-indigo-650 font-bold">{m.targetClass}</td>
                      <td className="p-3 text-teal-650 font-mono text-[11px]">{m.targetProperty}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          m.status === "ALIGNED" 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Screen 4: Register Source System */}
        {activeTab === "create" && (
          <div className="bg-glass/20 border border-muted/20 rounded-2xl p-6 relative max-w-4xl mx-auto">
            <PITForm
              title="Enregistrer un Système Source (SoR)"
              sections={formSections}
              onSubmit={handleCreateSystem}
              onCancel={() => setActiveTab("catalogue")}
              submitLabel="Enregistrer le système"
              infoPanel={
                <div className="space-y-4">
                  <p>
                    <strong>Système Source (System of Record) :</strong> Il s&apos;agit de la base de données de référence d&apos;un opérateur (ex. Banque-Carrefour des Entreprises, CRM AWEX, etc.) qui détient la vérité administrative ou sectorielle d&apos;un concept.
                  </p>
                  <p>
                    L&apos;intégration au Graphe Sémantique de la PIT s&apos;effectue via des connecteurs de type ETL/API alignés sur les ontologies CPSV-AP et territoriales wallonnes.
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </PITLayout>
  );
}
