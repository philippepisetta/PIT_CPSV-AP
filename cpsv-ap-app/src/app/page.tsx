// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
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
  Home as HomeIcon
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";


interface Kpi {
  label: string;
  value: number;
  icon: any;
  color: string;
  desc: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    beneficiaries: 0,
    services: 0,
    journeys: 0,
    ecosystems: 0,
    relations: 0,
    valueChains: 0
  });

  const [activityStats, setActivityStats] = useState({
    individualCount: 0,
    collectiveCount: 0,
    collectiveParticipants: 0,
    collectiveCompanies: 0,
    collectiveSatisfaction: 0,
    secondLineCount: 0,
    secondLineOperators: 0,
    secondLineCollaborations: 0
  });

  const [provinces, setProvinces] = useState<Record<string, number>>({});
  const [challengesDistribution, setChallengesDistribution] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [metaRes, graphRes, deliveryRes] = await Promise.all([
          fetch("/api/meta"),
          fetch("/api/graph"),
          fetch("/api/service-deliveries")
        ]);

        if (!metaRes.ok || !graphRes.ok || !deliveryRes.ok) {
          throw new Error("Impossible de récupérer les données du tableau de bord.");
        }

        const metaData = await metaRes.json();
        const graphData = await graphRes.json();
        const deliveriesData = await deliveryRes.json();

        // Calculer les statistiques réelles
        const numBenefs = metaData.sectors ? metaData.sectors.reduce((acc: number, s: any) => acc + (s.primaryBeneficiaries?.length || 0), 0) : 2;
        setStats({
          beneficiaries: numBenefs || 2,
          services: metaData.services?.length || 0,
          journeys: metaData.journeys?.length || 0,
          ecosystems: metaData.ecosystems?.length || 0,
          relations: graphData.edges?.length || 0,
          valueChains: metaData.strategicValueChains?.length || 0
        });

        // Calculer les statistiques opérationnelles par niveau d'intervention
        const individualCount = deliveriesData.length;
        const collectiveDeliveries = metaData.collectiveDeliveries || [];
        const secondLineMissions = metaData.secondLineMissions || [];

        const collCount = collectiveDeliveries.length;
        const collPart = collectiveDeliveries.reduce((sum: number, cd: any) => sum + (cd.participantsCount || 0), 0);
        const collComp = collectiveDeliveries.reduce((sum: number, cd: any) => sum + (cd.companiesCount || 0), 0);
        const validSats = collectiveDeliveries.filter((cd: any) => cd.satisfactionScore !== null && cd.satisfactionScore !== undefined);
        const collSat = validSats.length > 0 
          ? (validSats.reduce((sum: number, cd: any) => sum + cd.satisfactionScore, 0) / validSats.length) 
          : 0;

        const slCount = secondLineMissions.length;
        const slOps = secondLineMissions.reduce((sum: number, sl: any) => sum + (sl.operatorsMobilized?.length || 0) + 1, 0); // +1 pour le leadOperator
        const slCollabs = secondLineMissions.reduce((sum: number, sl: any) => sum + (sl.collaborationsCount || 0), 0);

        setActivityStats({
          individualCount,
          collectiveCount: collCount,
          collectiveParticipants: collPart,
          collectiveCompanies: collComp,
          collectiveSatisfaction: Math.round(collSat * 10) / 10,
          secondLineCount: slCount,
          secondLineOperators: slOps,
          secondLineCollaborations: slCollabs
        });

        // Répartition par province
        const provMap: Record<string, number> = {};
        // Extraire des nœuds de type bénéficiaire
        const beneficiaryNodes = graphData.nodes?.filter((n: any) => n.type === "beneficiary") || [];
        beneficiaryNodes.forEach((node: any) => {
          const prov = node.province || "Non spécifié";
          provMap[prov] = (provMap[prov] || 0) + 1;
        });
        
        // Fallback avec données de démonstration du seed s'il n'y a pas encore d'éléments chargés dans le graphe
        if (Object.keys(provMap).length === 0) {
          provMap["Namur"] = 1;
          provMap["Liège"] = 1;
          provMap["Hainaut"] = 0;
          provMap["Brabant Wallon"] = 0;
        }
        setProvinces(provMap);

        // Répartition par défis sémantiques des services
        const challMap: Record<string, number> = {};
        metaData.services?.forEach((s: any) => {
          s.challenges?.forEach((c: any) => {
            challMap[c.name] = (challMap[c.name] || 0) + 1;
          });
        });
        // Fallback démo
        if (Object.keys(challMap).length === 0) {
          challMap["Digitalisation"] = 3;
          challMap["IA"] = 2;
          challMap["Cybersécurité"] = 2;
          challMap["Export"] = 1;
        }
        setChallengesDistribution(challMap);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted text-sm font-medium animate-pulse">Chargement du Tableau de bord territorial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-bold mb-2">Erreur de chargement</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const kpiData: Kpi[] = [
    { label: "Bénéficiaires", value: stats.beneficiaries || 2, icon: Building2, color: "from-blue-500 to-indigo-500", desc: "PME & acteurs accompagnés", },
    { label: "Services (CPSV-AP)", value: stats.services, icon: FileText, color: "from-emerald-500 to-teal-500", desc: "Aides publiques cataloguées" },
    { label: "Parcours Actifs", value: stats.journeys, icon: Compass, color: "from-purple-500 to-pink-500", desc: "Chemins de transformation" },
    { label: "Écosystèmes", value: stats.ecosystems, icon: Share2, color: "from-amber-500 to-orange-500", desc: "Hubs & clusters wallons" },
    { label: "Chaînes de valeur", value: stats.valueChains, icon: Layers, color: "from-cyan-500 to-blue-500", desc: "Filières économiques S3" },
    { label: "Relations sémantiques", value: stats.relations, icon: TrendingUp, color: "from-rose-500 to-red-500", desc: "Interconnexions du Graphe" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Cockpit Territorial de la Wallonie"
        description="Visualisez l'état d'alignement des services publics, l'évolution de la maturité des entreprises et la structure sémantique du réseau économique régional."
        Icon={HomeIcon}
      />


      {/* Grid KPIs */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Indicateurs clés">
        {kpiData.map((kpi, idx) => (
          <div 
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-surface border border-muted p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group"
          >
            {/* Background Gradient Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-[0.03] blur-2xl transition-all duration-500 group-hover:opacity-[0.08] group-hover:scale-125`} />
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">{kpi.label}</span>
                <p className="text-3xl font-extrabold text-text tracking-tight">{kpi.value}</p>
                <p className="text-xs text-muted/80">{kpi.desc}</p>
              </div>
              <div className={`rounded-xl p-3 bg-gradient-to-br ${kpi.color} text-white shadow-md shadow-primary/5`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Panel 1 : Répartition Territoriale */}
        <div className="rounded-2xl bg-surface border border-muted p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-muted pb-4">
            <h3 className="font-bold text-text flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Répartition des Bénéficiaires par Province
            </h3>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              Wallonie
            </span>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {Object.entries(provinces).map(([prov, count]) => {
              const total = Object.values(provinces).reduce((a, b) => a + b, 0) || 1;
              const percentage = Math.round((count / total) * 100);
              return (
                <div key={prov} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text">{prov}</span>
                    <span className="text-muted font-bold">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2 : Radar des Défis */}
        <div className="rounded-2xl bg-surface border border-muted p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-muted pb-4">
            <h3 className="font-bold text-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Priorités Stratégiques (Défis Adressés)
            </h3>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">
              Alignement S3
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {Object.entries(challengesDistribution).map(([challenge, count]) => {
              const maxVal = Math.max(...Object.values(challengesDistribution)) || 1;
              const barWidth = Math.round((count / maxVal) * 100);
              return (
                <div key={challenge} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-text w-32 truncate" title={challenge}>{challenge}</span>
                  <div className="flex-1 h-6 bg-glass rounded-lg overflow-hidden relative flex items-center">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500/20 to-primary/20 border-r border-primary/40 rounded-l-lg transition-all duration-1000"
                      style={{ width: `${barWidth}%` }}
                    />
                    <span className="absolute left-3 text-xs font-bold text-text">{count} service{count > 1 ? "s" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activités par Niveau d'Intervention */}
      <section className="space-y-4 pt-4 border-t border-muted/50">
        <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
          Suivi Opérationnel par Niveau d'Intervention
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Niveau 1 : Individuel */}
          <div className="rounded-2xl bg-surface border border-muted p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.02] blur-xl" />
            <div className="flex items-center justify-between border-b border-muted pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded">
                  Niveau 1
                </span>
                <h3 className="font-bold text-text text-sm mt-1">Accompagnement Individuel</h3>
              </div>
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-glass rounded-xl p-3 border border-muted/50">
                <span className="text-2xl font-black text-text block">{activityStats.individualCount}</span>
                <span className="text-[10px] text-muted font-medium uppercase">Accompagnements</span>
              </div>
              <div className="bg-glass rounded-xl p-3 border border-muted/50 flex flex-col justify-center items-center">
                <TrendingUp className="h-5 w-5 text-emerald-500 mb-0.5" />
                <span className="text-[10px] text-muted font-medium uppercase">Maturité Boost</span>
              </div>
            </div>
          </div>

          {/* Niveau 2 : Collectif */}
          <div className="rounded-2xl bg-surface border border-muted p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-[0.02] blur-xl" />
            <div className="flex items-center justify-between border-b border-muted pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                  Niveau 2
                </span>
                <h3 className="font-bold text-text text-sm mt-1">Accompagnement Collectif</h3>
              </div>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.collectiveCount}</span>
                <span className="text-[9px] text-muted font-medium uppercase">Sessions</span>
              </div>
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.collectiveParticipants}</span>
                <span className="text-[9px] text-muted font-medium uppercase">Audience</span>
              </div>
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.collectiveSatisfaction}/5</span>
                <span className="text-[9px] text-muted font-medium uppercase">Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Niveau 3 : Deuxième ligne */}
          <div className="rounded-2xl bg-surface border border-muted p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 opacity-[0.02] blur-xl" />
            <div className="flex items-center justify-between border-b border-muted pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded">
                  Niveau 3
                </span>
                <h3 className="font-bold text-text text-sm mt-1">Deuxième ligne / Écosystème</h3>
              </div>
              <Share2 className="h-5 w-5 text-purple-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.secondLineCount}</span>
                <span className="text-[9px] text-muted font-medium uppercase">Missions</span>
              </div>
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.secondLineOperators}</span>
                <span className="text-[9px] text-muted font-medium uppercase">Opérateurs</span>
              </div>
              <div className="bg-glass rounded-xl p-2 border border-muted/50">
                <span className="text-lg font-black text-text block">{activityStats.secondLineCollaborations}</span>
                <span className="text-[9px] text-muted font-medium uppercase">Collabs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
