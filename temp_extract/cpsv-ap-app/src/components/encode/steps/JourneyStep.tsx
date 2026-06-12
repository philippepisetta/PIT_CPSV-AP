// src/components/encode/steps/JourneyStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const journeyPhases = [
  { id: "sensibilisation", label: "Sensibilisation", desc: "Prise de conscience, webinaires, workshops" },
  { id: "diagnostic", label: "Diagnostic", desc: "Audit de maturité digitale, technique ou cyber" },
  { id: "experimentation", label: "Expérimentation", desc: "Prototypage rapide, PoC technologique" },
  { id: "financement", label: "Financement", desc: "Orientation aides d'État, subsides, capital" },
  { id: "deploiement", label: "Déploiement", desc: "Intégration opérationnelle dans l'entreprise" },
  { id: "industrialisation", label: "Industrialisation", desc: "Mise à l'échelle, lignes de production connectées" },
  { id: "internationalisation", label: "Internationalisation", desc: "Export digital, marchés étrangers (AWEX)" },
  { id: "suivi-impact", label: "Suivi Impact", desc: "Évaluation du ROI et de la durabilité carbone" },
];

export default function JourneyStep() {
  const { control, register, watch } = useFormContext();
  const selectedPhases = watch("journey.phases") || [];

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Parcours Territorial de l’Usager (Customer Journey)
        </h3>
        <p className="text-sm text-gray-500">
          Sélectionnez les phases du cycle de vie territorial auxquelles s'intègre ce service public.
        </p>

        {/* Visual timeline selector */}
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4 my-6 space-y-6">
          {journeyPhases.map((phase) => (
            <Controller
              key={phase.id}
              name="journey.phases"
              control={control}
              render={({ field }) => {
                const current = field.value || [];
                const checked = current.includes(phase.id);
                return (
                  <div className="relative pl-6 flex items-start group">
                    <button
                      type="button"
                      onClick={() => {
                        if (checked) {
                          field.onChange(current.filter((x: string) => x !== phase.id));
                        } else {
                          field.onChange([...current, phase.id]);
                        }
                      }}
                      className={cn(
                        "absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        checked
                          ? "bg-primary-500 border-primary-500 text-white"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 group-hover:border-primary-400"
                      )}
                    >
                      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                    <div className="flex-1 cursor-pointer" onClick={() => {
                      if (checked) field.onChange(current.filter((x: string) => x !== phase.id));
                      else field.onChange([...current, phase.id]);
                    }}>
                      <h4 className={cn(
                        "text-sm font-semibold transition-all duration-200",
                        checked ? "text-primary-600 dark:text-primary-400 font-bold" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {phase.label}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{phase.desc}</p>
                    </div>
                  </div>
                );
              }}
            />
          ))}
        </div>

        {/* Journey Timeline Textarea */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wider">
            Description narrative du parcours usager (Timeline)
          </label>
          <Input
            {...register("journey.journeyTimeline")}
            placeholder="ex. 1. Inscription en ligne, 2. Audit de diagnostic sous 10 jours, 3. Remise du rapport IA..."
          />
        </div>
      </div>
    </section>
  );
}
