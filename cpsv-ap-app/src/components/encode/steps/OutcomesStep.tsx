// src/components/encode/steps/OutcomesStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const outcomeTypes = [
  "Augmentation maturité digitale",
  "Augmentation productivité",
  "Réduction consommation énergétique",
  "Amélioration cybersécurité",
  "Accès financement",
  "Croissance export",
  "Accélération innovation"
];

export default function OutcomesStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-primary-500">
          Impacts à moyen terme (Outcomes)
        </h3>
        <p className="text-xs text-gray-500">
          Définissez les bénéfices indirects et transformations structurelles obtenus à l'issue de ce service.
        </p>

        <Controller
          name="outcomes.outcomes"
          control={control}
          defaultValue={[{ type: "Augmentation maturité digitale", horizon: "6 mois", associatedKpi: "Maturité (+20%)", measurementMode: "Audit final" }]}
          render={({ field }) => {
            const list = field.value || [];
            const addOutcome = () => field.onChange([...list, { type: "", horizon: "12 mois", associatedKpi: "", measurementMode: "" }]);
            const updateOutcome = (idx: number, key: string, val: any) => {
              const updated = [...list];
              updated[idx] = { ...updated[idx], [key]: val };
              field.onChange(updated);
            };
            const removeOutcome = (idx: number) => {
              field.onChange(list.filter((_: any, i: number) => i !== idx));
            };

            return (
              <div className="space-y-4">
                {list.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">OUTCOME {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeOutcome(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Type de bénéfice</label>
                        <Select
                          onValueChange={(val: string) => updateOutcome(idx, "type", val)}
                          defaultValue={item.type}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez le bénéfice" />
                          </SelectTrigger>
                          <SelectContent>
                            {outcomeTypes.map((o) => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Horizon temporel de l'effet</label>
                        <Input
                          value={item.horizon}
                          onChange={(e) => updateOutcome(idx, "horizon", e.target.value)}
                          placeholder="ex. 6 mois, 1 an"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Indicateur associé</label>
                        <Input
                          value={item.associatedKpi}
                          onChange={(e) => updateOutcome(idx, "associatedKpi", e.target.value)}
                          placeholder="ex. Score maturité"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Mode de mesure</label>
                        <Input
                          value={item.measurementMode}
                          onChange={(e) => updateOutcome(idx, "measurementMode", e.target.value)}
                          placeholder="ex. Sondage de sortie, audit externe"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOutcome}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 font-semibold"
                >
                  + Ajouter un Outcome sémantique
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
