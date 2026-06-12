// src/components/encode/steps/BusinessEventsStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const businessEvents = [
  "Création entreprise",
  "Croissance entreprise",
  "Transformation digitale",
  "Recherche financement",
  "Export international",
  "Transition énergétique",
  "Innovation produit",
  "Recrutement",
];

const lifeEvents = [
  "Création activité",
  "Développement activité",
  "Difficultés financières",
  "Internationalisation",
  "Transmission entreprise",
];

export default function BusinessEventsStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Business Events (Événements Professionnels)
        </h3>
        <p className="text-sm text-gray-500">
          Sélectionnez les moments clés de la vie de l’entreprise associés à ce service.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {businessEvents.map((event) => (
            <Controller
              key={event}
              name="events.business"
              control={control}
              render={({ field }) => {
                const checked = field.value?.includes(event) || false;
                return (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked: any) => {
                        const current = field.value || [];
                        if (isChecked) {
                          field.onChange([...current, event]);
                        } else {
                          field.onChange(current.filter((x: string) => x !== event));
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{event}</span>
                  </label>
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Life Events (Événements de Vie)
        </h3>
        <p className="text-sm text-gray-500">
          Événements de vie générale du citoyen/professionnel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {lifeEvents.map((event) => (
            <Controller
              key={event}
              name="events.life"
              control={control}
              render={({ field }) => {
                const checked = field.value?.includes(event) || false;
                return (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked: any) => {
                        const current = field.value || [];
                        if (isChecked) {
                          field.onChange([...current, event]);
                        } else {
                          field.onChange(current.filter((x: string) => x !== event));
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{event}</span>
                  </label>
                );
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
