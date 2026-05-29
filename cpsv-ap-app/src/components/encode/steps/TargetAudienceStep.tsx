// src/components/encode/steps/TargetAudienceStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const orgTypes = ["Indépendant", "TPE", "PME", "Grande entreprise", "Administration", "Startup", "Centre recherche"];
const sizes = ["1-5", "5-20", "20-50", "50-250", "250+"];
const sectors = ["Manufacturing", "Construction", "AgriTech", "BioTech", "Retail", "Energie", "Smart City"];

export default function TargetAudienceStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Public cible
        </h3>

        {/* Type d’organisation */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Type d’organisation</h4>
          <div className="grid grid-cols-2 gap-2">
            {orgTypes.map((type) => (
              <Controller
                key={type}
                name="targetAudience.organisationTypes"
                control={control}
                render={({ field }) => {
                  const checked = field.value?.includes(type) || false;
                  return (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked: any) => {
                          const current = field.value || [];
                          if (isChecked) field.onChange([...current, type]);
                          else field.onChange(current.filter((x: string) => x !== type));
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{type}</span>
                    </label>
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Taille d’entreprise */}
        <div className="pt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Taille d’entreprise (ETI / Effectifs)</h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <Controller
                key={size}
                name="targetAudience.size"
                control={control}
                render={({ field }) => {
                  const checked = field.value?.includes(size) || false;
                  return (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked: any) => {
                          const current = field.value || [];
                          if (isChecked) field.onChange([...current, size]);
                          else field.onChange(current.filter((x: string) => x !== size));
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{size}</span>
                    </label>
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Secteurs d'activité */}
        <div className="pt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Secteurs concernés</h4>
          <div className="grid grid-cols-2 gap-2">
            {sectors.map((sec) => (
              <Controller
                key={sec}
                name="targetAudience.sectors"
                control={control}
                render={({ field }) => {
                  const checked = field.value?.includes(sec) || false;
                  return (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked: any) => {
                          const current = field.value || [];
                          if (isChecked) field.onChange([...current, sec]);
                          else field.onChange(current.filter((x: string) => x !== sec));
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{sec}</span>
                    </label>
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
