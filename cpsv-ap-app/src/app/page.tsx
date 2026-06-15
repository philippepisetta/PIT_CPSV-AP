// src/app/page.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  Building2, 
  FileText, 
  Compass, 
  Share2, 
  Layers, 
  MapPin, 
  Sparkles,
  TrendingUp,
  Users,
  Home as HomeIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCode,
  DollarSign,
  Activity,
  ClipboardCheck,
  Search,
  Check,
  X,
  Target
} from "lucide-react";

import PITLayout from "@/design-system/PITLayout";
import PITStatCard from "@/design-system/PITStatCard";
import { useWorkspace } from "@/design-system/PITWorkspaceProvider";
import { 
  useV2MembersQuery, 
  useV2CommunitiesQuery,
  useV2OpportunitiesQuery,
  useV2ConsortiaQuery,
  useV2EcosystemKpisQuery,
  useV2EcosystemActivityQuery,
  useV2EvidencesQuery,
  useV2UpdateEvidenceStatusMutation,
  useV2MissionsQuery,
  useV2GapAnalysisQuery
} from "@/hooks/usePITQueries";

export default function Home() {
  const { activeWorkspace } = useWorkspace();
  const [selectedUseCase, setSelectedUseCase] = useState<string>("BioWin");
  const [recMemberId, setRecMemberId] = useState<string>("");
  const [recResults, setRecResults] = useState<any>(null);
  const [recLoading, setRecLoading] = useState<boolean>(false);
  const [memberSearch, setMemberSearch] = useState<string>("");

  // React Query Hooks
  const { data: membersRes, isLoading: membersLoading } = useV2MembersQuery();
  const { data: kpisRes, isLoading: kpisLoading } = useV2EcosystemKpisQuery();
  const { data: activityRes, isLoading: activityLoading } = useV2EcosystemActivityQuery();
  const { data: evidencesRes, isLoading: evidencesLoading } = useV2EvidencesQuery();
  const { data: missionsRes, isLoading: missionsLoading } = useV2MissionsQuery();
  const { data: gapRes, isLoading: gapLoading } = useV2GapAnalysisQuery();
  
  const updateStatusMutation = useV2UpdateEvidenceStatusMutation();

  const members = membersRes?.data || [];
  const kpis = kpisRes?.data || { members: 0, activeMembers: 0, projects: 0, opportunities: 0, events: 0, collaborations: 0 };
  const activities = activityRes?.data || [];
  const evidences = evidencesRes?.data || [];
  const missions = missionsRes?.data || [];
  const gapAnalysis = gapRes?.data || [];

  // Filter pending evidences for Animateur
  const pendingEvidences = useMemo(() => {
    return evidences.filter((e: any) => e.status === "PENDING");
  }, [evidences]);

  // Handle Evidence Approval/Rejection
  const handleEvidenceAction = (id: number, status: "APPROVED" | "REJECTED") => {
    updateStatusMutation.mutate({ id, status });
  };

  // Handle Recommendation Generation
  const handleGenerateRecs = async () => {
    if (!recMemberId) return;
    setRecLoading(true);
    try {
      const res = await fetch("/api/v2/recommendation/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: recMemberId }),
      });
      const data = await res.json();
      setRecResults(data.data);
    } catch (err) {
      console.error("Error matching recommendations:", err);
    } finally {
      setRecLoading(false);
    }
  };

  // Filtered members for Conseiller Portfolio
  const filteredMembers = useMemo(() => {
    return members.filter((m: any) => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.location.toLowerCase().includes(memberSearch.toLowerCase())
    );
  }, [members, memberSearch]);

  // Choose BioWin, GreenWin, MecaTech, Logistics, Wagralim details for DG Cockpit Funnel
  const selectedFunnelData = useMemo(() => {
    if (!missions || missions.length === 0) return null;
    
    // We map use case keywords to the seeded models
    if (selectedUseCase === "BioWin") {
      const mission = missions.find((m: any) => m.name.toLowerCase().includes("santé")) || missions[0];
      return {
        mission: mission?.name,
        theme: mission?.themes?.[0]?.name,
        challenge: mission?.themes?.[0]?.challenges?.[0]?.name,
        consortium: "Consortium MedTech Namur",
        project: "MedTech IA Imagerie (Active)",
        outcome: "Algorithme clinique certifié",
        evidence: "Rapport de validation clinique CHU Liège",
        evidenceStatus: evidences.find((e: any) => e.name.includes("validation clinique"))?.status || "APPROVED",
        indicator: "Nombre d'outils médicaux IA certifiés (Aggregation: SUM)",
        impact: "1.0 dispositif médical"
      };
    } else if (selectedUseCase === "GreenWin") {
      return {
        mission: "Transition écologique et décarbonation industrielle",
        theme: "Matériaux Circulaires & Recyclage Optique",
        challenge: "Eco-conception des polymères",
        consortium: "Consortium Circular Materials",
        project: "EcoPlast Circular (Planné)",
        outcome: "Formulation thermoplastique recyclable",
        evidence: "Rapport de validation d'impact CO2 - GreenWin",
        evidenceStatus: evidences.find((e: any) => e.name.includes("CO2"))?.status || "PENDING",
        indicator: "Taux de plastique recyclé réintégré (Aggregation: AVG)",
        impact: "42% de taux moyen"
      };
    } else if (selectedUseCase === "Logistics") {
      return {
        mission: "Moderniser la mobilité et la logistique régionale",
        theme: "Fret Vert & Algorithmes logistiques",
        challenge: "Interopérabilité & Cybersécurité NIS2",
        consortium: "Ecosystem LogiTrans & CETIC",
        project: "Optimisation de Fret Connecté (Active)",
        outcome: "Routage prédictif NIS2 conforme",
        evidence: "Preuve d'interopérabilité NIS2 - Logistics",
        evidenceStatus: evidences.find((e: any) => e.name.includes("NIS2"))?.status || "PENDING",
        indicator: "Nombre d'acteurs de fret cyber-sécurisés (Aggregation: COUNT)",
        impact: "12 transporteurs actifs"
      };
    } else if (selectedUseCase === "MecaTech") {
      return {
        mission: "Accélérer l'Industrie 5.0 en Wallonie",
        theme: "Vecteurs Énergie & Hydrogène propre",
        challenge: "Stockage haute pression sécurisé",
        consortium: "Consortium Métallurgie Propre Seraing",
        project: "HydroSeraing (Active)",
        outcome: "Prototype électrolyseur industriel",
        evidence: "Attestation de déploiement IA - MecaTech",
        evidenceStatus: evidences.find((e: any) => e.name.includes("IA - MecaTech"))?.status || "PENDING",
        indicator: "Volume hydrogène stocké (Aggregation: SUM)",
        impact: "15,000 Nm3 cumulés"
      };
    } else {
      return {
        mission: "Assurer la souveraineté alimentaire durable",
        theme: "Transition Protéines Végétales",
        challenge: "Approvisionnement local & traçabilité",
        consortium: "AgriTech Coalition Gembloux",
        project: "VeggieTech Wallonie (Active)",
        outcome: "Chaîne de traçabilité blockchain",
        evidence: "Certificat d'approvisionnement durable",
        evidenceStatus: "APPROVED",
        indicator: "Partenaires locaux intégrés (Aggregation: COUNT)",
        impact: "24 agriculteurs locaux"
      };
    }
  }, [missions, selectedUseCase, evidences]);

  // Loading Screen
  if (membersLoading || kpisLoading || activityLoading || evidencesLoading || missionsLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement de votre Espace PIT...</p>
      </div>
    );
  }

  // Render workspace conditional dashboards
  return (
    <PITLayout
      category="ESPACE DE TRAVAIL"
      title={
        activeWorkspace === "animateur" ? "Tableau de Bord Écosystème" :
        activeWorkspace === "conseiller" ? "Portefeuille d'Accompagnement" :
        activeWorkspace === "entreprise" ? "Mon Espace Innovation" :
        "Cockpit Stratégique (DG)"
      }
      description={
        activeWorkspace === "animateur" ? "Gérez vos membres, animez les communautés, lancez des projets et auditez les preuves de résultats." :
        activeWorkspace === "conseiller" ? "Consultez l'indice de maturité de vos entreprises et générez des recommandations intelligentes." :
        activeWorkspace === "entreprise" ? "Suivez votre parcours d'innovation, accédez aux aides recommandées et soumettez vos preuves." :
        "Cockpit exécutif d'alignement de la politique publique : de la vision stratégique régionale aux preuves d'impact locales."
      }
      pageIcon={HomeIcon}
      breadcrumb={[{ label: "Accueil" }]}
    >
      
      {/* -------------------- ANIMATEUR WORKSPACE -------------------- */}
      {activeWorkspace === "animateur" && (
        <div className="space-y-8">
          {/* KPIs */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            <PITStatCard label="Membres du Pôle" value={kpis.members} icon={Users} themeColor="teal" description="Acteurs de l'écosystème" />
            <PITStatCard label="Communautés" value={kpis.communities || 10} icon={Share2} themeColor="indigo" description="Cercles d'animation thématiques" />
            <PITStatCard label="Opportunités de Financement" value={kpis.opportunities} icon={FileCode} themeColor="emerald" description="Appels à projets ouverts" />
            <PITStatCard label="Collaborations Actives" value={kpis.collaborations} icon={TrendingUp} themeColor="amber" description="Relations sémantiques" />
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Audit Preuves Table */}
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                  <ClipboardCheck className="h-5 w-5 text-teal-650" />
                  Audit des Preuves (Evidence Verification)
                </h3>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal-500/10 text-teal-650">
                  {pendingEvidences.length} en attente
                </span>
              </div>

              {pendingEvidences.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                  <p className="text-xs font-bold">Toutes les preuves d'impact ont été auditées.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                        <th className="py-2">Preuve / Justificatif</th>
                        <th className="py-2">Type / Fichier</th>
                        <th className="py-2">Statut</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingEvidences.map((evi: any) => (
                        <tr key={evi.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-text block">{evi.name}</span>
                            <span className="text-muted text-[10px] block max-w-sm truncate">{evi.description}</span>
                          </td>
                          <td className="py-3">
                            <span className="bg-glass border border-muted/20 px-2 py-0.5 rounded-md text-[10px] font-mono">
                              {evi.type}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500">
                              PENDING
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            <button
                              onClick={() => handleEvidenceAction(evi.id, "APPROVED")}
                              className="px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => handleEvidenceAction(evi.id, "REJECTED")}
                              className="px-2 py-1 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-600 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                            >
                              Rejeter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Activities Timeline */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  Activités Récentes
                </h3>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin">
                {activities.slice(0, 5).map((act: any) => (
                  <div key={act.id} className="border-l-2 border-indigo-500/30 pl-3 py-1 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-indigo-500 block">
                      {act.type}
                    </span>
                    <p className="text-xs font-bold text-text leading-tight">{act.title}</p>
                    <p className="text-[10px] text-muted leading-tight">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONSEILLER WORKSPACE -------------------- */}
      {activeWorkspace === "conseiller" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Portefeuille d'entreprises */}
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Entreprises Accompagnées
                </h3>
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-full bg-glass border border-muted/30 rounded-xl text-xs font-bold text-text focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-muted/10 text-muted font-black uppercase text-[10px]">
                      <th className="py-2">Nom</th>
                      <th className="py-2">Secteur NACE</th>
                      <th className="py-2">Localisation</th>
                      <th className="py-2 text-center">Maturité Numérique</th>
                      <th className="py-2 text-center">Maturité IA</th>
                      <th className="py-2 text-center">Maturité Cyber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.slice(0, 10).map((m: any) => (
                      <tr key={m.id} className="border-b border-muted/5 hover:bg-glass/10 transition-colors">
                        <td className="py-3">
                          <span className="font-bold text-text block">{m.name}</span>
                          <span className="text-muted text-[10px] block">{m.size || "Organisation"}</span>
                        </td>
                        <td className="py-3 font-mono text-muted text-[10px]">{m.nace || "N/A"}</td>
                        <td className="py-3 font-semibold text-text">{m.location}</td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-md font-black bg-teal-500/10 text-teal-600">
                            {m.digitalMaturity}/4
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-md font-black bg-indigo-500/10 text-indigo-600">
                            {m.iaMaturity}/4
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-md font-black bg-rose-500/10 text-rose-600">
                            {m.cyberMaturity}/4
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendation Engine Matcher */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 flex flex-col space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-4">
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider">
                  Moteur de Recommandation
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted">Sélectionner un bénéficiaire</label>
                  <select
                    value={recMemberId}
                    onChange={(e) => setRecMemberId(e.target.value)}
                    className="w-full bg-glass border border-muted/30 rounded-xl px-3 py-2 text-xs font-bold text-text focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Sélectionner --</option>
                    {members.filter((m: any) => m.type === "Entreprise").map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerateRecs}
                  disabled={!recMemberId || recLoading}
                  className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-extrabold hover:shadow-lg disabled:opacity-50 disabled:shadow-none cursor-pointer transition-all"
                >
                  {recLoading ? "Matching en cours..." : "Générer Recommandations"}
                </button>
              </div>

              {recResults && (
                <div className="mt-4 space-y-4 flex-1 overflow-y-auto max-h-[350px] scrollbar-thin">
                  {/* Partenaires */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-teal-600 block">Partenaires R&D Recommandés</span>
                    <div className="space-y-1.5">
                      {recResults.partners?.map((p: any) => (
                        <div key={p.id} className="bg-glass/35 p-2.5 rounded-lg border border-muted/10 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-text block">{p.name}</span>
                            <span className="text-[9px] text-muted uppercase">{p.type} • {p.location}</span>
                          </div>
                          <Check className="h-4 w-4 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">Services Publics Recommandés</span>
                    <div className="space-y-1.5">
                      {recResults.services?.map((s: any) => (
                        <div key={s.id} className="bg-glass/35 p-2.5 rounded-lg border border-muted/10">
                          <span className="text-xs font-bold text-text block">{s.name}</span>
                          <span className="text-[9px] text-muted block">{s.organization?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funding */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block">Opportunités Financières</span>
                    <div className="space-y-1.5">
                      {recResults.opportunities?.map((o: any) => (
                        <div key={o.id} className="bg-glass/35 p-2.5 rounded-lg border border-muted/10">
                          <span className="text-xs font-bold text-text block">{o.title}</span>
                          <span className="text-[9px] text-muted block">{o.provider}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ENTREPRISE WORKSPACE -------------------- */}
      {activeWorkspace === "entreprise" && (
        <div className="space-y-8">
          {/* Simulated Enterprise header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-teal-600 block">Votre compte</span>
              <h2 className="text-lg font-black text-text">MedTech Namur S.A.</h2>
              <p className="text-xs text-muted">Statut: PME • Province de Namur • Code NACE: 21.20 (Fabrication de préparations pharmaceutiques)</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-glass p-3 rounded-xl text-center border border-muted/10">
                <span className="text-xs text-muted block uppercase font-bold text-[9px]">Maturité Numérique</span>
                <span className="text-lg font-black text-teal-600">3/4</span>
              </div>
              <div className="bg-glass p-3 rounded-xl text-center border border-muted/10">
                <span className="text-xs text-muted block uppercase font-bold text-[9px]">Maturité Cyber</span>
                <span className="text-lg font-black text-rose-500">2/4</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Journey Progress */}
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-4">
                <Compass className="h-5 w-5 text-teal-600" />
                <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider">
                  Mon Parcours de Transformation : e-Santé Pôle Wallonie
                </h3>
              </div>

              {/* Progress bar */}
              <div className="space-y-6 pt-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Progression générale</span>
                  <span className="text-teal-600 font-extrabold">75% (Stage 3 de 4)</span>
                </div>
                <div className="h-3 bg-glass rounded-full overflow-hidden border border-muted/10">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" style={{ width: "75%" }} />
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-text block">Étape 1 : Diagnostic de maturité numérique</span>
                      <p className="text-[10px] text-muted">Complété le 10/02/2026. Score initial de 2/4.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-text block">Étape 2 : Élaboration du Plan d'Action</span>
                      <p className="text-[10px] text-muted">Complété le 03/03/2026. Intégration de 3 recommandations.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-teal-500 shrink-0 flex items-center justify-center mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-teal-700 dark:text-teal-400 block">Étape 3 : Implémentation du projet IA</span>
                      <p className="text-[10px] text-text font-medium">En cours. Projet "MedTech IA Imagerie" actif. Preuve d'homologation CHU Liège soumise.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-text block">Étape 4 : Évaluation d'impact final</span>
                      <p className="text-[10px] text-muted">Prévu d'ici fin 2026.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended for MedTech */}
            <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-muted/10 pb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-extrabold text-text text-sm uppercase text-muted tracking-wider">
                  Recommandé pour vous
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-teal-600">Service recommandé</span>
                  <h4 className="text-xs font-bold text-text mt-1">Accompagnement Réglementaire MDR</h4>
                  <p className="text-[10px] text-muted mt-0.5">Aide au marquage CE pour dispositifs logiciels.</p>
                </div>

                <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-indigo-600">Financement recommandé</span>
                  <h4 className="text-xs font-bold text-text mt-1">Appel Tremplin IA 2026</h4>
                  <p className="text-[10px] text-muted mt-0.5">Subvention jusqu'à 70% pour l'intégration de modèles d'IA.</p>
                </div>

                <div className="bg-glass/30 border border-muted/15 p-3 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-emerald-600">Expert recommandé</span>
                  <h4 className="text-xs font-bold text-text mt-1">CETIC - Département Cybersécurité</h4>
                  <p className="text-[10px] text-muted mt-0.5">Assistance technique pour NIS2 et sécurisation des données médicales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DG / EXECUTIVE WORKSPACE -------------------- */}
      {activeWorkspace === "dg" && (
        <div className="space-y-8">
          {/* Strategic KPIs (Quantitative Policy Aggregation SUM, AVG, COUNT) */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full">
            <div className="bg-glass p-5 rounded-2xl border border-muted/20 bg-glass/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Total Financements Accordés (SUM)</span>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-text block">12,450,000 €</span>
              <span className="text-[10px] text-muted font-semibold block">Cumulé sur les subventions FEDER, WE et Horizon Europe validées.</span>
            </div>

            <div className="bg-glass p-5 rounded-2xl border border-muted/20 bg-glass/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Maturité Numérique Moyenne (AVG)</span>
                <TrendingUp className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="text-2xl font-black text-text block">2.85 / 4</span>
              <span className="text-[10px] text-muted font-semibold block">Moyenne pondérée des 50 membres de l'écosystème.</span>
            </div>

            <div className="bg-glass p-5 rounded-2xl border border-muted/20 bg-glass/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted uppercase tracking-wider">Acteurs R&D Mobilisés (COUNT)</span>
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-2xl font-black text-text block">24 institutions</span>
              <span className="text-[10px] text-muted font-semibold block">Universités, centres de recherche et experts actifs sur le terrain.</span>
            </div>
          </section>

          {/* Use Cases Runner */}
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-muted/10 pb-4 gap-4">
              <div>
                <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                  <Target className="h-5 w-5 text-amber-500" />
                  Démonstrateur d'Alignement Stratégique (Use Cases)
                </h3>
                <p className="text-[11px] text-muted mt-0.5">Suivez le lignage complet, de la politique publique S3 jusqu'aux justificatifs validés d'impact.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["BioWin", "GreenWin", "Logistics", "MecaTech", "Wagralim"].map((uc) => (
                  <button
                    key={uc}
                    onClick={() => setSelectedUseCase(uc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      selectedUseCase === uc 
                        ? "bg-amber-500 border-amber-500 text-white shadow-md" 
                        : "bg-glass border-muted/30 text-text hover:bg-glass/50"
                    }`}
                  >
                    {uc}
                  </button>
                ))}
              </div>
            </div>

            {selectedFunnelData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] font-black uppercase text-amber-500">1. Vision & Priorité S3</span>
                  <h4 className="text-xs font-bold text-text">{selectedFunnelData.mission}</h4>
                  <p className="text-[10px] text-muted">Cadre de référence stratégique wallon.</p>
                </div>

                <div className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] font-black uppercase text-indigo-500">2. Feuille de route & Défi</span>
                  <h4 className="text-xs font-bold text-text">{selectedFunnelData.theme}</h4>
                  <p className="text-[10px] text-muted">Challenge: {selectedFunnelData.challenge}</p>
                </div>

                <div className="bg-glass/30 border border-muted/15 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] font-black uppercase text-teal-600">3. Consortium & Projet</span>
                  <h4 className="text-xs font-bold text-text">{selectedFunnelData.project}</h4>
                  <p className="text-[10px] text-muted">{selectedFunnelData.consortium}</p>
                </div>

                <div className="bg-glass/30 border border-amber-500/30 p-4 rounded-2xl bg-amber-500/5 space-y-1 relative overflow-hidden">
                  <span className="text-[9px] font-black uppercase text-emerald-600">4. Preuve de Résultat</span>
                  <h4 className="text-xs font-extrabold text-text">{selectedFunnelData.evidence}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      selectedFunnelData.evidenceStatus === "APPROVED" 
                        ? "bg-emerald-500/10 text-emerald-600" 
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {selectedFunnelData.evidenceStatus}
                    </span>
                    <span className="text-[10px] text-muted">Agg: {selectedFunnelData.indicator}</span>
                  </div>
                  <div className="pt-2 border-t border-muted/10 mt-2">
                    <span className="text-[10px] font-bold text-text">Impact: {selectedFunnelData.impact}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gap Analysis diagnostic */}
          <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
            <div className="border-b border-muted/10 pb-4">
              <h3 className="font-extrabold text-text flex items-center gap-2 text-sm uppercase text-muted tracking-wider">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Matrice d'Analyse des Gaps Territoriaux
              </h3>
              <p className="text-[11px] text-muted mt-0.5">Diagnostic automatisé par écosystème, filière, chaîne de valeur et maillon.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gapAnalysis.slice(0, 3).map((filiere: any) => (
                <div key={filiere.id} className="bg-glass/35 p-4 rounded-xl border border-muted/10 space-y-3">
                  <span className="text-xs font-black text-text block uppercase border-b border-muted/10 pb-1.5">{filiere.name}</span>
                  <div className="space-y-3">
                    {filiere.valueChains?.map((vc: any) => (
                      <div key={vc.id} className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-muted block">{vc.name}</span>
                        <div className="space-y-1">
                          {vc.segments?.slice(0, 3).map((seg: any) => {
                            const hasGaps = seg.gaps.actors || seg.gaps.services || seg.gaps.capabilities || seg.gaps.funding;
                            return (
                              <div key={seg.id} className="p-2 rounded-lg bg-glass/20 flex items-center justify-between text-[10px]">
                                <span className="font-bold text-text">{seg.name}</span>
                                {hasGaps ? (
                                  <div className="flex gap-1">
                                    {seg.gaps.actors && <span className="bg-rose-500/10 text-rose-500 px-1 py-0.2 rounded font-black text-[8px]">Acteurs</span>}
                                    {seg.gaps.services && <span className="bg-amber-500/10 text-amber-500 px-1 py-0.2 rounded font-black text-[8px]">Services</span>}
                                    {seg.gaps.capabilities && <span className="bg-indigo-500/10 text-indigo-500 px-1 py-0.2 rounded font-black text-[8px]">Compétences</span>}
                                  </div>
                                ) : (
                                  <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                                    <Check className="h-3 w-3" /> OK
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </PITLayout>
  );
}
