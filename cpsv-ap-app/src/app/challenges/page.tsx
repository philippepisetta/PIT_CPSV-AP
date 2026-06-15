// src/app/challenges/page.tsx
"use client";

import { Target, AlertCircle } from "lucide-react";
import PITLayout from "@/design-system/PITLayout";
import { useV2MissionsQuery } from "@/hooks/usePITQueries";
import { useMemo } from "react";

export default function ChallengesPage() {
  const { data: missionsRes, isLoading } = useV2MissionsQuery();
  const missions = missionsRes?.data || [];

  // Extract challenges from missions -> themes -> challenges
  const challenges = useMemo(() => {
    const list: any[] = [];
    missions.forEach((m: any) => {
      m.themes?.forEach((t: any) => {
        t.challenges?.forEach((c: any) => {
          list.push({
            ...c,
            themeName: t.name,
            missionName: m.name
          });
        });
      });
    });
    
    // Add default challenges if database list is empty for demo
    if (list.length === 0) {
      return [
        { id: 1, name: "Certification réglementaire MDR", description: "Mettre en conformité logicielle les dispositifs médicaux intégrant de l'intelligence artificielle.", themeName: "IA Médicale", missionName: "Santé et Sciences du vivant" },
        { id: 2, name: "Sécurisation des infrastructures logistiques NIS2", description: "Assurer la sécurité OT/IT des PME de transport et de distribution NIS2.", themeName: "Smart Mobility", missionName: "Logistique et Transport" },
        { id: 3, name: "Décarbonation des procédés industriels de la métallurgie", description: "Intégrer les technologies d'électrolyse hydrogène pour réduire l'impact carbone.", themeName: "Transition Hydrogène", missionName: "Industrie 5.0" },
      ];
    }
    return list;
  }, [missions]);

  return (
    <PITLayout
      category="ECOSYSTEM CRM"
      title="Défis d'Écosystèmes (Ecosystem Challenges)"
      description="Consultez les verrous technologiques et organisationnels identifiés par les animateurs et adressés par les consortiums."
      pageIcon={Target}
      breadcrumb={[{ label: "Défis" }]}
    >
      <div className="rounded-2xl bg-surface border border-muted/20 bg-glass/20 p-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {challenges.map((c: any) => (
              <div key={c.id} className="p-5 rounded-2xl border border-muted/10 bg-glass/30 flex flex-col md:flex-row gap-4 items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <h3 className="font-extrabold text-xs text-text">{c.name}</h3>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{c.description || "Aucune description de défi n'est fournie."}</p>
                </div>
                
                <div className="flex flex-col gap-1.5 text-right w-full md:w-auto shrink-0 border-t md:border-t-0 border-muted/10 pt-2.5 md:pt-0">
                  <span className="text-[9px] font-black uppercase text-teal-605">
                    Thème: {c.themeName}
                  </span>
                  <span className="text-[8px] font-bold text-muted uppercase">
                    Mission: {c.missionName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PITLayout>
  );
}
