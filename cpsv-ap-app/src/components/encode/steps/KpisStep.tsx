// src/components/encode/steps/KpisStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function KpisStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Indicateurs de Performance (KPIs)
        </h3>
        <p className="text-sm text-gray-500">
          Définissez les indicateurs quantitatifs clés pour mesurer l’impact réel de ce service public sur le territoire.
        </p>

        <Controller
          name="kpis.kpisList"
          control={control}
          defaultValue={[{ name: "Nombre d'entreprises accompagnées", targetValue: 150, currentValue: 12, autoMeasure: true }]}
          render={({ field }) => {
            const list = field.value || [];
            const addKpi = () =>
              field.onChange([
                ...list,
                { name: "", targetValue: 100, currentValue: 0, autoMeasure: false },
              ]);
            const updateKpi = (idx: number, key: string, val: any) => {
              const updated = [...list];
              updated[idx] = { ...updated[idx], [key]: val };
              field.onChange(updated);
            };
            const removeKpi = (idx: number) => {
              field.onChange(list.filter((_: any, i: number) => i !== idx));
            };

            return (
              <div className="space-y-4">
                {list.map((kpi: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">INDICATEUR {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeKpi(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Nom du KPI</label>
                        <Input
                          value={kpi.name}
                          onChange={(e) => updateKpi(idx, "name", e.target.value)}
                          placeholder="ex. Taux de satisfaction client (%)"
                        />
                      </div>

                      {/* Auto measure telemetry */}
                      <div className="flex items-center space-x-2 pt-5">
                        <Checkbox
                          checked={kpi.autoMeasure}
                          onCheckedChange={(checked: any) => updateKpi(idx, "autoMeasure", !!checked)}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-200 font-semibold">
                          Mesure automatisée (Télémétrie API)
                        </span>
                      </div>

                      {/* Target Value */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Valeur cible (Target)</label>
                        <Input
                          type="number"
                          value={kpi.targetValue || ""}
                          onChange={(e) => updateKpi(idx, "targetValue", parseFloat(e.target.value) || 0)}
                          placeholder="ex. 95"
                        />
                      </div>

                      {/* Current Value */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Valeur actuelle</label>
                        <Input
                          type="number"
                          value={kpi.currentValue || ""}
                          onChange={(e) => updateKpi(idx, "currentValue", parseFloat(e.target.value) || 0)}
                          placeholder="ex. 40"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addKpi}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Ajouter un indicateur KPI
                </button>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
