// src/components/encode/steps/ResourcesStep.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const resourceTypes = [
  "Expert (Consultant / Coach)",
  "Dataset (Données territoriales)",
  "Infrastructure Cloud / Hébergement",
  "Modèle IA (LLM, Vision, RAG)",
  "API / Connecteur logiciel",
  "Laboratoire / Équipement physique",
  "Financement / Subsides directs",
];

export default function ResourcesStep() {
  const { control } = useFormContext();

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
          Ressources Requises (CPSV Resource)
        </h3>
        <p className="text-sm text-gray-500">
          Spécifiez les ressources technologiques, humaines et matérielles indispensables à la mise en œuvre de ce service.
        </p>

        <Controller
          name="resources.resourcesList"
          control={control}
          defaultValue={[{ type: "Expert (Consultant / Coach)", isMandatory: true, isShareable: true, costEstimate: 1500, availability: "Disponible" }]}
          render={({ field }) => {
            const list = field.value || [];
            const addResource = () =>
              field.onChange([
                ...list,
                { type: "Expert (Consultant / Coach)", isMandatory: true, isShareable: false, costEstimate: 0, availability: "Sur demande" },
              ]);
            const updateResource = (idx: number, key: string, val: any) => {
              const updated = [...list];
              updated[idx] = { ...updated[idx], [key]: val };
              field.onChange(updated);
            };
            const removeResource = (idx: number) => {
              field.onChange(list.filter((_: any, i: number) => i !== idx));
            };

            return (
              <div className="space-y-4">
                {list.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">RESSOURCE {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeResource(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Type of resource */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Type de ressource</label>
                        <Select
                          onValueChange={(val: string) => updateResource(idx, "type", val)}
                          defaultValue={item.type}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez la ressource" />
                          </SelectTrigger>
                          <SelectContent>
                            {resourceTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Availability */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Disponibilité</label>
                        <Input
                          value={item.availability}
                          onChange={(e) => updateResource(idx, "availability", e.target.value)}
                          placeholder="ex. Immédiate, Lu-Ve 8h-18h, Sous 48h"
                        />
                      </div>

                      {/* Cost estimate */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Estimation coût (€ HTVA)</label>
                        <Input
                          type="number"
                          value={item.costEstimate || ""}
                          onChange={(e) => updateResource(idx, "costEstimate", parseFloat(e.target.value) || 0)}
                          placeholder="ex. 500"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={item.isMandatory}
                            onCheckedChange={(checked: any) => updateResource(idx, "isMandatory", !!checked)}
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">Requis (Obligatoire)</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={item.isShareable}
                            onCheckedChange={(checked: any) => updateResource(idx, "isShareable", !!checked)}
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">Mutualisable</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addResource}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Ajouter une ressource
                </button>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}
