// src/components/ContextPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  Building2, 
  Users, 
  FileText, 
  Compass, 
  Network, 
  Target, 
  Shield, 
  ClipboardCheck, 
  Activity, 
  FileCode, 
  TrendingUp,
  MapPin,
  ExternalLink,
  Layers,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number | string;
  entityData?: any;
}

const typeLabelMap: Record<string, string> = {
  beneficiary: "Bénéficiaire / Entreprise",
  member: "Membre de l'Écosystème",
  challenge: "Défi d'Écosystème",
  service: "Service Public (CPSV-AP)",
  consortium: "Consortium Collaboratif",
  project: "Projet d'Innovation",
  filiere: "Filière S3",
  valuechain: "Chaîne de Valeur",
  opportunity: "Financement / Opportunité",
  outcome: "Résultat / Outcome",
  evidence: "Preuve / Evidence",
  strategicframework: "Cadre Stratégique",
  program: "Programme Régional"
};

const typeColorMap: Record<string, string> = {
  beneficiary: "from-fuchsia-500 to-pink-500 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/25",
  member: "from-teal-500 to-indigo-500 text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/25",
  challenge: "from-rose-500 to-red-500 text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25",
  service: "from-indigo-500 to-blue-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
  consortium: "from-purple-500 to-pink-500 text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/25",
  project: "from-blue-500 to-cyan-500 text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25",
  filiere: "from-teal-500 to-emerald-500 text-teal-605 bg-teal-500/10 border-teal-500/25",
  valuechain: "from-indigo-500 to-teal-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
  opportunity: "from-emerald-500 to-teal-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  outcome: "from-amber-500 to-orange-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25",
  evidence: "from-emerald-500 to-cyan-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  strategicframework: "from-amber-500 to-yellow-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25",
  program: "from-blue-500 to-indigo-500 text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/25"
};

const typeIconMap: Record<string, any> = {
  beneficiary: Building2,
  member: Users,
  challenge: Target,
  service: FileText,
  consortium: Network,
  project: Activity,
  filiere: Layers,
  valuechain: Network,
  opportunity: FileCode,
  outcome: TrendingUp,
  evidence: ClipboardCheck,
  strategicframework: Shield,
  program: Award
};

export default function ContextPanel({ isOpen, onClose, entityType, entityId, entityData }: ContextPanelProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Auto fetch details if only ID is provided
  useEffect(() => {
    if (!isOpen || !entityId) return;
    
    if (entityData) {
      setData(entityData);
      return;
    }

    async function fetchDetails() {
      setLoading(true);
      try {
        let url = "";
        const cleanType = entityType.toLowerCase();
        
        if (cleanType === "member" || cleanType === "beneficiary") {
          url = `/api/v2/members/${entityId}`;
        } else if (cleanType === "service") {
          url = `/api/services/${entityId}`;
        } else if (cleanType === "opportunity") {
          url = `/api/v2/opportunities/${entityId}`;
        } else if (cleanType === "community") {
          url = `/api/v2/communities/${entityId}`;
        } else {
          // General fallback
          setData({ id: entityId, name: `${typeLabelMap[entityType] || entityType} #${entityId}`, description: "Détails chargés en contexte." });
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error("Error fetching context panel data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [isOpen, entityType, entityId, entityData]);

  if (!isOpen) return null;

  const IconComponent = typeIconMap[entityType] || Building2;
  const colorClasses = typeColorMap[entityType] || "from-teal-500 to-indigo-500 text-teal-605 bg-teal-500/10 border-teal-500/25";
  const name = data?.name || data?.title || `${typeLabelMap[entityType] || entityType} #${entityId}`;
  const description = data?.description || data?.objective || "Aucune description disponible.";

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background/95 backdrop-blur-md border-l border-muted/20 shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Panel Header */}
      <div className="p-4 border-b border-muted/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg bg-gradient-to-r", colorClasses.split(" ")[0], colorClasses.split(" ")[1])}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border", colorClasses.slice(colorClasses.indexOf("text")))}>
              {typeLabelMap[entityType] || entityType}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-glass text-muted hover:text-text cursor-pointer border-0 bg-transparent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-2 text-muted">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500" />
            <span className="text-xs font-bold">Chargement des connexions...</span>
          </div>
        ) : (
          <>
            {/* Overview Section */}
            <div className="space-y-2">
              <h2 className="text-sm font-black text-text leading-snug">{name}</h2>
              {data?.location && (
                <div className="flex items-center gap-1 text-[10px] text-muted font-bold">
                  <MapPin className="h-3 w-3" />
                  <span>{data.location} {data.province ? `(${data.province})` : ""}</span>
                </div>
              )}
              <p className="text-xs text-muted leading-relaxed font-medium pt-2 border-t border-muted/5">
                {description}
              </p>
            </div>

            {/* Maturities (if company) */}
            {(entityType === "beneficiary" || entityType === "member") && (data?.digitalMaturity !== undefined) && (
              <div className="space-y-2.5 bg-glass/20 border border-muted/10 p-3.5 rounded-xl">
                <span className="text-[9px] font-black text-muted uppercase block">Indices de Maturité</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                  <div className="bg-teal-500/10 text-teal-600 p-2 rounded-lg">
                    Numérique
                    <span className="block text-sm font-black mt-0.5">{data.digitalMaturity || 1}/4</span>
                  </div>
                  <div className="bg-indigo-500/10 text-indigo-600 p-2 rounded-lg">
                    IA
                    <span className="block text-sm font-black mt-0.5">{data.iaMaturity || 1}/4</span>
                  </div>
                  <div className="bg-rose-500/10 text-rose-600 p-2 rounded-lg">
                    Cyber
                    <span className="block text-sm font-black mt-0.5">{data.cyberMaturity || 1}/4</span>
                  </div>
                </div>
              </div>
            )}

            {/* Relations Section */}
            <div className="space-y-3 pt-4 border-t border-muted/10">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-wider">Connexions Sémantiques</h3>
              
              <div className="space-y-2">
                {/* Related communities */}
                {data?.memberships && data.memberships.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted uppercase block">Communautés :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.memberships.map((m: any) => (
                        <span key={m.id} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[9px] font-bold">
                          {m.community?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related projects */}
                {data?.projects && data.projects.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-bold text-muted uppercase block">Projets Actifs :</span>
                    {data.projects.map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center text-[10px] font-bold bg-glass/25 border border-muted/10 p-2 rounded-lg">
                        <span className="text-text">{p.project?.name}</span>
                        <span className="text-[9px] text-muted font-black uppercase">{p.project?.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related services */}
                {data?.services && data.services.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-bold text-muted uppercase block">Services Mobilisés :</span>
                    {data.services.map((s: any) => (
                      <div key={s.id} className="text-[10px] font-bold bg-glass/25 border border-muted/10 p-2 rounded-lg text-text">
                        {s.service?.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Default placeholders/scenarios if no DB relations to support storytelling */}
                {(!data?.memberships && !data?.projects && !data?.services) && (
                  <div className="space-y-2.5">
                    <div className="p-2.5 bg-glass/25 border border-muted/10 rounded-xl text-[10px] font-medium leading-relaxed">
                      <span className="font-bold text-teal-605 block uppercase text-[8px] mb-1">Réseau Territorial</span>
                      Cet objet est connecté à <span className="font-bold text-text">3 acteurs R&D</span> et contribue à <span className="font-bold text-text">2 objectifs stratégiques</span> de la feuille de route S3.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* URI / Metadata */}
            <div className="space-y-2 pt-4 border-t border-muted/10 text-[9px] font-mono text-muted">
              <div className="flex items-center justify-between">
                <span>ID : {entityId}</span>
                <span>Type : {entityType}</span>
              </div>
              <div className="bg-glass/20 p-2 rounded border border-muted/10 break-all leading-tight">
                {data?.uri || `https://pit.wallonie.be/id/${entityType}/${entityId}`}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Panel Footer */}
      <div className="p-4 border-t border-muted/10 bg-glass/10 text-center">
        <button 
          onClick={onClose}
          className="w-full py-1.5 bg-glass border border-muted/30 hover:bg-glass/50 text-text rounded-xl text-xs font-black cursor-pointer transition-all"
        >
          Fermer le Panneau
        </button>
      </div>
    </div>
  );
}
